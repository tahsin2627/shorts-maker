import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || "nature");
  const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=5`, {
    headers: { Authorization: process.env.PEXELS_API_KEY || "" }
  });
  const data = await r.json();
  res.status(200).json(data);
}
