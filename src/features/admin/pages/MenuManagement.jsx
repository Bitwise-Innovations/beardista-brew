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
  CircleCheck,
} from "lucide-react";
import ModalWrapper, { ToggleSwitch } from "../components/ModalWrapper";
import { cancelButtonClass } from "../components/formStyles";
import ItemModal from "../components/ItemModal";
import CategoryModal from "../components/CategoryModal";
import { categoryGroups, toSlug } from "../components/categoryUtils";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import { menu_items as sampleItems } from "../data/menuMockData";
import EmptyState from "../components/EmptyState";

const ALL_ITEMS = "All Items";

const [coffeeBar, nonCoffee, food] = categoryGroups;
const foodCategories = ["Savory Bites", "Pasta", "Rice", "Salad", "Extras"];
const nonCoffeeCategories = ["Zero-Proof", "Matcha"];

const initialCategories = [
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
].map((name, index) => {
  const isFood = foodCategories.includes(name);

  return {
    name,
    slug: toSlug(name),
    priority: index + 1,
    description: "",
    group: isFood ? food : nonCoffeeCategories.includes(name) ? nonCoffee : coffeeBar,
    color: "#E58422",
    badge: isFood ? "food" : "coffee",
    iconImage: "",
    showOnMenu: true,
    status: "active",
  };
});

const catalogColumns =
  "lg:grid-cols-[minmax(220px,2fr)_minmax(120px,0.8fr)_100px_140px_100px]";

export default function MenuManagement() {
  const [items, setItems] = useState(sampleItems);
  const [categories, setCategories] = useState(initialCategories);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_ITEMS);
  const [storeOnline, setStoreOnline] = useState(true);
  const [notice, setNotice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

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

  useEffect(() => {
    if (!modal) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setModal(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [modal]);

  // Archived items stay in state but leave the catalog and counts.
  const menuItems = items.filter((item) => !item.archived);
  const sortedCategories = [...categories].sort(
    (a, b) => a.priority - b.priority || a.name.localeCompare(b.name)
  );
  const selectedCategory = categories.find((entry) => entry.name === category);

  const query = search.trim().toLowerCase();
  const filteredItems = menuItems.filter(
    (item) =>
      (category === ALL_ITEMS || item.category === category) &&
      (item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query))
  );

  const pager = usePagination(filteredItems, [search, category]);
  const pageItems = pager.pageItems;

  const availableCount = storeOnline
    ? menuItems.filter((item) => item.available).length
    : 0;

  const notify = (message) => setNotice(message);
  const closeModal = () => setModal(null);

  const changeSearch = (value) => setSearch(value);
  const changeCategory = (value) => setCategory(value);

  const toggleItem = (id) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );

  const editItem = (item) => {
    setOpenMenuId(null);
    setModal({ type: "item", item });
  };

  const deleteItem = (item) => {
    setOpenMenuId(null);
    setModal({ type: "delete", item });
  };

  const saveItem = (values) => {
    const editing = modal.item;

    if (editing) {
      setItems((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...values } : item))
      );
      notify(`${values.name} was updated.`);
    } else {
      setItems((current) => [
        ...current,
        { id: Math.max(0, ...current.map((item) => item.id)) + 1, ...values },
      ]);
      notify(`${values.name} was added to the menu.`);
    }

    closeModal();
  };

  const archiveItem = () => {
    const { item: archived } = modal;
    setItems((current) =>
      current.map((item) => (item.id === archived.id ? { ...item, archived: true } : item))
    );
    notify(`${archived.name} was archived.`);
    closeModal();
  };

  const confirmDelete = () => {
    const { item: removed } = modal;
    setItems((current) => current.filter((item) => item.id !== removed.id));
    notify(`${removed.name} was deleted.`);
    closeModal();
  };

  const saveCategory = (values) => {
    const editing = modal.category;

    if (editing) {
      setCategories((current) =>
        current.map((entry) => (entry.name === editing.name ? values : entry))
      );

      // A renamed category keeps its items and stays selected.
      if (values.name !== editing.name) {
        setItems((current) =>
          current.map((item) =>
            item.category === editing.name ? { ...item, category: values.name } : item
          )
        );
        if (category === editing.name) setCategory(values.name);
      }
    } else {
      setCategories((current) => [...current, values]);
    }

    if (values.status === "draft") notify(`${values.name} was saved as a draft.`);
    else notify(`${values.name} category was ${editing ? "updated" : "created"}.`);
    closeModal();
  };

  return (
    <div className="space-y-6">
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

      {modal?.type === "item" && (
        <ItemModal
          item={modal.item}
          categories={sortedCategories.map((entry) => entry.name)}
          onCancel={closeModal}
          onSave={saveItem}
          onArchive={archiveItem}
        />
      )}

      {modal?.type === "category" && (
        <CategoryModal
          category={modal.category}
          existingNames={[ALL_ITEMS, ...categories.map((entry) => entry.name)].filter(
            (name) => name !== modal.category?.name
          )}
          defaultPriority={Math.max(0, ...categories.map((entry) => entry.priority)) + 1}
          onCancel={closeModal}
          onSave={saveCategory}
        />
      )}

      {modal?.type === "delete" && (
        <ModalWrapper
          title="Delete Item?"
          description={`${modal.item.name} will be removed from the sample menu list.`}
          onClose={closeModal}
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <button type="button" onClick={closeModal} className={cancelButtonClass}>
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </ModalWrapper>
      )}

      <PageHeader
        title="Menu Management"
        description="Manage menu categories, item details, and availability for Beardista Brew."
        actions={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-end">
          <div className="flex items-center gap-3 rounded-2xl border border-[#EAE5DF] bg-white px-4 py-1.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#E58422]">
              <Store size={18} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Global Availability
              </p>
              <p className={`mt-0.5 text-xs font-extrabold ${storeOnline ? "text-emerald-700" : "text-rose-600"}`}>
                {storeOnline ? "Store Online" : "Store Offline"}
              </p>
            </div>
            <ToggleSwitch
              checked={storeOnline}
              label="Toggle global store availability"
              onToggle={() => setStoreOnline((value) => !value)}
              className="ml-auto sm:ml-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-stretch">
            <button
              type="button"
              onClick={() => setModal({ type: "category", category: null })}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#19244E] transition hover:border-[#E58422] hover:bg-orange-50 sm:px-4 sm:text-sm"
            >
              <Plus size={17} className="shrink-0 text-[#E58422]" />
              Add Category
            </button>

            <button
              type="button"
              onClick={() => setModal({ type: "item", item: null })}
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#E58422] px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#cf7419] sm:px-4 sm:text-sm"
            >
              <Plus size={18} className="shrink-0" />
              Add New Item
            </button>
          </div>
        </div>
        }
      />

      {!storeOnline && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div>
            <p className="text-sm font-extrabold text-amber-950">
              Global store availability is paused.
            </p>
            <p className="mt-0.5 text-xs leading-5 text-amber-800">
              All items show as unavailable while the store is offline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStoreOnline(true)}
            className="min-h-11 self-start rounded-xl bg-[#19244E] px-4 py-2 text-xs font-bold text-white hover:bg-[#253570] sm:self-auto"
          >
            Turn Store Online
          </button>
        </section>
      )}

      <StatGrid columns={2}>
        <StatCard
          label="Total Menu Items"
          value={menuItems.length}
          sub={`Across ${categories.length} categories`}
          icon={Coffee}
        />
        <StatCard
          label="Available Items"
          value={`${availableCount} of ${menuItems.length}`}
          sub={storeOnline ? "Store online" : "Store offline"}
          icon={CircleCheck}
        />
      </StatGrid>

      <DataCard bodyClassName="space-y-3 p-4 sm:p-6">
        <div className="flex gap-2 sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search by item name or description..."
              aria-label="Search menu items"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#E58422] focus:bg-white focus:ring-2 focus:ring-orange-100 sm:h-10"
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
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition sm:h-10 ${showFilters ? "border-[#19244E] bg-[#19244E] text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#19244E]">
              Availability filter
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {availableCount} of {menuItems.length} items are available.
              Use the availability switches to change this local preview.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">
            {[{ name: ALL_ITEMS }, ...sortedCategories].map((entry) => {
              const count =
                entry.name === ALL_ITEMS
                  ? menuItems.length
                  : menuItems.filter((menuItem) => menuItem.category === entry.name).length;
              const selected = category === entry.name;

              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => changeCategory(entry.name)}
                  aria-pressed={selected}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition sm:min-h-8 ${
                    selected
                      ? "border-[#E58422] bg-[#FFF3E7] text-[#B96916]"
                      : "border-transparent bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-[#19244E]"
                  }`}
                >
                  {entry.color && (
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: entry.color }}
                      className="h-2 w-2 rounded-full"
                    />
                  )}
                  {entry.name}
                  {entry.status === "draft" && (
                    <span className="text-[10px] font-semibold text-gray-400">
                      Draft
                    </span>
                  )}
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-gray-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setModal({ type: "category", category: selectedCategory })}
              aria-label={`Edit ${selectedCategory.name} category`}
              title="Edit category"
              className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#E58422] sm:h-8 sm:w-8"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>
      </DataCard>

      <DataCard
        title="Menu Catalog"
        badge={
          <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-bold text-[#B96916]">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
          </span>
        }
        bodyClassName=""
        clip={false}
        footer={filteredItems.length > 0 && <Pagination {...pager} label="Catalog pages" />}
      >
        {filteredItems.length > 0 ? (
          <>
            <div className={`hidden gap-4 border-b border-gray-100 bg-gray-50/80 px-6 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 lg:grid ${catalogColumns}`}>
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
                    className={`flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 lg:grid lg:gap-4 ${catalogColumns}`}
                  >
                    <button
                      type="button"
                      onClick={() => editItem(item)}
                      aria-label={`Edit ${item.name}`}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-100 bg-[#FFF3E7] text-[#B96916]">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon size={18} />
                        )}
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
                      <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                        {item.category}
                      </span>
                    </div>

                    <span className="hidden font-black text-[#19244E] lg:block">
                      ₱{item.price.toFixed(2)}
                    </span>

                    <div className="flex shrink-0 items-center justify-center">
                      <ToggleSwitch
                        checked={item.available}
                        disabled={!storeOnline}
                        label={`Toggle ${item.name} availability`}
                        onToggle={() => toggleItem(item.id)}
                      />
                      <span className={`hidden w-16 text-[10px] font-bold lg:block ${itemAvailable ? "text-emerald-700" : "text-gray-500"}`}>
                        {itemAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="hidden justify-end gap-2 sm:flex">
                      <button
                        type="button"
                        title={`Edit ${item.name}`}
                        aria-label={`Edit ${item.name}`}
                        onClick={() => editItem(item)}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#E58422]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Delete ${item.name}`}
                        aria-label={`Delete ${item.name}`}
                        onClick={() => deleteItem(item)}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
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
          </>
        ) : (
          <EmptyState
            title={menuItems.length === 0 ? "The menu board is empty." : "Nothing on this shelf."}
            message={
              menuItems.length === 0
                ? "Add your first drink or dish with Add New Item."
                : "No items match this search or category."
            }
            action={
              menuItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    changeSearch("");
                    changeCategory(ALL_ITEMS);
                  }}
                  className="min-h-11 rounded-xl bg-[#19244E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#253570]"
                >
                  Reset Search and Category
                </button>
              )
            }
          />
        )}
      </DataCard>
    </div>
  );
}
