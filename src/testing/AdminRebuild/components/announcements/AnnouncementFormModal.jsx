import { useState } from "react";
import { ImagePlus } from "lucide-react";
import ModalWrapper from "../ModalWrapper";
import {
  cancelButtonClass,
  fieldClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  textareaClass,
} from "../formStyles";
import { todayISO } from "../events/eventUtils";
import AnnouncementPreview from "./AnnouncementPreview";
import { ANNOUNCEMENT_TYPES, DESCRIPTION_LIMIT, linkSummary } from "./announcementUtils";

const emptyAnnouncement = {
  type: "new_event",
  custom_label: "",
  title: "",
  description: "",
  image_url: "",
  button_label: "",
  link_type: "none",
  link_target: "",
  starts_at: todayISO(),
  ends_at: "",
};

const URL_PATTERN = /^(https?:\/\/|\/)\S+$/;

// Create / Edit form with a live landing-page preview (beside the form on desktop, under it on phones).
export default function AnnouncementFormModal({ announcement, events, menuItems, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyAnnouncement,
    ...announcement,
    link_target: announcement ? String(announcement.link_target ?? "") : "",
  }));
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const changeLinkType = (value) => {
    setForm((current) => ({ ...current, link_type: value, link_target: "" }));
    setErrors((current) => ({ ...current, link_target: "", button_label: "" }));
  };

  const pickImage = (file) => {
    if (file?.type.startsWith("image/")) update("image_url", URL.createObjectURL(file));
  };

  const submit = (event) => {
    event.preventDefault();
    const label = form.button_label.trim();
    const hasLink = form.link_type !== "none";
    const target = form.link_target.trim();

    const nextErrors = {
      custom_label: form.type === "custom" && !form.custom_label.trim() ? "Give your custom type a label." : "",
      title: form.title.trim() ? "" : "A title is required.",
      description: form.description.trim() ? "" : "A short description is required.",
      button_label: hasLink && !label ? "Add a button label, or choose No button." : "",
      link_target:
        hasLink && !target
          ? "Pick where the button should go."
          : form.link_type === "url" && !URL_PATTERN.test(target)
            ? "Use a full link (https://…) or a page path (/menu)."
            : "",
      ends_at:
        form.starts_at && form.ends_at && form.ends_at < form.starts_at
          ? "End date must be on or after the start date."
          : "",
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      custom_label: form.type === "custom" ? form.custom_label.trim() : "",
      title: form.title.trim(),
      description: form.description.trim(),
      button_label: hasLink ? label : "",
      link_target: form.link_type === "event" || form.link_type === "menu_item" ? Number(target) : target,
    });
  };

  const fieldError = (field) =>
    errors[field] && (
      <p id={`announcement-${field}-error`} className="mt-1.5 text-xs font-semibold text-rose-600">
        {errors[field]}
      </p>
    );

  const errorProps = (field, options) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `announcement-${field}-error` : undefined,
    className: fieldClass({ error: Boolean(errors[field]), ...options }),
  });

  const remaining = DESCRIPTION_LIMIT - form.description.length;
  const previewLink =
    form.link_type !== "none" && form.link_target
      ? linkSummary(form, events, menuItems)
      : "";

  return (
    <ModalWrapper
      title={announcement ? "Edit announcement" : "New announcement"}
      description="This card appears in the “What's Brewing” section of the landing page."
      onClose={onCancel}
      maxWidth="max-w-5xl"
      sheetOnPhone
      dismissible
      footer={
        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
          <button type="button" onClick={onCancel} className={cancelButtonClass}>
            Cancel
          </button>
          <button type="submit" form="announcement-form" className={primaryButtonClass}>
            {announcement ? "Save Changes" : "Add Announcement"}
          </button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <form id="announcement-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="announcement-type" className={labelClass}>Type</label>
            <select
              id="announcement-type"
              value={form.type}
              onChange={(event) => update("type", event.target.value)}
              className={inputClass}
            >
              {Object.entries(ANNOUNCEMENT_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {form.type === "custom" ? (
            <div>
              <label htmlFor="announcement-custom-label" className={labelClass}>
                Custom label <span className="text-rose-500">*</span>
              </label>
              <input
                id="announcement-custom-label"
                value={form.custom_label}
                onChange={(event) => update("custom_label", event.target.value)}
                placeholder="e.g. Community"
                maxLength={24}
                {...errorProps("custom_label")}
              />
              {fieldError("custom_label")}
            </div>
          ) : (
            <div className="hidden sm:block" />
          )}

          <div className="sm:col-span-2">
            <label htmlFor="announcement-title" className={labelClass}>
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="announcement-title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              maxLength={60}
              {...errorProps("title")}
            />
            {fieldError("title")}
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="announcement-description" className={labelClass}>
                Short description <span className="text-rose-500">*</span>
              </label>
              <span
                aria-live="polite"
                className={`text-xs font-bold ${
                  remaining <= 0 ? "text-rose-600" : remaining <= 20 ? "text-amber-600" : "text-gray-400"
                }`}
              >
                {form.description.length}/{DESCRIPTION_LIMIT}
              </span>
            </div>
            <textarea
              id="announcement-description"
              rows={3}
              maxLength={DESCRIPTION_LIMIT}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              {...errorProps("description", { height: "", padding: "px-4 py-2.5" })}
            />
            {fieldError("description")}
          </div>

          <div className="sm:col-span-2">
            <p className={labelClass}>Image (optional)</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-orange-200 bg-[#FFF3E7]/50 text-center sm:w-56">
                {form.image_url ? (
                  <img src={form.image_url} alt="Image preview" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus size={22} className="text-[#E58422]" />
                    <span className="text-xs font-bold text-[#19244E]">Click to upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => pickImage(event.target.files[0])}
                  aria-label="Upload announcement image"
                  className="sr-only"
                />
              </label>
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => update("image_url", "")}
                  className="min-h-11 self-start rounded-xl border border-gray-200 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="announcement-link-type" className={labelClass}>Button link</label>
            <select
              id="announcement-link-type"
              value={form.link_type}
              onChange={(event) => changeLinkType(event.target.value)}
              className={inputClass}
            >
              <option value="none">No button</option>
              <option value="event">An event</option>
              <option value="menu_item">A menu item</option>
              <option value="url">Custom URL</option>
            </select>
          </div>

          <div>
            <label htmlFor="announcement-button-label" className={labelClass}>Button label</label>
            <input
              id="announcement-button-label"
              value={form.button_label}
              onChange={(event) => update("button_label", event.target.value)}
              placeholder={form.link_type === "none" ? "Pick a link first" : "e.g. Learn more"}
              disabled={form.link_type === "none"}
              maxLength={28}
              {...errorProps("button_label")}
            />
            {fieldError("button_label")}
          </div>

          {form.link_type !== "none" && (
            <div className="sm:col-span-2">
              <label htmlFor="announcement-link-target" className={labelClass}>
                {form.link_type === "event" ? "Event" : form.link_type === "menu_item" ? "Menu item" : "URL"}
              </label>
              {form.link_type === "url" ? (
                <input
                  id="announcement-link-target"
                  type="url"
                  value={form.link_target}
                  onChange={(event) => update("link_target", event.target.value)}
                  placeholder="https://… or /menu"
                  {...errorProps("link_target")}
                />
              ) : (
                <select
                  id="announcement-link-target"
                  value={form.link_target}
                  onChange={(event) => update("link_target", event.target.value)}
                  {...errorProps("link_target")}
                >
                  <option value="">Choose…</option>
                  {(form.link_type === "event" ? events : menuItems).map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.title ?? entry.name}
                    </option>
                  ))}
                </select>
              )}
              {fieldError("link_target")}
            </div>
          )}

          <div>
            <label htmlFor="announcement-start" className={labelClass}>Start date</label>
            <input
              id="announcement-start"
              type="date"
              value={form.starts_at}
              onChange={(event) => update("starts_at", event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="announcement-end" className={labelClass}>End date (optional)</label>
            <input
              id="announcement-end"
              type="date"
              value={form.ends_at}
              min={form.starts_at || undefined}
              onChange={(event) => update("ends_at", event.target.value)}
              {...errorProps("ends_at")}
            />
            {fieldError("ends_at")}
          </div>
        </form>

        <div className="lg:sticky lg:top-0 lg:self-start">
          <p className={labelClass}>Live preview</p>
          <AnnouncementPreview values={form} linkText={previewLink} />
        </div>
      </div>
    </ModalWrapper>
  );
}
