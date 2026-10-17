import React, { useState } from 'react';

export const SettingsView = ({
  settings,
  onSaveSettings,
  onOpenChangePassword,
  onNavigateToUsers
}) => {
  const [formData, setFormData] = useState(settings);

  const handleChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
            System & Store Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure store metadata, customer Wi-Fi broadcast info, and security credentials.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
        >
          Save All Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Café Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <span className="w-8 h-8 rounded-lg bg-[#19244E] text-[#FFF3E7] flex items-center justify-center font-bold text-sm">
              🏢
            </span>
            <div>
              <h2 className="text-base font-black text-[#19244E]">
                Café Brand & Physical Location
              </h2>
              <p className="text-[11px] text-gray-400">
                Synchronized with the customer menu footer and contact sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Tagline / Concept
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
              Caloocan Branch Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Opening Time (Daily)
              </label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => handleChange('openingTime', e.target.value)}
                placeholder="4:00 PM"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Closing Time (Midnight)
              </label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => handleChange('closingTime', e.target.value)}
                placeholder="12:00 AM"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Wi-Fi Credentials */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <span className="w-8 h-8 rounded-lg bg-[#E58422] text-white flex items-center justify-center font-bold text-sm">
              📶
            </span>
            <div>
              <h2 className="text-base font-black text-[#19244E]">
                Guest Wi-Fi Station Broadcast
              </h2>
              <p className="text-[11px] text-gray-400">
                Displayed in the customer "Stay Connected" section with QR code generation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Network SSID (Name)
              </label>
              <input
                type="text"
                value={formData.wifiSSID}
                onChange={(e) => handleChange('wifiSSID', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#19244E] uppercase tracking-wider mb-2">
                Wi-Fi Password
              </label>
              <input
                type="text"
                value={formData.wifiPass}
                onChange={(e) => handleChange('wifiPass', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold font-mono focus:ring-2 focus:ring-[#E58422] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Security & Password Management */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#19244E]">
                Administrator Account Security
              </h2>
              <p className="text-[11px] text-gray-400">
                Manage portal access passkey and authentication requirements.
              </p>
            </div>

            {/* Change Password Modal Trigger Button (Image 12 Requirement) */}
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="px-4 py-2.5 bg-[#19244E] hover:bg-[#23336d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>🔒</span>
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
