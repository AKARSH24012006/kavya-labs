import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST { email } → adds the email to the waitlist. Re-submitting the same email is a no-op. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 255) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    await query("INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING", [email]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] insert failed", err);
    return NextResponse.json({ error: "We couldn't save that right now. Please try again." }, { status: 500 });
  }
}
