import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { G } from "../styles";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser, user } = useApp();

  useEffect(() => {
    if (user) navigate("/create");
  }, [user, navigate]);
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); return; }
        // useEffect navigates once onAuthStateChange sets the user
      } else {
        if (!username || !email || !password) { setError("Fill in all fields!"); return; }
        if (password.length < 6) { setError("Password needs to be at least 6 characters."); return; }

        const { data, error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) { setError(signUpErr.message); return; }

        if (!data.session) {
          localStorage.setItem("pending_username", username);
          setConfirmSent(true);
          return;
        }

        const { error: profileErr } = await supabase
          .from("profiles")
          .insert({ id: data.user.id, username });

        if (profileErr) {
          setError(profileErr.message.includes("unique") ? "Username already taken." : profileErr.message);
          return;
        }

        setUser({ id: data.user.id, username, email, coins: 200, rank: null });
        navigate("/create");
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmSent) {
    return (
      <div style={{ minHeight: "100vh", background: "#fffbf5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: G.ink, marginBottom: 8 }}>Check your inbox</h2>
          <p style={{ color: G.muted, fontSize: 14, lineHeight: 1.6 }}>
            We sent a confirmation link to <strong style={{ color: G.ink }}>{email}</strong>.<br />
            Click it to activate your account, then come back and log in.
          </p>
          <button className="btn-outline" style={{ marginTop: 28 }} onClick={() => { setConfirmSent(false); setMode("login"); }}>
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fffbf5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "authPop 0.35s ease both" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, cursor: "pointer", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: G.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>P</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: G.ink }}>PixelDrop</span>
        </div>

        <div style={{ background: "white", border: `3px solid ${G.ink}`, borderRadius: 20, padding: "36px 32px", boxShadow: `6px 6px 0 ${G.ink}` }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: G.ink, marginBottom: 4, letterSpacing: -0.5 }}>
            {mode === "login" ? "Welcome back 👋" : "Join the chaos 🎉"}
          </h1>
          <p style={{ color: G.muted, fontSize: 14, marginBottom: 28 }}>
            {mode === "login" ? "Log in to sell stuff and climb the leaderboard." : "Create an account to start selling AI-generated stuff."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))} placeholder="e.g. racoon_dad_99" />
              </div>
            )}
            <div>
              <label>{mode === "login" ? "Email" : "Email"}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                {error}
              </div>
            )}

            <button className="goofy-btn" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
              {loading ? "Hold on…" : mode === "login" ? "Log in →" : "Create account →"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 14, color: G.muted, marginTop: 20 }}>
            {mode === "login" ? "No account yet? " : "Already have one? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ color: G.accent, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
              {mode === "login" ? "Sign up free" : "Log in"}
            </span>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: G.muted, marginTop: 20 }}>
          By continuing you agree that PixelCoins are fake<br />and gift cards are very real. 🎁
        </p>
      </div>
    </div>
  );
}
