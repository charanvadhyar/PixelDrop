import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { G } from "../styles";
import { BLOG } from "../data";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";

const ADMIN_PASSWORD = "saicharan@1A";

function AdminLoginGate({ onAuth }) {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onAuth(); setError(""); }
    else { setError("Wrong password."); setPw(""); }
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: G.ink, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22, margin: "0 auto 16px" }}>🔒</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: G.ink, marginBottom: 6 }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: G.muted }}>Enter the admin password to continue.</p>
        </div>
        <div style={{ background: "white", border: `1.5px solid ${G.border}`, borderRadius: 14, padding: "28px 28px" }}>
          <div style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 14 }}>
              {error}
            </div>
          )}
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px" }} onClick={attempt}>
            Enter Dashboard →
          </button>
        </div>
        <button className="btn-ghost" style={{ display: "block", margin: "16px auto 0", fontSize: 13 }} onClick={() => navigate("/")}>
          ← Back to site
        </button>
      </div>
    </div>
  );
}

function LimitsForm({ maxPrice, setMaxPrice, maxListings, setMaxListings }) {
  const [localPrice, setLocalPrice] = useState(maxPrice);
  const [localListings, setLocalListings] = useState(maxListings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setMaxPrice(localPrice);
    setMaxListings(localListings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <label>Max listing price (PixelCoins)</label>
        <input type="number" value={localPrice} onChange={e => setLocalPrice(Number(e.target.value))} min={1} />
        <p style={{ fontSize: 12, color: G.muted, marginTop: 6 }}>Sellers cannot price above {localPrice} PC per listing</p>
      </div>
      <div>
        <label>Max listings per user</label>
        <input type="number" value={localListings} onChange={e => setLocalListings(Number(e.target.value))} min={1} />
        <p style={{ fontSize: 12, color: G.muted, marginTop: 6 }}>Total active listings per account</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={save}>Save Changes</button>
        {saved && <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>✓ Saved</span>}
      </div>
    </div>
  );
}

const BLANK_LISTING = { title: "", description: "", type: "IMAGE", category: "Art", price: "", creator_username: "admin", file: null, submitting: false, error: "" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, authReady, adSlots, setAdSlots, maxPrice, setMaxPrice, maxListings, setMaxListings, adminAuthed, setAdminAuthed, adminLogout } = useApp();
  const [tab, setTab] = useState("overview");
  const [blogTab, setBlogTab] = useState("list");
  const [newPost, setNewPost] = useState({ title: "", category: "Sales", body: "" });

  // Listings state
  const [dbListings, setDbListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingSubTab, setListingSubTab] = useState("all");
  const [newListing, setNewListing] = useState(BLANK_LISTING);

  // Overview stats
  const [overviewStats, setOverviewStats] = useState({ users: 0, listings: 0, totalSales: 0, coinsTraded: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    const [
      { count: userCount },
      { count: listingCount },
      { data: salesData },
      { data: recent },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("sales, price"),
      supabase.from("listings").select("title, creator_username, created_at, type, price, emoji").order("created_at", { ascending: false }).limit(8),
    ]);

    const totalSales = salesData?.reduce((s, l) => s + (l.sales || 0), 0) || 0;
    const coinsTraded = salesData?.reduce((s, l) => s + (l.sales || 0) * (l.price || 0), 0) || 0;

    setOverviewStats({ users: userCount || 0, listings: listingCount || 0, totalSales, coinsTraded });
    setRecentActivity(recent || []);
    setStatsLoading(false);
  }, []);

  // Load stats + subscribe to realtime when admin is authenticated
  useEffect(() => {
    if (!adminAuthed) return;

    loadStats();

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "listings" }, loadStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadStats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [adminAuthed, loadStats]);

  // Users state
  const [dbUsers, setDbUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [rewards, setRewards] = useState({}); // { userId: { amount: "", sending: false, sent: false } }

  useEffect(() => {
    if (tab === "users" && adminAuthed) {
      setUsersLoading(true);
      Promise.all([
        supabase.from("profiles").select("id, username, coins, email, created_at"),
        supabase.from("listings").select("creator_username, sales, price"),
      ]).then(([{ data: profiles }, { data: listings }]) => {
        // Compute volume per username from listings
        const volMap = {};
        (listings || []).forEach(l => {
          if (!l.creator_username) return;
          if (!volMap[l.creator_username]) volMap[l.creator_username] = { sales: 0, volume: 0 };
          volMap[l.creator_username].sales += l.sales || 0;
          volMap[l.creator_username].volume += (l.sales || 0) * (l.price || 0);
        });
        const merged = (profiles || []).map(p => ({
          ...p,
          sales: volMap[p.username]?.sales || 0,
          volume: volMap[p.username]?.volume || 0,
        })).sort((a, b) => b.volume - a.volume);
        setDbUsers(merged);
        setUsersLoading(false);
      });
    }
  }, [tab, adminAuthed]);

  const sendReward = async (userId) => {
    const r = rewards[userId] || {};
    const amount = Number(r.amount);
    if (!amount || amount <= 0) return;
    setRewards(prev => ({ ...prev, [userId]: { ...r, sending: true } }));
    const { error } = await supabase.rpc("add_coins_to_user", { target_user_id: userId, amount });
    if (error) {
      alert("Failed: " + error.message + "\n\nMake sure you've run the add_coins_to_user SQL function in Supabase.");
      setRewards(prev => ({ ...prev, [userId]: { ...r, sending: false } }));
      return;
    }
    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, coins: u.coins + amount } : u));
    setRewards(prev => ({ ...prev, [userId]: { amount: "", sending: false, sent: true } }));
    setTimeout(() => setRewards(prev => ({ ...prev, [userId]: { amount: "" } })), 2500);
  };

  // Load listings when tab opens
  useEffect(() => {
    if (tab === "listings" && adminAuthed) {
      setListingsLoading(true);
      supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setDbListings(data || []);
          setListingsLoading(false);
        });
    }
  }, [tab, adminAuthed]);

  const removeListing = async (id) => {
    await supabase.from("listings").delete().eq("id", id);
    setDbListings(prev => prev.filter(l => l.id !== id));
    loadStats();
  };

  const submitListing = async () => {
    if (!newListing.title || !newListing.price || !newListing.description) return;
    setNewListing(n => ({ ...n, submitting: true, error: "" }));

    let content_url = null;

    if (newListing.file) {
      const ext = newListing.file.name.split(".").pop() || "bin";
      const filename = `admin-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("generated-assets")
        .upload(filename, newListing.file, { contentType: newListing.file.type });

      if (uploadErr) {
        setNewListing(n => ({ ...n, submitting: false, error: uploadErr.message }));
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("generated-assets").getPublicUrl(filename);
      content_url = publicUrl;
    }

    const emojiMap = { IMAGE: "🖼️", DOC: "📄", PDF: "📋" };
    const { data, error } = await supabase.from("listings").insert({
      title: newListing.title,
      description: newListing.description,
      type: newListing.type,
      category: newListing.category,
      price: Number(newListing.price),
      emoji: emojiMap[newListing.type],
      content_url,
      creator_username: newListing.creator_username,
      creator_id: user?.id || null,
      sales: 0,
    }).select().single();

    if (error) {
      setNewListing(n => ({ ...n, submitting: false, error: error.message }));
      return;
    }

    setDbListings(prev => [data, ...prev]);
    setNewListing(BLANK_LISTING);
    setListingSubTab("all");
  };

  // Auth gates
  if (!authReady) return null;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: G.ink, marginBottom: 8 }}>Login required</h2>
          <p style={{ fontSize: 14, color: G.muted, marginBottom: 28 }}>You need to be logged in to access the admin panel.</p>
          <button className="btn-primary" style={{ justifyContent: "center" }} onClick={() => navigate("/auth")}>
            Log in →
          </button>
          <div style={{ marginTop: 12 }}>
            <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate("/")}>← Back to site</button>
          </div>
        </div>
      </div>
    );
  }

  if (!adminAuthed) return <AdminLoginGate onAuth={() => setAdminAuthed(true)} />;

  const statCards = [
    { label: "Total Users", val: statsLoading ? "…" : overviewStats.users.toLocaleString(), icon: "👥", delta: "registered accounts" },
    { label: "Total Listings", val: statsLoading ? "…" : overviewStats.listings.toLocaleString(), icon: "📦", delta: "live in marketplace" },
    { label: "Total Sales", val: statsLoading ? "…" : overviewStats.totalSales.toLocaleString(), icon: "🛒", delta: "across all listings" },
    { label: "Coins Traded", val: statsLoading ? "…" : overviewStats.coinsTraded.toLocaleString(), icon: "⚡", delta: "total PC volume" },
    { label: "Active Ad Slots", val: `${adSlots.filter(a => a.active).length}/4`, icon: "📢", delta: "slots running" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, borderRight: `1px solid ${G.border}`, background: "white", padding: "32px 16px", flexShrink: 0 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: G.muted, textTransform: "uppercase", marginBottom: 8, paddingLeft: 10 }}>Admin</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: G.accent, paddingLeft: 10, marginBottom: 16 }}>@{user.username}</div>
        {[["overview", "📊", "Overview"], ["listings", "📦", "Listings"], ["users", "👥", "Users"], ["limits", "⚙️", "Limits"], ["ads", "📢", "Ad Slots"], ["blog", "📝", "Blog"]].map(([t, icon, label]) => (
          <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ width: "100%", textAlign: "left", marginBottom: 2, display: "flex", alignItems: "center", gap: 10 }}>
            <span>{icon}</span>{label}
          </button>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 32 }}>
          <button className="btn-ghost" onClick={() => { adminLogout(); navigate("/"); }} style={{ width: "100%", textAlign: "left", fontSize: 12 }}>← Exit admin</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "36px 40px", background: G.bg, overflowY: "auto" }}>

        {tab === "overview" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, letterSpacing: -0.5 }}>Overview</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, color: G.muted, fontFamily: "'DM Mono', monospace" }}>Live</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16, marginBottom: 36 }}>
              {statCards.map(s => (
                <div key={s.label} className="card" style={{ padding: 22 }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28, color: G.ink, letterSpacing: -0.5 }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: G.accent, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{s.delta}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 16, color: G.ink }}>Recent Listings</h3>
              {recentActivity.length === 0 ? (
                <div style={{ color: G.muted, fontSize: 13, padding: "12px 0" }}>No listings yet.</div>
              ) : recentActivity.map(item => (
                <div key={item.title + item.created_at} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, color: G.ink, fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: G.muted }}>@{item.creator_username} · {item.type} · {item.price} PC</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: G.muted, fontFamily: "'DM Mono', monospace", flexShrink: 0, marginLeft: 12 }}>
                    {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "listings" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, letterSpacing: -0.5 }}>Listings</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`admin-tab ${listingSubTab === "all" ? "active" : ""}`} onClick={() => setListingSubTab("all")}>All Listings</button>
                <button className={`admin-tab ${listingSubTab === "add" ? "active" : ""}`} onClick={() => setListingSubTab("add")}>+ Add Listing</button>
              </div>
            </div>

            {listingSubTab === "all" ? (
              listingsLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: G.muted, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Loading…</div>
              ) : dbListings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: G.muted, fontSize: 14 }}>No listings yet. Add one!</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {dbListings.map(item => (
                    <div key={item.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                      {item.content_url && item.type === "IMAGE" ? (
                        <img src={item.content_url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ fontSize: 24, width: 44, height: 44, background: G.tag, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: G.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>@{item.creator_username} · {item.sales} sales · <span className="tag" style={{ fontSize: 10 }}>{item.type}</span></div>
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, color: G.accent, flexShrink: 0 }}>{item.price} PC</div>
                      <span style={{ fontSize: 11, background: "#dcfce7", color: "#16a34a", padding: "3px 8px", borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>Live</span>
                      <button onClick={() => removeListing(item.id)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Remove</button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="card" style={{ padding: 32, maxWidth: 560 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label>Title</label>
                    <input value={newListing.title} onChange={e => setNewListing(n => ({ ...n, title: e.target.value }))} placeholder="Listing title…" />
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea value={newListing.description} onChange={e => setNewListing(n => ({ ...n, description: e.target.value }))} placeholder="What's included? Why should buyers care?" style={{ minHeight: 80 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label>Type</label>
                      <select value={newListing.type} onChange={e => setNewListing(n => ({ ...n, type: e.target.value }))}>
                        <option value="IMAGE">Image</option>
                        <option value="DOC">Document</option>
                        <option value="PDF">PDF</option>
                      </select>
                    </div>
                    <div>
                      <label>Category</label>
                      <select value={newListing.category} onChange={e => setNewListing(n => ({ ...n, category: e.target.value }))}>
                        {["Art", "Business", "Marketing", "Design"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Price (PixelCoins)</label>
                      <input type="number" value={newListing.price} onChange={e => setNewListing(n => ({ ...n, price: e.target.value }))} placeholder="e.g. 200" min={1} max={2000} />
                    </div>
                    <div>
                      <label>Creator username</label>
                      <input value={newListing.creator_username} onChange={e => setNewListing(n => ({ ...n, creator_username: e.target.value }))} placeholder="admin" />
                    </div>
                  </div>
                  <div>
                    <label>Upload file (optional)</label>
                    <input type="file" onChange={e => setNewListing(n => ({ ...n, file: e.target.files[0] || null }))} style={{ padding: "8px 0", fontSize: 13 }} />
                    <p style={{ fontSize: 12, color: G.muted, marginTop: 4 }}>Image, PDF, DOC, etc. Stored in Supabase Storage.</p>
                  </div>
                  {newListing.error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, fontSize: 13, color: "#dc2626" }}>
                      {newListing.error}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      className="btn-primary"
                      onClick={submitListing}
                      disabled={!newListing.title || !newListing.price || !newListing.description || newListing.submitting}
                      style={{ opacity: (!newListing.title || !newListing.price || !newListing.description || newListing.submitting) ? 0.6 : 1 }}
                    >
                      {newListing.submitting ? "Publishing…" : "Add Listing →"}
                    </button>
                    <button className="btn-ghost" onClick={() => { setListingSubTab("all"); setNewListing(BLANK_LISTING); }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, letterSpacing: -0.5 }}>Users & Leaderboard</h2>
              <span style={{ fontSize: 12, color: G.muted, fontFamily: "'DM Mono', monospace" }}>{dbUsers.length} accounts · sorted by volume</span>
            </div>

            {usersLoading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: G.muted, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Loading…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {dbUsers.map((u, i) => {
                  const rank = i + 1;
                  const badge = rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                  const r = rewards[u.id] || {};
                  return (
                    <div key={u.id} className="card" style={{ padding: "18px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Rank */}
                        <div style={{ width: 32, textAlign: "center", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: rank <= 3 ? G.accent : G.muted, flexShrink: 0 }}>
                          {badge || `#${rank}`}
                        </div>

                        {/* Avatar */}
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: G.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          {u.username[0].toUpperCase()}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: G.ink }}>@{u.username}</div>
                          <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>
                            {u.email || <span style={{ color: "#f59e0b" }}>no email</span>}
                          </div>
                          <div style={{ fontSize: 11, color: G.muted, marginTop: 1 }}>
                            {u.sales} {u.sales === 1 ? "sale" : "sales"} · {u.coins.toLocaleString()} PC balance
                          </div>
                        </div>

                        {/* Volume */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 15, color: G.accent }}>{u.volume.toLocaleString()} PC</div>
                          <div style={{ fontSize: 11, color: G.muted }}>volume</div>
                        </div>

                        {/* Reward input */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <input
                            type="number"
                            placeholder="+ coins"
                            value={r.amount || ""}
                            onChange={e => setRewards(prev => ({ ...prev, [u.id]: { ...r, amount: e.target.value } }))}
                            onKeyDown={e => e.key === "Enter" && sendReward(u.id)}
                            style={{ width: 90, padding: "7px 10px", fontSize: 13, borderRadius: 6, border: `1.5px solid ${G.border}`, fontFamily: "'DM Mono', monospace" }}
                            min={1}
                          />
                          <button
                            onClick={() => sendReward(u.id)}
                            disabled={!r.amount || r.sending}
                            style={{ padding: "7px 14px", borderRadius: 6, background: r.sent ? "#16a34a" : G.accent, color: "white", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", opacity: (!r.amount || r.sending) ? 0.5 : 1, flexShrink: 0 }}
                          >
                            {r.sent ? "✓ Sent!" : r.sending ? "…" : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {dbUsers.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0", color: G.muted, fontSize: 14 }}>No users yet.</div>
                )}
              </div>
            )}

            <div style={{ marginTop: 24, background: "#fefce8", border: "1px solid #fde047", borderRadius: 8, padding: "14px 18px", fontSize: 13, color: "#854d0e" }}>
              <strong>Setup required:</strong> Run this in your Supabase SQL editor to enable coin rewards:
              <pre style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 11, whiteSpace: "pre-wrap", color: "#78350f" }}>{`CREATE OR REPLACE FUNCTION add_coins_to_user(target_user_id UUID, amount INT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles SET coins = coins + amount WHERE id = target_user_id;
END;
$$;`}</pre>
            </div>
          </div>
        )}

        {tab === "limits" && (
          <div className="fade-up" style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, marginBottom: 28, letterSpacing: -0.5 }}>Platform Limits</h2>
            <LimitsForm maxPrice={maxPrice} setMaxPrice={setMaxPrice} maxListings={maxListings} setMaxListings={setMaxListings} />
          </div>
        )}

        {tab === "ads" && (
          <div className="fade-up" style={{ maxWidth: 620 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, marginBottom: 8, letterSpacing: -0.5 }}>Ad Slot Manager</h2>
            <p style={{ color: G.muted, fontSize: 14, marginBottom: 28 }}>Toggle placements, write copy, or inject a custom ad script (Google AdSense, etc.).</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {adSlots.map(slot => (
                <div key={slot.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: G.ink }}>{slot.position}</div>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600, background: slot.active ? "#dcfce7" : G.tag, color: slot.active ? "#16a34a" : G.muted }}>
                          {slot.active ? "● Live" : "○ Off"}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setAdSlots(prev => prev.map(s => s.id === slot.id ? { ...s, active: !s.active } : s))} className="btn-outline" style={{ padding: "7px 16px", fontSize: 12 }}>
                      {slot.active ? "Disable" : "Enable"}
                    </button>
                  </div>

                  {/* Mode toggle */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {["text", "script"].map(m => (
                      <button key={m} onClick={() => setAdSlots(prev => prev.map(s => s.id === slot.id ? { ...s, mode: m } : s))}
                        style={{ padding: "5px 14px", borderRadius: 6, border: `1.5px solid ${slot.mode === m ? G.accent : G.border}`, background: slot.mode === m ? G.accentLight : "white", color: slot.mode === m ? G.accent : G.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        {m === "text" ? "Text" : "Script / HTML"}
                      </button>
                    ))}
                  </div>

                  {slot.mode === "text" ? (
                    <div>
                      <label>Ad copy</label>
                      <input value={slot.content} onChange={e => setAdSlots(prev => prev.map(s => s.id === slot.id ? { ...s, content: e.target.value } : s))} placeholder="Enter ad message…" />
                    </div>
                  ) : (
                    <div>
                      <label>Ad script / HTML</label>
                      <textarea
                        value={slot.script}
                        onChange={e => setAdSlots(prev => prev.map(s => s.id === slot.id ? { ...s, script: e.target.value } : s))}
                        placeholder={"Paste your ad code here…\ne.g. Google AdSense <script> tag or custom HTML"}
                        style={{ minHeight: 110, fontFamily: "'DM Mono', monospace", fontSize: 12 }}
                      />
                      <p style={{ fontSize: 11, color: G.muted, marginTop: 6 }}>⚠️ Scripts execute on the page. Only paste trusted ad code.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "blog" && (
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G.ink, letterSpacing: -0.5 }}>Blog Management</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`admin-tab ${blogTab === "list" ? "active" : ""}`} onClick={() => setBlogTab("list")}>Articles</button>
                <button className={`admin-tab ${blogTab === "new" ? "active" : ""}`} onClick={() => setBlogTab("new")}>+ New Article</button>
              </div>
            </div>
            {blogTab === "list" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BLOG.map(post => (
                  <div key={post.id} className="card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 26 }}>{post.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: G.ink }}>{post.title}</div>
                      <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>@{post.author} · {post.reads.toLocaleString()} reads · {post.date}</div>
                    </div>
                    <span className="tag-accent">{post.category}</span>
                    <span style={{ fontSize: 11, background: "#dcfce7", color: "#16a34a", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>Published</span>
                    <button className="btn-ghost" style={{ fontSize: 12 }}>Edit</button>
                    <button style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: 32, maxWidth: 560 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label>Title</label>
                    <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="Article headline…" />
                  </div>
                  <div>
                    <label>Category</label>
                    <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
                      {["Sales", "Strategy", "Case Study", "Copywriting"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Body</label>
                    <textarea value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} placeholder="Write your article…" style={{ minHeight: 180 }} />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn-primary" onClick={() => { alert("✅ Article published!"); setBlogTab("list"); setNewPost({ title: "", category: "Sales", body: "" }); }}>Publish Article</button>
                    <button className="btn-ghost" onClick={() => setBlogTab("list")}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
