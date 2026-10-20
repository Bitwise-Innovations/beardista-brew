import { useState } from "react";
import {
  ClipboardList,
  Users,
  Star,
  Trash2,
  X,
  BarChart3,
} from "lucide-react";

const initialFeedback = [
  {
    id: 1,
    name: "Alex Morgan",
    date: "Oct 20, 2026",
    visitFrequency: "Regular",
    rating: 5,
    comment: "Great coffee and a comfortable place to study!",
    preference: "Iced Latte",
    syncToVoice: true,
  },
  {
    id: 2,
    name: "Jamie Santos",
    date: "Oct 19, 2026",
    visitFrequency: "Weekly",
    rating: 5,
    comment: "Friendly staff and consistently delicious drinks.",
    preference: "Caramel Macchiato",
    syncToVoice: false,
  },
  {
    id: 3,
    name: "Taylor Reyes",
    date: "Oct 18, 2026",
    visitFrequency: "First visit",
    rating: 4,
    comment: "Nice atmosphere. I would love to visit again!",
    preference: "Spanish Latte",
    syncToVoice: true,
  },
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

function SectionLabel({ children }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400 sm:text-[11px]">
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function VisitsChart() {
  return (
    <div className="mt-5">
      <div className="h-44 w-full sm:h-52">
        <svg
          className="h-full w-full"
          viewBox="0 0 500 180"
          preserveAspectRatio="none"
          role="img"
          aria-label="Sample digital visits trend chart"
        >
          <defs>
            <linearGradient id="analyticsVisitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E58422" stopOpacity=".3" />
              <stop offset="100%" stopColor="#E58422" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 80, 130].map((y) => (
            <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#E5E7EB" strokeDasharray="4 5" />
          ))}
          <path
            d="M0 140 Q60 110 120 125 T240 70 T360 90 T500 35 L500 180 L0 180 Z"
            fill="url(#analyticsVisitGradient)"
          />
          <path
            d="M0 140 Q60 110 120 125 T240 70 T360 90 T500 35"
            fill="none"
            stroke="#E58422"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {[
            [120, 125],
            [240, 70],
            [360, 90],
            [500, 35],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="4.5" fill="#19244E" stroke="white" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-[10px] font-semibold text-gray-400 sm:grid-cols-4 sm:text-[11px]">
        <span>Week 1 · Oct 1–7</span>
        <span>Week 2 · Oct 8–14</span>
        <span>Week 3 · Oct 15–21</span>
        <span>Week 4 · Oct 22–28</span>
      </div>
    </div>
  );
}

function DemographicsChart() {
  const circumference = 2 * Math.PI * 38;
  let accumulated = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative my-5 h-36 w-36 sm:h-40 sm:w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {audience.map((item) => {
            const dash = circumference * item.percent / 100;
            const offset = -accumulated;
            accumulated += dash;

            return (
              <circle
                key={item.label}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-xl font-black text-[#19244E]">1,428</strong>
          <span className="text-[9px] font-bold uppercase text-gray-400">Daily average</span>
        </div>
      </div>

      <div className="w-full space-y-3 border-t border-gray-100 pt-4">
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

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("30d");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [showSurveyNotice, setShowSurveyNotice] = useState(false);

  function toggleFeedback(id) {
    setFeedback((items) =>
      items.map((item) =>
        item.id === id ? { ...item, syncToVoice: !item.syncToVoice } : item
      )
    );
  }

  function archiveFeedback(id) {
    setFeedback((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E58422]">
            Business insights
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#19244E] sm:text-3xl">
            Analytics &amp; Customer Reports
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
            Review sample visitor trends, customer satisfaction, and feedback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {[
              { value: "7d", label: "7 Days" },
              { value: "30d", label: "30 Days" },
              { value: "90d", label: "Quarterly" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeframe(option.value)}
                className={`rounded-lg px-3 py-2 text-[11px] font-bold transition sm:text-xs ${
                  timeframe === option.value
                    ? "bg-[#19244E] text-white"
                    : "text-gray-500 hover:text-[#19244E]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowSurveyNotice(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E58422] px-4 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#d47414]"
          >
            <ClipboardList size={15} />
            Survey Builder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <SectionLabel>Footfall &amp; menu views</SectionLabel>
              <h2 className="mt-1 text-base font-black text-[#19244E] sm:text-lg">
                Total Digital Visits
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {timeframe === "7d" ? "Last 7 days" : timeframe === "30d" ? "October 2026" : "Quarterly overview"} · Sample data
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#19244E]">34,920</p>
              <p className="mt-1 text-xs font-bold text-emerald-600">↗ 14.2% MoM</p>
            </div>
          </div>
          <VisitsChart />
        </Card>

        <Card>
          <SectionLabel>Customer segmentation</SectionLabel>
          <h2 className="mt-1 text-base font-black text-[#19244E] sm:text-lg">
            Visitor Demographics
          </h2>
          <DemographicsChart />
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionLabel>Survey metrics</SectionLabel>
            <h2 className="mt-1 text-base font-black text-[#19244E] sm:text-lg">
              Customer Experience Rating Distribution
            </h2>
            <p className="mt-1 text-xs text-gray-400">Ratings from 1 to 5 stars · Sample data</p>
          </div>
          <div className="w-fit rounded-xl bg-orange-50 px-3 py-2 text-xs font-extrabold text-[#E58422]">
            Average score: 4.85 / 5.0
          </div>
        </div>

        <div className="mt-6 space-y-4">
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
      </Card>

      <Card>
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionLabel>Customer voice</SectionLabel>
            <h2 className="mt-1 text-lg font-black text-[#19244E]">
              Individual Customer Feedback
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
              Sample survey submissions. Toggle visibility or remove a card from this local preview.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Users size={16} />
            {feedback.length} submissions
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {feedback.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">
              No sample feedback cards remain.
            </div>
          ) : (
            feedback.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition hover:border-gray-300 sm:p-5 xl:flex-row xl:items-center xl:justify-between"
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
                  <p className="mt-3 text-sm italic leading-6 text-gray-700">
                    “{item.comment}”
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Preference: <strong className="text-gray-600">{item.preference}</strong>
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => toggleFeedback(item.id)}
                    aria-pressed={item.syncToVoice}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
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
                    onClick={() => archiveFeedback(item.id)}
                    aria-label={`Remove sample feedback from ${item.name}`}
                    title="Remove sample card"
                    className="rounded-xl border border-gray-200 bg-white p-3 text-gray-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Card>

      {showSurveyNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10182f]/50 p-4"
          onClick={() => setShowSurveyNotice(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="survey-preview-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#E58422]">
                <BarChart3 size={22} />
              </div>
              <button
                type="button"
                aria-label="Close survey preview"
                onClick={() => setShowSurveyNotice(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <h3 id="survey-preview-title" className="mt-4 text-lg font-black text-[#19244E]">
              Survey Builder
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This is a UI-only preview. Survey creation and distribution are not connected in this rebuild.
            </p>
            <button
              type="button"
              onClick={() => setShowSurveyNotice(false)}
              className="mt-5 w-full rounded-xl bg-[#19244E] px-4 py-3 text-sm font-bold text-white hover:bg-[#27376f]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400">
        Analytics figures and feedback shown here are sample data for UI demonstration.
      </p>
    </div>
  );
}
