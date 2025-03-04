"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/layouts/Header/header.module.css";
import Button from "@/components/elements/Button/Button";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { user } from "@/types/types";

interface Props {
  token: string | null;
  user: user | null;
}

const Header = ({ user }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const iconRef = useRef<HTMLLIElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // メニュー外クリック時に閉じる処理
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

  const onLogout = () => {
    Cookies.remove("token");
    const toast = { key: "success", message: "ログアウトしました" };
    Cookies.set("toast", JSON.stringify(toast));
    location.href = "/";
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <Link href={"/"}>
            <span className={styles.logoInit}>R</span>AHA
          </Link>
        </div>

        <ul className={styles.headerRight}>
          {user ? (
            <>
              {/* アイコンをクリックでメニュー開閉 */}
              <li
                ref={iconRef}
                onClick={(e) => {
                  e.stopPropagation(); // クリックイベントの伝播を防ぐ
                  setIsMenuOpen((prev) => !prev);
                }}
              >
                <Image
                  src={user.imgUrl || "/icon.png"}
                  alt="User Icon"
                  width={40}
                  height={40}
                  className={styles.userIcon}
                />
              </li>

              {/* ドロップダウンメニュー */}
              {isMenuOpen && (
                <ul ref={menuRef} className={styles.dropdownMenu}>
                  <li onClick={() => (location.href = `/user/${user.userId}`)}>
                    マイページ
                  </li>
                  <li
                    onClick={() =>
                      (location.href = `/user/${user.userId}/edit`)
                    }
                  >
                    アカウント設定
                  </li>
                  <li onClick={onLogout}>ログアウト</li>
                </ul>
              )}
              <li>
                <Link href={"/article/new"}>
                  <Button text="新規投稿" />
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link href={"/login"}>
                <Button text="ログイン" />
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
};

export default Header;
