"use client";

import { useState } from "react";
import styles from "@/styles/Register.module.css";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function Register() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let error = false;
    setNicknameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAuthError("");

    if (nickname === "") {
      setNicknameError("値を入力してください");
      error = true;
    } else if (nickname.length > 50) {
      setNicknameError("50文字以内で入力してください");
    }

    if (email === "") {
      setEmailError("値を入力してください");
      error = true;
    }

    if (password === "") {
      setPasswordError("値を入力してください");
      error = true;
    } else if (
      !password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/
      )
    ) {
      setPasswordError(
        "8~16文字（英大文字、小文字、数字、記号をすべて含む）で入力してください"
      );
      error = true;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("値を入力してください");
      error = true;
    } else if (!(password === confirmPassword)) {
      setConfirmPasswordError("パスワードが一致しません");
      error = true;
    }

    if (error) {
      return;
    }

    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_URL}/register`, {
      method: "POST",
      body: JSON.stringify({
        name: nickname,
        email,
        password,
      }),
    });

    if (res.status === 400) {
      toast.error("登録処理に失敗しました");
      return;
    }

    if (res.status === 409) {
      setAuthError("入力されたメールアドレスは既に登録されています");
      return;
    }

    console.log(res.status);

    if (res.status === 200) {
      const token = res.headers.get("X-AUTH-TOKEN")?.replace("Bearer ", "");
      document.cookie = `token=${token}; path=/; max-age=3600; secure; samesite=strict`;
      const toast = { key: "success", message: "ユーザー登録が完了しました" };
      Cookies.set("toast", JSON.stringify(toast));
      location.href = "/";
    }
  };

  return (
    <main className={styles.container}>
      <form action="" onSubmit={onSubmit} method="POST">
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <p>
              <strong> Raha </strong>に新規登録
            </p>
          </div>
          <div className={styles.loginContent}>
            <p className={styles.authError}>{authError}</p>
            <div className={styles.parts}>
              <label htmlFor="nickname" className={styles.label}>
                ニックネーム
              </label>
              <span className={styles.error}>{nicknameError}</span>
              <br />
              <input
                type="text"
                id="nickname"
                placeholder="ニックネーム"
                className={styles.textbox}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className={styles.parts}>
              <label htmlFor="email" className={styles.label}>
                メールアドレス
              </label>
              <span className={styles.error}>{emailError}</span>
              <br />
              <input
                type="email"
                id="email"
                placeholder="example@example.com"
                className={styles.textbox}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.parts}>
              <label htmlFor="password" className={styles.label}>
                パスワード
              </label>
              <span className={styles.error}>{passwordError}</span>
              <br />
              <input
                type="password"
                id="password"
                placeholder="8~16文字"
                className={styles.textbox}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.parts}>
              <label htmlFor="confirmPassword" className={styles.label}>
                確認用パスワード
              </label>
              <span className={styles.error}>{confirmPasswordError}</span>
              <br />
              <input
                type="password"
                id="confirmPassword"
                placeholder="8~16文字"
                className={styles.textbox}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.button}>登録</button>
            </div>
          </div>
        </div>
      </form>
      <Link href={"/login"} className={styles.signUp}>
        <p>すでに登録済みの方</p>
      </Link>
    </main>
  );
}
