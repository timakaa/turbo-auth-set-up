import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

export async function GET() {
  const respone = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
    {
      method: "POST",
    },
  );
  if (respone.ok) {
    await deleteSession();
  }

  redirect("/", RedirectType.push);
}
