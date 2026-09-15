"""Broker de autenticação à frente do Ollama — FastAPI.

Valida HMAC partilhada (X-Xkai-Proxy-Key) antes de encaminhar para Ollama.
Expõe endpoints compatíveis com API Ollama: /api/chat, /api/tags.

Executar:
    cd broker && ../.venv/bin/uvicorn broker:app --host 127.0.0.1 --port 5002
"""

from __future__ import annotations

import hmac
import time
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from config import BrokerConfig

config = BrokerConfig()

# Limites simples por IP (em memória).
_rate: dict[str, list[float]] = {}

app = FastAPI(title="XKaiChat Broker", version="1.0.0")


class ChatRequest(BaseModel):
    model: str = Field(default="")
    messages: list[dict[str, str]] = Field(default_factory=list)
    stream: bool = False
    options: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    model: str
    message: dict[str, str]
    done: bool


def _check_broker_key(x_xkai_proxy_key: str | None) -> None:
    if not config.broker_key:
        return
    if not x_xkai_proxy_key or not hmac.compare_digest(x_xkai_proxy_key, config.broker_key):
        raise HTTPException(status_code=401, detail="broker_key_invalida")


def _rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "0.0.0.0"
    now = time.monotonic()
    hits = [t for t in _rate.get(ip, []) if now - t < config.rate_window_seconds]
    if len(hits) >= config.rate_limit_per_ip:
        raise HTTPException(status_code=429, detail="rate_limit_atingido")
    hits.append(now)
    _rate[ip] = hits


async def _forward_to_ollama(payload: dict[str, Any]) -> dict[str, Any]:
    """Encaminha pedido para Ollama e devolve resposta JSON."""
    timeout = httpx.Timeout(config.llm_timeout, connect=5.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(f"{config.ollama_url}/api/chat", json=payload)
    resp.raise_for_status()
    return resp.json()


@app.get("/api/tags")
async def tags(
    request: Request,
    x_xkai_proxy_key: str | None = Header(default=None),
) -> dict[str, Any]:
    """Health/check modelos — compatível com Ollama /api/tags."""
    _check_broker_key(x_xkai_proxy_key)
    _rate_limit(request)

    timeout = httpx.Timeout(3.0, connect=2.0)
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(f"{config.ollama_url}/api/tags")
        resp.raise_for_status()
        return resp.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="ollama_indisponivel") from exc


@app.post("/api/chat")
async def chat(
    body: ChatRequest,
    request: Request,
    x_xkai_proxy_key: str | None = Header(default=None),
) -> dict[str, Any]:
    """Chat completion — valida HMAC, rate limit, encaminha para Ollama."""
    _check_broker_key(x_xkai_proxy_key)
    _rate_limit(request)

    if not body.messages:
        raise HTTPException(status_code=400, detail="mensagens_vazias")

    # Garante modelo configurado (ignora o que vem no request por segurança)
    payload = body.model_dump(exclude_none=True)
    payload["model"] = config.ollama_model
    payload["stream"] = False  # Broker v1 não faz streaming

    try:
        data = await _forward_to_ollama(payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="ollama_indisponivel") from exc

    # Normaliza resposta Ollama para formato esperado
    message = data.get("message", {})
    content = str(message.get("content", "")).strip()

    return {
        "model": config.ollama_model,
        "message": {"role": "assistant", "content": content},
        "done": True,
    }


@app.get("/api/health")
async def health(request: Request) -> dict:
    """Health do próprio Broker (sem auth — para monitorização)."""
    # Check Ollama connectivity
    timeout = httpx.Timeout(1.5, connect=1.5)
    upstream = "down"
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(f"{config.ollama_url}/api/tags")
        upstream = "ok" if resp.status_code < 400 else "down"
    except httpx.HTTPError:
        upstream = "down"

    return {
        "status": "ok",
        "model": config.ollama_model,
        "upstream": upstream,
    }


@app.exception_handler(HTTPException)
async def _http_exc_handler(_request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=config.host, port=config.port)