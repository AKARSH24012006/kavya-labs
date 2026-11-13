import Link from "next/link";
import Logo from "./Logo";

/** Simple shell for the privacy and terms pages. */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link href="/" className="inline-flex items-center gap-2" aria-label="Kavya Labs home">
        <Logo size={28} />
        <span className="font-display text-lg font-semibold">Kavya Labs</span>
      </Link>
      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
      <div className="mt-8 space-y-5 leading-relaxed text-ink/85 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
