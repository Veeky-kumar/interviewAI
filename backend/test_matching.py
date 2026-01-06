import pandas as pd
from matching import ResumeMatcher

print("Loading JD...")
jd_df = pd.read_csv("data/cleaned/job_descriptions_cleaned.csv")
jd_text = jd_df.iloc[0]["Job Description"]

print("Initializing matcher...")
matcher = ResumeMatcher()

print("Ranking resumes...")
ranked_resumes = matcher.rank_resumes(jd_text, top_k=5)

print("\n===== MATCHING RESULTS =====")

for i, result in enumerate(ranked_resumes, start=1):
    resume_id = result["resume_id"]
    chunks = result["chunks"]
    score = round(min(len(chunks) * 10, 100), 2)

    print(f"\n{i}. Resume ID: {resume_id}")
    print(f"   Match Score: {score}%")
    print(f"   Matched Sections:")

    for c in chunks[:3]:
        print(f"    - {c['metadata']['section']}")

    print("\n   Explanation:")
    explanation = matcher.explain_match(jd_text, chunks)
    print(explanation)

