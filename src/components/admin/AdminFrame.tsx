import Link from "next/link";
import type { Session } from "next-auth";
import AppHeader from "@/components/auth/AppHeader";

/** Page chrome for every admin screen: app header, title, and Overview / Users tabs. */
export default function AdminFrame({
  user,
  current,
  title,
  demo = false,
  children,
}: {
  user: Session["user"];
  current: "overview" | "users";
  title: string;
  demo?: boolean;
  children: React.ReactNode;
}) {
  const base = demo ? "/admin/demo" : "/admin";
  const tabs = [
    { key: "overview", href: base, label: "Overview" },
    { key: "users", href: `${base}${demo ? "?tab=users" : "/users"}`, label: "Users" },
  ];

  return (
    <>
      {demo && (
        <p className="bg-saffron px-5 py-2 text-center text-sm font-semibold text-ink">
          Demo preview with sample data. Actions are disabled. <Link href="/login?callbackUrl=/admin" className="underline">Sign in as an admin</Link> for the real dashboard.
        </p>
      )}
      <AppHeader user={user} current="admin" demo={demo} />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-saffron-deep">Admin</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          </div>
          <nav className="flex gap-1 rounded-full bg-sand p-1" aria-label="Admin sections">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                aria-current={current === t.key ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${current === t.key ? "bg-paper shadow-sm" : "text-muted hover:text-ink"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
