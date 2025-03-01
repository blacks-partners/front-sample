import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // クッキーからトークンを取得

  // トークンがない場合はトップページへリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // 認証OKならそのまま処理を続行
}

// ミドルウェアを適用するルートの設定
export const config = {
  matcher: ["/article/new", "/article/:path*/edit"], // 認証が必要なページ
};
