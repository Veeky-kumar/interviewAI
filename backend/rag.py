# retrival+llm
from embeddings import EmbeddingModel
from vector_store import VectorStore
from prompts import build_prompt
from llm import call_llm

class RAGPipeline:
    def __init__(self):
        self.embedder = EmbeddingModel()
        self.store = VectorStore(dim=384)
        self.store.load()

    def query(self, question: str, top_k: int = 5):
        # Step 1: embed query
        query_emb = self.embedder.embed_texts([question])[0]

        # Step 2: retrieve relevant chunks
        results = self.store.search(query_emb, top_k=top_k)

        # Step 3: build context
        context_blocks = []
        for r in results:
            meta = r["metadata"]
            block = f"""
Source: {meta['doc_id']} | Section: {meta['section']}
Content: {r['text']}
"""
            context_blocks.append(block)

        context = "\n".join(context_blocks)

        # Step 4: LLM answer
        prompt = build_prompt(context, question)
        answer = call_llm(prompt)

        return {
            "question": question,
            "answer": answer,
            "sources": results
        }
