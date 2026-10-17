import React, { useState } from 'react';

export const AnalyticsReportsView = ({
  feedbackList,
  onOpenSurveyBuilder,
  onToggleSyncVoice,
  onArchiveFeedback
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* View Header with Survey Builder CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
            Analytics & Customer Reports
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time traffic telemetry, customer satisfaction benchmarks, and survey distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Select */}
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-2xs text-xs font-bold text-gray-600">
            {['7d', '30d', '90d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-[#19244E] text-white shadow-xs'
                    : 'hover:text-[#19244E]'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'Quarterly'}
              </button>
            ))}
          </div>

          {/* Survey Builder Modal Trigger (Image 5 Requirement) */}
          <button
            onClick={onOpenSurveyBuilder}
            className="px-4 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>📋</span>
            <span>Survey Builder</span>
          </button>
        </div>
      </div>

      {/* Top 3 Visual Charts (Line Chart, Donut Chart, Stacked Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Line Chart: Total Digital Visits Over Time */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                Footfall & Menu Views
              </span>
              <h2 className="text-base font-black text-[#19244E]">
                Total Digital Visits (October 2026)
              </h2>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#19244E]">34,920</span>
              <span className="block text-[11px] font-bold text-emerald-600">+14.2% MoM</span>
            </div>
          </div>

          {/* SVG Line Chart Graphic */}
          <div className="relative h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E58422" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#E58422" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeDasharray="4 4" />

              {/* Area fill */}
              <path
                d="M 0 140 Q 60 110, 120 125 T 240 70 T 360 90 T 500 35 L 500 180 L 0 180 Z"
                fill="url(#visitGrad)"
              />

              {/* Smooth Trend Curve */}
              <path
                d="M 0 140 Q 60 110, 120 125 T 240 70 T 360 90 T 500 35"
                fill="none"
                stroke="#E58422"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="120" cy="125" r="4.5" fill="#19244E" stroke="#fff" strokeWidth="2" />
              <circle cx="240" cy="70" r="4.5" fill="#19244E" stroke="#fff" strokeWidth="2" />
              <circle cx="360" cy="90" r="4.5" fill="#19244E" stroke="#fff" strokeWidth="2" />
              <circle cx="500" cy="35" r="5" fill="#E58422" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-3 border-t border-gray-100 mt-2">
            <span>Week 1 (Oct 1-7)</span>
            <span>Week 2 (Oct 8-14)</span>
            <span>Week 3 (Oct 15-21)</span>
            <span>Week 4 (Oct 22-28)</span>
          </div>
        </div>

        {/* 2. Donut Chart: Demographics Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              Customer Segmentation
            </span>
            <h2 className="text-base font-black text-[#19244E]">
              Visitor Demographics
            </h2>
          </div>

          {/* SVG Donut */}
          <div className="flex items-center justify-center py-4 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              {/* Segment 1: College & Students (45%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#19244E"
                strokeWidth="15"
                strokeDasharray="107 238"
                strokeDashoffset="0"
              />
              {/* Segment 2: Young Professionals (35%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#E58422"
                strokeWidth="15"
                strokeDasharray="83 238"
                strokeDashoffset="-107"
              />
              {/* Segment 3: Local Caloocan Residents (20%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#F6AD55"
                strokeWidth="15"
                strokeDasharray="48 238"
                strokeDashoffset="-190"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-[#19244E]">1,428</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Daily Avg</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1.5 text-xs font-semibold pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19244E]" />
                University / Students
              </span>
              <span className="font-bold text-[#19244E]">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E58422]" />
                Young Professionals
              </span>
              <span className="font-bold text-[#19244E]">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6AD55]" />
                Neighborhood Regulars
              </span>
              <span className="font-bold text-[#19244E]">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stacked Bar Chart: Survey Summaries */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              Survey Metrics
            </span>
            <h2 className="text-base font-black text-[#19244E]">
              Customer Experience Rating Distribution (1 to 5 Stars)
            </h2>
          </div>
          <div className="text-xs font-bold text-[#E58422] bg-orange-50 px-3 py-1 rounded-xl">
            Avg Score: 4.85 / 5.0
          </div>
        </div>

        {/* Stacked Ratings Visual Bars */}
        <div className="space-y-3">
          {[
            { star: '5 Stars (Exceptional)', pct: 78, color: 'bg-emerald-500', count: 300 },
            { star: '4 Stars (Very Good)', pct: 16, color: 'bg-[#E58422]', count: 62 },
            { star: '3 Stars (Average)', pct: 4, color: 'bg-amber-400', count: 15 },
            { star: '2 Stars (Needs Polish)', pct: 1.5, color: 'bg-orange-300', count: 5 },
            { star: '1 Star (Unsatisfied)', pct: 0.5, color: 'bg-rose-500', count: 2 }
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-4 text-xs">
              <span className="w-36 font-bold text-gray-700">{bar.star}</span>
              <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-16 font-extrabold text-right text-gray-800">
                {bar.pct}% ({bar.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section: Individual Customer Feedback with Sync to Customer Voice Toggle */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-[#19244E] tracking-tight">
              Individual Customer Feedback
            </h2>
            <p className="text-xs text-gray-500">
              Live submissions from the Customer Survey Modal. Toggle to feature them directly in the public "Customer Voice" testimonial section.
            </p>
          </div>
          <div className="text-xs font-extrabold text-gray-400">
            {feedbackList.length} Total Submissions
          </div>
        </div>

        <div className="space-y-4">
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-[#19244E]">{fb.name}</span>
                  <span className="text-[11px] font-semibold text-gray-400">· {fb.date}</span>
                  <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-600">
                    {fb.visitFrequency}
                  </span>
                  <span className="text-amber-500 text-xs font-bold">
                    {'★'.repeat(fb.rating)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{fb.comment}"
                </p>
                <div className="text-[11px] text-gray-400 font-medium">
                  Preference: <strong className="text-gray-600">{fb.preference}</strong>
                </div>
              </div>

              {/* Actions: Sync to Public Voice Toggle & Archive/Delete button */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Sync to Public Voice Toggle */}
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => onToggleSyncVoice(fb.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer active:scale-95 ${
                      fb.syncToVoice ? 'bg-[#E58422]' : 'bg-gray-300'
                    }`}
                    title="Toggle visibility in public Customer Voice section"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                        fb.syncToVoice ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-gray-700">
                    {fb.syncToVoice ? (
                      <span className="text-[#E58422]">Live</span>
                    ) : (
                      <span className="text-gray-400">Hidden</span>
                    )}
                  </span>
                </div>

                {/* Archive/Delete Action Button */}
                <button
                  type="button"
                  onClick={() => onArchiveFeedback && onArchiveFeedback(fb.id)}
                  className="p-2.5 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 rounded-xl transition-all cursor-pointer active:scale-95"
                  title="Archive/Delete Customer Feedback"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
