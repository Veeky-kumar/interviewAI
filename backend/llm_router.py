import os

def get_llm_backend():
    use_bytez = os.getenv("USE_BYTEZ", "true").lower() == "true"

    if use_bytez:
        print("[LLM BACKEND] Using Bytez (hosted)")
        from backend.llm_bytez import call_llm
    else:
        print("[LLM BACKEND] Using Ollama (local)")
        from backend.llm_ollama import call_llm

    return call_llm

call_llm = get_llm_backend()
