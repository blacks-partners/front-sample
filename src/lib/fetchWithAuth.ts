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
  });

  return response;
}
