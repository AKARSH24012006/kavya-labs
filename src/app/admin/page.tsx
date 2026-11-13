import type { Metadata } from "next";
import AdminFrame from "@/components/admin/AdminFrame";
import Overview from "@/components/admin/Overview";
import { getAnalytics } from "@/lib/analytics";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin · Kavya Labs" };

export default async function AdminPage() {
  const user = await requireAdmin();
  const data = await getAnalytics();
  return (
    <AdminFrame user={user} current="overview" title="Overview">
      <Overview data={data} usersHref="/admin/users" />
    </AdminFrame>
  );
}
