export default function PrimaryButton({ children = "Save Changes", className = "", type = "button" }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#E58422] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#CF7318] ${className}`}
    >
      {children}
    </button>
  );
}
