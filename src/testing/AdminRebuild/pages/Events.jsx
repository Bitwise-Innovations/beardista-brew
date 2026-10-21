import React, { useState } from "react";

const INITIAL_EVENT = {
  status: "Registration Active",
  title: "Beardista Brew Latte Art Throwdown",
  subtitle: "A celebration of coffee craft and community.",
  date: "November 18, 2026",
  time: "10:00 AM - 5:00 PM",
  location: "Beardista Brew Main Hall",
  competitorFee: "₱500",
  spectatorFee: "Free",
  competitorSlotsTotal: 32,
  competitorSlotsTaken: 18,
};

const LOCKED_FIELDS = [
  ["Full Name", "Legal name or registered barista moniker"],
  ["Age", "Required age verification"],
  ["Email Address", "Registration confirmation and digital pass"],
  ["Contact Number", "Event reminders and check-in updates"],
];

const INITIAL_QUESTIONS = [
  {
    id: 1,
    title: "What is your role?",
    type: "dropdown",
    required: true,
    options: [
      "Barista",
      "Head Barista",
      "Lead Barista / Roaster",
      "Cafe Owner / Founder",
      "Independent / Home Brewer",
    ],
  },
  {
    id: 2,
    title: "Representing what cafe?",
    type: "short_text",
    required: false,
    placeholder: "Enter cafe name or Independent",
    options: [],
  },
  {
    id: 3,
    title: "Years of experience",
    type: "dropdown",
    required: true,
    options: ["Less than 1 year", "1–2 years", "3–5 years", "5+ years"],
  },
];

const INITIAL_ARCHIVE = [
  {
    id: 101,
    title: "Caloocan Pour-Over Showdown 2025",
    category: "Competition",
    date: "November 18, 2025",
    competitors: 24,
    winner: "Marco Gutierrez",
    attendance: "110 Spectators",
    venue: "Beardista Brew Main Hall",
  },
  {
    id: 102,
    title: "Sensory Cupping & Aeropress Workshop",
    category: "Masterclass",
    date: "August 12, 2025",
    competitors: 16,
    winner: "Certified 16 Attendees",
    attendance: "45 Guests",
    venue: "Roastery Lab, Caloocan",
  },
  {
    id: 103,
    title: "Beardista Anniversary Latte Jam",
    category: "Community Jam",
    date: "May 04, 2025",
    competitors: 32,
    winner: "Kimberly Ramos",
    attendance: "140 Spectators",
    venue: "Beardista Brew Flagship",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-[#19244E] outline-none focus:border-[#E58422] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-gray-500";

function SectionCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

function Events() {
  const [activeTab, setActiveTab] = useState("builder");
  const [event, setEvent] = useState(INITIAL_EVENT);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [track, setTrack] = useState("competitor");
  const [archive, setArchive] = useState(INITIAL_ARCHIVE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [archiveSearch, setArchiveSearch] = useState("");

  const notify = (message) => setNotice(message);

  const updateEvent = (field, value) => {
    setEvent((previous) => ({ ...previous, [field]: value }));
  };

  const updateQuestion = (id, changes) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === id ? { ...question, ...changes } : question
      )
    );
  };

  const addQuestion = (preset = "general") => {
    const presets = {
      general: {
        title: "New competitor question",
        type: "dropdown",
        options: ["Option A", "Option B"],
      },
      dietary: {
        title: "Dietary Restrictions / Milk Allergy",
        type: "dropdown",
        options: ["None", "Lactose Intolerant", "Soy Allergy", "Nut Allergy"],
      },
      pitcher: {
        title: "Pitcher Type & Spout Preference",
        type: "dropdown",
        options: ["Sharp Spout", "Round Spout", "Personal Pitcher"],
      },
      accolades: {
        title: "Throwdown History & Accolades",
        type: "short_text",
        options: [],
      },
      machine: {
        title: "Espresso Machine Experience",
        type: "dropdown",
        options: ["Beginner", "Intermediate", "Advanced"],
      },
    };

    setQuestions((previous) => [
      ...previous,
      {
        id: Date.now(),
        ...presets[preset],
        required: false,
        placeholder: "Enter your answer",
      },
    ]);
    notify("Question added to the local demo.");
  };

  const duplicateQuestion = (question) => {
    setQuestions((previous) => [
      ...previous,
      { ...question, id: Date.now(), title: `${question.title} (Copy)`, options: [...question.options] },
    ]);
    notify("Question duplicated.");
  };

  const updateOption = (questionId, index, value) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, i) =>
                i === index ? value : option
              ),
            }
          : question
      )
    );
  };

  const addOption = (questionId) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, `Option ${question.options.length + 1}`] }
          : question
      )
    );
  };

  const removeOption = (questionId, index) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === questionId
          ? { ...question, options: question.options.filter((_, i) => i !== index) }
          : question
      )
    );
  };

  const recordPastEvent = () => {
    setArchive((previous) => [
      {
        id: Date.now(),
        title: "New Past Event Record",
        category: "Competition",
        date: "Date not set",
        competitors: 0,
        winner: "Not recorded",
        attendance: "Not recorded",
        venue: "Venue not recorded",
      },
      ...previous,
    ]);
    notify("Sample archive record added. Edit details in the local demo.");
  };

  const visibleArchive = archive.filter((item) =>
    `${item.title} ${item.category} ${item.winner}`
      .toLowerCase()
      .includes(archiveSearch.toLowerCase())
  );

  const tabs = [
    { id: "builder", label: "2-Track Registration Builder" },
    { id: "overview", label: "Event Overview & Schedule" },
    { id: "archive", label: "Past Tournaments Archive" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {notice && (
        <div
          role="status"
          className="fixed right-5 top-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl bg-[#19244E] px-5 py-3 text-sm font-bold text-white shadow-xl"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E58422]" />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-2 text-white/70 hover:text-white"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#19244E]">
              Events & Throwdown Manager
            </h1>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
              ● Registration Demo
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Configure event schedules, competitor brackets, and the two-track registration builder.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-extrabold text-[#19244E] hover:border-[#19244E]"
          >
            Test Customer Form
          </button>
          <button
            type="button"
            onClick={() => notify("Demo only: configuration was not published to a server.")}
            className="rounded-xl bg-[#E58422] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#d47414]"
          >
            Publish Configuration
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-3 text-xs font-extrabold transition ${
              activeTab === tab.id
                ? "bg-[#19244E] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.id === "archive" && (
              <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === tab.id ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {archive.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "builder" && (
        <div className="space-y-6">
          <SectionCard>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#E58422]">
              2-Track Customer Registration Architecture
            </p>
            <h2 className="mt-1 text-xl font-black text-[#19244E]">
              Attendee Registration Flow Mapping
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Competitors complete the standard attendee profile and additional
              barista qualification questions. Spectators use the streamlined
              registration flow with standard attendee information only.
            </p>
            <div className="mt-5 inline-flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1.5">
              <button
                type="button"
                onClick={() => setTrack("competitor")}
                className={`rounded-lg px-4 py-2.5 text-xs font-extrabold ${
                  track === "competitor" ? "bg-[#19244E] text-white" : "text-gray-600"
                }`}
              >
                Track A: Competitor · 2 Steps
              </button>
              <button
                type="button"
                onClick={() => setTrack("spectator")}
                className={`rounded-lg px-4 py-2.5 text-xs font-extrabold ${
                  track === "spectator" ? "bg-[#19244E] text-white" : "text-gray-600"
                }`}
              >
                Track B: Spectator · 1 Step
              </button>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-[#19244E]">Standard Attendee Info</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Required locked fields shared by both registration tracks.
                </p>
              </div>
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold text-amber-800">
                SYSTEM LOCKED
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {LOCKED_FIELDS.map(([name, description]) => (
                <div key={name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-extrabold text-[#19244E]">{name}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
                  <span className="mt-3 inline-block text-[10px] font-bold text-emerald-700">
                    ✓ Required · Locked
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {track === "competitor" ? (
            <SectionCard>
              <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-black text-[#19244E]">
                    Custom Questions Builder
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Configure the additional questions for the competitor registration track.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addQuestion()}
                  className="rounded-xl bg-[#E58422] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#d47414]"
                >
                  + Add Question
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <span className="mr-1 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Quick Add:
                </span>
                {[
                  ["dietary", "Dietary Restrictions"],
                  ["pitcher", "Spout & Pitcher Preference"],
                  ["accolades", "Throwdown Accolades"],
                  ["machine", "Machine Experience"],
                ].map(([preset, label]) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addQuestion(preset)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-700 hover:border-[#E58422]"
                  >
                    + {label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {questions.map((question, index) => (
                  <article
                    key={question.id}
                    className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-12">
                      <div className="flex items-center gap-2 md:col-span-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#19244E] text-xs font-black text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div className="md:col-span-7">
                        <label className={labelClass}>Question Title *</label>
                        <input
                          className={inputClass}
                          value={question.title}
                          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className={labelClass}>Question Type</label>
                        <select
                          className={inputClass}
                          value={question.type}
                          onChange={(e) => {
                            const type = e.target.value;
                            updateQuestion(question.id, {
                              type,
                              options: type === "dropdown" && !question.options.length
                                ? ["Option 1", "Option 2"]
                                : question.options,
                            });
                          }}
                        >
                          <option value="dropdown">Dropdown · Single Selection</option>
                          <option value="short_text">Short Text · Single Line</option>
                          <option value="paragraph">Paragraph · Multiline</option>
                        </select>
                      </div>
                    </div>

                    {question.type === "dropdown" && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                            Dropdown Options ({question.options.length})
                          </p>
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-xs font-extrabold text-[#E58422]"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={`${question.id}-${optionIndex}`} className="flex gap-2">
                              <input
                                className={inputClass}
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                aria-label={`Option ${optionIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="rounded-lg px-3 font-bold text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                                aria-label={`Remove option ${optionIndex + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(question.type === "short_text" || question.type === "paragraph") && (
                      <div>
                        <label className={labelClass}>Customer Placeholder</label>
                        <input
                          className={inputClass}
                          value={question.placeholder || ""}
                          onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
                          placeholder="Enter helper text"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-gray-600">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="h-4 w-4 accent-[#E58422]"
                        />
                        {question.required ? "Mandatory Field" : "Optional Field"}
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => duplicateQuestion(question)}
                          className="text-xs font-bold text-gray-500 hover:text-[#19244E]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQuestions((previous) =>
                              previous.filter((item) => item.id !== question.id)
                            );
                            notify("Question removed from the local demo.");
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                {questions.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                    No custom questions. Use Add Question to start building the form.
                  </div>
                )}
              </div>
            </SectionCard>
          ) : (
            <SectionCard>
              <span className="text-xs font-black uppercase tracking-wider text-[#E58422]">
                Streamlined Registration
              </span>
              <h3 className="mt-2 text-lg font-black text-[#19244E]">
                Spectator Pass Track
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Spectators only complete Step 1: Full Name, Age, Email Address,
                and Contact Number. Barista qualification questions are not
                shown on this track.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold text-gray-500">Sample admission cap</p>
                  <p className="mt-1 text-xl font-black text-[#19244E]">100 spectators</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold text-gray-500">Sample seats reserved</p>
                  <p className="mt-1 text-xl font-black text-[#E58422]">74 seats</p>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {activeTab === "overview" && (
        <SectionCard>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg font-black text-[#19244E]">
                Active Headline Event Details
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Edit the event configuration in this local preview.
              </p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-extrabold text-emerald-700">
              SAMPLE EVENT
            </span>
          </div>

          <form
            className="mt-5 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              notify("Demo only: event changes are held in local page state.");
            }}
          >
            <div>
              <label className={labelClass}>Event Status</label>
              <select
                className={inputClass}
                value={event.status}
                onChange={(e) => updateEvent("status", e.target.value)}
              >
                <option>Registration Active</option>
                <option>Slots Full</option>
                <option>Live Today</option>
                <option>Concluded</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Event Title *</label>
              <input
                className={inputClass}
                value={event.title}
                onChange={(e) => updateEvent("title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Event Tagline / Subtitle</label>
              <input
                className={inputClass}
                value={event.subtitle}
                onChange={(e) => updateEvent("subtitle", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["date", "Event Date"],
                ["time", "Time"],
                ["location", "Venue Location"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input
                    className={inputClass}
                    value={event[field]}
                    onChange={(e) => updateEvent(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["competitorFee", "Competitor Entry Fee", "text"],
                ["spectatorFee", "Spectator Admission", "text"],
                ["competitorSlotsTotal", "Competitor Slots (Total)", "number"],
                ["competitorSlotsTaken", "Competitors Registered", "number"],
              ].map(([field, label, type]) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input
                    className={`${inputClass} bg-white`}
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    value={event[field]}
                    onChange={(e) =>
                      updateEvent(field, type === "number" ? Number(e.target.value) : e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500">
                Changes affect this page's local demo state only.
              </p>
              <button
                type="submit"
                className="rounded-xl bg-[#E58422] px-5 py-3 text-xs font-extrabold text-white hover:bg-[#d47414]"
              >
                Save Demo Configuration
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      {activeTab === "archive" && (
        <SectionCard className="!p-0 overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <h2 className="text-lg font-black text-[#19244E]">
                Past Tournaments & Throwdown Archive
              </h2>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Sample historical records of championships, competitors, and attendance.
              </p>
            </div>
            <button
              type="button"
              onClick={recordPastEvent}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-extrabold text-[#19244E] hover:bg-[#19244E] hover:text-white"
            >
              + Record Past Event
            </button>
          </div>

          <div className="border-b border-gray-100 p-5">
            <input
              className={inputClass}
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              placeholder="Search event, category, or winner..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="bg-gray-50 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4">Event Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Date Concluded</th>
                  <th className="px-5 py-4">Competitors</th>
                  <th className="px-5 py-4">Tournament Winner</th>
                  <th className="px-5 py-4">Attendance</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleArchive.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-4 font-extrabold text-[#19244E]">
                      <p>{item.title}</p>
                      <p className="mt-1 text-[10px] font-medium text-gray-400">{item.venue}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-bold text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{item.date}</td>
                    <td className="px-5 py-4 font-bold text-[#19244E]">{item.competitors}</td>
                    <td className="px-5 py-4 font-bold text-[#E58422]">{item.winner}</td>
                    <td className="px-5 py-4 text-gray-600">{item.attendance}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
                {visibleArchive.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                      No archive records match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="border-t border-gray-100 px-5 py-3 text-[10px] text-gray-400">
            Illustrative sample records only. Archive changes are not persisted.
          </p>
        </SectionCard>
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close registration preview"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-preview-title"
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between gap-3 bg-[#19244E] px-5 py-4 text-white">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E58422]">
                  Customer Experience Preview
                </p>
                <h2 id="registration-preview-title" className="mt-1 text-sm font-extrabold">
                  {event.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg px-3 py-2 text-lg text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close preview"
              >
                ×
              </button>
            </header>

            <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-xl bg-orange-50 p-1.5">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setTrack("competitor")}
                    className={`rounded-lg px-3 py-3 text-xs font-extrabold ${
                      track === "competitor" ? "bg-[#19244E] text-white" : "text-gray-600"
                    }`}
                  >
                    Competitor Track · {event.competitorFee}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrack("spectator")}
                    className={`rounded-lg px-3 py-3 text-xs font-extrabold ${
                      track === "spectator" ? "bg-[#19244E] text-white" : "text-gray-600"
                    }`}
                  >
                    Spectator Track · {event.spectatorFee}
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#19244E]">
                  Step 1: Attendee Profile
                </p>
                <div className="space-y-3">
                  <input disabled placeholder="Full Name *" className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input disabled placeholder="Age (Max 99) *" className={inputClass} />
                    <input disabled placeholder="Contact Number *" className={inputClass} />
                  </div>
                  <input disabled placeholder="Email Address *" className={inputClass} />
                </div>
              </div>

              {track === "competitor" && (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#19244E]">
                      Step 2: Barista Tournament Profile
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Preview of the custom competitor questions.
                    </p>
                  </div>
                  {questions.map((question) => (
                    <div key={question.id}>
                      <label className={labelClass}>
                        {question.title} {question.required ? "*" : ""}
                      </label>
                      {question.type === "dropdown" ? (
                        <select disabled className={inputClass} defaultValue="">
                          <option value="">Select an option</option>
                          {question.options.map((option, index) => (
                            <option key={`${question.id}-${index}`}>{option}</option>
                          ))}
                        </select>
                      ) : question.type === "paragraph" ? (
                        <textarea
                          disabled
                          className={inputClass}
                          placeholder={question.placeholder || "Type here..."}
                        />
                      ) : (
                        <input
                          disabled
                          className={inputClass}
                          placeholder={question.placeholder || "Type here..."}
                        />
                      )}
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <p className="text-xs text-gray-500">No custom questions configured.</p>
                  )}
                </div>
              )}

              {track === "spectator" && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-5 text-emerald-800">
                  Spectator registration ends after the standard attendee profile. No competitor qualification questions are displayed.
                </div>
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 p-4">
              <span className="text-[10px] text-gray-400">Preview only · No registration is submitted</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl bg-[#19244E] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#27376f]"
              >
                Close Preview
              </button>
            </footer>
          </section>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400">
        Events reconstruction · Local sample data only · No backend connected
      </p>
    </div>
  );
}

export default Events;
