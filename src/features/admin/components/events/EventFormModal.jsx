import { useState } from "react";
import { ImagePlus } from "lucide-react";
import ModalWrapper from "../ModalWrapper";
import {
  fieldClass,
  inputClass,
  textareaClass,
  labelClass,
  cancelButtonClass,
  primaryButtonClass,
} from "../formStyles";

const emptyEvent = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue: "",
  cover_image_url: "",
  registration_opens_at: "",
  registration_closes_at: "",
};

// Used for both Create Event (event = null) and Edit.
export default function EventFormModal({ event, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyEvent, ...event }));
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

   const pickCover = (file) => {
    if (!file?.type.startsWith("image/")) return;
    setForm((current) => ({ ...current, cover_image_url: URL.createObjectURL(file), coverFile: file }));
  };

  const submit = (submitEvent) => {
    submitEvent.preventDefault();
    const nextErrors = {
      title: form.title.trim() ? "" : "Event title is required.",
      event_date: form.event_date ? "" : "Pick the event date.",
      venue: form.venue.trim() ? "" : "Venue is required.",
      end_time:
        form.start_time && form.end_time && form.end_time <= form.start_time
          ? "End time must be after the start time."
          : "",
      registration_closes_at:
        form.registration_opens_at &&
        form.registration_closes_at &&
        form.registration_closes_at < form.registration_opens_at
          ? "Closing date must be on or after the opening date."
          : "",
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      venue: form.venue.trim(),
    });
  };

  const fieldError = (field) =>
    errors[field] && (
      <p id={`event-${field}-error`} className="mt-1.5 text-xs font-semibold text-rose-600">
        {errors[field]}
      </p>
    );

  const errorProps = (field) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `event-${field}-error` : undefined,
    className: fieldClass({ error: Boolean(errors[field]) }),
  });

  const footer = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
      <button type="button" onClick={onCancel} className={cancelButtonClass}>
        Cancel
      </button>
      <button type="submit" form="event-form" className={primaryButtonClass}>
        {event ? "Save Changes" : "Create Event"}
      </button>
    </div>
  );

  return (
    <ModalWrapper
      title={event ? "Edit Event" : "Create Event"}
      description={
        event
          ? "Customers see these details on the events page."
          : "New events start as Draft. Set who can register in the Registration Forms tab."
      }
      footer={footer}
      onClose={onCancel}
      maxWidth="max-w-2xl"
      sheetOnPhone
      dismissible
    >
      <form id="event-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="event-title" className={labelClass}>
            Event Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="event-title"
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            autoFocus
            {...errorProps("title")}
          />
          {fieldError("title")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="event-description" className={labelClass}>Description</label>
          <textarea
            id="event-description"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={textareaClass}
          />
        </div>

        <div>
          <label htmlFor="event-date" className={labelClass}>
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="event-date"
            type="date"
            value={form.event_date}
            onChange={(e) => update("event_date", e.target.value)}
            {...errorProps("event_date")}
          />
          {fieldError("event_date")}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="event-start" className={labelClass}>Starts</label>
            <input
              id="event-start"
              type="time"
              value={form.start_time}
              onChange={(e) => update("start_time", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="event-end" className={labelClass}>Ends</label>
            <input
              id="event-end"
              type="time"
              value={form.end_time}
              onChange={(e) => update("end_time", e.target.value)}
              {...errorProps("end_time")}
            />
          </div>
          <div className="col-span-2 -mt-2">{fieldError("end_time")}</div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="event-venue" className={labelClass}>
            Venue <span className="text-rose-500">*</span>
          </label>
          <input
            id="event-venue"
            type="text"
            value={form.venue}
            onChange={(e) => update("venue", e.target.value)}
            {...errorProps("venue")}
          />
          {fieldError("venue")}
        </div>

        <div>
          <label htmlFor="event-opens" className={labelClass}>Registration opens</label>
          <input
            id="event-opens"
            type="date"
            value={form.registration_opens_at}
            onChange={(e) => update("registration_opens_at", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="event-closes" className={labelClass}>Registration closes</label>
          <input
            id="event-closes"
            type="date"
            value={form.registration_closes_at}
            min={form.registration_opens_at || undefined}
            onChange={(e) => update("registration_closes_at", e.target.value)}
            {...errorProps("registration_closes_at")}
          />
          {fieldError("registration_closes_at")}
        </div>

        <div className="sm:col-span-2">
          <p className={labelClass}>Cover image</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex aspect-[16/7] w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-orange-200 bg-[#FFF3E7]/50 text-center sm:w-64">
              {form.cover_image_url ? (
                <img src={form.cover_image_url} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <ImagePlus size={22} className="text-[#E58422]" />
                  <span className="text-xs font-bold text-[#19244E]">Click to upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => pickCover(e.target.files[0])}
                aria-label="Upload cover image"
                className="sr-only"
              />
            </label>
            {form.cover_image_url && (
              <button
                type="button"
              onClick={() => setForm((current) => ({ ...current, cover_image_url: "", coverFile: null }))}
                className="min-h-11 self-start rounded-xl border border-gray-200 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                Remove image
              </button>
            )}
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}
