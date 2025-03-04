"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingDots.module.css";

export const LoadingDots = ({ duration = 10000 }: { duration?: number }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isAnimating) {
    return (
      <span className={`${styles.loadingDots} ${styles.static}`}>...</span>
    );
  }

  return <span className={styles.loadingDots}></span>;
};
