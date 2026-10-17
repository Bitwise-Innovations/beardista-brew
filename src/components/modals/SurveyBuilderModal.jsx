import React, { useState } from 'react';

const INITIAL_PILLARS = [
  'Coffee Quality & Beverage Craft',
  'Hospitality & Barista Service',
  'Store Ambiance & Cleanliness',
  'Food Pairing & Pastry Selection',
  'Digital Ordering & Menu Experience',
  'Community Events & Workshops'
];

const INITIAL_CARDS = [
  {
    id: 'card-1',
    cardType: 'question',
    title: 'How would you rate the flavor balance and quality of your drink today?',
    type: 'rating_5', // 'rating_5' | 'choice' | 'linear_10' | 'open_text'
    required: true,
    options: []
  },
  {
    id: 'card-2',
    cardType: 'question',
    title: 'How often do you visit Beardista Brew in Camarin?',
    type: 'choice',
    required: true,
    options: ['First Time Visiting', '2–3 Times a Week', 'Weekly Regular', 'Monthly']
  },
  {
    id: 'card-3',
    cardType: 'question',
    title: 'How likely are you to recommend Beardista Brew to a friend or colleague?',
    type: 'linear_10',
    required: true,
    lowLabel: 'Not likely at all',
    highLabel: 'Extremely likely',
    options: []
  },
  {
    id: 'card-4',
    cardType: 'question',
    title: 'What signature drink or seasonal blend would you like to see on our menu next?',
    type: 'open_text',
    required: false,
    options: []
  }
];

export const SurveyBuilderModal = ({ isOpen, onClose, onSave }) => {
  // Top Section State
  const [surveyTitle, setSurveyTitle] = useState('Customer Experience & Taste Survey');
  const [targetPillar, setTargetPillar] = useState('Coffee Quality & Beverage Craft');
  const [estimatedTime, setEstimatedTime] = useState('2 Minutes');
  const [welcomeNote, setWelcomeNote] = useState(
    'Thank you for visiting Beardista Brew! Your feedback directly guides our head roasters, baristas, and kitchen artisans to perfect every pour and bite.'
  );

  // Question & Card Blocks State
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [showImportModal, setShowImportModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // HANDLERS FOR FORM CONTROLS MENU
  // ---------------------------------------------------------------------------

  // 1. + Add Question
  const handleAddQuestion = () => {
    const newCard = {
      id: `q-${Date.now()}`,
      cardType: 'question',
      title: 'New question prompt...',
      type: 'rating_5',
      required: false,
      options: ['Option 1', 'Option 2']
    };
    setCards((prev) => [...prev, newCard]);
  };

  // 2. Add Title Card (Section divider)
  const handleAddTitleCard = () => {
    const newTitleCard = {
      id: `title-${Date.now()}`,
      cardType: 'title_card',
      title: 'Section Header: Barista Hospitality & Service',
      description: 'Please answer these questions regarding your interaction with our counter staff.',
      required: false
    };
    setCards((prev) => [...prev, newTitleCard]);
  };

  // 3. Add Image Card
  const handleAddImageCard = () => {
    const newImageCard = {
      id: `img-${Date.now()}`,
      cardType: 'image_card',
      title: 'Beardista Camarin Flagship Atmosphere',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      caption: 'Rate our cafe lighting and ambient acoustic music volume.'
    };
    setCards((prev) => [...prev, newImageCard]);
  };

  // 4. Import Template
  const handleImportTemplate = (templateType) => {
    if (templateType === 'taste') {
      setSurveyTitle('Beverage Flavor & Calibration Audit');
      setTargetPillar('Coffee Quality & Beverage Craft');
      setEstimatedTime('2 Minutes');
      setCards([
        {
          id: `t-1-${Date.now()}`,
          cardType: 'question',
          title: 'How would you rate the crema and espresso balance in your drink?',
          type: 'rating_5',
          required: true,
          options: []
        },
        {
          id: `t-2-${Date.now()}`,
          cardType: 'question',
          title: 'Which brew style did you order today?',
          type: 'choice',
          required: true,
          options: ['Espresso & Milk Creation', 'Signature Specialty Drink', 'Single Origin Pour-over', 'Zero-Proof Cascara']
        },
        {
          id: `t-3-${Date.now()}`,
          cardType: 'question',
          title: 'How was the drink temperature upon serving?',
          type: 'choice',
          required: false,
          options: ['Perfect', 'A bit too hot', 'Too lukewarm', 'Need more ice']
        }
      ]);
    } else if (templateType === 'nps') {
      setSurveyTitle('Beardista Community Loyalty & NPS');
      setTargetPillar('Hospitality & Barista Service');
      setEstimatedTime('1 Minute');
      setCards([
        {
          id: `nps-1-${Date.now()}`,
          cardType: 'question',
          title: 'How likely are you to recommend Beardista Brew to friends or coworkers?',
          type: 'linear_10',
          required: true,
          lowLabel: 'Not likely at all',
          highLabel: 'Extremely likely',
          options: []
        },
        {
          id: `nps-2-${Date.now()}`,
          cardType: 'question',
          title: 'What stood out most during your visit today?',
          type: 'open_text',
          required: false,
          options: []
        }
      ]);
    }
    setShowImportModal(false);
  };

  // ---------------------------------------------------------------------------
  // CARD EDITING CONTROLS
  // ---------------------------------------------------------------------------

  const updateCard = (cardId, updates) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleDuplicateCard = (cardId) => {
    const cardIndex = cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;
    const target = cards[cardIndex];
    const cloned = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.cardType}-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    const nextList = [...cards];
    nextList.splice(cardIndex + 1, 0, cloned);
    setCards(nextList);
  };

  const handleMoveCard = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    const nextList = [...cards];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIndex, 0, moved);
    setCards(nextList);
  };

  // Option handlers for multiple choice questions
  const handleAddOption = (cardId) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const currentOptions = c.options || [];
          return {
            ...c,
            options: [...currentOptions, `Option ${currentOptions.length + 1}`]
          };
        }
        return c;
      })
    );
  };

  const handleUpdateOption = (cardId, optIdx, text) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextOptions = [...(c.options || [])];
          nextOptions[optIdx] = text;
          return { ...c, options: nextOptions };
        }
        return c;
      })
    );
  };

  const handleRemoveOption = (cardId, optIdx) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            options: (c.options || []).filter((_, i) => i !== optIdx)
          };
        }
        return c;
      })
    );
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSave) {
      onSave({
        title: surveyTitle,
        targetPillar,
        estimatedTime,
        welcomeNote,
        updatedAt: new Date().toISOString(),
        cards
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Main Modal Dialog */}
      <div className="relative bg-[#F4F6F9] rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-[#19244E] px-6 py-5 text-white flex items-center justify-between border-b border-[#24336c]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E58422] flex items-center justify-center text-white font-black text-lg shadow-sm">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight text-white">
                  Customer Survey Builder
                </h3>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-extrabold text-[10px] rounded-md border border-amber-400/30">
                  {cards.length} Question Blocks
                </span>
              </div>
              <p className="text-[11px] text-[#FFF3E7]/80">
                Design custom questionnaires to capture cafe feedback and taste satisfaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode
                  ? 'bg-[#E58422] text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>{previewMode ? '✏️ Edit Mode' : '👁️ Customer Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {previewMode ? (
            /* ================================================================ */
            /* CUSTOMER PREVIEW MODE                                            */
            /* ================================================================ */
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto">
              <div className="text-center pb-6 border-b border-gray-100">
                <span className="px-3 py-1 bg-amber-50 text-[#E58422] font-black text-xs rounded-full uppercase tracking-wider">
                  {targetPillar} · {estimatedTime}
                </span>
                <h2 className="text-2xl font-black text-[#19244E] mt-3">
                  {surveyTitle}
                </h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {welcomeNote}
                </p>
              </div>

              <div className="space-y-6">
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3"
                  >
                    {card.cardType === 'title_card' ? (
                      <div className="py-2">
                        <h4 className="text-sm font-black text-[#19244E]">{card.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{card.description}</p>
                      </div>
                    ) : card.cardType === 'image_card' ? (
                      <div className="space-y-2">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-44 object-cover rounded-xl"
                        />
                        <h4 className="text-xs font-bold text-[#19244E]">{card.title}</h4>
                        <p className="text-[11px] text-gray-500">{card.caption}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-black text-[#19244E]">{idx + 1}.</span>
                          <span className="text-xs font-bold text-gray-900 flex-1">
                            {card.title} {card.required && <span className="text-rose-500">*</span>}
                          </span>
                        </div>

                        {card.type === 'rating_5' && (
                          <div className="flex items-center gap-2 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-lg hover:border-amber-400 hover:text-amber-500 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                        )}

                        {card.type === 'choice' && (
                          <div className="space-y-2 pt-1">
                            {(card.options || []).map((opt, i) => (
                              <label
                                key={i}
                                className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700 cursor-pointer hover:border-[#19244E]"
                              >
                                <input type="radio" name={`prev-${card.id}`} className="accent-[#E58422]" />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {card.type === 'linear_10' && (
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold px-1">
                              <span>{card.lowLabel || 'Not likely'}</span>
                              <span>{card.highLabel || 'Extremely likely'}</span>
                            </div>
                            <div className="grid grid-cols-11 gap-1">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  className="py-2 rounded-lg bg-white border border-gray-200 text-xs font-extrabold text-[#19244E] hover:bg-[#19244E] hover:text-white transition-all cursor-pointer text-center"
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {card.type === 'open_text' && (
                          <textarea
                            rows="2"
                            placeholder="Type your response here..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none"
                            disabled
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ================================================================ */
            /* BUILDER / EDITING MODE                                           */
            /* ================================================================ */
            <>
              {/* -------------------------------------------------------------- */}
              {/* TOP SECTION: TITLE, PILLAR, ESTIMATED TIME, WELCOME NOTE       */}
              {/* -------------------------------------------------------------- */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#E58422]">
                    Survey Meta & Introduction
                  </span>
                  <h3 className="text-base font-extrabold text-[#19244E]">
                    Top Section Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Survey Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                      Survey Title *
                    </label>
                    <input
                      type="text"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      placeholder="e.g. Customer Experience & Taste Survey"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* Estimated Completion Time */}
                  <div>
                    <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                      Estimated Completion Time
                    </label>
                    <input
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="e.g. 2 Minutes"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Target Pillar / Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                    Target Pillar / Category Dropdown
                  </label>
                  <select
                    value={targetPillar}
                    onChange={(e) => setTargetPillar(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    {INITIAL_PILLARS.map((pillar) => (
                      <option key={pillar} value={pillar}>
                        {pillar}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Welcome Note / Description Text Area */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-1.5">
                    Welcome Note / Description
                  </label>
                  <textarea
                    rows="3"
                    value={welcomeNote}
                    onChange={(e) => setWelcomeNote(e.target.value)}
                    placeholder="Welcome prompt shown to customer before questions start..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-700 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* -------------------------------------------------------------- */}
              {/* FORM CONTROLS MENU TOOLBAR                                     */}
              {/* Buttons: + Add Question, Import, Title Card, Image             */}
              {/* -------------------------------------------------------------- */}
              <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5 sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                    Add Controls:
                  </span>

                  {/* + Add Question Button */}
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-2 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="text-sm font-black leading-none">+</span>
                    <span>Add Question</span>
                  </button>

                  {/* Import Button */}
                  <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📥</span>
                    <span>Import</span>
                  </button>

                  {/* Title Card Button */}
                  <button
                    type="button"
                    onClick={handleAddTitleCard}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span>🔤</span>
                    <span>Title Card</span>
                  </button>

                  {/* Image Button */}
                  <button
                    type="button"
                    onClick={handleAddImageCard}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <span>🖼️</span>
                    <span>Image</span>
                  </button>
                </div>

                <div className="text-right pr-2">
                  <span className="text-[11px] font-extrabold text-[#19244E]">
                    {cards.length} Form Elements
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------------- */}
              {/* QUESTION CARDS LIST (EDITABLE QUESTION BLOCKS)                 */}
              {/* -------------------------------------------------------------- */}
              <div className="space-y-4">
                {cards.map((card, idx) => {
                  const isTitle = card.cardType === 'title_card';
                  const isImage = card.cardType === 'image_card';

                  return (
                    <div
                      key={card.id}
                      className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 space-y-4 hover:border-gray-300 transition-all group"
                    >
                      {/* Top Bar of the Card: Index / Type / Move Controls */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#19244E] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-[#19244E]">
                            {isTitle
                              ? 'Section Title Card'
                              : isImage
                              ? 'Visual Image Card'
                              : `Question Block`}
                          </span>
                        </div>

                        {/* Move Up / Move Down buttons */}
                        <div className="flex items-center gap-1 text-gray-400">
                          <button
                            type="button"
                            onClick={() => handleMoveCard(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 hover:text-gray-800 disabled:opacity-20 cursor-pointer text-xs"
                            title="Move up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCard(idx, 1)}
                            disabled={idx === cards.length - 1}
                            className="p-1 hover:text-gray-800 disabled:opacity-20 cursor-pointer text-xs"
                            title="Move down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {/* Title Card Fields */}
                      {isTitle ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Section Header Title
                            </label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => updateCard(card.id, { title: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Description Subtext
                            </label>
                            <input
                              type="text"
                              value={card.description}
                              onChange={(e) => updateCard(card.id, { description: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 outline-none focus:ring-2 focus:ring-[#E58422]"
                            />
                          </div>
                        </div>
                      ) : isImage ? (
                        /* Image Card Fields */
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <img
                              src={card.image}
                              alt="Visual Prompt"
                              className="w-24 h-20 rounded-xl object-cover border border-gray-200"
                            />
                            <div className="flex-1 space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                  Image Title
                                </label>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => updateCard(card.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-[#19244E] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                  Image URL
                                </label>
                                <input
                                  type="text"
                                  value={card.image}
                                  onChange={(e) => updateCard(card.id, { image: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard Question Card Fields */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Question Title */}
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Question Prompt *
                              </label>
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => updateCard(card.id, { title: e.target.value })}
                                placeholder="Type your question here..."
                                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#E58422] focus:bg-white"
                              />
                            </div>

                            {/* Question Type Selector Dropdown */}
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Question Type Dropdown
                              </label>
                              <select
                                value={card.type}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  let defaultOpts = card.options || [];
                                  if (newType === 'choice' && (!defaultOpts || defaultOpts.length === 0)) {
                                    defaultOpts = ['Option 1', 'Option 2', 'Option 3'];
                                  }
                                  updateCard(card.id, { type: newType, options: defaultOpts });
                                }}
                                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#19244E] outline-none focus:ring-2 focus:ring-[#E58422] cursor-pointer"
                              >
                                <option value="rating_5">Rating Scale (1-5 Stars)</option>
                                <option value="choice">Multiple Choice (Radio Options)</option>
                                <option value="linear_10">Linear Scale (0-10 NPS)</option>
                                <option value="open_text">Open Text Feedback</option>
                              </select>
                            </div>
                          </div>

                          {/* Dynamic Type Body / Preview */}
                          {card.type === 'rating_5' && (
                            <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-900">
                                5-Star Rating Preview:
                              </span>
                              <div className="flex items-center gap-1.5 text-base">
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                              </div>
                            </div>
                          )}

                          {card.type === 'choice' && (
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                                  Radio Options:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddOption(card.id)}
                                  className="text-[11px] font-extrabold text-[#E58422] hover:text-[#d47414] cursor-pointer"
                                >
                                  + Add Option
                                </button>
                              </div>

                              <div className="space-y-2">
                                {(card.options || []).map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) =>
                                        handleUpdateOption(card.id, optIdx, e.target.value)
                                      }
                                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#E58422]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOption(card.id, optIdx)}
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

                          {card.type === 'linear_10' && (
                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-gray-600">0 to 10 Linear Scale</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase">
                                    Left Label (0)
                                  </label>
                                  <input
                                    type="text"
                                    value={card.lowLabel || 'Not likely at all'}
                                    onChange={(e) => updateCard(card.id, { lowLabel: e.target.value })}
                                    className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-gray-400 uppercase">
                                    Right Label (10)
                                  </label>
                                  <input
                                    type="text"
                                    value={card.highLabel || 'Extremely likely'}
                                    onChange={(e) => updateCard(card.id, { highLabel: e.target.value })}
                                    className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {card.type === 'open_text' && (
                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                              <span className="text-[11px] text-gray-400 italic">
                                Customer will see an open-ended multi-line feedback response area.
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Bottom Actions: Required Toggle / Duplicate / Delete */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        {/* Required Toggle Switch (Only for question blocks) */}
                        {!isTitle && !isImage ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateCard(card.id, { required: !card.required })}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                                card.required ? 'bg-[#E58422]' : 'bg-gray-300'
                              }`}
                              title="Toggle required question"
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                  card.required ? 'translate-x-4.5' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[11px] font-bold ${
                                card.required ? 'text-amber-800' : 'text-gray-400'
                              }`}
                            >
                              {card.required ? 'Required Question' : 'Optional Question'}
                            </span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Duplicate Icon and Delete (Trash) Icon */}
                        <div className="flex items-center gap-2">
                          {/* Duplicate Icon */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateCard(card.id)}
                            className="p-2 text-gray-400 hover:text-[#19244E] hover:bg-gray-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            title="Duplicate this question"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-[11px] font-bold hidden sm:inline">Duplicate</span>
                          </button>

                          {/* Delete (Trash) Icon */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            title="Delete question card"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="text-[11px] font-bold hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">
              Changes will update the public Customer Voice survey flow.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
            >
              Save & Publish Survey
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Import Templates Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 cursor-pointer"
            onClick={() => setShowImportModal(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-[#19244E]">
                Import Survey Template
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Select a pre-designed cafe questionnaire to instantly populate your survey flow:
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleImportTemplate('taste')}
                className="w-full p-3.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-[#E58422] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#19244E] group-hover:text-[#E58422]">
                  ☕ Beverage Flavor & Calibration Audit
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Covers crema extraction, espresso balance, brew style, and serving temperature.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleImportTemplate('nps')}
                className="w-full p-3.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-[#E58422] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#19244E] group-hover:text-[#E58422]">
                  📊 Community Loyalty & NPS Check
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  0-10 recommendation score and open text highlights for rapid customer sentiment.
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilderModal;
