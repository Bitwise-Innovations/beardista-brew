import React, { useState } from 'react';

/**
 * FaqSection component renders an interactive FAQ accordion.
 * @param {Object} props - Component properties
 * @param {Array} props.faqs - Array of FAQ items from menuData
 */
export const FAQSection = ({ faqs }) => {
  // State tracking which question is currently expanded (null = all collapsed)
  const [activeId, setActiveId] = useState(null);

  // Toggle handler for accordion behavior
  const toggleFaq = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    // Section wrapper with top divider and cream background
    <section className="py-16 md:py-24 bg-cream px-6 md:px-16 border-t border-black/10" id="faq-section">
      <div className="max-w-3xl mx-auto">
        
        {/* Section Headline matching reference image: FREQUENTLY ASKED QUESTIONS */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          {/* Centered Orange Accent Divider */}
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = activeId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
              >
                {/* Accordion Header / Clickable Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left bg-white transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  {/* Question Title */}
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {faq.question}
                  </span>

                  {/* Down / Up Chevron Vector Indicator with rotation transition */}
                  <svg
                    className={`w-5 h-5 text-primary transition-transform duration-300 transform shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Collapsible Answer Body: Rendered only when activeId matches */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-[#111111] border-t border-black/5">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
