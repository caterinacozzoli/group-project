import Image from "next/image";
import type promos from "@/data/promos.json";
import styles from "./CardPromo.module.css";

type Promo = (typeof promos.offerte)[number];

export default function CardPromo({ promo }: { promo: Promo }) {
  return (
    <article className={styles.card}>
      <Image className={styles.img} src={promo.immagine} alt={promo.alt} width={219} height={146} sizes="219px" />
      <div className={styles.testi}>
        <p className={styles.scadenza}>{promo.scadenza}</p>
        <h3 className={styles.testo}><a href="#">{promo.testo}</a></h3>
        <p className={styles.evidenza}>{promo.evidenza}</p>
      </div>
    </article>
  );
}
