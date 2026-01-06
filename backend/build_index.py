from documents import load_clean_documents
from chunking import chunk_document
from embeddings import EmbeddingModel
from vector_store import VectorStore

print("Loading documents...")
documents = load_clean_documents()

print("Chunking documents...")
all_chunks = []
for doc in documents:
    all_chunks.extend(chunk_document(doc))

texts = [chunk["content"] for chunk in all_chunks]
metadata = [chunk["metadata"] for chunk in all_chunks]

print(f"Total chunks: {len(texts)}")

print("Generating embeddings...")
embedder = EmbeddingModel()
embeddings = embedder.embed_texts(texts)

print("Building FAISS index...")
store = VectorStore(dim=len(embeddings[0]))
store.add(embeddings, texts, metadata)

store.save()
print("FAISS index saved successfully.")
