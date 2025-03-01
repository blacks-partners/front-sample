"use client";

import Image from "next/image";
import Button from "@/components/elements/Button/Button";
import { user } from "@/types/types";
import { useState } from "react";
import styles from "@/styles/EditUser.module.css";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Cookies from "js-cookie";

export const EditUserForm = ({ user }: { user: user }) => {
  const [name, setName] = useState<string>(user.name);
  const [introduction, setIntroduction] = useState<string>(user.introduction);
  const [email] = useState<string>(user.email);

  const handleSave = async () => {
    if (name === "" || name.length <= 0) {
      toast.error("名前を入力してください");
    } else {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_URL}/users/${user.userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            email,
            introduction,
          }),
        }
      );

      if (res.status === 400) {
        toast.error("更新に失敗しました");
      }

      if (res.status === 204) {
        const toast = { key: "success", message: "ユーザー情報を更新しました" };
        Cookies.set("toast", JSON.stringify(toast));
        location.href = `/user/${user.userId}`;
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>プロフィール設定</h2>
      <div className={styles.profileContainer}>
        <div className={styles.profileImageWrapper}>
          <Image
            src={"/icon.png"}
            alt={""}
            width={100}
            height={100}
            className={styles.avator}
          />
        </div>

        <div className={styles.profileRight}>
          <div className={styles.formGroup}>
            <label htmlFor="displayName" className={styles.label}>
              表示名
            </label>
            <input
              id="displayName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio" className={styles.label}>
              自己紹介
            </label>
            <textarea
              id="bio"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className={styles.textarea}
            />
          </div>
          {/* <button onClick={handleSave} className={styles.saveButton}>
            更新する
          </button> */}
          <div className={styles.saveButton}>
            <Button text="更新する" onClick={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
};
