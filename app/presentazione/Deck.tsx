"use client";

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { asset } from "@/lib/asset";
import s from "./presentazione.module.css";

type Blocco =
  | string
  | { sottotitolo: string }
  | { passi: string[] }
  | { codice: string }
  | { immagine: string; alt: string; w: number; h: number };
export type Approfondimento = { titolo: string; contenuto: Blocco[]; link?: { testo: string; url: string }[] };
export type Slide = { titolo: string; fase?: string; sintesi?: string; corpo?: ReactNode; layout?: string };

// Sotto i 1024 px (o 540 di altezza) niente tela 16:9: le slide si leggono una sotto l'altra e le frecce
// scorrono la pagina. Così anche lo zoom al 200% ingrandisce davvero il testo. Stessa soglia nel CSS.
const FLUSSO = "(max-width: 1023px), (max-height: 539px)";

function chiudiRiquadro(d: HTMLDetailsElement) {
  d.open = false;
  delete d.dataset.hover;
}

// I `backtick` del JSON diventano <code>
const testo = (t: string) => t.split(/`([^`]+)`/).map((p, k) => (k % 2 ? <code key={k}>{p}</code> : p));

export default function Deck({
  slides,
  approfondimenti,
  className,
}: {
  slides: Slide[];
  approfondimenti: Record<string, Approfondimento>;
  className: string;
}) {
  const N = slides.length;
  const [i, setI] = useState(0);
  const [annuncio, setAnnuncio] = useState("");
  const [aperto, setAperto] = useState<string | null>(null);
  const [continua, setContinua] = useState(false);
  const radice = useRef<HTMLDivElement>(null);
  const pannello = useRef<HTMLDialogElement>(null);
  const corrente = useRef(0);
  const piatta = useRef(false);
  const spostaFocus = useRef(false);
  corrente.current = i;
  piatta.current = continua;
  // Slide impilate: schermo piccolo o "Vista continua" (con lo zoom del browser il testo cresce davvero)
  const flusso = () => piatta.current || matchMedia(FLUSSO).matches;

  const vai = (n: number) => {
    const j = Math.max(0, Math.min(N - 1, n));
    if (j === corrente.current) return;
    // Se il focus era dentro la slide che sparisce, passa alla nuova (che si annuncia da sola)
    spostaFocus.current = !!document.activeElement?.closest("[aria-roledescription='slide']");
    setAnnuncio(spostaFocus.current ? "" : `Slide ${j + 1} di ${N}: ${slides[j].titolo}`);
    setI(j);
    history.replaceState(null, "", `#${j + 1}`);
  };

  useEffect(() => {
    if (!spostaFocus.current) return;
    spostaFocus.current = false;
    // In vista continua si scorre fino alla slide corrente; sulla tela la pagina non deve muoversi
    document.getElementById(String(i + 1))?.focus({ preventScroll: !piatta.current });
  }, [i, continua]);

  // Scala della tela in JS: in Safari tan(atan2()) con vw/dvh dà 0 o valori sbagliati
  useEffect(() => {
    const scala = () => radice.current?.style.setProperty("--scala", String(Math.min(innerWidth / 1920, innerHeight / 1080)));
    scala();
    window.addEventListener("resize", scala);
    return () => window.removeEventListener("resize", scala);
  }, []);

  // Swipe orizzontale (trackpad o dito) cambia slide; lo scorrimento verticale resta agli approfondimenti
  useEffect(() => {
    let ultimo = 0;
    let x0 = 0;
    let y0 = 0;
    const libera = () => !pannello.current?.open && !flusso();
    const rotella = (e: WheelEvent) => {
      if (!libera() || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); // niente "pagina indietro" del browser
      if (Math.abs(e.deltaX) < 4) return;
      // ponytail: un gesto = una slide, finché gli eventi d'inerzia arrivano a meno di 250 ms l'uno dall'altro
      const nuovo = e.timeStamp - ultimo > 250;
      ultimo = e.timeStamp;
      if (nuovo) vai(corrente.current + Math.sign(e.deltaX));
    };
    const tocca = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const lascia = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0;
      if (libera() && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.changedTouches[0].clientY - y0)) vai(corrente.current - Math.sign(dx));
    };
    window.addEventListener("wheel", rotella, { passive: false });
    window.addEventListener("touchstart", tocca, { passive: true });
    window.addEventListener("touchend", lascia);
    return () => {
      window.removeEventListener("wheel", rotella);
      window.removeEventListener("touchstart", tocca);
      window.removeEventListener("touchend", lascia);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // #7 nell'URL apre la settima slide
  useEffect(() => {
    const leggi = () => {
      const n = Number(location.hash.slice(1));
      if (Number.isInteger(n) && n >= 1 && n <= N) setI(n - 1);
      setAnnuncio("");
    };
    leggi();
    window.addEventListener("hashchange", leggi);
    return () => window.removeEventListener("hashchange", leggi);
  }, [N]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc chiude i riquadri aperti dal mouse (non quando chiude il pannello)
      if (e.key === "Escape" && !pannello.current?.open) document.querySelectorAll<HTMLDetailsElement>("details[data-hover]").forEach(chiudiRiquadro);
      if (e.metaKey || e.ctrlKey || e.altKey || pannello.current?.open || flusso()) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown") vai(corrente.current + 1);
      else if (k === "ArrowLeft" || k === "PageUp") vai(corrente.current - 1);
      else if (k === "Home") vai(0);
      else if (k === "End") vai(N - 1);
      else if (k === "f" || k === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.().catch(() => {});
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // vai legge l'indice dal ref, quindi la prima versione basta
  }, [N]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (aperto) pannello.current?.showModal();
  }, [aperto]);

  // "Cosa abbiamo imparato" sono <details>: il mouse li apre passando sopra, clic o focus li fissano aperti
  const riquadro = (e: { target: EventTarget; relatedTarget: EventTarget | null }, sel: string) => {
    const d = (e.target as Element).closest<HTMLDetailsElement>(sel);
    return d && !d.contains(e.relatedTarget as Node) ? d : null;
  };
  const sopra = (e: PointerEvent) => {
    const d = riquadro(e, "details");
    if (e.pointerType !== "mouse" || !d || d.open || pannello.current?.open) return;
    d.open = true;
    d.dataset.hover = "";
  };
  const fuori = (e: PointerEvent) => {
    const d = riquadro(e, "details[data-hover]");
    if (d && !pannello.current?.open && !d.contains(document.activeElement)) chiudiRiquadro(d);
  };
  const fissa = (e: FocusEvent | MouseEvent) => {
    const d = (e.target as Element).closest<HTMLDetailsElement>("details[data-hover]");
    if (!d) return;
    delete d.dataset.hover;
    // Clic sul titolo di un riquadro aperto dal mouse: resta aperto invece di richiudersi
    if (e.type === "click" && (e.target as Element).closest("summary")) e.preventDefault();
  };

  // I bottoni dell'approfondimento sono statici con data-piu: un solo listener per tutti
  const apri = (e: MouseEvent) => {
    fissa(e);
    const b = (e.target as Element).closest<HTMLElement>("[data-piu]");
    if (b?.dataset.piu) setAperto(b.dataset.piu);
  };
  const chiudi = () => pannello.current?.close();
  const a = aperto ? approfondimenti[aperto] : null;

  return (
    <div
      ref={radice}
      className={`${s.deck} ${className}`}
      data-continua={continua || undefined}
      onClick={apri}
      onFocus={fissa}
      onPointerOver={sopra}
      onPointerOut={fuori}
    >
      {/* Solo dove c'è la tela: impila tutte le slide, così lo zoom del browser ingrandisce il testo */}
      <button
        type="button"
        className={s.vista}
        aria-pressed={continua}
        onClick={() => {
          setContinua(!continua);
          if (!continua) spostaFocus.current = true;
        }}
      >
        Vista continua
      </button>
      <main className={s.tela}>
        {/* Le slide spente sono display:none: l'h1 resta fuori, sempre presente */}
        <h1 className="sr-only">Presentazione: {slides[0].titolo}</h1>
        <p className={s.testata}>Master Talent Garden · Settimana AI</p>
        {slides.map((sl, k) => (
            <section
              key={k}
              id={String(k + 1)}
              className={`${s.slide} ${sl.layout ?? ""}`}
              data-attiva={k === i || undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${k + 1} di ${N}: ${sl.titolo}`}
              tabIndex={-1}
            >
              <span className={s.tratto} />
              <h2 className={s.titolo}>{sl.titolo}</h2>
              {/* Dopo l'h2 nel sorgente (come le etichette delle voci): sulla tela il CSS la porta in alto a sinistra */}
              {sl.fase && <p className={s.fase}>{sl.fase}</p>}
              {sl.sintesi && <p className={s.sintesi}>{sl.sintesi}</p>}
              {sl.corpo && <div className={s.corpo}>{sl.corpo}</div>}
            </section>
        ))}
      </main>

      {/* aria-disabled e non disabled: a fine corsa il focus resta sul bottone invece di cadere sul body */}
      <nav className={s.nav} aria-label="Slide">
        <button type="button" onClick={() => vai(i - 1)} aria-disabled={i === 0} aria-label="Slide precedente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
        </button>
        <p className={s.contatore}>
          <span className="sr-only">Slide </span>
          {i + 1}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> di </span>
          {N}
        </p>
        <button type="button" onClick={() => vai(i + 1)} aria-disabled={i === N - 1} aria-label="Slide successiva">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </button>
      </nav>
      <p className="sr-only" role="status" aria-atomic="true">{annuncio}</p>

      <dialog
        ref={pannello}
        className={s.pannello}
        aria-labelledby="approfondimento-titolo"
        onClose={() => setAperto(null)}
        onClick={(e) => e.target === e.currentTarget && chiudi()}
      >
        <div className={s.pannelloInterno}>
          <button type="button" className={s.chiudi} onClick={chiudi} aria-label="Chiudi approfondimento">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          {a && (
            <>
              <p className={s.etichetta}>Approfondimento</p>
              <h2 id="approfondimento-titolo" className={s.pannelloTitolo}>{a.titolo}</h2>
              {a.contenuto.map((b, k) =>
                typeof b === "string" ? (
                  <p key={k}>{testo(b)}</p>
                ) : "sottotitolo" in b ? (
                  <h3 key={k} className={s.pannelloSotto}>{b.sottotitolo}</h3>
                ) : "passi" in b ? (
                  <ol key={k}>{b.passi.map((p, j) => <li key={j}>{testo(p)}</li>)}</ol>
                ) : "immagine" in b ? (
                  <img key={k} src={asset(b.immagine)} alt={b.alt} width={b.w} height={b.h} />
                ) : (
                  <pre key={k}><code>{b.codice}</code></pre>
                ),
              )}
              {a.link && (
                <ul role="list" className={s.link}>
                  {a.link.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.testo}
                        <span aria-hidden="true"> ↗</span>
                        <span className="sr-only"> (si apre in una nuova scheda)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
