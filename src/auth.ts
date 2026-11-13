import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { databaseUrl, pool, query } from "@/lib/db";
import type { Role } from "@/types/next-auth";

/** Comma-separated list of emails that are made admins on first sign-in. */
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * AUTH_SECRET signs session cookies. If it isn't set, derive a stable one from DATABASE_URL
 * (already a server-only secret) so a fresh deploy works; setting AUTH_SECRET explicitly is preferred.
 */
const secret =
  process.env.AUTH_SECRET ??
  (databaseUrl ? createHash("sha256").update("kavya-auth:" + databaseUrl).digest("base64") : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  adapter: PostgresAdapter(pool),
  providers: [Google],
  // Database sessions: suspending or deleting a user takes effect on their very next request.
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const [row] = await query<{ status: string }>("SELECT status FROM users WHERE email = $1", [user.email]);
      if (row?.status === "suspended") return "/login?error=Suspended";
      return true;
    },
    session({ session, user }) {
      session.user.id = String(user.id);
      session.user.role = (user.role as Role) ?? "user";
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        await query("UPDATE users SET role = 'admin' WHERE id = $1", [user.id]);
      }
    },
    async signIn({ user, account }) {
      if (!user.id) return;
      await query("UPDATE users SET last_login_at = now() WHERE id = $1", [user.id]);
      await query("INSERT INTO login_events (user_id, provider) VALUES ($1, $2)", [user.id, account?.provider ?? "unknown"]);
    },
  },
});
