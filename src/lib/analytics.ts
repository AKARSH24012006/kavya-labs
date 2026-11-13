import { query } from "@/lib/db";

export type DayCount = { day: string; count: number };
export type Activity = { kind: "signup" | "admin"; text: string; at: string };
export type Analytics = {
  totals: { users: number; newThisWeek: number; active7d: number; admins: number; suspended: number; waitlist: number; logins30d: number };
  signups: DayCount[];
  logins: DayCount[];
  activity: Activity[];
};

const DAYS = 30;

/** Counts per IST calendar day for the last 30 days, zero-filled so charts have no gaps. */
async function perDay(table: "users" | "login_events"): Promise<DayCount[]> {
  return query<DayCount>(
    `SELECT to_char(d, 'YYYY-MM-DD') AS day, coalesce(c.count, 0)::int AS count
     FROM generate_series((now() AT TIME ZONE 'Asia/Kolkata')::date - ($1::int - 1), (now() AT TIME ZONE 'Asia/Kolkata')::date, '1 day') AS d
     LEFT JOIN (
       SELECT (created_at AT TIME ZONE 'Asia/Kolkata')::date AS day, count(*) AS count
       FROM ${table} GROUP BY 1
     ) c ON c.day = d
     ORDER BY d`,
    [DAYS],
  );
}

export async function getAnalytics(): Promise<Analytics> {
  const [[totals], signups, logins, activity] = await Promise.all([
    query<Analytics["totals"]>(`
      SELECT
        (SELECT count(*) FROM users)::int AS users,
        (SELECT count(*) FROM users WHERE created_at > now() - interval '7 days')::int AS "newThisWeek",
        (SELECT count(*) FROM users WHERE last_login_at > now() - interval '7 days')::int AS "active7d",
        (SELECT count(*) FROM users WHERE role = 'admin')::int AS admins,
        (SELECT count(*) FROM users WHERE status = 'suspended')::int AS suspended,
        (SELECT count(*) FROM waitlist)::int AS waitlist,
        (SELECT count(*) FROM login_events WHERE created_at > now() - interval '30 days')::int AS "logins30d"`),
    perDay("users"),
    perDay("login_events"),
    query<Activity>(`
      (SELECT 'signup' AS kind, coalesce(name, email) || ' joined' AS text, created_at AS at FROM users)
      UNION ALL
      (SELECT 'admin', coalesce(admin_email, 'An admin') || ' ' || action || ' ' || coalesce(target_email, ''), created_at FROM admin_actions)
      ORDER BY at DESC LIMIT 8`),
  ]);
  return { totals, signups, logins, activity };
}
