import Cookies from "js-cookie";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = Cookies.get("token");

  const headers = {
    ...options.headers,
    "X-AUTH-TOKEN": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    Cookies.remove("token");
    const toast = {
      key: "error",
      message: "セッションが切れました。再度ログインしてください。",
    };
    Cookies.set("toast", JSON.stringify(toast));
    location.href = "/login";
  }

  return response;
}
