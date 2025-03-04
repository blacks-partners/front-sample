import Link from "next/link";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link href="/terms" className={styles.link}>
          ご利用にあたって
        </Link>
        <Link href="/privacy" className={styles.link}>
          プライバシーポリシー
        </Link>
        <Link href="/faq" className={styles.link}>
          よくあるご質問
        </Link>
        <Link href="/contact" className={styles.link}>
          お問い合わせ
        </Link>
      </nav>
      <div className={styles.copyright}>© Raha</div>
    </footer>
  );
};
