export default async function handler(req, res) {
  // ✅ Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");  // Allow all origins or use "http://localhost:3001"
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();  // End OPTIONS request
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    // ✅ Forward request to FastAPI backend
    const response = await fetch("http://localhost:8000/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    // ✅ Check if FastAPI response is valid JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid JSON response from FastAPI");
    }

    const data = await response.json();

    if (!data.gemini_response) {
      return res.status(500).json({ error: "Invalid response from backend" });
    }

    // ✅ Set CORS headers for response
    res.setHeader("Access-Control-Allow-Origin", "*");  // Allow requests from any domain
    res.status(200).json({ best_match: data.gemini_response });
  } catch (error) {
    console.error("Error in retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
