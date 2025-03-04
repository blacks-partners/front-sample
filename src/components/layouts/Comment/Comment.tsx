import Button from "@/components/elements/Button/Button";
import styles from "@/components/layouts/Comment/comment.module.css";
import { formatDate } from "@/lib/formatDate";
import { comment, tokenPayload } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { IconContext } from "react-icons";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";

const Comment = ({
  comments,
  articleId,
}: {
  comments: comment[];
  articleId: string;
}) => {
  const [comment, setComment] = useState<string>("");
  const [userId, setUserId] = useState<number>();
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  const menuRefs = useRef<{ [key: number]: HTMLUListElement | null }>({});
  const iconRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodeToken: tokenPayload = jwtDecode(token);
      setUserId(decodeToken.userId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpenIndex !== null &&
        menuRefs.current[menuOpenIndex] &&
        !menuRefs.current[menuOpenIndex]?.contains(event.target as Node) &&
        iconRefs.current[menuOpenIndex] &&
        !iconRefs.current[menuOpenIndex]?.contains(event.target as Node)
      ) {
        setMenuOpenIndex(null);
      }
    };

    if (menuOpenIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenIndex]);

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const token = Cookies.get("token");
    if (!token) {
      toast.error("ログインしてください");
    } else {
      if (comment === "" || comment.length <= 0) {
        toast.error("コメントを入力してください");
      } else if (comment.length > 500) {
        toast.error("コメントは500字以内で入力してください");
      } else {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_URL}/comments`,
          {
            method: "POST",
            body: JSON.stringify({
              userId,
              content: comment,
              articleId,
            }),
          }
        );

        if (res.status === 400) {
          toast.error("コメントに失敗しました");
        }

        if (res.status === 201) {
          const message = "コメントが完了しました";
          Cookies.set("toast", message);
          location.href = `/article/${articleId.toString()}`;
        }
      }
    }
  };

  // 削除ポップアップ表示
  const handleDeleteClick = () => {
    setIsDeletePopupVisible(true);
  };

  // キャンセル
  const handleCancelDelete = () => {
    setIsDeletePopupVisible(false);
  };

  // 削除
  const handleConfirmDelete = async (commentId: number) => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_URL}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
    if (res.status === 400) {
      toast.error("コメントの削除に失敗しました");
    }
    if (res.status === 204) {
      const message = "コメントを削除しました";
      Cookies.set("toast", message);
      location.href = `/article/${articleId.toString()}`;
      setIsDeletePopupVisible(false);
    }
  };

  return (
    <div>
      <h2 className={styles.subtitle}>コメント</h2>
      {comments.length > 0 && (
        <ul className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.commentId}>
              {/* 削除確認ポップアップ */}
              {isDeletePopupVisible && ( // ポップアップの表示条件
                <div className={styles.deletePopup}>
                  <div className={styles.popupContent}>
                    <h3>コメント削除</h3>
                    <p>削除してよろしいですか？</p>
                    <div className={styles.popupButtons}>
                      <button
                        onClick={handleCancelDelete}
                        className={styles.cancelButton}
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => {
                          handleConfirmDelete(comment.commentId);
                        }}
                        className={styles.confirmButton}
                      >
                        削除する
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <li className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.userInfo}>
                    <Image
                      src={comment.user.imgUrl || "/icon.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userIcon}
                    />
                    {/* <span className={styles.userIcon}>👤</span> */}
                    <Link href={`/user/${comment.user.userId}`}>
                      <span className={styles.userName}>
                        {comment.user.name}
                      </span>
                    </Link>
                    <span className={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {userId === comment?.user.userId && (
                    <div className={styles.headerRight}>
                      <button
                        className={styles.dots}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenIndex(
                            menuOpenIndex === comment.commentId
                              ? null
                              : comment.commentId
                          );
                        }}
                        ref={(el) => {
                          iconRefs.current[comment.commentId] = el;
                        }}
                      >
                        <IconContext.Provider
                          value={{ color: "#888", size: "30px" }}
                        >
                          <HiDotsHorizontal />
                        </IconContext.Provider>
                      </button>
                      {menuOpenIndex === comment.commentId && (
                        <ul
                          ref={(el) => {
                            menuRefs.current[comment.commentId] = el;
                          }}
                          className={styles.dropdownMenu}
                        >
                          {/* <li
                          onClick={() => {
                          }}
                        >
                          編集
                        </li> */}
                          <li onClick={handleDeleteClick}>削除する</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <p className={styles.commentText}>{comment.content}</p>
                {/* <div className={styles.commentActions}>
              <button className={styles.likeButton}>❤️ {c.likes}</button>
            </div> */}
              </li>
            </div>
          ))}
        </ul>
      )}
      <div className={styles.commentForm}>
        {userId ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="テキストを入力"
              className={styles.commentInput}
            ></textarea>
            <div className={styles.commentButtonContainer}>
              <button type="submit" className={styles.commentButton}>
                投稿する
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className={styles.loginCommentContainer}>
              <p className={styles.loginComment}>ログインしてコメントをする</p>
            </div>
            <div className={styles.loginButtonContainer}>
              <Button
                text="ログイン"
                onClick={() => {
                  location.href = "/login";
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
