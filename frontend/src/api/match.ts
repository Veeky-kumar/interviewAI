const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export interface MatchResponse {
  job_id: string;
  total_resumes_scanned: number;
  top_matches: {
    resume_id: string;
    match_score: number;
    matched_sections: string[];
    explanation: string;
  }[];
}

export async function runResumeMatch(
  jobId: string,
  jobDescription: string
): Promise<MatchResponse> {
  const res = await fetch(`${API_BASE_URL}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: jobId,
      job_description: jobDescription,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to run resume match");
  }

  return res.json();
}
