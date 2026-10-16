import styles from "./Button.module.css";

type Props = { href: string; children: string; freccia?: boolean; className?: string; describedBy?: string };

// Buttons / Secondary / Filled (arancio)
export default function Button({ href, children, freccia, className = "", describedBy }: Props) {
  return (
    <a href={href} className={`${styles.btn} ${className}`} aria-describedby={describedBy}>
      {children}
      {freccia && <img src="/assets/icons/arrow-right-white.svg" alt="" width={24} height={24} />}
    </a>
  );
}
