import Link from "next/link";
import Logo from "@/components/Logo";
import Avatar from "./Avatar";
import SignOutButton from "./SignOutButton";
import type { Session } from "next-auth";

/** Header for signed-in pages (dashboard, admin). */
export default function AppHeader({ user, current, demo = false }: { user: Session["user"]; current: "dashboard" | "admin"; demo?: boolean }) {
  const tab = (href: string, label: string, key: string) => (
    <Link
      href={href}
      aria-current={current === key ? "page" : undefined}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${current === key ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Kavya Labs home">
            <Logo size={28} />
            <span className="hidden font-display text-lg font-semibold sm:inline">Kavya Labs</span>
          </Link>
          <nav className="flex gap-1" aria-label="App">
            {!demo && tab("/dashboard", "Dashboard", "dashboard")}
            {user.role === "admin" && tab(demo ? "/admin/demo" : "/admin", "Admin", "admin")}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} image={user.image} size={32} />
          {demo ? (
            <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
              Sign in
            </Link>
          ) : (
            <SignOutButton />
          )}
        </div>
      </div>
    </header>
  );
}
