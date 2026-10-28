import React from 'react';
import { useStoreSettings } from '../backend/hooks/useContent';
import { buildSiteInfo } from '../backend/mappers/contentMapper';

/**
 * Footer: store name, address and hours from Settings.
 * Social links live in the Stay Connected section above.
 */
export const Footer = () => {
  const { data: settings } = useStoreSettings();
  const site = buildSiteInfo(settings);
  const [firstWord, ...restWords] = site.storeName.split(' ');

  return (
    <footer className="bg-[#19244E] text-[#FFF3E7] pt-16 px-6 md:px-16 pb-12 border-t border-white/10" id="contact-section">
      <div className="max-w-5xl mx-auto space-y-4">
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

        <p className="text-[#FFF3E7]/50 text-xs sm:text-sm pt-4">
          © {new Date().getFullYear()} {site.storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};