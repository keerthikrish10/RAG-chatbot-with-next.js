from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = FastAPI()

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
# ✅ Load Google Gemini API Key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Replace with your key or use env variable
genai.configure(api_key=GEMINI_API_KEY)

# Initialize FAISS index (L2 distance) with 384-dimension embeddings
index = faiss.IndexFlatL2(384)

# In-memory data storage
data_store = {}

# Pydantic models for structured API requests
class ScrapeRequest(BaseModel):
    url: str
    
class EmbeddingRequest(BaseModel):
    text: str

class QueryRequest(BaseModel):
    query: str

# ✅ Allow frontend (React) & Next.js backend
origins = [
    "http://localhost:3000",  # Next.js backend
    "http://localhost:3001",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CORS is enabled!"}

# 1️⃣ **Scrape Text from a URL**
@app.post("/scrape")
async def scrape(request: ScrapeRequest):
    try:
        response = requests.get(request.url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {e}")

    soup = BeautifulSoup(response.text, "html.parser")
    text = " ".join([p.text for p in soup.find_all("p")])

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found on the page.")
    vector = embedding_model.encode([text])  # Convert text to embedding
    index.add(np.array(vector))  # Add to FAISS index
    doc_id = len(data_store)
    data_store[doc_id] = text # Store text for retrieval
    print(data_store)
    return {"message": "Scraped and stored", "data": text}


# 3️⃣ **Retrieve Relevant Text from FAISS**
@app.post("/retrieve")
async def retrieve(request: QueryRequest):
    print("FAISS index size:", index.ntotal)

    if index.ntotal == 0:
        return {"best_match": "No data available for retrieval."}

    # ✅ Convert query to vector and search FAISS index
    query_vec = embedding_model.encode([request.query])
    _, indices = index.search(np.array(query_vec), 1)

    best_match = data_store.get(indices[0][0], "No relevant result found")

    if best_match == "No relevant result found":
        return {"query": request.query, "best_match": best_match, "gemini_response": "No relevant document found."}

    # ✅ Prepare input for Gemini API
    gemini_input = f"User Query: {request.query}\nRelevant Document: {best_match}\nProvide a helpful response based on the query and document."

    # ✅ Call Google Gemini API
    try:
        gemini_model = genai.GenerativeModel("gemini-pro")
        response = gemini_model.generate_content(gemini_input)
        
        # ✅ Ensure response is valid
        if not response or not response.text:
            raise HTTPException(status_code=500, detail="Gemini API returned an empty response.")
        
        gemini_response = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {e}")

    return {"query": request.query, "best_match": best_match, "gemini_response": gemini_response}

