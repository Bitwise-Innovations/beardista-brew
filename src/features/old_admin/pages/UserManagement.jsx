import React, { useState } from 'react';

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    firstName: 'Jim Carlo',
    lastName: 'Gorospe',
    name: 'Jim Carlo Gorospe',
    email: 'founder@beardistabrew.com',
    role: 'Owner', // 'Owner' | 'Admin'
    status: 'Active', // 'Active' | 'Suspended'
    lastLogin: 'Oct 16, 2026, 09:42 AM',
    avatar: '/src/assets/owner_pic.jpg'
  },
  {
    id: 'usr-2',
    firstName: 'Ben',
    lastName: 'Cabazeres',
    name: 'Ben Cabazeres',
    email: 'admin@beardistabrew.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Oct 16, 2026, 08:15 AM',
    avatar: '/src/assets/barista_ben.jpg'
  },
  {
    id: 'usr-3',
    firstName: 'Gab',
    lastName: 'Evora',
    name: 'Gab Evora',
    email: 'barista.lead@beardistabrew.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Oct 15, 2026, 05:30 PM',
    avatar: '/src/assets/barista_dais.jpg'
  },
  {
    id: 'usr-4',
    firstName: 'Jahnyne',
    lastName: 'Galindez',
    name: 'Jahnyne Galindez',
    email: 'dave.tan@beardistabrew.com',
    role: 'Admin',
    status: 'Suspended',
    lastLogin: 'Sep 28, 2026, 02:10 PM',
    avatar: '/src/assets/barista_ja.jpg'
  }
];

// Helper to generate a secure random password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = 'Beardista#';
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

export const UserManagement = ({ onLogAudit }) => {
  // State for Users List
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Slide-over Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = creating new user
  const [drawerForm, setDrawerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Store Admin', // 'Owner Admin' | 'Store Admin'
    status: 'Active',
    password: ''
  });
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Modal States
  const [userToDelete, setUserToDelete] = useState(null);

  // In-page Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // FILTERED USERS
  // ---------------------------------------------------------------------------
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Suspended' ? u.status === 'Suspended' : u.role === roleFilter);

    return matchesSearch && matchesRole;
  });

  // ---------------------------------------------------------------------------
  // DRAWER HANDLERS (CREATE / EDIT)
  // ---------------------------------------------------------------------------
  const handleOpenAdd = () => {
    setEditingUser(null);
    setDrawerForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Store Admin',
      status: 'Active',
      password: generateRandomPassword()
    });
    setFormError('');
    setPasswordCopied(false);
    setShowPassword(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    // Map existing role to drawer dropdown value
    const mappedRole = user.role === 'Owner' ? 'Owner Admin' : 'Store Admin';

    setDrawerForm({
      firstName: user.firstName || user.name.split(' ')[0] || '',
      lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: mappedRole,
      status: user.status || 'Active',
      password: '' // empty for edit unless regenerated
    });
    setFormError('');
    setPasswordCopied(false);
    setShowPassword(false);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingUser(null);
  };

  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword();
    setDrawerForm((prev) => ({ ...prev, password: newPass }));
    setPasswordCopied(false);
    setShowPassword(true);
  };

  const handleCopyPassword = () => {
    if (!drawerForm.password) return;
    navigator.clipboard.writeText(drawerForm.password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2500);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!drawerForm.firstName.trim() || !drawerForm.lastName.trim()) {
      setFormError('Please enter both first and last name.');
      return;
    }
    if (!drawerForm.email.trim() || !drawerForm.email.includes('@')) {
      setFormError('Please enter a valid administrative email address.');
      return;
    }

    // Map dropdown role to standard role label (Owner, Admin)
    const normalizedRole = drawerForm.role === 'Owner Admin' ? 'Owner' : 'Admin';

    const fullName = `${drawerForm.firstName.trim()} ${drawerForm.lastName.trim()}`;

    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                firstName: drawerForm.firstName.trim(),
                lastName: drawerForm.lastName.trim(),
                name: fullName,
                email: drawerForm.email.trim().toLowerCase(),
                role: normalizedRole,
                status: drawerForm.status
              }
            : u
        )
      );
      showToast(`User "${fullName}" updated successfully!`);
      if (onLogAudit) {
        onLogAudit('Update User', 'update', fullName, editingUser.id, editingUser.role, normalizedRole);
      }
    } else {
      // Create new user
      const newUser = {
        id: `usr-${Date.now()}`,
        firstName: drawerForm.firstName.trim(),
        lastName: drawerForm.lastName.trim(),
        name: fullName,
        email: drawerForm.email.trim().toLowerCase(),
        role: normalizedRole,
        status: drawerForm.status,
        lastLogin: 'Never (Pending First Login)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast(`New admin "${fullName}" invited with role ${normalizedRole}.`);
      if (onLogAudit) {
        onLogAudit('Create Admin', 'create', fullName, newUser.id, 'None', `Role: ${normalizedRole}`);
      }
    }

    handleCloseDrawer();
  };

  // ---------------------------------------------------------------------------
  // DELETE / REVOKE ACCESS HANDLERS
  // ---------------------------------------------------------------------------
  const handleConfirmRevoke = () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.name;
    const deletedId = userToDelete.id;
    setUsers((prev) => prev.filter((u) => u.id !== deletedId));
    setUserToDelete(null);
    showToast(`Access revoked for ${deletedName}.`);
    if (onLogAudit) {
      onLogAudit('Revoke Access', 'delete', deletedName, deletedId, 'Active Access', 'Access Revoked');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#19244E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-slideDown">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E58422] animate-pulse" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* PAGE HEADER                                                          */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
              User Management
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-md border border-indigo-200">
              RBAC Directory
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage administrative personnel, assign role-based access control, and revoke employee credentials.
          </p>
        </div>

        {/* Primary Orange Button: "+ Add New Admin" */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="text-base font-black leading-none">+</span>
          <span>Add New Admin</span>
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SEARCH BAR & ROLE FILTERS                                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-3 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin users by name, email, or role..."
              className="w-full pl-11 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{users.filter((u) => u.status === 'Active').length} Active</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>{users.filter((u) => u.status === 'Suspended').length} Suspended</span>
            </span>
          </div>
        </div>

        {/* Filter Pills: All, Owner, Admin, Suspended */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {['All', 'Owner', 'Admin', 'Suspended'].map((filter) => {
            const isActive = roleFilter === filter;
            const count =
              filter === 'All'
                ? users.length
                : filter === 'Suspended'
                ? users.filter((u) => u.status === 'Suspended').length
                : users.filter((u) => u.role === filter).length;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setRoleFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#19244E] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                }`}
              >
                <span>{filter === 'All' ? 'All Personnel' : filter}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* DATA TABLE (READ / DELETE)                                           */}
      {/* Columns: Name, Email, Role, Status, Last Login, Actions              */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/90 text-[11px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Login</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3 text-lg">
                      👥
                    </div>
                    <div className="text-xs font-bold text-gray-700">No admin users found</div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Try clearing your search query or adjusting role filter pills.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isOwner = user.role === 'Owner';
                  const isAdmin = user.role === 'Admin';
                  const isActive = user.status === 'Active';

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-amber-50/25 transition-colors group"
                    >
                      {/* Name with Avatar */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs bg-gray-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div>
                            <div className="font-extrabold text-[#19244E] text-xs group-hover:text-[#E58422] transition-colors">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-gray-400">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-semibold text-gray-700 text-xs font-mono">
                          {user.email}
                        </span>
                      </td>

                      {/* Role Badge (Owner, Admin) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isOwner ? (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200/80 font-black text-[11px] rounded-lg inline-flex items-center gap-1.5 shadow-2xs">
                            <span>👑</span>
                            <span>Owner</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 font-black text-[11px] rounded-lg inline-flex items-center gap-1.5 shadow-2xs">
                            <span>🛡️</span>
                            <span>Admin</span>
                          </span>
                        )}
                      </td>

                      {/* Status (Active, Suspended) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{user.status}</span>
                        </span>
                      </td>

                      {/* Last Login Date */}
                      <td className="py-4 px-6 whitespace-nowrap text-gray-500 font-medium">
                        {user.lastLogin}
                      </td>

                      {/* Actions: Edit & Delete (trash) icon */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xs"
                            title="Edit user details"
                          >
                            Edit
                          </button>

                          {/* Delete (trash) icon button */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                            title="Revoke access"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ADD / EDIT ADMIN DRAWER (RIGHT-ALIGNED SLIDING DRAWER)               */}
      {/* Form: First Name, Last Name, Email, Role dropdown, Password gen      */}
      {/* -------------------------------------------------------------------- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer animate-fadeIn"
            onClick={handleCloseDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-slideLeft">
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-[#19244E] text-white flex items-center justify-between border-b border-[#24336c]">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E58422] flex items-center justify-center text-white font-black text-sm">
                    {editingUser ? '✎' : '+'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight">
                      {editingUser ? `Edit Admin: ${editingUser.name}` : 'Add New Admin'}
                    </h3>
                    <p className="text-[11px] text-[#FFF3E7]/70">
                      {editingUser
                        ? 'Modify role privileges and account status'
                        : 'Provision new administrative credentials'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSaveUser} className="p-6 flex-1 overflow-y-auto space-y-5">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={drawerForm.firstName}
                      onChange={(e) => setDrawerForm({ ...drawerForm, firstName: e.target.value })}
                      placeholder="e.g. Maria"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={drawerForm.lastName}
                      onChange={(e) => setDrawerForm({ ...drawerForm, lastName: e.target.value })}
                      placeholder="e.g. Santos"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={drawerForm.email}
                    onChange={(e) => setDrawerForm({ ...drawerForm, email: e.target.value })}
                    placeholder="admin@beardistabrew.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Must be a corporate or authorized store personnel email.
                  </span>
                </div>

                {/* Role Assignment Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                    Role Assignment Dropdown *
                  </label>
                  <select
                    value={drawerForm.role}
                    onChange={(e) => setDrawerForm({ ...drawerForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="Owner Admin">Owner Admin (Full System & Revenue Privileges)</option>
                    <option value="Store Admin">Store Admin (Menu, Availability, and Event Ops)</option>
                  </select>

                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-[11px] text-gray-600 leading-snug">
                    {drawerForm.role === 'Owner Admin' ? (
                      <p>👑 <strong>Owner Admin:</strong> Unrestricted access to financial metrics, billing, audit histories, and staff credentials.</p>
                    ) : (
                      <p>🛡️ <strong>Store Admin:</strong> Full operational controls over the live catalog, inventory availability, and customer surveys.</p>
                    )}
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDrawerForm({ ...drawerForm, status: 'Active' })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        drawerForm.status === 'Active'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerForm({ ...drawerForm, status: 'Suspended' })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        drawerForm.status === 'Suspended'
                          ? 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Suspended</span>
                    </button>
                  </div>
                </div>

                {/* Initial Password Generator Field */}
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-[#E58422]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#19244E] uppercase tracking-wider">
                      Initial Temporary Password
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-extrabold text-[#E58422] hover:text-[#c96f18] cursor-pointer flex items-center gap-1"
                    >
                      <span>🔄</span>
                      <span>Generate Secure</span>
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={drawerForm.password}
                      onChange={(e) => setDrawerForm({ ...drawerForm, password: e.target.value })}
                      placeholder={editingUser ? 'Leave blank to preserve current password' : 'Click Generate Secure Password'}
                      className="w-full pl-3 pr-20 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422]"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                      {drawerForm.password && (
                        <button
                          type="button"
                          onClick={handleCopyPassword}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-extrabold rounded-md cursor-pointer transition-all"
                          title="Copy to clipboard"
                        >
                          {passwordCopied ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    The admin will be requested to change this temporary credential upon their first sign-in.
                  </p>
                </div>
              </form>

              {/* Drawer Footer Buttons: Cancel & Save User */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUser}
                  className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* CENTERED DELETE / REVOKE CONFIRMATION MODAL                          */}
      {/* Prompt: "Are you sure you want to revoke this user's access?"        */}
      {/* -------------------------------------------------------------------- */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setUserToDelete(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 z-10 animate-scaleUp space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold mx-auto shadow-sm">
              ⚠️
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-[#19244E]">
                Revoke Admin Access
              </h3>
              <p className="text-xs font-bold text-gray-800">
                Are you sure you want to revoke this user's access?
              </p>
            </div>

            {/* Target User Summary Card */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
              <img
                src={userToDelete.avatar}
                alt={userToDelete.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="text-xs font-extrabold text-[#19244E] truncate">
                  {userToDelete.name}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {userToDelete.email}
                </div>
                <div className="text-[10px] font-bold text-[#E58422] mt-0.5">
                  Role: {userToDelete.role}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              This action will permanently terminate this administrative account and invalidate all active session tokens for the Beardista Brew Admin Portal.
            </p>

            {/* Modal Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
