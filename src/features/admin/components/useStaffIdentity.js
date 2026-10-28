import { useAuth } from "../../../backend/hooks/useAuth";

const ROLE_LABELS = { owner: "Owner", admin: "Admin", staff: "Staff" };

// The signed-in person, shaped for the admin UI.
export function useStaffIdentity() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.email || "Staff";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return {
    name,
    firstName: name.split(/\s+/)[0],
    initials,
    email: profile?.email ?? user?.email ?? "",
    role: ROLE_LABELS[profile?.role] ?? "Staff",
    roleKey: profile?.role ?? "staff",
    photo: profile?.avatar_url || null,
    lastLogin: user?.last_sign_in_at ?? null,
    pendingEmail: user?.new_email ?? "",
  };
}