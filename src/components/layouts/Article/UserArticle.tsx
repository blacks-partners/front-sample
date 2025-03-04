"use client";

import styles from "@/components/layouts/Article/article.module.css";
import { article } from "@/types/types";
import { formatDate } from "@/lib/formatDate";

interface Props {
  article: article;
}

const Article = ({ article }: Props) => {
  const { articleId, title, createdAt } = article;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a") === null) {
      location.href = `/article/${articleId.toString()}`;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.articleContainer} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className={styles.date}>{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className={styles.main}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {/* <div className={styles.footer}>
          <span className={styles.likes}>❤️ 148</span>
          <div className={styles.tags}>
            <span className={styles.tag}>Python</span>
            <span className={styles.tag}>HTML</span>
            <span className={styles.tag}>Django</span>
          </div>
        </div> */}
      </button>
    </div>
  );
};

export default Article;
