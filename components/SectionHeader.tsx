import styles from "./SectionHeader.module.css";
import { asset } from "@/lib/asset";

type Props = { id: string; titolo: string; vediTutti?: boolean };

export default function SectionHeader({ id, titolo, vediTutti }: Props) {
  return (
    <div className={vediTutti ? styles.head : `${styles.head} ${styles.semplice}`}>
      <h2 id={id} className={styles.titolo}>{titolo}</h2>
      {vediTutti && (
        <a href="#" className={styles.vedi} aria-label={`Vedi tutti: ${titolo}`}>
          <img src={asset("/assets/icons/arrow-right.svg")} alt="" width={24} height={24} />
        </a>
      )}
    </div>
  );
}
