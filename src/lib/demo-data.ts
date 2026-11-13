import type { Analytics, DayCount } from "@/lib/analytics";
import type { AdminUser } from "@/lib/users";

/** Sample data for the public /admin/demo preview. Deterministic, so every visitor sees the same thing. */
const people: [string, string, "admin" | "user", "active" | "suspended"][] = [
  ["Rohan Mehta", "rohan@kavyalabs.in", "admin", "active"],
  ["Ananya Rao", "ananya@kavyalabs.in", "admin", "active"],
  ["Suresh Gowda", "suresh@gowdatextiles.in", "user", "active"],
  ["Lakshmi Iyer", "lakshmi@iyersweets.com", "user", "active"],
  ["Imran Khan", "imran@khanhardware.in", "user", "active"],
  ["Priya Nair", "priya@nairpharma.in", "user", "active"],
  ["Vikram Shetty", "vikram@shettyprints.in", "user", "suspended"],
  ["Meera Joshi", "meera@joshiboutique.in", "user", "active"],
  ["Arjun Reddy", "arjun@reddyelectricals.in", "user", "active"],
  ["Fatima Sheikh", "fatima@sheikhcaterers.in", "user", "active"],
  ["Karthik Subramanian", "karthik@ksauto.in", "user", "active"],
  ["Deepa Kulkarni", "deepa@kulkarnifoods.in", "user", "active"],
];

const day = (offset: number) => {
  const d = new Date(Date.now() + 5.5 * 3600e3); // IST calendar day
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
};

const series = (fn: (i: number) => number): DayCount[] => Array.from({ length: 30 }, (_, i) => ({ day: day(29 - i), count: fn(i) }));

export const demoUsers: AdminUser[] = people.map(([name, email, role, status], i) => ({
  id: i + 1,
  name,
  email,
  image: null,
  role,
  status,
  created_at: day(28 - i * 2) + "T10:30:00+05:30",
  last_login_at: status === "active" ? day(i % 5) + "T18:15:00+05:30" : null,
  logins: 30 - i * 2,
}));

const signups = series((i) => [0, 1, 0, 0, 1, 0, 1][i % 7] + (i > 20 ? 1 : 0));
const logins = series((i) => 3 + ((i * 7) % 5) + Math.floor(i / 6));

export const demoAnalytics: Analytics = {
  totals: {
    users: demoUsers.length,
    newThisWeek: 3,
    active7d: 9,
    admins: 2,
    suspended: 1,
    waitlist: 47,
    logins30d: logins.reduce((s, d) => s + d.count, 0),
  },
  signups,
  logins,
  activity: [
    { kind: "signup", text: "Deepa Kulkarni joined", at: day(0) + "T11:02:00+05:30" },
    { kind: "admin", text: "rohan@kavyalabs.in suspended vikram@shettyprints.in", at: day(1) + "T16:40:00+05:30" },
    { kind: "signup", text: "Karthik Subramanian joined", at: day(2) + "T09:12:00+05:30" },
    { kind: "admin", text: "rohan@kavyalabs.in promoted to admin ananya@kavyalabs.in", at: day(3) + "T12:00:00+05:30" },
    { kind: "signup", text: "Fatima Sheikh joined", at: day(4) + "T19:25:00+05:30" },
  ],
};
