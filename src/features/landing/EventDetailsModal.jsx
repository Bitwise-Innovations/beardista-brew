import React, { useEffect, useMemo, useState } from 'react';
import {
  useEventForm,
  useRegisterForEvent,
  useResendEventCode,
  useVerifyEventCode,
} from '../../backend/hooks/useEvents';
import { formatEventWhen } from '../../backend/mappers/eventMapper';

export const THROWDOWN_TERMS = [
  {
    id: 1,
    title: '1. Throwdown Rules & Acceptance',
    content:
      'By registering for the Beardista Brew Latte Art Throwdown, competitors and guests agree to adhere to the official bracket rules, judging criteria, and call times announced by the organizing committee. Competitors must arrive 30 minutes before their designated heat.',
  },
  {
    id: 2,
    title: '2. Media & Broadcast Release',
    content:
      'Attendees and competitors grant Beardista Brew full and unrestricted rights to use photography, audiovisual footage, and competition pours captured during the event for promotional, live-stream, and social media purposes.',
  },
  {
    id: 3,
    title: '3. Sportsmanship & Conduct',
    content:
      'A fair, respectful, and encouraging environment is mandatory. Unsportsmanlike conduct or interference with judges, equipment, or fellow baristas may result in immediate disqualification without refund.',
  },
  {
    id: 4,
    title: '4. Safety & Equipment Liability',
    content:
      'Participants agree to handle commercial espresso machines and steaming pitchers with standard café safety protocols. Beardista Brew holds no liability for minor slips, hot liquid scalds, or personal gear loss.',
  },
  {
    id: 5,
    title: '5. Registration Transfer & Cancellations',
    content:
      'Competitor slots are non-refundable after October 30, 2026, but can be transferred to another certified barista with 48 hours advance notice by emailing throwdown@beardistabrew.com.',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_SECONDS = 60;

const inputClass =
  'w-full min-h-11 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111111] placeholder:text-gray-300 focus:outline-none focus:border-[#E58422] transition-colors';
const labelClass = 'block text-[11px] font-black tracking-wider text-[#19244E] uppercase mb-1.5';
const choiceClass =
  'flex min-h-11 items-center gap-3 rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#111111] cursor-pointer hover:border-gray-300';
const primaryButtonClass =
  'w-full min-h-11 py-4 bg-[#E58422] hover:bg-[#d47414] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait disabled:opacity-60';

const todayInManila = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
const optionLabel = (option) => (typeof option === 'string' ? option : option?.label ?? '');
const isEmptyAnswer = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && !value.trim()) ||
  (Array.isArray(value) && value.length === 0);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// One custom question from the admin form builder, in any of the 8 question types.
function QuestionField({ question, value, onChange }) {
  const id = `question-${question.id}`;
  const options = (question.options ?? []).map(optionLabel).filter(Boolean);
  let control;

  switch (question.type) {
    case 'paragraph':
      control = (
        <textarea id={id} rows={3} maxLength={2000} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-y`} />
      );
      break;
    case 'multiple_choice':
      control = (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="space-y-2">
          {options.map((option) => (
            <label key={option} className={choiceClass}>
              <input type="radio" name={id} checked={value === option} onChange={() => onChange(option)} className="accent-[#E58422]" />
              {option}
            </label>
          ))}
        </div>
      );
      break;
    case 'checkboxes': {
      const selected = Array.isArray(value) ? value : [];
      control = (
        <div role="group" aria-labelledby={`${id}-label`} className="space-y-2">
          {options.map((option) => (
            <label key={option} className={choiceClass}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() =>
                  onChange(selected.includes(option) ? selected.filter((entry) => entry !== option) : [...selected, option])
                }
                className="accent-[#E58422]"
              />
              {option}
            </label>
          ))}
        </div>
      );
      break;
    }
    case 'dropdown':
      control = (
        <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputClass} cursor-pointer`}>
          <option value="">Choose one</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
      break;
    case 'date':
      control = <input id={id} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    case 'email':
      control = <input id={id} type="email" maxLength={254} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    case 'phone':
      control = <input id={id} type="tel" inputMode="tel" maxLength={20} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
      break;
    default:
      control = <input id={id} type="text" maxLength={500} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
  }

  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className={labelClass}>
        {question.label}{' '}
        {question.required ? <span className="text-[#E58422]">*</span> : <span className="text-gray-400 font-normal">(OPTIONAL)</span>}
      </label>
      {question.help_text && <p className="-mt-0.5 mb-1.5 text-[11px] text-gray-500">{question.help_text}</p>}
      {control}
    </div>
  );
}

/**
 * EventDetailsModal: real sign-up for the featured event.
 * Steps: form -> code (6 digits by email) -> done (confirmed or waitlisted).
 */
export const EventDetailsModal = ({ isOpen, onClose, eventData }) => {
  const formQuery = useEventForm(isOpen ? eventData?.id : null);
  const register = useRegisterForEvent();
  const verify = useVerifyEventCode();
  const resend = useResendEventCode();

  const [step, setStep] = useState('form');
  const [typeId, setTypeId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [code, setCode] = useState('');
  const [resultStatus, setResultStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  const today = todayInManila();
  const types = useMemo(
    () =>
      (formQuery.data?.types ?? []).filter(
        (type) => (!type.opens_at || today >= type.opens_at) && (!type.closes_at || today <= type.closes_at)
      ),
    [formQuery.data, today]
  );
  const selectedType = types.find((type) => type.id === typeId) ?? null;
  const questions = (formQuery.data?.questions ?? []).filter((question) => question.participant_type_id === typeId);

  // Only one open type: pick it automatically.
  useEffect(() => {
    if (types.length === 1 && typeId === null) setTypeId(types[0].id);
  }, [types, typeId]);

  // Ticks once a second while the resend button is cooling down.
  useEffect(() => {
    if (!cooldownUntil) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);

  const resetAll = () => {
    setStep('form');
    setTypeId(null);
    setFullName('');
    setEmail('');
    setAnswers({});
    setAgreed(false);
    setRegistrationId(null);
    setCode('');
    setResultStatus(null);
    setErrorMessage('');
    setNotice('');
    setShowTerms(false);
    setCooldownUntil(0);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetAll, 200);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showTerms) setShowTerms(false);
        else handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  if (!isOpen) return null;

  const cooldown = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const when = formatEventWhen(eventData?.startTime);
  const busy = register.isPending || verify.isPending || resend.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!selectedType) return setErrorMessage('Please choose how you are joining.');
    if (!fullName.trim()) return setErrorMessage('Please enter your full name.');
    if (!EMAIL_PATTERN.test(email.trim())) return setErrorMessage('Please enter a valid email address.');
    const missing = questions.find((question) => question.required && isEmptyAnswer(answers[question.id]));
    if (missing) return setErrorMessage(`Please answer: ${missing.label}`);
    if (!agreed) return setErrorMessage('Please read and agree to the Terms & Conditions.');

    const payload = questions
      .filter((question) => !isEmptyAnswer(answers[question.id]))
      .map((question) => ({ questionId: question.id, value: answers[question.id] }));

    try {
      const result = await register.mutateAsync({
        eventId: eventData.id,
        participantTypeId: selectedType.id,
        email: email.trim(),
        fullName: fullName.trim(),
        answers: payload,
      });
      setRegistrationId(result.registrationId);
      setCooldownUntil(Date.now() + RESEND_SECONDS * 1000);
      setNow(Date.now());
      setStep('code');
    } catch (error) {
      // The sign-up was saved but the email failed: go to the code step so they can resend.
      if (error.details?.registrationId) {
        setRegistrationId(error.details.registrationId);
        setStep('code');
      }
      setErrorMessage(error.message);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');
    if (!/^\d{6}$/.test(code)) return setErrorMessage('Enter the 6-digit code from your email.');

    try {
      const result = await verify.mutateAsync({ registrationId, code });
      setResultStatus(result.status);
      setStep('done');
    } catch (error) {
      const details = error.details ?? {};
      setErrorMessage(
        details.attemptsLeft != null
          ? `Incorrect code. ${details.attemptsLeft} ${details.attemptsLeft === 1 ? 'try' : 'tries'} left.`
          : error.message
      );
      setCode('');
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setNotice('');
    try {
      await resend.mutateAsync(registrationId);
      setNotice('A new code is on its way. Check your inbox and spam folder.');
      setCooldownUntil(Date.now() + RESEND_SECONDS * 1000);
      setNow(Date.now());
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const spotsText = (type) => {
    if (!type.capacity) return 'Open registration';
    const left = Math.max(0, type.capacity - type.confirmed);
    return left > 0 ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'Full · join the waitlist';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="relative bg-white w-full max-w-[560px] rounded-[32px] overflow-hidden shadow-2xl border border-black/10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 md:p-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3.5 py-1 bg-[#FFF3E7] border border-[#E58422]/30 text-[#E58422] text-[11px] font-bold uppercase tracking-wider rounded-full">
              {eventData?.tag || 'Beardista Brew Event'}
            </span>
            <button
              onClick={handleClose}
              className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* ---------- STEP 1: FORM ---------- */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <h2 id="event-modal-title" className="text-3xl font-black text-[#19244E] tracking-tight uppercase">REGISTRATION</h2>
                <p className="text-gray-500 text-sm mt-1">{eventData?.title}</p>
                {(when || eventData?.location) && (
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#E58422] mt-1">
                    {[when, eventData?.location].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {formQuery.isPending ? (
                <p className="py-8 text-center text-sm font-semibold text-gray-500">Loading the form...</p>
              ) : formQuery.isError ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                  We couldn't load the form.{' '}
                  <button type="button" onClick={() => formQuery.refetch()} className="font-bold underline">Try again</button>
                </div>
              ) : types.length === 0 ? (
                <div className="p-6 bg-[#FFF3E7] rounded-2xl text-center">
                  <p className="font-bold text-[#19244E]">Registration isn't open right now.</p>
                  <p className="text-xs text-gray-500 mt-1">Please check back later.</p>
                </div>
              ) : (
                <>
                  {/* Participant types */}
                  {types.length > 1 && (
                    <div role="radiogroup" aria-label="How are you joining?" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {types.map((type) => {
                        const active = type.id === typeId;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setTypeId(type.id);
                              setErrorMessage('');
                            }}
                            className={`min-h-11 p-4 rounded-2xl flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
                              active ? 'border-2 border-[#E58422] bg-white shadow-xs' : 'border border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span>
                              <span className="block font-black text-[#19244E] text-sm uppercase leading-tight">{type.name}</span>
                              <span className="block text-gray-400 text-[11px] mt-0.5">{spotsText(type)}</span>
                            </span>
                            {active ? (
                              <span className="w-5 h-5 shrink-0 rounded-full bg-[#E58422] text-white flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            ) : (
                              <span className="w-5 h-5 shrink-0 rounded-full border-2 border-gray-300" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {types.length === 1 && selectedType && (
                    <p className="rounded-xl bg-[#FFF3E7] px-4 py-3 text-xs font-bold text-[#19244E]">
                      {selectedType.name} · <span className="text-[#E58422]">{spotsText(selectedType)}</span>
                    </p>
                  )}

                  {selectedType && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="event-full-name" className={labelClass}>FULL NAME <span className="text-[#E58422]">*</span></label>
                        <input id="event-full-name" type="text" autoComplete="name" maxLength={200} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="event-email" className={labelClass}>EMAIL ADDRESS <span className="text-[#E58422]">*</span></label>
                        <input id="event-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputClass} />
                        <p className="mt-1 text-[11px] text-gray-500">We'll send a 6-digit code here to confirm your spot.</p>
                      </div>

                      {questions.map((question) => (
                        <QuestionField
                          key={question.id}
                          question={question}
                          value={answers[question.id]}
                          onChange={(value) => {
                            setAnswers((current) => ({ ...current, [question.id]: value }));
                            setErrorMessage('');
                          }}
                        />
                      ))}

                      <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#E58422]"
                        />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          I agree to the{' '}
                          <button type="button" onClick={() => setShowTerms(true)} className="font-bold underline text-[#19244E] hover:text-[#E58422] cursor-pointer">
                            TERMS &amp; CONDITIONS
                          </button>
                          .
                        </span>
                      </label>
                    </div>
                  )}

                  {errorMessage && (
                    <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">{errorMessage}</div>
                  )}

                  <button type="submit" disabled={busy || !selectedType} className={primaryButtonClass}>
                    {register.isPending ? 'SENDING YOUR CODE...' : 'RESERVE MY SLOT'}
                  </button>
                </>
              )}
            </form>
          )}

          {/* ---------- STEP 2: CODE ---------- */}
          {step === 'code' && (
            <form onSubmit={handleVerify} noValidate className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E7] flex items-center justify-center mx-auto text-[#E58422]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 id="event-modal-title" className="text-2xl font-black text-[#19244E] uppercase tracking-tight">CHECK YOUR EMAIL</h2>
                <p className="text-sm text-gray-500 mt-2">
                  We sent a 6-digit code to <strong className="text-[#19244E] break-all">{email.trim()}</strong>. It expires in 10 minutes.
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ''));
                  setErrorMessage('');
                }}
                aria-label="6-digit code"
                placeholder="••••••"
                className="w-full min-h-11 px-4 py-4 border border-gray-200 rounded-2xl text-center text-3xl font-black tracking-[0.5em] text-[#19244E] focus:outline-none focus:border-[#E58422]"
              />

              {errorMessage && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">{errorMessage}</div>
              )}
              {notice && (
                <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">{notice}</div>
              )}

              <button type="submit" disabled={busy || code.length !== 6} className={primaryButtonClass}>
                {verify.isPending ? 'CHECKING...' : 'CONFIRM MY SPOT'}
              </button>

              <div className="flex flex-col items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={busy || cooldown > 0}
                  className="min-h-11 px-3 font-bold text-[#19244E] hover:text-[#E58422] disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : resend.isPending ? 'Sending...' : 'Resend code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setCode('');
                    setErrorMessage('');
                    setNotice('');
                  }}
                  className="min-h-11 px-3 text-gray-500 hover:text-[#19244E]"
                >
                  Wrong email? Go back
                </button>
              </div>
            </form>
          )}

          {/* ---------- STEP 3: DONE ---------- */}
          {step === 'done' && (
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm ${
                resultStatus === 'confirmed' ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]' : 'bg-amber-50 border border-amber-200 text-amber-600'
              }`}>
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF3E7] border border-[#E58422]/30 text-[#E58422] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                <span>✨</span>
                <span>{resultStatus === 'confirmed' ? 'REGISTRATION CONFIRMED' : 'ON THE WAITLIST'}</span>
              </div>

              <h2 id="event-modal-title" className="text-2xl sm:text-3xl font-black text-[#19244E] uppercase tracking-tight">
                {resultStatus === 'confirmed' ? "YOU'RE IN!" : "YOU'RE ON THE WAITLIST"}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 mb-6">
                {resultStatus === 'confirmed'
                  ? "We've emailed your confirmation. See you there!"
                  : "All spots are taken right now. We'll email you if one opens up."}
              </p>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-left space-y-1.5 mb-8">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">REGISTRATION REF</span>
                  <span className="text-xs font-bold text-[#19244E] font-mono">BB-{String(registrationId ?? '').slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="pt-2 font-bold text-[#19244E] text-sm">{fullName.trim()}</div>
                <div className="text-xs text-gray-500 break-all">{email.trim()}</div>
                {selectedType && <div className="text-xs font-bold text-[#E58422] pt-1">Joining as: {selectedType.name}</div>}
              </div>

              <button type="button" onClick={handleClose} className={primaryButtonClass}>THANK YOU</button>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions dialog */}
      {showTerms && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" onClick={(e) => { e.stopPropagation(); setShowTerms(false); }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="bg-white w-full max-w-2xl max-h-[85dvh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#19244E] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#E58422] uppercase tracking-widest block mb-0.5">Official Event Policies</span>
                <h3 id="terms-title" className="text-lg md:text-xl font-bold">Terms &amp; Conditions</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Terms"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto space-y-5 text-[#111111]">
              {THROWDOWN_TERMS.map((term) => (
                <div key={term.id} className="p-4 bg-neutral-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-sm text-[#19244E] mb-1.5">{term.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{term.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAgreed(true);
                  setShowTerms(false);
                }}
                className="min-h-11 px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors"
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