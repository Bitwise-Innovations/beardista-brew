import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Star,
  Archive,
  X,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import ModalWrapper from "../components/ModalWrapper";
import {
  fieldClass,
  labelClass,
  cancelButtonClass,
  primaryButtonClass,
} from "../components/formStyles";
import PageHeader from "../components/PageHeader";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import EmptyState from "../components/EmptyState";

const initialFeedback = [
  { id: 1, name: "Alex Morgan", date: "Oct 20, 2026", visitFrequency: "Regular", rating: 5, comment: "Great coffee and a comfortable place to study!", preference: "Iced Latte", syncToVoice: true },
  { id: 2, name: "Jamie Santos", date: "Oct 19, 2026", visitFrequency: "Weekly", rating: 5, comment: "Friendly staff and consistently delicious drinks.", preference: "Caramel Macchiato", syncToVoice: false },
  { id: 3, name: "Taylor Reyes", date: "Oct 18, 2026", visitFrequency: "First visit", rating: 4, comment: "Nice atmosphere. I would love to visit again!", preference: "Spanish Latte", syncToVoice: true },
  { id: 4, name: "Bianca Cruz", date: "Oct 18, 2026", visitFrequency: "Weekly", rating: 5, comment: "The latte art throwdown was so fun to watch.", preference: "Spanish Latte", syncToVoice: true },
  { id: 5, name: "Miguel Navarro", date: "Oct 17, 2026", visitFrequency: "Regular", rating: 4, comment: "Pour-over was excellent. Seating fills up fast after 6 PM.", preference: "Pour-Over Ethiopia", syncToVoice: true },
  { id: 6, name: "Sofia Lim", date: "Oct 16, 2026", visitFrequency: "First visit", rating: 5, comment: "Loved the strawberry matcha. Very pretty too!", preference: "Strawberry Matcha", syncToVoice: false },
  { id: 7, name: "Carlo Mendoza", date: "Oct 15, 2026", visitFrequency: "Weekly", rating: 3, comment: "Good drinks, but the music was a bit loud for working.", preference: "Americano", syncToVoice: true },
  { id: 8, name: "Patricia Uy", date: "Oct 14, 2026", visitFrequency: "Regular", rating: 5, comment: "Truffle carbonara is my comfort food now.", preference: "Truffle Carbonara", syncToVoice: true },
  { id: 9, name: "Ramon dela Cruz", date: "Oct 13, 2026", visitFrequency: "Monthly", rating: 4, comment: "Menu QR was easy to use. Would love more pastries.", preference: "Iced Latte", syncToVoice: false },
  { id: 10, name: "Andrea Villanueva", date: "Oct 12, 2026", visitFrequency: "Weekly", rating: 5, comment: "Calamansi Sparkler is perfect on a hot afternoon.", preference: "Calamansi Sparkler", syncToVoice: true },
  { id: 11, name: "Kevin Tan", date: "Oct 11, 2026", visitFrequency: "First visit", rating: 4, comment: "Cozy place and fast Wi-Fi.", preference: "Beardista Signature Brew", syncToVoice: true },
  { id: 12, name: "Isabel Garcia", date: "Oct 10, 2026", visitFrequency: "Regular", rating: 5, comment: "Staff remembered my usual order. Small thing, big smile.", preference: "Ceremonial Matcha Latte", syncToVoice: true },
];

const ratings = [
  { label: "5 Stars (Exceptional)", percent: 78, count: 300, color: "bg-emerald-500" },
  { label: "4 Stars (Very Good)", percent: 16, count: 62, color: "bg-[#E58422]" },
  { label: "3 Stars (Average)", percent: 4, count: 15, color: "bg-amber-400" },
  { label: "2 Stars (Needs Polish)", percent: 1.5, count: 5, color: "bg-orange-300" },
  { label: "1 Star (Unsatisfied)", percent: 0.5, count: 2, color: "bg-rose-500" },
];

const audience = [
  { label: "University / Students", percent: 45, color: "#19244E" },
  { label: "Young Professionals", percent: 35, color: "#E58422" },
  { label: "Neighborhood Regulars", percent: 20, color: "#F6AD55" },
];

const weeklyVisits = [
  { label: "Week 1", range: "Oct 1–7", visits: 7240 },
  { label: "Week 2", range: "Oct 8–14", visits: 8610 },
  { label: "Week 3", range: "Oct 15–21", visits: 7900 },
  { label: "Week 4", range: "Oct 22–28", visits: 11170 },
];

const CHART_WIDTH = 500;
const CHART_HEIGHT = 180;
const CHART_MAX = 12000;

// Each point sits in the middle of its week column so it lines up with the label below.
const chartPoints = weeklyVisits.map((week, index) => ({
  ...week,
  x: (CHART_WIDTH / weeklyVisits.length) * (index + 0.5),
  y: CHART_HEIGHT - 10 - (week.visits / CHART_MAX) * (CHART_HEIGHT - 30),
}));

// Smooth curve that passes exactly through every point (Catmull-Rom turned into cubic curves).
function smoothPath(points) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x} ${point.y}`;

    const start = points[index - 1];
    const before = points[index - 2] ?? start;
    const after = points[index + 1] ?? point;
    const c1x = start.x + (point.x - before.x) / 6;
    const c1y = start.y + (point.y - before.y) / 6;
    const c2x = point.x - (after.x - start.x) / 6;
    const c2y = point.y - (after.y - start.y) / 6;

    return `${path} C${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}`;
  }, "");
}

const linePath = smoothPath(chartPoints);
const areaPath = `${linePath} L${chartPoints.at(-1).x} ${CHART_HEIGHT} L${chartPoints[0].x} ${CHART_HEIGHT} Z`;

const questionTypes = {
  choice: "Multiple choice",
  rating: "Rating 1-5",
  text: "Short text",
};

const initialQuestions = [
  { id: 1, type: "rating", text: "How would you rate your visit today?", options: [] },
  { id: 2, type: "choice", text: "How often do you visit Beardista Brew?", options: ["First visit", "Weekly", "Regular"] },
  { id: 3, type: "text", text: "What should we add to the menu next?", options: [] },
];

let nextSurveyId = 100;
const newSurveyId = () => nextSurveyId++;

function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400 sm:text-[11px]">
      {children}
    </span>
  );
}


function VisitsChart() {
  const summary = weeklyVisits
    .map((week) => `${week.label} ${week.visits.toLocaleString()}`)
    .join(", ");

  return (
    <div className="mt-4">
      {/* The SVG stretches to fit, so the dots are HTML placed by percentage to stay round and on the line. */}
      <div className="relative h-40 w-full sm:h-48">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Sample digital visits per week: ${summary}`}
        >
          <defs>
            <linearGradient id="analyticsVisitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E58422" stopOpacity=".3" />
              <stop offset="100%" stopColor="#E58422" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 80, 130].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={CHART_WIDTH}
              y2={y}
              stroke="#E5E7EB"
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={areaPath} fill="url(#analyticsVisitGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#E58422"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {chartPoints.map((point) => (
          <span
            key={point.label}
            aria-hidden="true"
            title={`${point.label}: ${point.visits.toLocaleString()} visits`}
            style={{
              left: `${(point.x / CHART_WIDTH) * 100}%`,
              top: `${(point.y / CHART_HEIGHT) * 100}%`,
            }}
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#19244E] shadow"
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 border-t border-gray-100 pt-3 text-center text-[10px] font-semibold text-gray-400 sm:text-[11px]">
        {weeklyVisits.map((week) => (
          <span key={week.label}>
            {week.label}
            <span className="hidden sm:inline"> · {week.range}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const DONUT_CIRCUMFERENCE = 2 * Math.PI * 38;

// Each slice starts where the previous slices end.
const audienceSlices = audience.map((item, index) => ({
  ...item,
  dash: (DONUT_CIRCUMFERENCE * item.percent) / 100,
  offset: -audience
    .slice(0, index)
    .reduce((sum, previous) => sum + (DONUT_CIRCUMFERENCE * previous.percent) / 100, 0),
}));

function DemographicsChart() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative my-4 h-32 w-32 sm:h-36 sm:w-36">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {audienceSlices.map((item) => (
            <circle
              key={item.label}
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={item.color}
              strokeWidth="15"
              strokeDasharray={`${item.dash} ${DONUT_CIRCUMFERENCE - item.dash}`}
              strokeDashoffset={item.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-xl font-black text-[#19244E]">1,428</strong>
          <span className="text-[9px] font-bold uppercase text-gray-400">Daily average</span>
        </div>
      </div>

      <div className="w-full space-y-2.5 border-t border-gray-100 pt-3">
        {audience.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <strong className="text-[#19244E]">{item.percent}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconButton({ label, onClick, disabled = false, danger = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9 ${
        danger ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-gray-100 hover:text-[#19244E]"
      }`}
    >
      {children}
    </button>
  );
}

function QuestionEditor({ question, onCancel, onSave }) {
  const [type, setType] = useState(question?.type ?? "choice");
  const [text, setText] = useState(question?.text ?? "");
  const [options, setOptions] = useState(() =>
    (question?.options.length ? question.options : ["", ""]).map((option) => ({
      id: newSurveyId(),
      text: option,
    }))
  );
  const [error, setError] = useState("");

  const updateOption = (id, value) =>
    setOptions((current) => current.map((option) => (option.id === id ? { ...option, text: value } : option)));

  const submit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    const filled = options.map((option) => option.text.trim()).filter(Boolean);

    if (!trimmed) return setError("Enter the question.");
    if (type === "choice" && filled.length < 2) return setError("Add at least 2 answer options.");

    onSave({
      id: question?.id ?? newSurveyId(),
      type,
      text: trimmed,
      options: type === "choice" ? filled : [],
    });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3 rounded-2xl border-2 border-orange-200 bg-orange-50/40 p-3 sm:p-4">
      <div>
        <p className={labelClass}>Question type</p>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(questionTypes).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              aria-pressed={type === value}
              className={`min-h-11 rounded-xl border px-2 text-xs font-bold transition sm:min-h-9 ${
                type === value
                  ? "border-[#19244E] bg-[#19244E] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="question-text" className={labelClass}>Question</label>
        <input
          id="question-text"
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
          autoFocus
          className={fieldClass({ background: "bg-white" })}
        />
      </div>

      {type === "choice" && (
        <div>
          <p className={labelClass}>Answer options</p>
          <ul className="space-y-2">
            {options.map((option, index) => (
              <li key={option.id} className="flex gap-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(event) => {
                    updateOption(option.id, event.target.value);
                    setError("");
                  }}
                  placeholder={`Option ${index + 1}`}
                  aria-label={`Option ${index + 1}`}
                  className={fieldClass({ background: "bg-white" })}
                />
                <button
                  type="button"
                  onClick={() => setOptions((current) => current.filter((entry) => entry.id !== option.id))}
                  disabled={options.length <= 2}
                  aria-label={`Remove option ${index + 1}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOptions((current) => [...current, { id: newSurveyId(), text: "" }])}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-orange-200 bg-white px-4 text-xs font-bold text-[#B96916] transition hover:bg-orange-50 sm:min-h-9"
          >
            <Plus size={15} />
            Add option
          </button>
        </div>
      )}

      {type === "rating" && (
        <div>
          <p className={labelClass}>Customers pick a score</p>
          <div aria-hidden="true" className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((score) => (
              <span key={score} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-500">
                {score}
              </span>
            ))}
          </div>
        </div>
      )}

      {type === "text" && (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-xs text-gray-400">
          Customers type a short answer.
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <button type="button" onClick={onCancel} className={cancelButtonClass}>
          Cancel
        </button>
        <button type="submit" className={primaryButtonClass}>
          {question ? "Update Question" : "Add Question"}
        </button>
      </div>
    </form>
  );
}

function SurveyBuilderModal({ questions, onCancel, onSave }) {
  const [draft, setDraft] = useState(questions);
  // A question id, "new" for the add form, or null when nothing is being edited.
  const [editingId, setEditingId] = useState(null);
  const busy = editingId !== null;

  const move = (index, step) =>
    setDraft((current) => {
      const next = [...current];
      const [question] = next.splice(index, 1);
      next.splice(index + step, 0, question);
      return next;
    });

  const saveQuestion = (question) => {
    setDraft((current) =>
      editingId === "new"
        ? [...current, question]
        : current.map((entry) => (entry.id === question.id ? question : entry))
    );
    setEditingId(null);
  };

  const footer = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
      <button type="button" onClick={onCancel} className={cancelButtonClass}>
        Cancel
      </button>
      <button
        type="button"
        onClick={() => onSave(draft)}
        disabled={busy}
        title={busy ? "Finish the open question first" : undefined}
        className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Save Survey
      </button>
    </div>
  );

  return (
    <ModalWrapper
      title="Survey Builder"
      description="Build the short survey customers fill in after their visit."
      footer={footer}
      onClose={onCancel}
      maxWidth="max-w-2xl"
    >
      {draft.length === 0 && editingId !== "new" && (
        <p className="mb-3 rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          No questions yet. Add one to start.
        </p>
      )}

      <ol className="space-y-2">
        {draft.map((question, index) =>
          editingId === question.id ? (
            <li key={question.id}>
              <QuestionEditor
                question={question}
                onCancel={() => setEditingId(null)}
                onSave={saveQuestion}
              />
            </li>
          ) : (
            <li
              key={question.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#19244E] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#19244E]">{question.text}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    <span className="font-semibold text-[#B96916]">{questionTypes[question.type]}</span>
                    {question.type === "choice" && ` · ${question.options.join(", ")}`}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 justify-end gap-0.5">
                <IconButton label="Move up" onClick={() => move(index, -1)} disabled={busy || index === 0}>
                  <ArrowUp size={16} />
                </IconButton>
                <IconButton label="Move down" onClick={() => move(index, 1)} disabled={busy || index === draft.length - 1}>
                  <ArrowDown size={16} />
                </IconButton>
                <IconButton label="Edit question" onClick={() => setEditingId(question.id)} disabled={busy}>
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  label="Delete question"
                  onClick={() => setDraft((current) => current.filter((entry) => entry.id !== question.id))}
                  disabled={busy}
                  danger
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </li>
          )
        )}
      </ol>

      <div className="mt-3">
        {editingId === "new" ? (
          <QuestionEditor onCancel={() => setEditingId(null)} onSave={saveQuestion} />
        ) : (
          <button
            type="button"
            onClick={() => setEditingId("new")}
            disabled={busy}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-200 text-sm font-bold text-[#B96916] transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Question
          </button>
        )}
      </div>
    </ModalWrapper>
  );
}

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("30d");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [questions, setQuestions] = useState(initialQuestions);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // The open response lives in the link (?response=1) so notifications can open it.
  const selectedResponse = feedback.find(
    (item) => String(item.id) === searchParams.get("response")
  );

  const feedbackPager = usePagination(feedback);
  const pageFeedback = feedbackPager.pageItems;

  function openResponse(id) {
    setSearchParams({ response: String(id) });
  }

  function closeResponse() {
    setSearchParams({}, { replace: true });
  }

  useEffect(() => {
    if (!selectedResponse) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSearchParams({}, { replace: true });
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedResponse, setSearchParams]);

  useEffect(() => {
    if (!surveyOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSurveyOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [surveyOpen]);

  function toggleFeedback(id) {
    setFeedback((items) =>
      items.map((item) =>
        item.id === id ? { ...item, syncToVoice: !item.syncToVoice } : item
      )
    );
  }

  function archiveFeedback(item) {
    setFeedback((items) => items.filter((entry) => entry.id !== item.id));
    setNotice(`Feedback from ${item.name} was archived.`);
  }

  function saveSurvey(nextQuestions) {
    setQuestions(nextQuestions);
    setSurveyOpen(false);
    setNotice(`Survey saved with ${nextQuestions.length} ${nextQuestions.length === 1 ? "question" : "questions"}.`);
  }

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

      <PageHeader
        title="Analytics & Customer Reports"
        description="Review sample visitor trends, customer satisfaction, and feedback."
        actions={
        <>
          <div className="flex rounded-xl border border-[#EAE5DF] bg-white p-1 shadow-sm">
            {[
              { value: "7d", label: "7 Days" },
              { value: "30d", label: "30 Days" },
              { value: "90d", label: "Quarterly" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeframe(option.value)}
                aria-pressed={timeframe === option.value}
                className={`min-h-11 rounded-lg px-3 text-[11px] font-bold transition sm:min-h-9 sm:text-xs ${
                  timeframe === option.value
                    ? "bg-[#FFF3E7] text-[#B96916]"
                    : "text-gray-500 hover:text-[#19244E]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSurveyOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#E58422] px-4 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#d47414]"
          >
            <ClipboardList size={15} />
            Survey Builder
          </button>
        </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DataCard
          className="min-w-0 xl:col-span-2"
          title="Total Digital Visits"
          description={`${timeframe === "7d" ? "Last 7 days" : timeframe === "30d" ? "October 2026" : "Quarterly overview"} · Sample data`}
          badge={
            <div className="text-right">
              <p className="font-display text-xl font-bold text-[#19244E] sm:text-2xl">34,920</p>
              <p className="mt-0.5 text-xs font-bold text-emerald-600">↗ 14.2% MoM</p>
            </div>
          }
        >
          <VisitsChart />
        </DataCard>

        <DataCard className="min-w-0" title="Visitor Demographics">
          <DemographicsChart />
        </DataCard>
      </div>

      <DataCard
        title="Customer Experience Rating Distribution"
        description="Ratings from 1 to 5 stars · Sample data"
        badge={
          <span className="inline-block rounded-xl bg-[#FFF3E7] px-3 py-2 text-xs font-bold text-[#B96916]">
            Avg 4.85 / 5
          </span>
        }
      >
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating.label} className="flex items-center gap-2 sm:gap-4">
              <span className="w-28 shrink-0 text-[10px] font-bold text-gray-600 sm:w-40 sm:text-xs">
                {rating.label}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${rating.color}`}
                  style={{ width: `${rating.percent}%` }}
                />
              </div>
              <span className="w-[68px] shrink-0 text-right text-[10px] font-extrabold text-gray-700 sm:text-xs">
                {rating.percent}% ({rating.count})
              </span>
            </div>
          ))}
        </div>
      </DataCard>

      <DataCard
        title="Individual Customer Feedback"
        description="Hide a response from the live feed or archive it."
        badge={
          <span className="flex items-center gap-2 rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-bold text-[#B96916]">
            <Users size={14} className="hidden sm:block" />
            {feedback.length} submissions
          </span>
        }
        footer={feedback.length > 0 && <Pagination {...feedbackPager} label="Feedback pages" />}
      >
        <div className="space-y-3">
          {feedback.length === 0 ? (
            <EmptyState
              icon={Star}
              title="No feedback yet."
              message="Every cup tells a story. New survey answers will show up here."
            />
          ) : (
            pageFeedback.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-3 transition hover:border-gray-300 sm:p-4 xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <strong className="text-sm font-extrabold text-[#19244E]">{item.name}</strong>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                    <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-gray-500">
                      {item.visitFrequency}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star size={12} fill="currentColor" />
                      {item.rating}.0
                    </span>
                  </div>
                  <p className="mt-2 text-sm italic leading-6 text-gray-700">
                    “{item.comment}”
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Preference: <strong className="text-gray-600">{item.preference}</strong>
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => openResponse(item.id)}
                    className="min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-[#19244E] transition hover:border-[#19244E]"
                  >
                    View details
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFeedback(item.id)}
                    aria-pressed={item.syncToVoice}
                    aria-label={`${item.syncToVoice ? "Hide" : "Show"} feedback from ${item.name}`}
                    className="flex min-h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3"
                  >
                    <span
                      className={`relative h-6 w-11 rounded-full transition ${
                        item.syncToVoice ? "bg-[#E58422]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                          item.syncToVoice ? "left-6" : "left-1"
                        }`}
                      />
                    </span>
                    <span className={`text-xs font-bold ${item.syncToVoice ? "text-[#E58422]" : "text-gray-400"}`}>
                      {item.syncToVoice ? "Live" : "Hidden"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => archiveFeedback(item)}
                    aria-label={`Archive feedback from ${item.name}`}
                    title="Archive"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Archive size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </DataCard>

      {surveyOpen && (
        <SurveyBuilderModal
          questions={questions}
          onCancel={() => setSurveyOpen(false)}
          onSave={saveSurvey}
        />
      )}

      {selectedResponse && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#10182f]/50 p-4"
          onClick={closeResponse}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="response-details-title"
            className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionLabel>Survey response</SectionLabel>
                <h3 id="response-details-title" className="mt-1 text-lg font-black text-[#19244E]">
                  {selectedResponse.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{selectedResponse.date}</p>
              </div>
              <button
                type="button"
                aria-label="Close response details"
                onClick={closeResponse}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm italic leading-6 text-gray-700">
              “{selectedResponse.comment}”
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-gray-100 p-3">
                <dt className="font-bold text-gray-400">Rating</dt>
                <dd className="mt-1 inline-flex items-center gap-1 font-extrabold text-amber-500">
                  <Star size={12} fill="currentColor" />
                  {selectedResponse.rating}.0 / 5
                </dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <dt className="font-bold text-gray-400">Visit frequency</dt>
                <dd className="mt-1 font-extrabold text-[#19244E]">{selectedResponse.visitFrequency}</dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <dt className="font-bold text-gray-400">Preference</dt>
                <dd className="mt-1 font-extrabold text-[#19244E]">{selectedResponse.preference}</dd>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <dt className="font-bold text-gray-400">Visibility</dt>
                <dd className={`mt-1 font-extrabold ${selectedResponse.syncToVoice ? "text-[#E58422]" : "text-gray-500"}`}>
                  {selectedResponse.syncToVoice ? "Live" : "Hidden"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => toggleFeedback(selectedResponse.id)}
                className="min-h-11 rounded-xl border border-gray-200 px-3 text-sm font-bold text-[#19244E] transition hover:bg-gray-50"
              >
                {selectedResponse.syncToVoice ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                onClick={() => {
                  archiveFeedback(selectedResponse);
                  closeResponse();
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-rose-300 px-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                <Archive size={15} />
                Archive
              </button>
              <button
                type="button"
                onClick={closeResponse}
                className="min-h-11 rounded-xl bg-[#19244E] px-3 text-sm font-bold text-white hover:bg-[#27376f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
