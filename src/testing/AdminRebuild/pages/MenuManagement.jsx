import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Coffee,
  Image as ImageIcon,
  X,
  Store,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PHONE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 8;
// Matches Tailwind's sm breakpoint (640px).
const PHONE_QUERY = "(max-width: 639px)";

const sampleItems = [
  { id: 1, name: "Beardista Signature Brew", description: "House blend with brown sugar syrup and a velvety oat cream top.", category: "Signatures", price: 165, available: true },
  { id: 2, name: "Iced Latte", description: "Espresso blended with chilled milk over ice.", category: "Milk Creations", price: 110, available: true },
  { id: 3, name: "Spanish Latte", description: "Espresso with sweetened condensed milk and fresh milk.", category: "Milk Creations", price: 140, available: true },
  { id: 4, name: "Pour-Over Ethiopia", description: "Single-origin light roast with floral and citrus notes, brewed by hand.", category: "Specialty Coffee", price: 180, available: true },
  { id: 5, name: "Americano", description: "Double espresso topped with hot water for a clean, bold cup.", category: "Specialty Coffee", price: 95, available: true },
  { id: 6, name: "Ceremonial Matcha Latte", description: "Stone-ground matcha whisked with fresh milk.", category: "Matcha", price: 160, available: true },
  { id: 7, name: "Strawberry Matcha", description: "Matcha layered over house-made strawberry purée and milk.", category: "Matcha", price: 175, available: false },
  { id: 8, name: "Calamansi Sparkler", description: "Fresh calamansi, honey and sparkling water. Coffee-free.", category: "Zero-Proof", price: 120, available: true },
  { id: 9, name: "Chicken Pesto Panini", description: "Grilled chicken, basil pesto and mozzarella on toasted ciabatta.", category: "Savory Bites", price: 195, available: true },
  { id: 10, name: "Truffle Carbonara", description: "Creamy carbonara with bacon, parmesan and truffle oil.", category: "Pasta", price: 245, available: true },
  { id: 11, name: "Tapa Rice Bowl", description: "Garlic rice, beef tapa, fried egg and pickled papaya.", category: "Rice", price: 220, available: true },
  { id: 12, name: "Garden Caesar Salad", description: "Romaine, parmesan, croutons and house Caesar dressing.", category: "Salad", price: 185, available: false },
];

const initialCategories = [
  "All Items",
  "Signatures",
  "Specialty Coffee",
  "Competition Artisans",
  "Milk Creations",
  "Zero-Proof",
  "Matcha",
  "Foam Series",
  "Bespokes",
  "Savory Bites",
  "Pasta",
  "Rice",
  "Salad",
  "Extras",
];

const catalogColumns =
  "lg:grid-cols-[minmax(220px,2fr)_minmax(120px,0.8fr)_100px_140px_100px]";

// The visible track stays small; the button around it gives a 44px tap area.
function AvailabilitySwitch({ checked, disabled = false, label, onToggle, className = "" }) {
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

export default function MenuManagement() {
  const [items, setItems] = useState(sampleItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Items");
  const [page, setPage] = useState(1);
  const [storeOnline, setStoreOnline] = useState(true);
  const [notice, setNotice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia(PHONE_QUERY).matches
  );

  useEffect(() => {
    const phone = window.matchMedia(PHONE_QUERY);
    const onScreenChange = (event) => {
      setIsPhone(event.matches);
      setPage(1);
    };

    phone.addEventListener("change", onScreenChange);
    return () => phone.removeEventListener("change", onScreenChange);
  }, []);

  useEffect(() => {
    if (openMenuId === null) return;

    const closeMenu = (event) => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "pointerdown" && event.target.closest("[data-row-menu]")) return;
      setOpenMenuId(null);
    };

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeMenu);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [openMenuId]);

  const query = search.trim().toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      (category === "All Items" || item.category === category) &&
      (item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query))
  );

  const pageSize = isPhone ? PHONE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filteredItems.slice(pageStart, pageStart + pageSize);

  const availableCount = storeOnline
    ? items.filter((item) => item.available).length
    : 0;

  const notify = (message) => setNotice(message);

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const toggleItem = (id) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );

  const editItem = (item) => {
    setOpenMenuId(null);
    notify(`Edit is a UI-only preview. ${item.name} was not changed.`);
  };

  const deleteItem = (item) => {
    setOpenMenuId(null);
    notify(`Delete is disabled in this preview. ${item.name} was kept.`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-3 font-['Plus_Jakarta_Sans',sans-serif] sm:space-y-6">
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-[#19244E] px-5 py-4 text-sm font-semibold text-white shadow-xl"
        >
          <CheckCircle2 size={19} className="shrink-0 text-[#E58422]" />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="ml-1 rounded-lg p-1 hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="flex flex-col gap-3 sm:gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight text-[#19244E] sm:text-3xl">
            Menu Management
          </h1>
          <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-gray-500 sm:block">
            Manage menu categories, item details, and availability for Beardista Brew.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch xl:shrink-0 xl:flex-nowrap xl:justify-end">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-1.5 shadow-sm sm:py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#E58422] sm:h-10 sm:w-10">
              <Store size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Global Availability
              </p>
              <p className={`mt-1 text-xs font-extrabold ${storeOnline ? "text-emerald-700" : "text-rose-600"}`}>
                {storeOnline ? "Store Online" : "Store Offline"}
              </p>
            </div>
            <AvailabilitySwitch
              checked={storeOnline}
              label="Toggle global store availability"
              onToggle={() => setStoreOnline((value) => !value)}
              className="ml-auto sm:ml-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-stretch">
            <button
              type="button"
              onClick={() => notify("Category creation is a UI-only preview.")}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-orange-50 sm:px-4 sm:text-sm"
            >
              <Plus size={17} className="shrink-0 text-[#E58422]" />
              Add Category
            </button>

            <button
              type="button"
              onClick={() => notify("Item creation is a UI-only preview. No item was added.")}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#E58422] px-3 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#cf7419] sm:px-4 sm:text-sm"
            >
              <Plus size={18} className="shrink-0" />
              Add New Item
            </button>
          </div>
        </div>
      </header>

      {!storeOnline && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-amber-950">
              Global store availability is paused.
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              All items show as unavailable while the store is offline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStoreOnline(true)}
            className="min-h-11 self-start rounded-xl bg-[#19244E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#253570] sm:self-auto"
          >
            Turn Store Online
          </button>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex min-w-0 items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-500">Total Menu Items</p>
            <p className="mt-1 text-2xl font-black text-[#19244E] sm:mt-2 sm:text-3xl">{items.length}</p>
            <p className="mt-1 hidden text-xs text-gray-400 sm:block">Sample items in this preview</p>
          </div>
          <div className="hidden rounded-2xl bg-[#FFF3E7] p-3.5 text-[#E58422] sm:block">
            <Coffee size={25} />
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-500">Available Items</p>
            <p className={`mt-1 text-2xl font-black sm:mt-2 sm:text-3xl ${availableCount > 0 ? "text-emerald-700" : "text-gray-500"}`}>
              {availableCount}
              <span className="text-sm font-bold text-gray-400"> of {items.length}</span>
            </p>
            <p className="mt-1 hidden text-xs text-gray-400 sm:block">Local preview state only</p>
          </div>
          <span className={`hidden rounded-full px-3 py-1.5 text-xs font-extrabold sm:inline-block ${storeOnline ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
            {storeOnline ? "Online" : "Offline"}
          </span>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-gray-200 bg-white p-3 shadow-sm sm:space-y-4 sm:p-5">
        <div className="flex gap-3 sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search by item name or description..."
              aria-label="Search menu items"
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => changeSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            aria-label="Filters"
            className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${showFilters ? "border-[#19244E] bg-[#19244E] text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#19244E]">
              Availability filter
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {availableCount} of {items.length} items are available.
              Use the availability switches to change this local preview.
            </p>
          </div>
        )}

        <div>
          <p className="mb-3 hidden text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400 sm:block">
            Browse Categories
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {initialCategories.map((item) => {
              const count =
                item === "All Items"
                  ? items.length
                  : items.filter((menuItem) => menuItem.category === item).length;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeCategory(item)}
                  aria-pressed={category === item}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition sm:min-h-0 ${
                    category === item
                      ? "bg-[#19244E] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-[#19244E]"
                  }`}
                >
                  {item}
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${category === item ? "bg-white/15 text-white" : "bg-white text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:p-5">
          <div>
            <h2 className="text-base font-extrabold text-[#19244E]">Menu Catalog</h2>
            <p className="mt-1 hidden text-xs text-gray-500 sm:block">
              Review item details and availability.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <>
            <div className={`hidden gap-4 border-b border-gray-100 bg-gray-50/80 px-6 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 lg:grid ${catalogColumns}`}>
              <span>Image & Item Name</span>
              <span>Category</span>
              <span>Price</span>
              <span className="text-center">Availability</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-gray-100">
              {pageItems.map((item) => {
                const itemAvailable = storeOnline && item.available;
                const menuOpen = openMenuId === item.id;

                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 lg:grid lg:gap-4 lg:py-3 ${catalogColumns}`}
                  >
                    <button
                      type="button"
                      onClick={() => editItem(item)}
                      aria-label={`Edit ${item.name}`}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-[#FFF3E7] text-[#B96916]">
                        <ImageIcon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-[#19244E]">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500 lg:hidden">
                          {item.category} · ₱{item.price.toFixed(2)}
                        </span>
                        <span className="mt-0.5 hidden truncate text-xs text-gray-500 lg:block">
                          {item.description}
                        </span>
                      </span>
                    </button>

                    <div className="hidden lg:block">
                      <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600">
                        {item.category}
                      </span>
                    </div>

                    <span className="hidden font-black text-[#19244E] lg:block">
                      ₱{item.price.toFixed(2)}
                    </span>

                    <div className="flex shrink-0 flex-col items-center">
                      <AvailabilitySwitch
                        checked={item.available}
                        disabled={!storeOnline}
                        label={`Toggle ${item.name} availability`}
                        onToggle={() => toggleItem(item.id)}
                      />
                      <span className={`-mt-1 hidden text-[10px] font-bold lg:block ${itemAvailable ? "text-emerald-700" : "text-gray-500"}`}>
                        {itemAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="hidden justify-end gap-2 sm:flex">
                      <button
                        type="button"
                        title={`Edit ${item.name}`}
                        aria-label={`Edit ${item.name}`}
                        onClick={() => editItem(item)}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#E58422]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Delete ${item.name}`}
                        aria-label={`Delete ${item.name}`}
                        onClick={() => deleteItem(item)}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div data-row-menu className="relative shrink-0 sm:hidden">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(menuOpen ? null : item.id)}
                        aria-label={`More actions for ${item.name}`}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 ${menuOpen ? "bg-gray-100" : ""}`}
                      >
                        <span aria-hidden="true" className="text-xl font-bold leading-none">⋮</span>
                      </button>

                      {menuOpen && (
                        <div
                          role="menu"
                          className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => editItem(item)}
                            className="flex min-h-11 w-full items-center gap-3 px-4 text-sm font-bold text-[#19244E] hover:bg-orange-50"
                          >
                            <Pencil size={16} className="text-[#E58422]" />
                            Edit
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => deleteItem(item)}
                            className="flex min-h-11 w-full items-center gap-3 px-4 text-sm font-bold text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <nav
              aria-label="Catalog pages"
              className="flex items-center justify-between gap-3 border-t border-gray-100 px-3 py-3 sm:px-6"
            >
              <p className="text-xs font-semibold text-gray-500">
                Showing {pageStart + 1}–{pageStart + pageItems.length} of {filteredItems.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white sm:px-4"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white sm:px-4"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </nav>
          </>
        ) : (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Coffee size={26} />
            </div>
            <h3 className="mt-4 font-extrabold text-[#19244E]">No items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No sample items match this search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                changeSearch("");
                changeCategory("All Items");
              }}
              className="mt-4 min-h-11 rounded-xl bg-[#19244E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#253570]"
            >
              Reset Search and Category
            </button>
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-gray-400">
        UI reconstruction only. All values are sample data; changes stay in this page's local preview state and are not saved to a database.
      </p>
    </div>
  );
}
