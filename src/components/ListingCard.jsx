import { useNavigate } from "react-router-dom";
import { G } from "../styles";

export default function ListingCard({ listing: l }) {
  const navigate = useNavigate();
  return (
    <div className="card-listing" onClick={() => navigate(`/marketplace/${l.id}`)}>
      <div style={{ height: 140, background: `linear-gradient(135deg, ${G.tag} 0%, #e8e0d8 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
        {l.emoji}
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: G.ink, lineHeight: 1.3, flex: 1, paddingRight: 8 }}>{l.title}</h3>
          <span className="tag">{l.type}</span>
        </div>
        <p style={{ fontSize: 12, color: G.muted, marginBottom: 14, lineHeight: 1.5 }}>{l.desc.slice(0, 70)}…</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 16, color: G.accent }}>{l.price}</span>
            <span style={{ fontSize: 11, color: G.muted, marginLeft: 4 }}>coins</span>
          </div>
          <span style={{ fontSize: 11, color: G.muted }}>@{l.creator} · {l.sales} sold</span>
        </div>
      </div>
    </div>
  );
}
