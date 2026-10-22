import { useState } from "react";
import { Lock, Plus } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { nextId, sortQuestions } from "./eventUtils";

// Shown at the top of every form; they cannot be edited or removed.
const LOCKED_FIELDS = ["Full name", "Email"];

// Questions for one participant type. Drag the handle (or use the arrows) to reorder.
export default function FormBuilder({ typeId, questions, setQuestions, notify }) {
  const [activeId, setActiveId] = useState(null);
  const [armedId, setArmedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const typeQuestions = sortQuestions(
    questions.filter((question) => question.participant_type_id === typeId)
  );

  // Saves the new order as sort_order 1, 2, 3… Extra rows (a duplicate) are added at the same time.
  const saveOrder = (ordered, extraRows = []) => {
    const position = new Map(ordered.map((question, index) => [question.id, index + 1]));
    setQuestions((all) =>
      [...all, ...extraRows].map((question) =>
        position.has(question.id) ? { ...question, sort_order: position.get(question.id) } : question
      )
    );
  };

  const updateQuestion = (id, changes) =>
    setQuestions((all) =>
      all.map((question) => (question.id === id ? { ...question, ...changes } : question))
    );

  const addQuestion = () => {
    const id = nextId(questions);
    setQuestions((all) => [
      ...all,
      {
        id,
        participant_type_id: typeId,
        label: "",
        type: "short_answer",
        required: false,
        help_text: "",
        options: [],
        sort_order: typeQuestions.length + 1,
      },
    ]);
    setActiveId(id);
  };

  const duplicateQuestion = (question) => {
    const copy = { ...question, id: nextId(questions), label: `${question.label} (copy)`, options: [...question.options] };
    const ordered = [...typeQuestions];
    ordered.splice(ordered.findIndex((entry) => entry.id === question.id) + 1, 0, copy);
    saveOrder(ordered, [copy]);
    setActiveId(copy.id);
  };

  const deleteQuestion = (question) => {
    setQuestions((all) => all.filter((entry) => entry.id !== question.id));
    notify(`“${question.label || "Untitled question"}” was deleted.`);
  };

  const moveTo = (fromId, toIndex) => {
    const ordered = [...typeQuestions];
    const fromIndex = ordered.findIndex((entry) => entry.id === fromId);
    if (fromIndex === -1 || toIndex < 0 || toIndex >= ordered.length) return;
    const [moved] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, moved);
    saveOrder(ordered);
  };

  const clearDrag = () => {
    setArmedId(null);
    setDragId(null);
    setOverId(null);
  };

  // Native drag and drop; the card only becomes draggable while its handle is pressed,
  // so selecting text inside the inputs still works.
  const dragPropsFor = (question, index) => ({
    draggable: armedId === question.id,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(question.id));
      setDragId(question.id);
    },
    onDragOver: (event) => {
      if (dragId === null) return;
      event.preventDefault();
      if (overId !== question.id) setOverId(question.id);
    },
    onDrop: (event) => {
      event.preventDefault();
      if (dragId !== null && dragId !== question.id) moveTo(dragId, index);
      clearDrag();
    },
    onDragEnd: clearDrag,
  });

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {LOCKED_FIELDS.map((label) => (
          <li
            key={label}
            className="flex min-h-11 items-center gap-3 rounded-2xl border border-dashed border-[#EAE5DF] bg-[#F8F6F3] px-4 py-3"
          >
            <Lock size={16} className="shrink-0 text-gray-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#19244E]">
                {label} <span className="text-rose-500">*</span>
              </p>
              <p className="text-xs text-gray-500">Always included · cannot be removed</p>
            </div>
          </li>
        ))}
      </ul>

      {typeQuestions.length > 0 && (
        <ol className="space-y-3" onPointerUp={() => setArmedId(null)}>
          {typeQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              total={typeQuestions.length}
              active={activeId === question.id}
              dragOver={overId === question.id && dragId !== question.id}
              dragProps={dragPropsFor(question, index)}
              onArmDrag={() => setArmedId(question.id)}
              onActivate={() => setActiveId(question.id)}
              onChange={(changes) => updateQuestion(question.id, changes)}
              onDuplicate={() => duplicateQuestion(question)}
              onDelete={() => deleteQuestion(question)}
              onMove={(direction) => moveTo(question.id, index + direction)}
            />
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={addQuestion}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 text-sm font-bold text-[#E58422] transition hover:bg-[#FFF3E7]"
      >
        <Plus size={18} />
        Add question
      </button>
    </div>
  );
}
