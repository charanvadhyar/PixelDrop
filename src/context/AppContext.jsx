import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AppContext = createContext(null);

async function loadUserFromSession(session, setUser) {
  const email = session.user.email;

  let { data: profile } = await supabase
    .from("profiles")
    .select("username, coins, email")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    // New email user — pending_username was saved before email confirmation
    const pendingUsername = localStorage.getItem("pending_username");
    if (!pendingUsername) return;
    localStorage.removeItem("pending_username");
    await supabase.from("profiles").insert({ id: session.user.id, username: pendingUsername, email });
    const { data: created } = await supabase
      .from("profiles").select("username, coins, email").eq("id", session.user.id).single();
    if (!created) return;
    profile = created;
  } else if (!profile.email && email) {
    // Backfill email for existing profiles that don't have it yet
    await supabase.from("profiles").update({ email }).eq("id", session.user.id);
    profile.email = email;
  }

  setUser({
    id: session.user.id,
    username: profile.username,
    email: session.user.email,
    coins: profile.coins,
    rank: null,
  });

  // Fetch rank in background — doesn't block login
  supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("coins", profile.coins)
    .then(({ count }) => {
      setUser(prev => prev ? { ...prev, rank: (count || 0) + 1 } : prev);
    });
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [maxPrice, setMaxPrice] = useState(() => Number(localStorage.getItem("maxPrice") || 500));
  const [maxListings, setMaxListings] = useState(() => Number(localStorage.getItem("maxListings") || 20));
  const [adSlots, setAdSlots] = useState([
    { id: 1, position: "Top Banner",      active: true,  mode: "text", content: "🔥 Limited time: Get 5 bonus PixelCoins on your first purchase!", script: "" },
    { id: 2, position: "Sidebar Right",   active: false, mode: "text", content: "", script: "" },
    { id: 3, position: "Below Listings",  active: true,  mode: "text", content: "💡 Bundle 3 listings and save 20% — message the seller directly.", script: "" },
    { id: 4, position: "Blog Header",     active: false, mode: "text", content: "", script: "" },
  ]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            setSessionLoading(true);
            await loadUserFromSession(session, setUser);
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error("Auth state error:", e);
          setUser(null);
        } finally {
          setSessionLoading(false);
          if (event === "INITIAL_SESSION") {
            setAuthReady(true);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setUser(null);
    await supabase.auth.signOut();
  };

  const adminLogout = () => setAdminAuthed(false);

  const saveMaxPrice = (v) => { const n = Number(v); localStorage.setItem("maxPrice", n); setMaxPrice(n); };
  const saveMaxListings = (v) => { const n = Number(v); localStorage.setItem("maxListings", n); setMaxListings(n); };

  return (
    <AppContext.Provider value={{ user, setUser, authReady, sessionLoading, adminAuthed, setAdminAuthed, adminLogout, maxPrice, setMaxPrice: saveMaxPrice, maxListings, setMaxListings: saveMaxListings, adSlots, setAdSlots, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
