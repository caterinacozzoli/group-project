import Image from "next/image";
import type services from "@/data/services.json";
import styles from "./Footer.module.css";
import { asset } from "@/lib/asset";

export default function Footer({ servizi }: { servizi: (typeof services)["footer"] }) {
  return (
    <footer className={styles.footer}>
      <ul role="list" className={styles.servizi}>
        {servizi.map((s) => (
          <li key={s.id} className={`${styles.servizio} ${styles[s.tema]}`}>
            <div className={styles.testi}>
              <Image src={asset(s.logo)} alt="" width={s.logoW} height={s.logoH} />
              <div>
                <h3 className={styles.titolo}>{s.titolo}</h3>
                <p className={styles.descr}>{s.testo}</p>
              </div>
            </div>
            <a href={s.href} className={styles.freccia} aria-label={s.titolo}>
              <img src={asset("/assets/icons/arrow-right-outline-white.svg")} alt="" width={24} height={24} />
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.logo}>
        <a href={asset("/")}>
          <Image src={asset("/assets/brand/logo-libraccio-footer.png")} alt="Libraccio.it" width={144} height={24} />
        </a>
      </div>
    </footer>
  );
}
