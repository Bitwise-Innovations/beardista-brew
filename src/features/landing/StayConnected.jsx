import React from 'react';
import { Facebook, Instagram, Music2, Coffee, MapPin } from 'lucide-react';

// Group 1: social media links
const socialLinks = [
  { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/Beardistabrew' },
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/beardistabrew' },
  { label: 'TikTok', icon: Music2, href: 'https://www.tiktok.com/@beardista' },
];

// Group 2: coffee app links (hidden until href is filled in)
const coffeeAppLinks = [
  { label: 'Coffee Guru', icon: Coffee, href: '' },
  { label: 'Where to Coffee', icon: MapPin, href: '' },
].filter((link) => link.href);

/**
 * Single icon link: navy circle with white icon (orange on hover) and a small label below.
 * @param {Object} props - Component properties
 * @param {Object} props.link - Link object { label, icon, href }
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
      {/* Icon Circle */}
      <span className="w-14 h-14 rounded-full bg-[#19244E] text-white flex items-center justify-center transition-colors group-hover:bg-[#E58422] group-focus-visible:bg-[#E58422]">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </span>

      {/* Label */}
      <span className="text-xs font-semibold text-[#19244E] uppercase tracking-wider">
        {link.label}
      </span>
    </a>
  );
};

/**
 * StayConnected component displays the cafe's social media and coffee app links.
 */
export const StayConnected = () => {
  return (
    // Section wrapper with top divider and cream background
    <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16 border-t border-black/10" id="wifi-section">
      <div className="max-w-3xl mx-auto text-center">

        {/* Section Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] mb-12 uppercase tracking-widest">
          STAY CONNECTED.
        </h2>

        {/* Centered White Links Card */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center border border-black/10">

          {/* Phone: 2 stacked groups. Desktop: groups merge into one evenly spaced row of 5. */}
          <div className="w-full flex flex-col md:flex-row md:justify-evenly gap-8 md:gap-0">

            {/* Group 1: Social Media */}
            <div className="flex justify-center gap-6 md:contents">
              {socialLinks.map((link) => (
                <ConnectLink key={link.label} link={link} />
              ))}
            </div>

            {/* Group 2: Coffee Apps */}
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
};
