import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import DataCard from "../DataCard";
import Pagination from "../Pagination";
import EmptyState from "../EmptyState";
import ModalWrapper, { ToggleSwitch } from "../ModalWrapper";
import { cancelButtonClass } from "../formStyles";
import { usePagination } from "../usePageSize";
import { formatDate } from "../events/eventUtils";
import AnnouncementFormModal from "./AnnouncementFormModal";
import {
  LIVE_SLOTS,
  dateRange,
  linkSummary,
  liveIds,
  scheduleState,
  sortAnnouncements,
  typeLabel,
} from "./announcementUtils";

const iconButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-[#19244E] disabled:cursor-not-allowed disabled:opacity-30";

function StatusChip({ announcement, live }) {
  const state = scheduleState(announcement);
  let chip = { label: "Up next", className: "bg-amber-50 text-amber-700" };

  if (live) chip = { label: "Live on landing page", className: "bg-emerald-50 text-emerald-700" };
  else if (!announcement.is_visible) chip = { label: "Hidden", className: "bg-gray-100 text-gray-500" };
  else if (state === "scheduled") {
    chip = { label: `Starts ${formatDate(announcement.starts_at, { month: "short", day: "numeric" })}`, className: "bg-sky-50 text-sky-700" };
  } else if (state === "ended") chip = { label: "Ended", className: "bg-gray-100 text-gray-500" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold ${chip.className}`}>
      {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}
      {chip.label}
    </span>
  );
}

// Controls the "What's Brewing" cards on the customer landing page.
// Every change is handed to the page, which saves it to Supabase.
export default function AnnouncementsTab({
  announcements,
  events,
  menuItems,
  onSave,
  onToggle,
  onDelete,
  onReorder,
}) {
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [armedId, setArmedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const sorted = sortAnnouncements(announcements);
  const live = liveIds(announcements);
  const pager = usePagination(sorted);

  const moveTo = (fromId, toIndex) => {
    const ordered = [...sorted];
    const fromIndex = ordered.findIndex((entry) => entry.id === fromId);
    if (fromIndex === -1 || toIndex < 0 || toIndex >= ordered.length) return;
    const [moved] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, moved);
    onReorder(ordered.map((entry) => entry.id));
  };

  const clearDrag = () => {
    setArmedId(null);
    setDragId(null);
    setOverId(null);
  };

  // Native drag and drop from the handle; phones use the arrow buttons.
  const dragPropsFor = (announcement, index) => ({
    draggable: armedId === announcement.id,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(announcement.id));
      setDragId(announcement.id);
    },
    onDragOver: (event) => {
      if (dragId === null) return;
      event.preventDefault();
      if (overId !== announcement.id) setOverId(announcement.id);
    },
    onDrop: (event) => {
      event.preventDefault();
      if (dragId !== null && dragId !== announcement.id) moveTo(dragId, index);
      clearDrag();
    },
    onDragEnd: clearDrag,
  });

  const save = async (values) => {
    const ok = await onSave(values, editing.announcement);
    if (ok) setEditing(null);
  };

  const remove = async () => {
    const ok = await onDelete(deleteTarget);
    if (ok) setDeleteTarget(null);
  };

  return (
    <>
      <DataCard
        title="What's Brewing"
        description={`The first ${LIVE_SLOTS} visible cards (inside their dates) show on the customer landing page.`}
        badge={
          <button
            type="button"
            onClick={() => setEditing({ announcement: null })}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#E58422] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#d47414]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New announcement</span>
            <span className="sm:hidden">New</span>
          </button>
        }
        bodyClassName=""
        footer={sorted.length > 0 && <Pagination {...pager} label="Announcement pages" />}
      >
        {sorted.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="Nothing brewing yet."
            message="Share a new drink, an event or a notice, and it shows up on the landing page."
          />
        ) : (
          <ol className="divide-y divide-[#EFEAE4]" onPointerUp={() => setArmedId(null)}>
            {pager.pageItems.map((announcement) => {
              const index = sorted.findIndex((entry) => entry.id === announcement.id);
              const link = linkSummary(announcement, events, menuItems);

              return (
                <li
                  key={announcement.id}
                  {...dragPropsFor(announcement, index)}
                  className={`flex flex-col gap-2 px-4 py-3 transition sm:flex-row sm:items-center sm:gap-3 sm:px-6 ${
                    overId === announcement.id && dragId !== announcement.id ? "bg-[#FFF3E7]" : ""
                  } ${announcement.is_visible ? "" : "opacity-70"}`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <button
                      type="button"
                      onPointerDown={() => setArmedId(announcement.id)}
                      aria-label={`Drag to reorder ${announcement.title}`}
                      title="Drag to reorder"
                      className="hidden h-14 w-6 shrink-0 cursor-grab items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing sm:flex"
                    >
                      <GripVertical size={18} />
                    </button>

                    {announcement.image_url ? (
                      <img src={announcement.image_url} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#E58422]">
                        <Megaphone size={22} />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#E58422]">
                          {typeLabel(announcement)}
                        </span>
                        <StatusChip announcement={announcement} live={live.includes(announcement.id)} />
                      </div>
                      <p className="mt-0.5 truncate text-sm font-bold text-[#19244E]">{announcement.title}</p>
                      <p className="truncate text-xs text-gray-500">{announcement.description}</p>
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">
                        {dateRange(announcement)}
                        {link && ` · ${link}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between sm:justify-end">
                    <div className="flex">
                      <button type="button" onClick={() => moveTo(announcement.id, index - 1)} disabled={index === 0} aria-label="Move up" title="Move up" className={iconButtonClass}>
                        <ArrowUp size={17} />
                      </button>
                      <button type="button" onClick={() => moveTo(announcement.id, index + 1)} disabled={index === sorted.length - 1} aria-label="Move down" title="Move down" className={iconButtonClass}>
                        <ArrowDown size={17} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <ToggleSwitch
                        checked={announcement.is_visible}
                        label={`${announcement.is_visible ? "Hide" : "Show"} ${announcement.title} on the landing page`}
                        onToggle={() => onToggle(announcement)}
                      />
                      <button type="button" onClick={() => setEditing({ announcement })} aria-label={`Edit ${announcement.title}`} title="Edit" className={iconButtonClass}>
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(announcement)}
                        aria-label={`Delete ${announcement.title}`}
                        title="Delete"
                        className={`${iconButtonClass} hover:bg-rose-50 hover:text-rose-600`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </DataCard>

      {editing && (
        <AnnouncementFormModal
          announcement={editing.announcement}
          events={events}
          menuItems={menuItems}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}

      {deleteTarget && (
        <ModalWrapper
          title="Delete this announcement?"
          description={`${deleteTarget.title} will be removed from the landing page list.`}
          onClose={() => setDeleteTarget(null)}
          sheetOnPhone
          dismissible
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <button type="button" onClick={() => setDeleteTarget(null)} className={cancelButtonClass}>Keep</button>
            <button
              type="button"
              onClick={remove}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}