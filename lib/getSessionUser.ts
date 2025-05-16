import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation"; // khusus App Router
import type { Session } from "next-auth";

export async function getSessionUser(): Promise<Session["user"]> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}