import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Plus, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ModalWrapper from "../components/ModalWrapper";
import EmptyState from "../components/EmptyState";
import BrewingLoader from "../components/BrewingLoader";
import { cancelButtonClass } from "../components/formStyles";
import EventsTab from "../components/events/EventsTab";
import EventViewModal from "../components/events/EventViewModal";
import ParticipantsTab from "../components/events/ParticipantsTab";
import FormsTab from "../components/events/FormsTab";
import EventFormModal from "../components/events/EventFormModal";
import { REGISTRATION_STATUS, eventPhase, eventPill } from "../components/events/eventUtils";
import {
  useAdminEventsData,
  useCreateAdminEvent,
  useUpdateAdminEvent,
  useDeleteAdminEvent,
  useDuplicateAdminEvent,
  useSaveEventForms,
  useUpdateRegistrationStatus,
} from "../../../backend/hooks/useEvents";
import { useUploadSiteImage } from "../../../backend/hooks/useContent";
import {
  toAdminAnswer,
  toAdminEvent,
  toAdminQuestion,
  toAdminRegistration,
  toAdminType,
  toEventPayload,
} from "../../../backend/mappers/adminEventMapper";
import { savedUrl } from "../../../backend/mappers/adminMenuMapper";

const TABS = [
  { id: "events", label: "Events" },
  { id: "participants", label: "Participants" },
  { id: "forms", label: "Registration Forms" },
];

const sameRows = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dataQuery = useAdminEventsData();
  const createEvent = useCreateAdminEvent();
  const updateEvent = useUpdateAdminEvent();
  const deleteEvent = useDeleteAdminEvent();
  const duplicateEvent = useDuplicateAdminEvent();
  const saveForms = useSaveEventForms();
  const updateRegistration = useUpdateRegistrationStatus();
  const uploadImage = useUploadSiteImage();

  const [eventModal, setEventModal] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const server = useMemo(() => {
    if (!dataQuery.data) return null;
    const { events, types, questions, registrations, answers } = dataQuery.data;
    return {
      events: events.map(toAdminEvent),
      types: types.map(toAdminType),
      questions: questions.map(toAdminQuestion),
      registrations: registrations.map(toAdminRegistration),
      answers: answers.map(toAdminAnswer),
    };
  }, [dataQuery.data]);

  // Registration forms are edited as a draft and saved with the Save Form button.
  const [draftTypes, setDraftTypes] = useState([]);
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [formsTouched, setFormsTouched] = useState(false);

  useEffect(() => {
    if (!server || formsTouched) return;
    setDraftTypes(server.types);
    setDraftQuestions(server.questions);
  }, [server, formsTouched]);

  const editTypes = (update) => {
    setFormsTouched(true);
    setDraftTypes(update);
  };
  const editQuestions = (update) => {
    setFormsTouched(true);
    setDraftQuestions(update);
  };

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (dataQuery.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <BrewingLoader label="Loading events..." />
      </div>
    );
  }

  if (dataQuery.isError || !server) {
    return (
      <EmptyState
        title="We couldn't load the events."
        message="Check your connection and try again."
        action={
          <button
            type="button"
            onClick={() => dataQuery.refetch()}
            className="min-h-11 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white hover:bg-[#253570]"
          >
            Try again
          </button>
        }
      />
    );
  }

  const { events, registrations, answers } = server;
  const participantTypes = formsTouched ? draftTypes : server.types;
  const questions = formsTouched ? draftQuestions : server.questions;

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

  // ----- Events -----
  const saveEvent = async (values) => {
    const editing = eventModal.event;
    setSaving(true);
    try {
      const coverUrl = values.coverFile
        ? await uploadImage.mutateAsync({ file: values.coverFile, folder: "events" })
        : savedUrl(values.cover_image_url);
      const payload = toEventPayload(values, coverUrl);

      if (editing) {
        await updateEvent.mutateAsync({ id: editing.id, ...payload });
        setNotice(`${values.title} was updated.`);
      } else {
        await createEvent.mutateAsync(payload);
        setNotice(`${values.title} was created as a draft. Set up its registration form next.`);
      }
      setEventModal(null);
    } catch {
      setNotice(`We couldn't save ${values.title}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const toggleRegistration = async (target) => {
    const status = target.status === "open" ? "closed" : "open";
    try {
      await updateEvent.mutateAsync({ id: target.id, status });
      setNotice(
        status === "open"
          ? `Registration is now open for ${target.title}.`
          : `Registration for ${target.title} is closed.`
      );
    } catch {
      setNotice(`We couldn't change registration for ${target.title}. Please try again.`);
    }
  };

  const duplicate = async (source) => {
    setSaving(true);
    try {
      await duplicateEvent.mutateAsync(source.id);
      setNotice(`${source.title} was duplicated as a draft.`);
    } catch {
      setNotice(`We couldn't duplicate ${source.title}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const target = deleteTarget;
    try {
      await deleteEvent.mutateAsync(target.id);
      if (linkedEvent?.id === target.id) setLinkedEvent("all");
      setDeleteTarget(null);
      setNotice(`${target.title} was deleted.`);
    } catch {
      setNotice(`We couldn't delete ${target.title}. Please try again.`);
    }
  };

  // ----- Participants -----
  const changeRegistrationStatus = async (registrationId, status) => {
    const person = registrations.find((entry) => entry.id === registrationId);
    try {
      await updateRegistration.mutateAsync({ id: registrationId, status });
      setNotice(`${person?.name ?? "Participant"} is now ${REGISTRATION_STATUS[status].label.toLowerCase()}.`);
    } catch {
      setNotice("We couldn't change the status. Please try again.");
    }
  };

  const resendCode = () =>
    setNotice("Resending codes will work once the email function is updated (Step 27).");

  // ----- Registration forms -----
  // Collects only the events whose types or questions changed.
  const changedForms = events
    .map((event) => {
      const localTypes = draftTypes.filter((type) => type.event_id === event.id);
      const serverTypes = server.types.filter((type) => type.event_id === event.id);
      const localTypeIds = localTypes.map((type) => type.id);
      const serverTypeIds = serverTypes.map((type) => type.id);
      const localQuestions = draftQuestions.filter((q) => localTypeIds.includes(q.participant_type_id));
      const serverQuestions = server.questions.filter((q) => serverTypeIds.includes(q.participant_type_id));

      if (sameRows(localTypes, serverTypes) && sameRows(localQuestions, serverQuestions)) return null;
      return {
        eventId: event.id,
        types: localTypes,
        questions: localQuestions,
        existingTypeIds: serverTypeIds,
        existingQuestionIds: serverQuestions.map((q) => q.id),
      };
    })
    .filter(Boolean);

  const formsDirty = formsTouched && changedForms.length > 0;

  const saveFormDrafts = async () => {
    const invalidType = draftTypes.find(
      (type) => type.opens_at && type.closes_at && type.closes_at < type.opens_at
    );
    if (invalidType) {
      setNotice(`${invalidType.name}: the closing date is before the opening date.`);
      return;
    }

    setSaving(true);
    try {
      for (const form of changedForms) await saveForms.mutateAsync(form);
      setFormsTouched(false);
      setNotice("Registration forms saved.");
    } catch {
      setNotice("We couldn't save the forms. A type that already has registrations can't be removed.");
    } finally {
      setSaving(false);
    }
  };

  const discardFormDrafts = () => {
    setFormsTouched(false);
    setNotice("Unsaved form changes were discarded.");
  };

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
      {saving && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-white/60">
          <BrewingLoader label="Saving..." />
        </div>
      )}

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
                tab === entry.id ? "bg-[#FFF3E7] text-[#B96916]" : "text-gray-500 hover:text-[#19244E]"
              }`}
            >
              {entry.label}
              {entry.id === "forms" && formsDirty && <span className="ml-1 text-[#E58422]">•</span>}
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
          onDuplicate={duplicate}
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
        <>
          {formsDirty && (
            <div className="sticky top-0 z-20 flex flex-col gap-3 rounded-2xl border border-orange-200 bg-[#FFF3E7] p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <p className="text-sm font-bold text-[#19244E]">You have unsaved form changes.</p>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button type="button" onClick={discardFormDrafts} className={cancelButtonClass}>
                  Discard
                </button>
                <button
                  type="button"
                  onClick={saveFormDrafts}
                  className="min-h-11 rounded-xl bg-[#E58422] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#d47414]"
                >
                  Save Form
                </button>
              </div>
            </div>
          )}

          <FormsTab
            events={events}
            participantTypes={participantTypes}
            questions={questions}
            registrations={registrations}
            selectedEvent={formsEvent}
            onSelectEvent={setLinkedEvent}
            setParticipantTypes={editTypes}
            setQuestions={editQuestions}
            notify={setNotice}
          />
        </>
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
        <EventFormModal event={eventModal.event} onCancel={() => setEventModal(null)} onSave={saveEvent} />
      )}

      {deleteTarget && (
        <ModalWrapper
          title="Delete this event?"
          description={`${deleteTarget.title} will be permanently removed${
            deleteCount ? ` together with its ${deleteCount} registration${deleteCount === 1 ? "" : "s"} and their answers` : ""
          }.`}
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
              onClick={confirmDelete}
              disabled={deleteEvent.isPending}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-wait"
            >
              {deleteEvent.isPending ? "Deleting..." : "Delete Event"}
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