import { useMemo } from "react";
import { CalendarDays, Eye, Image as ImageIcon, MessageSquare, UtensilsCrossed } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard, { StatGrid } from "../components/StatCard";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import BrewingLoader from "../components/BrewingLoader";
import { usePagination } from "../components/usePageSize";
import { useStaffIdentity } from "../components/useStaffIdentity";
import { useCategories, useMenuItems } from "../../../backend/hooks/useMenu";
import { useStoreSettings, useUpdateStoreSetting } from "../../../backend/hooks/useContent";
import { useEvents } from "../../../backend/hooks/useEvents";
import { useSurveyResponsesAdmin } from "../../../backend/hooks/useAnalyticsAdmin";

const MENU_ONLINE_KEY = "menu_online";
const STORE_KEY = "store_info";
const FAVORITES_LIMIT = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

function greetingFor(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// "YYYY-MM-DD" for today in Manila, to compare with event dates.
const todayInManila = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

export default function AdminDashboard() {
  const staff = useStaffIdentity();
  const itemsQuery = useMenuItems();
  const categoriesQuery = useCategories();
  const settingsQuery = useStoreSettings();
  const updateSetting = useUpdateStoreSetting();
  const eventsQuery = useEvents({ includeDraft: true });
  const responsesQuery = useSurveyResponsesAdmin();

  const now = new Date();
  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const items = itemsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const settings = settingsQuery.data ?? [];

  const storeOnline = settings.find((setting) => setting.key === MENU_ONLINE_KEY)?.value?.online ?? true;
  const openingTime = settings.find((setting) => setting.key === STORE_KEY)?.value?.openingTime;

  const favorites = useMemo(() => {
    const categoryNames = Object.fromEntries(categories.map((category) => [category.id, category.name]));
    return items
      .filter((item) => (item.view_count ?? 0) > 0)
      .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
      .slice(0, FAVORITES_LIMIT)
      .map((item) => ({
        id: item.id,
        name: item.name,
        category: categoryNames[item.category_id] ?? "No category",
        photo: item.image_url,
        views: item.view_count ?? 0,
      }));
  }, [items, categories]);

  const pager = usePagination(favorites);

  const totalViews = items.reduce((sum, item) => sum + (item.view_count ?? 0), 0);

  const since = Date.now() - 30 * DAY_MS;
  const recentResponses = (responsesQuery.data ?? []).filter(
    (response) => new Date(response.created_at).getTime() >= since
  ).length;

  const todayKey = todayInManila();
  const activeEvents = (eventsQuery.data ?? []).filter((event) => {
    const eventDay =
      event.event_date ??
      (event.start_time ? new Date(event.start_time).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }) : null);
    return ["open", "closed"].includes(event.status) && (!eventDay || eventDay >= todayKey);
  }).length;

  const loadingStat = (query) => (query.isPending ? "…" : query.isError ? "—" : null);

  const stats = [
    {
      label: "Total Menu Items",
      value: loadingStat(itemsQuery) ?? items.length,
      sub: `Across ${categories.length} ${categories.length === 1 ? "category" : "categories"}`,
      icon: UtensilsCrossed,
    },
    {
      label: "Menu Views",
      value: loadingStat(itemsQuery) ?? totalViews.toLocaleString(),
      sub: "All time",
      icon: Eye,
    },
    {
      label: "Survey Responses",
      value: loadingStat(responsesQuery) ?? recentResponses,
      sub: "Last 30 days",
      icon: MessageSquare,
    },
    {
      label: "Active Events",
      value: loadingStat(eventsQuery) ?? activeEvents,
      sub: "Open or coming up",
      icon: CalendarDays,
    },
  ];

  const toggleStore = async () => {
    try {
      await updateSetting.mutateAsync({ key: MENU_ONLINE_KEY, value: { online: !storeOnline } });
    } catch {
      // The switch simply stays where it was; the saved value is unchanged.
    }
  };

  const storeToggle = (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#EAE5DF] bg-white px-4 py-2.5 shadow-sm sm:w-auto">
      <div>
        <p className={`text-sm font-bold ${storeOnline ? "text-emerald-700" : "text-gray-600"}`}>
          {storeOnline ? "● Menu online" : "○ Menu paused"}
        </p>
        {openingTime && <p className="text-xs font-semibold text-gray-500">Opens at {openingTime}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={storeOnline}
        aria-label="Toggle store status"
        onClick={toggleStore}
        disabled={updateSetting.isPending || settingsQuery.isPending}
        className="flex h-11 shrink-0 items-center disabled:cursor-wait disabled:opacity-60"
      >
        <span className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${storeOnline ? "bg-emerald-500" : "bg-gray-400"}`}>
          <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${storeOnline ? "translate-x-8" : "translate-x-1"}`} />
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
          <p className="mt-1 text-xs leading-5 text-amber-800">Items show as unavailable until the store is back online.</p>
        </div>
      )}

      <StatGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatGrid>

      <DataCard
        title="Customer Favorites"
        description="Most viewed menu items, all time"
        bodyClassName="px-4 sm:px-6"
        footer={favorites.length > 0 && <Pagination {...pager} label="Customer favorites pages" />}
      >
        {itemsQuery.isPending ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <BrewingLoader label="Loading favorites..." />
          </div>
        ) : itemsQuery.isError ? (
          <EmptyState
            title="We couldn't load the menu."
            message="Check your connection and try again."
            action={
              <button
                type="button"
                onClick={() => itemsQuery.refetch()}
                className="min-h-11 rounded-xl bg-[#19244E] px-4 text-xs font-bold text-white hover:bg-[#253570]"
              >
                Try again
              </button>
            }
          />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={Eye}
            title="No views yet."
            message="When customers open items on the menu, the most popular ones show up here."
          />
        ) : (
          <ol className="divide-y divide-[#EFEAE4]">
            {pager.pageItems.map(({ id, name, category, photo, views }) => {
              const rank = favorites.findIndex((item) => item.id === id) + 1;

              return (
                <li key={id} className="flex min-w-0 items-center gap-3 py-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                      rank === 1 ? "bg-[#E58422] text-white" : "bg-[#FFF3E7] text-[#B96916]"
                    }`}
                  >
                    {rank}
                  </span>

                  {photo ? (
                    <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E7] text-[#B96916]">
                      <ImageIcon size={18} />
                    </span>
                  )}

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
        )}
      </DataCard>
    </div>
  );
}