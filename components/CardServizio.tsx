import Image from "next/image";
import type services from "@/data/services.json";
import Button from "./Button";
import styles from "./CardServizio.module.css";
import { asset } from "@/lib/asset";

type Servizio = (typeof services.daQuiTutto)[number];

export default function CardServizio({ s }: { s: Servizio }) {
  const titoloId = `servizio-${s.id}`;
  return (
    <article className={`${styles.card} ${s.logo ? styles.conLogo : ""}`}>
      <Image
        className={styles.img}
        src={asset(s.immagine)}
        alt=""
        width={s.img.w}
        height={s.img.h}
        sizes={`${s.img.w}px`}
        loading="eager"
        style={{ left: s.img.x, top: s.img.y, width: s.img.w, height: s.img.h }}
      />
      <div className={styles.titoli}>
        {s.logo && <Image src={asset(s.logo)} alt={s.logoAlt ?? ""} width={85} height={17} />}
        {s.occhiello && <p className={s.occhielloScuro ? styles.occhielloScuro : styles.occhiello}>{s.occhiello}</p>}
        <h3 id={titoloId} className={styles.titolo} style={s.titoloLargo ? { width: 202 } : undefined}>{s.titolo}</h3>
      </div>
      <Button href={s.href} freccia className={styles.cta} describedBy={titoloId}>{s.cta}</Button>
    </article>
  );
}
