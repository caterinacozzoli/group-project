import styles from "./TabBar.module.css";
import { asset } from "@/lib/asset";

export default function TabBar() {
  return (
    <header className={styles.bar}>
      <a href={asset("/")} className={styles.logo}>
        <img src={asset("/assets/brand/logo-libraccio.png")} alt="Libraccio.it" width={131} height={24} />
      </a>
      <nav aria-label="Principale" className={styles.icons}>
        <button type="button" className={styles.search} aria-label="Cerca">
          <img src={asset("/assets/icons/search.svg")} alt="" width={30} height={30} />
        </button>
        <a href="#" aria-label="Il mio profilo"><img src={asset("/assets/icons/user.svg")} alt="" width={30} height={30} /></a>
        <a href="#" aria-label="Preferiti"><img src={asset("/assets/icons/bookmark.svg")} alt="" width={30} height={30} /></a>
        <a href="#" aria-label="Carrello"><img src={asset("/assets/icons/bag.svg")} alt="" width={30} height={30} /></a>
      </nav>
    </header>
  );
}
