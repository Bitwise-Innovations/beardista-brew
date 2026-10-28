import React, { useEffect, useState } from 'react';
import { useSubmitSurvey } from '../../backend/hooks/useCustomerFeedback';

const EMPTY_FORM = {
  name: '',
  ageGroup: '',
  visitFrequency: 'Weekly regular',
  orderPreferences: ['Coffee'],
  orderHighlight: '',
  rating: 'Excellent',
  notes: '',
};

const FREQUENCIES = ['First-time visitor', 'Weekly regular', 'Monthly regular', 'Occasional'];
const ORDER_TYPES = ['Coffee', 'Non-Coffee', 'Cocktails', 'Food'];
const RATINGS = [
  { label: 'Very Poor', icon: '😵' },
  { label: 'Poor', icon: '🙁' },
  { label: 'Average', icon: '😐' },
  { label: 'Good', icon: '🙂' },
  { label: 'Excellent', icon: '😄' },
];

/**
 * SurveyModal: 3-step customer feedback. Answers are saved to Supabase.
 */
export const SurveyModal = ({ isOpen, onClose }) => {
  // Hooks always run first, before any early return.
  const submitSurvey = useSubmitSurvey();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDone = () => {
    setCurrentStep(1);
    setFormData(EMPTY_FORM);
    setErrorMessage('');
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleDone();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  if (!isOpen) return null;

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const toggleOrderPreference = (category) => {
    setFormData((prev) => ({
      ...prev,
      orderPreferences: prev.orderPreferences.includes(category)
        ? prev.orderPreferences.filter((entry) => entry !== category)
        : [...prev.orderPreferences, category],
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    try {
      await submitSurvey.mutateAsync(formData);
      setCurrentStep(3);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" onClick={handleDone}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-title"
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-black/10 flex flex-col max-h-[92dvh] animate-scaleUp text-[#111111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with progress bar (steps 1 and 2) */}
        {currentStep !== 3 && (
          <div className="pt-6 px-6 sm:px-8 bg-white shrink-0">
            <div className="flex items-start justify-between pb-4">
              <div>
                <h2 id="survey-title" className="text-2xl sm:text-3xl font-black text-[#19244E] tracking-tight">We Value Your Input</h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                  Help us brew a better experience. (Step {currentStep} of 3)
                </p>
              </div>
              <button
                onClick={handleDone}
                className="flex h-11 w-11 items-center justify-center text-neutral-400 hover:text-neutral-700 rounded-full transition-colors cursor-pointer"
                aria-label="Close survey"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
              <div className="bg-[#f3832b] h-full transition-all duration-300" style={{ width: currentStep === 1 ? '33.33%' : '66.66%' }} />
            </div>
          </div>
        )}

        <div className="overflow-y-auto grow p-6 sm:p-8">
          {/* STEP 1: profile and order */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Customer Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label htmlFor="survey-name" className="block text-xs font-bold text-[#19244E] mb-1.5">
                      Customer Name <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="survey-name"
                      type="text"
                      maxLength={80}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      className="w-full min-h-11 px-3.5 py-2.5 bg-white border border-neutral-300 text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
                    />
                    <p className="mt-1 text-[11px] text-neutral-400">May be shown with your comment on our website.</p>
                  </div>

                  <div>
                    <label htmlFor="survey-age" className="block text-xs font-bold text-[#19244E] mb-1.5">Age Group</label>
                    <select
                      id="survey-age"
                      value={formData.ageGroup}
                      onChange={(e) => updateFormField('ageGroup', e.target.value)}
                      className="w-full min-h-11 px-4 py-2.5 bg-white border border-neutral-300 rounded-md text-sm text-[#19244E] focus:outline-none focus:border-[#19244E] cursor-pointer"
                    >
                      <option value="">Select an age group</option>
                      {['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="block text-xs font-bold text-[#19244E] mb-2">Visit Frequency</p>
                <div role="radiogroup" aria-label="Visit frequency" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FREQUENCIES.map((frequency) => {
                    const isSelected = formData.visitFrequency === frequency;
                    return (
                      <button
                        key={frequency}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => updateFormField('visitFrequency', frequency)}
                        className={`min-h-11 p-3.5 rounded-xl border flex items-center text-left cursor-pointer transition-all ${
                          isSelected ? 'bg-[#fff6ee] border-[#f3832b] shadow-xs' : 'bg-[#fffaf5] border-[#f7e6d5] hover:border-orange-300'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#f3832b]' : 'border-neutral-400'}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#f3832b]" />}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#19244E]">{frequency}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <span aria-hidden="true">🍽️</span>
                  <span>Order &amp; Menu Preferences</span>
                </div>

                <p className="block text-xs font-bold text-[#19244E] mb-2.5">What did you order today?</p>
                <div className="flex flex-wrap gap-2.5 mb-5">
                  {ORDER_TYPES.map((category) => {
                    const isSelected = formData.orderPreferences.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleOrderPreference(category)}
                        className={`min-h-11 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          isSelected ? 'bg-[#19244E] text-white shadow-xs' : 'bg-neutral-100 hover:bg-neutral-200 text-[#19244E]'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                <label htmlFor="survey-highlight" className="block text-xs font-bold text-[#19244E] mb-1.5">
                  What was the highlight of your order today? <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="survey-highlight"
                  type="text"
                  maxLength={200}
                  placeholder="e.g., The creamy-salty foam on the Hiromi"
                  value={formData.orderHighlight}
                  onChange={(e) => updateFormField('orderHighlight', e.target.value)}
                  className="w-full min-h-11 px-3.5 py-2.5 bg-white border border-neutral-300 text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: rating and notes */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <span className="text-lg leading-none">★</span>
                  <span>Your Experience</span>
                </div>
                <p className="block text-xs font-bold text-[#19244E] mb-3">
                  How would you rate your overall experience at Beardista Brew today?
                </p>
                <div role="radiogroup" aria-label="Overall rating" className="grid grid-cols-5 gap-2 sm:gap-3">
                  {RATINGS.map((tier) => {
                    const isSelected = formData.rating === tier.label;
                    return (
                      <button
                        key={tier.label}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => updateFormField('rating', tier.label)}
                        className={`min-h-11 flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border transition-all cursor-pointer text-center ${
                          isSelected ? 'bg-[#19244E] text-white border-[#19244E] shadow-md' : 'bg-[#fffaf5] border-[#f7e6d5] hover:border-orange-300 text-[#19244E]'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl mb-1.5" aria-hidden="true">{tier.icon}</span>
                        <span className="text-[10px] sm:text-xs font-bold leading-tight">{tier.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 text-xl font-extrabold text-[#19244E] pb-3 border-b border-black/5 mb-5">
                  <span aria-hidden="true">✍️</span>
                  <span>Additional Notes</span>
                </div>
                <label htmlFor="survey-notes" className="block text-xs font-bold text-[#19244E] mb-2">
                  Any other thoughts, suggestions, or feedback? <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="survey-notes"
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us more! We'd love to hear about your favorite drink, our staff, or anything we can improve..."
                  value={formData.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 text-sm text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E] leading-relaxed"
                />
                <p className="mt-1 text-right text-[11px] text-neutral-400">{formData.notes.length}/1000</p>
              </div>

              {errorMessage && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">{errorMessage}</div>
              )}
            </div>
          )}

          {/* STEP 3: thank you */}
          {currentStep === 3 && (
            <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-2xl bg-[#fff2e5] p-2.5 flex items-center justify-center mb-6 shadow-xs border border-[#fde4cc]">
                <div className="w-full h-full rounded-xl bg-[#f3832b] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 id="survey-title" className="text-3xl sm:text-4xl font-black text-[#19244E] tracking-tight mb-3">Thank You!</h3>
              <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed mb-8">
                Your feedback has been sent. We appreciate your time and look forward to serving you again soon!
              </p>
              <button
                type="button"
                onClick={handleDone}
                className="w-48 min-h-11 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                DONE
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {currentStep === 1 && (
          <div className="p-4 sm:p-6 bg-white border-t border-black/5 flex justify-end shrink-0">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex min-h-11 items-center gap-1.5 px-7 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>NEXT</span>
              <span>→</span>
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-4 sm:p-6 bg-white border-t border-black/5 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              disabled={submitSurvey.isPending}
              className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-extrabold uppercase tracking-wider text-[#19244E] hover:text-[#f3832b] transition-colors cursor-pointer"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitSurvey.isPending}
              className="inline-flex min-h-11 items-center gap-1.5 px-7 py-3 bg-[#f3832b] hover:bg-[#e0721c] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60"
            >
              <span>{submitSurvey.isPending ? 'SENDING...' : 'SUBMIT'}</span>
              {!submitSurvey.isPending && <span>✓</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyModal;