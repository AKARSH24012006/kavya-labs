/** Dates shown in Indian Standard Time, the way Kavya's customers read them. */
export function formatDateTime(d?: Date | string | null, withTime = true) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  }).format(new Date(d));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
