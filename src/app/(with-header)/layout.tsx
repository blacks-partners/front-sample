import "../globals.css";
import "github-markdown-css/github-markdown.css";
import Header from "@/components/layouts/Header/Header";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value || null;

  return (
    <>
      <Header token={token} />
      {children}
    </>
  );
}
