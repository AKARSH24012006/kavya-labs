import type { Metadata } from "next";
import AdminFrame from "@/components/admin/AdminFrame";
import UsersPanel from "@/components/admin/UsersPanel";
import { listUsers } from "@/lib/users";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Users · Admin · Kavya Labs" };

type Search = { q?: string; role?: string; status?: string; page?: string };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await requireAdmin();
  const sp = await searchParams;
  const filters = { q: sp.q ?? "", role: sp.role ?? "", status: sp.status ?? "", page: Math.max(1, Number(sp.page) || 1) };
  const { rows, total, pages } = await listUsers(filters);
  return (
    <AdminFrame user={user} current="users" title="Users">
      <UsersPanel rows={rows} total={total} pages={pages} filters={filters} selfId={user.id} />
    </AdminFrame>
  );
}
