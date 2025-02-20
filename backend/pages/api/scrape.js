export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");  // ✅ Allow all origins
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).end();  // ✅ Allow CORS preflight requests
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "No URL provided" });
  
      // ✅ Forward request to FastAPI backend
      const response = await fetch("http://localhost:8000/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
  
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");  // ✅ Allow CORS for this API
      res.status(200).json(data);
    } catch (error) {
      console.error("Error scraping:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  