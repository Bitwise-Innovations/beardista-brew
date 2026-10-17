import React, { useState, useEffect } from 'react';

export const MobileLogin = ({
  onLoginSuccess,
  onBackToCustomer,
  onSwitchToDesktop
}) => {
  // Current view: 'console' (View A: Password login) | 'pin' (View B: 4-digit PIN)
  const [view, setView] = useState('console');

  // View A (Console) form states
  const [email, setEmail] = useState('admin@beardistabrew.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepActive, setKeepActive] = useState(true);

  // View B (PIN) states
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // General auth states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active staff profile (matches reference images)
  const [staffProfile, setStaffProfile] = useState({
    name: 'Jim Carlo Gorospe',
    role: 'ADMIN',
    email: 'admin@beardistabrew.com',
    avatarLetter: 'A'
  });

  // Handle PIN entry changes
  useEffect(() => {
    if (view === 'pin' && pin.length === 4) {
      // Auto-validate 4-digit PIN (default demo PIN 2026 or any 4 digits in demo mode)
      setIsLoading(true);
      setErrorMsg('');

      const timer = setTimeout(() => {
        if (pin === '2026' || pin === '1234' || pin.length === 4) {
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess({
              username: staffProfile.name,
              email: staffProfile.email,
              role: 'Owner Admin',
              authMethod: '4-Digit PIN',
              terminalId: 'TER-MNL-BAY-01'
            });
          }
        } else {
          setIsLoading(false);
          setPinError(true);
          setErrorMsg('Invalid terminal PIN. Try 2026');
          setTimeout(() => {
            setPin('');
            setPinError(false);
          }, 900);
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [pin, view, onLoginSuccess, staffProfile]);

  // Keypad click handler for View B
  const handleKeypadPress = (val) => {
    setErrorMsg('');
    if (val === 'CLEAR') {
      setPin('');
      return;
    }
    if (val === 'BACKSPACE') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (pin.length < 4) {
      setPin((prev) => prev + val);
    }
  };

  // Submit handler for View A (Console / Password)
  const handleConsoleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password === 'admin2026' || password === 'admin' || password.length >= 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess({
            username: staffProfile.name,
            email: email.trim() || staffProfile.email,
            role: 'Owner Admin',
            authMethod: 'Password',
            terminalId: 'TER-MNL-BAY-01'
          });
        }
      }, 400);
    } else {
      setErrorMsg('Invalid credentials. Demo password: admin2026');
    }
  };

  // Quick autofill demo credentials
  const handleAutofillDemo = () => {
    setEmail('admin@beardistabrew.com');
    setPassword('admin2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-between items-center p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 selection:bg-[#E58422] selection:text-white relative">
      {/* Top Utility Bar */}
      <div className="w-full max-w-sm flex items-center justify-between text-xs pt-1 pb-2">
        {onBackToCustomer ? (
          <button
            type="button"
            onClick={onBackToCustomer}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#19244E] font-bold cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Customer Menu</span>
          </button>
        ) : (
          <div />
        )}

        {onSwitchToDesktop && (
          <button
            type="button"
            onClick={onSwitchToDesktop}
            className="text-[11px] font-bold text-[#E58422] hover:text-[#c46914] bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs cursor-pointer"
          >
            💻 Desktop Portal
          </button>
        )}
      </div>

      {/* Main Authentication Container */}
      <div className="w-full max-w-sm flex flex-col items-center flex-1 justify-center my-auto">
        {/* ==================================================================== */}
        {/* VIEW A: SIGN IN TO CONSOLE (Reference Image 2)                       */}
        {/* ==================================================================== */}
        {view === 'console' && (
          <div className="w-full space-y-5 animate-fadeIn">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E58422] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
                  />
                </svg>
              </div>
              <span className="text-base font-black tracking-wider text-[#19244E] uppercase">
                Beardista Brew
              </span>
            </div>

            {/* View Title & Subtitle */}
            <div>
              <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
                Sign in to console
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Authenticate terminal shift & access store management
              </p>
            </div>

            {/* Staff Profile Card with "Switch" button */}
            <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#E58422] text-white flex items-center justify-center font-black text-base shadow-2xs">
                    {staffProfile.avatarLetter}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs text-[#19244E] truncate">
                      {staffProfile.name}
                    </span>
                    <span className="px-1.5 py-0.2 bg-orange-50 text-[#E58422] border border-orange-200 text-[9px] font-black rounded uppercase">
                      {staffProfile.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {staffProfile.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail(email === 'admin@beardistabrew.com' ? 'barista.lead@beardistabrew.com' : 'admin@beardistabrew.com');
                  setStaffProfile(prev => ({
                    ...prev,
                    name: prev.name === 'Jim Carlo Gorospe' ? 'Kimberly Ramos' : 'Jim Carlo Gorospe',
                    email: prev.email === 'admin@beardistabrew.com' ? 'barista.lead@beardistabrew.com' : 'admin@beardistabrew.com'
                  }));
                }}
                className="px-3 py-1 bg-[#FFF3E7] hover:bg-orange-100 text-[#E58422] text-xs font-bold rounded-xl transition-colors cursor-pointer flex-shrink-0"
              >
                Switch
              </button>
            </div>

            {/* Demo Hint Banner */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-amber-900 font-medium">
                <span className="font-bold">Pass:</span> <code className="font-mono bg-white px-1 py-0.5 rounded text-[#19244E] font-bold">admin2026</code>
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="font-black text-[#E58422] hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConsoleSubmit} className="space-y-4">
              {/* Field 1: Staff Email or ID */}
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-wider mb-1.5">
                  Staff Email or ID
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@beardistabrew.com"
                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setErrorMsg('Demo recovery: Use password "admin2026" or click "Use 4-Digit PIN" (2026).')}
                    className="text-[11px] font-bold text-[#E58422] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] outline-none shadow-2xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Keep terminal active checkbox & "Use 4-Digit PIN" button */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepActive}
                    onChange={(e) => setKeepActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-semibold">
                    Keep terminal active
                  </span>
                </label>

                {/* Switch to PIN Button */}
                <button
                  type="button"
                  onClick={() => {
                    setView('pin');
                    setPin('');
                    setErrorMsg('');
                  }}
                  className="px-3 py-1.5 bg-[#EFF4FA] hover:bg-blue-50 text-[#19244E] text-xs font-bold rounded-xl transition-all border border-blue-100 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Use 4-Digit PIN</span>
                </button>
              </div>

              {/* Primary Orange Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#E58422] hover:bg-[#d47414] active:bg-[#c46914] text-white text-sm font-extrabold rounded-2xl shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Opening Shift...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Open Shift</span>
                    <span className="text-base leading-none">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW B: ENTER SECURITY PIN (Reference Image 1)                       */}
        {/* ==================================================================== */}
        {view === 'pin' && (
          <div className="w-full space-y-4 animate-fadeIn">
            {/* Status Bar simulation header */}
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 px-1">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zm-2.829 2.828a3 3 0 00-4.242 0 1 1 0 01-1.415-1.414 5 5 0 017.072 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
                <span className="w-4 h-2.5 rounded-xs border border-gray-500 flex items-center p-0.5">
                  <span className="h-full w-full bg-gray-500 rounded-2xs" />
                </span>
              </div>
            </div>

            {/* Circular Logo & Header */}
            <div className="flex items-center gap-2.5 justify-center">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs p-1">
                <div className="w-full h-full rounded-full bg-[#19244E] text-[#E58422] flex items-center justify-center font-black text-xs">
                  BB
                </div>
              </div>
              <span className="text-sm font-black text-[#19244E] tracking-wider uppercase">
                Beardista Brew
              </span>
            </div>

            {/* Staff Card */}
            <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#E58422] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                  {staffProfile.avatarLetter}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-[#19244E] truncate">
                  {staffProfile.name}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {staffProfile.email}
                </div>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center pt-1">
              <h2 className="text-xl font-black text-[#19244E] tracking-tight">
                Enter Security PIN
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Authenticate terminal session & shift
              </p>
            </div>

            {/* 4 Circular Dot Indicators */}
            <div className="flex items-center justify-center gap-3.5 py-2">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <span
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isFilled
                        ? 'bg-[#E58422] scale-110 shadow-sm shadow-orange-500/40'
                        : 'bg-slate-200 scale-100'
                    }`}
                  />
                );
              })}
            </div>

            {/* PIN Error notice */}
            {errorMsg && (
              <div className="text-center text-xs font-bold text-rose-600 animate-shake">
                {errorMsg}
              </div>
            )}

            {/* Numeric Keypad (3x4 Grid) */}
            <div className={`grid grid-cols-3 gap-2.5 max-w-xs mx-auto ${pinError ? 'animate-shake' : ''}`}>
              {/* Row 1 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('1')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>1</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('2')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>2</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">ABC</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('3')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>3</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">DEF</span>
              </button>

              {/* Row 2 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('4')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>4</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">GHI</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('5')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>5</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">JKL</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('6')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>6</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">MNO</span>
              </button>

              {/* Row 3 */}
              <button
                type="button"
                onClick={() => handleKeypadPress('7')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>7</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">PQRS</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('8')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>8</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">TUV</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('9')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <span>9</span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest -mt-1">WXYZ</span>
              </button>

              {/* Row 4: CLEAR, 0, Backspace */}
              <button
                type="button"
                onClick={() => handleKeypadPress('CLEAR')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-2xl shadow-xs border border-gray-100 font-black text-xs text-gray-500 uppercase tracking-wider flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-orange-50 rounded-2xl shadow-xs border border-gray-100 font-extrabold text-xl text-gray-800 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('BACKSPACE')}
                className="h-14 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-2xl shadow-xs border border-gray-100 text-gray-600 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                title="Backspace"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6-7h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-6-7z"
                  />
                </svg>
              </button>
            </div>

            {/* Links below keypad: Forgot PIN & Switch to Console */}
            <div className="flex items-center justify-between text-xs px-2 pt-2">
              <button
                type="button"
                onClick={() => setErrorMsg('Demo PIN hint: Type 2026 to unlock shift.')}
                className="text-gray-400 hover:text-gray-600 font-medium cursor-pointer"
              >
                Forgot PIN?
              </button>

              <button
                type="button"
                onClick={() => {
                  setView('console');
                  setErrorMsg('');
                }}
                className="font-bold text-[#E58422] hover:underline cursor-pointer"
              >
                Use Password Login →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* FOOTER: ENCRYPTED TERMINAL FOOTER (Both Views)                        */}
      {/* ==================================================================== */}
      <div className="w-full max-w-sm pt-4 pb-2 text-center border-t border-gray-200/80">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>End-to-end encrypted terminal session</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-1 font-medium">
          Device: iPad Pro 11" • Manila Bay Branch • IP: 192.168.1.45
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
