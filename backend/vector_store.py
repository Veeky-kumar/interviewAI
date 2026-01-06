# faiss index
import faiss
import numpy as np
import pickle
import os

class VectorStore:
    def __init__(self, dim):
        self.index = faiss.IndexFlatIP(dim)  # cosine similarity
        self.texts = []
        self.metadata = []

    def add(self, embeddings, texts, metadata):
        embeddings = np.array(embeddings).astype("float32")
        self.index.add(embeddings)
        self.texts.extend(texts)
        self.metadata.extend(metadata)

    def search(self, query_embedding, top_k=10, filter_type=None):
        query_embedding = np.array([query_embedding]).astype("float32")
        
        # If we have a filter, we need to search much deeper to find enough candidates
        # of the specific type, as the top results might be dominated by one type.
        search_k = top_k * 20 if filter_type else top_k * 2
        
        # Cap search_k to avoid excessive overhead, but keep it large enough
        search_k = min(max(search_k, 500), len(self.metadata))

        scores, indices = self.index.search(query_embedding, search_k)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1: continue # FAISS returns -1 if not enough neighbors found
            
            meta = self.metadata[idx]
            if filter_type and meta["type"] != filter_type:
                continue

            results.append({
                "text": self.texts[idx],
                "metadata": meta,
                "score": float(scores[0][i])
            })

            if len(results) >= top_k:
                break

        return results


    def save(self, path="data/faiss_index"):
        os.makedirs(path, exist_ok=True)
        faiss.write_index(self.index, f"{path}/index.bin")
        with open(f"{path}/store.pkl", "wb") as f:
            pickle.dump((self.texts, self.metadata), f)

    def load(self, path="data/faiss_index"):
        self.index = faiss.read_index(f"{path}/index.bin")
        with open(f"{path}/store.pkl", "rb") as f:
            self.texts, self.metadata = pickle.load(f)
