// Shared styles for forms inside modals.
// Each property is set once here, so callers never need a second class to override it.
export function fieldClass({
  error = false,
  height = "h-11",
  background = "bg-gray-50",
  padding = "px-4",
} = {}) {
  return `w-full rounded-xl border text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100 ${
    error ? "border-rose-400" : "border-gray-200"
  } ${height} ${background} ${padding}`;
}

export const inputClass = fieldClass();
export const textareaClass = fieldClass({ height: "", padding: "px-4 py-2.5" });
export const labelClass = "mb-1.5 block text-xs font-bold text-gray-500";
export const cancelButtonClass =
  "min-h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-[#19244E] transition hover:bg-gray-50";
export const primaryButtonClass =
  "min-h-11 rounded-xl bg-[#E58422] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#cf7419]";
