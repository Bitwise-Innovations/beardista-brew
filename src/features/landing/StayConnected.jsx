import React from 'react';
import { Facebook, Instagram, Music2, Coffee, MapPin } from 'lucide-react';
import { useStoreSettings } from '../../backend/hooks/useContent';
import { buildSiteInfo } from '../../backend/mappers/contentMapper';

const SOCIAL_ICONS = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'tiktok', label: 'TikTok', icon: Music2 },
];

// Coffee app links (hidden until a link is filled in here).
const coffeeAppLinks = [
  { label: 'Coffee Guru', icon: Coffee, href: '' },
  { label: 'Where to Coffee', icon: MapPin, href: '' },
].filter((link) => link.href);

/**
 * Single icon link: navy circle with white icon (orange on hover) and a small label below.
 */
const ConnectLink = ({ link }) => {
  const Icon = link.icon;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Beardista Brew on ${link.label}`}
      className="group flex flex-col items-center gap-2 min-h-[44px] min-w-[44px] focus:outline-none"
    >
      <span className="w-14 h-14 rounded-full bg-[#19244E] text-white flex items-center justify-center transition-colors group-hover:bg-[#E58422] group-focus-visible:bg-[#E58422]">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </span>
      <span className="text-xs font-semibold text-[#19244E] uppercase tracking-wider">{link.label}</span>
    </a>
  );
};

/**
 * StayConnected: social links from Settings (blank links are hidden) and coffee app links.
 */
export const StayConnected = () => {
  const { data: settings } = useStoreSettings();
  const site = buildSiteInfo(settings);

  const socialLinks = SOCIAL_ICONS.filter(({ key }) => site.social[key]).map((link) => ({
    ...link,
    href: site.social[link.key],
  }));

  // Nothing to show: hide the whole section instead of an empty card.
  if (socialLinks.length === 0 && coffeeAppLinks.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16 border-t border-black/10" id="connect-section">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] mb-12 uppercase tracking-widest">STAY CONNECTED.</h2>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center border border-black/10">
          {/* Phone: stacked groups. Desktop: one evenly spaced row. */}
          <div className="w-full flex flex-col md:flex-row md:justify-evenly gap-8 md:gap-0">
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-6 md:contents">
                {socialLinks.map((link) => (
                  <ConnectLink key={link.key} link={link} />
                ))}
              </div>
            )}
            {coffeeAppLinks.length > 0 && (
              <div className="flex justify-center gap-6 md:contents">
                {coffeeAppLinks.map((link) => (
                  <ConnectLink key={link.label} link={link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};b