"""Configuração do Broker lida de .env / ambiente."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_BASE = Path(__file__).parent
load_dotenv(_BASE / ".env")


def _float(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name, default))
    except ValueError:
        return default


@dataclass
class BrokerConfig:
    host: str = os.environ.get("BROKER_HOST", "127.0.0.1")
    port: int = int(os.environ.get("BROKER_PORT", "5002"))
    broker_key: str = os.environ.get("BROKER_KEY", "")

    ollama_url: str = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
    ollama_model: str = os.environ.get("OLLAMA_MODEL", "qwen3:8b")
    temperature: float = _float("OLLAMA_TEMPERATURE", 0.3)
    llm_timeout: float = _float("LLM_TIMEOUT", 150.0)

    rate_limit_per_ip: int = int(os.environ.get("RATE_LIMIT_PER_IP", "20"))
    rate_window_seconds: int = int(os.environ.get("RATE_WINDOW_SECONDS", "60"))

    debug: bool = os.environ.get("BROKER_DEBUG", "0") == "1"