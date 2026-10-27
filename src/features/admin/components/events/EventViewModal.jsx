import { useEffect } from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Lock,
  MapPin,
  Pencil,
  Unlock,
  Users,
  X,
} from "lucide-react";
import { EventPill } from "./Badges";
import { confirmedCount, eventPhase, formatDate, timeRange } from "./eventUtils";

const footerButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm";

function InfoBox({ icon: Icon, label, children }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#F8F6F3] p-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
        <Icon size={13} />
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold text-[#19244E]">{children}</dd>
    </div>
  );
}

// "View More" pop-up. Full-screen sheet on phones; Esc or a click outside closes it.
export default function EventViewModal({
  event,
  pill,
  types,
  registrations,
  onClose,
  onEdit,
  onToggleRegistration,
  onOpenForm,
  onOpenParticipants,
}) {
  useEffect(() => {
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const finished =
    eventPhase(event) === "past" || event.status === "completed" || event.status === "cancelled";
  const registrationOpen = event.status === "open";

  return (
    <div
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 sm:p-6"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-view-title"
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-full sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="relative h-40 shrink-0 bg-[#FFF3E7] sm:h-48">
          {event.cover_image_url && (
            <img src={event.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:bg-white"
          >
            <X size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <EventPill pill={pill} />
            <h2 id="event-view-title" className="mt-2 text-xl font-bold leading-tight text-white sm:text-2xl">
              {event.title}
            </h2>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-4 sm:p-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-3">
              <InfoBox icon={CalendarDays} label="Date">
                {formatDate(event.event_date, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </InfoBox>
              <InfoBox icon={Clock} label="Time">{timeRange(event)}</InfoBox>
              <InfoBox icon={MapPin} label="Place">{event.venue}</InfoBox>
              <InfoBox icon={Lock} label="Registration closes">
                {formatDate(event.registration_closes_at)}
              </InfoBox>
            </dl>

            <div>
              <h3 className="text-sm font-bold text-[#19244E]">About</h3>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-gray-600">
                {event.description || "No description yet."}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#19244E]">Participant types</h3>
            {types.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">
                None yet. Add them under Registration form.
              </p>
            ) : (
              <ul className="mt-3 space-y-4">
                {types.map((type) => {
                  const taken = confirmedCount(registrations, type.id);
                  const full = type.capacity > 0 && taken >= type.capacity;
                  const percent = type.capacity ? Math.min(100, (taken / type.capacity) * 100) : 0;
                  const waiting = registrations.filter(
                    (entry) =>
                      entry.participant_type_id === type.id &&
                      (entry.status === "waitlisted" || entry.status === "pending")
                  ).length;

                  return (
                    <li key={type.id}>
                      <div className="flex items-baseline justify-between gap-3 text-xs">
                        <span className="font-bold text-gray-700">{type.name}</span>
                        <span className={full ? "font-bold text-rose-600" : "text-gray-500"}>
                          {full && "Full · "}
                          <strong className={full ? "" : "text-[#19244E]"}>
                            {taken} / {type.capacity}
                          </strong>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${full ? "bg-rose-500" : "bg-[#E58422]"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {waiting > 0 && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          {waiting} waitlisted or waiting for email verification
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[#EFEAE4] px-4 py-3 sm:flex sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => onEdit(event)}
            className={`${footerButtonClass} border-[#EAE5DF] bg-white text-[#19244E] hover:bg-[#FFF3E7]`}
          >
            <Pencil size={15} />
            Edit event
          </button>
          <button
            type="button"
            onClick={() => onToggleRegistration(event)}
            disabled={finished}
            className={`${footerButtonClass} border-[#EAE5DF] bg-white text-[#19244E] hover:bg-gray-50`}
          >
            {registrationOpen || finished ? <Lock size={15} /> : <Unlock size={15} />}
            {registrationOpen || finished ? "Close registration" : "Open registration"}
          </button>
          <button
            type="button"
            onClick={() => onOpenForm(event)}
            className={`${footerButtonClass} border-[#EAE5DF] bg-white text-[#19244E] hover:bg-gray-50`}
          >
            <ClipboardList size={15} />
            Registration form
          </button>
          <button
            type="button"
            onClick={() => onOpenParticipants(event)}
            className={`${footerButtonClass} border-[#E58422] bg-[#E58422] text-white hover:bg-[#d47414]`}
          >
            <Users size={15} />
            View participants
          </button>
        </div>
      </section>
    </div>
  );
}
