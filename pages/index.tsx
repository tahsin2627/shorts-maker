import { useState } from "react";

export default function Home() {
  const [script, setScript] = useState("");
  const [keyword, setKeyword] = useState("castle");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  async function handleCreate() {
    setStatus("Generating TTS...");
    const tts = await fetch("/api/generate-tts", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ script })
    }).then(r=>r.json());
    if (!tts.ok) return setStatus("TTS error: "+tts.error);

    setStatus("Searching stock video...");
    const res = await fetch(`/api/search-pexels?q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    const clip = data.videos?.[0]?.video_files?.[0]?.link;
    if (!clip) return setStatus("No clip found for: "+keyword);

    setStatus("Building video (Cloudinary)...");
    const build = await fetch("/api/create-video", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ clipUrl: clip, audioUrl: tts.url, captions: script })
    }).then(r=>r.json());
    if (!build.ok) return setStatus("Build failed: "+build.error);
    setVideoUrl(build.videoUrl);
    setStatus("Done — preview below");
  }

  return (
    <div style={{padding:16, maxWidth:720, margin:"0 auto"}}>
      <h2>Shorts Maker (Weird Facts)</h2>
      <textarea value={script} onChange={e=>setScript(e.target.value)} placeholder="Paste script (20-60s)" rows={4} style={{width:"100%"}}/>
      <div style={{marginTop:8}}>
        <input value={keyword} onChange={e=>setKeyword(e.target.value)} />
        <button onClick={handleCreate} style={{marginLeft:8}}>Make video</button>
      </div>
      <p>{status}</p>
      {videoUrl && <video src={videoUrl} controls style={{width:"100%", maxWidth:480}} />}
    </div>
  );
}
