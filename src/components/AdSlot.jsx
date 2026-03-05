import { useRef, useEffect } from "react";
import { G } from "../styles";

// Renders a single ad slot — either plain text or injected script/HTML.
// Script tags inside slot.script are executed by creating real DOM script elements.
export default function AdSlot({ slot, variant = "top" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (slot.mode !== "script" || !slot.script || !ref.current) return;
    const container = ref.current;
    container.innerHTML = "";

    const temp = document.createElement("div");
    temp.innerHTML = slot.script;

    Array.from(temp.childNodes).forEach(node => {
      if (node.nodeName === "SCRIPT") {
        const s = document.createElement("script");
        if (node.src) s.src = node.src;
        else s.textContent = node.textContent;
        if (node.async) s.async = true;
        if (node.getAttribute("crossorigin")) s.crossOrigin = node.getAttribute("crossorigin");
        container.appendChild(s);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });
  }, [slot.script, slot.mode]);

  if (!slot.active) return null;

  if (slot.mode === "script") {
    return <div ref={ref} style={{ minHeight: slot.script ? undefined : 0 }} />;
  }

  if (!slot.content) return null;

  const isTop = variant === "top";
  return (
    <div style={{
      background: isTop ? G.accentLight : G.tag,
      border: `1px solid ${isTop ? "#f0d0c0" : G.border}`,
      borderRadius: 8,
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      color: isTop ? G.accent : G.muted,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1, background: isTop ? G.accent : G.muted, color: "white", padding: "2px 6px", borderRadius: 3 }}>AD</span>
      {slot.content}
    </div>
  );
}
