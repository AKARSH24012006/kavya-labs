import Logo from "./Logo";

const cols = [
  { title: "Product", links: [["Features", "#features"], ["How it works", "#how"], ["Pricing", "#pricing"], ["FAQ", "#faq"]] },
  { title: "Company", links: [["About", "#"], ["Careers", "#"], ["Press kit", "#"], ["Contact", "mailto:hello@kavyalabs.in"]] },
  { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Security", "#"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-lg font-semibold">Kavya Labs</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            The AI back-office for India&apos;s small businesses. Made with ☕ in Indiranagar, Bengaluru.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              ["X / Twitter", "M4 4l16 16M20 4L4 20"],
              ["LinkedIn", "M6 9v9M6 6v.01M10 18v-5a3 3 0 016 0v5M10 9v9"],
              ["Instagram", "M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zM12 9a3 3 0 100 6 3 3 0 000-6z"],
            ].map(([label, d]) => (
              <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-muted transition hover:bg-ink hover:text-paper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold">{c.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {c.links.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kavya Labs Pvt. Ltd. All rights reserved.</p>
          <p>Bengaluru, Karnataka · India</p>
        </div>
      </div>
    </footer>
  );
}
