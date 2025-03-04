"use client";

import Image from "next/image";
import styles from "@/components/layouts/Article/article.module.css";
import Link from "next/link";
import { article } from "@/types/types";
import { formatDate } from "@/lib/formatDate";

interface Props {
  article: article;
}

const Article = ({ article }: Props) => {
  const { articleId, user, title, createdAt } = article;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a") === null) {
      location.href = `/article/${articleId.toString()}`;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.articleContainer} onClick={handleClick}>
        <div className={styles.header}>
          <Image
            src={user.imgUrl || "/icon.png"}
            alt=""
            width={40}
            height={40}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <Link href={`/user/${user.userId}`} className={styles.link}>
              <span className={styles.name}>{user.name}</span>
            </Link>
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
