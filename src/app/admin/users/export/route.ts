import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

// Quote every cell, and stop spreadsheet apps treating names like "=SUM(...)" as formulas
const cell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

/** GET → all users as a CSV download (admins only). */
export async function GET() {
  await requireAdmin();
  const rows = await query<Record<string, unknown>>(
    `SELECT id, name, email, role, status, created_at, last_login_at,
            (SELECT count(*) FROM login_events e WHERE e.user_id = u.id)::int AS sign_ins
     FROM users u ORDER BY created_at`,
  );
  const header = ["id", "name", "email", "role", "status", "created_at", "last_login_at", "sign_ins"];
  const csv = [header.join(","), ...rows.map((r) => header.map((h) => cell(r[h])).join(","))].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kavya-users-${date}.csv"`,
    },
  });
}
