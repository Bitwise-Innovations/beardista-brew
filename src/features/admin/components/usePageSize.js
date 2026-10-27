import { useEffect, useState } from "react";

const PHONE_QUERY = "(max-width: 639px)";
const DESKTOP_ROWS = 7;
const PHONE_ROWS = 4;

const isPhoneScreen = () =>
  typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches;

// 7 rows on screens 640px and up, 4 rows on phones, unless a list asks for other sizes.
export function usePageSize({ desktop = DESKTOP_ROWS, phone = PHONE_ROWS } = {}) {
  const [isPhone, setIsPhone] = useState(isPhoneScreen);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const onChange = (event) => setIsPhone(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isPhone ? phone : desktop;
}

// Splits a list into pages. When anything in resetKeys (search, filters) changes, it goes back to page 1.
// `sizes` ({ desktop, phone }) is optional, e.g. a card grid that needs an even number per page.
// The result can be spread straight onto <Pagination />.
export function usePagination(items, resetKeys = [], sizes) {
  const pageSize = usePageSize(sizes);
  const [page, setPage] = useState(1);
  const resetKey = JSON.stringify(resetKeys);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;

  return {
    page: currentPage,
    pageSize,
    total: items.length,
    onPageChange: setPage,
    pageItems: items.slice(start, start + pageSize),
  };
}
