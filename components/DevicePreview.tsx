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

export default function DevicePreview() {
  const [i, setI] = useState(0);
  const [dentroIframe, setDentroIframe] = useState(false);

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setDentroIframe(inIframe);
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "d") return;
      e.preventDefault(); // blocca "aggiungi ai preferiti"
      if (inIframe) window.parent.postMessage("libraccio:cambia-device", location.origin);
      else setI((x) => (x + 1) % MODI.length);
    };
    const onMsg = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data === "libraccio:cambia-device") setI((x) => (x + 1) % MODI.length);
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

  // In desktop non mostra nulla: la pagina resta identica al design
  if (!modo.w) return null;
  return (
    <div className={styles.overlay}>
      <iframe className={styles.device} style={{ width: modo.w }} src={location.pathname} title={`Anteprima ${modo.nome}`} />
      <p className={styles.etichetta} role="status">{modo.nome} · {modo.w} px <kbd>⌘D</kbd></p>
    </div>
  );
}
