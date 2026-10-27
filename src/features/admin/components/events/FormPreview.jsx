import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Clock, MapPin, X } from "lucide-react";
import AnswerField from "./AnswerField";
import { inputClass } from "../formStyles";
import { formatDate, sortQuestions, timeRange } from "./eventUtils";

const NAME_QUESTION = { id: "name", label: "Full name", type: "short_answer", required: true };
const EMAIL_QUESTION = { id: "email", label: "Email", type: "email", required: true };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 60;

// Shown right after the Email field: send a code, type the 6 digits, verify.
function EmailVerification({ email, verified, onVerified }) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const emailValid = EMAIL_PATTERN.test(email.trim());

  const sendCode = () => {
    setCodeSent(true);
    setCode("");
    setError("");
    setSecondsLeft(RESEND_SECONDS);
    setMessage(`We sent a 6-digit code to ${email.trim()}.`);
  };

  const verify = () => {
    // BACKEND: real code is emailed and checked on the server.
    // In this preview any 6 digits count as correct.
    if (/^\d{6}$/.test(code)) {
      onVerified();
      setError("");
    } else {
      setError("Enter the 6-digit code from the email.");
    }
  };

  if (verified) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
        <BadgeCheck size={18} />
        Email verified
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-[#EAE5DF] bg-[#F8F6F3] p-3 sm:p-4">
      <p className="text-xs text-gray-600">
        We need to confirm your email before your spot is saved.
      </p>

      {!codeSent ? (
        <button
          type="button"
          onClick={sendCode}
          disabled={!emailValid}
          className="min-h-11 rounded-xl bg-[#19244E] px-4 text-sm font-bold text-white transition hover:bg-[#27376f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send code
        </button>
      ) : (
        <>
          {message && <p className="text-xs font-semibold text-[#19244E]">{message}</p>}
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              placeholder="6-digit code"
              aria-label="6-digit verification code"
              className={`${inputClass} max-w-[11rem] bg-white text-center font-mono tracking-[0.3em]`}
            />
            <button
              type="button"
              onClick={verify}
              className="min-h-11 rounded-xl bg-[#E58422] px-4 text-sm font-bold text-white transition hover:bg-[#d47414]"
            >
              Verify
            </button>
          </div>
          <button
            type="button"
            onClick={sendCode}
            disabled={secondsLeft > 0}
            className="min-h-11 text-xs font-bold text-[#E58422] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
          </button>
        </>
      )}

      {!emailValid && !codeSent && (
        <p className="text-[11px] text-gray-500">Enter a valid email above first.</p>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

// The registration form as customers will see it (full screen on phones).
// Nothing is sent: submitting only shows a note.
export default function FormPreview({ event, type, questions, onClose }) {
  const [values, setValues] = useState({});
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const typeQuestions = sortQuestions(
    questions.filter((question) => question.participant_type_id === type.id)
  );

  const setValue = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    setResult("");
    // A new email address has to be verified again.
    if (id === "email") setVerified(false);
  };

  const field = (question) => (
    <AnswerField
      id={`preview-${question.id}`}
      question={question}
      value={values[question.id] ?? (question.type === "checkboxes" ? [] : "")}
      onChange={(value) => setValue(question.id, value)}
    />
  );

  const cardClass = "rounded-2xl border border-[#EAE5DF] bg-white p-4 sm:p-6";

  return (
    <div
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-gray-950/50 sm:items-center sm:p-6"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Form preview"
        className="flex h-full w-full flex-col overflow-hidden bg-[#F8F6F3] shadow-2xl sm:h-auto sm:max-h-full sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EAE5DF] bg-white px-4 py-2 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Preview · what customers see
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-[#EAE5DF] bg-white">
            {event.cover_image_url && (
              <img src={event.cover_image_url} alt="" className="aspect-[16/6] w-full object-cover" />
            )}
            <div className="border-t-4 border-[#E58422] p-4 sm:p-6">
              <h2 className="text-xl font-bold text-[#19244E] sm:text-2xl">{event.title}</h2>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{formatDate(event.event_date)}</span>
                <span className="inline-flex items-center gap-1"><Clock size={13} />{timeRange(event)}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.venue}</span>
              </p>
              <p className="mt-3 inline-block rounded-lg bg-[#FFF3E7] px-3 py-1 text-xs font-bold text-[#B96916]">
                Registering as: {type.name}
              </p>
              <p className="mt-3 text-xs text-rose-500">* Required</p>
            </div>
          </div>

          <form
            onSubmit={(submitEvent) => {
              submitEvent.preventDefault();
              setResult(
                verified
                  ? "Preview only: nothing was sent. On the live site this registers the person."
                  : "Verify your email before submitting."
              );
            }}
            className="mt-3 space-y-3"
          >
            <div className={cardClass}>{field(NAME_QUESTION)}</div>

            <div className={`${cardClass} space-y-3`}>
              {field(EMAIL_QUESTION)}
              <EmailVerification
                key={values.email ?? ""}
                email={values.email ?? ""}
                verified={verified}
                onVerified={() => setVerified(true)}
              />
            </div>

            {typeQuestions.map((question) => (
              <div key={question.id} className={cardClass}>
                {field(question)}
              </div>
            ))}

            {result && (
              <p
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  verified
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {result}
              </p>
            )}

            <button
              type="submit"
              className="min-h-11 w-full rounded-xl bg-[#E58422] px-5 text-sm font-bold text-white transition hover:bg-[#d47414] sm:w-auto"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
