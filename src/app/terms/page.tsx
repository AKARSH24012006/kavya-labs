import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms · Kavya Labs" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="14 November 2026">
      <p>
        Kavya Labs is a student project built for the Finlatics AI-Native Developer Program, not a commercial service. By
        signing in you agree to these simple terms.
      </p>
      <h2>Using the site</h2>
      <ul>
        <li>Use your own Google account and don&apos;t try to access other people&apos;s accounts or the admin area.</li>
        <li>Admins may suspend or delete accounts that misuse the site.</li>
      </ul>
      <h2>No warranty</h2>
      <p>The site is provided as is. Features, pricing and testimonials on the landing page are illustrative.</p>
      <h2>Contact</h2>
      <p>
        Questions: <a className="underline" href="mailto:akarshnehra@gmail.com">akarshnehra@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
