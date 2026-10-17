import React, { useState } from 'react';

/**
 * SurveyModal component renders the 3-step interactive customer feedback flow.
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Boolean controlling modal visibility
 * @param {Function} props.onClose - Dismiss callback to hide modal
 */
export const SurveyModal = ({ isOpen, onClose }) => {
  // Guard clause: Return null if modal is not open to avoid unnecessary DOM rendering
  if (!isOpen) return null;

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Single formData state object holding all user inputs across the steps
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    visitFrequency: 'Weekly regular',
    orderPreferences: ['Coffee'],
    orderHighlight: '',
    rating: 'Excellent',
    notes: ''
  });

  // State tracking the active step in the multi-step survey flow (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Helper function to update specific fields in the single formData state object
  const updateFormField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper to toggle order preferences pill selection
  const toggleOrderPreference = (category) => {
    setFormData((prev) => {
      const exists = prev.orderPreferences.includes(category);
      if (exists) {
        return {
          ...prev,
          orderPreferences: prev.orderPreferences.filter((c) => c !== category)
        };
      } else {
        return {
          ...prev,
          orderPreferences: [...prev.orderPreferences, category]
        };
      }
    });
  };

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // ============================================================================
  // MOCK DATABASE FUNCTION
  // Executed on Submit click in Step 2 to simulate MySQL backend persistence
  // ============================================================================
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Required simulation log for the academic examination panel
    console.log("Simulating MySQL Database POST request:", formData);

    // Transition to Step 3: Success Screen
    setCurrentStep(3);
  };

  // Reset and close handler
  const handleDone = () => {
    // Reset back to Step 1 for future opens
    setCurrentStep(1);
    if (onClose) onClose();
  };

  return (
    // Fixed backdrop overlay with dimming background blur
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={handleDone}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-black/10 flex flex-col max-h-[92vh] animate-scaleUp text-[#111111]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        
        {/* ================================================================== */}
        {/* MODAL HEADER: Title, Subtitle, Close Button & Progress Bar          */}
        {/* (Rendered on Step 1 and Step 2 as shown in the reference images)    */}
        {/* ================================================================== */}
        {currentStep !== 3 && (
          <div className="pt-6 px-6 sm:px-8 bg-white shrink-0">
            <div className="flex items-start justify-between pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#19244E] tracking-tight">
                  We Value Your Input
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                  Help us brew a better experience. (Step {currentStep} of 3)
                </p>
              </div>

              {/* Close '✕' Button */}
              <button
                onClick={handleDone}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Close survey"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stepped Progress Bar: 33% on Step 1, 66% on Step 2 */}
            <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#f3832b] h-full transition-all duration-300"
                style={{ width: currentStep === 1 ? '33.33%' : '66.66%' }}
              />
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL BODY CONTAINER (Scrollable)                                  */}
        {/* ================================================================== */}
        <div className="overflow-y-auto grow p-6 sm:p-8">
          
          {/* ================================================================ */}
          {/* STEP 1: CUSTOMER PROFILE & ORDER PREFERENCES                      */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* --- SECTION 1: Customer Profile --- */}
              <div>
                {/* Section Header */}
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <svg className="w-5 h-5 text-[#19244E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Customer Profile</span>
                </div>

                {/* 2-Column Inputs: Customer Name and Age Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#19244E] mb-1.5">
                      Customer Name <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-none text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
                    />
                  </div>

                  {/* Age Group Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#19244E] mb-1.5">
                      Age Group
                    </label>
                    <div className="relative">
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => updateFormField('ageGroup', e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 bg-white border border-neutral-300 rounded-md text-sm text-[#19244E] shadow-xs focus:outline-none focus:border-[#19244E] cursor-pointer"
                      >
                        <option value="">Select an age group</option>
                        <option value="Under 18">Under 18</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55+">55+</option>
                      </select>
                      {/* Dropdown Chevron Glyph */}
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visit Frequency: 2x2 Grid Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] mb-2">
                    Visit Frequency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'First-time visitor',
                      'Weekly regular',
                      'Monthly regular',
                      'Occasional'
                    ].map((frequency) => {
                      const isSelected = formData.visitFrequency === frequency;
                      return (
                        <div
                          key={frequency}
                          onClick={() => updateFormField('visitFrequency', frequency)}
                          className={`p-3.5 rounded-xl border flex items-center cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#fff6ee] border-[#f3832b] shadow-xs'
                              : 'bg-[#fffaf5] border-[#f7e6d5] hover:border-orange-300'
                          }`}
                        >
                          {/* Radio Check Circle */}
                          <div
                            className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#f3832b]' : 'border-neutral-400'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#f3832b]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-[#19244E]">
                            {frequency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: Order & Menu Preferences --- */}
              <div>
                {/* Section Header */}
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  {/* Crossed Cutlery Glyph */}
                  <svg className="w-5 h-5 text-[#19244E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Order &amp; Menu Preferences</span>
                </div>

                {/* Question: What did you order today? */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#19244E] mb-2.5">
                    What did you order today?
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Coffee', 'Non-Coffee', 'Cocktails', 'Food'].map((category) => {
                      const isSelected = formData.orderPreferences.includes(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleOrderPreference(category)}
                          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#19244E] text-white shadow-xs'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-[#19244E]'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Highlight of your order */}
                <div>
                  <label className="block text-xs font-bold text-[#19244E] mb-1.5">
                    What was the highlight of your order today? <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., The creamy-salty foam on the Hiromi"
                    value={formData.orderHighlight}
                    onChange={(e) => updateFormField('orderHighlight', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-none text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: EXPERIENCE & ADDITIONAL NOTES                             */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* --- SECTION 1: Your Experience --- */}
              <div>
                {/* Section Header */}
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <span className="text-lg leading-none">★</span>
                  <span>Your Experience</span>
                </div>

                <label className="block text-xs font-bold text-[#19244E] mb-3">
                  How would you rate your overall experience at Beardista Brew today?
                </label>

                {/* 5-Point Emoticon Scale Cards */}
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[
                    { label: 'Very Poor', icon: '😵' },
                    { label: 'Poor', icon: '🙁' },
                    { label: 'Average', icon: '😐' },
                    { label: 'Good', icon: '🙂' },
                    { label: 'Excellent', icon: '😄' }
                  ].map((tier) => {
                    const isSelected = formData.rating === tier.label;
                    return (
                      <div
                        key={tier.label}
                        onClick={() => updateFormField('rating', tier.label)}
                        className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#19244E] text-white border-[#19244E] shadow-md scale-102'
                            : 'bg-[#fffaf5] border-[#f7e6d5] hover:border-orange-300 text-[#19244E]'
                        }`}
                      >
                        {/* Emoticon Face */}
                        <span className="text-2xl sm:text-3xl mb-1.5">{tier.icon}</span>
                        {/* Tier Label */}
                        <span
                          className={`text-[10px] sm:text-xs font-bold leading-tight ${
                            isSelected ? 'text-white' : 'text-[#19244E]'
                          }`}
                        >
                          {tier.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- SECTION 2: Additional Notes --- */}
              <div>
                {/* Section Header */}
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  {/* Notes / Pen Glyph */}
                  <svg className="w-5 h-5 text-[#19244E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Additional Notes</span>
                </div>

                <label className="block text-xs font-bold text-[#19244E] mb-2">
                  Any other thoughts, suggestions, or feedback? <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>

                <textarea
                  rows={4}
                  placeholder="Tell us more! We'd love to hear about your favorite drink, our staff, or anything we can improve..."
                  value={formData.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-none text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E] leading-relaxed"
                />
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: SUCCESS CONFIRMATION                                      */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
              
              {/* Checkmark Badge matching reference image */}
              <div className="w-20 h-20 rounded-2xl bg-[#fff2e5] p-2.5 flex items-center justify-center mb-6 shadow-xs border border-[#fde4cc]">
                <div className="w-full h-full rounded-xl bg-[#f3832b] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Thank You Title */}
              <h3 className="text-3xl sm:text-4xl font-black text-[#19244E] tracking-tight mb-3">
                Thank You!
              </h3>

              {/* Confirmation Text */}
              <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed mb-8">
                Your feedback has been successfully submitted. We appreciate your time and look forward to serving you again soon!
              </p>

              {/* Done Close Button */}
              <button
                type="button"
                onClick={handleDone}
                className="w-48 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                DONE
              </button>

            </div>
          )}

        </div>

        {/* ================================================================== */}
        {/* MODAL FOOTER ACTIONS                                               */}
        {/* ================================================================== */}
        {currentStep === 1 && (
          <div className="p-4 sm:p-6 bg-white border-t border-black/5 flex justify-end shrink-0">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-7 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>NEXT</span>
              <span>→</span>
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-4 sm:p-6 bg-white border-t border-black/5 flex items-center justify-between shrink-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#19244E] hover:text-[#f3832b] transition-colors cursor-pointer"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-7 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>SUBMIT</span>
              <span>✓</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SurveyModal;
