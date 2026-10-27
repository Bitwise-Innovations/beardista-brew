import { useState } from "react";
import { Archive, ChevronDown, ImagePlus, Plus, Trash2 } from "lucide-react";
import ModalWrapper from "./ModalWrapper";
import {
  fieldClass,
  inputClass,
  textareaClass,
  labelClass,
  cancelButtonClass,
  primaryButtonClass,
} from "./formStyles";

const temperatureOptions = ["Hot", "Iced"];
const dietaryTags = ["Dairy", "Nuts", "Gluten", "Egg", "Soy", "Vegan", "Vegetarian", "Caffeine-Free"];

let nextAddOnId = 1;
const newAddOn = (name = "", price = "") => ({ id: nextAddOnId++, name, price });

function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1.5 text-xs font-semibold text-rose-600">
      {message}
    </p>
  );
}

function TogglePill({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-xl border px-3.5 text-xs font-bold transition sm:min-h-9 ${
        selected
          ? "border-[#19244E] bg-[#19244E] text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function ItemModal({ item, categories, onCancel, onSave, onArchive }) {
  const [form, setForm] = useState(() => ({
    name: item?.name ?? "",
    category: item?.category ?? "",
    price: item ? String(item.price) : "",
    available: item?.available ?? true,
    description: item?.description ?? "",
    image: item?.image ?? "",
    temperatures: item?.temperatures ?? [],
    flavor: item?.flavor ?? "",
    calories: item?.calories == null ? "" : String(item.calories),
    tags: item?.tags ?? [],
    addOns: (item?.addOns ?? []).map((addOn) => newAddOn(addOn.name, String(addOn.price))),
  }));
  const [errors, setErrors] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const toggleInList = (field, value) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((entry) => entry !== value)
        : [...current[field], value],
    }));

  const updateAddOn = (id, field, value) =>
    setForm((current) => ({
      ...current,
      addOns: current.addOns.map((addOn) => (addOn.id === id ? { ...addOn, [field]: value } : addOn)),
    }));

  const removeAddOn = (id) =>
    setForm((current) => ({
      ...current,
      addOns: current.addOns.filter((addOn) => addOn.id !== id),
    }));

  // Preview only: the picked file stays in the browser and is never uploaded.
  const pickImage = (file) => {
    if (!file?.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: "Image must be 5 MB or smaller." }));
      return;
    }
    setForm((current) => ({ ...current, image: URL.createObjectURL(file), imageFile: file }));
  };

  const submit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const price = Number(form.price);
    const nextErrors = {
      name: name ? "" : "Item Name is required.",
      category: form.category ? "" : "Choose a category.",
      price: form.price && price > 0 ? "" : "Enter a price greater than 0.",
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      name,
      price,
      description: form.description.trim(),
      flavor: form.flavor.trim(),
      calories: form.calories === "" ? null : Number(form.calories),
      addOns: form.addOns
        .filter((addOn) => addOn.name.trim())
        .map((addOn) => ({ name: addOn.name.trim(), price: Number(addOn.price) || 0 })),
    });
  };

  const footer = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      {item ? (
        <button
          type="button"
          onClick={() => setConfirmArchive(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
        >
          <Archive size={16} />
          Archive Item
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <button type="button" onClick={onCancel} className={cancelButtonClass}>
          Cancel
        </button>
        <button type="submit" form="item-form" className={primaryButtonClass}>
          {item ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ModalWrapper
        title={item ? "Edit Item" : "Add New Item"}
        description={item ? `Update the details for ${item.name}.` : "Add a new item to the sample menu."}
        footer={footer}
        onClose={onCancel}
        maxWidth="max-w-4xl"
      >
        <form id="item-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2 sm:gap-x-6">
          <div className="space-y-4">
            <div>
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  pickImage(event.dataTransfer.files[0]);
                }}
                className={`relative flex h-28 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed px-4 text-center transition focus-within:ring-2 focus-within:ring-orange-200 sm:h-32 ${
                  dragging ? "border-[#E58422] bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-200"
                }`}
              >
                {form.image ? (
                  <img src={form.image} alt="Item preview" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus size={24} className="text-[#E58422]" />
                    <span className="text-sm font-bold text-[#19244E]">
                      Drag an image here or click to upload
                    </span>
                    <span className="text-xs text-gray-400">PNG or JPG</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    pickImage(event.target.files[0]);
                    event.target.value = "";
                  }}
                  aria-label="Upload item image"
                  className="sr-only"
                />
              </label>
              {form.image && (
                <div className="mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, image: "", imageFile: null }))}
                    className="min-h-11 rounded-xl px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 sm:min-h-9"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="item-name" className={labelClass}>
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="item-name"
                type="text"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                autoFocus
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "item-name-error" : undefined}
                className={fieldClass({ error: Boolean(errors.name) })}
              />
              <FieldError id="item-name-error" message={errors.name} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <label htmlFor="item-category" className={labelClass}>
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="item-category"
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "item-category-error" : undefined}
                  className={fieldClass({ error: Boolean(errors.category), padding: "px-3" })}
                >
                  <option value="">Select…</option>
                  {categories.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <FieldError id="item-category-error" message={errors.category} />
              </div>

              <div className="min-w-0">
                <label htmlFor="item-price" className={labelClass}>
                  Price (₱) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="item-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => update("price", event.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "item-price-error" : undefined}
                  className={fieldClass({ error: Boolean(errors.price) })}
                />
                <FieldError id="item-price-error" message={errors.price} />
              </div>
            </div>

            <div>
              <label htmlFor="item-availability" className={labelClass}>Availability</label>
              <select
                id="item-availability"
                value={form.available ? "available" : "unavailable"}
                onChange={(event) => update("available", event.target.value === "available")}
                className={inputClass}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowMore((value) => !value)}
              aria-expanded={showMore}
              aria-controls="item-description item-more"
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-dashed border-gray-200 px-4 text-sm font-bold text-[#19244E] sm:hidden"
            >
              More details
              <ChevronDown size={18} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
            </button>

            <div className={`${showMore ? "block" : "hidden"} sm:block`}>
              <label htmlFor="item-description" className={labelClass}>Description</label>
              <textarea
                id="item-description"
                rows={3}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                className={textareaClass}
              />
            </div>
          </div>

          <div id="item-more" className={`${showMore ? "block" : "hidden"} space-y-4 sm:block`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={labelClass}>Temperature Options</p>
                <div className="flex gap-2">
                  {temperatureOptions.map((option) => (
                    <TogglePill
                      key={option}
                      selected={form.temperatures.includes(option)}
                      onClick={() => toggleInList("temperatures", option)}
                    >
                      {option}
                    </TogglePill>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="item-calories" className={labelClass}>Calories (kcal)</label>
                <input
                  id="item-calories"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={form.calories}
                  onChange={(event) => update("calories", event.target.value)}
                  className={fieldClass({ height: "h-11 sm:h-9" })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="item-flavor" className={labelClass}>Flavor Profile</label>
              <input
                id="item-flavor"
                type="text"
                value={form.flavor}
                onChange={(event) => update("flavor", event.target.value)}
                placeholder="e.g. Nutty, caramel, cocoa"
                className={inputClass}
              />
            </div>

            <div>
              <p className={labelClass}>Allergen / Dietary Tags</p>
              <div className="flex flex-wrap gap-2">
                {dietaryTags.map((tag) => (
                  <TogglePill
                    key={tag}
                    selected={form.tags.includes(tag)}
                    onClick={() => toggleInList("tags", tag)}
                  >
                    {tag}
                  </TogglePill>
                ))}
              </div>
            </div>

            <div>
              <p className={labelClass}>Add-ons</p>
              {form.addOns.length > 0 && (
                <ul className="mb-2 space-y-2">
                  {form.addOns.map((addOn, index) => (
                    <li key={addOn.id} className="grid grid-cols-[minmax(0,1fr)_96px_44px] gap-2">
                      <input
                        type="text"
                        value={addOn.name}
                        onChange={(event) => updateAddOn(addOn.id, "name", event.target.value)}
                        placeholder="e.g. Extra shot"
                        aria-label={`Add-on ${index + 1} name`}
                        className={inputClass}
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={addOn.price}
                        onChange={(event) => updateAddOn(addOn.id, "price", event.target.value)}
                        placeholder="+₱0"
                        aria-label={`Add-on ${index + 1} extra price`}
                        className={fieldClass({ padding: "px-3" })}
                      />
                      <button
                        type="button"
                        onClick={() => removeAddOn(addOn.id)}
                        aria-label={`Remove add-on ${index + 1}`}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, addOns: [...current.addOns, newAddOn()] }))}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-orange-200 px-4 text-xs font-bold text-[#B96916] transition hover:bg-orange-50 sm:min-h-9"
              >
                <Plus size={15} />
                Add Add-on
              </button>
            </div>
          </div>
        </form>
      </ModalWrapper>

      {confirmArchive && (
        <ModalWrapper
          title="Archive this item?"
          description={`${item.name} will be removed from the menu catalog.`}
          onClose={() => setConfirmArchive(false)}
        >
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <button type="button" onClick={() => setConfirmArchive(false)} className={cancelButtonClass}>
              Cancel
            </button>
            <button
              type="button"
              onClick={onArchive}
              className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-rose-700"
            >
              Archive
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}
