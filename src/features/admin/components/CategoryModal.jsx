import { useState } from "react";
import { ChevronDown, Coffee, CupSoda, ImagePlus, Leaf, UtensilsCrossed } from "lucide-react";
import ModalWrapper, { ToggleSwitch } from "./ModalWrapper";
import {
  fieldClass,
  inputClass,
  textareaClass,
  labelClass,
  cancelButtonClass,
  primaryButtonClass,
} from "./formStyles";
import { categoryGroups, toSlug } from "./categoryUtils";

const highlightColors = [
  { name: "Brand Orange", value: "#E58422" },
  { name: "Navy", value: "#19244E" },
  { name: "Emerald", value: "#059669" },
  { name: "Sky", value: "#0284C7" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Rose", value: "#E11D48" },
];

const categoryBadges = [
  { name: "coffee", label: "Coffee", icon: Coffee },
  { name: "drink", label: "Cold drink", icon: CupSoda },
  { name: "leaf", label: "Tea and matcha", icon: Leaf },
  { name: "food", label: "Food", icon: UtensilsCrossed },
];

export default function CategoryModal({
  category,
  existingNames,
  defaultPriority,
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState(() => ({
    name: category?.name ?? "",
    priority: String(category?.priority ?? defaultPriority),
    description: category?.description ?? "",
    group: category?.group ?? categoryGroups[0],
    color: category?.color ?? highlightColors[0].value,
    badge: category?.badge ?? "",
    iconImage: category?.iconImage ?? "",
    showOnMenu: category?.showOnMenu ?? true,
  }));
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);
  const slug = toSlug(form.name);

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  // Preview only: the picked file stays in the browser and is never uploaded.
   const chooseIcon = (event) => {
    const file = event.target.files[0];
    if (file) {
      setForm((current) => ({
        ...current,
        iconImage: URL.createObjectURL(file),
        iconFile: file,
        badge: "",
      }));
    }
    event.target.value = "";
  };

  const save = (status) => {
    const name = form.name.trim();

    if (!name) return setError("Category Name is required.");
    if (existingNames.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
      return setError(`"${name}" already exists.`);
    }

    onSave({
      ...form,
      name,
      slug,
      priority: Number(form.priority) || 0,
      description: form.description.trim(),
      status,
    });
  };

  const submit = (event) => {
    event.preventDefault();
    save("active");
  };

  const footer = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
      <button type="button" onClick={onCancel} className={cancelButtonClass}>
        Cancel
      </button>
      <button
        type="button"
        onClick={() => save("draft")}
        className="min-h-11 rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-bold text-[#B96916] transition hover:bg-orange-100"
      >
        Save as Draft
      </button>
      <button type="submit" form="category-form" className={`col-span-2 ${primaryButtonClass}`}>
        {category ? "Save Changes" : "Create Category"}
      </button>
    </div>
  );

  return (
    <ModalWrapper
      title={category ? "Edit Category" : "Add Category"}
      description="Group menu items so customers can browse them easily."
      footer={footer}
      onClose={onCancel}
      maxWidth="max-w-2xl"
    >
      {/* Phones show the essentials first; sm:contents lets the extra fields join the desktop grid. */}
      <form id="category-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:order-2">
          <label htmlFor="category-name" className={labelClass}>
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={form.name}
            onChange={(event) => {
              update("name", event.target.value);
              setError("");
            }}
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "category-name-error" : undefined}
            className={fieldClass({ error: Boolean(error) })}
          />
          {error && (
            <p id="category-name-error" className="mt-1.5 text-xs font-semibold text-rose-600">
              {error}
            </p>
          )}
        </div>

        <div className="sm:order-5">
          <label htmlFor="category-group" className={labelClass}>Department / Group</label>
          <select
            id="category-group"
            value={form.group}
            onChange={(event) => update("group", event.target.value)}
            className={inputClass}
          >
            {categoryGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 py-1 pl-4 pr-1 sm:order-8 sm:self-end">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#19244E]">Show on Menu</p>
            <p className="text-xs text-gray-500">
              {form.showOnMenu ? "Visible to customers" : "Hidden from customers"}
            </p>
          </div>
          <ToggleSwitch
            checked={form.showOnMenu}
            label="Show category on menu"
            onToggle={() => update("showOnMenu", !form.showOnMenu)}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowMore((value) => !value)}
          aria-expanded={showMore}
          aria-controls="category-more"
          className="flex min-h-11 items-center justify-between rounded-xl border border-dashed border-gray-200 px-4 text-sm font-bold text-[#19244E] sm:hidden"
        >
          More details
          <ChevronDown size={18} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>

        <div
          id="category-more"
          className={`${showMore ? "grid" : "hidden"} grid-cols-2 gap-4 sm:contents`}
        >
          <div className="col-span-2 sm:order-1">
            <p className={labelClass}>Category Icon</p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-orange-200 bg-[#FFF3E7] text-[#B96916] transition focus-within:ring-2 focus-within:ring-orange-200 hover:border-[#E58422]">
                {form.iconImage ? (
                  <img src={form.iconImage} alt="Category icon preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={22} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={chooseIcon}
                  aria-label="Upload category icon"
                  className="sr-only"
                />
              </label>
              <span className="text-xs font-semibold text-gray-400">or pick a badge</span>
              <div className="flex gap-1.5">
                {categoryBadges.map(({ name, label, icon: Icon }) => {
                  const selected = form.badge === name;

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, badge: name, iconImage: "", iconFile: null }))}
                      aria-pressed={selected}
                      aria-label={label}
                      title={label}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                        selected
                          ? "border-[#E58422] bg-[#FFF3E7] text-[#E58422]"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sm:order-3">
            <label htmlFor="category-slug" className={labelClass}>Slug</label>
            <input
              id="category-slug"
              type="text"
              value={slug}
              readOnly
              placeholder="auto-generated"
              className={`${fieldClass({ background: "bg-gray-100" })} cursor-default`}
            />
          </div>

          <div className="sm:order-4">
            <label htmlFor="category-priority" className={labelClass}>Sort Priority</label>
            <input
              id="category-priority"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.priority}
              onChange={(event) => update("priority", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 sm:order-6">
            <label htmlFor="category-description" className={labelClass}>Description</label>
            <textarea
              id="category-description"
              rows={2}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={textareaClass}
            />
          </div>

          <div className="col-span-2 sm:order-7 sm:col-span-1">
            <p className={labelClass}>Highlight Color</p>
            <div className="flex flex-wrap">
              {highlightColors.map(({ name, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("color", value)}
                  aria-pressed={form.color === value}
                  aria-label={name}
                  title={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span
                    style={{ backgroundColor: value }}
                    className={`h-7 w-7 rounded-full ring-offset-2 transition ${
                      form.color === value ? "ring-2 ring-[#19244E]" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}
