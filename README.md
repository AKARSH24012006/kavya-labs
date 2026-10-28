# Kavya Labs — Landing Page (ANDP Simulator · Level 1 · Week 1)

Landing page for **Kavya Labs**, a fictional Bengaluru AI startup building an AI back-office for Indian small businesses.
Week 1 brief from founder Rohan Mehta: *hero, features, footer* — shipped clean, ahead of the investor demo.

## Sections
- Sticky navbar with mobile menu
- Hero with animated product chat mock (Kannada + English)
- Features grid (6)
- How it works (3 steps)
- Testimonial + traction stats
- Pricing (Pilot / Growth)
- FAQ (native `<details>` accordion)
- Waitlist CTA with client-side email validation
- Footer with product / company / legal links

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Self-hosted variable fonts (Inter, Fraunces) via `@fontsource-variable`
- Fully static, no env vars needed

Built on the App Router so Week 2 (NextAuth + Google OAuth) and Week 3 (admin dashboard) slot in as new routes.

## Run locally
```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy
Import the repo in Vercel → framework auto-detects Next.js → Deploy.
