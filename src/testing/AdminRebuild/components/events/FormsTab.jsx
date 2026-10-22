import { useState } from "react";
import { Eye, Plus, Trash2 } from "lucide-react";
import DataCard from "../DataCard";
import ModalWrapper from "../ModalWrapper";
import { cancelButtonClass, inputClass, labelClass } from "../formStyles";
import FormBuilder from "./FormBuilder";
import FormPreview from "./FormPreview";
import { PRESET_TYPES, chipClass, formatDate, nextId } from "./eventUtils";

const smallInputClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#E58422] focus:ring-2 focus:ring-orange-100";

// Step 1: who can register (capacity and dates per type). Step 2: a form per type.
// Changes save as you type in this preview.
export default function FormsTab({
  events,
  participantTypes,
  questions,
  registrations,
  selectedEvent,
  onSelectEvent,
  setParticipantTypes,
  setQuestions,
  notify,
}) {
  const [activeTypeId, setActiveTypeId] = useState(null);
  const [customName, setCustomName] = useState("");
  const [customError, setCustomError] = useState("");
  const [removeTarget, setRemoveTarget] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!selectedEvent) {
    return (
      <DataCard>
        <p className="py-10 text-center text-sm text-gray-500">Create an event first.</p>
      </DataCard>
    );
  }

  const eventTypes = participantTypes.filter((type) => type.event_id === selectedEvent.id);
  const activeType = eventTypes.find((type) => type.id === activeTypeId) ?? eventTypes[0];
  const customTypes = eventTypes.filter((type) => !PRESET_TYPES.includes(type.name));
  const rows = [
    ...PRESET_TYPES.map((name) => ({ name, type: eventTypes.find((type) => type.name === name) })),
    ...customTypes.map((type) => ({ name: type.name, type })),
  ];

  const registeredCount = (typeId) =>
    registrations.filter((entry) => entry.participant_type_id === typeId).length;
  const questionCount = (typeId) =>
    questions.filter((question) => question.participant_type_id === typeId).length;

  const addType = (name) => {
    const id = nextId(participantTypes);
    setParticipantTypes((all) => [
      ...all,
      {
        id,
        event_id: selectedEvent.id,
        name,
        capacity: 20,
        opens_at: selectedEvent.registration_opens_at,
        closes_at: selectedEvent.registration_closes_at,
      },
    ]);
    setActiveTypeId(id);
  };

  const removeType = (type) => {
    setParticipantTypes((all) => all.filter((entry) => entry.id !== type.id));
    setQuestions((all) => all.filter((question) => question.participant_type_id !== type.id));
    setRemoveTarget(null);
    notify(`${type.name} can no longer register for this event.`);
  };

  // People who already registered keep their type, so it cannot be removed.
  const requestRemove = (type) => {
    const registered = registeredCount(type.id);
    if (registered > 0) {
      notify(`${type.name} has ${registered} registration${registered === 1 ? "" : "s"}, so it stays. Set its closing date to stop new sign-ups.`);
    } else if (questionCount(type.id) > 0) {
      setRemoveTarget(type);
    } else {
      removeType(type);
    }
  };

  const updateType = (id, field, value) =>
    setParticipantTypes((all) =>
      all.map((type) => (type.id === id ? { ...type, [field]: value } : type))
    );

  const addCustomType = (event) => {
    event.preventDefault();
    const name = customName.trim();
    if (!name) {
      setCustomError("Enter a name for the new type.");
      return;
    }
    if (eventTypes.some((type) => type.name.toLowerCase() === name.toLowerCase())) {
      setCustomError(`${name} is already on the list.`);
      return;
    }
    addType(name);
    setCustomName("");
    setCustomError("");
  };

  return (
    <div className="space-y-6">
      <DataCard bodyClassName="p-4 sm:p-6">
        <label htmlFor="forms-event" className={labelClass}>Event</label>
        <select
          id="forms-event"
          value={selectedEvent.id}
          onChange={(event) => {
            setActiveTypeId(null);
            onSelectEvent(Number(event.target.value));
          }}
          className={`${inputClass} md:max-w-xl`}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} · {formatDate(event.event_date)}
            </option>
          ))}
        </select>
      </DataCard>

      <DataCard
        title="Step 1 · Who can register?"
        description="Tick each participant type. Each one gets its own capacity, dates and form."
        bodyClassName="space-y-3 p-4 sm:p-6"
      >
        <ul className="space-y-3">
          {rows.map(({ name, type }) => {
            const checked = Boolean(type);
            const datesInvalid = type && type.opens_at && type.closes_at && type.closes_at < type.opens_at;

            return (
              <li
                key={name}
                className={`rounded-2xl border p-3 transition sm:p-4 ${
                  checked ? "border-[#E58422] bg-[#FFF3E7]/50" : "border-[#EAE5DF]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => (checked ? requestRemove(type) : addType(name))}
                      className="h-5 w-5 accent-[#E58422]"
                    />
                    <span className="text-sm font-bold text-[#19244E]">{name}</span>
                  </label>
                  {checked && (
                    <span className="shrink-0 text-xs font-semibold text-gray-500">
                      {registeredCount(type.id)} registered
                    </span>
                  )}
                  {checked && !PRESET_TYPES.includes(name) && (
                    <button
                      type="button"
                      onClick={() => requestRemove(type)}
                      aria-label={`Remove ${name}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {checked && (
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:pl-8">
                    <label className="col-span-2 text-xs font-semibold text-gray-500 sm:col-span-1">
                      Capacity
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={type.capacity}
                        onChange={(event) =>
                          updateType(type.id, "capacity", Math.max(0, Number(event.target.value) || 0))
                        }
                        className={`mt-1 ${smallInputClass}`}
                      />
                    </label>
                    <label className="text-xs font-semibold text-gray-500">
                      Opens
                      <input
                        type="date"
                        value={type.opens_at}
                        onChange={(event) => updateType(type.id, "opens_at", event.target.value)}
                        className={`mt-1 ${smallInputClass}`}
                      />
                    </label>
                    <label className="text-xs font-semibold text-gray-500">
                      Closes
                      <input
                        type="date"
                        value={type.closes_at}
                        min={type.opens_at || undefined}
                        onChange={(event) => updateType(type.id, "closes_at", event.target.value)}
                        className={`mt-1 ${smallInputClass} ${datesInvalid ? "border-rose-400" : ""}`}
                      />
                    </label>
                    {datesInvalid && (
                      <p className="col-span-2 text-xs font-semibold text-rose-600 sm:col-span-3">
                        The closing date is before the opening date.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <form onSubmit={addCustomType} className="flex flex-col gap-2 border-t border-[#EFEAE4] pt-4 sm:flex-row">
          <input
            value={customName}
            onChange={(event) => {
              setCustomName(event.target.value);
              setCustomError("");
            }}
            placeholder="Custom type, e.g. Judge or Media"
            aria-label="Custom participant type name"
            className={`${inputClass} sm:max-w-sm`}
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#EAE5DF] bg-white px-4 text-sm font-bold text-[#19244E] hover:border-[#E58422] hover:bg-[#FFF3E7]"
          >
            <Plus size={16} className="text-[#E58422]" />
            Add custom type
          </button>
        </form>
        {customError && <p className="text-xs font-semibold text-rose-600">{customError}</p>}
      </DataCard>

      <DataCard
        title="Step 2 · Build the form"
        description="Every type has its own form. Changes save as you go."
        badge={
          activeType && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#19244E] px-4 text-sm font-bold text-white transition hover:bg-[#27376f]"
            >
              <Eye size={16} />
              Preview
            </button>
          )
        }
        clip={false}
        bodyClassName="space-y-4 p-4 sm:p-6"
      >
        {eventTypes.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Choose at least one participant type in Step 1.
          </p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Form for">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  role="tab"
                  aria-selected={activeType.id === type.id}
                  onClick={() => setActiveTypeId(type.id)}
                  className={chipClass(activeType.id === type.id)}
                >
                  {type.name}
                  <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {questionCount(type.id) + 2}
                  </span>
                </button>
              ))}
            </div>

            <FormBuilder
              key={activeType.id}
              typeId={activeType.id}
              questions={questions}
              setQuestions={setQuestions}
              notify={notify}
            />
          </>
        )}
      </DataCard>

      {removeTarget && (
        <ModalWrapper
          title={`Remove ${removeTarget.name}?`}
          description={`Its form and ${questionCount(removeTarget.id)} question(s) will be deleted.`}
          onClose={() => setRemoveTarget(null)}
          sheetOnPhone
          dismissible
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <button type="button" onClick={() => setRemoveTarget(null)} className={cancelButtonClass}>
              Keep
            </button>
            <button
              type="button"
              onClick={() => removeType(removeTarget)}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700"
            >
              Remove
            </button>
          </div>
        </ModalWrapper>
      )}

      {previewOpen && activeType && (
        <FormPreview
          event={selectedEvent}
          type={activeType}
          questions={questions}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
