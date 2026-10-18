import React, { useState } from 'react';
import qrImg from '../assets/wifi_qr.jpg'; // <-- Imported local QR image

/**
 * StayConnected component displays the cafe's public WiFi credentials.
 * @param {Object} props - Component properties
 * @param {Object} props.wifi - WiFi credentials object { ssid, password }
 */
export const StayConnected = ({ wifi }) => {
  // State for copying to clipboard
  const [copied, setCopied] = useState(false);
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Clipboard copy handler
  const copyPassword = () => {
    navigator.clipboard.writeText(wifi.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Section wrapper
    <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16 border-t border-black/10" id="wifi-section">
      <div className="max-w-3xl mx-auto text-center">
        
        {/* Section Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] mb-12 uppercase tracking-widest">
          STAY CONNECTED.
        </h2>

        {/* Card */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center border border-black/10">
          
          {/* QR Code Container*/}
          <div className="w-52 h-52 bg-white mb-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-xl relative">
            {/* Local QR Image */}
            <img 
              src={qrImg} 
              alt="Scan to connect to WiFi" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Credentials Display*/}
          <div className="space-y-4 w-full max-w-sm">
            
            {/* Row 1: WiFi Network Name*/}
            <div className="flex justify-between items-center border-b border-black/10 pb-3">
              <span className="text-xs font-semibold text-[#111111]/80 uppercase tracking-wider">
                WIFI NAME
              </span>
              <span className="text-base sm:text-lg font-bold text-[#19244E] tracking-wide">
                {wifi.ssid}
              </span>
            </div>

            {/* Row 2: WiFi Password with Show hide at COPY */}
            <div className="flex justify-between items-center border-b border-black/10 pb-3">
              <span className="text-xs font-semibold text-[#111111]/80 uppercase tracking-wider">
                PASSWORD
              </span>
              
              <div className="flex items-center gap-3">
                {/* Password Text (Hidden or Shown) */}
                <span className="text-base sm:text-lg font-bold text-[#19244E] tracking-wide font-mono">
                  {showPassword ? wifi.password : '••••••••••••'}
                </span>

                {/* Show/Hide Toggle Button */}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold text-[#E58422] uppercase tracking-wider hover:opacity-80 cursor-pointer"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>

                {/* Copy Button */}
                <button
                  onClick={copyPassword}
                  title="Click to copy password"
                  className="text-[10px] font-bold text-[#E58422] uppercase tracking-normal cursor-pointer hover:opacity-80 border-l border-black/10 pl-3"
                >
                  {copied ? '(COPIED!)' : 'COPY'}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};