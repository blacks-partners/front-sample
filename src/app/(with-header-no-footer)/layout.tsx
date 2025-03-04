import "../globals.css";
import "github-markdown-css/github-markdown.css";
import Header from "@/components/layouts/Header/Header";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { tokenPayload } from "@/types/types";
import { getUserInfo } from "@/lib/getUserInfo";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value || null;

  let user = null;

  if (token) {
    const decodeToken: tokenPayload = jwtDecode(token);
    user = await getUserInfo(decodeToken.userId);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header token={token} user={user} />
      <main style={{ flex: "1" }}>{children}</main>
    </div>
  );
}
