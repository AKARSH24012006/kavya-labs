"use client";

import { useState, useTransition } from "react";
import { deleteUser, setRole, setStatus, type ActionResult } from "@/app/admin/actions";
import type { AdminUser } from "@/lib/users";

/** Role / suspend / delete buttons for one user row. Delete needs a second click to confirm. */
export default function RowActions({ user, isSelf, demo = false }: { user: AdminUser; isSelf: boolean; demo?: boolean }) {
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const locked = demo || isSelf || pending;

  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setResult(await fn());
      setConfirmDelete(false);
    });

  const btn = "rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
  const who = user.name ?? user.email;

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <button
        type="button"
        disabled={locked}
        onClick={() => run(() => setRole(user.id, user.role === "admin" ? "user" : "admin"))}
        className={`${btn} border-ink/15 hover:border-ink`}
        aria-label={`${user.role === "admin" ? "Remove admin role from" : "Make admin:"} ${who}`}
      >
        {user.role === "admin" ? "Remove admin" : "Make admin"}
      </button>
      <button
        type="button"
        disabled={locked}
        onClick={() => run(() => setStatus(user.id, user.status === "active" ? "suspended" : "active"))}
        className={`${btn} border-ink/15 hover:border-ink`}
        aria-label={`${user.status === "active" ? "Suspend" : "Reactivate"} ${who}`}
      >
        {user.status === "active" ? "Suspend" : "Reactivate"}
      </button>
      <button
        type="button"
        disabled={locked}
        onClick={() => (confirmDelete ? run(() => deleteUser(user.id)) : setConfirmDelete(true))}
        onBlur={() => setConfirmDelete(false)}
        className={`${btn} ${confirmDelete ? "border-red-600 bg-red-600 text-white" : "border-red-200 text-red-700 hover:border-red-600"}`}
        aria-label={confirmDelete ? `Confirm deleting ${who}` : `Delete ${who}`}
      >
        {confirmDelete ? "Confirm delete" : "Delete"}
      </button>
      {isSelf && <span className="w-full text-right text-xs text-muted">This is you</span>}
      {result && !result.ok && (
        <span role="alert" className="w-full text-right text-xs font-medium text-red-700">
          {result.message}
        </span>
      )}
    </div>
  );
}
