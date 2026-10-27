import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import Pagination from "../Pagination";
import { usePagination } from "../usePageSize";
import EmptyState from "../EmptyState";
import EventCard from "./EventCard";
import { eventPhase, eventPill, eventTotals } from "./eventUtils";

const PHASES = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active" },
  { id: "past", label: "Past" },
];

// 3 × 2 cards on desktop, 2 × 2 on phones, so every page of the grid is even.
const GRID_PAGE_SIZES = { desktop: 6, phone: 4 };

const controlClass =
  "h-11 rounded-xl border border-[#EAE5DF] bg-white text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-50 lg:h-10";

// On laptops this tab fills the space it is given (no page scroll); the card grid takes what is left.
export default function EventsTab({
  events,
  participantTypes,
  registrations,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const [phase, setPhase] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const counts = Object.fromEntries(
    PHASES.map(({ id }) => [
      id,
      id === "all" ? events.length : events.filter((event) => eventPhase(event) === id).length,
    ])
  );

  const term = search.trim().toLowerCase();
  const listed = events
    .filter(
      (event) =>
        (phase === "all" || eventPhase(event) === phase) &&
        (!term ||
          event.title.toLowerCase().includes(term) ||
          event.venue.toLowerCase().includes(term))
    )
    .sort((a, b) =>
      sort === "newest" ? b.id - a.id : a.event_date.localeCompare(b.event_date)
    );

  const pager = usePagination(listed, [phase, term, sort], GRID_PAGE_SIZES);

  return (
    <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Show events"
          className="grid grid-cols-4 gap-1 rounded-xl border border-[#EAE5DF] bg-white p-1 lg:inline-grid"
        >
          {PHASES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPhase(option.id)}
              aria-pressed={phase === option.id}
              className={`flex min-h-11 flex-col items-center justify-center gap-x-1.5 rounded-lg px-2 text-xs font-bold transition sm:flex-row lg:min-h-8 lg:px-3 ${
                phase === option.id
                  ? "bg-[#FFF3E7] text-[#B96916]"
                  : "text-gray-500 hover:text-[#19244E]"
              }`}
            >
              {option.label}
              <span
                className={`rounded-md px-1.5 text-[10px] ${
                  phase === option.id ? "bg-white/80" : "bg-gray-100"
                }`}
              >
                {counts[option.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1 lg:w-60 lg:flex-none">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events..."
              aria-label="Search events"
              className={`${controlClass} w-full pl-9 pr-3`}
            />
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort events"
            className={`${controlClass} w-36 shrink-0 px-3 sm:w-48`}
          >
            <option value="date">Sort: Event date</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {listed.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          className="justify-center rounded-2xl border border-dashed border-[#EAE5DF] bg-white lg:flex-1"
          title={events.length === 0 ? "No events yet. Time to plan a throwdown?" : "No events match that."}
          message={
            events.length === 0
              ? "Use Create Event to set up your first one."
              : "Try another filter or search."
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
          {pager.pageItems.map((event) => {
            const { types, taken, capacity } = eventTotals(event, participantTypes, registrations);

            return (
              <EventCard
                key={event.id}
                event={event}
                pill={eventPill(event, participantTypes, registrations)}
                taken={taken}
                capacity={capacity}
                typeCount={types.length}
                onView={onView}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}

      <Pagination {...pager} label="Event pages" className="shrink-0" />
    </div>
  );
}
