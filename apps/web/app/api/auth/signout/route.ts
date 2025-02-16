import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const respone = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
    {
      method: "POST",
    },
  );
  if (respone.ok) {
  }
  await deleteSession();

  redirect("/", RedirectType.push);
}
