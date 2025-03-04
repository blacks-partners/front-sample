import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["rakus-blog-test.s3.ap-northeast-1.amazonaws.com"],
  },
};

export default nextConfig;
