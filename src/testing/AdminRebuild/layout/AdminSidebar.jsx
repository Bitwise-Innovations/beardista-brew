import {
  LayoutDashboard,
  Coffee,
  ChartNoAxesCombined,
  FileText,
  Users,
  ShieldCheck,
  CalendarDays,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../backend/hooks/useAuth";
import ModalWrapper from "../components/ModalWrapper";
import BrandMark from "../components/BrandMark";
import OwnerAvatar from "../components/OwnerAvatar";
import { OWNER } from "../components/brandAssets";

const navigation = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menu Management", path: "/admin/menu-management", icon: Coffee },
  { label: "Analytics", path: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Content Management", path: "/admin/content-management", icon: FileText },
  { label: "User Management", path: "/admin/user-management", icon: Users },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: ShieldCheck },
  { label: "Events", path: "/admin/events", icon: CalendarDays },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export function LogoutDialog({ open, onCancel }) {
  const navigate = useNavigate();
  const { logOut, isLoggingOut } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const handleLogout = async () => {
    setError("");
    try {
      await logOut();
      onCancel();
      navigate("/admin/login");
    } catch {
      setError("We couldn't log you out. Please try again.");
    }
  };

  return (
    <ModalWrapper
      title="Log out?"
      description="You will need to log in again to manage the Beardista Brew menu."
    >
      {error && (
        <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="min-h-11 rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d47414]"
        >
          {isLoggingOut ? "Logging Out..." : "Log Out"}
        </button>
      </div>
    </ModalWrapper>
  );
}

export default function AdminSidebar({
  activePage = "Dashboard",
  mobileOpen = false,
  onClose,
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col bg-[#19244E] text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-sm font-extrabold">BEARDISTA BREW</p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-white/50">
                ADMIN PANEL
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-8 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Workspace
        </p>

        <nav
          aria-label="Admin navigation"
          className="flex-1 space-y-1 overflow-y-auto px-4 py-2"
        >
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive || activePage === label
                    ? "bg-[#E58422] text-white shadow-md"
                    : "text-white/70 hover:bg-white/10"
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto shrink-0 border-t border-white/10 p-5">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="mb-3 flex w-full items-center gap-3 rounded-xl border border-rose-300/10 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-400/20"
          >
            <span aria-hidden="true">↪</span>
            <span>Log Out</span>
          </button>

          <NavLink
            to="/admin/account"
            onClick={onClose}
            title="Open My Account"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E58422] ${
                isActive ? "bg-white/15" : "bg-white/5"
              }`
            }
          >
            <OwnerAvatar className="h-10 w-10 text-sm ring-2 ring-white/15" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{OWNER.name}</p>
              <p className="mt-1 text-xs text-white/50">{OWNER.role}</p>
            </div>
            <span className="sr-only">, open My Account</span>
          </NavLink>

          <p className="px-2 pt-4 text-xs text-white/50">
            v1.0.0 | Beardista Brew
          </p>
        </div>
      </aside>

      {/* Kept outside <aside>: its transform would trap a fixed overlay inside the sidebar. */}
      <LogoutDialog open={logoutOpen} onCancel={() => setLogoutOpen(false)} />
    </>
  );
}
