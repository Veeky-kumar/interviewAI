from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ok",
        "llm_backend": "bytez" if os.getenv("USE_BYTEZ", "true") == "true" else "ollama"
    }
