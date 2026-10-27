import { ChevronLeft, ChevronRight } from "lucide-react";

const buttonClass =
  "inline-flex min-h-11 items-center gap-1 rounded-xl border border-[#EAE5DF] bg-white px-3 text-xs font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-[#FFF3E7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#EAE5DF] disabled:hover:bg-white sm:px-4";

// "Showing X–Y of Z" with Previous/Next. Pair it with usePagination().
export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  label = "Pages",
  className = "",
}) {
  if (total === 0) return null;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={label}
      className={`flex items-center justify-between gap-3 ${className}`}
    >
      <p className="text-xs font-semibold text-gray-500">
        Showing {first}–{last} of {total}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={buttonClass}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className={buttonClass}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
