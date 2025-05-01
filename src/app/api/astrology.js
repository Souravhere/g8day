// pages/api/astrology.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const response = await fetch("https://json.freeastrologyapi.com/planets/extended", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ASTRO_API_KEY,
        },
        body: JSON.stringify(req.body),
      });
  
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("Astrology API error:", err);
      return res.status(500).json({ error: "Failed to fetch astrological data" });
    }
  }
  