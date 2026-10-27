import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ANNOUNCEMENT_TYPES } from '../admin/components/announcements/announcementUtils';

// Small orange label above the title (same wording as the admin preview card)
const typeLabel = (announcement) =>
  announcement.type === 'custom'
    ? announcement.custom_label?.trim() || 'Custom'
    : ANNOUNCEMENT_TYPES[announcement.type];

/**
 * One live announcement card, styled like the admin's AnnouncementPreview.
 * The button shows only when it has a label and somewhere to go.
 */
const AnnouncementCard = ({ announcement, events, menuItems, onOpenEvent, onOpenItem }) => {
  const label = announcement.button_label?.trim();
  const target = announcement.link_target;
  const buttonClass =
    'inline-flex min-h-11 items-center gap-2 rounded-full bg-[#E58422] hover:bg-[#c96f17] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors cursor-pointer group';
  const arrow = <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />;

  let button = null;
  if (label && announcement.link_type === 'url' && target) {
    button = (
      <a href={target} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {label}
        {arrow}
      </a>
    );
  } else if (label && announcement.link_type === 'event') {
    const event = events.find((e) => e.id === Number(target));
    if (event) {
      button = (
        <button type="button" onClick={() => onOpenEvent(event)} className={buttonClass}>
          {label}
          {arrow}
        </button>
      );
    }
  } else if (label && announcement.link_type === 'menu_item') {
    const item = menuItems.find((i) => i.id === Number(target));
    if (item) {
      button = (
        <button type="button" onClick={() => onOpenItem(item)} className={buttonClass}>
          {label}
          {arrow}
        </button>
      );
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-[#FFF3E7] text-left shadow-xl border border-white/10 hover:border-[#E58422]/40 transition-all duration-300 flex flex-col">
      {announcement.image_url && (
        <img src={announcement.image_url} alt="" className="aspect-[16/9] w-full object-cover" />
      )}
      <div className="p-6 md:p-12 flex flex-col flex-1 justify-between items-start">
        <div className="space-y-4 w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58422] block">
            {typeLabel(announcement)}
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E] break-words">
            {announcement.title}
          </h3>
          {announcement.description && (
            <p className="text-sm md:text-base text-[#19244E]/80 leading-relaxed break-words">
              {announcement.description}
            </p>
          )}
        </div>
        {button && <div className="mt-8">{button}</div>}
      </div>
    </article>
  );
};

/**
 * WhatsBrewing component renders the live announcements from Supabase.
 * When there are none (empty, loading or error), it shows the two sample showcase cards.
 * @param {Object} props - Component properties
 * @param {Array} props.announcements - Live announcements (already limited to the landing slots)
 * @param {Array} props.events - Events, used by announcement buttons that link to an event
 * @param {Array} props.menuItems - Menu items, used by announcement buttons that link to an item
 * @param {Function} props.onOpenEvent - Callback with the linked event
 * @param {Function} props.onOpenItem - Callback with the linked menu item
 * @param {Object} props.data - Data object containing event and mustTry specifications
 * @param {Function} props.onRegister - Callback when clicking "REGISTER & JOIN"
 * @param {Function} props.onViewTsamporado - Callback when clicking "VIEW DETAILS" on Tsamporado
 */
export const WhatsBrewing = ({
  announcements = [],
  events = [],
  menuItems = [],
  onOpenEvent,
  onOpenItem,
  data,
  onRegister,
  onViewTsamporado,
}) => {
  return (
    // Section wrapper with rich Navy canvas and vertical breathing room
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#19244E] border-t border-black/10">
      <div className="max-w-7xl mx-auto text-center">

        {/* Section Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#FFF3E7] mb-12 md:mb-16 uppercase tracking-widest">
          WHAT'S BREWING
        </h2>

        {announcements.length > 0 ? (
          // Live announcements: 2 columns on large screens, one centered card if there is only 1
          <div
            className={
              announcements.length === 1
                ? 'max-w-xl mx-auto'
                : 'grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'
            }
          >
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                events={events}
                menuItems={menuItems}
                onOpenEvent={onOpenEvent}
                onOpenItem={onOpenItem}
              />
            ))}
          </div>
        ) : (
        /* 2-Column Responsive Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          {/* Card 1: Featured Community Event (Latte Art Throwdown) */}
          <div className="relative bg-[#FFF3E7] p-8 md:p-12 rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#D97706]/40 transition-all duration-300">
            <div className="space-y-4">
              {/* Event Subtitle Badge */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block">
                {data.event.tag}
              </span>

              {/* Event Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">
                {data.event.title}
              </h3>

              {/* Event Summary Description */}
              <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.event.description}
              </p>
            </div>

            {/* Action Button: Opens the event details modal */}
            <div className="mt-8">
              <button
                onClick={onRegister}
                className="inline-flex items-center px-6 py-3.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.event.buttonLabel}</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Seasonal Menu Feature (Tsamporado) */}
          <div className="relative bg-[#FFF3E7] p-8 md:p-12 rounded-2xl flex flex-col justify-between items-start text-left overflow-hidden shadow-xl border border-white/10 hover:border-[#EA580C]/40 transition-all duration-300">
            <div className="space-y-4">
              {/* Must Try Subtitle Badge */}
              <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C] block">
                {data.mustTry.tag}
              </span>

              {/* Feature Title */}
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#19244E]">
                {data.mustTry.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm md:text-base text-[#19244E]/80 max-w-sm leading-relaxed">
                {data.mustTry.description}
              </p>
            </div>

            {/* Action Button: Opens the view-only item detail modal */}
            <div className="mt-8">
              <button
                onClick={onViewTsamporado}
                className="inline-flex items-center px-6 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-opacity shadow-md group cursor-pointer"
              >
                <span>{data.mustTry.buttonLabel}</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
        )}
      </div>
    </section>
  );
};
