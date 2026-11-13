"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export type NavUser = { name?: string | null; image?: string | null } | null;

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar({ user = null }: { user?: NavUser }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-paper/90 backdrop-blur border-b border-ink/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Main">
        <Link href="/" className="flex items-center gap-2" aria-label="Kavya Labs home">
          <Logo />
          <span className="font-display text-xl font-semibold tracking-tight">Kavya Labs</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full bg-ink py-1 pl-1 pr-4 text-sm font-semibold text-paper transition hover:bg-ink-2"
            >
              <NavAvatar user={user} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted hover:text-ink">
                Sign in
              </Link>
              <a
                href="#waitlist"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink-2"
              >
                Get early access
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-ink/10 px-5 pb-5 md:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-sand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="mt-3 block rounded-full border-2 border-ink px-4 py-3 text-center font-semibold"
          >
            {user ? "Go to dashboard" : "Sign in"}
          </Link>
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-ink px-4 py-3 text-center font-semibold text-paper"
          >
            Get early access
          </a>
        </div>
      )}
    </header>
  );
}

function NavAvatar({ user }: { user: NonNullable<NavUser> }) {
  if (user.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt="" width={28} height={28} referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" />;
  }
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-saffron text-xs font-bold text-ink" aria-hidden="true">
      {(user.name ?? "?").charAt(0).toUpperCase()}
    </span>
  );
}
