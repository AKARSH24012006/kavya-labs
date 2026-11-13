/**
 * Kavya Labs landing page.
 *
 * Note for Rohan: we use Next.js (App Router) instead of a plain React SPA because each weekly
 * brief is just a new folder under src/app — Week 1 is this page, Week 2 adds /login and
 * /dashboard (Google sign-in via NextAuth), Week 3 adds /admin. One codebase, one Vercel deploy,
 * and server-rendered pages so the landing page loads fast and ranks on Google.
 *
 * Sections live in src/components so each one can be changed without touching the others.
 */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Features, HowItWorks, Testimonial, Pricing, FAQ } from "@/components/Sections";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";
import { getSessionSafe } from "@/lib/session";

export default async function Home() {
  const session = await getSessionSafe();
  const user = session?.user ? { name: session.user.name, image: session.user.image } : null;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Navbar user={user} />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonial />
        <Pricing />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
