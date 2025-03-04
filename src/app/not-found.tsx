import Link from "next/link";
import styles from "@/styles/NotFound.module.css";
import { LoadingDots } from "@/components/elements/LoadingDots/LoadingDots";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        準備中
        <LoadingDots />
      </h1>
      <div className={styles.messageContainer}>
        <p className={styles.message}>申し訳ございません。</p>
        <p className={styles.message}>こちらのページはただいま準備中です。</p>
      </div>
      <Link href="/" className={styles.link}>
        トップページへ戻る →
      </Link>
    </div>
  );
}
