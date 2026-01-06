from embeddings import EmbeddingModel
from vector_store import VectorStore

embedder = EmbeddingModel()
store = VectorStore(dim=384)
store.load()

query = "Machine Learning Engineer skills Python deep learning"
query_emb = embedder.embed_texts([query])[0]

results = store.search(query_emb, top_k=3)

for r in results:
    print(r["metadata"]["doc_id"], r["metadata"]["section"])
    print(r["text"][:200])
    print("-" * 50)
