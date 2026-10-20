import React, { useState } from "react";
import {
  Store,
  Wifi,
  ShieldCheck,
  MapPin,
  Clock3,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";

const defaults = {
  storeName: "Beardista Brew",
  tagline: "Brewing Good Times, One Cup at a Time",
  address: "Caloocan City, Philippines",
  openingTime: "4:00 PM",
  closingTime: "12:00 AM",
  wifiSSID: "Beardista_Guest",
  wifiPass: "guestpassword123",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-[#19244E] outline-none transition focus:border-[#E58422] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500";

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function Section({ icon: Icon, title, description, accent = false, children }) {
  return (
    <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-start gap-3 border-b border-gray-100 pb-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accent ? "bg-orange-50 text-[#E58422]" : "bg-[#19244E] text-white"
        }`}>
          <Icon size={21} />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-[#19244E]">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Settings() {
  const [form, setForm] = useState(defaults);
  const [saved, setSaved] = useState(defaults);
  const [notice, setNotice] = useState("");
  const [showWifi, setShowWifi] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setSaved({ ...form });
    setNotice("Settings saved in this preview session only.");
  };

  const validatePasswordDemo = (event) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setPasswordNotice("Use at least 8 characters for this demo.");
    } else if (newPassword !== confirmPassword) {
      setPasswordNotice("The password entries do not match.");
    } else {
      setPasswordNotice("Demo validated. No real account password was changed.");
    }
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved);

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E58422]">
            ADMIN WORKSPACE
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#19244E] sm:text-3xl">
            System &amp; Store Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Configure store information, guest Wi-Fi details, and administrator security preferences.
          </p>
        </div>
        <button
          type="submit"
          form="settings-form"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E58422] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#d47414]"
        >
          <Save size={17} /> Save All Settings
        </button>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <Info size={19} className="mt-0.5 shrink-0" />
        <p><strong>UI preview only.</strong> Changes stay in local React state and are not sent to a database or live store.</p>
      </div>

      {notice && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 size={19} className="shrink-0" />
          <p><strong>Preview saved.</strong> {notice}</p>
        </div>
      )}

      <form id="settings-form" onSubmit={saveSettings} className="space-y-6">
        <Section
          icon={Store}
          title="Café Brand & Physical Location"
          description="Store identity and operating hours shown to customers."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Store Name" value={form.storeName} onChange={(v) => update("storeName", v)} />
            <Field label="Tagline / Concept" value={form.tagline} onChange={(v) => update("tagline", v)} />
          </div>
          <div>
            <label className={labelClass}><span className="inline-flex items-center gap-2"><MapPin size={14} /> Branch Street Address</span></label>
            <input value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Opening Time (Daily)" value={form.openingTime} onChange={(v) => update("openingTime", v)} placeholder="4:00 PM" />
            <Field label="Closing Time" value={form.closingTime} onChange={(v) => update("closingTime", v)} placeholder="12:00 AM" />
          </div>
        </Section>

        <Section
          icon={Wifi}
          title="Guest Wi-Fi Station Broadcast"
          description="Network information for the customer Stay Connected section."
          accent
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Network SSID (Name)" value={form.wifiSSID} onChange={(v) => update("wifiSSID", v)} />
            <div>
              <label className={labelClass}>Wi-Fi Password</label>
              <div className="relative">
                <input
                  type={showWifi ? "text" : "password"}
                  value={form.wifiPass}
                  onChange={(e) => update("wifiPass", e.target.value)}
                  className={`${inputClass} pr-12 font-mono`}
                />
                <button type="button" aria-label="Toggle Wi-Fi password visibility" onClick={() => setShowWifi(!showWifi)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-200">
                  {showWifi ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Guest network preview</p>
            <p className="mt-2 text-sm font-bold text-[#19244E]">{form.wifiSSID || "Network name not set"}</p>
            <p className="mt-1 text-xs text-gray-500">{form.wifiPass ? "Password configured" : "No password entered"}</p>
            <p className="mt-3 text-xs text-gray-400">QR code generation is not connected in this preview.</p>
          </div>
        </Section>

        <Section
          icon={ShieldCheck}
          title="Administrator Account Security"
          description="Manage the password-change interface for the admin portal."
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#19244E] shadow-sm"><LockKeyhole size={19} /></div>
              <div>
                <p className="text-sm font-bold text-[#19244E]">Administrator Password</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Open a local demonstration of the password-change form.</p>
              </div>
            </div>
            <button type="button" onClick={() => { setShowPasswordModal(true); setPasswordNotice(""); setNewPassword(""); setConfirmPassword(""); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#19244E] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#29386f]">
              <LockKeyhole size={15} /> Change Password
            </button>
          </div>
        </Section>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">{hasChanges ? "You have unsaved preview changes." : "Values match the last local save."}</p>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E58422] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#d47414]">
            <Save size={17} /> Save All Settings
          </button>
        </div>
      </form>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#10172f]/60 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="password-title" className="my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#E58422]"><LockKeyhole size={23} /></div>
              <button type="button" aria-label="Close dialog" onClick={() => setShowPasswordModal(false)} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <h2 id="password-title" className="mt-5 text-xl font-black text-[#19244E]">Change Password</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Demonstration form only. No administrator credentials are stored or changed.</p>
            <form onSubmit={validatePasswordDemo} className="mt-6 space-y-4">
              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input required autoComplete="new-password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordNotice(""); }} placeholder="At least 8 characters" className={`${inputClass} pr-12`} />
                  <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-200">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input required autoComplete="new-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordNotice(""); }} placeholder="Re-enter password" className={inputClass} />
              </div>
              {passwordNotice && <p role="status" className={`rounded-xl p-3 text-xs leading-5 ${passwordNotice.startsWith("Demo validated") ? "bg-green-50 text-green-800" : "bg-rose-50 text-rose-700"}`}>{passwordNotice}</p>}
              <button type="submit" className="w-full rounded-xl bg-[#E58422] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#d47414]">Validate Demo</button>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
