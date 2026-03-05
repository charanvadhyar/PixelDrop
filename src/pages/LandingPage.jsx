import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { G } from "../styles";
import { LISTINGS, BLOG } from "../data";
import ListingCard from "../components/ListingCard";

export default function LandingPage() {
  const navigate = useNavigate();
  const [wiggle, setWiggle] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(c => c + 1);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 600);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ── HERO ── */}
      <section style={{ minHeight: "calc(100vh - 60px)", background: "#fffbf5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 60, left: 40, fontSize: 48, opacity: 0.12, transform: "rotate(-20deg)" }} className="float-1">💸</div>
        <div style={{ position: "absolute", top: 120, right: 60, fontSize: 56, opacity: 0.10, transform: "rotate(15deg)" }} className="float-2">🤑</div>
        <div style={{ position: "absolute", bottom: 100, left: 80, fontSize: 40, opacity: 0.12, transform: "rotate(10deg)" }} className="float-3">🎨</div>
        <div style={{ position: "absolute", bottom: 80, right: 100, fontSize: 44, opacity: 0.10, transform: "rotate(-12deg)" }} className="float-1">📦</div>
        <div style={{ position: "absolute", top: "40%", left: 20, fontSize: 32, opacity: 0.08 }} className="float-2">⭐</div>
        <div style={{ position: "absolute", top: "30%", right: 30, fontSize: 36, opacity: 0.08 }} className="float-3">✨</div>

        <div onClick={handleLogoClick} style={{ marginBottom: 28, cursor: "pointer", position: "relative", width: 90, height: 90 }}>
          <div className="spin-slow" style={{ width: 90, height: 90, borderRadius: "50%", border: `3px dashed ${G.ink}`, display: "flex", alignItems: "center", justifyContent: "center", background: "#fffbf5" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: G.ink, fontFamily: "'DM Mono', monospace", position: "absolute", animation: "spin-slow 12s linear infinite reverse", whiteSpace: "nowrap", top: 8 }}>PIXELDROP·PIXELDROP·</span>
            <span style={{ fontSize: 36 }}>🪙</span>
          </div>
          {clickCount > 2 && <div style={{ position: "absolute", top: -16, right: -16, background: G.accent, color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "2px solid white", whiteSpace: "nowrap" }}>stop clicking me 😭</div>}
        </div>

        <div style={{ textAlign: "center", maxWidth: 820, position: "relative" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="sticker" style={{ background: "#fef9c3", transform: "rotate(-2deg)" }}>100% Unserious 🤪</span>
            <span className="sticker" style={{ background: "#fce7f3", transform: "rotate(1.5deg)" }}>Fake internet money 💅</span>
          </div>

          <h1 className={`fade-up ${wiggle ? "wiggle" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 900, lineHeight: 1.0, color: G.ink, marginBottom: 24, letterSpacing: -3 }}>
            Your friends<br />
            <em style={{ color: G.accent, fontStyle: "italic" }}>owe</em> you money.<br />
            <span style={{ fontSize: "0.55em", letterSpacing: -1 }}>Collect it in PixelCoins. 🪙</span>
          </h1>

          <p className="fade-up fade-up-1" style={{ fontSize: 18, color: G.muted, lineHeight: 1.75, marginBottom: 16, maxWidth: 560, margin: "0 auto 16px" }}>
            Generate AI art, docs & PDFs. Slap a price on them. Sell to your group chat.<br />
            <strong style={{ color: G.ink }}>Yes, this is a real website.</strong> No, we're not sure why either.
          </p>

          <div className="fade-up fade-up-2" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: G.muted, background: G.tag, padding: "4px 12px", borderRadius: 20, border: `1px solid ${G.border}` }}>⚡ 3 AI generations/day</span>
            <span style={{ fontSize: 13, color: G.muted, background: G.tag, padding: "4px 12px", borderRadius: 20, border: `1px solid ${G.border}` }}>🏆 Monthly leaderboard</span>
            <span style={{ fontSize: 13, color: G.muted, background: G.tag, padding: "4px 12px", borderRadius: 20, border: `1px solid ${G.border}` }}>💸 Fake coins + 🎁 real gift cards</span>
          </div>

          <div className="fade-up fade-up-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="goofy-btn" onClick={() => navigate("/create")}>Make something dumb →</button>
            <button className="goofy-btn-outline" onClick={() => navigate("/marketplace")}>Buy other people's stuff</button>
          </div>
        </div>

        <div className="fade-up fade-up-4" style={{ display: "flex", gap: 16, marginTop: 60, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { emoji: "🖼️", title: "Random AI Art", price: 69, rotate: "-3deg", bg: "#fef9c3" },
            { emoji: "📄", title: "Useless PDF", price: 420, rotate: "2deg", bg: "#fce7f3" },
            { emoji: "🗺️", title: "Made-Up Map", price: 99, rotate: "-1.5deg", bg: "#e0f2fe" },
          ].map((item, i) => (
            <div key={i} className="goofy-card float-1" onClick={() => navigate("/marketplace")} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, transform: `rotate(${item.rotate})`, animationDelay: `${i * 0.4}s`, minWidth: 200 }}>
              <div style={{ fontSize: 32, width: 50, height: 50, background: item.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${G.ink}` }}>{item.emoji}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: G.ink }}>{item.title}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: G.accent, fontWeight: 700 }}>{item.price} 🪙</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div style={{ background: G.ink, padding: "14px 0", overflow: "hidden", borderTop: `3px solid ${G.ink}`, borderBottom: `3px solid ${G.ink}` }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 48, alignItems: "center" }}>
              {["🪙 PIXELCOINS ARE DEFINITELY REAL MONEY", "🎁 TOP SELLER WINS A $20 AMAZON GIFT CARD — FOR REAL", "🤑 YOUR FRIENDS WILL BUY THIS TRUST ME", "🎨 AI MADE IT SO IT MUST BE GOOD", "🏆 MONTHLY LEADERBOARD OR BUST", "📄 SELL THAT PDF KING", "⚡ ONLY 3 GENERATIONS A DAY SO MAKE THEM COUNT", "🎮 $10 AMAZON GIFT CARD FOR 3RD PLACE — NOT JOKING", "🛒 THE MARKETPLACE IS OPEN FOR BUSINESS (KINDA)"].map((t, j) => (
                <span key={j} style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: "white", letterSpacing: 1 }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px", background: "#fffbf5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: G.ink, letterSpacing: -1, marginBottom: 10 }}>How does this work?</h2>
            <p style={{ color: G.muted, fontSize: 16 }}>It's stupidly simple. Like, embarrassingly simple.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { n: "1️⃣", title: "Type some words", sub: "into the AI box", desc: "Describe literally anything. \"Frog wearing a suit at a boardroom meeting.\" Done. The AI does the work.", bg: "#fef9c3" },
              { n: "2️⃣", title: "Slap a price on it", sub: "in PixelCoins™", desc: "Set your price (max 500 coins, we're not monsters). Write a description that sounds way more professional than what you actually made.", bg: "#fce7f3" },
              { n: "3️⃣", title: "Profit??", sub: "sort of", desc: "Your friends buy your stuff. You climb the leaderboard. You earn bonus coins. You feel powerful. You are not powerful. But you feel it.", bg: "#e0f2fe" },
            ].map((s, i) => (
              <div key={i} className="step-card" style={{ background: s.bg, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: G.ink, marginBottom: 2 }}>{s.title}</h3>
                <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: G.accent, fontWeight: 600, marginBottom: 14 }}>{s.sub}</div>
                <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: G.accent, padding: "60px 24px", borderTop: `3px solid ${G.ink}`, borderBottom: `3px solid ${G.ink}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 36, textTransform: "uppercase" }}>Totally real statistics we definitely didn't make up</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, textAlign: "center" }}>
            {[
              ["1,284", "creators", "(most of them confused)"],
              ["342", "sales", "(mom counts)"],
              ["68,400", "coins traded", "(worth $0.00 USD)"],
              ["89", "live listings", "(some are actually good)"],
            ].map(([val, label, sub]) => (
              <div key={label} style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 44, color: "white", letterSpacing: -1, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, fontStyle: "italic" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT LISTINGS ── */}
      <section style={{ padding: "80px 24px", background: "#fffbf5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔥</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: G.ink, letterSpacing: -1 }}>Hot drops right now</h2>
              <p style={{ color: G.muted, fontSize: 14, marginTop: 4 }}>Your peers made these. Be supportive. Buy them.</p>
            </div>
            <button className="goofy-btn-outline" onClick={() => navigate("/marketplace")} style={{ fontSize: 14, padding: "12px 24px" }}>See all the stuff →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {LISTINGS.slice(0, 4).map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: G.tag, padding: "72px 24px", borderTop: `3px solid ${G.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: G.ink, letterSpacing: -1 }}>What people are saying</h2>
            <p style={{ color: G.muted, fontSize: 14, marginTop: 8 }}>These are 100% real quotes from real people (they are not)</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { quote: "I sold a PDF of 'facts about raccoons' for 200 coins. I am thriving.", name: "racoon_dad_99", emoji: "🦝", rotate: "-1.5deg" },
              { quote: "My friend bought my AI painting of a horse in sunglasses. Our friendship is stronger than ever.", name: "horse_girl_forever", emoji: "🐴", rotate: "2deg" },
              { quote: "I hit #1 on the leaderboard. My therapist said I need to go outside. I said after one more listing.", name: "closer_king", emoji: "👑", rotate: "-1deg" },
            ].map((t, i) => (
              <div key={i} className="goofy-card" style={{ padding: 24, transform: `rotate(${t.rotate})` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{t.emoji}</div>
                <p style={{ fontSize: 14, color: G.ink, lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>"{t.quote}"</p>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: G.accent, fontWeight: 600 }}>@{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG TEASER ── */}
      <section style={{ padding: "72px 24px", background: "#fffbf5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📖</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: G.ink, letterSpacing: -1 }}>Sales tips from unqualified people</h2>
              <p style={{ color: G.muted, fontSize: 14, marginTop: 4 }}>Written by our top sellers. Results not guaranteed. At all.</p>
            </div>
            <button className="goofy-btn-outline" onClick={() => navigate("/blog")} style={{ fontSize: 14, padding: "12px 24px" }}>All articles →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {BLOG.slice(0, 2).map(post => (
              <div key={post.id} className="goofy-card" style={{ padding: 28, cursor: "pointer" }} onClick={() => navigate("/blog")}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{post.emoji}</div>
                <span style={{ background: G.accentLight, color: G.accent, padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600, display: "inline-block", marginBottom: 12, border: `1px solid ${G.accent}` }}>{post.category}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: G.ink, lineHeight: 1.35, marginBottom: 10 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{post.body.slice(0, 90)}…</p>
                <div style={{ marginTop: 14, fontSize: 12, color: G.muted, fontFamily: "'DM Mono', monospace" }}>@{post.author} · {post.reads.toLocaleString()} reads</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: G.ink, borderTop: `3px solid ${G.ink}` }}>
        <div style={{ fontSize: 56, marginBottom: 16 }} className="bloop">🚀</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, color: "white", letterSpacing: -2, marginBottom: 16, lineHeight: 1.1 }}>
          Ready to sell stuff<br />to your friends?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 40 }}>You have 3 generations today. Don't waste them. Go go go.</p>
        <button className="goofy-btn" onClick={() => navigate("/create")} style={{ background: G.accent, border: `3px solid ${G.accent}`, boxShadow: "4px 4px 0 rgba(255,255,255,0.2)", fontSize: 18, padding: "18px 48px" }}>
          Let's gooo 🎉
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: G.ink, borderTop: `1px solid rgba(255,255,255,0.08)`, padding: "28px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🪙</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "white" }}>PixelDrop</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>— the goofiest marketplace on the internet</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>© 2026 · no PixelCoins were harmed in the making of this site</div>
      </footer>
    </div>
  );
}
