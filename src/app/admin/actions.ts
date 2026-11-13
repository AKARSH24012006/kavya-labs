"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { ok: boolean; message: string };

type Target = { id: number; email: string; role: string; status: string };

/**
 * Every admin mutation goes through here: checks the caller is an admin, loads the target,
 * runs the change and writes an audit row in one transaction.
 */
async function adminMutation(
  userId: number,
  action: string,
  check: (target: Target, adminId: number) => string | null,
  sql: string,
  params: (target: Target) => unknown[],
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const adminId = Number(admin.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<Target>("SELECT id, email, role, status FROM users WHERE id = $1 FOR UPDATE", [userId]);
    const target = rows[0];
    if (!target) throw new Error("That user no longer exists.");
    const problem = check(target, adminId);
    if (problem) {
      await client.query("ROLLBACK");
      return { ok: false, message: problem };
    }
    await client.query(sql, params(target));
    await client.query(
      "INSERT INTO admin_actions (admin_id, admin_email, action, target_email) VALUES ($1, $2, $3, $4)",
      [adminId, admin.email, action, target.email],
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    return { ok: false, message: err instanceof Error ? err.message : "Something went wrong." };
  } finally {
    client.release();
  }
  revalidatePath("/admin", "layout");
  return { ok: true, message: `Done: ${action}.` };
}

const notSelf = (verb: string) => (t: Target, adminId: number) => (t.id === adminId ? `You can't ${verb} your own account.` : null);

export async function setRole(userId: number, role: "user" | "admin") {
  return adminMutation(
    userId,
    role === "admin" ? "promoted to admin" : "removed admin from",
    notSelf("change the role of"),
    "UPDATE users SET role = $2 WHERE id = $1",
    (t) => [t.id, role],
  );
}

export async function setStatus(userId: number, status: "active" | "suspended") {
  return adminMutation(
    userId,
    status === "suspended" ? "suspended" : "reactivated",
    notSelf("suspend"),
    // Suspending also deletes their sessions, so they're signed out immediately
    status === "suspended"
      ? "WITH s AS (DELETE FROM sessions WHERE \"userId\" = $1) UPDATE users SET status = 'suspended' WHERE id = $1"
      : "UPDATE users SET status = 'active' WHERE id = $1",
    (t) => [t.id],
  );
}

export async function deleteUser(userId: number) {
  return adminMutation(userId, "deleted", notSelf("delete"), "DELETE FROM users WHERE id = $1", (t) => [t.id]);
}
