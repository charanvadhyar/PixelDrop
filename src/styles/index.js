export const G = {
  bg: "#fafaf8",
  card: "#ffffff",
  border: "#e8e4df",
  text: "#1a1714",
  muted: "#8a8480",
  accent: "#d4501a",
  accentLight: "#fdf0eb",
  accentDark: "#b03d12",
  ink: "#2d2926",
  tag: "#f0ece8",
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.bg}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 4px; }

  .btn-primary {
    background: ${G.accent};
    color: white;
    border: none;
    padding: 13px 28px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.3px;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { background: ${G.accentDark}; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212,80,26,0.25); }

  .btn-outline {
    background: transparent;
    color: ${G.ink};
    border: 1.5px solid ${G.border};
    padding: 12px 26px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-outline:hover { border-color: ${G.accent}; color: ${G.accent}; }

  .btn-ghost {
    background: transparent;
    color: ${G.muted};
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .btn-ghost:hover { background: ${G.tag}; color: ${G.ink}; }

  .card {
    background: ${G.card};
    border: 1px solid ${G.border};
    border-radius: 12px;
    transition: all 0.2s;
  }
  .card:hover { box-shadow: 0 8px 32px rgba(26,23,20,0.08); border-color: #d0cbc5; }

  .card-listing {
    background: ${G.card};
    border: 1px solid ${G.border};
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }
  .card-listing:hover { box-shadow: 0 12px 40px rgba(26,23,20,0.10); transform: translateY(-3px); border-color: #ccc; }

  .nav-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: ${G.muted};
    cursor: pointer;
    padding: 6px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    text-decoration: none;
  }
  .nav-link:hover, .nav-link.active { color: ${G.ink}; border-color: ${G.accent}; }

  input, textarea, select {
    background: ${G.bg};
    border: 1.5px solid ${G.border};
    color: ${G.text};
    border-radius: 8px;
    padding: 11px 14px;
    font-size: 14px;
    width: 100%;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s;
  }
  input:focus, textarea:focus, select:focus { border-color: ${G.accent}; background: white; }
  textarea { resize: vertical; min-height: 100px; }
  label { font-size: 12px; font-weight: 600; color: ${G.muted}; letter-spacing: 0.5px; text-transform: uppercase; display: block; margin-bottom: 6px; }

  .tag { background: ${G.tag}; color: ${G.muted}; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-family: 'DM Mono', monospace; font-weight: 500; display: inline-block; }
  .tag-accent { background: ${G.accentLight}; color: ${G.accent}; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-family: 'DM Mono', monospace; font-weight: 500; display: inline-block; }

  .filter-pill {
    padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1.5px solid ${G.border}; background: white; color: ${G.muted};
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .filter-pill:hover { border-color: ${G.accent}; color: ${G.accent}; }
  .filter-pill.active { background: ${G.accent}; border-color: ${G.accent}; color: white; }

  .admin-tab {
    padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: ${G.muted};
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .admin-tab:hover { background: ${G.tag}; color: ${G.ink}; }
  .admin-tab.active { background: ${G.accentLight}; color: ${G.accent}; font-weight: 600; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.1s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.2s; }

  .hero-pattern {
    background-image: radial-gradient(circle, #e8e4df 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .stat-card { text-align: center; padding: 24px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(26,23,20,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px; backdrop-filter: blur(4px);
  }
  .modal-box {
    background: white; border-radius: 16px; padding: 36px;
    width: 100%; max-width: 500px; border: 1px solid ${G.border};
    max-height: 90vh; overflow-y: auto;
  }

  .type-btn {
    flex: 1; padding: 14px 10px; border-radius: 8px;
    border: 1.5px solid ${G.border}; background: white;
    cursor: pointer; text-align: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: ${G.muted};
    transition: all 0.15s;
  }
  .type-btn:hover { border-color: ${G.accent}; color: ${G.accent}; }
  .type-btn.active { border-color: ${G.accent}; background: ${G.accentLight}; color: ${G.accent}; }

  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: ${G.accent};
    font-family: 'DM Mono', monospace;
  }

  /* ── Goofy / landing styles (also used by AuthPage) ── */
  @keyframes wiggle { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-8deg)} 40%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 80%{transform:rotate(5deg)} }
  @keyframes float { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
  @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(3deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
  @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes spin-slow { to{transform:rotate(360deg)} }
  @keyframes bloop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes rainbow { 0%{color:#d4501a} 20%{color:#e6b800} 40%{color:#16a34a} 60%{color:#2563eb} 80%{color:#9333ea} 100%{color:#d4501a} }
  @keyframes authPop { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .wiggle { animation: wiggle 0.6s ease; }
  .float-1 { animation: float 4s ease-in-out infinite; }
  .float-2 { animation: float2 5s ease-in-out infinite; animation-delay: -1.5s; }
  .float-3 { animation: float3 3.5s ease-in-out infinite; animation-delay: -0.8s; }
  .bloop { animation: bloop 2s ease-in-out infinite; }
  .spin-slow { animation: spin-slow 12s linear infinite; }
  .rainbow-text { animation: rainbow 3s linear infinite; }
  .marquee-track { display:flex; gap:48px; animation: marquee 20s linear infinite; white-space:nowrap; }
  .goofy-card { border: 3px solid ${G.ink}; border-radius: 16px; background: white; box-shadow: 5px 5px 0px ${G.ink}; transition: all 0.15s; cursor: pointer; }
  .goofy-card:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0px ${G.ink}; }
  .goofy-btn { background: ${G.ink}; color: white; border: 3px solid ${G.ink}; padding: 14px 32px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 16px; font-family: 'DM Sans', sans-serif; box-shadow: 4px 4px 0 ${G.accent}; transition: all 0.15s; }
  .goofy-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 ${G.accent}; }
  .goofy-btn-outline { background: white; color: ${G.ink}; border: 3px solid ${G.ink}; padding: 14px 32px; border-radius: 8px; cursor: pointer; font-weight: 800; font-size: 16px; font-family: 'DM Sans', sans-serif; box-shadow: 4px 4px 0 #e8e4df; transition: all 0.15s; }
  .goofy-btn-outline:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #e8e4df; }
  .sticker { border: 3px solid ${G.ink}; border-radius: 12px; padding: 10px 18px; background: white; font-weight: 700; font-size: 13px; box-shadow: 3px 3px 0 ${G.ink}; display: inline-block; }
  .step-card { border: 3px solid ${G.ink}; border-radius: 16px; padding: 32px; box-shadow: 6px 6px 0 ${G.ink}; background: white; }
`;
