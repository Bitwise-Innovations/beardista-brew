import React, { useState } from 'react';

export const AdminLogin = ({ onLoginSuccess, onBackToCustomer, onSwitchToMobileLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // STRICT REQUIREMENT: username must be "admin" and password must be "admin2026"
    if (username.trim() === 'admin' && password === 'admin2026') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess({
            username: username.trim(),
            role: 'Owner Admin',
            authenticatedAt: new Date().toISOString()
          });
        }
      }, 400);
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 sm:p-6 relative font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#E58422] selection:text-white">
      {/* Top action buttons */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        {onBackToCustomer && (
          <button
            type="button"
            onClick={onBackToCustomer}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#19244E] transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Customer Menu</span>
          </button>
        )}

        {onSwitchToMobileLogin && (
          <button
            type="button"
            onClick={onSwitchToMobileLogin}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#E58422] hover:text-[#c46914] bg-white px-3.5 py-2 rounded-xl border border-orange-200 shadow-2xs hover:border-orange-300 cursor-pointer ml-auto transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Mobile App & PIN Login</span>
          </button>
        )}
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#19244E] text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md border-2 border-[#E58422]">
            BB
          </div>
          <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
            Beardista Brew
          </h1>
          <p className="text-xs font-bold text-[#E58422] uppercase tracking-wider mt-1">
            Admin Portal Access
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Secure administrative control center for Caloocan Flagship.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input Field */}
          <div>
            <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
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

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1.5 animate-fadeIn">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-[#E58422] hover:bg-[#d47414] text-white text-sm font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </span>
            ) : (
              <>
                <span>Secure Login</span>
                <span className="text-base leading-none">→</span>
              </>
            )}
          </button>
        </form>

        {/* Forgot Credentials Link */}
        <div className="text-center mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-bold text-gray-500 hover:text-[#E58422] transition-colors cursor-pointer"
          >
            Forgot your credentials?
          </button>
        </div>
      </div>

      {/* Forgot Credentials Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#E58422] flex items-center justify-center text-xl mx-auto font-black">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#19244E]">
                Credential Recovery
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed px-2">
                Please contact the system administrator to request a secure password reset link for your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-[#19244E] hover:bg-[#23336d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-2"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;