import { useState } from "react";
import { Download, Search, Users } from "lucide-react";
import EmptyState from "../EmptyState";
import DataCard from "../DataCard";
import Pagination from "../Pagination";
import { usePagination } from "../usePageSize";
import { inputClass, labelClass } from "../formStyles";
import ParticipantModal from "./ParticipantModal";
import { RegistrationStatusBadge, VerifiedBadge } from "./Badges";
import {
  REGISTRATION_STATUS,
  answerText,
  formatDate,
  sortQuestions,
} from "./eventUtils";

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ParticipantsTab({
  events,
  participantTypes,
  registrations,
  questions,
  answers,
  eventFilter,
  onEventFilterChange,
  onStatusChange,
  onResendCode,
}) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);

  const selectedEvent = events.find((event) => event.id === eventFilter);
  const eventTitle = (eventId) => events.find((event) => event.id === eventId)?.title ?? "Deleted event";
  const typeName = (typeId) =>
    participantTypes.find((type) => type.id === typeId)?.name ?? "Unknown type";
  const answerValue = (registrationId, questionId) =>
    answers.find(
      (answer) => answer.registration_id === registrationId && answer.question_id === questionId
    )?.value;

  // Type names repeat across events, so the type filter works by name.
  const typeNames = [
    ...new Set(
      participantTypes
        .filter((type) => eventFilter === "all" || type.event_id === eventFilter)
        .map((type) => type.name)
    ),
  ];

  const term = search.trim().toLowerCase();
  const filtered = registrations
    .filter(
      (entry) =>
        (eventFilter === "all" || entry.event_id === eventFilter) &&
        (typeFilter === "all" || typeName(entry.participant_type_id) === typeFilter) &&
        (statusFilter === "all" || entry.status === statusFilter) &&
        (!term ||
          entry.name.toLowerCase().includes(term) ||
          entry.email.toLowerCase().includes(term))
    )
    .sort((a, b) => b.registered_at.localeCompare(a.registered_at));

  const pager = usePagination(filtered, [eventFilter, typeFilter, statusFilter, search]);
  const openRegistration = registrations.find((entry) => entry.id === openId);

  const changeEvent = (value) => {
    setTypeFilter("all");
    onEventFilterChange(value === "all" ? "all" : Number(value));
  };

  // Downloads every row that matches the filters. With one event picked, each form question gets a column.
  const exportCsv = () => {
    const eventQuestions = selectedEvent
      ? participantTypes
          .filter((type) => type.event_id === selectedEvent.id)
          .flatMap((type) =>
            sortQuestions(questions.filter((question) => question.participant_type_id === type.id))
          )
      : [];

    const header = [
      "Name",
      "Email",
      "Email verified",
      "Event",
      "Participant type",
      "Status",
      "Registered on",
      ...eventQuestions.map(
        (question) => `${typeName(question.participant_type_id)}: ${question.label}`
      ),
    ];
    const rows = filtered.map((entry) => [
      entry.name,
      entry.email,
      entry.email_verified ? "Yes" : "No",
      eventTitle(entry.event_id),
      typeName(entry.participant_type_id),
      REGISTRATION_STATUS[entry.status]?.label ?? entry.status,
      formatDate(entry.registered_at),
      ...eventQuestions.map((question) =>
        question.participant_type_id === entry.participant_type_id
          ? answerText(answerValue(entry.id, question.id))
          : ""
      ),
    ]);

    // The BOM lets Excel read peso signs and accented names correctly.
    const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedEvent ? slugify(selectedEvent.title) : "all-events"}-participants.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DataCard bodyClassName="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)]">
          <div>
            <label htmlFor="participants-event" className={labelClass}>Event</label>
            <select
              id="participants-event"
              value={eventFilter}
              onChange={(event) => changeEvent(event.target.value)}
              className={inputClass}
            >
              <option value="all">All events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} · {formatDate(event.event_date)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="participants-type" className={labelClass}>Participant type</label>
            <select
              id="participants-type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={inputClass}
            >
              <option value="all">All types</option>
              {typeNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="participants-status" className={labelClass}>Status</label>
            <select
              id="participants-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={inputClass}
            >
              <option value="all">All statuses</option>
              {Object.entries(REGISTRATION_STATUS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="participants-search" className={labelClass}>Search</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="participants-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or email..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Participants"
        description={selectedEvent ? selectedEvent.title : "All events"}
        badge={
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#19244E] px-4 text-sm font-bold text-white transition hover:bg-[#27376f] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        }
        bodyClassName=""
        footer={filtered.length > 0 && <Pagination {...pager} label="Participant pages" />}
      >
        {filtered.length === 0 ? (
          registrations.some((entry) => eventFilter === "all" || entry.event_id === eventFilter) ? (
            <EmptyState icon={Users} title="No one matches these filters." message="Try another type, status or search." />
          ) : (
            <EmptyState
              icon={Users}
              title="No sign-ups yet."
              message="Share the event and they'll come pouring in."
            />
          )
        ) : (
          <>
            <ul className="divide-y divide-[#EFEAE4] md:hidden">
              {pager.pageItems.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(entry.id)}
                    className="flex min-h-11 w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-[#19244E]">{entry.name}</span>
                      <RegistrationStatusBadge status={entry.status} />
                    </span>
                    <span className="flex w-full items-center gap-2">
                      <span className="truncate text-xs text-gray-500">{entry.email}</span>
                      <VerifiedBadge verified={entry.email_verified} />
                    </span>
                    <span className="truncate text-xs text-gray-400">
                      {eventTitle(entry.event_id)} · {typeName(entry.participant_type_id)} · {formatDate(entry.registered_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EAE5DF] bg-[#F8F6F3] text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Participant type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Registered on</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEAE4]">
                  {pager.pageItems.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setOpenId(entry.id)}
                      className="cursor-pointer transition hover:bg-[#FFF3E7]/60"
                    >
                      <td className="px-6 py-3">
                        <button type="button" className="text-left text-sm font-bold text-[#19244E] hover:underline">
                          {entry.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{entry.email}</p>
                        <div className="mt-1">
                          <VerifiedBadge verified={entry.email_verified} />
                        </div>
                      </td>
                      <td className="max-w-[220px] px-4 py-3">
                        <p className="truncate text-xs font-semibold text-gray-600" title={eventTitle(entry.event_id)}>
                          {eventTitle(entry.event_id)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600">
                        {typeName(entry.participant_type_id)}
                      </td>
                      <td className="px-4 py-3">
                        <RegistrationStatusBadge status={entry.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-right text-xs text-gray-500">
                        {formatDate(entry.registered_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DataCard>

      {openRegistration && (
        <ParticipantModal
          registration={openRegistration}
          eventTitle={eventTitle(openRegistration.event_id)}
          typeName={typeName(openRegistration.participant_type_id)}
          questions={sortQuestions(
            questions.filter(
              (question) => question.participant_type_id === openRegistration.participant_type_id
            )
          )}
          answers={Object.fromEntries(
            answers
              .filter((answer) => answer.registration_id === openRegistration.id)
              .map((answer) => [answer.question_id, answer.value])
          )}
          onClose={() => setOpenId(null)}
          onStatusChange={onStatusChange}
          onResendCode={onResendCode}
        />
      )}
    </div>
  );
}
