import Image from "next/image";
import type user from "@/data/user.json";
import styles from "./CardProfilo.module.css";
import { asset } from "@/lib/asset";

export default function CardProfilo({ utente }: { utente: typeof user }) {
  return (
    <section className={styles.card} aria-labelledby="profilo-titolo">
      <h2 id="profilo-titolo" className="sr-only">Il tuo profilo</h2>
      <span className={styles.cerchi} aria-hidden="true" />
      <div className={styles.head}>
        <Image className={styles.avatar} src={asset(utente.avatar)} alt="" width={79} height={79} />
        <div className={styles.nomi}>
          <p className={styles.nome}>{utente.nomeCompleto}</p>
          <p className={styles.username}>{utente.username}</p>
        </div>
      </div>
      <ul role="list" className={styles.pills}>
        <li className={styles.pill}>
          <img src={asset("/assets/icons/stars.svg")} alt="" width={24} height={24} />
          {utente.punti}<span className="sr-only"> punti</span>
        </li>
        <li className={styles.pill}><img src={asset("/assets/icons/fire.svg")} alt="" width={24} height={24} />{utente.streak}</li>
        <li className={styles.pill}><img src={asset("/assets/icons/notebook.svg")} alt="" width={24} height={24} />{utente.livello}</li>
      </ul>
      <div className={styles.stepper}>
        <p className={styles.livelli} aria-hidden="true">
          <span className={styles.attuale}>{utente.livello}</span>
          <span className={styles.prossimo}>{utente.prossimoLivello}</span>
        </p>
        <div
          className={styles.barra}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-valuetext={`Livello attuale: ${utente.livello}. Prossimo: ${utente.prossimoLivello}`}
        >
          <span className={styles.pallino} />
        </div>
      </div>
    </section>
  );
}
