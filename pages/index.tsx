import { useState } from "react";

const categories = [
  { label: "Castle 🏰", keyword: "castle" },
  { label: "Battlefield ⚔️", keyword: "battlefield" },
  { label: "Space 🌌", keyword: "space" },
  { label: "Animals 🐔", keyword: "chicken" },
  { label: "Ancient Egypt 🐫", keyword: "egypt" }
];

export default function Home() {
  const [script, setScript] = useState("");
  const [keyword, setKeyword] = useState("castle");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  async function handleCreate() {
    setStatus("⏳ Generating video...");
    const res = await fetch("/api/create-final", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script, keyword })
    });
    const data = await res.json();
    if (!data.ok) return setStatus("❌ Error: " + data.error);
    setVideoUrl(data.url);
    setStatus("✅ Done!");
  }

  async function handleGenerateScript() {
    setStatus("✨ Writing script...");
    const res = await fetch("/api/gen-script", { method: "POST" });
    const data = await res.json();
    setScript(data.script);
    setStatus("Script ready. Edit if you want.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Weird Facts Shorts Maker</h1>

      <textarea
        className="w-full max-w-xl p-3 text-black rounded mb-4"
        rows={4}
        placeholder="Paste or generate a script (20–60s)"
        value={script}
        onChange={e => setScript(e.target.value)}
      />

      <button
        onClick={handleGenerateScript}
        className="bg-purple-600 px-4 py-2 rounded mb-4 hover:bg-purple-700"
      >
        ✨ Generate Script
      </button>

      <div className="grid grid-cols-2 gap-2 max-w-xl mb-4">
        {categories.map(c => (
          <button
            key={c.keyword}
            onClick={() => setKeyword(c.keyword)}
            className={`px-3 py-2 rounded ${
              keyword === c.keyword ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleCreate}
        className="bg-green-600 px-6 py-3 rounded font-bold hover:bg-green-700"
      >
        🚀 Make Video
      </button>

      <p className="mt-4">{status}</p>

      {videoUrl && (
        <div className="mt-4">
          <video
            src={videoUrl}
            controls
            className="rounded shadow-lg w-full max-w-xl"
          />
          <a
            href={videoUrl}
            download
            className="block text-center mt-2 underline text-blue-400"
          >
            ⬇️ Download MP4
          </a>
        </div>
      )}
    </div>
  );
}
