"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

const ToastHandler = () => {
  const pathname = usePathname(); // ページ遷移時に実行

  useEffect(() => {
    const cookieToast = Cookies.get("toast");
    if (cookieToast) {
      console.log("Toast cookie found:", cookieToast);

      try {
        const messages: { key: string; message: string } =
          JSON.parse(cookieToast);
        Cookies.remove("toast"); // クッキー削除して再表示を防ぐ

        setTimeout(() => {
          if (messages.key === "success") {
            toast.success(messages.message);
          } else if (messages.key === "error") {
            toast.error(messages.message);
          }
        }, 10);
      } catch (error) {
        console.error("Failed to parse toast cookie:", error);
      }
    } else {
      console.log("No toast cookie found.");
    }
  }, [pathname]); // 画面遷移時に実行

  return null;
};

export default ToastHandler;
