import { useMemo, useState } from "react";

const INITIAL_USERS = [
  {
    id: 1,
    name: "Jim Carlo Gorospe",
    email: "founder@beardistabrew.com",
    role: "Owner",
    status: "Active",
    lastLogin: "Oct 16, 2026 · 09:42 AM",
  },
  {
    id: 2,
    name: "Ben Cabazeres",
    email: "admin@beardistabrew.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Oct 16, 2026 · 08:15 AM",
  },
  {
    id: 3,
    name: "Gab Evora",
    email: "barista.lead@beardistabrew.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Oct 15, 2026 · 05:30 PM",
  },
  {
    id: 4,
    name: "Jahnyne Galindez",
    email: "dave.tan@beardistabrew.com",
    role: "Admin",
    status: "Suspended",
    lastLogin: "Sep 28, 2026 · 02:10 PM",
  },
];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "Admin",
  status: "Active",
  password: "",
};

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function MetricCard({ label, value, detail, icon, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#19244E]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
        role === "Owner"
          ? "bg-violet-50 text-violet-700"
          : "bg-blue-50 text-blue-700"
      }`}
    >
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
  const [toast, setToast] = useState("");
  const [revokeUser, setRevokeUser] = useState(null);

  const activeCount = users.filter((user) => user.status === "Active").length;
  const suspendedCount = users.filter((user) => user.status === "Suspended").length;
  const ownerCount = users.filter((user) => user.role === "Owner").length;
  const adminCount = users.filter((user) => user.role === "Admin").length;

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

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function openAddDrawer() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowPassword(false);
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

    if (editingId !== null) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, name: fullName, email, role: form.role, status: form.status }
            : user
        )
      );
      notify("Demo user updated locally.");
    } else {
      const newUser = {
        id: Date.now(),
        name: fullName,
        email,
        role: form.role,
        status: form.status,
        lastLogin: "Never",
      };
      setUsers((current) => [newUser, ...current]);
      notify("Demo user added locally.");
    }

    setDrawerOpen(false);
  }

  function confirmRevoke() {
    if (!revokeUser) return;

    setUsers((current) => current.filter((user) => user.id !== revokeUser.id));
    setRevokeUser(null);
    notify("Demo user removed from this preview.");
  }

  const filters = [
    { label: "All Users", value: "All", count: users.length },
    { label: "Owner", value: "Owner", count: ownerCount },
    { label: "Admin", value: "Admin", count: adminCount },
    { label: "Suspended", value: "Suspended", count: suspendedCount },
  ];

  return (
    <div className="min-h-full bg-[#F7F8FC] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                RBAC Directory
              </span>
              <span className="text-xs font-medium text-slate-400">
                Admin workspace / User Management
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#19244E] sm:text-4xl">
              User Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage administrative personnel, assign roles, and review account
              status in this local UI preview.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddDrawer}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#F28A28] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#DD7517] focus:outline-none focus:ring-4 focus:ring-orange-100 xl:self-auto"
          >
            <span className="text-lg leading-none">+</span>
            Add New Admin
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Users"
            value={users.length}
            detail="Listed in this demo directory"
            icon="♙"
            accent="bg-blue-50 text-blue-700"
          />
          <MetricCard
            label="Active Accounts"
            value={activeCount}
            detail="Currently marked active"
            icon="✓"
            accent="bg-emerald-50 text-emerald-700"
          />
          <MetricCard
            label="Suspended Accounts"
            value={suspendedCount}
            detail="Currently marked suspended"
            icon="⊘"
            accent="bg-rose-50 text-rose-700"
          />
          <MetricCard
            label="Owner Accounts"
            value={ownerCount}
            detail="Owner role in the demo"
            icon="♛"
            accent="bg-violet-50 text-violet-700"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#19244E]">
                  Administrative Directory
                </h2>
                <p className="mt-1 text-sm text-slate-500">
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, or role..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                    filter === item.value
                      ? "border-[#19244E] bg-[#19244E] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      filter === item.value
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-5 py-4">Email Address</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last Login</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#A95012]">
                          {initials(user.name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#19244E]">{user.name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: USR-{String(user.id).slice(-4).padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-5 py-4 text-sm text-slate-500">{user.lastLogin}</td>
                    <td className="px-5 py-4">
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
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                        ⌕
                      </div>
                      <p className="mt-3 font-bold text-slate-700">No users found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try another search term or filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setSearch(""); setFilter("All"); }}
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

          <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {filteredUsers.length} of {users.length} demo users</span>
            <span>Changes stay in this preview session only</span>
          </div>
        </section>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="text-lg">ⓘ</span>
          <p className="leading-6">
            <strong>Preview mode:</strong> adding, editing, and removing users
            only changes temporary React state. No account, password, or server
            data is changed.
          </p>
        </div>
      </div>

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

          <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  User Directory
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#19244E]">
                  {editingId !== null ? "Edit User" : "Add New Admin"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the fields for this local demo record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveUser} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Last Name <span className="text-rose-500">*</span>
                    <input
                      required
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      placeholder="e.g. Santos"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50"
                  />
                </label>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-extrabold text-[#19244E]">Role & Access</h3>
                  <p className="mt-1 text-xs text-slate-500">These selections are visual demo settings only.</p>
                </div>

                <label className="block text-sm font-semibold text-slate-700">
                  Assigned Role
                  <select
                    value={form.role}
                    onChange={(event) => updateField("role", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50"
                  >
                    <option value="Owner">Owner Admin</option>
                    <option value="Admin">Store Admin</option>
                  </select>
                  <span className="mt-2 block text-xs font-normal text-slate-400">
                    {form.role === "Owner"
                      ? "Owner role shown for the preview directory."
                      : "Store Admin role shown for the preview directory."}
                  </span>
                </label>

                <div>
                  <p className="text-sm font-semibold text-slate-700">Account Status</p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {["Active", "Suspended"].map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => updateField("status", status)}
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
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

                {editingId === null && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#19244E]">Temporary Password Demo</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Generates sample text only. It does not create credentials or send an invitation.
                        </p>
                      </div>
                      <span className="rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-800">
                        Demo
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(event) => updateField("password", event.target.value)}
                        placeholder="Generate sample password"
                        autoComplete="off"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={generateDemoPassword}
                        className="rounded-lg bg-[#19244E] px-3 py-2 text-xs font-bold text-white hover:bg-[#26356B]"
                      >
                        Generate Sample
                      </button>
                      <button
                        type="button"
                        onClick={copyDemoPassword}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Copy (Preview)
                      </button>
                    </div>
                  </div>
                )}

                {formError && (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#F28A28] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#DD7517]"
                >
                  {editingId !== null ? "Save Changes" : "Save User"}
                </button>
              </div>
            </form>
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
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRevoke}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"
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
