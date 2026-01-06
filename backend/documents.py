import pandas as pd

def load_clean_documents():
    documents = []

    # -------- Load cleaned Job Descriptions --------
    jd_df = pd.read_csv("./data/cleaned/job_descriptions_cleaned.csv")

    for _, row in jd_df.iterrows():
        documents.append({
            "id": f"jd_{row['jd_id']}",
            "text": row["Job Description"],
            "metadata": {
                "doc_id": f"jd_{row['jd_id']}",
                "type": "job_description",
                "title": row.get("Job Title", "")
            }
        })

    # -------- Load cleaned Resumes --------
    resume_df = pd.read_csv("./data/cleaned/resumes_cleaned.csv")

    for _, row in resume_df.iterrows():
        documents.append({
            "id": f"resume_{row['resume_id']}",
            "text": row["Resume"],
            "metadata": {
                "doc_id": f"resume_{row['resume_id']}",
                "type": "resume",
                "name": row.get("Name", "Unknown Candidate"),
                "category": row.get("Category", "Unknown")
            }
        })

    return documents


if __name__ == "__main__":
    docs = load_clean_documents()
    print("Total documents:", len(docs))
    print(docs[-1])
