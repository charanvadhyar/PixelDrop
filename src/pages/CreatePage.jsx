import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { G } from "../styles";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";

const TYPES = [
  { id: "IMAGE", label: "Image", emoji: "🖼️" },
  { id: "DOC",   label: "Document", emoji: "📄" },
  { id: "PDF",   label: "PDF", emoji: "📋" },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { user, authReady, maxPrice } = useApp();

  const [assetType, setAssetType] = useState("IMAGE");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Art");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!authReady) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const cfg = TYPES.find(t => t.id === assetType);

  const publish = async () => {
    if (!title || !price || !desc) return;
    setPublishing(true);
    setError("");

    try {
      const { error: err } = await supabase.from("listings").insert({
        title,
        description: desc,
        type: assetType,
        category,
        price: Number(price),
        emoji: cfg.emoji,
        content_url: null,
        content_text: null,
        creator_id: user.id,
        creator_username: user.username,
      });

      if (err) { setError(err.message || "Failed to publish. Try again."); return; }
      setDone(true);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setPublishing(false);
    }
  };

  const reset = () => {
    setTitle(""); setDesc(""); setPrice(""); setDone(false); setError("");
  };

  if (done) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <div className="card fade-up" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, marginBottom: 12 }}>Listing published!</h2>
          <p style={{ color: G.muted, fontSize: 15, marginBottom: 32 }}>"{title}" is now live in the marketplace.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/marketplace")}>Browse Marketplace</button>
            <button className="btn-outline" onClick={reset}>List Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <div className="section-label" style={{ marginBottom: 12 }}>New Listing</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: G.ink, marginBottom: 8, letterSpacing: -1 }}>List for sale</h1>
      <p style={{ color: G.muted, marginBottom: 36, fontSize: 14 }}>Create a listing in the marketplace. Buyers purchase with PixelCoins.</p>

      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

          <div>
            <label>Type</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {TYPES.map(({ id, label, emoji }) => (
                <button key={id} className={`type-btn ${assetType === id ? "active" : ""}`} onClick={() => setAssetType(id)}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give it a catchy, descriptive name…" />
          </div>

          <div>
            <label>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What do buyers get? Why is it valuable?" style={{ minHeight: 100 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Price (max {maxPrice} PC)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Math.min(maxPrice, Math.max(1, Number(e.target.value))))}
                placeholder="e.g. 150"
                min={1}
                max={maxPrice}
              />
            </div>
            <div>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {["Art", "Business", "Marketing", "Design"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15, opacity: (!title || !price || !desc || publishing) ? 0.6 : 1 }}
            onClick={publish}
            disabled={!title || !price || !desc || publishing}
          >
            {publishing ? "Publishing…" : "Publish Listing →"}
          </button>
        </div>
      </div>
    </div>
  );
}
