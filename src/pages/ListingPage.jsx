import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { G } from "../styles";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import AdSlot from "../components/AdSlot";

function normalize(item) {
  return {
    ...item,
    desc: item.description,
    creator: item.creator_username,
    avatar: (item.creator_username || "?")[0].toUpperCase(),
    created: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, adSlots } = useApp();
  const topAd = adSlots.find(a => a.position === "Top Banner");
  const [listing, setListing] = useState(null);
  const [moreListings, setMoreListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bought, setBought] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("listings").select("*").eq("id", id).single();
      if (!data) { setLoading(false); return; }
      const l = normalize(data);
      setListing(l);
      const { data: more } = await supabase
        .from("listings").select("*")
        .eq("creator_username", l.creator)
        .neq("id", Number(id))
        .limit(3);
      setMoreListings((more || []).map(normalize));
      setLoading(false);
    }
    load();
  }, [id]);

  const purchase = async () => {
    if (!user) { navigate("/auth"); return; }
    if (user.coins < listing.price) { setBuyError("Not enough PixelCoins!"); return; }
    setBuying(true);
    setBuyError("");
    const { error } = await supabase.rpc("purchase_listing", {
      listing_id: listing.id,
      buyer_id: user.id,
      amount: listing.price,
    });
    if (error) {
      setBuyError(error.message === "insufficient_coins" ? "Not enough PixelCoins!" : "Purchase failed. Try again.");
      setBuying(false);
      return;
    }
    setUser(prev => ({ ...prev, coins: prev.coins - listing.price }));
    setBought(true);
    setBuying(false);
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "100px 0", color: G.muted, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
      Loading…
    </div>
  );
  if (!listing) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {topAd && <div style={{ marginBottom: 28 }}><AdSlot slot={topAd} variant="top" /></div>}
      <button className="btn-ghost" onClick={() => navigate("/marketplace")} style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>← Back to Marketplace</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* Left */}
        <div>
          <div style={{ borderRadius: 16, height: 300, background: listing.content_url ? "transparent" : `linear-gradient(135deg, ${G.tag} 0%, #e0d8d0 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100, marginBottom: 20, border: `1px solid ${G.border}`, overflow: "hidden" }}>
            {listing.content_url
              ? <img src={listing.content_url} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : listing.emoji}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="tag">{listing.type}</span>
            <span className="tag">{listing.category}</span>
            <span className="tag">{listing.sales} sold</span>
            <span className="tag">Listed {listing.created}</span>
          </div>
        </div>
        {/* Right */}
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>Digital Listing</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: G.ink, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>{listing.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: G.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>{listing.avatar}</div>
            <span style={{ fontSize: 14, color: G.muted }}>@{listing.creator}</span>
          </div>
          <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.8, marginBottom: 32 }}>{listing.desc}</p>
          <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 28, marginBottom: 28 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: G.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Price</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: G.ink, letterSpacing: -1 }}>
              {listing.price} <span style={{ fontSize: 18, color: G.muted, fontWeight: 400 }}>PixelCoins</span>
            </div>
          </div>
          {bought ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 600, color: "#15803d" }}>Purchase successful!</div>
              <div style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>Your download is ready.</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "15px", opacity: buying ? 0.7 : 1 }} onClick={purchase} disabled={buying}>
                  {buying ? "Processing…" : `Buy Now — ${listing.price} coins`}
                </button>
                <button className="btn-outline" style={{ padding: "15px 18px" }}>♡</button>
              </div>
              {buyError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 10, textAlign: "center" }}>{buyError}</p>}
            </>
          )}
          <p style={{ fontSize: 12, color: G.muted, marginTop: 16, textAlign: "center" }}>Delivered by carrier pigeon · Refunds processed on Feb 30th</p>

          {/* Share */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${G.border}` }}>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>SHARE THIS LISTING</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(url);
                  } else {
                    const ta = document.createElement("textarea");
                    ta.value = url;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                  }
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ padding: "8px 14px", borderRadius: 6, border: `1.5px solid ${copied ? "#16a34a" : G.border}`, background: copied ? "#f0fdf4" : "white", color: copied ? "#16a34a" : G.ink, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                {copied ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${listing?.title}" on PixelDrop!`)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noreferrer"
                style={{ padding: "8px 14px", borderRadius: 6, border: `1.5px solid ${G.border}`, background: "white", color: G.ink, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                𝕏 Share
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out "${listing?.title}" on PixelDrop! ${window.location.href}`)}`}
                target="_blank" rel="noreferrer"
                style={{ padding: "8px 14px", borderRadius: 6, border: `1.5px solid ${G.border}`, background: "white", color: G.ink, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {moreListings.length > 0 && (
        <div style={{ marginTop: 64, paddingTop: 48, borderTop: `1px solid ${G.border}` }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: G.ink, marginBottom: 24 }}>More from @{listing.creator}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {moreListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}
    </div>
  );
}
