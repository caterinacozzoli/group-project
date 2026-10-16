import styles from "./TabBar.module.css";

export default function TabBar() {
  return (
    <header className={styles.bar}>
      <a href="/" className={styles.logo}>
        <img src="/assets/brand/logo-libraccio.png" alt="Libraccio.it" width={131} height={24} />
      </a>
      <nav aria-label="Principale" className={styles.icons}>
        <button type="button" className={styles.search} aria-label="Cerca">
          <img src="/assets/icons/search.svg" alt="" width={30} height={30} />
        </button>
        <a href="#" aria-label="Il mio profilo"><img src="/assets/icons/user.svg" alt="" width={30} height={30} /></a>
        <a href="#" aria-label="Preferiti"><img src="/assets/icons/bookmark.svg" alt="" width={30} height={30} /></a>
        <a href="#" aria-label="Carrello"><img src="/assets/icons/bag.svg" alt="" width={30} height={30} /></a>
      </nav>
    </header>
  );
}
