import { useState, useEffect } from "react";
import { G } from "../styles";
import { supabase } from "../lib/supabase";

const BADGES = ["👑", "🥈", "🥉", "⭐", "🔥", "✦", "💫", "🌟", "⚡", "🎯"];

async function fetchLeaderboard() {
  const { data: listings } = await supabase
    .from("listings")
    .select("creator_username, sales, price");

  const map = {};
  (listings || []).forEach(l => {
    if (!l.creator_username) return;
    if (!map[l.creator_username]) map[l.creator_username] = { username: l.creator_username, sales: 0, volume: 0 };
    map[l.creator_username].sales += l.sales || 0;
    map[l.creator_username].volume += (l.sales || 0) * (l.price || 0);
  });

  return Object.values(map)
    .filter(u => u.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then(data => { setRows(data); setLoading(false); });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <div className="section-label" style={{ marginBottom: 12 }}>Monthly Rankings</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: G.ink, letterSpacing: -1, marginBottom: 8 }}>Leaderboard</h1>
      <p style={{ color: G.muted, fontSize: 14, marginBottom: 48 }}>Ranked by total sales volume · Top 3 win Amazon gift cards 🎁</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: G.muted, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: G.muted, fontSize: 14 }}>No sales yet. Sign up and start selling! 🚀</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {rows.map((u, i) => (
            <div key={u.username} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, border: i === 0 ? `1.5px solid ${G.accent}` : `1px solid ${G.border}` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, color: i === 0 ? G.accent : G.border, minWidth: 36 }}>{i + 1}</div>
              <div style={{ fontSize: 24 }}>{BADGES[i] || "🎖️"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: G.ink }}>@{u.username}</div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>{u.sales} {u.sales === 1 ? "sale" : "sales"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 17, color: i === 0 ? G.accent : G.ink }}>{u.volume.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: G.muted }}>PC volume</div>
              </div>
              {i < 3 && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: i === 0 ? "#d97706" : i === 1 ? "#64748b" : "#c2410c", background: i === 0 ? "#fef9c3" : i === 1 ? "#f1f5f9" : "#ffedd5", padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>
                  {i === 0 ? "$20" : i === 1 ? "$15" : "$10"} Amazon
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ background: G.accentLight, border: `1px solid #f0d0c0`, borderRadius: 12, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🎁</span>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: G.ink }}>Monthly Prize Pool</h3>
        </div>
        <p style={{ fontSize: 13, color: G.muted, marginBottom: 24 }}>The PixelCoins are fake. These prizes are <strong style={{ color: G.ink }}>very real.</strong> Amazon gift cards emailed to winners at the end of each month.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            ["👑 1st", "$20", "#fef9c3", "#d97706"],
            ["🥈 2nd", "$15", "#f1f5f9", "#64748b"],
            ["🥉 3rd", "$10", "#ffedd5", "#c2410c"],
          ].map(([rank, prize, bg, color]) => (
            <div key={rank} style={{ background: bg, border: `1px solid ${G.border}`, borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{rank}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color }}>{prize}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>Amazon gift card</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
