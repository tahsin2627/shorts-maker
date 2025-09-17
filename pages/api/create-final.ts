import type { NextApiRequest, NextApiResponse } from "next";
import Cloudinary from "cloudinary";

Cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { script, keyword } = req.body;

    // Step 1: get TTS audio
    const ttsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script })
    });
    const tts = await ttsRes.json();
    if (!tts.ok) return res.status(500).json({ ok:false, error: "TTS failed" });

    // Step 2: search stock video
    const px = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search-pexels?q=${keyword}`);
    const data = await px.json();
    const clip = data.videos?.[0]?.video_files?.[0]?.link;
    if (!clip) return res.status(500).json({ ok:false, error: "No clip found" });

    // Step 3: Upload stock video to Cloudinary
    const uploadClip = await Cloudinary.v2.uploader.upload(clip, {
      resource_type: "video",
      public_id: `clip_${Date.now()}`
    });

    // Step 4: Combine video + audio + captions
    const final = await Cloudinary.v2.uploader.explicit(uploadClip.public_id, {
      resource_type: "video",
      type: "upload",
      eager: [
        {
          transformation: [
            { overlay: `video:${tts.public_id}`, flags: "layer_apply" },
            { overlay: { font_family: "Arial", font_size: 40, text: script }, gravity: "south", y: 40, color: "#ffffff" }
          ]
        }
      ]
    });

    const url = final.eager[0].secure_url;
    res.status(200).json({ ok:true, url });
  } catch(err:any) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
}
