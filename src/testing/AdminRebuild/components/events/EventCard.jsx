import { useEffect, useRef, useState } from "react";
import { Copy, Image as ImageIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EventPill } from "./Badges";
import { formatTime, parseDate } from "./eventUtils";

const menuItemClass =
  "flex min-h-11 w-full items-center gap-3 px-4 text-sm font-bold transition";

// Short event card. On laptops the cover strip shrinks (88px down to 32px)
// so two rows of cards always fit the screen without page scroll.
export default function EventCard({
  event,
  pill,
  taken,
  capacity,
  typeCount,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (pointerEvent) => {
      if (!menuRef.current?.contains(pointerEvent.target)) setMenuOpen(false);
    };
    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const date = parseDate(event.event_date);
  const percent = capacity ? Math.min(100, (taken / capacity) * 100) : 0;

  const pick = (action) => {
    setMenuOpen(false);
    action(event);
  };

  return (
    <article className="flex min-h-0 flex-col rounded-2xl border border-[#EAE5DF] bg-white shadow-sm">
      <div className="relative h-16 shrink-0 overflow-hidden rounded-t-2xl bg-[#FFF3E7] sm:h-[88px] lg:h-auto lg:max-h-[88px] lg:min-h-8 lg:flex-1 lg:shrink">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImageIcon size={22} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#E58422]/60" />
        )}

        <span className="absolute left-2 top-1.5 flex items-baseline gap-1 rounded-lg bg-white/95 px-2 py-0.5 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#E58422]">
            {date.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="font-display text-sm font-bold text-[#19244E]">{date.getDate()}</span>
        </span>

        <EventPill pill={pill} className="absolute right-2 top-1.5 hidden sm:inline-flex" />
      </div>

      <div className="flex flex-col gap-1.5 p-3 lg:flex-1 lg:justify-between">
        <div className="flex items-start gap-1">
          <h3
            title={event.title}
            className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-bold leading-5 text-[#19244E] sm:line-clamp-1"
          >
            {event.title}
          </h3>

          <div ref={menuRef} className="relative -mr-2 -mt-2.5 shrink-0 sm:-mr-1 sm:-mt-1">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={`More actions for ${event.title}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 sm:h-7 sm:w-7 ${menuOpen ? "bg-gray-100" : ""}`}
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-[#EAE5DF] bg-white py-1 shadow-lg"
              >
                <button type="button" role="menuitem" onClick={() => pick(onEdit)} className={`${menuItemClass} text-[#19244E] hover:bg-[#FFF3E7]`}>
                  <Pencil size={15} className="text-[#E58422]" />
                  Edit
                </button>
                <button type="button" role="menuitem" onClick={() => pick(onDuplicate)} className={`${menuItemClass} text-[#19244E] hover:bg-[#FFF3E7]`}>
                  <Copy size={15} className="text-[#E58422]" />
                  Duplicate
                </button>
                <button type="button" role="menuitem" onClick={() => pick(onDelete)} className={`${menuItemClass} text-rose-600 hover:bg-rose-50`}>
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <EventPill pill={pill} flat className="inline-flex self-start sm:hidden" />

        <p className="text-[11px] text-gray-500 sm:truncate">
          <span className="block truncate sm:inline">
            {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            {event.start_time && ` · ${formatTime(event.start_time)}`}
          </span>
          <span className="hidden sm:inline"> · </span>
          <span className="block truncate sm:inline" title={event.venue}>{event.venue}</span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-[11px]">
              <span className="text-gray-500">
                <strong className="text-[#19244E]">{taken} / {capacity}</strong> registered
              </span>
              <span className="text-[10px] text-gray-400">
                {typeCount} participant {typeCount === 1 ? "type" : "types"}
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#E58422]" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onView(event)}
            aria-label={`View more about ${event.title}`}
            className="min-h-11 w-full shrink-0 rounded-xl bg-[#19244E] px-3 text-xs font-bold text-white transition hover:bg-[#27376f] sm:min-h-8 sm:w-auto"
          >
            View More
          </button>
        </div>
      </div>
    </article>
  );
}
