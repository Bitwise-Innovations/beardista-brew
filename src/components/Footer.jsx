import React from 'react';
import { useStoreSettings } from '../backend/hooks/useContent';
import { buildSiteInfo } from '../backend/mappers/contentMapper';

const SOCIAL_LABELS = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['tiktok', 'TikTok'],
];

/**
 * Footer: store name, address, hours and social links from Settings.
 * @param {Function} props.onNavigate - Routing handler (used by the hidden staff login)
 */
export const Footer = ({ onNavigate }) => {
  const { data: settings } = useStoreSettings();
  const site = buildSiteInfo(settings);
  const links = SOCIAL_LABELS.filter(([key]) => site.social[key]);
  const [firstWord, ...restWords] = site.storeName.split(' ');

  return (
    <footer className="bg-[#19244E] text-[#FFF3E7] pt-16 px-6 md:px-16 pb-12 border-t border-white/10" id="contact-section">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: brand, address, hours, copyright */}
        <div className="space-y-4">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {firstWord}
            {restWords.length > 0 && (
              <>
                {' '}
                <br className="hidden sm:inline" />
                {restWords.join(' ')}
              </>
            )}
          </div>

          <p className="text-[#FFF3E7]/80 text-sm sm:text-base max-w-sm leading-relaxed">{site.address}</p>
          <p className="text-[#FFF3E7]/80 text-sm sm:text-base">Hours: {site.hours}</p>

          <div className="flex items-center gap-3 pt-4">
            <p className="text-[#FFF3E7]/50 text-xs sm:text-sm">
              © {new Date().getFullYear()} {site.storeName}. All rights reserved.
            </p>
            {/* Hidden staff login */}
            {onNavigate && (
              <button
                onClick={() => onNavigate('admin-login')}
                className="flex h-11 w-11 items-center justify-center text-[#FFF3E7]/20 hover:text-[#E58422] transition-colors cursor-pointer"
                title="Staff Login"
                aria-label="Staff login"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: social links */}
        {links.length > 0 && (
          <div className="md:text-right space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Contact</h4>
            <ul className="space-y-1 text-sm sm:text-base">
              {links.map(([key, label]) => (
                <li key={key}>
                  <a
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#FFF3E7]/80 hover:text-[#E58422] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
};