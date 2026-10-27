import React, { useEffect, useMemo, useState } from 'react';
import ItemDetailsModal from './ItemDetailsModal.jsx';
import { useCategories, useMenuItems } from '../../backend/hooks/useMenu';
import { useStoreSettings } from '../../backend/hooks/useContent';
import { buildMenuItems } from '../../backend/mappers/menuMapper';

const MENU_ONLINE_KEY = 'menu_online';

// Emoji shown when a category has no uploaded icon, picked from its name.
const ICON_HINTS = [
  [/signature/i, '★'],
  [/matcha/i, '🍵'],
  [/milk/i, '💧'],
  [/foam/i, '🫧'],
  [/zero|juice|soda|sparkl/i, '🍹'],
  [/bespoke|cocktail|mocktail/i, '🍸'],
  [/competition|artisan/i, '🏆'],
  [/pasta/i, '🍝'],
  [/rice/i, '🍚'],
  [/salad/i, '🥗'],
  [/bite|savory|pastr|bread/i, '🥐'],
  [/food|meal/i, '🍽️'],
  [/extra|add/i, '＋'],
  [/coffee|espresso|brew/i, '☕'],
];

const iconFor = (name) => ICON_HINTS.find(([pattern]) => pattern.test(name))?.[1] ?? '☕';

export default function MenuPage({ onNavigate, onSelectItem }) {
  const itemsQuery = useMenuItems({ availableOnly: true });
  const categoriesQuery = useCategories({ activeOnly: true });
  const settingsQuery = useStoreSettings();

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedItem, setLocalSelectedItem] = useState(null);

  const storeOnline =
    settingsQuery.data?.find((setting) => setting.key === MENU_ONLINE_KEY)?.value?.online ?? true;

  const items = useMemo(
    () => buildMenuItems(itemsQuery.data, categoriesQuery.data, storeOnline),
    [itemsQuery.data, categoriesQuery.data, storeOnline]
  );

  // Only categories that have at least one item, in the order set in the admin.
  const categories = useMemo(
    () =>
      (categoriesQuery.data ?? [])
        .filter((category) => items.some((item) => item.categoryId === category.id))
        .map((category) => ({
          id: category.id,
          name: category.name,
          iconUrl: category.icon_url ?? null,
          badge: category.badge ?? null,
        })),
    [categoriesQuery.data, items]
  );

  // Pick the first category once data arrives, or if the active one disappears.
  useEffect(() => {
    if (categories.length === 0) return;
    if (!categories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const activeCategory = categories.find((category) => category.id === activeCategoryId);

  const handleItemClick = (item) => {
    if (onSelectItem) onSelectItem(item);
    else setLocalSelectedItem(item);
  };

  // Searching looks across every category; otherwise show the active one.
  const query = searchQuery.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (query) {
      return item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    }
    return item.categoryId === activeCategoryId;
  });

  const loading = itemsQuery.isPending || categoriesQuery.isPending;
  const failed = itemsQuery.isError || categoriesQuery.isError;

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] antialiased">
      <div className="max-w-360 mx-auto flex flex-col md:flex-row">
        {/* LEFT SIDEBAR: Menu Categories */}
        <aside className="w-full md:w-64 lg:w-72 p-6 md:pr-4 border-r border-black/10 shrink-0">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-[#19244E] tracking-tight">Menu Categories</h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Explore our craft</p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('story')}
                className="text-xs font-bold text-[#E58422] hover:underline md:hidden cursor-pointer min-h-11"
              >
                About Us →
              </button>
            )}
          </div>

          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {loading
              ? [1, 2, 3, 4].map((key) => (
                  <span key={key} className="h-11 w-36 md:w-full shrink-0 animate-pulse rounded-full bg-black/5" />
                ))
              : categories.map((category) => {
                  const isActive = !query && activeCategoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategoryId(category.id);
                        setSearchQuery('');
                      }}
                      className={`flex min-h-11 items-center gap-2.5 px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-left ${
                        isActive ? 'bg-[#E58422] text-white shadow-md' : 'text-[#19244E] hover:bg-black/5'
                      }`}
                    >
                      {category.iconUrl ? (
                        <img src={category.iconUrl} alt="" className="h-5 w-5 shrink-0 rounded object-cover" />
                      ) : (
                        <span className="text-sm shrink-0">{iconFor(category.name)}</span>
                      )}
                      <span className="truncate">{category.name}</span>
                    </button>
                  );
                })}
          </nav>

          {onNavigate && (
            <div className="hidden md:block mt-8 p-4 bg-white/70 rounded-xl border border-black/10">
              <span className="text-[10px] font-bold text-[#E58422] uppercase tracking-wider block mb-1">Behind The Brew</span>
              <p className="text-xs text-[#19244E] font-semibold mb-1">Curious about our roastery?</p>
              <p className="text-[11px] text-neutral-600 mb-3 leading-relaxed">
                Read how Beardista Brew brings specialty coffee to Caloocan.
              </p>
              <button
                onClick={() => onNavigate('story')}
                className="w-full min-h-11 py-2 px-3 bg-[#19244E] hover:bg-[#19244E]/90 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>About Us</span>
                <span>→</span>
              </button>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT: search, title, item grid */}
        <main className="flex-1 p-6 md:p-10">
          {!storeOnline && (
            <div role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-950">Our menu is paused right now.</p>
              <p className="mt-1 text-xs text-amber-800">You can still browse. Please check back during opening hours.</p>
            </div>
          )}

          <div className="mb-8">
            <div className="relative max-w-2xl">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="SEARCH THE BREW..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search the menu"
                className="w-full min-h-11 pl-10 pr-4 py-2.5 bg-transparent border border-neutral-300 rounded-md text-xs tracking-wider uppercase text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
              />
            </div>
          </div>

          <div className="mb-8 pb-3 border-b-2 border-[#19244E] inline-block">
            <h1 className="text-3xl md:text-4xl font-black text-[#19244E] uppercase tracking-wide">
              {query ? 'Search Results' : activeCategory?.name ?? 'Menu'}
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3].map((key) => (
                <div key={key} className="h-72 animate-pulse rounded-xl bg-white/60" />
              ))}
            </div>
          ) : failed ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-black/10">
              <p className="text-base font-bold text-[#19244E]">We couldn't load the menu.</p>
              <button
                onClick={() => {
                  itemsQuery.refetch();
                  categoriesQuery.refetch();
                }}
                className="mt-3 min-h-11 rounded-lg bg-[#19244E] px-4 text-xs font-bold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-black/10">
              <p className="text-base font-bold text-[#19244E]">
                {query ? 'Nothing on the menu matches that.' : 'No items in this category yet.'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {query ? 'Try another word.' : 'Check back soon, something good is brewing.'}
              </p>
            </div>
          ) : (
            // 2 cards per row on phones, as the layout rules require.
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {!onSelectItem && <ItemDetailsModal item={localSelectedItem} onClose={() => setLocalSelectedItem(null)} />}
    </div>
  );
}

function MenuItemCard({ item, onClick }) {
  const isAvailable = item.status === 'AVAILABLE';

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative h-32 sm:h-56 bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
          loading="lazy"
        />
        <span
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm ${
            isAvailable
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="p-3 sm:p-5 flex flex-col grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
          <h3 className="text-sm sm:text-lg font-bold text-[#19244E] group-hover:text-[#E58422] transition-colors leading-snug">
            {item.name}
          </h3>
          <span className="self-start bg-[#E58422] text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">{item.price}</span>
        </div>

        <p className="hidden sm:block text-xs text-neutral-600 leading-relaxed grow line-clamp-2">{item.description}</p>

        <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#E58422] uppercase tracking-wider">
          <span>View Details</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}