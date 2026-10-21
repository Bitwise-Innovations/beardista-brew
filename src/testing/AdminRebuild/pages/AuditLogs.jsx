import { useMemo, useState } from "react";

const SAMPLE_LOGS = [
  {
    id: 1001,
    date: "Oct 16, 2026",
    time: "09:42 AM",
    user: "Jim Carlo Gorospe",
    actionType: "update",
    action: "Updated menu item",
    itemAffected: "Caramel Macchiato",
    itemId: "MENU-001",
    previousValue: "Price: ₱120.00",
    newValue: "Price: ₱130.00",
  },
  {
    id: 1002,
    date: "Oct 16, 2026",
    time: "09:15 AM",
    user: "Ben Cabazeres",
    actionType: "create",
    action: "Created menu item",
    itemAffected: "Spanish Latte",
    itemId: "MENU-018",
    previousValue: "No previous record",
    newValue: "Price: ₱140.00 · Status: Available",
  },
  {
    id: 1003,
    date: "Oct 16, 2026",
    time: "08:52 AM",
    user: "Gab Evora",
    actionType: "security",
    action: "Changed account status",
    itemAffected: "Jahnyne Galindez",
    itemId: "USR-0004",
    previousValue: "Status: Active",
    newValue: "Status: Suspended",
  },
  {
    id: 1004,
    date: "Oct 15, 2026",
    time: "05:30 PM",
    user: "Jim Carlo Gorospe",
    actionType: "update",
    action: "Updated café story",
    itemAffected: "Our Story",
    itemId: "CONTENT-001",
    previousValue: "Published text: Previous version",
    newValue: "Published text: Updated version",
  },
  {
    id: 1005,
    date: "Oct 15, 2026",
    time: "03:18 PM",
    user: "Ben Cabazeres",
    actionType: "delete",
    action: "Archived menu item",
    itemAffected: "Vanilla Cold Brew",
    itemId: "MENU-012",
    previousValue: "Status: Available",
    newValue: "Status: Archived",
  },
  {
    id: 1006,
    date: "Oct 15, 2026",
    time: "11:05 AM",
    user: "Gab Evora",
    actionType: "create",
    action: "Added team profile",
    itemAffected: "Barista Team",
    itemId: "CONTENT-008",
    previousValue: "No previous record",
    newValue: "Profile added to team section",
  },
  {
    id: 1007,
    date: "Oct 14, 2026",
    time: "02:40 PM",
    user: "Jim Carlo Gorospe",
    actionType: "security",
    action: "Updated access role",
    itemAffected: "Ben Cabazeres",
    itemId: "USR-0002",
    previousValue: "Role: Store Admin",
    newValue: "Role: Store Admin",
  },
  {
    id: 1008,
    date: "Oct 14, 2026",
    time: "10:12 AM",
    user: "Ben Cabazeres",
    actionType: "update",
    action: "Updated inventory information",
    itemAffected: "Coffee Beans",
    itemId: "INV-003",
    previousValue: "Stock: 18 bags",
    newValue: "Stock: 15 bags",
  },
];

const FILTERS = [
  { id: "all", label: "All Actions" },
  { id: "update", label: "Updates" },
  { id: "create", label: "Created" },
  { id: "delete", label: "Archived" },
  { id: "security", label: "Security" },
];

function ActionBadge({ type }) {
  const styles = {
    create: "bg-emerald-100 text-emerald-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-rose-100 text-rose-800",
    security: "bg-violet-100 text-violet-800",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
        styles[type] || "bg-slate-100 text-slate-700"
      }`}
    >
      {type}
    </span>
  );
}

export default function AuditLogs() {
  const [logs] = useState(SAMPLE_LOGS);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesFilter =
        filterType === "all" || log.actionType === filterType;

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
        result[filter.id] =
          filter.id === "all"
            ? logs.length
            : logs.filter((log) => log.actionType === filter.id).length;
        return result;
      }, {}),
    [logs]
  );

  return (
    <div className="min-h-full bg-[#F7F8FC] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                Security &amp; Compliance
              </span>
              <span className="text-xs text-slate-400">
                Admin workspace / Audit Logs
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#19244E] sm:text-4xl">
              Security &amp; Audit Logs
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Chronological sample records of administrative changes, catalog
              updates, and account events.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Sample Data Active
            </span>
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total Records</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-700">
                ≡
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#19244E]">
              {logs.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Sample entries in this preview</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Record Types</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg text-violet-700">
                ◈
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#19244E]">
              {new Set(logs.map((log) => log.actionType)).size}
            </p>
            <p className="mt-1 text-xs text-slate-400">Update, create, archive, security</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Matching Records</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-700">
                ⌕
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#19244E]">
              {filteredLogs.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Based on current search and filter</p>
          </div>
        </div>

        {/* Search and filter */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-lg font-extrabold text-[#19244E]">
                Activity History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search the actor, action, affected item, or recorded values.
              </p>
            </div>

            <div className="relative w-full xl:max-w-md">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search action, item, or user..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setFilterType(filter.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition ${
                  filterType === filter.id
                    ? "bg-[#19244E] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    filterType === filter.id
                      ? "bg-white/15 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {counts[filter.id]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Audit table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-extrabold text-[#19244E]">Audit Trail</h2>
              <p className="mt-1 text-xs text-slate-500">
                Previous and new values for each sample event
              </p>
            </div>
            <span className="self-start rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:self-auto">
              {filteredLogs.length} {filteredLogs.length === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Timestamp &amp; User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Item Affected</th>
                  <th className="px-6 py-4">Previous State</th>
                  <th className="px-6 py-4">New State</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-5">
                      <p className="whitespace-nowrap text-xs font-extrabold text-[#19244E]">
                        {log.date}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {log.time}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-600">
                          {log.user}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex max-w-[220px] flex-col items-start gap-2">
                        <ActionBadge type={log.actionType} />
                        <span className="text-xs font-bold leading-5 text-slate-800">
                          {log.action}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-800">
                        {log.itemAffected}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        ID: {log.itemId}
                      </p>
                    </td>

                    <td className="max-w-[240px] bg-rose-50/30 px-6 py-5">
                      <p
                        title={log.previousValue}
                        className="max-w-[220px] truncate font-mono text-[11px] leading-5 text-slate-600"
                      >
                        {log.previousValue}
                      </p>
                    </td>

                    <td className="max-w-[240px] bg-emerald-50/30 px-6 py-5">
                      <p
                        title={log.newValue}
                        className="max-w-[220px] truncate font-mono text-[11px] leading-5 text-emerald-800"
                      >
                        {log.newValue}
                      </p>
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                        ⌕
                      </div>
                      <p className="mt-3 font-bold text-slate-700">
                        No matching audit records
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try a different search term or action filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterType("all");
                        }}
                        className="mt-3 text-sm font-bold text-orange-600 hover:text-orange-700"
                      >
                        Clear search and filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {filteredLogs.length} of {logs.length} sample records</span>
            <span>Sample data only · No real audit events are recorded</span>
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="text-lg">ⓘ</span>
          <p className="leading-6">
            <strong>Preview limitation:</strong> These entries are illustrative
            sample records. This page does not read, create, edit, or delete
            production audit logs.
          </p>
        </div>
      </div>
    </div>
  );
}
