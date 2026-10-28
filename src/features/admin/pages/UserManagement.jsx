import { useMemo, useState } from "react";
import { CircleCheck, Copy, Crown, KeyRound, UserX, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import EmptyState from "../components/EmptyState";
import BrewingLoader from "../components/BrewingLoader";
import { useAuth } from "../../../backend/hooks/useAuth";
import {
  useCreateStaff,
  useRemoveStaff,
  useResetStaffPassword,
  useStaffList,
  useUpdateStaff,
} from "../../../backend/hooks/useStaff";

const emptyForm = { firstName: "", lastName: "", email: "", roleKey: "staff", suspended: false };

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner Admin" },
  { value: "admin", label: "Store Admin" },
  { value: "staff", label: "Staff / Employee" },
];

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 disabled:bg-slate-50 disabled:text-slate-500";

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

// Shows a temporary password once, with a working copy button.
function PasswordPanel({ email, password, onCopy }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <KeyRound size={26} />
      </div>
      <h3 className="mt-4 break-words text-lg font-extrabold text-[#19244E]">Temporary password for {email}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Give this to the staff member. They log in with it, then change it in My Account. It won't be shown again.
      </p>
      <div className="mx-auto mt-5 flex max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
        <code className="min-w-0 flex-1 break-all px-2 text-left font-mono text-base font-bold text-[#19244E]">{password}</code>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[#19244E] px-3 text-xs font-bold text-white hover:bg-[#26356B]"
        >
          <Copy size={14} />
          Copy
        </button>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { user: me } = useAuth();
  const staffQuery = useStaffList();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const resetPassword = useResetStaffPassword();
  const removeStaff = useRemoveStaff();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [issuedPassword, setIssuedPassword] = useState(null);
  const [toast, setToast] = useState("");
  const [revokeUser, setRevokeUser] = useState(null);

  const users = useMemo(() => staffQuery.data ?? [], [staffQuery.data]);
  const editing = editingUser !== null;
  const editingSelf = editing && editingUser.id === me?.id;
  const busy = createStaff.isPending || updateStaff.isPending || resetPassword.isPending;

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
        filter === "All" || (filter === "Suspended" ? user.status === "Suspended" : user.role === filter);
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const pager = usePagination(filteredUsers, [search, filter]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function openAddDrawer() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setIssuedPassword(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(user) {
    const parts = user.name.split(" ");
    setEditingUser(user);
    setForm({
      firstName: parts.shift() || "",
      lastName: parts.join(" "),
      email: user.email,
      roleKey: user.roleKey,
      suspended: user.status === "Suspended",
    });
    setFormError("");
    setIssuedPassword(null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    if (busy) return;
    setDrawerOpen(false);
    setIssuedPassword(null);
  }

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(issuedPassword.password);
      notify("Password copied.");
    } catch {
      notify("Couldn't copy automatically. Select the password and copy it.");
    }
  }

  async function saveUser(event) {
    event.preventDefault();
    setFormError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const fullName = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName || !email) {
      setFormError("Please complete the first name, last name, and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      if (editing) {
        await updateStaff.mutateAsync({
          userId: editingUser.id,
          fullName,
          role: form.roleKey,
          status: form.suspended ? "disabled" : "active",
        });
        notify(`${fullName} was updated.`);
        setDrawerOpen(false);
      } else {
        const result = await createStaff.mutateAsync({ fullName, email });
        setIssuedPassword({ email, password: result.temporaryPassword });
      }
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function issueNewPassword() {
    setFormError("");
    try {
      const result = await resetPassword.mutateAsync(editingUser.id);
      setIssuedPassword({ email: editingUser.email, password: result.temporaryPassword });
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function confirmRevoke() {
    if (!revokeUser) return;
    try {
      await removeStaff.mutateAsync(revokeUser.id);
      notify(`${revokeUser.name} was removed.`);
      setRevokeUser(null);
    } catch (error) {
      notify(error.message);
      setRevokeUser(null);
    }
  }

  const filters = [
    { label: "All Users", value: "All", count: users.length },
    { label: "Owner", value: "Owner", count: roleCount("Owner") },
    { label: "Admin", value: "Admin", count: roleCount("Admin") },
    { label: "Staff", value: "Staff", count: roleCount("Staff") },
    { label: "Suspended", value: "Suspended", count: suspendedCount },
  ];

  const drawerTitle = issuedPassword
    ? editing
      ? "New Password Issued"
      : "Staff Added"
    : editing
      ? "Edit User"
      : "Add New Staff";

  if (staffQuery.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <BrewingLoader label="Loading staff..." />
      </div>
    );
  }

  if (staffQuery.isError) {
    return (
      <EmptyState
        title="We couldn't load the staff list."
        message={staffQuery.error?.message ?? "Check your connection and try again."}
        action={
          <button
            type="button"
            onClick={() => staffQuery.refetch()}
            className="min-h-11 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white hover:bg-[#253570]"
          >
            Try again
          </button>
        }
      />
    );
  }

  const rowActions = (user, compact) => {
    const isMe = user.id === me?.id;
    const base = compact ? "min-h-11 rounded-lg border border-slate-200 px-3 text-xs font-bold transition" : "rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold transition";
    return (
      <>
        <button
          type="button"
          onClick={() => openEditDrawer(user)}
          className={`${base} text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700`}
        >
          Edit
        </button>
        {!isMe && (
          <button
            type="button"
            onClick={() => setRevokeUser(user)}
            aria-label={`Remove ${user.name}`}
            className={`${base} text-rose-600 hover:border-rose-200 hover:bg-rose-50`}
          >
            Remove
          </button>
        )}
      </>
    );
  };

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
        <StatCard label="Total Users" value={users.length} sub="All staff accounts" icon={Users} />
        <StatCard label="Active Accounts" value={activeCount} sub="Have logged in" icon={CircleCheck} />
        <StatCard label="Suspended" value={suspendedCount} sub="Blocked from logging in" icon={UserX} />
        <StatCard label="Owner Accounts" value={roleCount("Owner")} sub="Full access" icon={Crown} />
      </StatGrid>

      <DataCard bodyClassName="" footer={filteredUsers.length > 0 && <Pagination {...pager} label="User pages" />}>
        <div className="border-b border-[#EFEAE4] p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="hidden sm:block">
              <h2 className="text-base font-extrabold text-[#19244E]">Administrative Directory</h2>
              <p className="mt-0.5 text-sm text-slate-500">Search, filter, and manage staff accounts.</p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition sm:min-h-9 ${
                  filter === item.value
                    ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {item.label}
                <span className={`rounded-md px-1.5 py-0.5 text-xs ${filter === item.value ? "bg-white/80 text-[#B96916]" : "bg-slate-100 text-slate-500"}`}>
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
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
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
              {pager.pageItems.map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#A95012] sm:flex">
                    {initials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#19244E]">
                      {user.name}
                      {user.id === me?.id && <span className="ml-1.5 text-xs font-semibold text-slate-400">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <RoleBadge role={user.role} />
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">{rowActions(user, true)}</div>
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
                  {pager.pageItems.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#A95012]">
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-[#19244E]">
                              {user.name}
                              {user.id === me?.id && <span className="ml-1.5 text-xs font-semibold text-slate-400">(you)</span>}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">ID: USR-{user.id.slice(0, 4).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                      <td className="px-5 py-3 text-sm text-slate-500">{user.lastLogin}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">{rowActions(user, false)}</div>
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
          <button type="button" aria-label="Close user form" onClick={closeDrawer} className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]" />

          <aside role="dialog" aria-modal="true" aria-labelledby="user-drawer-title" className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">User Directory</p>
                <h2 id="user-drawer-title" className="mt-1 text-xl font-extrabold text-[#19244E] sm:text-2xl">{drawerTitle}</h2>
                {!issuedPassword && (
                  <p className="mt-1 text-sm text-slate-500">
                    {editing ? "Update this person's name, role, or status." : "New accounts are created as Staff / Employee."}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {issuedPassword ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <PasswordPanel email={issuedPassword.email} password={issuedPassword.password} onCopy={copyPassword} />
                <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="min-h-11 w-full rounded-xl bg-[#F28A28] px-4 text-sm font-bold text-white transition hover:bg-[#DD7517]"
                  >
                    I've saved it, Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveUser} noValidate className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#19244E]">Personal Information</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {editing ? "The email can't be changed here. Staff change it in My Account." : "Enter the name and email for the new account."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      First Name <span className="text-rose-500">*</span>
                      <input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="e.g. Jamie" className={fieldClass} />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Last Name <span className="text-rose-500">*</span>
                      <input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="e.g. Santos" className={fieldClass} />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                    <input
                      type="email"
                      value={form.email}
                      disabled={editing}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@beardistabrew.com"
                      className={fieldClass}
                    />
                  </label>

                  {editing ? (
                    <>
                      <div className="border-t border-slate-100 pt-5">
                        <h3 className="text-sm font-extrabold text-[#19244E]">Role & Access</h3>
                        {editingSelf && <p className="mt-1 text-xs text-amber-700">You can't change your own role or status.</p>}
                      </div>

                      <label className="block text-sm font-semibold text-slate-700">
                        Assigned Role
                        <select
                          value={form.roleKey}
                          disabled={editingSelf}
                          onChange={(e) => updateField("roleKey", e.target.value)}
                          className={`${fieldClass} bg-white`}
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <div>
                        <p className="text-sm font-semibold text-slate-700">Account Status</p>
                        {editingUser.status === "Pending" && (
                          <p className="mt-1 text-xs text-amber-700">Hasn't logged in yet.</p>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          {[
                            { label: "Active", suspended: false },
                            { label: "Suspended", suspended: true },
                          ].map((option) => (
                            <button
                              type="button"
                              key={option.label}
                              disabled={editingSelf}
                              onClick={() => updateField("suspended", option.suspended)}
                              aria-pressed={form.suspended === option.suspended}
                              className={`min-h-11 rounded-xl border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                form.suspended === option.suspended
                                  ? option.suspended
                                    ? "border-rose-300 bg-rose-50 text-rose-700 ring-2 ring-rose-100"
                                    : "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              {option.suspended ? "⊘ " : "✓ "}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {!editingSelf && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-sm font-extrabold text-[#19244E]">Forgot their password?</h3>
                          <p className="mt-1 text-xs leading-5 text-slate-500">Issue a new temporary password. Their old one stops working.</p>
                          <button
                            type="button"
                            onClick={issueNewPassword}
                            disabled={busy}
                            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#19244E] px-3 text-xs font-bold text-white hover:bg-[#26356B] disabled:cursor-wait sm:min-h-9"
                          >
                            <KeyRound size={14} />
                            {resetPassword.isPending ? "Issuing..." : "Issue New Password"}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-700">Role</p>
                        <RoleBadge role="Staff" />
                      </div>
                      <p className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs leading-5 text-[#19244E]">
                        A temporary password is created when you save. You'll see it once on the next screen.
                      </p>
                    </>
                  )}

                  {formError && (
                    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{formError}</p>
                  )}
                </div>

                <div className="flex gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#F28A28] px-4 text-sm font-bold text-white transition hover:bg-[#DD7517] disabled:cursor-wait"
                  >
                    {busy ? <BrewingLoader tone="light" size={24} label="Saving..." /> : editing ? "Save Changes" : "Save Staff"}
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}

      {revokeUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="remove-user-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-rose-600">!</div>
            <h2 id="remove-user-title" className="mt-4 text-xl font-extrabold text-[#19244E]">Remove this account?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              <strong className="text-slate-700">{revokeUser.name}</strong> will be permanently deleted and can no longer log in.
              Their past changes stay in the audit log. To block them temporarily, use Edit → Suspended instead.
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
                disabled={removeStaff.isPending}
                className="min-h-11 flex-1 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-wait"
              >
                {removeStaff.isPending ? "Removing..." : "Remove Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}