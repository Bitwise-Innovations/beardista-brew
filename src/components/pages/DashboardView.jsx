import React from 'react';

export const DashboardView = ({
  stats,
  favorites,
  globalAvailability,
  onToggleGlobalAvailability,
  onNavigateToMenu
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Welcome & Global Availability Quick Toggle Switch */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E58422] text-xs font-black tracking-wide uppercase mb-2">
            <span>●</span> Live Operational Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#19244E] tracking-tight">
            Store Performance & Catalog Status
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-xl">
            Real-time sync of digital menu orders, customer survey sentiments, and Caloocan store availability.
          </p>
        </div>

        {/* Global Availability Quick Toggle Switch */}
        <div className="bg-[#FFF3E7] p-4 rounded-2xl border border-[#E58422]/20 flex items-center justify-between sm:justify-start gap-5 flex-shrink-0">
          <div>
            <div className="text-xs font-black text-[#19244E] uppercase tracking-wider">
              Global Store Availability
            </div>
            <div className="text-[11px] font-semibold text-gray-600">
              {globalAvailability ? (
                <span className="text-emerald-700 font-bold">● Menu Online & Active</span>
              ) : (
                <span className="text-amber-700 font-bold">⏸ Ordering Temporarily Paused</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleGlobalAvailability}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer active:scale-95 shadow-inner ${
              globalAvailability ? 'bg-emerald-500' : 'bg-gray-400'
            }`}
            title="Toggle store wide menu availability"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                globalAvailability ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Top Stat Cards (Daily Visits, Survey Responses, Most Requested, Active Catalog) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                {stat.label}
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#FFF3E7] text-[#E58422] flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                {stat.icon === 'visit' && '👥'}
                {stat.icon === 'survey' && '📝'}
                {stat.icon === 'star' && '⭐'}
                {stat.icon === 'catalog' && '☕'}
              </span>
            </div>

            <div className="text-2xl md:text-3xl font-black text-[#19244E] tracking-tight">

              
              {stat.value}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {stat.change}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {stat.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Section: Customer Favorites This Month */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-[#19244E] tracking-tight">
              Customer Favorites This Month
            </h2>
            <p className="text-xs text-gray-500">
              Top requested items based on customer digital menu engagement and bar orders.
            </p>
          </div>

          <button
            onClick={onNavigateToMenu}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#19244E] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto active:scale-95"
          >
            <span>Manage All Items</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {favorites.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200/70 hover:border-[#E58422]/50 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3 overflow-hidden rounded-xl bg-gray-200 aspect-video">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#19244E]/90 text-white text-[10px] font-black rounded-lg backdrop-blur-xs">
                    #{index + 1} Best Seller
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#E58422] text-white text-[10px] font-bold rounded-lg shadow-xs">
                    {item.trend}
                  </div>
                </div>

                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {item.category}
                </div>
                <h3 className="font-extrabold text-sm text-[#19244E] mt-0.5">
                  {item.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#E58422]">
                  ₱{item.price}
                </span>
                <span className="font-bold text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  {item.orders} orders
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
