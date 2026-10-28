const features = [
  {
    icon: "🧾",
    title: "Reads every bill for you",
    body: "Snap a photo of a GST invoice or forward a PDF. Kavya extracts party, HSN, tax and due date in seconds.",
  },
  {
    icon: "💬",
    title: "WhatsApp-native",
    body: "Orders and payment screenshots shared on WhatsApp land straight in your ledger. No new app for your staff.",
  },
  {
    icon: "🗣️",
    title: "Speaks your language",
    body: "Ask by typing or voice in English, Hindi, Kannada or Tamil. Answers come back the same way.",
  },
  {
    icon: "📈",
    title: "Cash-flow early warnings",
    body: "Kavya flags late payers, low stock and unusual expenses before they turn into a bad month.",
  },
  {
    icon: "🔔",
    title: "Polite auto-reminders",
    body: "One tap sends a friendly, personalised payment reminder with a UPI link attached.",
  },
  {
    icon: "🔒",
    title: "Your data stays yours",
    body: "Encrypted at rest, hosted in India, and never used to train shared models. Export everything anytime.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          eyebrow="Features"
          title="A back-office team that never sleeps"
          sub="Everything a growing shop, trader or kitchen needs to stay on top of money — without learning accounting software."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-1 hover:border-saffron/50 hover:shadow-xl hover:shadow-saffron/10"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Connect", body: "Link WhatsApp Business and upload last month's invoices. Takes about two minutes." },
  { n: "02", title: "Kavya organises", body: "Our AI reads, categorises and reconciles every entry against your bank statement." },
  { n: "03", title: "Just ask", body: "Get answers, reminders and weekly summaries in the language you think in." },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow="How it works" title="Live in the time it takes to make chai" />
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <span className="absolute left-14 right-0 top-6 hidden border-t-2 border-dashed border-ink/15 md:block" aria-hidden="true" />
              )}
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-ink font-display font-semibold text-saffron">
                {s.n}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="bg-ink py-24 text-paper">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <p className="font-display text-3xl leading-snug md:text-4xl">
          &ldquo;I used to spend every Sunday matching payments in a notebook. Now I ask Kavya in Kannada and it&apos;s done before my coffee.&rdquo;
        </p>
        <p className="mt-6 text-sm text-paper/70">
          <span className="font-semibold text-saffron">Pilot user</span> · Wholesale textiles, Chickpet, Bengaluru
        </p>
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-paper/15 pt-10 md:grid-cols-4">
          {[
            ["6 hrs", "saved per week"],
            ["32%", "faster collections"],
            ["12k+", "invoices read"],
            ["4.8/5", "pilot rating"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-semibold text-saffron">{v}</p>
              <p className="mt-1 text-sm text-paper/70">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-paper/40">Early pilot figures, Sep–Oct 2026.</p>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Pilot",
    price: "₹0",
    period: "for 3 months",
    blurb: "For the first 50 Bengaluru businesses.",
    items: ["Unlimited questions", "Up to 300 invoices/month", "WhatsApp + 4 languages", "Founder on WhatsApp support"],
    cta: "Apply for pilot",
    featured: true,
  },
  {
    name: "Growth",
    price: "₹999",
    period: "/month after pilot",
    blurb: "For shops and traders ready to scale.",
    items: ["Everything in Pilot", "Unlimited invoices", "Auto payment reminders", "Tally & Zoho export"],
    cta: "Join waitlist",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow="Pricing" title="Free while we build it with you" />
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border p-8 ${p.featured ? "border-ink bg-ink text-paper shadow-2xl shadow-ink/20" : "border-ink/10 bg-paper"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-saffron px-3 py-1 text-xs font-bold text-ink">Limited seats</span>}
              </div>
              <p className="mt-4">
                <span className="font-display text-5xl font-semibold">{p.price}</span>
                <span className={`ml-2 text-sm ${p.featured ? "text-paper/70" : "text-muted"}`}>{p.period}</span>
              </p>
              <p className={`mt-2 text-sm ${p.featured ? "text-paper/70" : "text-muted"}`}>{p.blurb}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className={p.featured ? "text-saffron" : "text-leaf"} aria-hidden="true">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-8 block rounded-full px-5 py-3 text-center font-semibold transition ${
                  p.featured ? "bg-saffron text-ink hover:bg-saffron-deep" : "border border-ink/20 hover:bg-sand"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  ["Do I need to know accounting?", "No. If you can send a WhatsApp message, you can use Kavya. It handles the categories and reconciliation for you."],
  ["Is my business data safe?", "Data is encrypted in transit and at rest, stored on servers in India, and never used to train shared AI models."],
  ["Which languages are supported?", "English, Hindi, Kannada and Tamil today. Telugu and Marathi are next on the roadmap."],
  ["Does it replace my CA?", "Kavya keeps your books clean and organised, so your CA spends less time (and you pay less) at filing time."],
];

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHead eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-saffron-deep">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
    </div>
  );
}
