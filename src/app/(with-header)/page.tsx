"use client";

import Article from "@/components/layouts/Article/Article";

import styles from "@/styles/Home.module.css";
import { article } from "@/types/types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function Home() {
  const [articles, setArticles] = useState<article[]>([]);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/articles`);
    const data = await res.json();

    setArticles(data);
  };

  const showCookieToast = () => {
    const cookieToast = Cookies.get("toast");
    Cookies.remove("toast");
    if (cookieToast) {
      const messages: { key: string; message: string } =
        JSON.parse(cookieToast);
      if (messages.key === "success") {
        toast.success(messages.message);
      } else if (messages.key === "error") {
        toast.error(messages.message);
      }
    }
  };

  useEffect(() => {
    fetchData().then(showCookieToast);
  }, []);

  return (
    <div>
      <div className={styles.contents}>
        {articles.map((article: article) => {
          return (
            <div className={styles.article} key={article.articleId}>
              <Article article={article} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
