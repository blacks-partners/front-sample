import Image from "next/image";
import styles from "@/styles/Mypage.module.css";
import { article, user } from "@/types/types";
import UserArticle from "@/components/layouts/Article/UserArticle";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import ToastHandler from "@/components/elements/Toast/ToastHandler";

const Mypage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = await params;

  // ユーザー情報の取得（SSR）
  const userRes = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_URL}/users/${userId}`
  );
  const userInfo: user | null =
    userRes.status === 200 ? await userRes.json() : null;

  // 記事データの取得（SSR）
  const articleRes = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_URL}/users/${userId}/articles`
  );
  const articles: article[] =
    articleRes.status === 200 ? await articleRes.json() : [];

  return (
    <div>
      <ToastHandler />
      <div className={styles.profileContainer}>
        <div className={styles.profile}>
          <div className={styles.profileLeft}>
            <Image
              src={userInfo?.imgUrl || "/icon.png"}
              alt=""
              width={100}
              height={100}
              className={styles.avatar}
            />
          </div>
          <div className={styles.profileRight}>
            <div>
              <h1 className={styles.nickname}>{userInfo?.name}</h1>
            </div>
            <div>
              <pre className={styles.introduction}>
                {userInfo?.introduction
                  ? userInfo.introduction
                  : "自己紹介未入力"}
              </pre>
            </div>
          </div>
        </div>
      </div>
      {articles.map((article: article) => {
        return (
          <div className={styles.article} key={article.articleId}>
            <UserArticle article={article} />
          </div>
        );
      })}
    </div>
  );
};

export default Mypage;
