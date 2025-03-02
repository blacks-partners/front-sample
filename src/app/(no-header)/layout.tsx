import "../globals.css";
import "github-markdown-css/github-markdown.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <Header token={token} /> */}
      {children}
    </>
  );
}
