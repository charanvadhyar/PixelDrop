import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { G } from "../styles";
import { useApp } from "../context/AppContext";

export default function Nav() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) =>
    path === "/marketplace" ? pathname.startsWith("/marketplace") : pathname === path;

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { path: "/marketplace", label: "Marketplace" },
    { path: "/blog", label: "Blog" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,248,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: G.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>P</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: G.ink }}>PixelDrop</span>
        </div>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 24 }}>
          {navLinks.map(({ path, label }) => (
            <span key={path} className={`nav-link ${isActive(path) ? "active" : ""}`} onClick={() => navigate(path)}>{label}</span>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="nav-desktop-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

        {/* Mobile right: coins + hamburger */}
        <div className="nav-mobile-actions" style={{ display: "none", alignItems: "center", gap: 10 }} ref={menuRef}>
          {user && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: G.accent, fontWeight: 700, background: G.accentLight, padding: "4px 10px", borderRadius: 20, border: `1px solid #f0d0c0` }}>
              🪙 {user.coins}
            </div>
          )}
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5 }} aria-label="Menu">
            <span style={{ display: "block", width: 22, height: 2, background: G.ink, borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: G.ink, borderRadius: 2, transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: G.ink, borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div style={{ position: "absolute", top: 60, left: 0, right: 0, background: "white", borderBottom: `1px solid ${G.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", padding: "12px 0", zIndex: 200 }}>
              {navLinks.map(({ path, label }) => (
                <div key={path} onClick={() => navigate(path)} style={{ padding: "12px 24px", fontSize: 15, fontWeight: isActive(path) ? 700 : 400, color: isActive(path) ? G.accent : G.ink, cursor: "pointer", borderLeft: isActive(path) ? `3px solid ${G.accent}` : "3px solid transparent" }}>
                  {label}
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${G.border}`, margin: "8px 0" }} />
              {user ? (
                <>
                  <div style={{ padding: "8px 24px 4px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: G.ink }}>@{user.username}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{user.email}</div>
                  </div>
                  <div onClick={() => navigate("/create")} style={{ padding: "12px 24px", fontSize: 15, color: G.ink, cursor: "pointer" }}>⚡ Create & Sell</div>
                  <div onClick={async () => { await logout(); navigate("/"); }} style={{ padding: "12px 24px", fontSize: 15, color: "#ef4444", cursor: "pointer" }}>Log out</div>
                </>
              ) : (
                <>
                  <div onClick={() => navigate("/auth")} style={{ padding: "12px 24px", fontSize: 15, color: G.ink, cursor: "pointer" }}>Log in</div>
                  <div onClick={() => navigate("/auth")} style={{ padding: "12px 24px", fontSize: 15, fontWeight: 700, color: G.accent, cursor: "pointer" }}>Sign up free →</div>
                </>
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-actions { display: none !important; }
          .nav-mobile-actions { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
