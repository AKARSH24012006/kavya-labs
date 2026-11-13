import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import GoogleButton from "@/components/auth/GoogleButton";
import { getSessionSafe } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in · Kavya Labs" };

// Auth.js error codes → messages a shop owner would understand
const errors: Record<string, string> = {
  Suspended: "This account has been suspended. Write to hello@kavyalabs.in if you think that's a mistake.",
  AccessDenied: "Access was denied. Please try again with a different Google account.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  Configuration: "Sign-in is temporarily unavailable. Please try again in a few minutes.",
};

/** Only allow redirects back into this site. */
function safePath(p?: string) {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = safePath(callbackUrl);
  const session = await getSessionSafe();
  if (session?.user) redirect(redirectTo);

  const message = error ? (errors[error] ?? "Something went wrong while signing in. Please try again.") : null;

  return (
    <main className="grid min-h-screen place-items-center bg-sand px-5 py-16">
      <div className="w-full max-w-md rounded-[2rem] bg-paper p-8 shadow-xl shadow-ink/5 md:p-10">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Kavya Labs home">
          <Logo />
          <span className="font-display text-xl font-semibold">Kavya Labs</span>
        </Link>

        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted">Sign in to your Kavya workspace. New here? Signing in creates your account.</p>

        {message && (
          <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {message}
          </p>
        )}

        <div className="mt-8">
          <GoogleButton redirectTo={redirectTo} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          We only read your name, email and profile photo from Google. By continuing you agree to our terms and privacy policy.
        </p>
      </div>
    </main>
  );
}
