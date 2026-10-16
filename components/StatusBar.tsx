import styles from "./StatusBar.module.css";
import { asset } from "@/lib/asset";

// Status bar iPhone del mockup Figma (2294:25888). Decorativa, solo mobile.
export default function StatusBar() {
  return (
    <div className={styles.bar} aria-hidden="true">
      <span className={styles.time}>9:41</span>
      <img src={asset("/assets/icons/statusbar-right.svg")} alt="" width={79} height={13} />
    </div>
  );
}
