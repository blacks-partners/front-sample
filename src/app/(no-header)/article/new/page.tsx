"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/NewArticle.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { marked } from "marked";
import NewArticleHeader from "@/components/layouts/Header/NewArticleHeader";
import { tokenPayload } from "@/types/types";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const NewArticle = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      location.href = "/";
    } else {
      const decodeToken: tokenPayload = jwtDecode(token);
      setUserId(decodeToken.userId);
    }
  }, []);

  useEffect(() => {
    const renderHtml = async () => {
      const html = await marked(content);
      setHtmlContent(html);
    };
    renderHtml();
  }, [content]);

  const onClick = () => {
    if (title === "" || title.length <= 0) {
      toast.error("タイトルを入力してください");
    } else if (title.length > 50) {
      toast.error("タイトルは50字以内で入力してください");
    } else if (content === "" || content.length <= 0) {
      toast.error("本文を入力してください");
    } else if (content.length > 10000) {
      toast.error("本文は10000文字以内で入力してください");
    } else {
      const fetch = async () => {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_URL}/articles`,
          {
            method: "POST",
            body: JSON.stringify({
              title,
              content,
              userId,
            }),
          }
        );

        if (res.status === 400) {
          console.log(res.json());
        }

        if (res.status === 201) {
          const data: { articleId: number } = await res.json();
          Cookies.set("toast", "投稿が完了しました");
          location.href = `/article/${data.articleId}`;
        }
      };

      fetch();
    }
  };

  return (
    <div className={styles.container}>
      <NewArticleHeader onClick={onClick} />
      <div className={styles.newContainer}>
        <input
          className={styles.titleInput}
          placeholder="タイトルを入力してください"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.editorContainer}>
          <div className={styles.editor}>
            <textarea
              className={styles.textarea}
              placeholder="Markdownで記述してください..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className={styles.preview}>
            <div
              className={`markdown-body ${styles.markdown}`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticle;
