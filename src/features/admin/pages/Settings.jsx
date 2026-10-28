import { useEffect, useState } from "react";
import { MapPin, Save, CheckCircle2, AlertTriangle, Link2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataCard from "../components/DataCard";
import BrewingLoader from "../components/BrewingLoader";
import EmptyState from "../components/EmptyState";
import { useStoreSettings, useUpdateStoreSetting } from "../../../backend/hooks/useContent";

const STORE_KEY = "store_info";
const SOCIAL_KEY = "social_links";

const defaultStore = {
  storeName: "Beardista Brew",
  tagline: "Brewing Good Times, One Cup at a Time",
  address: "2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City",
  openingTime: "4:00 PM",
  closingTime: "12:00 AM",
};

const defaultSocial = {
  facebook: "https://www.facebook.com/Beardistabrew",
  instagram: "https://www.instagram.com/beardistabrew",
  tiktok: "",
};

const socialFields = [
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@..." },
];

const URL_PATTERN = /^https:\/\/\S+$/i;

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-[#19244E] outline-none transition focus:border-[#E58422] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500";

function Field({ id, label, value, onChange, placeholder, type = "text", error }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${error ? "border-rose-400" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>
      )}
    </div>
  );
}

export default function Settings() {
  const settingsQuery = useStoreSettings();
  const updateSetting = useUpdateStoreSetting();

  // Filled once the saved settings arrive, so typing is never overwritten by a refetch.
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!settingsQuery.data || form) return;

    const find = (key) => settingsQuery.data.find((setting) => setting.key === key)?.value ?? {};
    const initial = {
      ...defaultStore,
      ...find(STORE_KEY),
      social: { ...defaultSocial, ...find(SOCIAL_KEY) },
    };

    setForm(initial);
    setSaved(initial);
  }, [settingsQuery.data, form]);

  if (settingsQuery.isError) {
    return (
      <EmptyState
        title="We couldn't load the settings."
        message="Check your connection and try again."
        action={
          <button
            type="button"
            onClick={() => settingsQuery.refetch()}
            className="min-h-11 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white hover:bg-[#253570]"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <BrewingLoader label="Loading settings..." />
      </div>
    );
  }

  const clearMessages = () => {
    setNotice("");
    setError("");
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    clearMessages();
  };

  const updateSocial = (key, value) => {
    setForm((current) => ({ ...current, social: { ...current.social, [key]: value } }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    clearMessages();
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    clearMessages();

    const nextErrors = { storeName: form.storeName.trim() ? "" : "Store name is required." };
    socialFields.forEach(({ key, label }) => {
      const value = form.social[key].trim();
      nextErrors[key] =
        value && !URL_PATTERN.test(value) ? `${label} link must start with https://` : "";
    });

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await Promise.all([
        updateSetting.mutateAsync({
          key: STORE_KEY,
          value: {
            storeName: form.storeName.trim(),
            tagline: form.tagline.trim(),
            address: form.address.trim(),
            openingTime: form.openingTime.trim(),
            closingTime: form.closingTime.trim(),
          },
        }),
        updateSetting.mutateAsync({
          key: SOCIAL_KEY,
          value: Object.fromEntries(
            socialFields.map(({ key }) => [key, form.social[key].trim()])
          ),
        }),
      ]);
      setSaved(form);
      setNotice("Settings saved.");
    } catch {
      setError("We couldn't save the settings. Please try again.");
    }
  };

  const saving = updateSetting.isPending;
  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Store Settings"
        description="Configure store information and the social links shown to customers."
        actions={
          <div className="flex flex-col gap-1 sm:items-end">
            <button
              type="submit"
              form="settings-form"
              disabled={saving || !hasChanges}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E58422] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d47414] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <BrewingLoader tone="light" size={24} label="Saving..." />
              ) : (
                <>
                  <Save size={17} /> Save All Settings
                </>
              )}
            </button>
            <p className="text-xs text-gray-400">
              {hasChanges ? "You have unsaved changes." : "All changes saved."}
            </p>
          </div>
        }
      />

      {notice && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 size={19} className="shrink-0" />
          <p className="font-semibold">{notice}</p>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertTriangle size={19} className="shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form id="settings-form" onSubmit={saveSettings} noValidate className="space-y-6">
        <DataCard
          title="Café Brand & Physical Location"
          description="Store identity and operating hours shown to customers."
          bodyClassName="space-y-4 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="store-name"
              label="Store Name"
              value={form.storeName}
              onChange={(v) => update("storeName", v)}
              error={fieldErrors.storeName}
            />
            <Field id="store-tagline" label="Tagline / Concept" value={form.tagline} onChange={(v) => update("tagline", v)} />
          </div>
          <div>
            <label htmlFor="store-address" className={labelClass}>
              <span className="inline-flex items-center gap-2"><MapPin size={14} /> Branch Street Address</span>
            </label>
            <input id="store-address" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field id="store-opening" label="Opening Time" value={form.openingTime} onChange={(v) => update("openingTime", v)} placeholder="4:00 PM" />
            <Field id="store-closing" label="Closing Time" value={form.closingTime} onChange={(v) => update("closingTime", v)} placeholder="12:00 AM" />
          </div>
        </DataCard>

        <DataCard
          title="Social Links"
          description="Shown in the Stay Connected section and the footer. Leave a field empty to hide that button."
          bodyClassName="space-y-4 p-4 sm:p-6"
        >
          {socialFields.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Field
                  id={`social-${key}`}
                  label={label}
                  type="url"
                  value={form.social[key]}
                  onChange={(v) => updateSocial(key, v)}
                  placeholder={placeholder}
                  error={fieldErrors[key]}
                />
              </div>
              {URL_PATTERN.test(form.social[key].trim()) && !fieldErrors[key] && (
                <a
                  href={form.social[key].trim()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${label} link in a new tab`}
                  title="Test link"
                  className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#E58422]"
                >
                  <Link2 size={17} />
                </a>
              )}
            </div>
          ))}
        </DataCard>
      </form>
    </div>
  );
}