const statusStyles = {
  active: "bg-green-50 text-green-700 ring-green-600/20",
  suspended: "bg-red-50 text-red-700 ring-red-600/20",
  "in stock": "bg-green-50 text-green-700 ring-green-600/20",
  "low stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "out of stock": "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  inactive: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export default function StatusBadge({ status = "Active", className = "" }) {
  const style = statusStyles[String(status).toLowerCase()] || statusStyles.inactive;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${style} ${className}`}>
      {status}
    </span>
  );
}
