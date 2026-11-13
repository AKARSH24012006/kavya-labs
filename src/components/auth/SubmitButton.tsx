"use client";

import { useFormStatus } from "react-dom";

/** Submit button with a built-in pending state for server-action forms. */
export default function SubmitButton({
  children,
  pendingLabel,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={
        className ||
        "flex w-full items-center justify-center gap-3 rounded-full border-2 border-ink/10 bg-white px-6 py-3.5 font-semibold text-ink shadow-sm transition hover:border-ink disabled:cursor-wait disabled:opacity-70"
      }
    >
      {pending ? <Spinner /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />;
}
