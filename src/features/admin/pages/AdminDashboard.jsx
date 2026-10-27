import { useState } from "react";
import { CalendarDays, Eye, MessageSquare, UtensilsCrossed } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import pastaPhoto from "../../../assets/pasta.jpg";
import saladPhoto from "../../../assets/salad.jpg";
import nachosPhoto from "../../../assets/nachos.png";
import juicesPhoto from "../../../assets/juices.png";
import { useStaffIdentity } from "../components/useStaffIdentity";


// Most viewed sample items this month, each with its real menu photo.
const favorites = [
  { name: "Truffle Carbonara", category: "Pasta", photo: pastaPhoto, views: 1284 },
  { name: "Garden Caesar Salad", category: "Salad", photo: saladPhoto, views: 962 },
  { name: "Loaded Nachos", category: "Savory Bites", photo: nachosPhoto, views: 874 },
  { name: "Fresh Fruit Juice", category: "Zero-Proof", photo: juicesPhoto, views: 803 },
];

const stats = [
  { label: "Total Menu Items", value: "17", sub: "Across 13 categories", icon: UtensilsCrossed },
  { label: "Menu Views", value: "12,480", sub: "This month · sample data", icon: Eye },
  { label: "Survey Responses", value: "326", sub: "This month · sample data", icon: MessageSquare },
  { label: "Active Events", value: "3", sub: "Running or coming up", icon: CalendarDays },
];

function greetingFor(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboard() {
  const [storeOnline, setStoreOnline] = useState(true);
  const pager = usePagination(favorites);
  const staff = useStaffIdentity();

  const now = new Date();

  const storeToggle = (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#EAE5DF] bg-white px-4 py-2.5 shadow-sm sm:w-auto">
      <div>
        <p className={`text-sm font-bold ${storeOnline ? "text-emerald-700" : "text-gray-600"}`}>
          {storeOnline ? "● Menu online" : "○ Menu paused"}
        </p>
        <p className="text-xs font-semibold text-gray-500">Opens at 4:00 PM</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={storeOnline}
        aria-label="Toggle store status"
        onClick={() => setStoreOnline((value) => !value)}
        className="flex h-11 shrink-0 items-center"
      >
        <span
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${storeOnline ? "bg-emerald-500" : "bg-gray-400"}`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${storeOnline ? "translate-x-8" : "translate-x-1"}`}
          />
        </span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
      title={`${greetingFor(now.getHours())}, ${staff.firstName}`}
        description={today}
        showDescriptionOnPhone
        actions={storeToggle}
      />

      {!storeOnline && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-950">Menu is paused.</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Items show as unavailable until the store is back online.
          </p>
        </div>
      )}

      <StatGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatGrid>

      <DataCard
        title="Customer Favorites This Month"
        description="Most viewed menu items · Sample data"
        bodyClassName="px-4 sm:px-6"
        footer={<Pagination {...pager} label="Customer favorites pages" />}
      >
        <ol className="divide-y divide-[#EFEAE4]">
          {pager.pageItems.map(({ name, category, photo, views }) => {
            const rank = favorites.findIndex((item) => item.name === name) + 1;

            return (
              <li key={name} className="flex min-w-0 items-center gap-3 py-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                    rank === 1
                      ? "bg-[#E58422] text-white"
                      : "bg-[#FFF3E7] text-[#B96916]"
                  }`}
                >
                  {rank}
                </span>

                <img
                  src={photo}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#19244E]">{name}</p>
                  <p className="truncate text-xs font-semibold text-gray-400">{category}</p>
                </div>

                <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-gray-600">
                  <Eye size={13} className="hidden text-gray-400 sm:block" />
                  {views.toLocaleString()}
                  <span className="hidden font-semibold text-gray-400 sm:inline">views</span>
                </span>
              </li>
            );
          })}
        </ol>
      </DataCard>
    </div>
  );
}
