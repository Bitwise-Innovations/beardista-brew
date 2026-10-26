import React, { useState, useMemo } from 'react';

// ==============================================================================
// 1. EXACT CATEGORIES LIST
// ==============================================================================
export const CATEGORY_PILLS = [
  'All Items',
  'Signatures',
  'Specialty Coffee',
  'Competition Artisans',
  'Milk Creations',
  'Zero-Proof',
  'Matcha',
  'Foam Series',
  'Bespokes',
  'Savory Bites',
  'Pasta',
  'Rice',
  'Salad',
  'Extras'
];

// ==============================================================================
// 2. EXHAUSTIVE INITIAL MOCK DATA ARRAY
// ==============================================================================
export const initialMenuData = [
  // --- SIGNATURES (ALL 10 FROM REFERENCE PHOTO) ---
  {
    id: 1,
    category: 'Signatures',
    name: 'Stubble',
    price: 'P140.00',
    description: 'A bold and classic Americano, featuring rich espresso poured perfectly over water. Can request if sweetened or not.',
    available: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Bold and classic Americano, rich espresso'
  },
  {
    id: 2,
    category: 'Signatures',
    name: 'Mutton Chops',
    price: 'P150.00',
    description: 'Rich double espresso gently layered over velvety fresh milk for a creamy, well-rounded finish.',
    available: true,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Rich double espresso & velvety fresh milk'
  },
  {
    id: 3,
    category: 'Signatures',
    name: 'Van Dyke',
    price: 'P165.00',
    description: 'A decadent blend of espresso, steamed milk, and rich chocolate syrup, topped with a velvety foam.',
    available: true,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Espresso, steamed milk & rich chocolate syrup'
  },
  {
    id: 4,
    category: 'Signatures',
    name: 'Verdi',
    price: 'P165.00',
    description: 'Smooth espresso meets creamy milk and sweet caramel syrup, finished with a luscious caramel drizzle.',
    available: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Smooth espresso, creamy milk & caramel drizzle'
  },
  {
    id: 5,
    category: 'Signatures',
    name: 'Ducktail',
    price: 'P175.00',
    description: 'Espresso combined with fresh milk and sweet, buttery white chocolate sauce, topped with silky foam.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Fresh milk, buttery white chocolate sauce & silky foam'
  },
  {
    id: 6,
    category: 'Signatures',
    name: 'Garibaldi',
    price: 'P175.00',
    description: 'A unique fusion of espresso and creamy milk infused with warm, sweet, and nutty cinnamon-spiced hazelnut syrup.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Warm, sweet, and nutty cinnamon-spiced hazelnut syrup'
  },
  {
    id: 7,
    category: 'Signatures',
    name: 'Soul Patch',
    price: 'P175.00',
    description: 'Espresso with creamy milk and rich sea salt caramel syrup, perfectly balancing sweet and savory notes.',
    available: true,
    image: 'https://images.unsplash.com/photo-1585494156145-1c60a4fe9d2b?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Creamy milk, rich sea salt caramel syrup'
  },
  {
    id: 8,
    category: 'Signatures',
    name: 'Bandholz',
    price: 'P175.00',
    description: 'Rich espresso blended with milk and sweet, toasted hazelnut syrup, creating a cozy and comforting beverage.',
    available: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Blended milk and sweet, toasted hazelnut syrup'
  },
  {
    id: 9,
    category: 'Signatures',
    name: 'French Fork',
    price: 'P180.00',
    description: 'A soothing blend of espresso, steamed milk, and aromatic vanilla syrup, finished with a smooth, velvety texture.',
    available: true,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Aromatic vanilla syrup & smooth, velvety texture'
  },
  {
    id: 10,
    category: 'Signatures',
    name: 'Chin Curtain',
    price: 'P180.00',
    description: 'A luxurious mix of espresso, creamy milk, and rich dark chocolate syrup with a refreshing hint of mint.',
    available: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Rich dark chocolate syrup with refreshing hint of mint'
  },

  // --- SPECIALTY COFFEE ---
  {
    id: 101,
    category: 'Specialty Coffee',
    name: 'Flat White',
    price: 'P150.00',
    description: 'Strong espresso, silky milk, smooth finish. Crafted for true coffee lover.',
    available: true,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Double ristretto & micro-foamed whole milk'
  },
  {
    id: 102,
    category: 'Specialty Coffee',
    name: 'Cappuccino',
    price: 'P170.00',
    description: 'Rich espresso topped with steamed milk and fluffy foam.',
    available: true,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Deep espresso with dense, airy foam peak'
  },
  {
    id: 103,
    category: 'Specialty Coffee',
    name: 'Single Origin',
    price: 'P170.00',
    description: 'Cortado of your beans choice from our guest beans.',
    available: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Rotating guest microlots, citrus & floral clarity'
  },
  {
    id: 104,
    category: 'Specialty Coffee',
    name: 'Filter / Pour-Over',
    price: 'P180.00',
    description: 'Ask the barista for the guest beans.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Precision V60 extracted single origin reserve'
  },

  // --- COMPETITION ARTISANS ---
  {
    id: 201,
    category: 'Competition Artisans',
    name: 'M3 (Bicol Express)',
    price: 'P200.00',
    description: 'Espresso with creamy coconut notes, subtle spicy finish, topped with bacon.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Creamy coconut milk, mild bird eye chili, crispy bacon'
  },
  {
    id: 202,
    category: 'Competition Artisans',
    name: 'Palitaw',
    price: 'P250.00',
    description: 'Nostalgic Filipino Meryenda turned into a modern comforting beverage.',
    available: true,
    image: 'https://images.unsplash.com/photo-1585494156145-1c60a4fe9d2b?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Glutinous rice cream, toasted sesame seed, grated coconut'
  },
  {
    id: 203,
    category: 'Competition Artisans',
    name: 'Turon',
    price: 'P250.00',
    description: 'Classic fusion of espresso, milk, banana and langka syrup, garnished with lumpia wrapper.',
    available: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Saba banana nectar, jackfruit essence, caramelized wrapper crisp'
  },
  {
    id: 204,
    category: 'Competition Artisans',
    name: 'Tsamporado',
    price: 'P250.00',
    description: 'The signature taste of comforting food. Now in a cup',
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcnRgPZvSAeWjuil3h6B2n2OeNmjdePD_56mCf8tbN27R8djWpb41wqtMsGBB33MYEq7MYoc_XEHazaMV5djUC4aj1tO7WGri2VDOrQCpwy9kfyTW4pIYbtD8y59TdVLEfgT2Ki2fRvmGUqh5cRCsPjEqBERczKKEpig7TaOjLdLq44MoClCswni8iPvsyuD3vwdh1i2k-mEzX34CSvsakhJcRy4hB49x3HF7RP_GpqHHKZ443mMC5eogBmmiYaFNL2_G9B2LFwlduvQ',
    flavorNotes: 'Pure Davao heirloom cacao, sweet condensed crema, salty danggit flakes'
  },
  {
    id: 205,
    category: 'Competition Artisans',
    name: 'Alon at Apoy',
    price: 'P280.00',
    description: 'Surftown Throwdown Battle of the Barista - Best Signature Beverage 2025',
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCBRgec1yCeRSS6xCbzo2caf8XR1L6oOrZZg2jtHTvHtzjZFaYjiTgDsfnFkHP8jZ_wuoEeZh02N5fnkg9dpDFUj-Y3m5DRTSr1RM2A9774eLsQslUkUjnNuchsbjHhP9OGXOQ_N-i5VsDSX0toS0USU5loPN_NRJteTI7tsHc1uZcqM-wDYd9eJ23p-vrO9BzK5mYT9-LAIXi-U0jgIfLhHFUSICWW87rZ04QQq9gGAnP3rOiRrOt',
    flavorNotes: 'Award-winning smoked chili reduction, dark cacao foam, orange peel zest'
  },
  {
    id: 206,
    category: 'Competition Artisans',
    name: "Campfire S'mores Artisanal",
    price: 'P260.00',
    description: 'Torch-toasted artisanal marshmallow cream, graham crumb rim, and dark espresso reduction.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Torched marshmallow fluff, honey graham, smoked cacao'
  },

  // --- MILK CREATIONS ---
  {
    id: 301,
    category: 'Milk Creations',
    name: 'Spanish Latte',
    price: 'P170.00',
    description: 'Sweetened condensed milk, smooth espresso, and rich fresh milk for a velvety indulgence.',
    available: true,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Caramelized condensed milk swirl, creamy body'
  },
  {
    id: 302,
    category: 'Milk Creations',
    name: 'Salted Caramel Macchiato',
    price: 'P180.00',
    description: 'Rich vanilla syrup, steamed milk, marked with espresso and savory salted caramel drizzle.',
    available: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Sea salt butterscotch, Madagascar vanilla'
  },
  {
    id: 303,
    category: 'Milk Creations',
    name: 'Brown Butter Vanilla Latte',
    price: 'P185.00',
    description: 'House-infused brown butter vanilla syrup paired with silky steamed milk and espresso.',
    available: true,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Nutty brown butter, warm vanilla bean'
  },

  // --- ZERO-PROOF ---
  {
    id: 401,
    category: 'Zero-Proof',
    name: 'Citrus Cascara Fizz',
    price: 'P160.00',
    description: 'Sparkling dried coffee cherry cascara tea, fresh calamansi juice, and aromatic mint.',
    available: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Fizzy cascara tea, tart calamansi, refreshing mint'
  },
  {
    id: 402,
    category: 'Zero-Proof',
    name: 'Berry Hibiscus Refresher',
    price: 'P150.00',
    description: 'Tart brewed hibiscus tea, wild berry puree, and crisp sparkling tonic over crushed ice.',
    available: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Vibrant ruby hibiscus, tart raspberry, sparkling tonic'
  },

  // --- MATCHA ---
  {
    id: 501,
    category: 'Matcha',
    name: 'Ceremonial Uji Matcha Latte',
    price: 'P180.00',
    description: 'Single-estate stone ground Uji matcha whisked with fresh silky milk and light honey.',
    available: true,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Earthy umami, vibrant grassy sweetness, silky finish'
  },
  {
    id: 502,
    category: 'Matcha',
    name: 'Dirty Matcha',
    price: 'P190.00',
    description: 'Layered ceremonial matcha, textured fresh milk, and a bold extracted shot of espresso.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Umami tea meets rich espresso roast'
  },

  // --- FOAM SERIES ---
  {
    id: 601,
    category: 'Foam Series',
    name: 'Sea Salt Cream Cold Brew',
    price: 'P175.00',
    description: '18-hour cold brew topped with thick, velvety salted whipped cream cheese foam.',
    available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Sweet & salty velvet cheese cloud over dark brew'
  },
  {
    id: 602,
    category: 'Foam Series',
    name: 'Tiramisu Cloud Espresso',
    price: 'P185.00',
    description: 'Iced espresso capped with rich mascarpone cheese foam and dusted with pure Dutch cacao.',
    available: true,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Dessert-in-a-cup, mascarpone cream, dark cocoa'
  },

  // --- BESPOKES ---
  {
    id: 701,
    category: 'Bespokes',
    name: "Barista's Choice Bespoke Brew",
    price: 'P220.00',
    description: 'Custom tailored drink crafted on the spot based on your flavor mood and preferences.',
    available: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Crafted live at the bar by our lead barista'
  },
  {
    id: 702,
    category: 'Bespokes',
    name: 'Smoked Cinnamon Affogato',
    price: 'P195.00',
    description: 'Freshly pulled double espresso poured over artisanal vanilla bean gelato with torch-smoked cinnamon.',
    available: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Hot espresso contrast against icy vanilla gelato'
  },

  // --- SAVORY BITES ---
  {
    id: 801,
    category: 'Savory Bites',
    name: 'Crispy Chicken Fingers',
    price: 'P180.00',
    description: 'Flaky, golden, and fried fresh daily. Served with signature garlic herb aioli.',
    available: true,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Double-crunch buttermilk batter, garlic herb aioli'
  },
  {
    id: 802,
    category: 'Savory Bites',
    name: 'Truffle Parmesan Fries',
    price: 'P160.00',
    description: 'Hand-cut golden fries tossed in aromatic white truffle oil, sea salt, and aged parmesan.',
    available: true,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Earthy white truffle oil, savory grated parmesan'
  },

  // --- PASTA ---
  {
    id: 901,
    category: 'Pasta',
    name: 'Carbonara',
    price: 'P190.00',
    description: 'Creamy pasta tossed in a rich carbonara sauce with crispy bacon, finished with parmesan cheese and a hint of garlic.',
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmmCjcofTtYyjGVaDVubhQ7GBDFZZwkzeyJcRtV-N62E2zrHzt0zF9c7uYKmvGfj3WtUbfzZoKSwi1uPCx2aYo2wDro_jWzmXsiEAyRe05x-MWABcOQ-gbOgLAqOjGGFqRV9gH9TvfAmZgYwehz4znin-x2LpXrmn696K2iFgA4zJ8ZOk7fDyUmfGS6xfh468GNqL5AbYMYoALG3krDAweC3BeBSu9r5OfLEv3-EUHjfgH-cMugNAa',
    flavorNotes: 'Rich cream, cured bacon crisps, parmesan cheese'
  },
  {
    id: 902,
    category: 'Pasta',
    name: 'Creamy Pesto',
    price: 'P170.00',
    description: 'Creamy fresh basil pesto pasta with prawns and full of authentic flavor.',
    available: true,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Fresh sweet basil, garlic, toasted pine nuts, prawns'
  },

  // --- RICE ---
  {
    id: 1001,
    category: 'Rice',
    name: 'Beef Tapa Rice Bowl',
    price: 'P220.00',
    description: 'Tender house-cured marinated beef slices served with fragrant garlic fried rice and sunny-side egg.',
    available: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Sweet & savory garlic tapa, golden fried egg'
  },
  {
    id: 1002,
    category: 'Rice',
    name: 'Chicken Karaage Rice',
    price: 'P210.00',
    description: 'Crispy Japanese-style fried chicken thigh cutlets with Kewpie mayo, scallions, and furikake rice.',
    available: true,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=400&q=80',
    flavorNotes: 'Ginger-soy marinated crispy chicken, Kewpie mayo'
  }

  // Note: 'Salad' and 'Extras' are intentionally empty for prototype demonstration as requested.
];

// Helper to format prices cleanly
const formatPrice = (price) => {
  if (typeof price === 'string') {
    return price.startsWith('P') || price.startsWith('₱') ? price : `P${price}`;
  }
  return `P${Number(price).toFixed(2)}`;
};

export const MenuManagement = ({
  // Optional external props for integration with AdminPortal
  items: externalItems,
  categories: externalCategories,
  globalAvailability: externalGlobalAvailability,
  onToggleGlobalAvailability: externalOnToggleGlobalAvailability,
  onOpenAddCategory: externalOnOpenAddCategory,
  onOpenAddItem: externalOnOpenAddItem,
  onEditItem: externalOnEditItem,
  onToggleItemAvailability: externalOnToggleItemAvailability,
  onArchiveItem: externalOnArchiveItem
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [internalItems, setInternalItems] = useState(initialMenuData);
  const [internalCategoriesList, setCategoriesList] = useState(CATEGORY_PILLS);
  // When AdminPortal passes real categories (from the database), the pills use them
  const categoriesList = externalCategories
    ? ['All Items', ...externalCategories.map((c) => c.name).filter((n) => n !== 'All Items')]
    : internalCategoriesList;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [internalGlobalAvailability, setInternalGlobalAvailability] = useState(true);

  // Modal & Drawer States
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isAddCategoryDrawerOpen, setIsAddCategoryDrawerOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null when adding new item

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Resolve whether using internal or external state
  const items = externalItems || internalItems;
  const isGlobalAvailable =
    externalGlobalAvailability !== undefined
      ? externalGlobalAvailability
      : internalGlobalAvailability;

  // ---------------------------------------------------------------------------
  // SEARCH & FILTER LOGIC (CRITICAL: useMemo)
  // (item.category === activeCategory || activeCategory === 'All Items') && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  // ---------------------------------------------------------------------------
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const itemCategory = (item.category || '').trim();
      const matchesCategory =
        activeCategory === 'All Items' ||
        itemCategory.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        itemCategory.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  const handleToggleGlobal = () => {
    if (externalOnToggleGlobalAvailability) {
      externalOnToggleGlobalAvailability();
    } else {
      setInternalGlobalAvailability((prev) => {
        const next = !prev;
        showToast(
          next
            ? 'Global Availability: Store Menu Online & Accepting Orders'
            : 'Global Availability: Store Menu Paused / Offline'
        );
        return next;
      });
    }
  };

  const handleToggleItemAvailability = (itemId) => {
    if (externalOnToggleItemAvailability) {
      externalOnToggleItemAvailability(itemId);
    } else {
      setInternalItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const currentStatus =
              item.available !== undefined ? item.available : item.availability;
            const updated = !currentStatus;
            showToast(`${item.name} is now ${updated ? 'Available (In Stock)' : 'Unavailable (Out of Stock)'}`);
            return {
              ...item,
              available: updated,
              availability: updated
            };
          }
          return item;
        })
      );
    }
  };

  const handleOpenAddCategory = () => {
    if (externalOnOpenAddCategory) {
      externalOnOpenAddCategory();
    } else {
      setIsAddCategoryDrawerOpen(true);
    }
  };

  const handleOpenAddItem = () => {
    if (externalOnOpenAddItem) {
      externalOnOpenAddItem();
    } else {
      setEditingItem(null);
      setIsItemDrawerOpen(true);
    }
  };

  const handleOpenEditItem = (item) => {
    if (externalOnEditItem) {
      externalOnEditItem(item);
    } else {
      setEditingItem(item);
      setIsItemDrawerOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (externalOnArchiveItem) {
      externalOnArchiveItem(itemToDelete);
    } else {
      setInternalItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      showToast(`"${itemToDelete.name}" removed / archived from active catalog.`);
    }
    setItemToDelete(null);
  };

  const handleSaveItemFromDrawer = (savedItem) => {
    setInternalItems((prev) => {
      const idx = prev.findIndex((i) => i.id === savedItem.id);
      if (idx >= 0) {
        showToast(`Updated "${savedItem.name}" successfully.`);
        return prev.map((it) => (it.id === savedItem.id ? savedItem : it));
      } else {
        showToast(`Added "${savedItem.name}" to menu inventory.`);
        return [savedItem, ...prev];
      }
    });
    setIsItemDrawerOpen(false);
  };

  const handleSaveCategoryFromDrawer = (newCategoryName) => {
    if (newCategoryName && !categoriesList.includes(newCategoryName)) {
      setCategoriesList((prev) => [...prev, newCategoryName]);
    }
    showToast(`Category "${newCategoryName}" created successfully!`);
    setIsAddCategoryDrawerOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif] text-gray-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#19244E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slideUp">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E58422] animate-ping" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TOP HEADER & ACTION CONTROLS                                         */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
              Menu Management
            </h1>
            <span className="bg-amber-100 text-[#E58422] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {items.length} Total Items
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure live items, per-item availability, and catalog categories for Beardista Brew.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Master Global Availability Toggle (Top-right of actions area) */}
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-xs flex items-center gap-3 hover:border-gray-300 transition-all">
            <div className="text-left">
              <div className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                Global Availability
              </div>
              <div
                className={`text-xs font-extrabold flex items-center gap-1.5 ${
                  isGlobalAvailable ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isGlobalAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {isGlobalAvailable ? 'Store Accepting' : 'Store Offline'}
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleGlobal}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer active:scale-95 ${
                isGlobalAvailable ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
              title="Toggle Global Store Menu Live Availability"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  isGlobalAvailable ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* + Add Category Button (Slide-over drawer trigger) */}
          <button
            onClick={handleOpenAddCategory}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-[#19244E] hover:bg-gray-50 text-[#19244E] text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span className="text-base leading-none text-[#E58422] font-black">+</span>
            <span>Add Category</span>
          </button>

          {/* + Add New Item Button (Slide-over drawer trigger) */}
          <button
            onClick={handleOpenAddItem}
            className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Global Availability Offline Notice */}
      {!isGlobalAvailable && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-950">
                Global Store Availability is Paused.
              </span>{' '}
              <span className="text-xs text-amber-800">
                All individual drink & food items are temporarily offline. Individual toggles are locked off and will automatically restore their previous active states once Global Store Availability is turned back on.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleGlobal}
            className="px-3.5 py-1.5 bg-[#19244E] hover:bg-[#253570] text-white text-[11px] font-extrabold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            Turn Store Online
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SEARCH BAR & CATEGORY FILTER PILLS                                   */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200 space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by drink title, recipe, ingredients..."
            className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer p-1"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills (Exact required pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {categoriesList.map((catName) => {
            const isActive = activeCategory === catName;
            // Compute dynamic item count for the pill badge
            const count =
              catName === 'All Items'
                ? items.length
                : items.filter((it) => (it.category || '').toLowerCase() === catName.toLowerCase())
                    .length;

            return (
              <button
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#19244E] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                }`}
              >
                <span>{catName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MAIN CATALOG ITEM TABLE                                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Image & Item Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6 text-center">Availability Toggle</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                      ☕
                    </div>
                    <p className="font-bold text-gray-600">No items found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery
                        ? `No products match your search query "${searchQuery}".`
                        : `The "${activeCategory}" category currently has no items.`}
                    </p>
                    {activeCategory !== 'All Items' && (
                      <button
                        onClick={() => setActiveCategory('All Items')}
                        className="mt-3 text-[#E58422] hover:underline font-bold text-xs"
                      >
                        Reset to All Items
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isAvailable =
                    item.available !== undefined ? item.available : item.availability;
                  const isSig = item.category === 'Signatures';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Image (placeholder fallback) & Item Name & Description */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-start gap-4">
                          <div className="relative group/thumb flex-shrink-0">
                            <img
                              src={
                                item.image ||
                                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={item.name}
                              className="w-13 h-13 rounded-2xl object-cover bg-amber-50/50 border border-gray-200/90 shadow-xs"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            {isSig && (
                              <span className="absolute -top-1.5 -left-1.5 bg-[#E58422] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                                Sig
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#19244E] text-sm group-hover:text-[#E58422] transition-colors">
                                {item.name}
                              </span>
                              {isSig && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                  Signature Drink
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2 max-w-md">
                              {item.description}
                            </p>
                            {item.flavorNotes && (
                              <div className="text-[11px] font-medium text-gray-400 mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                <span>{item.flavorNotes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200/60">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-black text-[#19244E] text-sm">
                          {formatPrice(item.price)}
                        </span>
                      </td>

                      {/* Availability Toggle (Per Item) - SYNCED TO GLOBAL AVAILABILITY */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isGlobalAvailable) {
                                showToast('Global Store is offline. Switch ON Global Availability above to modify item status.');
                                return;
                              }
                              handleToggleItemAvailability(item.id);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                              !isGlobalAvailable
                                ? 'bg-gray-200 cursor-not-allowed opacity-60'
                                : isAvailable
                                ? 'bg-emerald-500 cursor-pointer active:scale-95 shadow-xs'
                                : 'bg-gray-300 cursor-pointer active:scale-95'
                            }`}
                            title={
                              !isGlobalAvailable
                                ? 'Store is globally offline. Switch ON Global Availability to modify item states.'
                                : `Toggle availability for ${item.name}`
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                                !isGlobalAvailable
                                  ? 'translate-x-1'
                                  : isAvailable
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[10px] font-extrabold w-24 text-left ${
                              !isGlobalAvailable
                                ? 'text-gray-400 italic'
                                : isAvailable
                                ? 'text-emerald-700'
                                : 'text-gray-400'
                            }`}
                          >
                            {!isGlobalAvailable
                              ? 'Offline (Global)'
                              : isAvailable
                              ? 'In Stock'
                              : 'Out of Stock'}
                          </span>
                        </div>
                      </td>

                      {/* Actions: Edit & Centered Delete Modal Trigger */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-[#19244E] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                            title="Edit menu item details"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer active:scale-95"
                            title="Delete or archive item"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CENTERED "ARE YOU SURE?" CONFIRMATION MODAL                          */}
      {/* ==================================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Dim Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setItemToDelete(null)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-center transform transition-all z-10 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="text-lg font-black text-[#19244E]">
              Are you sure?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              You are about to delete{' '}
              <span className="font-bold text-[#19244E]">"{itemToDelete.name}"</span>{' '}
              ({itemToDelete.category}). This item will be archived and will no longer be visible on the customer digital menu.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Yes, Delete / Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SLIDE-OVER DRAWER 1: ADD CATEGORY                                    */}
      {/* (CRITICAL: Right-aligned sliding drawer, NOT centered modal)         */}
      {/* ==================================================================== */}
      {isAddCategoryDrawerOpen && (
        <AddCategoryDrawerSlideOver
          isOpen={isAddCategoryDrawerOpen}
          existingCategories={categoriesList}
          onClose={() => setIsAddCategoryDrawerOpen(false)}
          onSave={handleSaveCategoryFromDrawer}
        />
      )}

      {/* ==================================================================== */}
      {/* SLIDE-OVER DRAWER 2: ADD OR EDIT MENU ITEM                           */}
      {/* (CRITICAL: Right-aligned sliding drawer, NOT centered modal)         */}
      {/* ==================================================================== */}
      {isItemDrawerOpen && (
        <EditItemDrawerSlideOver
          isOpen={isItemDrawerOpen}
          item={editingItem}
          categories={categoriesList.filter((c) => c !== 'All Items')}
          onClose={() => setIsItemDrawerOpen(false)}
          onSave={handleSaveItemFromDrawer}
        />
      )}
    </div>
  );
};

// ==============================================================================
// 3. SLIDE-OVER DRAWER: ADD CATEGORY (RIGHT-ALIGNED)
// ==============================================================================
const AddCategoryDrawerSlideOver = ({ isOpen, existingCategories, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [department, setDepartment] = useState('Beverages & Espresso');
  const [sortPriority, setSortPriority] = useState('1');
  const [description, setDescription] = useState('');
  const [tagColor, setTagColor] = useState('#E58422');
  const [publishOnline, setPublishOnline] = useState(true);
  const [availableIcons, setAvailableIcons] = useState(['☕', '🥤', '🥐', '✨', '🔥', '🍜', '🍃', '🍰']);
  const [selectedIcon, setSelectedIcon] = useState('☕');
  const [isAddingCustomIcon, setIsAddingCustomIcon] = useState(false);
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [error, setError] = useState('');

  const handleNameChange = (val) => {
    setCategoryName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    if (error) setError('');
  };

  const handleAddCustomIcon = () => {
    if (!customEmojiInput.trim()) return;
    const newIco = customEmojiInput.trim();
    if (!availableIcons.includes(newIco)) {
      setAvailableIcons((prev) => [...prev, newIco]);
    }
    setSelectedIcon(newIco);
    setCustomEmojiInput('');
    setIsAddingCustomIcon(false);
  };

  const handleCreate = (isDraft = false) => {
    if (!categoryName.trim()) {
      setError('Please provide a valid category name.');
      return;
    }
    onSave(categoryName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dim backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="px-6 py-5 bg-[#19244E] text-white flex items-center justify-between border-b border-[#24336c]">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base shadow-sm font-bold overflow-hidden"
                style={{ backgroundColor: tagColor }}
              >
                {selectedIcon}
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-[#E58422] uppercase tracking-wider">
                  Category Taxonomy
                </div>
                <h2 className="text-lg font-black tracking-tight">Add Category</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5 flex-1 overflow-y-auto text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Category Icon & Badge
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomIcon((prev) => !prev)}
                  className="text-[11px] font-bold text-[#E58422] hover:text-[#c46d17] inline-flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{isAddingCustomIcon ? 'Cancel' : 'Add Icon'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {availableIcons.map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setSelectedIcon(ico)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all cursor-pointer ${
                      selectedIcon === ico
                        ? 'border-[#E58422] bg-orange-50 scale-105 shadow-xs font-bold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {ico}
                  </button>
                ))}

                {/* + Add Icon Action Button */}
                <button
                  type="button"
                  onClick={() => setIsAddingCustomIcon(true)}
                  className="w-9 h-9 rounded-xl border-2 border-dashed border-[#E58422]/50 hover:border-[#E58422] bg-orange-50/50 hover:bg-orange-100 flex items-center justify-center text-[#E58422] transition-colors cursor-pointer"
                  title="Add custom icon / emoji"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Inline Custom Icon Adder */}
              {isAddingCustomIcon && (
                <div className="mt-2.5 p-3 bg-orange-50/80 border border-[#E58422]/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#19244E]">Pick or Type Any Emoji</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomIcon(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['🧋', '🥪', '🥗', '🥑', '🧇', '🍩', '🍕', '🍷', '🍺', '🫖', '🧊', '🍫', '🥯', '🥞', '🌮'].map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => {
                          if (!availableIcons.includes(emo)) {
                            setAvailableIcons((prev) => [...prev, emo]);
                          }
                          setSelectedIcon(emo);
                          setIsAddingCustomIcon(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#E58422] text-sm flex items-center justify-center cursor-pointer"
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customEmojiInput}
                      onChange={(e) => setCustomEmojiInput(e.target.value)}
                      placeholder="Or enter symbol (e.g. 🥨)"
                      maxLength={4}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#E58422]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomIcon}
                      disabled={!customEmojiInput.trim()}
                      className="px-3 py-1.5 bg-[#E58422] hover:bg-[#d07317] disabled:opacity-40 text-white font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Add & Select
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Cold Brew Innovations"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cold-brew-innovations"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Department / Group
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
                >
                  <option>Beverages & Espresso</option>
                  <option>Signature Creations</option>
                  <option>Savory Kitchen & Pasta</option>
                  <option>Bakery & Bar Bites</option>
                  <option>Matcha & Tea Bar</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sort Priority
                </label>
                <input
                  type="number"
                  min="1"
                  value={sortPriority}
                  onChange={(e) => setSortPriority(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tag Highlight Color
              </label>
              <div className="flex items-center gap-3">
                {['#E58422', '#19244E', '#10B981', '#F43F5E', '#8B5CF6', '#F59E0B'].map(
                  (hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setTagColor(hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        tagColor === hex ? 'scale-110 border-gray-800' : 'border-white'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description / Menu Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional customer-facing description..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <div className="font-bold text-gray-800">Publish to Online Menu</div>
                <div className="text-[10px] text-gray-500">
                  Visible to patrons on digital menu immediately
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishOnline(!publishOnline)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  publishOnline ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    publishOnline ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCreate(true)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleCreate(false)}
                className="px-5 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 4. SLIDE-OVER DRAWER: ADD / EDIT MENU ITEM (RIGHT-ALIGNED)
// ==============================================================================
const EditItemDrawerSlideOver = ({ isOpen, item, categories, onClose, onSave }) => {
  const isEditing = Boolean(item && item.id);

  const [name, setName] = useState(item ? item.name : '');
  const [category, setCategory] = useState(item ? item.category : categories[0] || 'Signatures');
  const [price, setPrice] = useState(
    item ? String(item.price).replace(/[^0-9.]/g, '') : '150.00'
  );
  const [available, setAvailable] = useState(
    item ? (item.available !== undefined ? item.available : item.availability) : true
  );
  const [description, setDescription] = useState(item ? item.description : '');
  const [flavorNotes, setFlavorNotes] = useState(item ? item.flavorNotes || '' : '');
  const [image, setImage] = useState(
    item
      ? item.image
      : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an item name.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please provide a valid price.');
      return;
    }

    const payload = {
      ...(item || {}),
      id: item ? item.id : Date.now(),
      name: name.trim(),
      category,
      price: `P${Number(price).toFixed(2)}`,
      available,
      availability: available,
      image,
      description: description.trim(),
      flavorNotes: flavorNotes.trim()
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dim backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="px-6 py-5 bg-[#19244E] text-white flex items-center justify-between border-b border-[#24336c]">
            <div>
              <div className="text-[10px] font-extrabold text-[#E58422] uppercase tracking-wider">
                {isEditing ? 'Modify Item' : 'Create New Item'}
              </div>
              <h2 className="text-lg font-black tracking-tight">
                {isEditing ? `Edit "${item.name}"` : 'Add New Menu Item'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Mutton Chops"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Price (PHP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="150.00"
                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description / Recipe Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flavor notes, roast profile, and brew style..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Flavor Notes / Tag Highlights
              </label>
              <input
                type="text"
                value={flavorNotes}
                onChange={(e) => setFlavorNotes(e.target.value)}
                placeholder="e.g. Rich espresso, velvety fresh milk"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Image Asset URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <div className="font-bold text-gray-800">Live Item Availability</div>
                <div className="text-[10px] text-gray-500">
                  {available ? 'Currently available to customers' : 'Marked as out of stock'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAvailable(!available)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  available ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    available ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E58422] hover:bg-[#d47414] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                {isEditing ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;