import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy policy · Kavya Labs" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="14 November 2026">
      <p>
        Kavya Labs is a student project built for the Finlatics AI-Native Developer Program. This page explains exactly what
        the site stores and why.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>When you sign in with Google: your name, email address and profile photo URL, which Google shares with your permission.</li>
        <li>The time of each sign-in, so you and our admins can see account activity.</li>
        <li>If you join the waitlist: the email address you enter.</li>
      </ul>
      <p>We don&apos;t ask Google for access to your Gmail, Drive, contacts or anything else, and we don&apos;t use advertising or tracking cookies.</p>
      <h2>Cookies</h2>
      <p>One cookie keeps you signed in. It holds a random session ID, not your personal details, and is deleted when you sign out.</p>
      <h2>Where it&apos;s stored</h2>
      <p>Data is stored in a Postgres database hosted by Neon and served through Vercel. It isn&apos;t sold or shared with anyone else.</p>
      <h2>Your choices</h2>
      <p>
        You can sign out at any time. To have your account and sign-in history deleted, email{" "}
        <a className="underline" href="mailto:akarshnehra@gmail.com">akarshnehra@gmail.com</a> and it will be removed.
      </p>
    </LegalPage>
  );
}
