// White card used on every admin page: same radius, border and padding everywhere.
// `clip` is turned off for cards that hold dropdowns which must spill outside.
export default function DataCard({
  title,
  description,
  badge,
  footer,
  children,
  className = "",
  bodyClassName = "p-4 sm:p-6",
  clip = true,
}) {
  return (
    <section
      className={`rounded-2xl border border-[#EAE5DF] bg-white shadow-sm ${clip ? "overflow-hidden" : ""} ${className}`}
    >
      {(title || badge) && (
        <header className="flex items-start justify-between gap-3 border-b border-[#EFEAE4] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-base font-bold text-[#19244E] sm:text-lg">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 hidden text-sm text-gray-500 sm:block">
                {description}
              </p>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </header>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer && (
        <footer className="border-t border-[#EFEAE4] px-4 py-3 sm:px-6">
          {footer}
        </footer>
      )}
    </section>
  );
}
