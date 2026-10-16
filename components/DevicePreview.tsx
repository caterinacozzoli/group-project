"use client";

import { useEffect, useState } from "react";
import styles from "./DevicePreview.module.css";

// ⌘D / Ctrl+D: desktop → mobile (393) → tablet (834) → desktop.
// Le media query guardano la finestra, quindi mobile e tablet girano in un iframe largo quanto il device.
// Misure dello schermo in punti: iPhone 15 Pro (393 × 852) e iPad Air 11" (834 × 1194)
const MODI = [
  { nome: "Desktop", w: 0, h: 0, cornice: "" },
  { nome: "Mobile", w: 393, h: 852, cornice: "iphone" },
  { nome: "Tablet", w: 834, h: 1194, cornice: "ipad" },
] as const;
const BORDO = { iphone: 14, ipad: 22, "": 0 };
const TIP_VISTO = "libraccio:tip-device";

export default function DevicePreview() {
  const [i, setI] = useState(0);
  const [dentroIframe, setDentroIframe] = useState(false);
  const [tip, setTip] = useState(false);
  const [tasto, setTasto] = useState("⌘D");
  const [finestra, setFinestra] = useState({ w: 0, h: 0 });

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
    const misura = () => setFinestra({ w: innerWidth, h: innerHeight });
    misura();
    addEventListener("resize", misura);
    return () => removeEventListener("resize", misura);
  }, [i]);

  if (dentroIframe) return null;
  const modo = MODI[i];
  const bordo = BORDO[modo.cornice];
  // La cornice si rimpicciolisce per entrare nella finestra; dentro la pagina resta larga modo.w px
  const scala = modo.w ? Math.min(1, (finestra.h - 110) / (modo.h + 2 * bordo), (finestra.w - 48) / (modo.w + 2 * bordo)) : 1;

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
          <div
            className={`${styles.cornice} ${styles[modo.cornice]}`}
            style={{ width: modo.w + 2 * bordo, height: modo.h + 2 * bordo, padding: bordo, scale: String(scala) }}
          >
            {modo.cornice === "iphone" && (
              <>
                <span className={`${styles.tasto} ${styles.azione}`} />
                <span className={`${styles.tasto} ${styles.volSu}`} />
                <span className={`${styles.tasto} ${styles.volGiu}`} />
                <span className={`${styles.tasto} ${styles.accensione}`} />
              </>
            )}
            <div className={styles.schermo}>
              <iframe src={location.pathname} title={`Anteprima ${modo.nome}`} />
            </div>
            {modo.cornice === "iphone" && <span className={styles.isola} />}
            <span className={styles.home} />
          </div>
          <button type="button" className={styles.etichetta} onClick={cambia} aria-live="polite">
            {modo.nome} · {modo.w} px <kbd>{tasto}</kbd>
          </button>
        </div>
      )}
    </>
  );
}
