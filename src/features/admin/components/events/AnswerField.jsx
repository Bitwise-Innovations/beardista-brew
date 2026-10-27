import { inputClass, textareaClass } from "../formStyles";

// One registration-form question, drawn the way customers see it.
// Used by the form preview and by the participant panel (to edit answers).
export default function AnswerField({ id, question, value, onChange }) {
  const { label, type, required, help_text: helpText, options = [] } = question;
  const helpId = helpText ? `${id}-help` : undefined;
  const listValue = Array.isArray(value) ? value : value ? [value] : [];

  const labelText = (
    <>
      {label || "Untitled question"}
      {required && <span className="text-rose-500"> *</span>}
    </>
  );

  const toggleCheckbox = (option) =>
    onChange(
      listValue.includes(option)
        ? listValue.filter((entry) => entry !== option)
        : [...listValue, option]
    );

  if (type === "multiple_choice" || type === "checkboxes") {
    return (
      <fieldset aria-describedby={helpId}>
        <legend className="text-sm font-bold text-[#19244E]">{labelText}</legend>
        {helpText && <p id={helpId} className="mt-0.5 text-xs text-gray-500">{helpText}</p>}
        <div className="mt-2 space-y-1">
          {options.map((option) => (
            <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-gray-700 hover:bg-[#F8F6F3]">
              <input
                type={type === "checkboxes" ? "checkbox" : "radio"}
                name={id}
                checked={listValue.includes(option)}
                onChange={() =>
                  type === "checkboxes" ? toggleCheckbox(option) : onChange(option)
                }
                className="h-4 w-4 accent-[#E58422]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const shared = {
    id,
    value: Array.isArray(value) ? value.join(", ") : value ?? "",
    onChange: (event) => onChange(event.target.value),
    required,
    "aria-describedby": helpId,
  };

  let control;
  if (type === "paragraph") {
    control = <textarea rows={3} {...shared} className={textareaClass} />;
  } else if (type === "dropdown") {
    control = (
      <select {...shared} className={inputClass}>
        <option value="">Choose…</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  } else {
    const inputType = { date: "date", email: "email", phone: "tel" }[type] ?? "text";
    control = <input type={inputType} {...shared} className={inputClass} />;
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#19244E]">
        {labelText}
      </label>
      {helpText && <p id={helpId} className="mt-0.5 text-xs text-gray-500">{helpText}</p>}
      <div className="mt-2">{control}</div>
    </div>
  );
}
