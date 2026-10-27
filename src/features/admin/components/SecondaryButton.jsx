export default function SecondaryButton({ children = "Cancel", className = "", type = "button" }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 ${className}`}
    >
      {children}
    </button>
  );
}
