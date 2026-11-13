import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/auth/AppHeader";
import Avatar from "@/components/auth/Avatar";
import { requireUser } from "@/lib/session";
import { query } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard · Kavya Labs" };

type Profile = { created_at: Date; last_login_at: Date | null; logins: number };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser("/dashboard");
  const { denied } = await searchParams;
  const [profile] = await query<Profile>(
    `SELECT u.created_at, u.last_login_at, (SELECT count(*)::int FROM login_events WHERE user_id = u.id) AS logins
     FROM users u WHERE u.id = $1`,
    [user.id],
  );

  const steps = [
    { done: true, label: "Create your Kavya account" },
    { done: false, label: "Connect your WhatsApp Business number" },
    { done: false, label: "Upload last month's invoices" },
    { done: false, label: "Ask Kavya your first question" },
  ];

  return (
    <>
      <AppHeader user={user} current="dashboard" />
      <main className="mx-auto max-w-6xl px-5 py-10">
        {denied === "admin" && (
          <p role="alert" className="mb-6 rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm font-medium">
            The admin area is only open to Kavya Labs admins.
          </p>
        )}

        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Namaste, {user.name?.split(" ")[0] ?? "there"} 👋</h1>
        <p className="mt-2 text-muted">Your workspace is ready. Here&apos;s where you are.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <section aria-labelledby="profile-h" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h2 id="profile-h" className="text-sm font-semibold uppercase tracking-wider text-muted">Your profile</h2>
            <div className="mt-4 flex items-center gap-4">
              <Avatar name={user.name} image={user.image} size={56} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Item label="Role" value={user.role === "admin" ? "Admin" : "Member"} />
              <Item label="Sign-ins" value={String(profile?.logins ?? 0)} />
              <Item label="Member since" value={formatDateTime(profile?.created_at, false)} />
              <Item label="Last sign-in" value={formatDateTime(profile?.last_login_at)} />
            </dl>
            {user.role === "admin" && (
              <Link href="/admin" className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-2">
                Open admin dashboard →
              </Link>
            )}
          </section>

          <section aria-labelledby="setup-h" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h2 id="setup-h" className="text-sm font-semibold uppercase tracking-wider text-muted">Getting started</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((s) => (
                <li key={s.label} className="flex items-center gap-3 rounded-2xl bg-sand/60 px-4 py-3">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${s.done ? "bg-leaf text-white" : "border-2 border-ink/20"}`} aria-hidden="true">
                    {s.done ? "✓" : ""}
                  </span>
                  <span className={s.done ? "text-muted line-through" : "font-medium"}>{s.label}</span>
                  <span className="sr-only">{s.done ? "(done)" : "(to do)"}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}
