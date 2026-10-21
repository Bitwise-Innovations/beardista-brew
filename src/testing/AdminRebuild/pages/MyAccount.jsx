import { useEffect, useState } from "react";
import {
  CalendarClock,
  KeyRound,
  Mail,
  MailCheck,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import ModalWrapper from "../components/ModalWrapper";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialAccount = {
  name: "Administrator",
  email: "admin@beardistabrew.com",
  // A new email waits here until the confirmation code is entered.
  pendingEmail: "",
  role: "Owner",
  lastLogin: "Oct 22, 2026 · 8:14 AM",
};

const passwordFields = [
  { name: "current", label: "Current password", autoComplete: "current-password" },
  { name: "next", label: "New password", autoComplete: "new-password" },
  { name: "confirm", label: "Confirm new password", autoComplete: "new-password" },
];

const emptyForm = { current: "", next: "", confirm: "" };

const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100";

const secondaryButtonClass =
  "min-h-11 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50";

export default function MyAccount() {
  const [account, setAccount] = useState(initialAccount);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "" });
  const [detailsError, setDetailsError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const draftEmailChanged =
    draft.email.trim().toLowerCase() !== account.email.toLowerCase();

  const details = [
    { label: "Name", value: account.name, icon: UserRound },
    { label: "Email", value: account.email, icon: Mail, pending: account.pendingEmail },
    { label: "Role", value: account.role, icon: ShieldCheck, badge: true },
    { label: "Last login", value: account.lastLogin, icon: CalendarClock },
  ];

  const startEditing = () => {
    setDraft({ name: account.name, email: account.pendingEmail || account.email });
    setDetailsError("");
    setSuccess("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDetailsError("");
  };

  const saveDetails = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();

    if (!name) {
      setDetailsError("Enter your name.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setDetailsError("Enter a valid email address.");
      return;
    }

    setAccount((current) => ({
      ...current,
      name,
      pendingEmail: draftEmailChanged ? email : "",
    }));
    setEditing(false);
    setSuccess(
      draftEmailChanged
        ? "We'll send a confirmation code to the new email. Your email changes once the code is entered. (Preview only, no email was sent.)"
        : "Account details updated. (Preview only, nothing was saved.)"
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setError("");
  };

  useEffect(() => {
    if (!modalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { current, next, confirm } = form;

    if (!current || !next || !confirm) {
      setError("Fill in all three password fields.");
      return;
    }
    if (current.length < 8) {
      setError("Current password must be at least 8 characters.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next === current) {
      setError("New password must be different from your current one.");
      return;
    }

    closeModal();
    setSuccess("Password changed. (Preview only, nothing was saved.)");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#E58422]">ADMIN WORKSPACE</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#19244E] sm:text-3xl">
          My Account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View and edit your account details, or change your password.
        </p>
      </div>

      {success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
        >
          {success}
        </p>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#19244E] text-sm font-bold text-white sm:h-14 sm:w-14">
              AD
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-extrabold text-[#19244E] sm:text-lg">
                {account.name}
              </h2>
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                {account.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className={`inline-flex items-center justify-center gap-2 ${secondaryButtonClass}`}
              >
                <Pencil size={16} className="hidden sm:block" />
                Edit Details
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSuccess("");
                setModalOpen(true);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#19244E] px-5 text-sm font-semibold text-white transition hover:bg-[#27376f]"
            >
              <KeyRound size={16} className="hidden sm:block" />
              Change Password
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={saveDetails} noValidate className="mt-5 space-y-4 sm:mt-6">
            {detailsError && (
              <p
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
              >
                {detailsError}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="account-name" className="text-xs font-bold text-[#19244E]">
                  Name
                </label>
                <input
                  id="account-name"
                  type="text"
                  autoComplete="name"
                  value={draft.name}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, name: event.target.value }));
                    setDetailsError("");
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="account-email" className="text-xs font-bold text-[#19244E]">
                  Email
                </label>
                <input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  value={draft.email}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, email: event.target.value }));
                    setDetailsError("");
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            {draftEmailChanged && (
              <p className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-[#19244E]">
                <MailCheck size={18} className="mt-0.5 hidden shrink-0 text-[#E58422] sm:block" />
                We'll send a confirmation code to the new email.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={cancelEditing} className={secondaryButtonClass}>
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d47414]"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
            {details.map(({ label, value, icon: Icon, badge, pending }) => (
              <div key={label} className="min-w-0 rounded-xl bg-gray-50 p-3 sm:p-4">
                <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  <Icon size={14} className="hidden sm:block" />
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-bold text-[#19244E]">
                  {badge ? (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        value === "Owner"
                          ? "bg-orange-50 text-[#E58422]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                  {pending && (
                    <span className="mt-1 block text-[11px] font-semibold text-[#E58422]">
                      Pending: {pending} (waiting for code)
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {modalOpen && (
        <ModalWrapper
          title="Change password"
          description="Your new password needs at least 8 characters."
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
              >
                {error}
              </p>
            )}

            {passwordFields.map(({ name, label, autoComplete }) => (
              <div key={name}>
                <label
                  htmlFor={`password-${name}`}
                  className="text-xs font-bold text-[#19244E]"
                >
                  {label}
                </label>
                <input
                  id={`password-${name}`}
                  type="password"
                  autoComplete={autoComplete}
                  value={form[name]}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, [name]: event.target.value }));
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  className={inputClass}
                />
              </div>
            ))}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className={secondaryButtonClass}>
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf7419]"
              >
                Save Password
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}
