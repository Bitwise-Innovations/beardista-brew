// Coffee cup with CSS-animated rising steam (the .admin-steam animation lives in admin.css).
export function SteamingCup({ size = 64, cupColor = "#E58422", saucerColor = "#19244E", steamColor = "#C9BFB3" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={steamColor} strokeWidth="2.5" strokeLinecap="round">
        <path className="admin-steam" d="M24 23c-3-4 3-6 0-10" />
        <path className="admin-steam" style={{ animationDelay: "0.6s" }} d="M32 23c-3-4 3-6 0-10" />
        <path className="admin-steam" style={{ animationDelay: "1.2s" }} d="M40 23c-3-4 3-6 0-10" />
      </g>
      <path d="M14 28h36v7c0 9.4-7.6 17-17 17h-2c-9.4 0-17-7.6-17-17z" fill={cupColor} />
      <path d="M50 31h3a6 6 0 0 1 0 12h-4" fill="none" stroke={cupColor} strokeWidth="3.5" />
      <rect x="9" y="54" width="46" height="4" rx="2" fill={saucerColor} />
    </svg>
  );
}

// Small loader for loading states: a steaming cup with "Brewing...".
// tone="light" is for dark backgrounds (navy panels, orange buttons).
export default function BrewingLoader({ label = "Brewing...", size = 40, tone = "dark", className = "" }) {
  const light = tone === "light";

  return (
    <span role="status" className={`inline-flex items-center gap-2 ${className}`}>
      <SteamingCup
        size={size}
        cupColor={light ? "#FFFFFF" : "#E58422"}
        saucerColor={light ? "#FFF3E7" : "#19244E"}
        steamColor={light ? "rgba(255,255,255,0.7)" : "#C9BFB3"}
      />
      <span className={`text-sm font-bold ${light ? "text-white" : "text-[#19244E]"}`}>{label}</span>
    </span>
  );
}
