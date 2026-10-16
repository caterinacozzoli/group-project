import styles from "./Chips.module.css";

export default function Chips({ items }: { items: string[] }) {
  return (
    <nav aria-label="Categorie" className={styles.scroller}>
      <ul role="list" className={styles.list}>
        {items.map((label) => (
          <li key={label}><a href="#" className={styles.chip}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
