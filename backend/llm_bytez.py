import os
from bytez import Bytez

BYTEZ_API_KEY = os.getenv("BYTEZ_API_KEY")
if not BYTEZ_API_KEY:
    raise ValueError("BYTEZ_API_KEY not set")

sdk = Bytez(BYTEZ_API_KEY)

MODEL_NAME = "microsoft/Phi-3-mini-4k-instruct"

def _extract_text(output):
    """
    Normalize Bytez output into a plain string.
    """
    if isinstance(output, str):
        return output

    if isinstance(output, dict):
        # Common pattern: {"content": "..."}
        if "content" in output:
            return output["content"]
        # Sometimes nested
        if "text" in output:
            return output["text"]
        return str(output)

    if isinstance(output, list):
        texts = []
        for item in output:
            if isinstance(item, dict):
                texts.append(item.get("content", str(item)))
            else:
                texts.append(str(item))
        return "\n".join(texts)

    return str(output)


def call_llm(prompt: str) -> str:
    model = sdk.model(MODEL_NAME)

    response = model.run([
        {
            "role": "system",
            "content": "You are an AI hiring assistant helping evaluate resumes."
        },
        {
            "role": "user",
            "content": prompt
        }
    ])

    # Handle errors safely
    if hasattr(response, "error") and response.error:
        raise RuntimeError(response.error)

    if hasattr(response, "output"):
        text = _extract_text(response.output)
        return text.strip()

    # Absolute fallback
    return str(response).strip()
