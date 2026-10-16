"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import books from "@/data/books.json";
import user from "@/data/user.json";
import { rispondi, type Consiglio, type Risposta } from "@/lib/libby";
import { asset } from "@/lib/asset";
import styles from "./Libby.module.css";

type Msg =
  | { id: number; da: "benvenuto" }
  | { id: number; da: "utente"; testo: string }
  | { id: number; da: "libby"; risposta: Risposta };

const RAPIDE_INIZIO = ["Qualcosa di leggero", "Un giallo", "Sotto i 10 €", "Sorprendimi"];
const RAPIDE_DOPO = ["Altri 3 così", "Più leggero", "Sotto i 10 €", "Sorprendimi"];
const SOGLIA_CHIUSURA = 110; // px di trascinamento verso il basso per chiudere
const DURATA_CHIUSURA = 200;

const avatar = asset("/assets/brand/libby.svg");
const riduciMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const telefono = () => matchMedia("(max-width: 767px)").matches;

export default function Libby() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const consigliati = useRef<string[]>([]);
  const ultimaRichiesta = useRef("");
  const inizioTrascina = useRef<number | null>(null);
  const spostamento = useRef(0);
  const rapideRef = useRef<HTMLDivElement>(null);
  const inFondo = useRef(true);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [testo, setTesto] = useState("");
  const [scrive, setScrive] = useState(false);
  const [aperta, setAperta] = useState(false);
  const [chiusura, setChiusura] = useState(false);
  const [trascina, setTrascina] = useState(0);
  const [nelCarrello, setNelCarrello] = useState<string[]>([]);
  const [annuncio, setAnnuncio] = useState("");

  // Messaggio nuovo: le risposte di Libby si leggono dall'inizio, il resto scorre in fondo
  useEffect(() => {
    const el = log.current;
    if (!el) return;
    const ultimo = msgs[msgs.length - 1];
    if (ultimo?.da !== "utente" && !inFondo.current) return; // sta rileggendo più su: non lo spostiamo
    const turno = el.querySelector<HTMLElement>("[data-ultimo-libby]");
    const comportamento = riduciMovimento() ? "auto" : "smooth";
    if (ultimo?.da === "libby" && turno) {
      const top = el.scrollTop + turno.getBoundingClientRect().top - el.getBoundingClientRect().top - 12;
      el.scrollTo({ top, behavior: comportamento });
    }
    else el.scrollTo({ top: el.scrollHeight, behavior: comportamento });
  }, [msgs, scrive]);

  // Tastiera iOS: il pannello segue l'area visibile così la barra di scrittura resta sopra la tastiera
  useEffect(() => {
    const vv = window.visualViewport;
    const el = dialog.current;
    if (!aperta || !vv || !el) return;
    const aggiorna = () => {
      if (vv.scale > 1) return; // non combattere lo zoom con due dita
      el.style.setProperty("--vv-h", `${vv.height}px`);
      el.style.setProperty("--vv-top", `${vv.offsetTop}px`);
      el.toggleAttribute("data-tastiera", vv.height < window.innerHeight * 0.8);
    };
    aggiorna();
    vv.addEventListener("resize", aggiorna);
    vv.addEventListener("scroll", aggiorna);
    return () => {
      vv.removeEventListener("resize", aggiorna);
      vv.removeEventListener("scroll", aggiorna);
    };
  }, [aperta]);

  const apri = () => {
    if (!msgs.length) setMsgs([{ id: 0, da: "benvenuto" }]);
    dialog.current?.showModal();
    document.documentElement.dataset.libbyAperta = "";
    setAperta(true);
    // Su telefono non apriamo la tastiera da soli: prima si legge, poi si scrive
    if (!telefono()) input.current?.focus();
    else requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>("[data-benvenuto]")?.focus());
  };

  const chiudi = () => {
    if (riduciMovimento()) return dialog.current?.close();
    setChiusura(true);
    setTimeout(() => dialog.current?.close(), DURATA_CHIUSURA);
  };

  const dopoChiusura = () => {
    delete document.documentElement.dataset.libbyAperta;
    setAperta(false);
    setChiusura(false);
    setTrascina(0);
  };

  const invia = (mostrato: string, richiesta = mostrato) => {
    const t = mostrato.trim();
    if (!t || scrive) return;
    const domanda = richiesta.trim();
    ultimaRichiesta.current = domanda;
    const turno = msgs.filter((m) => m.da === "utente").length;
    setMsgs((m) => [...m, { id: Date.now(), da: "utente", testo: t }]);
    setTesto("");
    setScrive(true);
    // ponytail: pausa finta "sta cercando"; con l'API diventa l'attesa reale della risposta
    setTimeout(() => {
      const r = rispondi(domanda, { catalogo: books.libri, utente: user, giaConsigliati: consigliati.current, turno });
      consigliati.current.push(...r.consigli.map((c) => c.libro.id));
      setMsgs((m) => [...m, { id: Date.now() + 1, da: "libby", risposta: r }]);
      const titoli = r.consigli.map((c) => `${c.libro.titolo} di ${c.libro.autore}`).join(", ");
      setAnnuncio(`Libby: ${r.intro} ${r.consigli.length ? `${r.consigli.length} libri: ${titoli}.` : ""} ${r.chiusura}`);
      setScrive(false);
    }, 700);
  };

  // Le risposte rapide costruiscono la domanda sopra quella precedente
  const rapida = (etichetta: string) => {
    if (scrive) return;
    if (telefono()) rapideRef.current?.focus();
    else input.current?.focus();
    const prima = ultimaRichiesta.current;
    if (etichetta === "Altri 3 così") return invia(etichetta, prima || "sorprendimi");
    if (etichetta === "Più leggero") return invia(etichetta, `${prima} leggero`);
    if (etichetta === "Sotto i 10 €") return invia(etichetta, `${prima} sotto i 10 euro`);
    invia(etichetta);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!testo.trim() || scrive) return;
    invia(testo);
  };

  const aggiungi = (c: Consiglio) => {
    setNelCarrello((ids) => (ids.includes(c.libro.id) ? ids : [...ids, c.libro.id]));
    setAnnuncio(`${c.libro.titolo} aggiunto al carrello`);
  };

  // Trascina giù l'intestazione per chiudere (solo telefono). Restano X ed Esc come alternative.
  const giu = (e: PointerEvent<HTMLElement>) => {
    if (!telefono() || (e.target as HTMLElement).closest("button")) return;
    inizioTrascina.current = e.clientY;
    spostamento.current = 0;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };
  const muovi = (e: PointerEvent<HTMLElement>) => {
    if (inizioTrascina.current === null) return;
    const dy = e.clientY - inizioTrascina.current;
    spostamento.current = dy > 6 ? dy : 0; // piccola soglia per non scambiare un tocco per un trascinamento
    setTrascina(spostamento.current);
  };
  const su = () => {
    if (inizioTrascina.current === null) return;
    inizioTrascina.current = null;
    if (spostamento.current > SOGLIA_CHIUSURA) chiudi();
    else setTrascina(0);
  };

  const ultimoLibby = msgs.reduce((acc, m, i) => (m.da === "libby" ? i : acc), -1);
  const rapide = msgs.some((m) => m.da === "libby") ? RAPIDE_DOPO : RAPIDE_INIZIO;

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-label="Apri chat con Libby"
        aria-haspopup="dialog"
        aria-expanded={aperta}
        aria-controls="libby-panel"
        onClick={apri}
      >
        <img src={avatar} alt="" width={76} height={76} />
      </button>

      <dialog
        id="libby-panel"
        ref={dialog}
        className={`${styles.panel} ${chiusura ? styles.chiusura : ""} ${trascina ? styles.trascina : ""}`}
        style={trascina ? { translate: `0 ${trascina}px` } : undefined}
        aria-labelledby="libby-titolo"
        onCancel={(e) => { e.preventDefault(); chiudi(); }}
        onClose={dopoChiusura}
      >
        <header className={styles.head} onPointerDown={giu} onPointerMove={muovi} onPointerUp={su} onPointerCancel={su}>
          <span className={styles.maniglia} aria-hidden="true" />
          <span className={styles.avatarPiccolo}><img src={avatar} alt="" width={40} height={40} /></span>
          <div className={styles.headTesti}>
            <h2 id="libby-titolo" className={styles.titolo}>Libby</h2>
            <p className={styles.sottotitolo}>La tua libraia · Libraccio.it</p>
          </div>
          <button type="button" className={styles.chiudi} aria-label="Chiudi chat" onClick={chiudi}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* La cronologia si sfoglia; gli annunci passano dal riassunto in role="status" qui sotto */}
        <div
          ref={log}
          className={styles.log}
          role="log"
          aria-live="off"
          onScroll={(e) => {
            const el = e.currentTarget;
            inFondo.current = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
          }}
        >
          {msgs.map((m, i) => {
            if (m.da === "benvenuto") return <Benvenuto key={m.id} />;
            if (m.da === "utente") {
              return (
                <div key={m.id} className={styles.turnoUtente}>
                  <p className={styles.bolla}><span className="sr-only">Tu: </span>{m.testo}</p>
                </div>
              );
            }
            return (
              <div key={m.id} className={styles.turnoLibby} data-ultimo-libby={i === ultimoLibby ? "" : undefined}>
                <span className={styles.avatarMini} aria-hidden="true"><img src={avatar} alt="" width={28} height={28} /></span>
                <RispostaLibby r={m.risposta} nelCarrello={nelCarrello} onAggiungi={aggiungi} />
              </div>
            );
          })}
          {scrive && (
            <div className={styles.turnoLibby} aria-hidden="true">
              <span className={styles.avatarMini}><img src={avatar} alt="" width={28} height={28} /></span>
              <p className={styles.cerca}><span className={styles.puntini}><i /><i /><i /></span>Sfoglio gli scaffali…</p>
            </div>
          )}
        </div>

        <p className="sr-only" role="status">{annuncio}</p>

        <div className={styles.piede}>
          <div ref={rapideRef} role="group" aria-label="Risposte rapide" tabIndex={-1} className={styles.rapideGruppo}>
            <ul role="list" className={styles.rapide}>
              {rapide.map((r) => (
                <li key={r}>
                  <button type="button" className={styles.rapida} onClick={() => rapida(r)} aria-disabled={scrive || undefined}>{r}</button>
                </li>
              ))}
            </ul>
          </div>
          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor="libby-input" className="sr-only">Scrivi un messaggio a Libby</label>
            <input
              id="libby-input"
              ref={input}
              className={styles.input}
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              placeholder="Chiedi un consiglio a Libby"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button
              type="submit"
              className={styles.invia}
              aria-label="Invia"
              aria-disabled={!testo.trim() || scrive || undefined}
              onMouseDown={(e) => e.preventDefault()} // il fuoco resta nel campo: la tastiera non si chiude
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

function Benvenuto() {
  return (
    <div className={styles.benvenuto}>
      <span className={styles.avatarGrande} aria-hidden="true"><img src={avatar} alt="" width={72} height={72} /></span>
      <h3 className={styles.benvenutoTitolo} tabIndex={-1} data-benvenuto="">Ciao {user.nome}, cosa leggiamo oggi?</h3>
      <p className={styles.benvenutoTesto}>
        Dimmi un genere, un mood o quanto vuoi spendere: ti propongo al massimo tre libri, scelti tra le offerte del momento.
      </p>
    </div>
  );
}

type RispostaProps = { r: Risposta; nelCarrello: string[]; onAggiungi: (c: Consiglio) => void };

function RispostaLibby({ r, nelCarrello, onAggiungi }: RispostaProps) {
  return (
    <div className={styles.risposta}>
      <span className="sr-only">Libby: </span>
      <p>{r.intro}</p>
      {r.consigli.length > 0 && (
        <ul role="list" className={styles.libri}>
          {r.consigli.map((c, i) => {
            const { libro, perche } = c;
            const aggiunto = nelCarrello.includes(libro.id);
            return (
              <li key={libro.id} className={styles.libro} style={{ "--i": i } as React.CSSProperties}>
                <Image className={styles.copertina} src={asset(libro.copertina)} alt="" width={64} height={98} sizes="64px" />
                <div className={styles.libroInfo}>
                  <p className={styles.stato}>{libro.etichetta}</p>
                  <p className={styles.libroTitolo}><a href="#">{libro.titolo}</a></p>
                  <p className={styles.libroAutore}>{libro.autore}</p>
                  <p className={styles.perche}>{perche}</p>
                  <div className={styles.libroPiede}>
                    <p className={styles.prezzi}>
                      <span className={styles.prezzo}><span className="sr-only">Prezzo attuale: </span>{libro.prezzo}</span>
                      {libro.prezzoVecchio && (
                        <s className={styles.vecchio}><span className="sr-only">Prezzo precedente: </span>{libro.prezzoVecchio}</s>
                      )}
                      <span className={styles.sconto}>{libro.sconto}</span>
                    </p>
                    <button
                      type="button"
                      className={`${styles.carrello} ${aggiunto ? styles.aggiunto : ""}`}
                      aria-label={aggiunto ? `Nel carrello: ${libro.titolo}` : `Aggiungi al carrello: ${libro.titolo}`}
                      onClick={() => onAggiungi(c)}
                    >
                      {aggiunto ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <img src={asset("/assets/icons/bag-white.svg")} alt="" width={22} height={22} />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p>{r.chiusura}</p>
    </div>
  );
}
