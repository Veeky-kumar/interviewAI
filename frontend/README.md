# Interview-AI Frontend

Live Demo  
https://interview-ai-git-main-veekys-projects.vercel.app/

Frontend for **Interview-AI**, an AI-powered hiring platform that uses RAG-based semantic search to match resumes with job descriptions, rank candidates, and assist recruiters in interview decisions.

---

## Overview

Interview-AI is designed to solve a real hiring problem:  
resume screening based on keywords instead of actual relevance.

This frontend focuses on recruiter workflows and integrates with a backend that uses embeddings, vector search, and LLMs.

---

## Features

- Recruiter/Admin can create job roles  
- Paste job descriptions directly in the dashboard  
- AI performs semantic (RAG-based) resume matching  
- Candidates are ranked with match scores  
- AI-generated explanation for each candidate (fit + gaps)  
- Candidate comparison view  
- Interview scheduling UI  
- Clean, modern, production-ready dashboard  

---

## Tech Stack

- React + TypeScript  
- Vite  
- Tailwind CSS  
- shadcn/ui  
- Lucide Icons  
- React Router  
- TanStack Query  

---

## Architecture

Frontend (React + Vite)  
→ REST APIs  
→ Backend (FastAPI)  
→ Embeddings + FAISS Vector Store + LLM  

Frontend is fully decoupled and scalable.

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE=http://localhost:8000
