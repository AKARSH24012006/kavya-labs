import { query } from "@/lib/db";
import type { Role } from "@/types/next-auth";

export type AdminUser = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  status: "active" | "suspended";
  created_at: string;
  last_login_at: string | null;
  logins: number;
};

export type UserFilters = { q?: string; role?: string; status?: string; page?: number };
export const PAGE_SIZE = 20;

/** Searchable, filterable, paginated user list for the admin table. */
export async function listUsers({ q = "", role = "", status = "", page = 1 }: UserFilters) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (q.trim()) {
    params.push(`%${q.trim().toLowerCase()}%`);
    where.push(`(lower(u.email) LIKE $${params.length} OR lower(coalesce(u.name, '')) LIKE $${params.length})`);
  }
  if (role === "admin" || role === "user") {
    params.push(role);
    where.push(`u.role = $${params.length}`);
  }
  if (status === "active" || status === "suspended") {
    params.push(status);
    where.push(`u.status = $${params.length}`);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;

  const [rows, [{ total }]] = await Promise.all([
    query<AdminUser>(
      `SELECT u.id, u.name, u.email, u.image, u.role, u.status, u.created_at, u.last_login_at,
              (SELECT count(*) FROM login_events e WHERE e.user_id = u.id)::int AS logins
       FROM users u ${clause}
       ORDER BY u.created_at DESC
       LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      params,
    ),
    query<{ total: number }>(`SELECT count(*)::int AS total FROM users u ${clause}`, params),
  ]);
  return { rows, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
