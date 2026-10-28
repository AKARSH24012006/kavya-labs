export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0f1222" />
      <path d="M10 8v16" stroke="#fbf8f2" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 8l-8 8 8 8" stroke="#f2994a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
