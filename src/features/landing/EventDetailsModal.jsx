import React, { useState } from 'react';

/**
 * 5 Official Terms & Conditions specified for the Latte Art Throwdown
 */
export const THROWDOWN_TERMS = [
  {
    id: 1,
    title: "1. Throwdown Rules & Acceptance",
    content:
      "By registering for the Beardista Brew Latte Art Throwdown, competitors and guests agree to adhere to the official bracket rules, judging criteria, and call times announced by the organizing committee. Competitors must arrive 30 minutes before their designated heat."
  },
  {
    id: 2,
    title: "2. Media & Broadcast Release",
    content:
      "Attendees and competitors grant Beardista Brew full and unrestricted rights to use photography, audiovisual footage, and competition pours captured during the event for promotional, live-stream, and social media purposes."
  },
  {
    id: 3,
    title: "3. Sportsmanship & Conduct",
    content:
      "A fair, respectful, and encouraging environment is mandatory. Unsportsmanlike conduct or interference with judges, equipment, or fellow baristas may result in immediate disqualification without refund."
  },
  {
    id: 4,
    title: "4. Safety & Equipment Liability",
    content:
      "Participants agree to handle commercial espresso machines and steaming pitchers with standard café safety protocols. Beardista Brew holds no liability for minor slips, hot liquid scalds, or personal gear loss."
  },
  {
    id: 5,
    title: "5. Registration Transfer & Cancellations",
    content:
      "Competitor slots are non-refundable after October 30, 2026, but can be transferred to another certified barista with 48 hours advance notice by emailing throwdown@beardistabrew.com."
  }
];

/**
 * EventDetailsModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal dialog is visible
 * @param {Function} props.onClose - Callback function to dismiss the modal
 * @param {Object} props.eventData - Context data for the event
 */
export const EventDetailsModal = ({ isOpen, onClose, eventData }) => {
  // ---------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ---------------------------------------------------------------------------

  // Role selection: 'competitor' (Image 1) or 'spectator' (Image 2)
  const [role, setRole] = useState('competitor');

  // Multi-step tracker:
  // Step 1: Initial Profile & Terms
  // Step 2: Competitor details (only for role === 'competitor')
  // Step 3: Confirmation / Thank You modal (Image 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form input data state
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    contactNumber: '',
    agreedToTerms: false,
    baristaRole: 'Barista',
    representingCafe: '',
    experience: '1–2 years'
  });

  // State to toggle the dedicated Terms & Conditions dialog
  const [showTermsModal, setShowTermsModal] = useState(false);

  // State to hold generated registration reference code
  const [refCode, setRefCode] = useState('');

  // Form validation feedback state
  const [errorMessage, setErrorMessage] = useState('');

  // Guard: Do not render anything when modal is not active
  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  // Handle generic text/select input updates with strict constraints
  const handleInputChange = (field, value) => {
    // 1. AGE CONSTRAINT: Maximum 99 years old, non-negative digits only
    if (field === 'age') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly === '') {
        setFormData((prev) => ({ ...prev, age: '' }));
      } else {
        const num = parseInt(digitsOnly, 10);
        // Prevent exceeding 99 years old
        if (num > 99) {
          setFormData((prev) => ({ ...prev, age: '99' }));
        } else {
          setFormData((prev) => ({ ...prev, age: String(num) }));
        }
      }
      if (errorMessage) setErrorMessage('');
      return;
    }

    // 2. CONTACT NUMBER CONSTRAINT: Maximum 10 digits only
    if (field === 'contactNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, contactNumber: digitsOnly }));
      if (errorMessage) setErrorMessage('');
      return;
    }

    // Default for other fields
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Switch role between competitor and spectator
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (errorMessage) setErrorMessage('');
  };

  // Validate Step 1 and proceed
  const handleNextStep1 = () => {
    // 1. Validate Full Name
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // 2. Validate Age: Cannot exceed 99 years old
    const ageNum = parseInt(formData.age, 10);
    if (!formData.age.trim() || isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      setErrorMessage('Age must be a valid number between 1 and 99 years old.');
      return;
    }

    // 3. Validate Email Address: Must contain '@' and '.com'
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const hasAt = emailTrimmed.includes('@');
    const hasDotCom = emailTrimmed.toLowerCase().includes('.com');
    const validFormat = /^[^\s@]+@[^\s@]+\.com$/i.test(emailTrimmed);
    if (!hasAt || !hasDotCom || !validFormat) {
      setErrorMessage("Email address must have a valid format containing '@' and ending with '.com' (e.g. name@example.com).");
      return;
    }

    // 4. Validate Contact Number: Exactly 10 digits for competitor
    if (role === 'competitor') {
      const cleanNumber = formData.contactNumber.replace(/\D/g, '');
      if (!cleanNumber) {
        setErrorMessage('Please enter your 10-digit contact number.');
        return;
      }
      if (cleanNumber.length !== 10) {
        setErrorMessage('Contact number must be exactly 10 digits (e.g. 9123456789).');
        return;
      }
    }

    // 5. Validate Terms & Conditions agreement
    if (!formData.agreedToTerms) {
      setErrorMessage('Please read and agree to the Terms & Conditions.');
      return;
    }

    setErrorMessage('');

    if (role === 'competitor') {
      // Competitor proceeds to Step 2 (Tell us about yourself)
      setCurrentStep(2);
    } else {
      // Spectator completes reservation in 1 step -> generates ref & moves to Thank You
      const generatedRef = `BB-SPEC-${Math.floor(1000 + Math.random() * 9000)}`;
      setRefCode(generatedRef);

      // Simulate database POST request for academic defense
      console.log('Simulating Spectator Reservation MySQL POST:', {
        role: 'Spectator',
        refCode: generatedRef,
        ...formData
      });

      setCurrentStep(3);
    }
  };

  // Complete Step 2 for Competitor registration
  const handleSubmitCompetitor = (e) => {
    if (e) e.preventDefault();

    const generatedRef = `BB-COMP-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefCode(generatedRef);

    // Simulate database POST request for academic defense
    console.log('Simulating Competitor Registration MySQL POST:', {
      role: 'Competitor',
      refCode: generatedRef,
      ...formData
    });

    setCurrentStep(3);
  };

  // Reset modal state and close
  const handleModalClose = () => {
    onClose();
    // Reset wizard back to initial state after smooth exit
    setTimeout(() => {
      setRole('competitor');
      setCurrentStep(1);
      setFormData({
        fullName: '',
        age: '',
        email: '',
        contactNumber: '',
        agreedToTerms: false,
        baristaRole: 'Barista',
        representingCafe: '',
        experience: '1–2 years'
      });
      setErrorMessage('');
      setShowTermsModal(false);
    }, 200);
  };

  return (
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={handleModalClose}
    >
      {/* Modal Dialog Container */}
      <div
        className="relative bg-white w-full max-w-[560px] rounded-[32px] overflow-hidden shadow-2xl border border-black/10 my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================================== */}
        {/* VIEW 1 & 2: REGISTRATION FORM (STEP 1 & STEP 2)                      */}
        {/* ==================================================================== */}
        {currentStep !== 3 ? (
          <div className="p-6 sm:p-8 md:p-10">
            {/* Top Bar: Brand Pill + Close Button */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3.5 py-1 bg-[#FFF3E7] border border-[#E58422]/30 text-[#E58422] text-[11px] font-bold uppercase tracking-wider rounded-full">
                Beardista Brew Specialty
              </span>

              <button
                onClick={handleModalClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Header Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-[#19244E] tracking-tight uppercase">
                REGISTRATION
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {currentStep === 1
                  ? 'Please fill out your information below to reserve your slot.'
                  : 'Tell us about yourself!'}
              </p>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* STEP 1: ROLE SELECTION & PERSONAL DETAILS (IMAGES 1 & 2)         */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-5">
                {/* 2-Column Role Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Card 1: COMPETITOR */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('competitor')}
                    className={`relative p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      role === 'competitor'
                        ? 'border-2 border-[#E58422] bg-white shadow-xs'
                        : 'border border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Trophy Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          role === 'competitor'
                            ? 'bg-[#FFF3E7] text-[#E58422]'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-1.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>

                      <div>
                        <div className="font-black text-[#19244E] text-sm leading-tight">
                          COMPETITOR{' '}
                          <span className="text-[#E58422] font-bold text-xs">
                            (MGA KASALI)
                          </span>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          Compete in the throwdown
                        </div>
                      </div>
                    </div>

                    {/* Radio Button Indicator */}
                    <div className="ml-2 shrink-0">
                      {role === 'competitor' ? (
                        <div className="w-5 h-5 rounded-full bg-[#E58422] text-white flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </button>

                  {/* Card 2: SPECTATOR */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('spectator')}
                    className={`relative p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      role === 'spectator'
                        ? 'border-2 border-[#E58422] bg-white shadow-xs'
                        : 'border border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Spectator User Group Icon */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          role === 'spectator'
                            ? 'bg-[#FFF3E7] text-[#E58422]'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>

                      <div>
                        <div className="font-bold text-[#19244E] text-sm leading-tight">
                          SPECTATOR
                        </div>
                        <div className="text-gray-500 font-semibold text-xs leading-tight">
                          (MANONOOD/BISITA)
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          Audience &amp; spectator pass
                        </div>
                      </div>
                    </div>

                    {/* Radio Button Indicator */}
                    <div className="ml-2 shrink-0">
                      {role === 'spectator' ? (
                        <div className="w-5 h-5 rounded-full bg-[#E58422] text-white flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4 pt-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase mb-1.5">
                      FULL NAME <span className="text-[#E58422]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none focus:border-[#E58422] transition-colors"
                    />
                  </div>

                  {/* Age and Email Address Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Age */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase">
                          AGE <span className="text-[#E58422]">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-semibold">Max 99 yrs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="e.g. 24"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none focus:border-[#E58422] transition-colors pr-14"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                          YRS
                        </span>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase">
                          EMAIL ADDRESS <span className="text-[#E58422]">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-semibold">Must have @ &amp; .com</span>
                      </div>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none focus:border-[#E58422] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Contact Number (Shown for Competitor in Image 1) */}
                  {role === 'competitor' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase">
                          CONTACT NUMBER <span className="text-[#E58422]">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {formData.contactNumber.length}/10 digits max
                        </span>
                      </div>
                      <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#E58422] transition-colors">
                        {/* Country code prefix */}
                        <div className="px-3.5 py-3 bg-gray-50 border-r border-gray-200 flex items-center gap-1.5 text-xs font-semibold text-gray-700 select-none">
                          <span role="img" aria-label="Philippines" className="text-base">
                            🇵🇭
                          </span>
                          <span>+63</span>
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        {/* Phone input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          placeholder="912 345 6789"
                          value={formData.contactNumber}
                          onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                          className="flex-1 px-4 py-3 bg-white text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#E58422] focus:ring-[#E58422] border-gray-300 cursor-pointer accent-[#E58422]"
                      />
                      <span className="text-xs text-gray-600 leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="font-bold underline text-[#19244E] hover:text-[#E58422] cursor-pointer"
                        >
                          TERMS &amp; CONDITIONS
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="font-bold underline text-[#19244E] hover:text-[#E58422] cursor-pointer"
                        >
                          PRIVACY POLICY
                        </button>
                        .
                      </span>
                    </label>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Step Indicator & Action Button Area */}
                <div className="pt-4 space-y-4">
                  {/* Competitor shows "STEP 1 OF 2" with 2 progress bars (Image 1) */}
                  {role === 'competitor' ? (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-400 tracking-wider uppercase">
                          STEP 1 OF 2
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1.5 rounded-full bg-[#E58422]" />
                          <div className="w-8 h-1.5 rounded-full bg-gray-200" />
                        </div>
                      </div>

                      {/* "NEXT ➔" Button */}
                      <button
                        type="button"
                        onClick={handleNextStep1}
                        className="w-full py-4 bg-[#E58422] hover:bg-[#d47414] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>NEXT</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    /* Spectator shows "RESERVE MY SLOT ➔" directly (Image 2) */
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="w-full py-4 bg-[#E58422] hover:bg-[#d47414] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>RESERVE MY SLOT</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}

                  {/* Security Guarantee Badge */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>256-bit Encrypted Reservation Guarantee</span>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 2: COMPETITOR DETAILS (IMAGE 3)                             */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Back Link + Step Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#19244E] hover:text-[#E58422] transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>BACK</span>
                  </button>

                  <span className="text-[11px] font-bold text-[#E58422] bg-[#FFF3E7] px-3 py-1 rounded-full uppercase tracking-wider">
                    COMPETITOR DETAILS
                  </span>
                </div>

                {/* Sub-heading */}
                <div>
                  <h3 className="text-lg font-black text-[#19244E] uppercase tracking-tight">
                    TELL US ABOUT YOURSELF!
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure your competitor profile and coffee background for the judges table.
                  </p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  {/* Role Dropdown */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase mb-1.5">
                      WHAT IS YOUR ROLE? <span className="text-[#E58422]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.baristaRole}
                        onChange={(e) => handleInputChange('baristaRole', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#E58422] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Barista">Barista</option>
                        <option value="Head Barista">Head Barista</option>
                        <option value="Home Brewer / Enthusiast">Home Brewer / Enthusiast</option>
                        <option value="Coffee Roaster">Coffee Roaster</option>
                        <option value="Café Owner / Manager">Café Owner / Manager</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Representing What Cafe */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase mb-1.5">
                      REPRESENTING WHAT CAFE?{' '}
                      <span className="text-gray-400 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Beardista Brew, Yardstick, Independent"
                      value={formData.representingCafe}
                      onChange={(e) => handleInputChange('representingCafe', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none focus:border-[#E58422] transition-colors"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider text-[#19244E] uppercase mb-1.5">
                      YEARS OF EXPERIENCE <span className="text-[#E58422]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#E58422] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="< 1 year">&lt; 1 year</option>
                        <option value="1–2 years">1–2 years</option>
                        <option value="3–5 years">3–5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator & Submit Button */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-400 tracking-wider uppercase">
                      STEP 2 OF 2
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1.5 rounded-full bg-[#E58422]" />
                      <div className="w-8 h-1.5 rounded-full bg-[#E58422]" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitCompetitor}
                    className="w-full py-4 bg-[#E58422] hover:bg-[#d47414] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>SUBMIT REGISTRATION</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================== */
          /* VIEW 3: CONFIRMATION / THANK YOU MODAL (IMAGE 4)                   */
          /* ================================================================== */
          <div className="p-8 sm:p-10 text-center">
            {/* Close 'X' Button at top-right */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleModalClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Glowing Circular Icon with Envelope & Checkmark */}
            <div className="w-20 h-20 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-5 text-[#059669] shadow-sm">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11l2 2 4-4" />
              </svg>
            </div>

            {/* Registration Confirmed Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF3E7] border border-[#E58422]/30 text-[#E58422] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              <span>✨</span>
              <span>REGISTRATION CONFIRMED</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#19244E] uppercase tracking-tight">
              {role === 'competitor' ? 'COMPETITOR RESERVED!' : 'SPECTATOR RESERVED!'}
            </h2>

            {/* Sub-headline as requested */}
            <p className="text-gray-600 text-sm sm:text-base mt-2 mb-6">
              Please check your email for more details. See you!
            </p>

            {/* Confirmation Receipt Box */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-left space-y-1.5 mb-8">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  REGISTRATION REF
                </span>
                <span className="text-xs font-bold text-[#19244E] font-mono">
                  {refCode || (role === 'competitor' ? 'BB-COMP-2048' : 'BB-SPEC-1024')}
                </span>
              </div>

              {/* Name */}
              <div className="pt-2 font-bold text-[#19244E] text-sm">
                {formData.fullName || 'Participant'}
              </div>

              {/* Email */}
              <div className="text-xs text-gray-500">
                {formData.email || 'guest@example.com'}
              </div>

              {/* Role Line */}
              <div className="text-xs font-bold text-[#E58422] pt-1">
                Role:{' '}
                {role === 'competitor'
                  ? 'Competitor (mga kasali)'
                  : 'Spectator (manonood/bisita)'}
              </div>
            </div>

            {/* Primary Action "THANK YOU" Button */}
            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-4 bg-[#E58422] hover:bg-[#d47414] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              THANK YOU
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* OVERLAY: 5 OFFICIAL TERMS & CONDITIONS DIALOG                          */}
      {/* ====================================================================== */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[85dvh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-[#19244E] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#E58422] uppercase tracking-widest block mb-0.5">
                  Official Event Policies
                </span>
                <h3 className="text-lg md:text-xl font-bold">
                  Latte Art Throwdown Terms &amp; Conditions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Terms"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Terms List Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#111111]">
              <p className="text-xs text-gray-500 leading-relaxed">
                Please review the guidelines below governing registration, participant conduct, media rights, and liability for the Beardista Brew Latte Art Throwdown.
              </p>

              <div className="space-y-5">
                {THROWDOWN_TERMS.map((term) => (
                  <div key={term.id} className="p-4 bg-neutral-50 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-sm text-[#19244E] mb-1.5">
                      {term.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {term.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Effective for October 2026 Event
              </span>
              <button
                type="button"
                onClick={() => {
                  handleInputChange('agreedToTerms', true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsModal;
