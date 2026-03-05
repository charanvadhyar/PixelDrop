import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { G } from "../styles";
import { useApp } from "../context/AppContext";

export default function Nav() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dropOpen, setDropOpen] = useState(false);

  const isActive = (path) =>
    path === "/marketplace" ? pathname.startsWith("/marketplace") : pathname === path;

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,248,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: G.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>P</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: G.ink }}>PixelDrop</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <span className={`nav-link ${isActive("/marketplace") ? "active" : ""}`} onClick={() => navigate("/marketplace")}>Marketplace</span>
            <span className={`nav-link ${isActive("/blog") ? "active" : ""}`} onClick={() => navigate("/blog")}>Blog</span>
            <span className={`nav-link ${isActive("/leaderboard") ? "active" : ""}`} onClick={() => navigate("/leaderboard")}>Leaderboard</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: G.accent, fontWeight: 700, background: G.accentLight, padding: "5px 12px", borderRadius: 20, border: `1px solid #f0d0c0` }}>
                🪙 {user.coins}
              </div>
              <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => navigate("/create")}>+ Create & Sell</button>
              <div style={{ position: "relative" }}>
                <div onClick={() => setDropOpen(o => !o)} style={{ width: 34, height: 34, borderRadius: "50%", background: G.ink, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, cursor: "pointer", border: `2px solid ${G.border}`, fontFamily: "'DM Mono', monospace" }}>
                  {user.username[0].toUpperCase()}
                </div>
                {dropOpen && (
                  <div style={{ position: "absolute", right: 0, top: 42, background: "white", border: `1px solid ${G.border}`, borderRadius: 10, padding: 8, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 200 }}>
                    <div style={{ padding: "8px 12px 6px", borderBottom: `1px solid ${G.border}`, marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: G.ink }}>@{user.username}</div>
                      <div style={{ fontSize: 11, color: G.muted }}>{user.email}</div>
                    </div>
                    <div onClick={() => { setDropOpen(false); navigate("/leaderboard"); }} style={{ padding: "8px 12px", fontSize: 13, color: G.ink, cursor: "pointer", borderRadius: 6 }} onMouseEnter={e => e.target.style.background=G.tag} onMouseLeave={e => e.target.style.background="transparent"}>🏆 My Rank {user.rank ? `#${user.rank}` : "—"}</div>
                    <div onClick={() => { setDropOpen(false); navigate("/create"); }} style={{ padding: "8px 12px", fontSize: 13, color: G.ink, cursor: "pointer", borderRadius: 6 }} onMouseEnter={e => e.target.style.background=G.tag} onMouseLeave={e => e.target.style.background="transparent"}>⚡ Create</div>
                    <div style={{ borderTop: `1px solid ${G.border}`, marginTop: 4, paddingTop: 4 }}>
                      <div onClick={async () => { setDropOpen(false); await logout(); navigate("/"); }} style={{ padding: "8px 12px", fontSize: 13, color: "#ef4444", cursor: "pointer", borderRadius: 6 }} onMouseEnter={e => e.target.style.background="#fef2f2"} onMouseLeave={e => e.target.style.background="transparent"}>Log out</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate("/auth")}>Log in</button>
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => navigate("/auth")}>Sign up free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
