import { useMemo, useState } from "react";
import { CircleCheck, Crown, MailCheck, UserX, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import EmptyState from "../components/EmptyState";

const INITIAL_USERS = [
  { id: 1, name: "Jim Carlo Gorospe", email: "founder@beardistabrew.com", role: "Owner", status: "Active", lastLogin: "Oct 16, 2026 · 09:42 AM" },
  { id: 2, name: "Ben Cabazeres", email: "admin@beardistabrew.com", role: "Admin", status: "Active", lastLogin: "Oct 16, 2026 · 08:15 AM" },
  { id: 3, name: "Gab Evora", email: "barista.lead@beardistabrew.com", role: "Admin", status: "Active", lastLogin: "Oct 15, 2026 · 05:30 PM" },
  { id: 4, name: "Jahnyne Galindez", email: "dave.tan@beardistabrew.com", role: "Admin", status: "Suspended", lastLogin: "Sep 28, 2026 · 02:10 PM" },
];

// New accounts are always Staff and stay Pending until the confirmation code is used.
const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "Staff",
  status: "Pending",
  password: "",
};

const ROLE_OPTIONS = [
  { value: "Owner", label: "Owner Admin" },
  { value: "Admin", label: "Store Admin" },
  { value: "Staff", label: "Staff / Employee" },
];

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50";

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function StatusBadge({ status }) {
  const styles = {
    Active: ["bg-emerald-50 text-emerald-700", "bg-emerald-500"],
    Pending: ["bg-amber-50 text-amber-700", "bg-amber-500"],
    Suspended: ["bg-rose-50 text-rose-700", "bg-rose-500"],
  };
  const [badge, dot] = styles[status] ?? styles.Suspended;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  const styles = {
    Owner: "bg-violet-50 text-violet-700",
    Admin: "bg-blue-50 text-blue-700",
    Staff: "bg-orange-50 text-orange-700",
  };

  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${styles[role] ?? styles.Staff}`}>
      {role}
    </span>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codeSentTo, setCodeSentTo] = useState(null);
  const [toast, setToast] = useState("");
  const [revokeUser, setRevokeUser] = useState(null);

  const editing = editingId !== null;
  const activeCount = users.filter((user) => user.status === "Active").length;
  const suspendedCount = users.filter((user) => user.status === "Suspended").length;
  const roleCount = (role) => users.filter((user) => user.role === role).length;

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term);

      const matchesFilter =
        filter === "All" ||
        (filter === "Suspended"
          ? user.status === "Suspended"
          : user.role === filter);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const pager = usePagination(filteredUsers, [search, filter]);
  const pageUsers = pager.pageItems;

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function changeSearch(value) {
    setSearch(value);
  }

  function changeFilter(value) {
    setFilter(value);
  }

  function openAddDrawer() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowPassword(false);
    setCodeSentTo(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(user) {
    const parts = user.name.split(" ");
    setEditingId(user.id);
    setForm({
      firstName: parts.shift() || "",
      lastName: parts.join(" "),
      email: user.email,
      role: user.role,
      status: user.status,
      password: "",
    });
    setFormError("");
    setShowPassword(false);
    setCodeSentTo(null);
    setDrawerOpen(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function generateDemoPassword() {
    const demoPassword = "Demo-" + Math.random().toString(36).slice(2, 8) + "!26";
    updateField("password", demoPassword);
    setShowPassword(true);
    notify("Demo password generated locally.");
  }

  async function copyDemoPassword() {
    if (!form.password) {
      setFormError("Generate a demo password first.");
      return;
    }

    // This preview intentionally does not access the system clipboard.
    notify("Demo password selected. Copying is disabled in this preview.");
  }

  function saveUser(event) {
    event.preventDefault();
    setFormError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName || !lastName || !email) {
      setFormError("Please complete the first name, last name, and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== editingId
    );

    if (duplicateEmail) {
      setFormError("This email already exists in the demo directory.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    if (editing) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, name: fullName, email, role: form.role, status: form.status }
            : user
        )
      );
      notify("Demo user updated locally.");
      setDrawerOpen(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: fullName,
      email,
      role: "Staff",
      status: "Pending",
      lastLogin: "Never",
    };
    setUsers((current) => [newUser, ...current]);
    // UI only: no email is sent. The drawer switches to the confirmation step.
    setCodeSentTo(email);
  }

  function confirmRevoke() {
    if (!revokeUser) return;

    setUsers((current) => current.filter((user) => user.id !== revokeUser.id));
    setRevokeUser(null);
    notify("Demo user removed from this preview.");
  }

  const filters = [
    { label: "All Users", value: "All", count: users.length },
    { label: "Owner", value: "Owner", count: roleCount("Owner") },
    { label: "Admin", value: "Admin", count: roleCount("Admin") },
    { label: "Staff", value: "Staff", count: roleCount("Staff") },
    { label: "Suspended", value: "Suspended", count: suspendedCount },
  ];

  const drawerTitle = codeSentTo ? "Staff Added" : editing ? "Edit User" : "Add New Staff";

  return (
    <div className="space-y-6 text-slate-800">
      <PageHeader
        title="User Management"
        description="Manage administrative personnel, assign roles, and review account status."
        actions={
          <button
            type="button"
            onClick={openAddDrawer}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F28A28] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#DD7517] focus:outline-none focus:ring-4 focus:ring-orange-100"
          >
            <span className="text-lg leading-none">+</span>
            Add New Staff
          </button>
        }
      />

      <StatGrid>
        <StatCard label="Total Users" value={users.length} sub="Listed in this demo directory" icon={Users} />
        <StatCard label="Active Accounts" value={activeCount} sub="Currently marked active" icon={CircleCheck} />
        <StatCard label="Suspended" value={suspendedCount} sub="Currently marked suspended" icon={UserX} />
        <StatCard label="Owner Accounts" value={roleCount("Owner")} sub="Owner role in the demo" icon={Crown} />
      </StatGrid>

      <DataCard
        bodyClassName=""
        footer={filteredUsers.length > 0 && <Pagination {...pager} label="User pages" />}
      >
        <div className="border-b border-[#EFEAE4] p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="hidden sm:block">
              <h2 className="text-base font-extrabold text-[#19244E]">
                Administrative Directory
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Search, filter, and manage the sample user records.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search name, email, or role..."
                aria-label="Search users"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50 sm:h-10"
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => changeFilter(item.value)}
                aria-pressed={filter === item.value}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition sm:min-h-9 ${
                  filter === item.value
                    ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    filter === item.value
                      ? "bg-white/80 text-[#B96916]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={users.length === 0 ? "It's quiet behind the counter." : "No one by that name here."}
            message={users.length === 0 ? "Add your first staff member to get started." : "Try another search term or filter."}
            action={
              users.length > 0 && (
                <button
                  type="button"
                  onClick={() => { changeSearch(""); changeFilter("All"); }}
                  className="min-h-11 px-3 text-sm font-bold text-orange-600 hover:text-orange-700"
                >
                  Clear search and filters
                </button>
              )
            }
          />
        ) : (
          <>
            {/* Below xl: stacked cards instead of a wide table. */}
            <ul className="divide-y divide-slate-100 xl:hidden">
              {pageUsers.map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#A95012] sm:flex">
                    {initials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#19244E]">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <RoleBadge role={user.role} />
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openEditDrawer(user)}
                      className="min-h-11 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevokeUser(user)}
                      aria-label={`Remove ${user.name} from the demo`}
                      className="min-h-11 rounded-lg border border-slate-200 px-3 text-xs font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-5 py-3">Email Address</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Last Login</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#A95012]">
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-[#19244E]">{user.name}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              ID: USR-{String(user.id).slice(-4).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                      <td className="px-5 py-3 text-sm text-slate-500">{user.lastLogin}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDrawer(user)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setRevokeUser(user)}
                            aria-label={`Remove ${user.name} from the demo`}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DataCard>

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-xl bg-[#19244E] px-5 py-3.5 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close user form"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-drawer-title"
            className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  User Directory
                </p>
                <h2 id="user-drawer-title" className="mt-1 text-xl font-extrabold text-[#19244E] sm:text-2xl">
                  {drawerTitle}
                </h2>
                {!codeSentTo && (
                  <p className="mt-1 text-sm text-slate-500">
                    {editing
                      ? "Update the fields for this local demo record."
                      : "New accounts are created as Staff / Employee."}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {codeSentTo ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div role="status" className="flex-1 overflow-y-auto px-6 py-10 text-center sm:px-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <MailCheck size={26} />
                  </div>
                  <h3 className="mt-4 break-words text-lg font-extrabold text-[#19244E]">
                    Confirmation code sent to {codeSentTo}
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    The new staff member enters this code to confirm their email.
                    Their account shows as <strong className="text-amber-700">Pending</strong> until then.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={() => notify(`Code resent to ${codeSentTo}.`)}
                    className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="min-h-11 rounded-xl bg-[#F28A28] px-4 text-sm font-bold text-white transition hover:bg-[#DD7517]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveUser} className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#19244E]">Personal Information</h3>
                    <p className="mt-1 text-xs text-slate-500">Enter the name and email for the directory.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      First Name <span className="text-rose-500">*</span>
                      <input
                        required
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        placeholder="e.g. Jamie"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Last Name <span className="text-rose-500">*</span>
                      <input
                        required
                        value={form.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        placeholder="e.g. Santos"
                        className={fieldClass}
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="name@beardistabrew.com"
                      className={fieldClass}
                    />
                  </label>

                  {editing ? (
                    <>
                      <div className="border-t border-slate-100 pt-5">
                        <h3 className="text-sm font-extrabold text-[#19244E]">Role & Access</h3>
                        <p className="mt-1 text-xs text-slate-500">These selections are visual demo settings only.</p>
                      </div>

                      <label className="block text-sm font-semibold text-slate-700">
                        Assigned Role
                        <select
                          value={form.role}
                          onChange={(event) => updateField("role", event.target.value)}
                          className={`${fieldClass} bg-white`}
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <div>
                        <p className="text-sm font-semibold text-slate-700">Account Status</p>
                        {form.status === "Pending" && (
                          <p className="mt-1 text-xs text-amber-700">
                            Waiting for the confirmation code. Pick a status to change it.
                          </p>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          {["Active", "Suspended"].map((status) => (
                            <button
                              type="button"
                              key={status}
                              onClick={() => updateField("status", status)}
                              aria-pressed={form.status === status}
                              className={`min-h-11 rounded-xl border px-4 text-sm font-bold transition ${
                                form.status === status
                                  ? status === "Active"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                                    : "border-rose-300 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
                                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              {status === "Active" ? "✓ " : "⊘ "}{status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-700">Role</p>
                        <RoleBadge role="Staff" />
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-extrabold text-[#19244E]">Temporary Password Demo</h3>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Generates sample text only. It does not create credentials.
                            </p>
                          </div>
                          <span className="rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-800">
                            Demo
                          </span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            placeholder="Generate sample password"
                            autoComplete="off"
                            aria-label="Temporary password"
                            className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-100"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={generateDemoPassword}
                            className="min-h-11 rounded-lg bg-[#19244E] px-3 text-xs font-bold text-white hover:bg-[#26356B] sm:min-h-9"
                          >
                            Generate Sample
                          </button>
                          <button
                            type="button"
                            onClick={copyDemoPassword}
                            className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 sm:min-h-9"
                          >
                            Copy (Preview)
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {formError && (
                    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      {formError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-11 flex-1 rounded-xl bg-[#F28A28] px-4 text-sm font-bold text-white transition hover:bg-[#DD7517]"
                  >
                    {editing ? "Save Changes" : "Save Staff"}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}

      {revokeUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-rose-600">
              !
            </div>
            <h2 id="remove-user-title" className="mt-4 text-xl font-extrabold text-[#19244E]">
              Remove demo user?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              <strong className="text-slate-700">{revokeUser.name}</strong> will
              be removed from this preview's temporary list. This does not
              revoke or change any real account.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setRevokeUser(null)}
                className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRevoke}
                className="min-h-11 flex-1 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
              >
                Remove from Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
