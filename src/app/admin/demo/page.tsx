import type { Metadata } from "next";
import AdminFrame from "@/components/admin/AdminFrame";
import Overview from "@/components/admin/Overview";
import UsersPanel from "@/components/admin/UsersPanel";
import { demoAnalytics, demoUsers } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Admin demo · Kavya Labs", robots: { index: false } };

type Search = { tab?: string; q?: string; role?: string; status?: string };

/**
 * Public, read-only preview of the admin dashboard with sample data, so investors (and reviewers)
 * can see it without an admin Google account. Same components as /admin, every action disabled.
 */
export default async function AdminDemoPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const demoUser = { id: "demo", name: "Demo Admin", email: "demo@kavyalabs.in", image: null, role: "admin" as const };

  if (sp.tab === "users") {
    const q = (sp.q ?? "").toLowerCase();
    const rows = demoUsers.filter(
      (u) =>
        (!q || u.email.includes(q) || (u.name ?? "").toLowerCase().includes(q)) &&
        (!sp.role || u.role === sp.role) &&
        (!sp.status || u.status === sp.status),
    );
    return (
      <AdminFrame user={demoUser} current="users" title="Users" demo>
        <UsersPanel rows={rows} total={rows.length} pages={1} filters={{ q: sp.q, role: sp.role, status: sp.status }} demo />
      </AdminFrame>
    );
  }

  return (
    <AdminFrame user={demoUser} current="overview" title="Overview" demo>
      <Overview data={demoAnalytics} usersHref="/admin/demo?tab=users" />
    </AdminFrame>
  );
}
