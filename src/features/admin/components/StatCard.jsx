// Phones: one compact strip (label + value only). Larger screens: separate cards in a grid.
const gridColumns = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "xl:grid-cols-4",
};

export function StatGrid({ columns = 4, className = "", children }) {
  return (
    <div
      className={`flex divide-x divide-[#EFEAE4] overflow-x-auto rounded-2xl border border-[#EAE5DF] bg-white shadow-sm sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-x-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none ${gridColumns[columns] ?? gridColumns[4]} ${className}`}
    >
      {children}
    </div>
  );
}

export default function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="min-w-[4.5rem] flex-1 basis-0 px-3 py-2.5 sm:flex sm:h-36 sm:min-w-0 sm:flex-col sm:justify-between sm:rounded-2xl sm:border sm:border-[#EAE5DF] sm:bg-white sm:p-5 sm:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold leading-tight text-gray-500 sm:truncate sm:text-sm">
          {label}
        </p>
        {Icon && (
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#E58422] sm:flex">
            <Icon size={18} />
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-display mt-0.5 truncate text-base font-bold text-[#19244E] sm:mt-0 sm:text-2xl">
          {value}
        </p>
        {sub && (
          <p className="mt-1 hidden truncate text-xs text-gray-500 sm:block">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
