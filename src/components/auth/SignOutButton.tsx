import { signOut } from "@/auth";
import SubmitButton from "./SubmitButton";

export default function SignOutButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <SubmitButton
        pendingLabel="Signing out…"
        className={className ?? "rounded-full border-2 border-ink/10 px-4 py-2 text-sm font-semibold transition hover:border-ink disabled:opacity-60"}
      >
        Sign out
      </SubmitButton>
    </form>
  );
}
