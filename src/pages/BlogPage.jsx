import { useState } from "react";
import { G } from "../styles";
import { BLOG } from "../data";
import { useApp } from "../context/AppContext";

export default function BlogPage() {
  const { adSlots } = useApp();
  const [selected, setSelected] = useState(null);
  const blogAd = adSlots.find(a => a.active && a.position === "Blog Header");

  if (selected) return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <button className="btn-ghost" onClick={() => setSelected(null)} style={{ marginBottom: 28 }}>← All Articles</button>
      <span className="tag-accent" style={{ marginBottom: 16, display: "inline-block" }}>{selected.category}</span>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: G.ink, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>{selected.title}</h1>
      <div style={{ fontSize: 13, color: G.muted, fontFamily: "'DM Mono', monospace", marginBottom: 40 }}>@{selected.author} · {selected.date} · {selected.reads.toLocaleString()} reads</div>
      <div style={{ fontSize: 16, color: "#3a3530", lineHeight: 1.9, borderTop: `1px solid ${G.border}`, paddingTop: 36 }}>
        <p style={{ marginBottom: 20 }}>{selected.body}</p>
        <p>The marketplace rewards consistency. Show up every day with your three generations, craft your listings with intention, and study what sells. Your leaderboard rank is a lagging indicator of the work you put in today.</p>
        <p style={{ marginTop: 20 }}>The top earners on PixelDrop share one trait: they treat this like a business, not a hobby. Your AI generates the raw material — your judgment, creativity, and salesmanship turn it into income.</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      {blogAd && (
        <div style={{ background: G.accentLight, border: `1px solid #f0d0c0`, borderRadius: 8, padding: "12px 20px", marginBottom: 36, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: G.accent }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1, background: G.accent, color: "white", padding: "2px 6px", borderRadius: 3 }}>AD</span>
          {blogAd.content}
        </div>
      )}
      <div className="section-label" style={{ marginBottom: 12 }}>Sales Academy</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: G.ink, letterSpacing: -1, marginBottom: 48 }}>Learn to sell smarter</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {BLOG.map(post => (
          <div key={post.id} className="card" style={{ padding: 28, cursor: "pointer" }} onClick={() => setSelected(post)}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{post.emoji}</div>
            <span className="tag-accent" style={{ marginBottom: 12, display: "inline-block" }}>{post.category}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: G.ink, lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h3>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6, marginBottom: 18 }}>{post.body.slice(0, 110)}…</p>
            <div style={{ fontSize: 12, color: G.muted, fontFamily: "'DM Mono', monospace", borderTop: `1px solid ${G.border}`, paddingTop: 14 }}>@{post.author} · {post.date} · {post.reads.toLocaleString()} reads</div>
          </div>
        ))}
        <div className="card" style={{ padding: 28, border: `1.5px dashed ${G.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", minHeight: 220 }} onClick={() => alert("Blog editor coming soon!")}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✍️</div>
          <div style={{ fontWeight: 600, color: G.ink, marginBottom: 6 }}>Write an Article</div>
          <div style={{ color: G.muted, fontSize: 13 }}>Share your selling techniques with the community</div>
        </div>
      </div>
    </div>
  );
}
