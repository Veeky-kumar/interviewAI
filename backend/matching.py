from backend.embeddings import EmbeddingModel
from backend.vector_store import VectorStore
from backend.llm_router import call_llm


class ResumeMatcher:
    def __init__(self):
        self.embedder = EmbeddingModel()
        self.store = VectorStore(dim=384)
        self.store.load()
        
    def match(self, job_id: str, job_description: str, top_k: int = 5):
        ranked = self.rank_resumes(job_description, top_k=top_k)

        results = []
        resume_ids = set()

        for item in ranked:
            resume_ids.add(item["resume_id"])

            explanation = self.explain_match(
                job_description,
                item["chunks"]
            )

            first_meta = item["chunks"][0]["metadata"]

            results.append({
                "resume_id": item["resume_id"],
                "category": first_meta.get("category", "Unknown"),
                "match_score": compute_match_score(
                    item["avg_score"],
                    item["count"]
                ),
                "matched_sections": list(
                    {c["metadata"]["section"] for c in item["chunks"]}
                ),
                "explanation": explanation
            })


        return {
            "job_id": job_id,
            "total_resumes_scanned": len(resume_ids),
            "top_matches": results
        }

    def rank_resumes(self, jd_text: str, top_k: int = 10):
        jd_embedding = self.embedder.embed_texts([jd_text])[0]

        results = self.store.search(
            jd_embedding,
            top_k=top_k * 5,
            filter_type="resume"
        )

        resume_groups = {}
        for r in results:
            resume_id = r["metadata"]["doc_id"]
            resume_groups.setdefault(resume_id, []).append(r)

        ranking_data = []
        for resume_id, chunks in resume_groups.items():
            scores = [c.get("score", 0) for c in chunks]

            # ✅ HARD CLAMP similarity to 0–1
            avg_score = max(0.0, min(sum(scores) / len(scores), 1.0))

            ranking_data.append({
                "resume_id": resume_id,
                "chunks": chunks,
                "count": len(chunks),
                "avg_score": avg_score,
                "rank_score": avg_score * len(chunks)
            })

        ranked = sorted(
            ranking_data,
            key=lambda x: x["rank_score"],
            reverse=True
        )

        return ranked[:top_k]

    def explain_match(self, jd_text: str, resume_chunks: list):
        context = ""
        for r in resume_chunks[:5]:
            context += (
                f"\nSection: {r['metadata'].get('section', 'General')}\n"
                f"Content: {r['text']}\n"
            )

        prompt = f"""
        You are an AI hiring assistant.

        Analyze the candidate against the job description and respond STRICTLY in the format below.

        Rules:
        - Be concise
        - Use short bullet points starting with "-" with new lines
        - Do NOT use bold text
        - Do NOT use markdown
        - Do NOT use headings
        - Plain text only 

        JOB DESCRIPTION:
        {jd_text}

        CANDIDATE RESUME:
        {context}

        RESPONSE FORMAT:

        Fit:
        - point
        - point

        Gaps:
        - point (if none, write "No major gaps")

        Recommendation:
        - Hire / Maybe / No-Hire (1 line reason)
        """

        return call_llm(prompt)


def compute_match_score(avg_score: float, count: int, max_chunks: int = 10):
    """
    avg_score: semantic similarity (0–1)
    count: number of matched chunks
    """
    coverage_score = min(count / max_chunks, 1.0)

    # ✅ weighted, bounded, stable
    final_score = (0.7 * avg_score) + (0.3 * coverage_score)

    return round(final_score * 100, 2)
