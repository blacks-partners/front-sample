import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_S3_URL?.replace(/^https?:\/\//, "") || "",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
