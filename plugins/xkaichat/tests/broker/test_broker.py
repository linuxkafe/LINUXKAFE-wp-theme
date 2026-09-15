"""Testes do Broker (FastAPI, LLM mockado)."""

import pytest
from fastapi.testclient import TestClient

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "broker"))

import broker as appmod

SHARED_KEY = "test-broker-key"
HEADERS = {"X-Xkai-Proxy-Key": SHARED_KEY}


@pytest.fixture(autouse=True)
def _config_broker_key():
    """Configura chave partilhada para testes de auth."""
    original = appmod.config.broker_key
    appmod.config.broker_key = SHARED_KEY
    yield
    appmod.config.broker_key = original


@pytest.fixture()
def client():
    with TestClient(appmod.app) as c:
        yield c


@pytest.fixture(autouse=True)
def _limpa_estado():
    yield
    appmod._rate.clear()


def test_health_sem_auth(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "model" in data
    assert data["upstream"] in ("ok", "down")


def test_tags_sem_chave(client):
    r = client.get("/api/tags")
    assert r.status_code == 401


def test_tags_com_chave_invalida(client):
    r = client.get("/api/tags", headers={"X-Xkai-Proxy-Key": "errada"})
    assert r.status_code == 401


def test_chat_sem_chave(client):
    r = client.post("/api/chat", json={"messages": [{"role": "user", "content": "oi"}]})
    assert r.status_code == 401


def test_chat_mensagens_vazias(client):
    r = client.post("/api/chat", json={"messages": []}, headers=HEADERS)
    assert r.status_code == 400


def test_chat_encaminha_para_ollama(monkeypatch, client):
    """Verifica que o broker encaminha para Ollama e devolve resposta normalizada."""
    chamadas = []

    async def fake_forward(payload):
        chamadas.append(payload)
        return {
            "model": "qwen3:8b",
            "message": {"role": "assistant", "content": "Resposta do Ollama"},
            "done": True,
        }

    monkeypatch.setattr(appmod, "_forward_to_ollama", fake_forward)

    r = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "Quanto custa o pão?"}]},
        headers=HEADERS,
    )
    assert r.status_code == 200
    data = r.json()
    assert data["model"] == "qwen3:8b"
    assert data["message"]["content"] == "Resposta do Ollama"
    assert data["done"] is True
    assert len(chamadas) == 1
    # Verifica que o modelo forçado é o do config
    assert chamadas[0]["model"] == "qwen3:8b"
    assert chamadas[0]["stream"] is False


def test_rate_limit(monkeypatch, client):
    monkeypatch.setattr(appmod.config, "rate_limit_per_ip", 2)

    async def fake_forward(payload):
        return {
            "model": "qwen3:8b",
            "message": {"role": "assistant", "content": "oi"},
            "done": True,
        }

    monkeypatch.setattr(appmod, "_forward_to_ollama", fake_forward)

    assert client.post("/api/chat", json={"messages": [{"role": "user", "content": "a"}]}, headers=HEADERS).status_code == 200
    assert client.post("/api/chat", json={"messages": [{"role": "user", "content": "b"}]}, headers=HEADERS).status_code == 200
    assert client.post("/api/chat", json={"messages": [{"role": "user", "content": "c"}]}, headers=HEADERS).status_code == 429


def test_broker_ignora_modelo_do_request(monkeypatch, client):
    """Broker deve forçar o modelo configurado, ignorando o que vem no request."""
    async def fake_forward(payload):
        return {
            "model": payload.get("model", ""),
            "message": {"role": "assistant", "content": "ok"},
            "done": True,
        }

    monkeypatch.setattr(appmod, "_forward_to_ollama", fake_forward)

    r = client.post(
        "/api/chat",
        json={"model": "outro-modelo", "messages": [{"role": "user", "content": "teste"}]},
        headers=HEADERS,
    )
    assert r.status_code == 200
    assert r.json()["model"] == "qwen3:8b"  # modelo do config, não do request