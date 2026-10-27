import React, { useState, useEffect, useRef } from 'react';
import ItemDetailsModal from './ItemDetailsModal.jsx';
import hiromiImg from '@/assets/hiromi.png';

const mockCafeData = [
  // --- SIGNATURES CATEGORY ---
  {
    id: 1,
    name: 'Stubble',
    category: 'Signatures',
    price: '₱140',
    description: 'A bold and classic Americano, featuring rich espresso poured perfectly over water. Can request if sweetened or not.',
    flavorProfile: ['ROBUST', 'SMOOTH'],
    contains: 'COFFEE',
    status: 'AVAILABLE',
    image: hiromiImg
  },
  {
    id: 2,
    name: 'Mutton Chops',
    category: 'Signatures',
    price: '₱150',
    description: 'Rich double espresso gently layered over velvety fresh milk for a creamy, well-rounded finish.',
    flavorProfile: ['CREAMY', 'BOLD'],
    contains: 'COFFEE, DAIRY',
    status: 'SOLD OUT',
    image: hiromiImg
  },
  {
    id: 3,
    name: 'Van Dyke',
    category: 'Signatures',
    price: '₱165',
    description: 'Espresso with textured milk, delicately sweetened with aromatic cardamom pods.',
    flavorProfile: ['AROMATIC', 'SWEET'],
    contains: 'COFFEE, DAIRY, CARDAMOM',
    status: 'AVAILABLE',
    image: hiromiImg
  },

  // --- PASTA CATEGORY ---
  {
    id: 4,
    name: 'Carbonara',
    category: 'Pasta',
    price: '₱190',
    description: 'Creamy pasta tossed in a rich carbonara sauce with crispy bacon, finished with parmesan cheese and a hint of garlic.',
    flavorProfile: ['SAVORY', 'RICH'],
    contains: 'GLUTEN, DAIRY, EGG, PORK',
    status: 'AVAILABLE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmmCjcofTtYyjGVaDVubhQ7GBDFZZwkzeyJcRtV-N62E2zrHzt0zF9c7uYKmvGfj3WtUbfzZoKSwi1uPCx2aYo2wDro_jWzmXsiEAyRe05x-MWABcOQ-gbOgLAqOjGGFqRV9gH9TvfAmZgYwehz4znin-x2LpXrmn696K2iFgA4zJ8ZOk7fDyUmfGS6xfh468GNqL5AbYMYoALG3krDAweC3BeBSu9r5OfLEv3-EUHjfgH-cMugNAa'
  },
  {
    id: 5,
    name: 'Creamy Pesto',
    category: 'Pasta',
    price: '₱170',
    description: 'Creamy fresh basil pesto pasta with prawns and full of authentic flavor.',
    flavorProfile: ['HERBACEOUS', 'SAVORY'],
    contains: 'GLUTEN, DAIRY, SEAFOOD',
    status: 'AVAILABLE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmmCjcofTtYyjGVaDVubhQ7GBDFZZwkzeyJcRtV-N62E2zrHzt0zF9c7uYKmvGfj3WtUbfzZoKSwi1uPCx2aYo2wDro_jWzmXsiEAyRe05x-MWABcOQ-gbOgLAqOjGGFqRV9gH9TvfAmZgYwehz4znin-x2LpXrmn696K2iFgA4zJ8ZOk7fDyUmfGS6xfh468GNqL5AbYMYoALG3krDAweC3BeBSu9r5OfLEv3-EUHjfgH-cMugNAa'
  }
];

// ==============================================================================
// 2. CATEGORIES LIST WITH ICONS
// ==============================================================================
const categoriesList = [
  { name: 'Signatures', icon: '★' },
  { name: 'Specialty Coffee', icon: '☕' },
  { name: 'Competition Artisans', icon: '🏆' },
  { name: 'Milk Creations', icon: '💧' },
  { name: 'Zero-Proof', icon: '🍹' },
  { name: 'Matcha', icon: '🍵' },
  { name: 'Foam Series', icon: '🫧' },
  { name: 'Bespokes', icon: '🍸' },
  { name: 'Savory Bites', icon: '🥐' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Rice', icon: '🍚' },
  { name: 'Salad', icon: '🥗' },
  { name: 'Extras', icon: '＋' }
];

// ==============================================================================
// 3. MAIN COMPONENT: MenuPage
// ==============================================================================
export default function MenuPage({ onNavigate, onSelectItem, sidebarOpen: openProp, onSidebarOpenChange }) {
  const [activeCategory, setActiveCategory] = useState('Signatures');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedItem, setLocalSelectedItem] = useState(null);

  // Controls the mobile slide-in drawer. The parent (header hamburger) can open it
  // by passing sidebarOpen + onSidebarOpenChange; otherwise it manages itself.
  const [internalOpen, setInternalOpen] = useState(false);
  const sidebarOpen = openProp ?? internalOpen;
  const setSidebarOpen = onSidebarOpenChange ?? setInternalOpen;

  // NEW: close drawer with Escape key, and lock page scroll while it is open
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Mobile category chips: keep the active chip scrolled into view
  const chipsRef = useRef(null);
  useEffect(() => {
    const chip = chipsRef.current?.querySelector(`[data-chip="${activeCategory}"]`);
    chip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeCategory]);

  const handleItemClick = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    } else {
      setLocalSelectedItem(item);
    }
  };

  // NEW: pick a category, then close the drawer (matters on mobile only)
  const handleCategorySelect = (name) => {
    setActiveCategory(name);
    setSearchQuery(''); // picking a category leaves search mode
    setSidebarOpen(false);
  };

  // UNIVERSAL SEARCH (by product name): while the search box has text, search the
  // WHOLE menu. An item matches when every word you typed is the START of a word in
  // its name ("pesto" finds Creamy Pesto, "c" finds Carbonara, Creamy Pesto, Mutton Chops).
  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;
  const terms = query.split(/\s+/).filter(Boolean);

  const nameWords = (item) => item.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

  const itemMatchesSearch = (item) => {
    const words = nameWords(item);
    return terms.every((term) => words.some((w) => w.startsWith(term)));
  };

  // Used for sorting: names that START with what you typed come first
  const startsWithQuery = (item) => item.name.toLowerCase().startsWith(query);

  const filteredItems = isSearching
    ? mockCafeData
        .filter(itemMatchesSearch)
        .sort((a, b) => Number(startsWithQuery(b)) - Number(startsWithQuery(a)))
    : mockCafeData.filter((item) => item.category === activeCategory);

  // Match count per category, shown in the sidebar while searching
  const matchCounts = isSearching
    ? mockCafeData.filter(itemMatchesSearch).reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] antialiased">
      <div className="max-w-360 mx-auto flex flex-col md:flex-row">

        {/* ================================================================== */}
        {/* MOBILE CATEGORY BAR: label + "See All" (opens the drawer) + chips   */}
        {/* ================================================================== */}
        <div className="md:hidden border-b border-black/10">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-xs text-neutral-600 font-medium">Menu Categories</p>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="See all menu categories"
              aria-expanded={sidebarOpen}
              className="flex items-center gap-1.5 rounded-full bg-[#F6DFC6] px-3 py-1.5 text-xs font-bold text-[#19244E] hover:bg-[#F1D2AE] cursor-pointer"
            >
              See All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="15" y2="12" />
                <line x1="4" y1="17" x2="10" y2="17" />
              </svg>
            </button>
          </div>

          <div
            ref={chipsRef}
            className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categoriesList.map((category) => {
              const isActive = !isSearching && activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  data-chip={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  aria-pressed={isActive}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#19244E] cursor-pointer border-b-2 transition-colors ${
                    isActive
                      ? 'bg-[#F1D2AE] border-[#E58422]'
                      : 'bg-[#F6DFC6] border-transparent hover:bg-[#F1D2AE]'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================== */}
        {/* DARK OVERLAY: only on mobile, only while the drawer is open        */}
        {/* ================================================================== */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ================================================================== */}
        {/* SIDEBAR                                                            */}
        {/* Mobile: off-screen drawer that slides in.                          */}
        {/* Desktop (md+): normal, always-visible full sidebar.                */}
        {/* ================================================================== */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] overflow-y-auto bg-[#FFF3E7] p-6
            transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}

            md:static md:z-auto md:translate-x-0 md:shadow-none md:max-w-none md:overflow-visible
            md:bg-transparent md:w-64 lg:w-72 md:pr-4 md:border-r md:border-black/10 md:shrink-0
          `}
        >
          {/* Sidebar Section Title + mobile close button */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-[#19244E] tracking-tight">
                Menu Categories
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Explore our craft
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu categories"
              className="md:hidden p-1.5 -mr-1.5 rounded-lg text-[#19244E] hover:bg-black/5 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          {/* Categories: always a vertical list now (drawer on mobile, sidebar on desktop) */}
          <nav className="flex flex-col gap-1.5">
            {categoriesList.map((category) => {
              const isActive = !isSearching && activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#E58422] text-white shadow-md'
                      : 'text-[#19244E] hover:bg-black/5'
                  }`}
                >
                  <span className="text-sm shrink-0">{category.icon}</span>
                  <span className="truncate">{category.name}</span>
                  {isSearching && (
                    <span
                      className={`ml-auto shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        matchCounts[category.name] ? 'bg-[#E58422] text-white' : 'bg-black/5 text-neutral-400'
                      }`}
                    >
                      {matchCounts[category.name] || 0}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Direct link to About Us from the Menu (desktop sidebar only) */}
          {onNavigate && (
            <div className="hidden md:block mt-8 p-4 bg-white/70 rounded-xl border border-black/10">
              <span className="text-[10px] font-bold text-[#E58422] uppercase tracking-wider block mb-1">
                Behind The Brew
              </span>
              <p className="text-xs text-[#19244E] font-semibold mb-1">
                Curious about our roastery?
              </p>
              <p className="text-[11px] text-neutral-600 mb-3 leading-relaxed">
                Read how Beardista Brew brings specialty coffee to Caloocan.
              </p>
              <button
                onClick={() => onNavigate('story')}
                className="w-full py-2 px-3 bg-[#19244E] hover:bg-[#19244E]/90 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>About Us</span>
                <span>→</span>
              </button>
            </div>
          )}
        </aside>

        {/* ================================================================== */}
        {/* MAIN CONTENT AREA                                                  */}
        {/* ================================================================== */}
        <main className="flex-1 p-4 md:p-10">

          {/* Top Search Bar */}
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
                aria-label="Search the whole menu"
                className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-neutral-300 rounded-md text-xs tracking-wider uppercase text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#19244E] cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Active Category Header with Navy Underline Bar */}
          <div className="mb-8 pb-3 border-b-2 border-[#19244E] inline-block">
            <h1 className="text-3xl md:text-4xl font-black text-[#19244E] uppercase tracking-wide">
              {isSearching ? 'Search results' : activeCategory}
            </h1>
          </div>

          {isSearching && (
            <p className="mb-6 text-xs text-neutral-600" role="status">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found for "{searchQuery.trim()}" across all categories
            </p>
          )}

          {/* Empty State Guard */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-black/10">
              {isSearching ? (
                <>
                  <p className="text-base font-bold text-[#19244E]">
                    No items found for "{searchQuery.trim()}".
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try a different product name, or clear the search to browse by category.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-bold text-[#19244E]">
                    No items available in this category yet.
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try another category, or search the whole menu above.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  showCategory={isSearching}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* Standalone Inspection Dialog fallback */}
      {!onSelectItem && (
        <ItemDetailsModal
          item={localSelectedItem}
          onClose={() => setLocalSelectedItem(null)}
        />
      )}
    </div>
  );
}

// ==============================================================================
// 4. SUB-COMPONENT: MenuItemCard (unchanged)
// ==============================================================================
function MenuItemCard({ item, onClick, showCategory = false }) {
  const isAvailable = item.status === 'AVAILABLE';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      <div className="relative aspect-square md:aspect-auto md:h-36 bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'grayscale opacity-70' : ''
          }`}
          loading="lazy"
        />

        <span
          className={`absolute top-1.5 right-1.5 md:top-3 md:right-3 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-sm uppercase tracking-wider shadow-sm ${
            isAvailable
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="p-2 md:p-4 flex flex-col grow">
        {showCategory && (
          <span className="mb-1 md:mb-2 self-start text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-black/5 px-1.5 md:px-2 py-0.5 rounded">
            {item.category}
          </span>
        )}
        <div className="flex flex-col items-start gap-1 md:flex-row md:justify-between md:gap-2 mb-1 md:mb-2">
          <h3 className="text-xs md:text-base font-bold text-[#19244E] group-hover:text-[#E58422] transition-colors leading-snug line-clamp-2">
            {item.name}
          </h3>
          <span className="bg-[#E58422] text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded shrink-0">
            {item.price}
          </span>
        </div>

        <p className="hidden md:block text-xs text-neutral-600 leading-relaxed grow line-clamp-2">
          {item.description}
        </p>

        <div className="hidden md:flex mt-2 pt-2 border-t border-black/5 items-center justify-between text-[11px] font-bold text-[#E58422] uppercase tracking-wider">
          <span>View Details</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

    </div>
  );
}
