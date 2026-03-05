import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { G } from "../styles";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
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

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { adSlots } = useApp();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("recent");
  const cats = ["All", "Art", "Business", "Marketing", "Design"];
  const topAd = adSlots.find(a => a.position === "Top Banner");
  const bottomAd = adSlots.find(a => a.position === "Below Listings");

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setListings((data || []).map(normalize));
        setLoading(false);
      });
  }, []);

  const filtered = (filter === "All" ? listings : listings.filter(l => l.category === filter))
    .sort((a, b) =>
      sort === "price_asc" ? a.price - b.price :
      sort === "price_desc" ? b.price - a.price :
      sort === "popular" ? b.sales - a.sales :
      b.id - a.id
    );

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px 24px" }}>
      {topAd && <div style={{ marginBottom: 32 }}><AdSlot slot={topAd} variant="top" /></div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Browse</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: G.ink, letterSpacing: -1 }}>Marketplace</h1>
        </div>
        <button className="btn-primary" onClick={() => navigate("/create")}>+ Upload & Sell</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(c => <button key={c} className={`filter-pill ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: "auto", padding: "8px 14px", fontSize: 13 }}>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: G.muted, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
          Loading listings…
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}

      {bottomAd && <AdSlot slot={bottomAd} variant="bottom" />}
    </div>
  );
}
