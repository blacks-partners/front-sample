import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // クッキーからトークンを取得

  // トークンがない場合はトップページへリダイレクト
  if (!token) {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.set(
      "toast",
      JSON.stringify({ key: "error", message: "ログインしてください" })
    );
    return response;
  }

  return NextResponse.next(); // 認証OKならそのまま処理を続行
}

// ミドルウェアを適用するルートの設定
export const config = {
  matcher: ["/article/new", "/article/:path*/edit", "/user/:path*/edit"], // 認証が必要なページ
};
