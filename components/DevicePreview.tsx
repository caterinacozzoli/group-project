"use client";

import { useEffect, useState } from "react";
import styles from "./DevicePreview.module.css";

// ⌘D / Ctrl+D: desktop → mobile (393) → tablet (834) → desktop.
// Le media query guardano la finestra, quindi mobile e tablet girano in un iframe largo quanto il device.
const MODI = [
  { nome: "Desktop", w: 0 },
  { nome: "Mobile", w: 393 },
  { nome: "Tablet", w: 834 },
];
const TIP_VISTO = "libraccio:tip-device";

export default function DevicePreview() {
  const [i, setI] = useState(0);
  const [dentroIframe, setDentroIframe] = useState(false);
  const [tip, setTip] = useState(false);
  const [tasto, setTasto] = useState("⌘D");

  const chiudiTip = () => {
    setTip(false);
    try { localStorage.setItem(TIP_VISTO, "1"); } catch {}
  };
  const cambia = () => {
    setI((x) => (x + 1) % MODI.length);
    chiudiTip();
  };

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setDentroIframe(inIframe);
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setTasto("Ctrl+D");
    // Pop up solo alla prima visita e solo su dispositivi con tastiera e mouse
    let visto = false;
    try { visto = !!localStorage.getItem(TIP_VISTO); } catch {}
    if (!inIframe && !visto && matchMedia("(hover: hover) and (pointer: fine)").matches) setTip(true);

    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "d") return;
      e.preventDefault(); // blocca "aggiungi ai preferiti"
      if (inIframe) window.parent.postMessage("libraccio:cambia-device", location.origin);
      else cambia();
    };
    const onMsg = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data === "libraccio:cambia-device") cambia();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMsg);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = i ? "hidden" : "";
  }, [i]);

  if (dentroIframe) return null;
  const modo = MODI[i];

  return (
    <>
      {tip && (
        <div className={styles.tip} role="status">
          <p>Premi <kbd>{tasto}</kbd> per vedere la pagina su mobile, tablet e desktop</p>
          <button type="button" className={styles.prova} onClick={cambia}>Prova ora</button>
          <button type="button" className={styles.chiudi} aria-label="Chiudi suggerimento" onClick={chiudiTip}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      {/* In desktop non mostra altro: la pagina resta identica al design */}
      {modo.w > 0 && (
        <div className={styles.overlay}>
          <iframe className={styles.device} style={{ width: modo.w }} src={location.pathname} title={`Anteprima ${modo.nome}`} />
          <button type="button" className={styles.etichetta} onClick={cambia} aria-live="polite">
            {modo.nome} · {modo.w} px <kbd>{tasto}</kbd>
          </button>
        </div>
      )}
    </>
  );
}
