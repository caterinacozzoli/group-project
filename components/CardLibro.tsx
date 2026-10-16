import Image from "next/image";
import type books from "@/data/books.json";
import styles from "./CardLibro.module.css";
import { asset } from "@/lib/asset";

export type Libro = (typeof books.libri)[number];

export default function CardLibro({ libro }: { libro: Libro }) {
  return (
    <article className={styles.card}>
      <div className={styles.badges}>
        <p className={styles.stato}>{libro.etichetta}</p>
        {libro.rarita && <p className={styles.rarita}>{libro.rarita.toUpperCase()}</p>}
      </div>
      <div className={styles.copertina}>
        <Image src={asset(libro.copertina)} alt="" width={129} height={198} sizes="129px" />
      </div>
      <div className={styles.info}>
        <div className={styles.testi}>
          <h3 className={styles.titolo}><a href="#">{libro.titolo}</a></h3>
          <p className={styles.autore}>{libro.autore}</p>
          <p className={styles.prezzi}>
            <span className={styles.prezzo}><span className="sr-only">Prezzo attuale: </span>{libro.prezzo}</span>
            {libro.prezzoVecchio && (
              <s className={styles.vecchio}><span className="sr-only">Prezzo precedente: </span>{libro.prezzoVecchio}</s>
            )}
          </p>
        </div>
        <button type="button" className={styles.carrello} aria-label={`Aggiungi al carrello: ${libro.titolo}`}>
          <img src={asset("/assets/icons/bag-white.svg")} alt="" width={24} height={24} />
        </button>
      </div>
      <p className={styles.sconto}>{libro.sconto}</p>
    </article>
  );
}
