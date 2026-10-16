"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import books from "@/data/books.json";
import user from "@/data/user.json";
import { rispondi, type Risposta } from "@/lib/libby";
import styles from "./Libby.module.css";
import { asset } from "@/lib/asset";

type Msg = { id: number; da: "utente" | "libby"; testo?: string; risposta?: Risposta };

const SUGGERIMENTI = ["Qualcosa di leggero", "Un giallo", "Sotto i 10 €", "Sorprendimi"];

export default function Libby() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [testo, setTesto] = useState("");
  const [scrive, setScrive] = useState(false);
  const [aperta, setAperta] = useState(false);
  const consigliati = useRef<string[]>([]);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [msgs, scrive]);

  const apri = () => {
    if (!msgs.length) {
      setMsgs([{
        id: 0,
        da: "libby",
        testo: `Ciao ${user.nome}! Sono Libby, la tua libraia. Dimmi che voglia hai, un genere, un mood o un budget, e ti consiglio al massimo tre libri.`,
      }]);
    }
    dialog.current?.showModal();
    setAperta(true);
    input.current?.focus();
  };

  const invia = (valore: string) => {
    const t = valore.trim();
    if (!t || scrive) return;
    const turno = msgs.filter((m) => m.da === "utente").length;
    setMsgs((m) => [...m, { id: Date.now(), da: "utente", testo: t }]);
    setTesto("");
    setScrive(true);
    // ponytail: pausa finta "sta scrivendo"; con l'API diventa l'attesa reale della risposta
    setTimeout(() => {
      const r = rispondi(t, { catalogo: books.libri, utente: user, giaConsigliati: consigliati.current, turno });
      consigliati.current.push(...r.consigli.map((c) => c.libro.id));
      setMsgs((m) => [...m, { id: Date.now() + 1, da: "libby", risposta: r }]);
      setScrive(false);
    }, 600);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    invia(testo);
  };

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
        <img src={asset("/assets/brand/libby.svg")} alt="" width={76} height={76} />
      </button>

      <dialog id="libby-panel" ref={dialog} className={styles.panel} aria-labelledby="libby-titolo" onClose={() => setAperta(false)}>
        <header className={styles.head}>
          <img className={styles.avatar} src={asset("/assets/brand/libby.svg")} alt="" width={44} height={44} />
          <div className={styles.headTesti}>
            <h2 id="libby-titolo" className={styles.titolo}>Libby</h2>
            <p className={styles.sottotitolo}>la tua libraia digitale</p>
          </div>
          <button type="button" className={styles.chiudi} aria-label="Chiudi chat" onClick={() => dialog.current?.close()}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div ref={log} className={styles.log} role="log" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={m.da === "utente" ? styles.utente : styles.libby}>
              <span className="sr-only">{m.da === "utente" ? "Tu: " : "Libby: "}</span>
              {m.testo && <p>{m.testo}</p>}
              {m.risposta && <RispostaLibby r={m.risposta} />}
            </div>
          ))}
          {scrive && <p className={styles.scrive} aria-hidden="true"><span /><span /><span /></p>}
        </div>

        {msgs.length <= 1 && (
          <ul role="list" className={styles.suggerimenti}>
            {SUGGERIMENTI.map((s) => (
              <li key={s}><button type="button" className={styles.chip} onClick={() => invia(s)}>{s}</button></li>
            ))}
          </ul>
        )}

        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="libby-input" className="sr-only">Scrivi un messaggio a Libby</label>
          <input
            id="libby-input"
            ref={input}
            className={styles.input}
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="Scrivi qualcosa"
            autoComplete="off"
          />
          <button type="submit" className={styles.invia} aria-label="Invia">
            <img src={asset("/assets/icons/arrow-right-white.svg")} alt="" width={24} height={24} />
          </button>
        </form>
      </dialog>
    </>
  );
}

function RispostaLibby({ r }: { r: Risposta }) {
  return (
    <>
      <p>{r.intro}</p>
      {r.consigli.length > 0 && (
        <ul role="list" className={styles.consigli}>
          {r.consigli.map(({ libro, perche, promo }) => (
            <li key={libro.id} className={styles.consiglio}>
              <Image src={asset(libro.copertina)} alt="" width={48} height={74} />
              <div>
                <p className={styles.libroTitolo}><a href="#">{libro.titolo}</a></p>
                <p className={styles.libroAutore}>{libro.autore}</p>
                <p className={styles.perche}>{perche}</p>
                <p className={styles.promo}>{promo}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p>{r.chiusura}</p>
    </>
  );
}
