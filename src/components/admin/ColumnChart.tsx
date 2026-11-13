"use client";

import { useState } from "react";
import type { DayCount } from "@/lib/analytics";

const W = 600;
const H = 180;
const PAD = { top: 12, right: 8, bottom: 24, left: 32 };

/** Clean axis ticks: 0, then a round step so the top tick sits at or above the max. */
function ticks(max: number) {
  const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : Math.ceil(max / 5 / 10) * 10;
  const top = Math.max(step, Math.ceil(max / step) * step);
  return Array.from({ length: top / step + 1 }, (_, i) => i * step);
}

const label = (day: string) => new Date(day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** Single-series daily column chart with hover tooltip and a table view. */
export default function ColumnChart({ title, data, color }: { title: string; data: DayCount[]; color: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.count, 0);
  const yTicks = ticks(Math.max(...data.map((d) => d.count), 0));
  const yMax = yTicks[yTicks.length - 1];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.min(24, slot - 2); // 2px surface gap between columns
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;
  const active = hover !== null ? data[hover] : null;

  return (
    <figure className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-muted">
          <b className="text-ink">{total}</b> in 30 days
        </span>
      </figcaption>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}: ${total} in the last 30 days`} onMouseLeave={() => setHover(null)}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#ebe7df" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#5b6075">{t}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * slot + (slot - barW) / 2;
            const h = (d.count / yMax) * plotH;
            const r = Math.min(4, h, barW / 2);
            return (
              <g key={d.day} onMouseEnter={() => setHover(i)}>
                {/* Hit target is the whole column slot, bigger than the mark */}
                <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={plotH} fill="transparent" />
                {h > 0 && (
                  <path
                    d={`M${x},${y(0)} V${y(0) - h + r} Q${x},${y(0) - h} ${x + r},${y(0) - h} H${x + barW - r} Q${x + barW},${y(0) - h} ${x + barW},${y(0) - h + r} V${y(0)} Z`}
                    fill={color}
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                )}
              </g>
            );
          })}
          {data.map((d, i) =>
            (data.length - 1 - i) % 7 === 0 ? (
              <text key={d.day} x={PAD.left + i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="#5b6075">
                {label(d.day)}
              </text>
            ) : null,
          )}
        </svg>
        {active && hover !== null && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-paper shadow-lg"
            style={{ left: `${((PAD.left + hover * slot + slot / 2) / W) * 100}%` }}
          >
            <b>{active.count}</b> · {label(active.day)}
          </div>
        )}
      </div>

      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-muted hover:text-ink">Show as table</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr className="text-muted"><th className="py-1 font-medium">Day</th><th className="py-1 text-right font-medium">Count</th></tr></thead>
          <tbody>
            {data.filter((d) => d.count > 0).map((d) => (
              <tr key={d.day} className="border-t border-ink/5"><td className="py-1">{label(d.day)}</td><td className="py-1 text-right tabular-nums">{d.count}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
