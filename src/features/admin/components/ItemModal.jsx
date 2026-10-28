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

const NAME_MAX = 80;
const DESCRIPTION_MAX = 500;
const FLAVOR_MAX = 100;
const ADD_ON_NAME_MAX = 40;
const PRICE_MAX = 99999;
const ADD_ON_PRICE_MAX = 9999;

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

function Counter({ value, max }) {
  return (
    <span className={`text-[11px] font-semibold ${value.length > max ? "text-rose-600" : "text-gray-400"}`}>
      {value.length}/{max}
    </span>
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

export default function ItemModal({ item, categories, saving = false, onCancel, onSave, onArchive }) {
  const [form, setForm] = useState(() => ({
    name: item?.name ?? "",
    category: item?.category ?? "",
    price: item ? String(item.price) : "",
    available: item?.available ?? true,
    description: item?.description ?? "",
    image: item?.image ?? "",
    imageFile: null,
    temperatures: item?.temperatures ?? [],
    flavor: item?.flavor ?? "",
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

  const updateAddOn = (id, field, value) => {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.map((addOn) => (addOn.id === id ? { ...addOn, [field]: value } : addOn)),
    }));
    setErrors((current) => ({ ...current, addOns: "" }));
  };

  const removeAddOn = (id) =>
    setForm((current) => ({ ...current, addOns: current.addOns.filter((addOn) => addOn.id !== id) }));

  // The picked file is uploaded when the item is saved.
  const pickImage = (file) => {
    if (!file?.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: "Image must be 5 MB or smaller." }));
      return;
    }
    setForm((current) => ({ ...current, image: URL.createObjectURL(file), imageFile: file }));
    setErrors((current) => ({ ...current, image: "" }));
  };

  const validate = () => {
    const name = form.name.trim();
    const price = Number(form.price);
    const filledAddOns = form.addOns.filter((addOn) => addOn.name.trim() || addOn.price !== "");
    const badAddOn = filledAddOns.find((addOn) => {
      const addOnPrice = addOn.price === "" ? 0 : Number(addOn.price);
      return (
        !addOn.name.trim() ||
        addOn.name.trim().length > ADD_ON_NAME_MAX ||
        Number.isNaN(addOnPrice) ||
        addOnPrice < 0 ||
        addOnPrice > ADD_ON_PRICE_MAX
      );
    });

    const next = {
      name: !name ? "Item Name is required." : name.length > NAME_MAX ? `Use ${NAME_MAX} characters or fewer.` : "",
      category: form.category ? "" : "Choose a category.",
      price:
        form.price === "" || Number.isNaN(price) || price <= 0
          ? "Enter a price greater than 0."
          : price > PRICE_MAX
            ? `Price must be ₱${PRICE_MAX.toLocaleString()} or less.`
            : "",
      description:
        form.description.trim().length > DESCRIPTION_MAX ? `Use ${DESCRIPTION_MAX} characters or fewer.` : "",
      flavor: form.flavor.trim().length > FLAVOR_MAX ? `Use ${FLAVOR_MAX} characters or fewer.` : "",
      addOns: badAddOn
        ? `Each add-on needs a name (up to ${ADD_ON_NAME_MAX} characters) and a price from 0 to ₱${ADD_ON_PRICE_MAX.toLocaleString()}.`
        : "",
    };
    setErrors(next);
    if (next.description || next.flavor || next.addOns) setShowMore(true);
    return !Object.values(next).some(Boolean);
  };

  const submit = (event) => {
    event.preventDefault();
    if (saving || !validate()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      flavor: form.flavor.trim(),
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
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
        >
          <Archive size={16} />
          Archive Item
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <button type="button" onClick={onCancel} disabled={saving} className={cancelButtonClass}>
          Cancel
        </button>
        <button
          type="submit"
          form="item-form"
          disabled={saving}
          className={`${primaryButtonClass} disabled:cursor-wait disabled:opacity-60`}
        >
          {saving ? "Saving..." : item ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ModalWrapper
        title={item ? "Edit Item" : "Add New Item"}
        description={item ? `Update the details for ${item.name}.` : "Add a new item to the menu."}
        footer={footer}
        onClose={saving ? undefined : onCancel}
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
                    <span className="text-sm font-bold text-[#19244E]">Drag an image here or click to upload</span>
                    <span className="text-xs text-gray-400">PNG or JPG, up to 5 MB</span>
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
              <FieldError id="item-image-error" message={errors.image} />
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
              <div className="flex items-center justify-between">
                <label htmlFor="item-name" className={labelClass}>
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <Counter value={form.name} max={NAME_MAX} />
              </div>
              <input
                id="item-name"
                type="text"
                value={form.name}
                maxLength={NAME_MAX + 10}
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
                  max={PRICE_MAX}
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
                <option value="unavailable">Unavailable (still shown on the menu)</option>
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
              <div className="flex items-center justify-between">
                <label htmlFor="item-description" className={labelClass}>Description</label>
                <Counter value={form.description} max={DESCRIPTION_MAX} />
              </div>
              <textarea
                id="item-description"
                rows={3}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "item-description-error" : undefined}
                className={`${textareaClass} ${errors.description ? "border-rose-400" : ""}`}
              />
              <FieldError id="item-description-error" message={errors.description} />
            </div>
          </div>

          <div id="item-more" className={`${showMore ? "block" : "hidden"} space-y-4 sm:block`}>
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
              <div className="flex items-center justify-between">
                <label htmlFor="item-flavor" className={labelClass}>Flavor Profile</label>
                <Counter value={form.flavor} max={FLAVOR_MAX} />
              </div>
              <input
                id="item-flavor"
                type="text"
                value={form.flavor}
                onChange={(event) => update("flavor", event.target.value)}
                placeholder="e.g. Nutty, caramel, cocoa"
                aria-invalid={Boolean(errors.flavor)}
                aria-describedby={errors.flavor ? "item-flavor-error" : undefined}
                className={fieldClass({ error: Boolean(errors.flavor) })}
              />
              <FieldError id="item-flavor-error" message={errors.flavor} />
            </div>

            <div>
              <p className={labelClass}>Allergen / Dietary Tags</p>
              <div className="flex flex-wrap gap-2">
                {dietaryTags.map((tag) => (
                  <TogglePill key={tag} selected={form.tags.includes(tag)} onClick={() => toggleInList("tags", tag)}>
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
                        maxLength={ADD_ON_NAME_MAX + 10}
                        onChange={(event) => updateAddOn(addOn.id, "name", event.target.value)}
                        placeholder="e.g. Extra shot"
                        aria-label={`Add-on ${index + 1} name`}
                        className={inputClass}
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max={ADD_ON_PRICE_MAX}
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
              <FieldError id="item-addons-error" message={errors.addOns} />
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, addOns: [...current.addOns, newAddOn()] }))}
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-orange-200 px-4 text-xs font-bold text-[#B96916] transition hover:bg-orange-50 sm:min-h-9"
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
          description={`${item.name} will be removed from the menu catalog and the customer menu.`}
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