import React from 'react';

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Confirmation Dialog Box */}
      <div className="relative bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all z-10 p-6 text-center animate-scaleUp">
        {/* Warning Icon Graphic */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold">
          ⚠️
        </div>

        <h3 className="text-lg font-black text-[#19244E] tracking-tight">
          Confirm Administrator Logout
        </h3>

        <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">
          Are you sure you want to end your current administrative session for Beardista Brew? You will need your login credentials to re-enter.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            Stay Signed In
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
