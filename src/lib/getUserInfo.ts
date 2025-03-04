import { fetchWithAuth } from "./fetchWithAuth";

export async function getUserInfo(userId: number) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_URL}/users/${userId}`
  );

  if (res.status === 400) {
    return null;
  }

  if (res.status === 200) {
    const user = await res.json();
    return user;
  }
}
