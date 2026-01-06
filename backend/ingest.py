import pandas as pd
import os
import glob
from cleaning import clean_text

def ingest_and_clean_data():
    # Paths
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    jd_dir = os.path.join(base_path, 'data', 'job_descriptions')
    resume_dir = os.path.join(base_path, 'data', 'resumes')
    
    output_dir = os.path.join(base_path, 'data', 'cleaned')
    os.makedirs(output_dir, exist_ok=True)

    print("--- Cleaning Job Descriptions ---")
    jd_files = glob.glob(os.path.join(jd_dir, "*.csv"))
    if jd_files:
        df_list = []
        for file in jd_files:
            print(f"Loading {os.path.basename(file)}...")
            try:
                df = pd.read_csv(file, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(file, encoding='latin1')
            df_list.append(df)
        
        df_jd = pd.concat(df_list, ignore_index=True)
            
        # Remove any columns that are empty or named 'Unnamed: 0'
        df_jd = df_jd.loc[:, ~df_jd.columns.str.contains('^Unnamed')]
        if '' in df_jd.columns:
            df_jd = df_jd.drop('', axis=1)

        print(f"Original JD count (combined): {len(df_jd)}")
        
        # Clean the 'Job Description' column
        df_jd['Job Description'] = df_jd['Job Description'].apply(clean_text)
        
        # Remove empty descriptions
        df_jd = df_jd[df_jd['Job Description'].str.strip() != '']
        
        # Deduplicate
        df_jd = df_jd.drop_duplicates(subset=['Job Description'])
        
        # Add unique ID for RAG tracking
        df_jd.insert(0, "jd_id", range(len(df_jd)))
        
        print(f"Cleaned JD count: {len(df_jd)}")
        
        df_jd.to_csv(os.path.join(output_dir, 'job_descriptions_cleaned.csv'), index=False)
        print("Saved combined cleaned job descriptions.")
    else:
        print(f"No Job Description CSV files found in {jd_dir}")

    print("\n--- Cleaning Resumes ---")
    resume_files = glob.glob(os.path.join(resume_dir, "*.csv"))

    if resume_files:
        df_list = []
        for file in resume_files:
            print(f"Loading {os.path.basename(file)}...")
            try:
                df = pd.read_csv(file, encoding='utf-8')
            except UnicodeDecodeError:
                df = pd.read_csv(file, encoding='latin1')
            df_list.append(df)

        df_resume = pd.concat(df_list, ignore_index=True)

        # ✅ EXPLICITLY KEEP REQUIRED COLUMNS
        required_columns = ["Resume", "Category", "Name"]
        available_columns = [c for c in required_columns if c in df_resume.columns]
        df_resume = df_resume[available_columns]

        print(f"Original Resume count (combined): {len(df_resume)}")

        # Clean Resume text
        df_resume["Resume"] = df_resume["Resume"].apply(clean_text)

        # Remove empty resumes
        df_resume = df_resume[df_resume["Resume"].str.strip() != ""]

        # Deduplicate
        df_resume = df_resume.drop_duplicates(subset=["Resume"])

        # Add unique ID
        df_resume.insert(0, "resume_id", range(len(df_resume)))

        print(f"Cleaned Resume count: {len(df_resume)}")

        df_resume.to_csv(
            os.path.join(output_dir, "resumes_cleaned.csv"),
            index=False
        )

        print("Saved combined cleaned resumes.")
    else:
        print(f"No Resume CSV files found in {resume_dir}")


if __name__ == "__main__":
    ingest_and_clean_data()
