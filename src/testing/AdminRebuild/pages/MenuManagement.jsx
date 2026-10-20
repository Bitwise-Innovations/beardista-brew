import { useMemo, useState } from "react";
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
} from "lucide-react";

const initialDrink = {
  id: 1,
  name: "Iced Latte",
  description: "Espresso blended with chilled milk over ice.",
  category: "Coffee",
  price: 110,
};

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
  "Coffee",
];

export default function MenuManagement() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Items");
  const [available, setAvailable] = useState(true);
  const [storeOnline, setStoreOnline] = useState(true);
  const [notice, setNotice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (
      (initialDrink.name.toLowerCase().includes(query) ||
        initialDrink.description.toLowerCase().includes(query)) &&
      (category === "All Items" || category === initialDrink.category)
    );
  }, [search, category]);

  const itemAvailable = storeOnline && available;

  const notify = (message) => setNotice(message);

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
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

      <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#E58422]">
              Store Management
            </span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#B96916]">
              UI Preview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-[#19244E] sm:text-3xl">
              Menu Management
            </h1>
            <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-extrabold text-[#B96916]">
              1 Sample Item
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage menu categories, item details, and availability for Beardista Brew.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#E58422]">
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
            <button
              type="button"
              role="switch"
              aria-checked={storeOnline}
              aria-label="Toggle global store availability"
              onClick={() => setStoreOnline((value) => !value)}
              className={`relative ml-1 h-6 w-11 shrink-0 rounded-full transition-colors ${storeOnline ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${storeOnline ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => notify("Category creation is a UI-only preview.")}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-orange-50"
          >
            <Plus size={17} className="text-[#E58422]" />
            Add Category
          </button>

          <button
            type="button"
            onClick={() => notify("This preview is limited to one sample drink. No item was added.")}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#E58422] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#cf7419]"
          >
            <Plus size={18} />
            Add New Item
          </button>
        </div>
      </header>

      {!storeOnline && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-amber-950">
              Global store availability is paused.
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              The sample item is currently unavailable while the store is offline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStoreOnline(true)}
            className="self-start rounded-xl bg-[#19244E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#253570] sm:self-auto"
          >
            Turn Store Online
          </button>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-bold text-gray-500">Total Menu Items</p>
            <p className="mt-2 text-3xl font-black text-[#19244E]">1</p>
            <p className="mt-1 text-xs text-gray-400">One sample item in this preview</p>
          </div>
          <div className="rounded-2xl bg-[#FFF3E7] p-3.5 text-[#E58422]">
            <Coffee size={25} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-bold text-gray-500">Sample Item Status</p>
            <p className={`mt-2 text-xl font-black ${itemAvailable ? "text-emerald-700" : "text-gray-500"}`}>
              {itemAvailable ? "Available" : "Unavailable"}
            </p>
            <p className="mt-1 text-xs text-gray-400">Local preview state only</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${itemAvailable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
            {itemAvailable ? "Online" : "Offline"}
          </span>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by item name or description..."
              aria-label="Search menu items"
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
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
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${showFilters ? "border-[#19244E] bg-[#19244E] text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#19244E]">
              Availability filter
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Sample item status: {itemAvailable ? "Available" : "Unavailable"}.
              Use the availability switches to change this local preview.
            </p>
          </div>
        )}

        <div>
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
            Browse Categories
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {initialCategories.map((item) => {
              const count =
                item === "All Items" || item === initialDrink.category ? 1 : 0;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
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

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#19244E]">Menu Catalog</h2>
            <p className="mt-1 text-xs text-gray-500">
              Review item details and availability.
            </p>
          </div>
          <span className="self-start rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 sm:self-auto">
            {matches ? "1 item shown" : "0 items shown"}
          </span>
        </div>

        {matches ? (
          <>
            <div className="hidden grid-cols-[minmax(220px,2fr)_minmax(120px,0.8fr)_100px_140px_100px] gap-4 border-b border-gray-100 bg-gray-50/80 px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 lg:grid">
              <span>Image & Item Name</span>
              <span>Category</span>
              <span>Price</span>
              <span className="text-center">Availability</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(220px,2fr)_minmax(120px,0.8fr)_100px_140px_100px] lg:items-center lg:gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-[#FFF3E7] text-[#B96916]">
                  <ImageIcon size={27} />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-[#19244E]">{initialDrink.name}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {initialDrink.description}
                  </p>
                  <span className="mt-2 inline-flex rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-bold text-[#B96916] lg:hidden">
                    {initialDrink.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between lg:block">
                <span className="text-xs text-gray-400 lg:hidden">Category</span>
                <span className="hidden rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 lg:inline-flex">
                  {initialDrink.category}
                </span>
              </div>

              <div className="flex items-center justify-between lg:block">
                <span className="text-xs text-gray-400 lg:hidden">Price</span>
                <span className="font-black text-[#19244E]">
                  ₱{initialDrink.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between lg:justify-center lg:gap-2">
                <span className="text-xs text-gray-400 lg:hidden">Availability</span>
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={available}
                    aria-label="Toggle Iced Latte availability"
                    disabled={!storeOnline}
                    onClick={() => setAvailable((value) => !value)}
                    className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${available ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${available ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className={`text-[10px] font-bold ${itemAvailable ? "text-emerald-700" : "text-gray-500"}`}>
                    {itemAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 lg:border-0 lg:pt-0">
                <button
                  type="button"
                  title="Edit sample item"
                  aria-label="Edit sample item"
                  onClick={() => notify("Edit is a UI-only preview. No item details were changed.")}
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#E58422]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  title="Delete sample item"
                  aria-label="Delete sample item"
                  onClick={() => notify("Delete is disabled in this preview. The sample item was kept.")}
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
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
                setSearch("");
                setCategory("All Items");
              }}
              className="mt-4 rounded-xl bg-[#19244E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#253570]"
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
