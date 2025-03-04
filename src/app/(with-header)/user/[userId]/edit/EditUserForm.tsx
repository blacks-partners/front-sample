"use client";

import Image from "next/image";
import Button from "@/components/elements/Button/Button";
import { user } from "@/types/types";
import { useRef, useState } from "react";
import styles from "@/styles/EditUser.module.css";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Cookies from "js-cookie";

export const EditUserForm = ({ user }: { user: user }) => {
  const userId = user.userId;
  const [name, setName] = useState<string>(user.name);
  const [introduction, setIntroduction] = useState<string>(user.introduction);
  const [email] = useState<string>(user.email);
  const [imagePreview, setImagePreview] = useState<string>(
    user.imgUrl || "/icon.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 画像変更（プレビュー部分）
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 画像アップロード処理
  const uploadImage = async (fileName: string) => {
    if (!selectedFile) return null;

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_URL}/s3/put-url?fileName=${fileName}&contentType=${selectedFile.type}`
    );

    if (res.status !== 200) {
      toast.error("ファイルアップロードに失敗しました");
      return false;
    }

    const data = await res.json();
    const { url } = data;

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": selectedFile.type,
      },
      body: selectedFile,
    });

    if (uploadRes.ok) {
      return true;
    } else {
      return false;
    }
  };

  // ユーザー情報更新
  const handleSave = async () => {
    if (name === "" || name.length <= 0) {
      toast.error("名前を入力してください");
    } else if (name.length > 50) {
      toast.error("名前は50文字以内で入力してください");
    } else if (introduction.length > 150) {
      toast.error("自己紹介は150文字以内で入力してください");
    } else {
      let fileName = null;

      // ファイルアップロード
      if (selectedFile) {
        const uploadRes = uploadImage(userId.toString());

        if (!uploadRes) {
          toast.error("ファイルアップロードに失敗しました");
          return;
        } else {
          fileName = userId;
        }
      }

      // ユーザー情報更新
      const editRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_URL}/users/${user.userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            email,
            introduction,
            fileName,
          }),
        }
      );

      if (editRes.status === 400) {
        toast.error("更新に失敗しました");
      }

      if (editRes.status === 204) {
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
        <div className={styles.profileImageWrapper} onClick={handleImageClick}>
          <Image
            src={imagePreview}
            alt={""}
            width={100}
            height={100}
            className={styles.avator}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
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
