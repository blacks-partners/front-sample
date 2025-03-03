"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/EditArticle.module.css";
import { marked } from "marked";
import EditArticleHeader from "@/components/layouts/Header/EditArticleHeader";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { article } from "@/types/types";
import Loading from "@/components/layouts/Loading/Loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";

const EditArticle = () => {
  const { articleId } = useParams();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      location.href = "/";
    } else {
      const fetchData = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`
        );

        if (res.status === 400) {
          console.log(res.json());
        }

        if (res.status === 200) {
          const data: article = await res.json();
          setTitle(data.title);
          setContent(data.content);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [articleId]);

  useEffect(() => {
    const renderHtml = async () => {
      const html = await marked(content);
      setHtmlContent(html);
    };
    renderHtml();
  }, [content]);

  const onClick = async () => {
    if (title === "" || title.length <= 0) {
      toast.error("タイトルを入力してください");
    } else if (title.length > 50) {
      toast.error("タイトルは50字以内で入力してください");
    } else if (content === "" || content.length <= 0) {
      toast.error("本文を入力してください");
    } else if (content.length > 10000) {
    } else {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (res.status === 400) {
        toast.error("更新に失敗しました");
      }

      if (res.status === 204) {
        Cookies.set("toast", "更新が完了しました");
        location.href = `/article/${articleId}`;
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <EditArticleHeader onClick={onClick} />
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

export default EditArticle;
