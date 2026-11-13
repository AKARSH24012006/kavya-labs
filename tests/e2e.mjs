// End-to-end checks for Weeks 1–3, run against a production build and a real Postgres.
//   DATABASE_URL=... BASE_URL=http://localhost:3000 node tests/e2e.mjs
// Google itself can't be driven in a test, so signed-in users get a session row inserted directly,
// exactly what Auth.js stores after a successful Google sign-in.
import pg from "pg";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
const results = [];
const ok = (name, cond, extra = "") => results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
const one = async (sql, p = []) => (await db.query(sql, p)).rows[0];

await db.connect();
await db.query("TRUNCATE users, accounts, sessions, login_events, waitlist, admin_actions RESTART IDENTITY CASCADE");

async function seedUser(name, email, role = "user", status = "active", daysAgo = 0) {
  const u = await one(
    `INSERT INTO users (name, email, role, status, created_at, last_login_at) VALUES ($1,$2,$3,$4, now() - $5 * interval '1 day', now()) RETURNING id`,
    [name, email, role, status, daysAgo],
  );
  await db.query("INSERT INTO login_events (user_id, provider, created_at) VALUES ($1, 'google', now() - $2 * interval '1 day')", [u.id, daysAgo]);
  return u.id;
}
async function sessionFor(userId) {
  const token = "test-" + userId + "-" + Math.random().toString(36).slice(2);
  await db.query(`INSERT INTO sessions ("userId", expires, "sessionToken") VALUES ($1, now() + interval '1 day', $2)`, [userId, token]);
  return { name: "authjs.session-token", value: token, url: BASE };
}

const adminId = await seedUser("Akarsh Nehra", "akarshnehra@gmail.com", "admin", "active", 10);
const memberId = await seedUser("Lakshmi Iyer", "lakshmi@iyersweets.com", "user", "active", 3);
await seedUser("Vikram Shetty", "vikram@shettyprints.in", "user", "suspended", 20);
const delId = await seedUser("Temp User", "temp@example.com", "user", "active", 1);

const browser = await chromium.launch();
const errors = [];
async function page(cookie, viewport = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  if (cookie) await ctx.addCookies([cookie]);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  return p;
}

// ---------- Week 1 + public pages ----------
let p = await page();
await p.goto(BASE);
ok("landing page renders hero + features + footer", (await p.locator("h1").count()) === 1 && (await p.locator("#features").count()) === 1 && (await p.locator("footer").count()) === 1);
ok("signed-out navbar links to /login", (await p.locator('header a[href="/login"]').first().textContent())?.includes("Sign in"));

await p.fill("#email", "not-an-email");
await p.click('#waitlist button[type="submit"]');
ok("waitlist rejects an invalid email", await p.isVisible("#email-error"));
await p.fill("#email", "Owner@Shop.in");
await p.click('#waitlist button[type="submit"]');
await p.waitForSelector('#waitlist [role="status"]');
ok("waitlist saves the email to the database", (await one("SELECT count(*)::int c FROM waitlist WHERE email = 'owner@shop.in'")).c === 1);
const dup = await p.evaluate(async () => (await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email: "owner@shop.in" }) })).status);
ok("duplicate waitlist email is accepted without a second row", dup === 200 && (await one("SELECT count(*)::int c FROM waitlist")).c === 1);

// ---------- Week 2: auth ----------
await p.goto(BASE + "/dashboard");
ok("signed-out /dashboard redirects to /login with callbackUrl", /\/login\?callbackUrl=%2Fdashboard/.test(p.url()), p.url());
await p.goto(BASE + "/admin");
ok("signed-out /admin redirects to /login", /\/login\?callbackUrl=%2Fadmin/.test(p.url()), p.url());
ok("login page shows Continue with Google", await p.isVisible("text=Continue with Google"));

// The server fetches Google's OpenID config before redirecting; skip if this machine can't reach Google.
const googleReachable = await fetch("https://accounts.google.com/.well-known/openid-configuration").then((r) => r.ok, () => false);
if (googleReachable) {
  let googleUrl = "";
  await p.route(/accounts\.google\.com/, (r) => { googleUrl = r.request().url(); return r.fulfill({ body: "google" }); });
  await p.click("text=Continue with Google");
  await p.waitForURL(/accounts\.google\.com/, { timeout: 10000 }).catch(() => {});
  ok("Google button starts the OAuth flow", googleUrl.includes("accounts.google.com") && googleUrl.includes("redirect_uri"), googleUrl.slice(0, 80));
  ok("OAuth callback points at /api/auth/callback/google", decodeURIComponent(googleUrl).includes("/api/auth/callback/google"));
} else {
  console.log("SKIP  Google OAuth redirect (accounts.google.com not reachable from this machine)");
}

await p.goto(BASE + "/login?error=Suspended");
ok("suspended error explains itself", (await p.textContent('[role="alert"]'))?.includes("suspended"));

let memberCookie = await sessionFor(memberId);
const m = await page(memberCookie);
await m.goto(BASE);
ok("signed-in navbar shows Dashboard", await m.isVisible('header a[href="/dashboard"]'));
await m.goto(BASE + "/login");
ok("signed-in user visiting /login goes to dashboard", m.url().endsWith("/dashboard"));
ok("dashboard greets the user by first name", (await m.textContent("h1"))?.includes("Lakshmi"));
ok("dashboard shows email and member role", (await m.content()).includes("lakshmi@iyersweets.com") && (await m.textContent("main")).includes("Member"));
ok("member has no Admin tab", (await m.locator('nav[aria-label="App"] a[href="/admin"]').count()) === 0);
await m.goto(BASE + "/admin");
ok("member is kept out of /admin", m.url().includes("/dashboard?denied=admin") && (await m.textContent('[role="alert"]')).includes("admin"));
const exp = await m.request.get(BASE + "/admin/users/export", { maxRedirects: 0 });
ok("member can't download the user CSV", exp.status() >= 300 && exp.status() < 400, String(exp.status()));

// ---------- Week 3: admin ----------
const a = await page(await sessionFor(adminId));
await a.goto(BASE + "/admin");
const text = await a.textContent("main");
ok("admin overview loads", a.url().endsWith("/admin") && text.includes("Overview"));
ok("KPI: total users = 4", /Total users\s*4/.test(text), text.slice(0, 120));
ok("KPI: waitlist = 1", /Waitlist\s*1/.test(text));
ok("two charts rendered with 30 days each", (await a.locator("figure svg").count()) === 2);
ok("sign-up chart total matches the data (4 in 30 days)", (await a.locator("figure").first().textContent()).includes("4 in 30 days"));
const box = await a.locator("figure svg").first().boundingBox();
await a.mouse.move(box.x + box.width * 0.97, box.y + box.height * 0.5);
ok("hovering a column shows a tooltip", await a.locator('figure [role="status"]').first().isVisible());
ok("activity feed lists sign-ups", text.includes("Temp User joined"));

await a.goto(BASE + "/admin/users");
ok("user table lists all 4 users", (await a.locator("tbody tr").count()) === 4);
ok("your own row's actions are disabled", (await a.locator("tbody tr", { hasText: "akarshnehra@gmail.com" }).locator("button:disabled").count()) === 3);
await a.goto(BASE + "/admin/users?q=iyer");
ok("search filters by name/email", (await a.locator("tbody tr").count()) === 1);
await a.goto(BASE + "/admin/users?status=suspended");
ok("status filter shows only suspended", (await a.locator("tbody tr").count()) === 1 && (await a.textContent("tbody")).includes("Vikram"));

await a.goto(BASE + "/admin/users");
const row = (email) => a.locator("tbody tr", { hasText: email });
await row("lakshmi@").getByRole("button", { name: /Make admin/ }).click();
await row("lakshmi@").getByRole("button", { name: /Remove admin/ }).waitFor();
ok("Make admin promotes the user", (await one("SELECT role FROM users WHERE id = $1", [memberId])).role === "admin");
await row("lakshmi@").getByRole("button", { name: /Remove admin/ }).click();
await row("lakshmi@").getByRole("button", { name: /Make admin/ }).waitFor();
ok("Remove admin demotes them again", (await one("SELECT role FROM users WHERE id = $1", [memberId])).role === "user");

await row("lakshmi@").getByRole("button", { name: /^Suspend/ }).click();
await a.waitForTimeout(800);
ok("Suspend marks the user suspended", (await one("SELECT status FROM users WHERE id = $1", [memberId])).status === "suspended");
ok("Suspend signs them out everywhere", (await one(`SELECT count(*)::int c FROM sessions WHERE "userId" = $1`, [memberId])).c === 0);
await m.goto(BASE + "/dashboard");
ok("suspended user's next request lands on /login", m.url().includes("/login"));
await row("lakshmi@").getByRole("button", { name: /Reactivate/ }).click();
await a.waitForTimeout(800);
ok("Reactivate restores the account", (await one("SELECT status FROM users WHERE id = $1", [memberId])).status === "active");
memberCookie = await sessionFor(memberId); // they sign in again

const delBtn = row("temp@example.com").getByRole("button", { name: /delet/i });
await delBtn.click();
ok("first Delete click only asks to confirm", (await delBtn.textContent()).includes("Confirm") && (await one("SELECT count(*)::int c FROM users WHERE id = $1", [delId])).c === 1);
await delBtn.click();
await a.waitForTimeout(800);
ok("second click deletes the user", (await one("SELECT count(*)::int c FROM users WHERE id = $1", [delId])).c === 0);
ok("every admin action is in the audit log", (await one("SELECT count(*)::int c FROM admin_actions")).c === 5);
await a.goto(BASE + "/admin");
ok("audit entries show in recent activity", (await a.textContent("main")).includes("akarshnehra@gmail.com deleted temp@example.com"));

const csv = await a.request.get(BASE + "/admin/users/export");
const body = await csv.text();
ok("admin CSV export downloads all users", csv.headers()["content-disposition"]?.includes("kavya-users-") && body.split("\n").length === 4, body.split("\n")[0]);

// ---------- demo + layout ----------
const d = await page();
await d.goto(BASE + "/admin/demo");
ok("public demo renders the overview with sample data", (await d.textContent("main")).includes("Total users") && (await d.locator("figure svg").count()) === 2);
await d.goto(BASE + "/admin/demo?tab=users");
ok("demo user table has every action disabled", (await d.locator("tbody button:enabled").count()) === 0 && (await d.locator("tbody tr").count()) > 5);

for (const [label, cookie, path] of [["landing", null, "/"], ["login", null, "/login"], ["dashboard", memberCookie, "/dashboard"], ["admin", null, "/admin/demo"], ["admin users", null, "/admin/demo?tab=users"]]) {
  const mp = await page(cookie, { width: 375, height: 812 });
  await mp.goto(BASE + path);
  const over = await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(`mobile 375px: ${label} has no sideways scroll`, over <= 0, over + "px");
}
ok("no JS errors across all pages", errors.length === 0, errors.slice(0, 3).join(" | "));

await browser.close();
await db.end();
console.log(results.join("\n"));
const passed = results.filter((r) => r.startsWith("PASS")).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
