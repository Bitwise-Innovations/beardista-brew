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
import PageHeader from "../components/PageHeader";
import OwnerAvatar from "../components/OwnerAvatar";
import DataCard from "../components/DataCard";
import BrewingLoader from "../components/BrewingLoader";
import { useAuth } from "../../../backend/hooks/useAuth";
import { useStaffIdentity } from "../components/useStaffIdentity";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const formatLogin = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

export default function MyAccount() {
  const staff = useStaffIdentity();
  const {
    updateMyName,
    isUpdatingName,
    requestEmailChange,
    isRequestingEmailChange,
    changePasswordChecked,
    isChangingPasswordChecked,
  } = useAuth();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "" });
  const [detailsError, setDetailsError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saving = isUpdatingName || isRequestingEmailChange;
  const draftEmailChanged =
    draft.email.trim().toLowerCase() !== staff.email.toLowerCase();

  const details = [
    { label: "Name", value: staff.name, icon: UserRound },
    { label: "Email", value: staff.email, icon: Mail, pending: staff.pendingEmail },
    { label: "Role", value: staff.role, icon: ShieldCheck, badge: true },
    { label: "Last login", value: formatLogin(staff.lastLogin), icon: CalendarClock },
  ];

  const startEditing = () => {
    setDraft({ name: staff.name, email: staff.pendingEmail || staff.email });
    setDetailsError("");
    setSuccess("");
    setEditing(true);
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();

    if (!name) return setDetailsError("Enter your name.");
    if (!EMAIL_PATTERN.test(email)) return setDetailsError("Enter a valid email address.");

    try {
      if (name !== staff.name) await updateMyName(name);
      if (draftEmailChanged) await requestEmailChange(email);
      setEditing(false);
      setSuccess(
        draftEmailChanged
          ? `We sent a confirmation link to ${email}. Your email changes once you click it.`
          : "Account details updated."
      );
    } catch {
      setDetailsError("We couldn't save your details. Please try again.");
    }
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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const { current, next, confirm } = form;

    if (!current || !next || !confirm) return setError("Fill in all three password fields.");
    if (next.length < 8) return setError("New password must be at least 8 characters.");
    if (next !== confirm) return setError("New passwords do not match.");
    if (next === current) return setError("New password must be different from your current one.");

    try {
      await changePasswordChecked({
        email: staff.email,
        currentPassword: current,
        newPassword: next,
      });
      closeModal();
      setSuccess("Password changed.");
    } catch (passwordError) {
      setError(
        passwordError.code === "wrong_password"
          ? "Your current password is incorrect."
          : "We couldn't change your password. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Account"
        description="View and edit your account details, or change your password."
      />

      {success && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {success}
        </p>
      )}

      <DataCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <OwnerAvatar className="h-12 w-12 text-sm sm:h-14 sm:w-14" />
            <div className="min-w-0">
              <h2 className="truncate text-base font-extrabold text-[#19244E] sm:text-lg">{staff.name}</h2>
              <p className="truncate text-xs text-gray-500 sm:text-sm">{staff.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {!editing && (
              <button type="button" onClick={startEditing} className={`inline-flex items-center justify-center gap-2 ${secondaryButtonClass}`}>
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
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {detailsError}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="account-name" className="text-xs font-bold text-[#19244E]">Name</label>
                <input
                  id="account-name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  value={draft.name}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, name: event.target.value }));
                    setDetailsError("");
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="account-email" className="text-xs font-bold text-[#19244E]">Email</label>
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
                We'll send a confirmation link to the new email.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEditing(false)} className={secondaryButtonClass}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex min-h-11 items-center justify-center rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d47414] disabled:cursor-wait"
              >
                {saving ? <BrewingLoader tone="light" size={24} label="Saving..." /> : "Save"}
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
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${value === "Owner" ? "bg-orange-50 text-[#E58422]" : "bg-gray-100 text-gray-600"}`}>
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                  {pending && (
                    <span className="mt-1 block text-[11px] font-semibold text-[#E58422]">
                      Pending: {pending} (check that inbox)
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </DataCard>

      {modalOpen && (
        <ModalWrapper title="Change password" description="Your new password needs at least 8 characters.">
          <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4">
            {error && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}

            {passwordFields.map(({ name, label, autoComplete }) => (
              <div key={name}>
                <label htmlFor={`password-${name}`} className="text-xs font-bold text-[#19244E]">{label}</label>
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
                disabled={isChangingPasswordChecked}
                className="flex min-h-11 items-center justify-center rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf7419] disabled:cursor-wait"
              >
                {isChangingPasswordChecked ? <BrewingLoader tone="light" size={24} label="Saving..." /> : "Save Password"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}