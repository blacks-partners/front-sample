"use client";

import styles from "@/components/layouts/Header/editArticleHeader.module.css";
import Button from "@/components/elements/Button/Button";
import Link from "next/link";

interface Props {
  onClick: () => void;
}

const EditArticleHeader = ({ onClick }: Props) => {
  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <Link href="/">
            <span className={styles.logoInit}>R</span>AHA
          </Link>
        </div>

        <ul className={styles.headerRight}>
          <li>
            <Button text="投稿する" onClick={onClick} />
          </li>
        </ul>
      </header>
    </div>
  );
};

export default EditArticleHeader;
