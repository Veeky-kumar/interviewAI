from documents import load_clean_documents
from chunking import chunk_document

docs = load_clean_documents()
resumes = [d for d in docs if d["type"] == "resume"]

print(f"Total resumes found: {len(resumes)}")

if resumes:
    first_resume_chunks = chunk_document(resumes[0])
    print(f"First resume chunks count: {len(first_resume_chunks)}")
    if first_resume_chunks:
        print("First chunk metadata:", first_resume_chunks[0]["metadata"])
else:
    print("No resumes found in documents.")
