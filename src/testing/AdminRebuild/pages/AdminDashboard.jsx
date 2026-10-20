import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Coffee,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const [storeOnline, setStoreOnline] = useState(true);
  const [notice, setNotice] = useState("");

  const stats = [
    {
      title: "Total Orders",
      value: "1,284",
      change: "+12.8%",
      description: "compared with last month",
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-600",
      positive: true,
      points: "0,20 12,15 24,18 36,8 48,12 60,3",
    },
    {
      title: "Total Revenue",
      value: "₱86,420",
      change: "+8.2%",
      description: "compared with last month",
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600",
      positive: true,
      points: "0,20 12,17 24,19 36,11 48,8 60,3",
    },
    {
      title: "Customer Visits",
      value: "2,410",
      change: "+5.4%",
      description: "compared with last month",
      icon: Coffee,
      iconBg: "bg-orange-50 text-[#E58422]",
      positive: true,
      points: "0,19 12,13 24,16 36,9 48,12 60,5",
    },
    {
      title: "Customer Rating",
      value: "4.8/5",
      change: "+0.3",
      description: "compared with last month",
      icon: Star,
      iconBg: "bg-violet-50 text-violet-600",
      positive: true,
      points: "0,18 12,15 24,16 36,8 48,10 60,3",
    },
  ];

  const pictureSlots = [1, 2, 3, 4];

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-[#19244E]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-4 font-bold text-[#E58422]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dashboard banner */}
      <section className="flex flex-col justify-between gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div className="min-w-0">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#E58422]">
            <span className="h-2 w-2 rounded-full bg-[#E58422]" />
            Live Operational Dashboard
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#19244E] md:text-3xl">
            Store Performance &amp; Catalog Status
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Real-time overview of store performance and Caloocan store availability.
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 rounded-2xl border border-orange-200 bg-[#FFF3E7] p-4 sm:justify-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#19244E]">
              Global Store Availability
            </p>
            <p className={`mt-1 text-xs font-bold ${storeOnline ? "text-emerald-700" : "text-gray-600"}`}>
              {storeOnline ? "● Menu Online & Active" : "○ Ordering Temporarily Paused"}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={storeOnline}
            aria-label="Toggle global store availability"
            onClick={() => {
              const next = !storeOnline;
              setStoreOnline(next);
              setNotice(next ? "Store availability preview is now online." : "Store availability preview is now paused.");
            }}
            className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition-colors ${storeOnline ? "bg-emerald-500" : "bg-gray-400"}`}
          >
            <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${storeOnline ? "translate-x-8" : "translate-x-1"}`} />
          </button>
        </div>
      </section>

      {/* Four statistic cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{stat.title}</p>
                  <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#19244E]">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={21} />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1 text-xs font-extrabold text-emerald-600">
                    <TrendIcon size={15} />
                    {stat.change}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">{stat.description}</p>
                </div>
                <svg viewBox="0 0 60 24" className="h-8 w-16 shrink-0" aria-hidden="true">
                  <polyline
                    points={stat.points}
                    fill="none"
                    stroke="#E58422"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </article>
          );
        })}
      </section>

      {/* Picture cards with category, name, price and orders placeholders */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 border-b border-gray-100 pb-5">
          <h2 className="text-lg font-extrabold text-[#19244E]">
            Customer Favorites This Month
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Picture and item details can be connected to the backend later.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pictureSlots.map((slot) => (
            <article
              key={slot}
              className="flex min-w-0 flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-orange-200 hover:bg-white hover:shadow-md"
            >
              {/* Image frame */}
              <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 transition hover:border-[#E58422]">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#E58422]">
                    <Coffee size={25} strokeWidth={1.7} />
                  </div>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-[#19244E]">
                    INPUT PICTURE HERE
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Image slot {String(slot).padStart(2, "0")}
                  </p>
                </div>
              </div>

              {/* Category and item name */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  CATEGORY
                </p>
                <h3 className="mt-1 text-sm font-extrabold text-[#19244E]">
                  INPUT NAME HERE
                </h3>
              </div>

              {/* Bottom row: price on the left, orders on the right */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
                <span className="text-xs font-extrabold text-[#E58422]">
                  PRICE
                </span>
                <span className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-500">
                  ORDERS
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
