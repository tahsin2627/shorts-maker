import type { NextApiRequest, NextApiResponse } from "next";
import Cloudinary from "cloudinary";
Cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { script } = req.body;
    // Call ElevenLabs (replace VOICE_ID if you have one)
    const elevenKey = process.env.ELEVENLABS_API_KEY!;
    const voiceId = process.env.ELEVEN_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // fallback
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: script })
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ ok:false, error: text.slice(0,300) });
    }
    const ab = await r.arrayBuffer();
    const base64 = Buffer.from(ab).toString('base64');
    const dataUri = "data:audio/mpeg;base64," + base64;

    const upload = await Cloudinary.v2.uploader.upload(dataUri, { resource_type: "auto", public_id: `tts_${Date.now()}` });
    return res.status(200).json({ ok:true, url: upload.secure_url });
  } catch(err:any) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
}
