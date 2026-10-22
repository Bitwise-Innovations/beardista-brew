import { useEffect } from "react";
import { X } from "lucide-react";

// The visible track stays small; the button around it gives a 44px tap area.
export function ToggleSwitch({ checked, disabled = false, label, onToggle, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`group flex h-11 w-12 shrink-0 items-center justify-center disabled:cursor-not-allowed ${className}`}
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors group-disabled:opacity-50 ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

// Tall content scrolls inside the modal; the footer stays visible.
// sheetOnPhone: fills the whole screen under 640px.
// dismissible: Esc and a click outside call onClose.
export default function ModalWrapper({
  title,
  description,
  children,
  footer,
  onClose,
  maxWidth = "max-w-md",
  className = "",
  sheetOnPhone = false,
  dismissible = false,
}) {
  useEffect(() => {
    if (!dismissible || !onClose) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismissible, onClose]);

  return (
    <div
      onMouseDown={
        dismissible && onClose
          ? (event) => {
              if (event.target === event.currentTarget) onClose();
            }
          : undefined
      }
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 ${
        sheetOnPhone ? "sm:p-6" : "p-3 sm:p-6"
      }`}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={`flex max-h-full w-full flex-col bg-white shadow-2xl ${
          sheetOnPhone ? "h-full sm:h-auto sm:rounded-2xl" : "rounded-2xl"
        } ${maxWidth} ${className}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-extrabold text-[#19244E] sm:text-xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-3 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-5 sm:px-8 sm:pb-7">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-gray-100 px-5 py-3 sm:px-8 sm:py-4">
            {footer}
          </div>
        )}
      </section>
    </div>
  );
}
