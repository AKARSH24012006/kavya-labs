import Link from "next/link";
import type { Analytics } from "@/lib/analytics";
import StatCard from "./StatCard";
import ColumnChart from "./ColumnChart";
import ActivityFeed from "./ActivityFeed";

/** Analytics overview, shared by the live admin page and the public demo. */
export default function Overview({ data, usersHref }: { data: Analytics; usersHref: string }) {
  const t = data.totals;
  const conversion = t.waitlist ? Math.round((t.users / t.waitlist) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={t.users} hint={`+${t.newThisWeek} in the last 7 days`} />
        <StatCard label="Active this week" value={t.active7d} hint="Signed in during the last 7 days" />
        <StatCard label="Sign-ins (30 days)" value={t.logins30d} hint="Google sign-ins" />
        <StatCard label="Waitlist" value={t.waitlist} hint={t.waitlist ? `${conversion}% have an account` : "From the landing page form"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ColumnChart title="New sign-ups per day" data={data.signups} color="#d9772b" />
        <ColumnChart title="Sign-ins per day" data={data.logins} color="#2f9e74" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ActivityFeed items={data.activity} />
        <section aria-labelledby="team-h" className="rounded-3xl bg-ink p-5 text-paper">
          <h2 id="team-h" className="font-semibold">Accounts</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div><dt className="text-sm text-paper/70">Admins</dt><dd className="font-display text-2xl font-semibold">{t.admins}</dd></div>
            <div><dt className="text-sm text-paper/70">Suspended</dt><dd className="font-display text-2xl font-semibold">{t.suspended}</dd></div>
          </dl>
          <Link href={usersHref} className="mt-6 inline-flex rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-ink hover:bg-saffron-deep">
            Manage users →
          </Link>
        </section>
      </div>
    </div>
  );
}
