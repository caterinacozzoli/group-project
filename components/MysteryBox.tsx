import Image from "next/image";
import type promos from "@/data/promos.json";
import Button from "./Button";
import styles from "./MysteryBox.module.css";

export default function MysteryBox({ box }: { box: (typeof promos)["mysteryBox"] }) {
  return (
    <article className={styles.card}>
      <Image className={styles.img} src={box.immagine} alt="" width={361} height={268} sizes="(min-width: 768px) 720px, 100vw" />
      <div className={styles.barra}>
        <div>
          <h3 id="mystery-titolo" className={styles.titolo}>{box.titolo}</h3>
          <p className={styles.testo}>{box.testo}</p>
        </div>
        <Button href={box.href} describedBy="mystery-titolo">{box.cta}</Button>
      </div>
    </article>
  );
}
