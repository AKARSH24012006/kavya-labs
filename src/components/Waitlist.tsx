"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setStatus(ok ? "done" : "error");
  }

  return (
    <section id="waitlist" className="scroll-mt-20 px-5 pb-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-saffron px-6 py-16 text-center md:px-16">
        <div className="grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Be one of our first 50 businesses
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">
            Free for three months, onboarding over a WhatsApp call with the founders.
          </p>

          {status === "done" ? (
            <p role="status" className="mx-auto mt-8 max-w-md rounded-2xl bg-ink px-6 py-4 font-semibold text-paper">
              🎉 You&apos;re on the list! We&apos;ll reach out within 48 hours.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="email" className="sr-only">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@yourbusiness.in"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "email-error" : undefined}
                className="flex-1 rounded-full border-2 border-ink/10 bg-paper px-5 py-3.5 text-ink outline-none placeholder:text-muted focus:border-ink"
              />
              <button type="submit" className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper transition hover:bg-ink-2">
                Request access
              </button>
            </form>
          )}
          {status === "error" && (
            <p id="email-error" className="mt-3 text-sm font-medium text-ink">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
