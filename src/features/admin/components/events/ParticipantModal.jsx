import { useState } from "react";
import { MailCheck, Send } from "lucide-react";
import ModalWrapper from "../ModalWrapper";
import { cancelButtonClass } from "../formStyles";
import { RegistrationStatusBadge, VerifiedBadge } from "./Badges";
import {
  ADMIN_STATUSES,
  REGISTRATION_STATUS,
  answerText,
  formatDate,
  formatDateTime,
} from "./eventUtils";

function Detail({ label, children }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#F8F6F3] p-3">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[#19244E]">{children}</dd>
    </div>
  );
}

// Everything one person filled in on the registration form, plus status and email verification.
export default function ParticipantModal({
  registration,
  eventTitle,
  typeName,
  questions,
  answers,
  onClose,
  onStatusChange,
  onResendCode,
}) {
  const [codeMessage, setCodeMessage] = useState("");
  const pending = registration.status === "pending";

  const resend = () => {
    onResendCode(registration.id);
    setCodeMessage(`Code sent again to ${registration.email}`);
  };

  return (
    <ModalWrapper
      title={registration.name}
      description={`${eventTitle} · ${typeName}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
      sheetOnPhone
      dismissible
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={`${cancelButtonClass} w-full sm:w-auto`}>
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <dl className="grid gap-3 sm:grid-cols-3">
          <Detail label="Email">
            <span className="block break-all">{registration.email}</span>
            <span className="mt-1 block">
              <VerifiedBadge verified={registration.email_verified} />
            </span>
          </Detail>
          <Detail label="Registered on">{formatDateTime(registration.registered_at)}</Detail>
          <Detail label="Code last sent">{formatDateTime(registration.verification_sent_at)}</Detail>
        </dl>

        {pending && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-900">Waiting for email verification</p>
            <p className="mt-1 text-xs leading-5 text-sky-800">
              {registration.name.split(" ")[0]} has not entered the 6-digit code yet. Their spot is
              confirmed (or waitlisted) once they do.
            </p>
            <button
              type="button"
              onClick={resend}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#19244E] px-4 text-sm font-bold text-white transition hover:bg-[#27376f]"
            >
              <Send size={15} />
              Resend code
            </button>
            {codeMessage && (
              <p role="status" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <MailCheck size={14} />
                {codeMessage}
              </p>
            )}
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#19244E]">Status</h3>
            <RegistrationStatusBadge status={registration.status} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Change status">
            {ADMIN_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(registration.id, status)}
                aria-pressed={registration.status === status}
                className={`min-h-11 rounded-xl border px-2 text-xs font-bold transition sm:text-sm ${
                  registration.status === status
                    ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]"
                    : "border-[#EAE5DF] text-gray-600 hover:bg-gray-50"
                }`}
              >
                {REGISTRATION_STATUS[status].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#19244E]">Registration answers</h3>
          <dl className="mt-2 divide-y divide-[#EFEAE4] rounded-2xl border border-[#EAE5DF]">
            {[
              { id: "name", label: "Full name", value: registration.name },
              { id: "email", label: "Email", value: registration.email },
              ...questions.map((question) => ({
                id: question.id,
                label: question.label || "Untitled question",
                value:
                  question.type === "date" && answers[question.id]
                    ? formatDate(answers[question.id])
                    : answerText(answers[question.id]),
              })),
            ].map((row) => (
              <div key={row.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                <dt className="text-xs font-semibold text-gray-500">{row.label}</dt>
                <dd className={`break-words text-sm ${row.value ? "font-semibold text-[#19244E]" : "italic text-gray-400"}`}>
                  {row.value || "No answer"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </ModalWrapper>
  );
}
