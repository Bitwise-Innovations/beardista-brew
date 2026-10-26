import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Plus, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ModalWrapper from "../components/ModalWrapper";
import { cancelButtonClass } from "../components/formStyles";
import EventsTab from "../components/events/EventsTab";
import EventViewModal from "../components/events/EventViewModal";
import ParticipantsTab from "../components/events/ParticipantsTab";
import FormsTab from "../components/events/FormsTab";
import EventFormModal from "../components/events/EventFormModal";
import {
  REGISTRATION_STATUS,
  eventPhase,
  eventPill,
  nextId,
  nowISO,
} from "../components/events/eventUtils";
import {
  events as sampleEvents,
  participant_types as sampleParticipantTypes,
  form_questions as sampleQuestions,
  registrations as sampleRegistrations,
  registration_answers as sampleAnswers,
} from "../data/eventsMockData";

const TABS = [
  { id: "events", label: "Events" },
  { id: "participants", label: "Participants" },
  { id: "forms", label: "Registration Forms" },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState(sampleEvents);
  const [participantTypes, setParticipantTypes] = useState(sampleParticipantTypes);
  const [questions, setQuestions] = useState(sampleQuestions);
  const [registrations, setRegistrations] = useState(sampleRegistrations);
  const [answers, setAnswers] = useState(sampleAnswers);
  const [eventModal, setEventModal] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");

  // The open tab and event live in the link (?tab=participants&event=1) so notifications can open them.
  const requestedTab = searchParams.get("tab");
  const tab = TABS.some((entry) => entry.id === requestedTab) ? requestedTab : "events";
  const linkedEvent = events.find((event) => String(event.id) === searchParams.get("event"));
  const nextUpcoming = events
    .filter((event) => eventPhase(event) !== "past")
    .sort((a, b) => a.event_date.localeCompare(b.event_date))[0];
  const formsEvent = linkedEvent ?? nextUpcoming ?? events[0];
  const viewEvent = events.find((event) => event.id === viewId);

  const openTab = (nextTab) =>
    setSearchParams(linkedEvent ? { tab: nextTab, event: String(linkedEvent.id) } : { tab: nextTab });

  const goTo = (nextTab, eventId) => setSearchParams({ tab: nextTab, event: String(eventId) });

  const setLinkedEvent = (id) =>
    setSearchParams(id === "all" ? { tab } : { tab, event: String(id) }, { replace: true });

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const saveEvent = (values) => {
    const editing = eventModal.event;

    if (editing) {
      setEvents((all) => all.map((event) => (event.id === editing.id ? { ...event, ...values } : event)));
      setNotice(`${values.title} was updated.`);
    } else {
      setEvents((all) => [...all, { ...values, id: nextId(all), status: "draft" }]);
      setNotice(`${values.title} was created as a draft. Set up its registration form next.`);
    }

    setEventModal(null);
  };

  const toggleRegistration = (target) => {
    const status = target.status === "open" ? "closed" : "open";
    setEvents((all) => all.map((event) => (event.id === target.id ? { ...event, status } : event)));
    setNotice(
      status === "open"
        ? `Registration is now open for ${target.title}.`
        : `Registration for ${target.title} is closed.`
    );
  };

  // Copies the event with its participant types and form questions (no registrations) as a draft.
  const duplicateEvent = (source) => {
    const eventId = nextId(events);
    let typeId = nextId(participantTypes);
    let questionId = nextId(questions);
    const typeIds = new Map();

    const copiedTypes = participantTypes
      .filter((type) => type.event_id === source.id)
      .map((type) => {
        typeIds.set(type.id, typeId);
        return { ...type, id: typeId++, event_id: eventId };
      });
    const copiedQuestions = questions
      .filter((question) => typeIds.has(question.participant_type_id))
      .map((question) => ({
        ...question,
        id: questionId++,
        participant_type_id: typeIds.get(question.participant_type_id),
        options: [...question.options],
      }));

    setEvents((all) => [...all, { ...source, id: eventId, title: `${source.title} (copy)`, status: "draft" }]);
    setParticipantTypes((all) => [...all, ...copiedTypes]);
    setQuestions((all) => [...all, ...copiedQuestions]);
    setNotice(`${source.title} was duplicated as a draft.`);
  };

  // Removes the event and everything linked to it in the sample data.
  const deleteEvent = (target) => {
    const typeIds = participantTypes.filter((type) => type.event_id === target.id).map((type) => type.id);
    const registrationIds = registrations.filter((entry) => entry.event_id === target.id).map((entry) => entry.id);

    setEvents((all) => all.filter((event) => event.id !== target.id));
    setParticipantTypes((all) => all.filter((type) => type.event_id !== target.id));
    setQuestions((all) => all.filter((question) => !typeIds.includes(question.participant_type_id)));
    setRegistrations((all) => all.filter((entry) => entry.event_id !== target.id));
    setAnswers((all) => all.filter((answer) => !registrationIds.includes(answer.registration_id)));
    if (linkedEvent?.id === target.id) setLinkedEvent("all");
    setDeleteTarget(null);
    setNotice(`${target.title} was deleted.`);
  };

  const changeRegistrationStatus = (registrationId, status) => {
    const person = registrations.find((entry) => entry.id === registrationId);
    setRegistrations((all) =>
      all.map((entry) => (entry.id === registrationId ? { ...entry, status } : entry))
    );
    setNotice(`${person?.name ?? "Participant"} is now ${REGISTRATION_STATUS[status].label.toLowerCase()}.`);
  };

  const resendCode = (registrationId) =>
    setRegistrations((all) =>
      all.map((entry) =>
        entry.id === registrationId ? { ...entry, verification_sent_at: nowISO() } : entry
      )
    );

  const deleteCount = deleteTarget
    ? registrations.filter((entry) => entry.event_id === deleteTarget.id).length
    : 0;

  const createButtonClass =
    "items-center justify-center rounded-xl bg-[#E58422] font-bold text-white shadow-sm transition hover:bg-[#d47414]";

  return (
    // On laptops the Events tab fills the screen under the top bar exactly, so the page never scrolls.
    <div
      className={
        tab === "events"
          ? "flex flex-col gap-4 lg:h-[calc(100dvh-7rem)] lg:min-h-[520px] lg:gap-3"
          : "space-y-6"
      }
    >
      <PageHeader
        title="Events & Throwdown Manager"
        description="Create events, build their registration forms, and manage who signed up."
        inlineActionsOnPhone
        actions={
          <button
            type="button"
            onClick={() => setEventModal({ event: null })}
            className={`${createButtonClass} inline-flex h-11 shrink-0 gap-1 px-2.5 text-xs sm:hidden`}
          >
            <Plus size={14} />
            Create
          </button>
        }
      />

      <div className="flex shrink-0 items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Events sections"
          className="grid w-full grid-cols-3 gap-1 rounded-2xl border border-[#EAE5DF] bg-white p-1 shadow-sm sm:inline-grid sm:w-auto"
        >
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => openTab(entry.id)}
              className={`min-h-11 rounded-xl px-2 text-xs font-bold transition sm:px-5 sm:text-sm lg:min-h-9 ${
                tab === entry.id
                  ? "bg-[#FFF3E7] text-[#B96916]"
                  : "text-gray-500 hover:text-[#19244E]"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setEventModal({ event: null })}
          className={`${createButtonClass} hidden min-h-11 gap-2 px-4 text-sm sm:inline-flex lg:min-h-10`}
        >
          <Plus size={17} />
          Create Event
        </button>
      </div>

      {tab === "events" && (
        <EventsTab
          events={events}
          participantTypes={participantTypes}
          registrations={registrations}
          onView={(event) => setViewId(event.id)}
          onEdit={(event) => setEventModal({ event })}
          onDuplicate={duplicateEvent}
          onDelete={setDeleteTarget}
        />
      )}

      {tab === "participants" && (
        <ParticipantsTab
          events={events}
          participantTypes={participantTypes}
          registrations={registrations}
          questions={questions}
          answers={answers}
          eventFilter={linkedEvent ? linkedEvent.id : "all"}
          onEventFilterChange={setLinkedEvent}
          onStatusChange={changeRegistrationStatus}
          onResendCode={resendCode}
        />
      )}

      {tab === "forms" && (
        <FormsTab
          events={events}
          participantTypes={participantTypes}
          questions={questions}
          registrations={registrations}
          selectedEvent={formsEvent}
          onSelectEvent={setLinkedEvent}
          setParticipantTypes={setParticipantTypes}
          setQuestions={setQuestions}
          notify={setNotice}
        />
      )}

      {viewEvent && (
        <EventViewModal
          event={viewEvent}
          pill={eventPill(viewEvent, participantTypes, registrations)}
          types={participantTypes.filter((type) => type.event_id === viewEvent.id)}
          registrations={registrations}
          onClose={() => setViewId(null)}
          onEdit={(event) => {
            setViewId(null);
            setEventModal({ event });
          }}
          onToggleRegistration={toggleRegistration}
          onOpenForm={(event) => {
            setViewId(null);
            goTo("forms", event.id);
          }}
          onOpenParticipants={(event) => {
            setViewId(null);
            goTo("participants", event.id);
          }}
        />
      )}

      {eventModal && (
        <EventFormModal
          event={eventModal.event}
          onCancel={() => setEventModal(null)}
          onSave={saveEvent}
        />
      )}

      {deleteTarget && (
        <ModalWrapper
          title="Delete this event?"
          description={`${deleteTarget.title} will be removed${
            deleteCount ? ` together with its ${deleteCount} registration${deleteCount === 1 ? "" : "s"}` : ""
          }. This only changes the preview.`}
          onClose={() => setDeleteTarget(null)}
          sheetOnPhone
          dismissible
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <button type="button" onClick={() => setDeleteTarget(null)} className={cancelButtonClass}>
              Keep
            </button>
            <button
              type="button"
              onClick={() => deleteEvent(deleteTarget)}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700"
            >
              Delete Event
            </button>
          </div>
        </ModalWrapper>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-4 right-4 z-[80] flex items-center gap-3 rounded-2xl bg-[#19244E] px-5 py-4 text-sm font-semibold text-white shadow-xl sm:left-auto sm:max-w-sm"
        >
          <CheckCircle2 size={19} className="shrink-0 text-[#E58422]" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
