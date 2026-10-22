import {
  ArrowDown,
  ArrowUp,
  CheckSquare,
  ChevronDown,
  Circle,
  Copy,
  GripVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { ToggleSwitch } from "../ModalWrapper";
import { inputClass } from "../formStyles";
import { CHOICE_TYPES, QUESTION_TYPES } from "./eventUtils";

const iconButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-[#19244E] disabled:cursor-not-allowed disabled:opacity-30";

const optionIcons = {
  multiple_choice: Circle,
  checkboxes: CheckSquare,
  dropdown: ChevronDown,
};

// One question in the builder. Collapsed it shows a summary; tapped it opens for editing.
export default function QuestionCard({
  question,
  index,
  total,
  active,
  dragOver,
  dragProps,
  onArmDrag,
  onActivate,
  onChange,
  onDuplicate,
  onDelete,
  onMove,
}) {
  const isChoice = CHOICE_TYPES.includes(question.type);
  const OptionIcon = optionIcons[question.type];

  const changeType = (type) => {
    const needsOptions = CHOICE_TYPES.includes(type);
    onChange({
      type,
      options: needsOptions
        ? question.options.length
          ? question.options
          : ["Option 1"]
        : [],
    });
  };

  const updateOption = (optionIndex, value) =>
    onChange({
      options: question.options.map((option, i) => (i === optionIndex ? value : option)),
    });

  const handle = (
    <button
      type="button"
      onPointerDown={onArmDrag}
      aria-label={`Drag to reorder question ${index + 1}`}
      title="Drag to reorder"
      className="hidden h-11 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 active:cursor-grabbing sm:flex"
    >
      <GripVertical size={18} />
    </button>
  );

  return (
    <li
      {...dragProps}
      className={`rounded-2xl border bg-white shadow-sm transition ${
        active ? "border-[#EAE5DF] border-l-4 border-l-[#E58422]" : "border-[#EAE5DF]"
      } ${dragOver ? "ring-2 ring-[#E58422] ring-offset-2" : ""}`}
    >
      {!active ? (
        <div className="flex items-start gap-1 p-2 sm:p-3">
          {handle}
          <button
            type="button"
            onClick={onActivate}
            className="min-h-11 min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left hover:bg-[#F8F6F3]"
          >
            <span className="block text-sm font-bold text-[#19244E]">
              {question.label || "Untitled question"}
              {question.required && <span className="text-rose-500"> *</span>}
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              {QUESTION_TYPES[question.type]}
              {isChoice && ` · ${question.options.length} options`}
              {question.help_text && ` · ${question.help_text}`}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 p-3 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex min-w-0 flex-1 items-start gap-1">
              {handle}
              <input
                value={question.label}
                onChange={(event) => onChange({ label: event.target.value })}
                placeholder="Question"
                aria-label="Question text"
                autoFocus={!question.label}
                className={`${inputClass} font-semibold`}
              />
            </div>
            <select
              value={question.type}
              onChange={(event) => changeType(event.target.value)}
              aria-label="Question type"
              className={`${inputClass} sm:w-48`}
            >
              {Object.entries(QUESTION_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <input
            value={question.help_text}
            onChange={(event) => onChange({ help_text: event.target.value })}
            placeholder="Help text (optional)"
            aria-label="Help text"
            className={inputClass}
          />

          {isChoice && (
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  {question.type === "dropdown" ? (
                    <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">
                      {optionIndex + 1}.
                    </span>
                  ) : (
                    <OptionIcon size={18} className="w-5 shrink-0 text-gray-300" />
                  )}
                  <input
                    value={option}
                    onChange={(event) => updateOption(optionIndex, event.target.value)}
                    aria-label={`Option ${optionIndex + 1}`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ options: question.options.filter((_, i) => i !== optionIndex) })
                    }
                    disabled={question.options.length === 1}
                    aria-label={`Remove option ${optionIndex + 1}`}
                    className={iconButtonClass}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({ options: [...question.options, `Option ${question.options.length + 1}`] })
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-[#E58422] hover:bg-[#FFF3E7]"
              >
                <Plus size={16} />
                Add option
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFEAE4] pt-3">
            <div className="flex">
              <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move question up" title="Move up" className={iconButtonClass}>
                <ArrowUp size={17} />
              </button>
              <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move question down" title="Move down" className={iconButtonClass}>
                <ArrowDown size={17} />
              </button>
              <button type="button" onClick={onDuplicate} aria-label="Duplicate question" title="Duplicate" className={iconButtonClass}>
                <Copy size={17} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete question"
                title="Delete"
                className={`${iconButtonClass} hover:bg-rose-50 hover:text-rose-600`}
              >
                <Trash2 size={17} />
              </button>
            </div>

            <div className="flex items-center gap-1 border-l border-[#EFEAE4] pl-3">
              <span className="text-sm font-semibold text-gray-600">Required</span>
              <ToggleSwitch
                checked={question.required}
                label="Required question"
                onToggle={() => onChange({ required: !question.required })}
              />
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
