"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Carousel.module.css";
import { asset } from "@/lib/asset";

type Props = { id: string; children: ReactNode[]; gap?: number };

// Scroll-snap nativo; frecce solo da desktop (≥1024px, nascoste via CSS)
export default function Carousel({ id, children, gap = 16 }: Props) {
  const list = useRef<HTMLUListElement>(null);
  const [inizio, setInizio] = useState(true);
  const [fine, setFine] = useState(false);

  const aggiorna = () => {
    const el = list.current;
    if (!el) return;
    setInizio(el.scrollLeft <= 1);
    setFine(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    const ro = new ResizeObserver(aggiorna);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, []);

  const scorri = (verso: 1 | -1) => {
    const el = list.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: verso * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <ul ref={list} id={id} role="list" className={styles.list} style={{ gap }} onScroll={aggiorna}>
        {children.map((child, i) => <li key={i} className={styles.item}>{child}</li>)}
      </ul>
      <button type="button" className={`${styles.freccia} ${styles.prev}`} aria-label="Precedenti" aria-controls={id} disabled={inizio} onClick={() => scorri(-1)}>
        <img src={asset("/assets/icons/arrow-right.svg")} alt="" width={24} height={24} />
      </button>
      <button type="button" className={`${styles.freccia} ${styles.next}`} aria-label="Successivi" aria-controls={id} disabled={fine} onClick={() => scorri(1)}>
        <img src={asset("/assets/icons/arrow-right.svg")} alt="" width={24} height={24} />
      </button>
    </div>
  );
}
