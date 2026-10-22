import { BadgeCheck, MailWarning } from "lucide-react";
import { REGISTRATION_STATUS } from "./eventUtils";

// White pill with a coloured dot, readable on top of cover photos.
// `className` sets the display (e.g. "hidden sm:inline-flex"), so it never clashes with a built-in one.
// `flat` swaps the shadow for a border when the pill sits on a white card.
export function EventPill({ pill, className = "inline-flex", flat = false }) {
  return (
    <span
      className={`shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold ${
        flat ? "border border-[#EAE5DF]" : "shadow-sm"
      } ${pill.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${pill.dot}`} />
      {pill.label}
    </span>
  );
}

export function RegistrationStatusBadge({ status }) {
  const { label, className } = REGISTRATION_STATUS[status] ?? REGISTRATION_STATUS.pending;

  return (
    <span className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${className}`}>
      {label}
    </span>
  );
}

export function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
      <BadgeCheck size={12} />
      Verified
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
      <MailWarning size={12} />
      Not verified
    </span>
  );
}
