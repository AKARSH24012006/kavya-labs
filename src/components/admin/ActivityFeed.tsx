import type { Activity } from "@/lib/analytics";
import { formatDateTime } from "@/lib/format";

/** Latest sign-ups and admin actions, newest first. */
export default function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <section aria-labelledby="activity-h" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <h2 id="activity-h" className="font-semibold">Recent activity</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Nothing yet. Activity shows up here as people sign up.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.kind === "signup" ? "bg-leaf" : "bg-saffron-deep"}`} />
              <div className="min-w-0">
                <p className="break-words">
                  <span className="sr-only">{a.kind === "signup" ? "Sign-up: " : "Admin action: "}</span>
                  {a.text}
                </p>
                <p className="text-xs text-muted">{formatDateTime(a.at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
