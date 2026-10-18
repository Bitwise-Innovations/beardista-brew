import React from 'react';

/**
 * CustomerVoice component displays user testimonials and the survey button.
 * @param {Object} props - Component properties
 * @param {Array} props.reviews - List of reviews from menuData
 * @param {Function} props.onOpenSurvey - Callback to trigger the survey dialog
 */
export const CustomerVoice = ({ reviews, onOpenSurvey }) => {
  return (
    <>
      {/* Hairline Divider separating sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="h-px bg-[#19244E] w-full opacity-20" />
      </div>

      {/* Main Section Content */}
      <section className="py-16 md:py-24 bg-[#FFF3E7] px-6 md:px-16" id="survey-section">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Section Headline */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#19244E] mb-8 uppercase tracking-widest">
            YOUR COFFEE. YOUR VOICE.
          </h2>

          {/* Primary CTA: "TAKE THE SURVEY" */}
          <div className="mb-16">
            <button
              onClick={onOpenSurvey}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E58422] hover:bg-[#d47414] text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <span>TAKE THE SURVEY</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* 3 Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-8 border border-black/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* 5-Star Rating Indicator */}
                  <div className="flex text-[#E58422] mb-4 space-x-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <svg
                        key={starIndex}
                        className="w-5 h-5 fill-[#E58422] text-[#E58422]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Customer Testimonial Quote */}
                  <p className="text-sm md:text-base text-[#111111] italic mb-4 leading-relaxed">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Author Attribution */}
                <p className="text-sm font-bold text-[#19244E] mt-auto">
                  — {rev.author}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};
