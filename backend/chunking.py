# Chunking logic
import re

RESUME_SECTIONS = [
    "Skills",
    "Education",
    "Experience",
    "Projects",
    "Tools",
    "Technologies",
    "Achievements",
    "Responsibilities",
    "Summary",
    "Profile"
]

JD_SECTIONS = [
    "Responsibilities",
    "Requirements",
    "Qualifications",
    "Basic Qualifications",
    "Preferred Qualifications",
    "Job Description"
]


def split_by_sections(text, section_headers):
    pattern = "(" + "|".join(section_headers) + ")"
    splits = re.split(pattern, text, flags=re.IGNORECASE)

    sections = []
    current_section = "General"

    for part in splits:
        part_clean = part.strip()
        if part_clean.lower() in [h.lower() for h in section_headers]:
            current_section = part_clean
        elif part_clean:
            sections.append({
                "section": current_section,
                "text": part_clean
            })

    return sections


def chunk_document(doc, chunk_size=500, overlap=100):
    chunks = []

    doc_type = doc["metadata"]["type"]

    if doc_type == "resume":
        sections = split_by_sections(doc["text"], RESUME_SECTIONS)
    else:
        sections = split_by_sections(doc["text"], JD_SECTIONS)

    for sec in sections:
        text = sec["text"]
        start = 0
        chunk_idx = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            chunks.append({
                "chunk_id": f"{doc['metadata']['doc_id']}_{sec['section']}_{chunk_idx}",
                "content": chunk_text,
                "metadata": {
                    # CORE IDs
                    "doc_id": doc["metadata"]["doc_id"],
                    "type": doc_type,

                    # IMPORTANT FIELDS (NOW PRESERVED)
                    "name": doc["metadata"].get("name"),
                    "category": doc["metadata"].get("category"),
                    "title": doc["metadata"].get("title"),

                    # SECTION INFO
                    "section": sec["section"]
                }
            })

            start += chunk_size - overlap
            chunk_idx += 1

    return chunks
