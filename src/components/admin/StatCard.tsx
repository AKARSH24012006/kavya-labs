import { formatNumber } from "@/lib/format";

/** A single headline number with a one-line explanation. */
export default function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{formatNumber(value)}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
