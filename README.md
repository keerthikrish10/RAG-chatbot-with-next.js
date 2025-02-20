Tech Stack
Your project uses the following technologies:

Backend (FastAPI + FAISS + Gemini API)
FastAPI – Backend framework for API development.
FAISS – Vector database for similarity search.
SentenceTransformers – Converts text into embeddings.
Google Gemini API – AI-powered responses.
BeautifulSoup – Web scraping to extract text.
Requests – Fetches web pages for scraping.
Uvicorn – ASGI server to run FastAPI.
Python-Dotenv – Loads environment variables.
Frontend (React + Next.js)
React.js – Frontend UI.
Next.js – API routes and backend integration.
Fetch API – Calls backend endpoints.
Deployment & DevOps
Docker (Optional) – For containerized deployment.
GitHub – Version control & project hosting.
Postman / Curl – API testing.

# 🚀 AI-Powered Chatbot with FastAPI, FAISS & Gemini API

An intelligent chatbot that scrapes web data, stores embeddings in FAISS, and generates AI-driven responses using Google's Gemini API.

## 🌟 Features
✅ Web Scraping with BeautifulSoup  
✅ Vector Search using FAISS  
✅ AI-generated responses via Gemini API  
✅ Next.js API integration  
✅ React.js Chat UI  

## 🛠️ Tech Stack
- **Backend:** FastAPI, FAISS, SentenceTransformers, Google Generative AI
- **Frontend:** React.js, Next.js
- **Others:** Uvicorn, Python-Dotenv, Requests, BeautifulSoup

## 🚀 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo
cd scraper
pip install -r requirements.txt
GEMINI_API_KEY=your_google_gemini_api_key_here
uvicorn main:app --reload
cd backend
npm install
npm run dev
cd frontend
npm install
npm start
