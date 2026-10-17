import React, { useState } from 'react';

const PAST_EVENTS_ARCHIVE = [
  {
    id: 'arch-1',
    title: 'Caloocan Pour-Over Showdown 2025',
    category: 'Competition',
    date: 'November 18, 2025',
    venue: 'Beardista Brew Main Hall',
    competitors: 24,
    winner: 'Marco Gutierrez (Craft Barista PH)',
    status: 'Completed',
    attendance: '110 Spectators'
  },
  {
    id: 'arch-2',
    title: 'Sensory Cupping & Aeropress Workshop',
    category: 'Masterclass',
    date: 'August 12, 2025',
    venue: 'Roastery Lab, Caloocan',
    competitors: 16,
    winner: 'Certified 16 Attendees',
    status: 'Completed',
    attendance: '45 Guests'
  },
  {
    id: 'arch-3',
    title: 'Beardista Anniversary Latte Jam',
    category: 'Community Jam',
    date: 'May 04, 2025',
    venue: 'Beardista Brew Flagship',
    competitors: 32,
    winner: 'Kimberly Ramos (Beardista)',
    status: 'Completed',
    attendance: '140 Spectators'
  }
];

// Locked / Standard attendee info fields required for ALL registrants (Competitor & Spectator)
const STANDARD_ATTENDEE_FIELDS = [
  {
    id: 'std-name',
    name: 'Full Name',
    type: 'Text',
    required: true,
    locked: true,
    description: 'First and last legal name or registered barista tournament moniker',
    badge: 'Core Identity'
  },
  {
    id: 'std-age',
    name: 'Age',
    type: 'Number (Max 99)',
    required: true,
    locked: true,
    description: 'Age verification (Maximum 99 years old). Enforces bar and tournament eligibility',
    badge: 'Age Gate'
  },
  {
    id: 'std-email',
    name: 'Email Address',
    type: 'Email Address',
    required: true,
    locked: true,
    description: 'Receives instant registration confirmation, tournament heat bracket, and QR wristband pass',
    badge: 'Digital Ticket'
  },
  {
    id: 'std-contact',
    name: 'Contact Number',
    type: 'Tel (Max 10 Digits)',
    required: true,
    locked: true,
    description: 'Valid mobile number for urgent SMS call times, heat bracket reminders, and venue check-in',
    badge: 'SMS Alerts'
  }
];

// Mock default custom questions matching customer UI for the Competitor Track
const DEFAULT_COMPETITOR_QUESTIONS = [
  {
    id: 'comp-q1',
    title: 'What is your role?',
    type: 'dropdown',
    required: true,
    options: ['Barista', 'Head Barista', 'Lead Barista / Roaster', 'Cafe Owner / Founder', 'Independent / Home Brewer']
  },
  {
    id: 'comp-q2',
    title: 'Representing what cafe?',
    type: 'short_text',
    required: false,
    placeholder: 'e.g. Craft Coffee Lab Camarin, Independent, etc.',
    options: []
  },
  {
    id: 'comp-q3',
    title: 'Years of experience',
    type: 'dropdown',
    required: true,
    options: ['Less than 1 year', '1–2 years', '3–5 years', '5+ years']
  }
];

export const EventsManagerView = ({ eventsData, onSaveEvent }) => {
  const [activeTab, setActiveTab] = useState('builder'); // 'overview' | 'builder' | 'archive'
  const [event, setEvent] = useState(eventsData.activeEvent);
  const [archiveList, setArchiveList] = useState(PAST_EVENTS_ARCHIVE);

  // 2-Track Custom Questions State (Competitor Track)
  const [competitorQuestions, setCompetitorQuestions] = useState(DEFAULT_COMPETITOR_QUESTIONS);
  const [activeTrackView, setActiveTrackView] = useState('competitor'); // 'competitor' | 'spectator'
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Toast / Status state
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (field, val) => {
    setEvent((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSaveEvent({
      ...event,
      competitorQuestions
    });
    showNotification('Event & 2-Track Registration Schema published successfully!');
  };

  // ---------------------------------------------------------------------------
  // COMPETITOR CUSTOM QUESTION BUILDER HANDLERS
  // ---------------------------------------------------------------------------

  const handleAddCompetitorQuestion = (preset) => {
    let newQ = {
      id: `comp-q-${Date.now()}`,
      title: 'New competitor field...',
      type: 'dropdown',
      required: false,
      options: ['Option A', 'Option B']
    };

    if (preset === 'dietary') {
      newQ = {
        id: `comp-q-${Date.now()}`,
        title: 'Dietary Restrictions / Milk Allergy',
        type: 'dropdown',
        required: false,
        options: ['None', 'Lactose Intolerant (Use Oat Milk)', 'Soy Allergy', 'Nut Allergy']
      };
    } else if (preset === 'pitcher') {
      newQ = {
        id: `comp-q-${Date.now()}`,
        title: 'Pitcher Type & Spout Preference',
        type: 'dropdown',
        required: false,
        options: ['Sharp Spout (Precision Etching)', 'Round Spout (Classic Tulips & Hearts)', 'Bespoke Personal Pitcher']
      };
    } else if (preset === 'accolades') {
      newQ = {
        id: `comp-q-${Date.now()}`,
        title: 'Throwdown History & Accolades',
        type: 'short_text',
        required: false,
        placeholder: 'e.g. 2nd Place North Metro Latte Jam 2024',
        options: []
      };
    } else if (preset === 'machine') {
      newQ = {
        id: `comp-q-${Date.now()}`,
        title: 'Commercial Espresso Machine Experience Level',
        type: 'dropdown',
        required: true,
        options: ['Commercial Dual-Boiler Master', 'Single-Boiler / Prosumer', 'Home Espresso Enthusiast']
      };
    }

    setCompetitorQuestions((prev) => [...prev, newQ]);
    showNotification(`Added question "${newQ.title}"`);
  };

  const handleUpdateQuestion = (qId, updates) => {
    setCompetitorQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...updates } : q))
    );
  };

  const handleDeleteQuestion = (qId) => {
    setCompetitorQuestions((prev) => prev.filter((q) => q.id !== qId));
    showNotification('Question removed from competitor track.');
  };

  const handleDuplicateQuestion = (qId) => {
    const idx = competitorQuestions.findIndex((q) => q.id === qId);
    if (idx === -1) return;
    const target = competitorQuestions[idx];
    const cloned = {
      ...JSON.parse(JSON.stringify(target)),
      id: `comp-q-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    const next = [...competitorQuestions];
    next.splice(idx + 1, 0, cloned);
    setCompetitorQuestions(next);
    showNotification(`Duplicated question "${target.title}"`);
  };

  const handleAddOption = (qId) => {
    setCompetitorQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const currentOpts = q.options || [];
          return { ...q, options: [...currentOpts, `New Option ${currentOpts.length + 1}`] };
        }
        return q;
      })
    );
  };

  const handleUpdateOption = (qId, optIdx, val) => {
    setCompetitorQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const nextOpts = [...(q.options || [])];
          nextOpts[optIdx] = val;
          return { ...q, options: nextOpts };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (qId, optIdx) => {
    setCompetitorQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return { ...q, options: (q.options || []).filter((_, i) => i !== optIdx) };
        }
        return q;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#19244E] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-slideDown">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E58422] animate-pulse" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
              Events & Throwdown Manager
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-md border border-emerald-200">
              ● Registration Live
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure live event schedule, competitor brackets, and the 2-Track registration builder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-[#19244E] text-[#19244E] text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>👁️</span>
            <span>Test Customer Form</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>Publish Configuration</span>
          </button>
        </div>
      </div>

      {/* Top Tabbed Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'builder'
              ? 'bg-[#19244E] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#E58422] animate-pulse" />
          <span>2-Track Registration Builder</span>
          <span className="px-1.5 py-0.5 bg-[#E58422] text-white text-[10px] rounded-full font-black">
            Competitor vs. Spectator
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#19244E] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>🏆</span>
          <span>Event Overview & Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('archive')}
          className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'archive'
              ? 'bg-[#19244E] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>📁</span>
          <span>Past Tournaments Archive</span>
          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded-full">
            {archiveList.length}
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: 2-TRACK CUSTOMER REGISTRATION BUILDER                         */}
      {/* ==================================================================== */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Track Summary Banner */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#E58422]">
                  2-Track Customer Registration Architecture
                </span>
                <h2 className="text-xl font-black text-[#19244E] mt-0.5">
                  Attendee Registration Flow Mapping
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  The public customer form dynamically bifurcates into two distinct pathways:
                  <strong> Track A (Barista Competitor)</strong> with custom qualification prompts, and
                  <strong> Track B (Spectator Audience)</strong> with streamlined seat reservations.
                </p>
              </div>

              {/* Track Selector Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200/80 text-xs font-bold self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTrackView('competitor')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activeTrackView === 'competitor'
                      ? 'bg-[#19244E] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🏆 Track A: Competitor (2 Steps)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrackView('spectator')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activeTrackView === 'spectator'
                      ? 'bg-[#19244E] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🎟️ Track B: Spectator (1 Step)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* SECTION 1: STANDARD ATTENDEE INFO (LOCKED / FIXED)                 */}
          {/* ------------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-[#19244E]">Standard Attendee Info</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mandatory locked fields required for all registrants (Competitor & Spectator).
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60 self-start sm:self-auto flex items-center gap-1.5">
                <span></span> System Locked
              </span>
            </div>

            {/* Clean, Compact List */}
            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STANDARD_ATTENDEE_FIELDS.map((field) => (
                  <li key={field.id} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#19244E] truncate">
                        {field.name}
                      </span>
                      <span className="block text-[10px] text-gray-500 truncate" title={field.description}>
                        {field.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* SECTION 2: CUSTOM QUESTIONS BUILDER (COMPETITOR TRACK)            */}
          {/* ------------------------------------------------------------------ */}
          {activeTrackView === 'competitor' ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#E58422] flex items-center justify-center font-black text-sm">
                      🏆
                    </span>
                    <h2 className="text-lg font-black text-[#19244E]">
                      Custom Questions Builder (Competitor Track)
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Interface for the Admin to add and edit custom questions specifically for the Competitor registration track (Step 2 of the customer form).
                  </p>
                </div>

                {/* Primary + Add Question Button */}
                <button
                  type="button"
                  onClick={() => handleAddCompetitorQuestion()}
                  className="px-4 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="text-base leading-none font-black">+</span>
                  <span>Add Question</span>
                </button>
              </div>

              {/* Quick Preset Add Buttons */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Quick-Add Fields:
                </span>
                <button
                  type="button"
                  onClick={() => handleAddCompetitorQuestion('dietary')}
                  className="px-3 py-1.5 bg-white hover:bg-[#19244E] hover:text-white text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer shadow-2xs"
                >
                  + Dietary Restrictions
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCompetitorQuestion('pitcher')}
                  className="px-3 py-1.5 bg-white hover:bg-[#19244E] hover:text-white text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer shadow-2xs"
                >
                  + Spout & Pitcher Preference
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCompetitorQuestion('accolades')}
                  className="px-3 py-1.5 bg-white hover:bg-[#19244E] hover:text-white text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer shadow-2xs"
                >
                  + Throwdown Accolades
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCompetitorQuestion('machine')}
                  className="px-3 py-1.5 bg-white hover:bg-[#19244E] hover:text-white text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200 transition-all cursor-pointer shadow-2xs"
                >
                  + Espresso Machine Experience
                </button>
              </div>

              {/* Competitor Custom Questions Cards */}
              <div className="space-y-4">
                {competitorQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all space-y-4 group"
                  >
                    {/* Top Row: Index, Prompt Input, and Type Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-1 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#19244E] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                      </div>

                      {/* Question Title */}
                      <div className="md:col-span-7">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Competitor Question Title *
                        </label>
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => handleUpdateQuestion(q.id, { title: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422]"
                        />
                      </div>

                      {/* Question Type */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Question Type
                        </label>
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            let opts = q.options || [];
                            if (newType === 'dropdown' && (!opts || opts.length === 0)) {
                              opts = ['Option 1', 'Option 2'];
                            }
                            handleUpdateQuestion(q.id, { type: newType, options: opts });
                          }}
                          className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] cursor-pointer"
                        >
                          <option value="dropdown">Dropdown (Single Selection)</option>
                          <option value="short_text">Short Text (Single Line)</option>
                          <option value="paragraph">Paragraph (Multiline)</option>
                        </select>
                      </div>
                    </div>

                    {/* Options list if type === 'dropdown' */}
                    {q.type === 'dropdown' && (
                      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            Dropdown Options ({q.options?.length || 0}):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddOption(q.id)}
                            className="text-[11px] font-extrabold text-[#E58422] hover:text-[#d47414] cursor-pointer"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(q.options || []).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <span className="text-[11px] text-gray-400 font-bold w-4">
                                •
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#E58422]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(q.id, optIdx)}
                                className="text-gray-300 hover:text-rose-500 p-1 text-xs cursor-pointer"
                                title="Remove option"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Placeholder for Short Text */}
                    {q.type === 'short_text' && (
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[11px] text-gray-400 italic">
                          Single-line text input. Customer sees placeholder: "{q.placeholder || 'e.g. Cafe Name'}"
                        </span>
                      </div>
                    )}

                    {/* Card Footer: Required Switch, Duplicate, Delete */}
                    <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                      {/* Required Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(q.id, { required: !q.required })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                            q.required ? 'bg-[#E58422]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                              q.required ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-bold ${q.required ? 'text-amber-800' : 'text-gray-400'}`}>
                          {q.required ? 'Mandatory Field' : 'Optional Field'}
                        </span>
                      </div>

                      {/* Duplicate & Delete Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(q.id)}
                          className="p-1.5 text-gray-400 hover:text-[#19244E] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                          title="Duplicate question"
                        >
                          <span>⧉</span>
                          <span>Duplicate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                          title="Delete question"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Spectator Track Info Card */
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 text-[#E58422] flex items-center justify-center font-black text-lg">
                  🎟️
                </span>
                <div>
                  <h3 className="text-base font-black text-[#19244E]">
                    Spectator Pass Track (Streamlined Flow)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Spectator attendees only complete Step 1 (Standard Attendee Info) and are exempt from barista qualification questions.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 leading-relaxed space-y-2">
                <p>
                  <strong>Why is Spectator Track streamlined?</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Spectators do not compete on commercial machinery and require no barista experience or cafe affiliation checks.</li>
                  <li>After providing their name, age, email, and phone number, spectators immediately receive their free admission QR pass.</li>
                  <li>Admission Cap: Current cap is set to 100 Spectators with 74 seats reserved.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACTIVE HEADLINE EVENT OVERVIEW & SCHEDULE                     */}
      {/* ==================================================================== */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-[#E58422] flex items-center justify-center text-lg font-black">
                🏆
              </span>
              <div>
                <h2 className="text-base font-black text-[#19244E]">
                  Active Headline Event Details
                </h2>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ● Live on Public Digital Menu
                </span>
              </div>
            </div>

            <div>
              <select
                value={event.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="Registration Active">Registration Active</option>
                <option value="Slots Full">Slots Full / Waitlist</option>
                <option value="Live Today">Live Today (Ongoing)</option>
                <option value="Concluded">Concluded</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Event Tagline / Subtitle
              </label>
              <input
                type="text"
                value={event.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Event Date
                </label>
                <input
                  type="text"
                  value={event.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={event.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                  Venue Location
                </label>
                <input
                  type="text"
                  value={event.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Competitor Entry Fee
                </label>
                <input
                  type="text"
                  value={event.competitorFee}
                  onChange={(e) => handleChange('competitorFee', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Spectator Admission
                </label>
                <input
                  type="text"
                  value={event.spectatorFee}
                  onChange={(e) => handleChange('spectatorFee', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Competitor Slots (Total)
                </label>
                <input
                  type="number"
                  value={event.competitorSlotsTotal}
                  onChange={(e) => handleChange('competitorSlotsTotal', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Competitors Registered
                </label>
                <input
                  type="number"
                  value={event.competitorSlotsTaken}
                  onChange={(e) => handleChange('competitorSlotsTaken', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: EVENT HISTORY / ARCHIVE (DATA TABLE)                          */}
      {/* ==================================================================== */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#19244E]">
                Past Tournaments & Throwdown Archive
              </h2>
              <p className="text-xs text-gray-500">
                Historical records of Beardista Brew championships, competitors, and champions.
              </p>
            </div>
            <button
              onClick={() => {
                const newArch = {
                  id: `arch-${Date.now()}`,
                  title: 'Spring Calibration Cup 2025',
                  category: 'Cupping',
                  date: 'April 15, 2025',
                  venue: 'Beardista Brew Lab',
                  competitors: 18,
                  winner: 'Carlo Mendoza',
                  status: 'Completed',
                  attendance: '85 Spectators'
                };
                setArchiveList([newArch, ...archiveList]);
                showNotification('Added archive tournament record.');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              + Record Past Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="py-4 px-6">Event Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Date Concluded</th>
                  <th className="py-4 px-6">Competitors</th>
                  <th className="py-4 px-6">Tournament Winner</th>
                  <th className="py-4 px-6">Attendance</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {archiveList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-[#19244E]">
                      {item.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-bold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      {item.date}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#19244E]">
                      {item.competitors} Baristas
                    </td>
                    <td className="py-4 px-6 text-[#E58422] font-extrabold">
                      🏆 {item.winner}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {item.attendance}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[10px]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* POP-UP MODAL: LIVE CUSTOMER REGISTRATION PREVIEW                     */}
      {/* ==================================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsPreviewOpen(false)}
          />

          <div className="relative bg-[#FFF3E7] rounded-3xl max-w-xl w-full shadow-2xl border border-amber-200 overflow-hidden z-10 animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Customer Modal Header */}
            <div className="bg-[#19244E] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#E58422] uppercase tracking-wider">
                  Live Customer Experience Preview
                </span>
                <h3 className="font-extrabold text-sm">{event.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Customer Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
              {/* Track Selector for Preview */}
              <div className="flex bg-[#FFF3E7] p-1.5 rounded-2xl border border-amber-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTrackView('competitor')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTrackView === 'competitor'
                      ? 'bg-[#19244E] text-white shadow-xs'
                      : 'text-gray-600'
                  }`}
                >
                  Competitor Track (₱500)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrackView('spectator')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTrackView === 'spectator'
                      ? 'bg-[#19244E] text-white shadow-xs'
                      : 'text-gray-600'
                  }`}
                >
                  Spectator Track (Free)
                </button>
              </div>

              {/* Step 1: Standard Attendee Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#19244E] uppercase tracking-wider">
                  Step 1: Attendee Profile
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Full Name *"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      placeholder="Age (Max 99) *"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
                    />
                    <input
                      type="text"
                      disabled
                      placeholder="Contact No. (10 digits) *"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
                    />
                  </div>
                  <input
                    type="email"
                    disabled
                    placeholder="Email Address *"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
                  />
                </div>
              </div>

              {/* Step 2: Custom Questions (Only on competitor track) */}
              {activeTrackView === 'competitor' && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#19244E] uppercase tracking-wider">
                      Step 2: Barista Tournament Profile
                    </h4>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                      Dynamic Schema
                    </span>
                  </div>

                  <div className="space-y-3">
                    {competitorQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          {q.title} {q.required && <span className="text-rose-500">*</span>}
                        </label>
                        {q.type === 'dropdown' ? (
                          <select
                            disabled
                            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
                          >
                            {(q.options || []).map((opt, i) => (
                              <option key={i}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            disabled
                            placeholder={q.placeholder || 'Type here...'}
                            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-[#19244E] text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagerView;
