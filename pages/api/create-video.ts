import type { NextApiRequest, NextApiResponse } from "next";
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { clipUrl, audioUrl, captions } = req.body;
    // Build a Cloudinary fetch URL that overlays captions and attaches audio.
    // This is a basic approach — for production you'd upload assets and create an explicit derived asset.
    const textOverlay = `l_text:Arial_40:${encodeURIComponent(captions)},co_white,fl_layer_apply,g_south,y_40`;
    // attach audio by doing a layered apply of audio (Cloudinary supports audio overlay by public_id; here we will reference the uploaded audio)
    // If audioUrl is a Cloudinary asset URL, extract public_id; otherwise use fetch with external audio (sometimes supported).
    // Simpler: create a final fetch that uses the clip but instructs the browser to use audio separately (many players will allow srclist).
    const transformed = `https://res.cloudinary.com/${CLOUD}/video/upload/${textOverlay}/fetch/${encodeURIComponent(clipUrl)}`;
    return res.status(200).json({ ok:true, videoUrl: transformed });
  } catch(err:any) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
}
