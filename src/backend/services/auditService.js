import { useMemo, useState } from "react";
import { ChevronDown, Layers, List, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import EmptyState from "../components/EmptyState";
import BrewingLoader from "../components/BrewingLoader";
import { useAuditLogs } from "../../../backend/hooks/useAuditLogs";
import { AUDIT_LOG_LIMIT } from "../../../backend/services/auditService";
import { toAdminLog } from "../../../backend/mappers/adminAuditMapper";

const FILTERS = [
  { id: "all", label: "All Actions" },
  { id: "update", label: "Updates" },
  { id: "create", label: "Created" },
  { id: "delete", label: "Deleted" },
  { id: "security", label: "Security" },
];

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 days" },
  { id: "month", label: "This month" },
  { id: "all", label: "All" },
];

const startOfToday = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day;
};

const daysBefore = (date, days) => {
  const day = new Date(date);
  day.setDate(day.getDate() - days);
  return day;
};

// <input type="date"> gives "yyyy-mm-dd"; read it as a local date, not UTC.
const parseInputDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Returns [start, endExclusive] for the server query. The end is the day after the last day shown.
function rangeBounds(range, from, to) {
  const today = startOfToday();
  const tomorrow = daysBefore(today, -1);
  if (range === "today") return [today, tomorrow];
  if (range === "week") return [daysBefore(today, 6), tomorrow];
  if (range === "month") return [new Date(today.getFullYear(), today.getMonth(), 1), tomorrow];
  if (range === "custom") {
    const end = parseInputDate(to);
    return [parseInputDate(from), end ? daysBefore(end, -1) : null];
  }
  return [null, null];
}

// Splits one page of records into day sections, newest first.
function groupByDay(logs) {
  const groups = [];
  logs.forEach((log) => {
    const last = groups[groups.length - 1];
    if (last && last.date === log.date) last.logs.push(log);
    else groups.push({ date: log.date, logs: [log] });
  });
  return groups;
}

function ActionBadge({ type }) {
  const styles = {
    create: "bg-emerald-100 text-emerald-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-rose-100 text-rose-800",
    security: "bg-violet-100 text-violet-800",
  };

  return (
    <span className={`inline-flex shrink-0 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wide ${styles[type] || "bg-slate-100 text-slate-700"}`}>
      {type}
    </span>
  );
}

const chipClass = (active) =>
  `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${
    active ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]" : "border-[#EAE5DF] bg-white text-slate-600 hover:bg-slate-50"
  }`;

const dateInputClass =
  "h-11 w-full rounded-xl border border-[#EAE5DF] bg-white px-3 text-sm text-slate-700 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50";

// Phones and tablets: two lines (action + item, user + time); tap to see the before/after values.
function LogCard({ log }) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left transition ${open ? "bg-[#FFF3E7]/60" : "hover:bg-slate-50"}`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">
            <span className="font-bold text-slate-800">{log.action}</span>
            <span className="text-slate-500"> · {log.itemAffected}</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            <span className="font-semibold text-slate-600">{log.user}</span> · {log.time}
          </p>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-2 bg-[#FFF3E7]/60 px-4 pb-3">
          <div className="flex items-center gap-2">
            <ActionBadge type={log.actionType} />
            <span className="text-[11px] font-medium text-slate-400">ID: {log.itemId}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] leading-5">
            <div className="break-words rounded-lg bg-white px-2 py-1 text-slate-600">
              <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-slate-400">Previous</p>
              {log.previousValue}
            </div>
            <div className="break-words rounded-lg bg-white px-2 py-1 text-emerald-800">
              <p className="font-sans text-[10px] font-bold uppercase tracking-wide text-slate-400">New</p>
              {log.newValue}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

export default function AuditLogs() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState("week");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [start, end] = useMemo(() => rangeBounds(range, from, to), [range, from, to]);
  const logsQuery = useAuditLogs({ from: start, to: end });
  const logs = useMemo(() => (logsQuery.data ?? []).map(toAdminLog), [logsQuery.data]);
  const hitLimit = logs.length >= AUDIT_LOG_LIMIT;

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesFilter = filterType === "all" || log.actionType === filterType;
      const searchableText = [
        log.action,
        log.actionType,
        log.itemAffected,
        log.itemId,
        log.user,
        log.date,
        log.time,
        log.previousValue,
        log.newValue,
      ]
        .join(" ")
        .toLowerCase();
      return matchesFilter && (!query || searchableText.includes(query));
    });
  }, [logs, filterType, searchQuery]);

  const counts = useMemo(
    () =>
      FILTERS.reduce((result, filter) => {
        result[filter.id] = filter.id === "all" ? logs.length : logs.filter((log) => log.actionType === filter.id).length;
        return result;
      }, {}),
    [logs]
  );

  const pager = usePagination(filteredLogs, [filterType, searchQuery, range, from, to]);
  const dayGroups = groupByDay(pager.pageItems);

  const pickRange = (value) => {
    setRange(value);
    setFrom("");
    setTo("");
  };

  const changeFrom = (value) => {
    setFrom(value);
    setRange(value || to ? "custom" : "all");
  };

  const changeTo = (value) => {
    setTo(value);
    setRange(value || from ? "custom" : "all");
  };

  const clearAll = () => {
    setSearchQuery("");
    setFilterType("all");
    pickRange("all");
  };

  return (
    <div className="space-y-6 text-slate-800">
      <PageHeader
        title="Security & Audit Logs"
        description="Every change staff make in the admin, recorded automatically."
        actions={
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700">Recording Active</span>
          </div>
        }
      />

      <StatGrid columns={3}>
        <StatCard
          label="Records Loaded"
          value={logs.length}
          sub={hitLimit ? `Latest ${AUDIT_LOG_LIMIT} in this range` : "In the selected date range"}
          icon={List}
        />
        <StatCard
          label="Record Types"
          value={new Set(logs.map((log) => log.actionType)).size}
          sub="Create, update, delete, security"
          icon={Layers}
        />
        <StatCard label="Matching Records" value={filteredLogs.length} sub="With the current filters" icon={Search} />
      </StatGrid>

      <DataCard title="Activity History" description="Search the user, action, affected item, or recorded values." bodyClassName="space-y-4 p-4 sm:p-6">
        <div className="relative w-full lg:max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search action, item, or user..."
            aria-label="Search audit records"
            className="h-11 w-full rounded-xl border border-[#EAE5DF] bg-[#F8F6F3] pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Action type">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setFilterType(filter.id)}
              aria-pressed={filterType === filter.id}
              className={chipClass(filterType === filter.id)}
            >
              {filter.label}
              <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] text-slate-500">{counts[filter.id]}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#EFEAE4] pt-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Date range">
            {DATE_RANGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => pickRange(option.id)}
                aria-pressed={range === option.id}
                className={chipClass(range === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 lg:w-80">
            <label className="text-xs font-semibold text-slate-500">
              From
              <input type="date" value={from} max={to || undefined} onChange={(event) => changeFrom(event.target.value)} className={`mt-1 ${dateInputClass}`} />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              To
              <input type="date" value={to} min={from || undefined} onChange={(event) => changeTo(event.target.value)} className={`mt-1 ${dateInputClass}`} />
            </label>
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Audit Trail"
        description="Previous and new values for each change"
        badge={
          <span className="rounded-lg bg-[#FFF3E7] px-3 py-1.5 text-xs font-bold text-[#B96916]">
            {filteredLogs.length} {filteredLogs.length === 1 ? "record" : "records"}
          </span>
        }
        bodyClassName=""
        footer={filteredLogs.length > 0 && <Pagination {...pager} label="Audit record pages" />}
      >
        {logsQuery.isPending ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <BrewingLoader label="Loading records..." />
          </div>
        ) : logsQuery.isError ? (
          <EmptyState
            icon={Search}
            title="We couldn't load the audit logs."
            message="Check your connection and try again."
            action={
              <button
                type="button"
                onClick={() => logsQuery.refetch()}
                className="min-h-11 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white hover:bg-[#253570]"
              >
                Try again
              </button>
            }
          />
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="All quiet on the log front."
            message={logs.length === 0 ? "No changes were recorded in this date range." : "Nothing matches this search or action type."}
            action={
              <button type="button" onClick={clearAll} className="min-h-11 px-3 text-sm font-bold text-orange-600 hover:text-orange-700">
                Clear search and filters
              </button>
            }
          />
        ) : (
          <>
            <div className="lg:hidden">
              {dayGroups.map((group) => (
                <section key={group.date}>
                  <h3 className="border-b border-[#EFEAE4] bg-[#F8F6F3] px-4 py-2 text-xs font-bold text-[#19244E]">{group.date}</h3>
                  <ul className="divide-y divide-[#EFEAE4]">
                    {group.logs.map((log) => (
                      <LogCard key={log.id} log={log} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EAE5DF] bg-[#F8F6F3] text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Time &amp; User</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Item Affected</th>
                    <th className="px-6 py-3">Previous State</th>
                    <th className="px-6 py-3">New State</th>
                  </tr>
                </thead>

                {dayGroups.map((group) => (
                  <tbody key={group.date} className="divide-y divide-[#EFEAE4] border-b border-[#EFEAE4]">
                    <tr>
                      <th colSpan={5} scope="colgroup" className="font-display bg-white px-6 pb-2 pt-4 text-sm font-bold text-[#19244E]">
                        {group.date}
                      </th>
                    </tr>
                    {group.logs.map((log) => (
                      <tr key={log.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-6 py-3">
                          <p className="whitespace-nowrap text-xs font-bold text-[#19244E]">{log.time}</p>
                          <p className="mt-1 whitespace-nowrap text-xs font-semibold text-slate-500">{log.user}</p>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex max-w-[220px] flex-col items-start gap-1.5">
                            <ActionBadge type={log.actionType} />
                            <span className="text-xs font-bold leading-5 text-slate-800">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-xs font-bold text-slate-800">{log.itemAffected}</p>
                          <p className="mt-1 text-[10px] font-medium text-slate-400">ID: {log.itemId}</p>
                        </td>
                        <td className="max-w-[240px] bg-rose-50/30 px-6 py-3">
                          <p title={log.previousValue} className="max-w-[220px] truncate font-mono text-[11px] leading-5 text-slate-600">
                            {log.previousValue}
                          </p>
                        </td>
                        <td className="max-w-[240px] bg-emerald-50/30 px-6 py-3">
                          <p title={log.newValue} className="max-w-[220px] truncate font-mono text-[11px] leading-5 text-emerald-800">
                            {log.newValue}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </>
        )}
      </DataCard>
    </div>
  );
}