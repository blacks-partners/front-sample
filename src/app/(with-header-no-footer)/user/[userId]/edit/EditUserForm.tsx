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

  // 現在時刻からファイル名用の文字列を生成
  const generateTimeStamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

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

  // ユーザー情報更新
  const handleSave = async () => {
    try {
      if (name === "" || name.length <= 0) {
        toast.error("名前を入力してください");
        return;
      } else if (name.length > 50) {
        toast.error("名前は50文字以内で入力してください");
        return;
      } else if (introduction.length > 150) {
        toast.error("自己紹介は150文字以内で入力してください");
        return;
      }

      let uploadedFileName = null;

      // 画像がある場合、アップロード処理を実行
      if (selectedFile) {
        try {
          const timestamp = generateTimeStamp();
          const fileName = `${userId}-${timestamp}`;

          // 1. 署名付きURLの取得
          const presignedUrlRes = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_URL}/s3/put-url?userId=${userId}&contentType=${selectedFile.type}&timestamp=${timestamp}`
          );

          if (!presignedUrlRes.ok) {
            throw new Error("署名付きURLの取得に失敗しました");
          }

          const { url } = await presignedUrlRes.json();

          // 2. S3への画像アップロード
          const uploadRes = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": selectedFile.type,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            body: selectedFile,
          });

          if (!uploadRes.ok) {
            throw new Error("画像のアップロードに失敗しました");
          }

          uploadedFileName = fileName;
        } catch (e) {
          console.log(e);
          toast.error("画像のアップロードに失敗しました");
          return;
        }
      }

      // 3. ユーザー情報の更新
      const editRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_URL}/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            email,
            introduction,
            fileName: uploadedFileName,
          }),
        }
      );

      if (editRes.status === 400) {
        toast.error("更新に失敗しました");
        return;
      }

      if (editRes.status === 204) {
        const toast = { key: "success", message: "ユーザー情報を更新しました" };
        Cookies.set("toast", JSON.stringify(toast));
        location.href = `/user/${userId}`;
      }
    } catch (e) {
      console.log(e);
      toast.error("更新処理中にエラーが発生しました");
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
              value={introduction || ""}
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
