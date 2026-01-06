# Resume RAG System

A Retrieval-Augmented Generation (RAG) system for intelligent resume matching and ranking based on job descriptions.

## Features

- **Resume Chunking**: Intelligently segments resumes into meaningful sections
- **Vector Search**: Uses FAISS for efficient similarity search
- **Semantic Matching**: Leverages sentence-transformers for embedding generation
- **LLM Explanations**: Provides AI-powered explanations for candidate matches using HuggingFace models

## Project Structure

```
Resume-rag/
├── backend/
│   ├── build_index.py          # Builds FAISS index from resumes
│   ├── chunking.py             # Resume chunking logic
│   ├── cleaning.py             # Text cleaning utilities
│   ├── documents.py            # Document handling
│   ├── embeddings.py           # Embedding model wrapper
│   ├── generate_resumes.py     # Resume data generation
│   ├── ingest.py               # Data ingestion pipeline
│   ├── llm.py                  # LLM integration (HuggingFace)
│   ├── matching.py             # Resume matching and ranking
│   ├── rag.py                  # RAG implementation
│   ├── vector_store.py         # FAISS vector store wrapper
│   ├── test_matching.py        # Test resume matching
│   ├── test_resume_chunking.py # Test chunking functionality
│   └── test_search.py          # Test search functionality
├── data/                       # Data directory
├── .env                        # Environment variables (HF_API_KEY)
├── .gitignore                  # Git ignore patterns
└── requirements.txt            # Python dependencies
```

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the project root:

```
HF_API_KEY=your_huggingface_api_token_here
```

Get your HuggingFace API token from: https://huggingface.co/settings/tokens

### 3. Generate Resume Data (Optional)

```bash
python backend/generate_resumes.py
```

### 4. Build the Index

```bash
python backend/build_index.py
```

## Usage

### Test Resume Matching

```bash
python backend/test_matching.py
```

This will:
1. Load a job description from your dataset
2. Rank resumes based on relevance
3. Generate AI-powered explanations for top matches

### Test Chunking

```bash
python backend/test_resume_chunking.py
```

### Test Search

```bash
python backend/test_search.py
```

## How It Works

1. **Ingestion**: Resumes are loaded and cleaned
2. **Chunking**: Documents are split into semantic sections
3. **Embedding**: Text is converted to vector embeddings using `all-MiniLM-L6-v2`
4. **Indexing**: Vectors are stored in a FAISS index for fast retrieval
5. **Matching**: Job descriptions are embedded and used to query the index
6. **Ranking**: Results are ranked by similarity and chunk count
7. **Explanation**: LLM generates human-readable match explanations

## Models Used

- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)
- **LLM**: Automatically tries multiple HuggingFace models:
  - Qwen/Qwen2.5-3B-Instruct
  - google/flan-t5-base
  - HuggingFaceH4/zephyr-7b-beta
  - tiiuae/falcon-7b-instruct

## Dependencies

- `pandas` - Data manipulation
- `numpy` - Numerical operations
- `sentence-transformers` - Text embeddings
- `faiss-cpu` - Vector similarity search
- `scikit-learn` - ML utilities
- `requests` - HTTP requests for API calls
- `python-dotenv` - Environment variable management
- `nltk` - Natural language processing

## License

MIT License

## Contributing

Feel free to open issues or submit pull requests!
