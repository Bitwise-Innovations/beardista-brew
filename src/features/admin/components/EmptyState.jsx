import { Coffee } from "lucide-react";

// Friendly message for an empty list, with an optional button below it.
export default function EmptyState({ title, message, icon: Icon = Coffee, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3E7] text-[#E58422]">
        <Icon size={26} />
      </span>
      <p className="mt-3 font-bold text-[#19244E]">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
