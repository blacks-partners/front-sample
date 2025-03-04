"use client";

import Image from "next/image";
import styles from "@/styles/ArticleDetail.module.css";
import Link from "next/link";
import { IconContext } from "react-icons";
import { HiDotsHorizontal } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { article, tokenPayload } from "@/types/types";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Loading from "@/components/layouts/Loading/Loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "@/lib/formatDate";
import Comment from "@/components/layouts/Comment/Comment";

const ArticleDetail = () => {
  const { articleId }: { articleId: string } = useParams();
  const [article, setArticle] = useState<article>();
  const [htmlContent, setHtmlContent] = useState<string | Promise<string>>("");
  // const [likes, setLikes] = useState(148);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const iconRef = useRef<HTMLButtonElement | null>(null);
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get("token");
    if (token) {
      const decodeToken: tokenPayload = jwtDecode(token);
      setUserId(decodeToken.userId);
    }
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`
      );
      const data: article = await res.json();
      setArticle(data);
      setHtmlContent(marked(data.content));
      setIsLoading(false);
    };

    const showCookieToast = () => {
      const message = Cookies.get("toast");
      Cookies.remove("toast");
      if (message) {
        toast.success(message);
      }
    };

    fetchData().then(showCookieToast);
  }, [articleId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleLike = () => {
  //   setLikes(likes + 1);
  // };

  // 削除ポップアップ表示
  const handleDeleteClick = () => {
    setIsDeletePopupVisible(true);
  };

  // キャンセル
  const handleCancelDelete = () => {
    setIsDeletePopupVisible(false);
  };

  // 削除
  const handleConfirmDelete = async () => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`,
      {
        method: "DELETE",
      }
    );

    if (res.status === 400) {
      toast.error("投稿の削除に失敗しました");
    }

    if (res.status === 204) {
      const toast = { key: "success", message: "投稿を削除しました" };
      Cookies.set("toast", JSON.stringify(toast));
      location.href = "/";
      setIsDeletePopupVisible(false);
    }
  };

  //   const handleCommentSubmit = (e) => {
  //     e.preventDefault();
  //     if (comment.trim()) {
  //       setComments([...comments, comment]);
  //       setComment("");
  //     }
  //   };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <div className={styles.headerRight}>
            <Image
              src={article?.user.imgUrl || "/icon.png"}
              alt=""
              width={50}
              height={50}
              className={styles.avatar}
            />
            <div className={styles.headerInfo}>
              <Link
                href={`/user/${article?.user.userId}`}
                className={styles.link}
              >
                <span className={styles.name}>{article?.user.name}</span>
              </Link>
              <p className={styles.date}>{formatDate(article?.createdAt)}</p>
            </div>
          </div>
          {userId === article?.user.userId && (
            <div className={styles.headerRight}>
              <button
                className={styles.dots}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                ref={iconRef}
              >
                <IconContext.Provider value={{ color: "#888", size: "30px" }}>
                  <HiDotsHorizontal />
                </IconContext.Provider>
              </button>
              {isMenuOpen && (
                <ul ref={menuRef} className={styles.dropdownMenu}>
                  <li
                    onClick={() => {
                      location.href = `/article/${articleId}/edit`;
                    }}
                  >
                    編集
                  </li>
                  <li onClick={handleDeleteClick}>削除</li>
                </ul>
              )}
            </div>
          )}
        </div>
        <div className={styles.main}>
          <h1 className={styles.title}>{article?.title}</h1>
          {/* <div className={styles.tags}>
          <span className={styles.tag}>Python</span>
          <span className={styles.tag}>HTML</span>
          <span className={styles.tag}>Django</span>
          <span className={styles.tag}>#高校生</span>
        </div> */}
          <div className={styles.content}>
            <div
              className={`markdown-body ${styles.markdown}`}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
          </div>
        </div>
        {/* <div className={styles.footer}>
          <button className={styles.likes} onClick={handleLike}>
            ❤️ {likes}
          </button>
        </div> */}
      </div>
      <div className={styles.commentContainer}>
        <Comment comments={article?.commentList || []} articleId={articleId} />
        {/* <div className={styles.commentsSection}>
          <h2 className={styles.subtitle}>コメント</h2>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力..."
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentButton}>
              投稿
            </button>
          </form>
          <ul className={styles.commentsList}>
            {comments.map((c, index) => (
              <li key={index} className={styles.comment}>
                {c}
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* 削除確認ポップアップ */}
      {isDeletePopupVisible && ( // ポップアップの表示条件
        <div className={styles.deletePopup}>
          <div className={styles.popupContent}>
            <h3>記事を削除する</h3>
            <p>一度削除した記事は復元できません。</p>
            <p>削除してよろしいですか？</p>
            <div className={styles.popupButtons}>
              <button
                onClick={handleCancelDelete}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className={styles.confirmButton}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
