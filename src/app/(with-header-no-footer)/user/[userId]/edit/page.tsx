import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { EditUserForm } from "./EditUserForm";

const EditUser = async ({ params }: { params: { userId: string } }) => {
  const { userId } = await params;

  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_URL}/users/${userId}`
  );

  if (res.status === 400) {
    console.log(res.json());
  }

  if (res.status === 200) {
    const user = await res.json();
    return <EditUserForm user={user} />;
  }

  return null;
};

export default EditUser;
