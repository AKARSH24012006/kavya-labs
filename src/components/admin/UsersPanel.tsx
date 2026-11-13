import Link from "next/link";
import Avatar from "@/components/auth/Avatar";
import RowActions from "./RowActions";
import type { AdminUser, UserFilters } from "@/lib/users";
import { formatDateTime } from "@/lib/format";

type Props = { rows: AdminUser[]; total: number; pages: number; filters: UserFilters; selfId?: string; demo?: boolean };

/** User management: search + filters (plain GET form), table, pagination, CSV export. */
export default function UsersPanel({ rows, total, pages, filters, selfId, demo = false }: Props) {
  const page = filters.page ?? 1;
  const action = demo ? "/admin/demo" : "/admin/users";
  const pageHref = (p: number) => {
    const qs = new URLSearchParams({ ...(demo ? { tab: "users" } : {}), q: filters.q ?? "", role: filters.role ?? "", status: filters.status ?? "", page: String(p) });
    return `${action}?${qs}`;
  };
  const select = "rounded-full border-2 border-ink/10 bg-white px-3 py-2 text-sm";

  return (
    <div className="space-y-4">
      <form action={action} className="flex flex-wrap items-center gap-2" role="search">
        {demo && <input type="hidden" name="tab" value="users" />}
        <label htmlFor="q" className="sr-only">Search users</label>
        <input id="q" name="q" defaultValue={filters.q} placeholder="Search name or email" className="min-w-0 flex-1 rounded-full border-2 border-ink/10 bg-white px-4 py-2 text-sm outline-none focus:border-ink sm:max-w-xs" />
        <label htmlFor="role" className="sr-only">Role</label>
        <select id="role" name="role" defaultValue={filters.role} className={select}>
          <option value="">All roles</option><option value="admin">Admins</option><option value="user">Members</option>
        </select>
        <label htmlFor="status" className="sr-only">Status</label>
        <select id="status" name="status" defaultValue={filters.status} className={select}>
          <option value="">Any status</option><option value="active">Active</option><option value="suspended">Suspended</option>
        </select>
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">Filter</button>
        {!demo && <a href="/admin/users/export" className="ml-auto text-sm font-semibold text-muted underline hover:text-ink">Export CSV</a>}
      </form>

      <p className="text-sm text-muted" aria-live="polite">{total} {total === 1 ? "user" : "users"}</p>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">User</th><th className="px-3 py-3 font-medium">Role</th><th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Joined</th><th className="px-3 py-3 font-medium">Last sign-in</th><th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-ink/5 align-top">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} image={u.image} size={32} />
                    <div className="min-w-0"><p className="font-semibold">{u.name ?? "—"}</p><p className="text-muted">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-3 py-3"><Badge tone={u.role === "admin" ? "ink" : "plain"}>{u.role === "admin" ? "Admin" : "Member"}</Badge></td>
                <td className="px-3 py-3"><Badge tone={u.status === "active" ? "good" : "bad"}>{u.status === "active" ? "● Active" : "■ Suspended"}</Badge></td>
                <td className="px-3 py-3 whitespace-nowrap">{formatDateTime(u.created_at, false)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{formatDateTime(u.last_login_at)}<p className="text-xs text-muted">{u.logins} sign-ins</p></td>
                <td className="px-5 py-3"><RowActions user={u} isSelf={String(u.id) === selfId} demo={demo} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No users match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-3 text-sm" aria-label="Pagination">
          {page > 1 ? <Link href={pageHref(page - 1)} className="font-semibold underline">← Previous</Link> : <span className="text-muted">← Previous</span>}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link href={pageHref(page + 1)} className="font-semibold underline">Next →</Link> : <span className="text-muted">Next →</span>}
        </nav>
      )}
    </div>
  );
}

function Badge({ tone, children }: { tone: "ink" | "plain" | "good" | "bad"; children: React.ReactNode }) {
  const cls = { ink: "bg-ink text-paper", plain: "bg-sand", good: "bg-leaf/10 text-[#1f6e50]", bad: "bg-red-50 text-red-800" }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${cls}`}>{children}</span>;
}
