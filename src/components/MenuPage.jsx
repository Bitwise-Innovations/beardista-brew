import React, { useState } from 'react';
import ItemDetailsModal from './ItemDetailsModal.jsx';
import hiromiImg from '../assets/hiromi.png'; // <-- Added the import for hiromi.png

// ==============================================================================
// 1. MOCK DATA ARRAY
// Contains test items for 'Signatures' and 'Pasta' with complete flavor and ingredient details.
// ==============================================================================
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
    image: hiromiImg // <-- Updated to local asset
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
    image: hiromiImg // <-- Updated to local asset
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
    image: hiromiImg // <-- Updated to local asset
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
export default function MenuPage({ onNavigate, onSelectItem }) {
  // STATE 1: Tracks the currently active category. Defaults to 'Signatures'.
  const [activeCategory, setActiveCategory] = useState('Signatures');

  // STATE 2: Optional search input filter for quick text lookup
  const [searchQuery, setSearchQuery] = useState('');

  // STATE 3: Local selected item state (fallback when component is tested standalone)
  const [localSelectedItem, setLocalSelectedItem] = useState(null);

  // HANDLER: Card click router
  const handleItemClick = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    } else {
      setLocalSelectedItem(item);
    }
  };

  // FILTERING LOGIC:
  const filteredItems = mockCafeData.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    // Outer page container
    <div className="min-h-screen bg-[#FFF3E7] text-[#111111] antialiased">
      <div className="max-w-360 mx-auto flex flex-col md:flex-row">
        
        {/* ================================================================== */}
        {/* LEFT SIDEBAR: Menu Categories Navigation                           */}
        {/* ================================================================== */}
        <aside className="w-full md:w-64 lg:w-72 p-6 md:pr-4 border-r border-black/10 shrink-0">
          {/* Sidebar Section Title */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-[#19244E] tracking-tight">
                Menu Categories
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Explore our craft
              </p>
            </div>
            {/* Mobile About Us link */}
            {onNavigate && (
              <button
                onClick={() => onNavigate('story')}
                className="text-xs font-bold text-[#E58422] hover:underline md:hidden cursor-pointer"
              >
                About Us →
              </button>
            )}
          </div>

          {/* Categories Button List */}
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {categoriesList.map((category) => {
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#E58422] text-white shadow-md'
                      : 'text-[#19244E] hover:bg-black/5'
                  }`}
                >
                  <span className="text-sm shrink-0">{category.icon}</span>
                  <span className="truncate">{category.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Connection Feature: Direct link to About Us from the Menu */}
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
        {/* MAIN CONTENT AREA: Search Bar, Category Title, and Product Grid     */}
        {/* ================================================================== */}
        <main className="flex-1 p-6 md:p-10">
          
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
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-neutral-300 rounded-md text-xs tracking-wider uppercase text-[#19244E] placeholder:text-neutral-400 focus:outline-none focus:border-[#19244E]"
              />
            </div>
          </div>

          {/* Active Category Header with Navy Underline Bar */}
          <div className="mb-8 pb-3 border-b-2 border-[#19244E] inline-block">
            <h1 className="text-3xl md:text-4xl font-black text-[#19244E] uppercase tracking-wide">
              {activeCategory}
            </h1>
          </div>

          {/* Empty State Guard */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-black/10">
              <p className="text-base font-bold text-[#19244E]">
                No items available in this category yet.
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try toggling between 'Signatures' and 'Pasta' to test the filter logic!
              </p>
            </div>
          ) : (
            // Responsive 3-Column Item Cards Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
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
// 4. SUB-COMPONENT: MenuItemCard
// Renders an individual product card: image, status tag, title, price, description.
// Invokes onClick when selected to view deep ItemDetails.
// ==============================================================================
function MenuItemCard({ item, onClick }) {
  const isAvailable = item.status === 'AVAILABLE';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
    >
      {/* Card Image Container with Status Tag Badge */}
      <div className="relative h-56 bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'grayscale opacity-70' : ''
          }`}
          loading="lazy"
        />

        {/* Status Badge Tag */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm ${
            isAvailable
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Card Text Content */}
      <div className="p-5 flex flex-col grow">
        {/* Top Row: Item Title & Orange Price Pill */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-[#19244E] group-hover:text-[#E58422] transition-colors leading-snug">
            {item.name}
          </h3>
          <span className="bg-[#E58422] text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
            {item.price}
          </span>
        </div>

        {/* Item Description */}
        <p className="text-xs text-neutral-600 leading-relaxed grow line-clamp-2">
          {item.description}
        </p>

        {/* Visual cue to open ItemDetails */}
        <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#E58422] uppercase tracking-wider">
          <span>View Details</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>

    </div>
  );
}