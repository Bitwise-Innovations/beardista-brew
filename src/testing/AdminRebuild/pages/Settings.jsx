import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  MapPin,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Download,
  QrCode,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataCard from "../components/DataCard";

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
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500";

// The PNG is drawn at 640px and shown at 160px, so the download stays sharp when printed.
const QR_DOWNLOAD_SIZE = 640;

// Characters with a special meaning in the Wi-Fi QR format need a backslash in front.
const escapeWifi = (value) => value.replace(/([\\;,:"])/g, "\\$1");

const wifiQrText = (ssid, password) =>
  `WIFI:T:WPA;S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;

function Field({ id, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export default function Settings() {
  const [form, setForm] = useState(defaults);
  const [saved, setSaved] = useState(defaults);
  const [notice, setNotice] = useState("");
  const [showWifi, setShowWifi] = useState(false);
  const qrRef = useRef(null);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setSaved({ ...form });
    setNotice("Settings saved in this preview session only.");
  };

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    const name = form.wifiSSID.trim().replace(/[^\w-]+/g, "_") || "wifi";
    link.download = `${name}-wifi-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(saved);
  const hasNetwork = form.wifiSSID.trim() !== "";
  const qrText = wifiQrText(form.wifiSSID, form.wifiPass);
  // Shown under the fields; the password stays hidden unless the eye toggle is on.
  const qrPreviewText = wifiQrText(
    form.wifiSSID,
    showWifi ? form.wifiPass : "•".repeat(Math.min(form.wifiPass.length, 12))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Store Settings"
        description="Configure store information and guest Wi-Fi details."
        actions={
          <div className="flex flex-col gap-1 sm:items-end">
            <button
              type="submit"
              form="settings-form"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E58422] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d47414]"
            >
              <Save size={17} /> Save All Settings
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
          <p><strong>Preview saved.</strong> {notice}</p>
        </div>
      )}

      <form id="settings-form" onSubmit={saveSettings} className="space-y-6">
        <DataCard
          title="Café Brand & Physical Location"
          description="Store identity and operating hours shown to customers."
          bodyClassName="space-y-4 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="store-name" label="Store Name" value={form.storeName} onChange={(v) => update("storeName", v)} />
            <Field id="store-tagline" label="Tagline / Concept" value={form.tagline} onChange={(v) => update("tagline", v)} />
          </div>
          <div>
            <label htmlFor="store-address" className={labelClass}><span className="inline-flex items-center gap-2"><MapPin size={14} /> Branch Street Address</span></label>
            <input id="store-address" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field id="store-opening" label="Opening Time" value={form.openingTime} onChange={(v) => update("openingTime", v)} placeholder="4:00 PM" />
            <Field id="store-closing" label="Closing Time" value={form.closingTime} onChange={(v) => update("closingTime", v)} placeholder="12:00 AM" />
          </div>
        </DataCard>

        <DataCard
          title="Guest Wi-Fi"
          description="Customers scan the QR code to join the guest network."
        >
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="space-y-4">
              <Field id="wifi-ssid" label="Network Name (SSID)" value={form.wifiSSID} onChange={(v) => update("wifiSSID", v)} />
              <div>
                <label htmlFor="wifi-password" className={labelClass}>Wi-Fi Password</label>
                <div className="relative">
                  <input
                    id="wifi-password"
                    type={showWifi ? "text" : "password"}
                    value={form.wifiPass}
                    onChange={(e) => update("wifiPass", e.target.value)}
                    className={`${inputClass} pr-12 font-mono`}
                  />
                  <button
                    type="button"
                    aria-label={showWifi ? "Hide Wi-Fi password" : "Show Wi-Fi password"}
                    aria-pressed={showWifi}
                    onClick={() => setShowWifi(!showWifi)}
                    className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200"
                  >
                    {showWifi ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="min-w-0 rounded-xl bg-gray-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">QR code text</p>
                <p className="mt-0.5 break-all font-mono text-xs text-[#19244E]">{qrPreviewText}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 md:w-44">
              <p className="self-start text-xs font-bold uppercase tracking-wider text-gray-500 md:self-center">
                Live Preview
              </p>

              {hasNetwork ? (
                <div
                  ref={qrRef}
                  className="rounded-2xl border border-[#EAE5DF] bg-white p-2"
                >
                  <QRCodeCanvas
                    value={qrText}
                    size={QR_DOWNLOAD_SIZE}
                    marginSize={2}
                    level="M"
                    fgColor="#19244E"
                    bgColor="#FFFFFF"
                    title={`Wi-Fi QR code for ${form.wifiSSID}`}
                    style={{ width: 144, height: 144 }}
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-[#FFF3E7]/50 p-3 text-center">
                  <QrCode size={32} className="text-[#E58422]" />
                  <p className="text-xs font-bold text-[#19244E]">QR appears here</p>
                  <p className="text-[10px] text-gray-500">Enter a network name first.</p>
                </div>
              )}

              <button
                type="button"
                onClick={downloadQr}
                disabled={!hasNetwork}
                className="inline-flex min-h-11 w-40 items-center justify-center gap-2 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white transition hover:bg-[#29386f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={15} /> Download PNG
              </button>
            </div>
          </div>
        </DataCard>
      </form>
    </div>
  );
}
