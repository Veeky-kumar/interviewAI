import re
import unicodedata

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    
    # Normalize unicode characters
    text = unicodedata.normalize("NFKD", text)

    # Specific fixes for common encoding artifacts in these datasets
    replacements = {
        "â€¢": "•",
        "â–ª": "▪",
        "âž”": "➢",
        "Ã¼": "ü",
        "âœ…": "✅",
        "âœ–": "✖",
        "ï‚·": "•",
        "â€“": "-",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove URLs
    text = re.sub(r'http\S+\s*', ' ', text)
    
    # Remove Emails
    text = re.sub(r'\S*@\S*\s?', ' ', text)
    
    # Remove Phone numbers (simple pattern)
    text = re.sub(r'\b\d{10}\b|\+\d{1,3}\s?\d{10}', ' ', text)

    # Remove extra whitespace and newlines
    text = re.sub(r'\s+', ' ', text)

    return text.strip()