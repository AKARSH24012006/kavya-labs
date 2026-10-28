export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 md:grid-cols-[1.1fr_1fr] md:pb-28 md:pt-20">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-leaf" />
            Now onboarding 50 pilot businesses in Bengaluru
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Ask your business anything.
            <span className="block text-saffron-deep">In your own language.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Kavya reads your GST invoices, WhatsApp orders and bank statements, then answers questions like
            <em className="text-ink"> &ldquo;Who still owes me money this month?&rdquo;</em> in English, Hindi, Kannada or Tamil.
            No spreadsheets. No accountant on speed-dial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#waitlist"
              className="rounded-full bg-ink px-6 py-3.5 text-center font-semibold text-paper shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-ink-2"
            >
              Join the pilot — it&apos;s free
            </a>
            <a
              href="#how"
              className="rounded-full border border-ink/20 px-6 py-3.5 text-center font-semibold transition hover:bg-sand"
            >
              See how it works →
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-6">
            {[
              ["4", "languages"],
              ["90s", "to first insight"],
              ["₹0", "during pilot"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-semibold">{v}</dd>
                <dd className="text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ChatMock />
      </div>
    </section>
  );
}

function ChatMock() {
  return (
    <div className="relative fade-up [animation-delay:150ms]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-saffron/30 via-sand to-leaf/20 blur-2xl" />
      <div className="animate-float rounded-3xl border border-ink/10 bg-white p-5 shadow-2xl shadow-ink/10">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-saffron">K</div>
            <div>
              <p className="text-sm font-semibold">Kavya</p>
              <p className="text-[11px] text-leaf">● synced 2 min ago</p>
            </div>
          </div>
          <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-muted">ಕನ್ನಡ · EN</span>
        </div>

        <div className="space-y-3 py-4 text-sm">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-paper">
            ಈ ತಿಂಗಳು ಯಾರು ಇನ್ನೂ ಹಣ ಕೊಡಬೇಕು?
            <span className="mt-1 block text-[11px] text-paper/60">Who still owes me this month?</span>
          </div>
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-sand px-4 py-3">
            <p>3 customers owe you <strong>₹1,84,500</strong>.</p>
            <ul className="mt-2 space-y-1.5">
              {[
                ["Sri Lakshmi Traders", "₹96,000", "18 days late"],
                ["Mehta Textiles", "₹61,500", "due Friday"],
                ["Annapurna Caterers", "₹27,000", "6 days late"],
              ].map(([n, a, s]) => (
                <li key={n} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                  <span className="truncate font-medium">{n}</span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold">{a}</span>
                    <span className="block text-[11px] text-saffron-deep">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Want me to send polite WhatsApp reminders?</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-sm text-muted">
          Ask Kavya…
          <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-saffron text-white">↑</span>
        </div>
      </div>
    </div>
  );
}
