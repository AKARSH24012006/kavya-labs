import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/auth";

/** Server-side guard for signed-in pages. */
export async function requireUser(callbackUrl = "/dashboard") {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return session.user;
}

/** Server-side guard for admin pages and actions. Non-admins get sent to their dashboard. */
export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/dashboard?denied=admin");
  return user;
}

/** For public pages: never let a database hiccup take down the landing page. */
export async function getSessionSafe() {
  try {
    return await auth();
  } catch (err) {
    unstable_rethrow(err); // let Next.js handle its own control-flow errors (dynamic rendering, redirects)
    console.error("[auth] session lookup failed", err);
    return null;
  }
}
