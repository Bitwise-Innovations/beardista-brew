export const initialAdminStats = [
  {
    id: 'stat-visits',
    label: 'Daily Visits',
    value: '1,428',
    change: '+12.4%',
    isPositive: true,
    subtext: 'vs. yesterday (1,270)',
    icon: 'visit'
  },
  {
    id: 'stat-surveys',
    label: 'Survey Responses',
    value: '384',
    change: '+8.1%',
    isPositive: true,
    subtext: '88% positive satisfaction',
    icon: 'survey'
  },
  {
    id: 'stat-most-requested',
    label: 'Most Requested',
    value: 'Alon at Apoy',
    change: '412 orders',
    isPositive: true,
    subtext: 'Leading specialty cold brew',
    icon: 'star'
  },
  {
    id: 'stat-revenue-pace',
    label: 'Active Catalog',
    value: '52 Items',
    change: '100% In Stock',
    isPositive: true,
    subtext: 'Across 12 live categories',
    icon: 'catalog'
  }
];

export const customerFavoritesThisMonth = [
  {
    id: 'fav-1',
    name: 'Alon at Apoy',
    category: 'Signature Cold Brew',
    orders: 412,
    rating: 4.9,
    price: 180,
    image: '/src/assets/alon at apoy.png',
    trend: '+18%'
  },
  {
    id: 'fav-2',
    name: 'Goatee',
    category: 'Espresso & Milk',
    orders: 348,
    rating: 4.8,
    price: 165,
    image: '/src/assets/goatee.png',
    trend: '+11%'
  },
  {
    id: 'fav-3',
    name: 'Crispy Chicken Fingers',
    category: 'Savory Bar Bites',
    orders: 295,
    rating: 4.7,
    price: 220,
    image: '/src/assets/chicken fingers.jpg',
    trend: '+15%'
  },
  {
    id: 'fav-4',
    name: 'Beardista Blanc',
    category: 'Specialty Lattes',
    orders: 240,
    rating: 4.9,
    price: 175,
    image: '/src/assets/beardista blanc.jpg',
    trend: '+6%'
  }
];

export const initialCategories = [
  { id: 'cat-all', name: 'All Items', count: 52, slug: 'all' },
  { id: 'cat-signatures', name: 'Signatures', count: 3, slug: 'signatures' },
  { id: 'cat-specialty', name: 'Specialty Coffee', count: 4, slug: 'specialty coffee' },
  { id: 'cat-competition', name: 'Competition Artisans', count: 6, slug: 'competition artisans' },
  { id: 'cat-milk', name: 'Milk Creations', count: 5, slug: 'milk creations' },
  { id: 'cat-zeroproof', name: 'Zero-Proof', count: 6, slug: 'zero-proof' },
  { id: 'cat-matcha', name: 'Matcha', count: 5, slug: 'matcha' },
  { id: 'cat-foam', name: 'Foam Series', count: 4, slug: 'foam series' },
  { id: 'cat-bespokes', name: 'Bespokes', count: 10, slug: 'bespokes' },
  { id: 'cat-bites', name: 'Savory Bites', count: 6, slug: 'savory bites' },
  { id: 'cat-pasta', name: 'Pasta', count: 6, slug: 'pasta' },
  { id: 'cat-rice', name: 'Rice', count: 4, slug: 'rice' },
  { id: 'cat-salad', name: 'Salad', count: 1, slug: 'salad' },
  { id: 'cat-extras', name: 'Extras', count: 9, slug: 'extras' }
];

export const initialMenuItems = [
  // SIGNATURES
  { id: 1, category: 'Signatures', name: 'Stubble', price: 'P140.00', description: 'A bold and classic Americano, featuring rich espresso poured perfectly over water.', available: true, image: '/src/assets/hiromi.png' },
  { id: 2, category: 'Signatures', name: 'Mutton Chops', price: 'P150.00', description: 'Rich double espresso gently layered over velvety fresh milk for a creamy, well-rounded finish.', available: true, image: '/src/assets/hiromi.png' },
  { id: 3, category: 'Signatures', name: 'Van Dyke', price: 'P165.00', description: 'Espresso with textured milk, delicately sweetened with aromatic cardamom pods.', available: true, image: '/src/assets/hiromi.png' },

  // SPECIALTY COFFEE
  { id: 101, category: 'Specialty Coffee', name: 'Flat White', price: 'P150.00', description: 'Strong espresso, silky milk, smooth finish. Crafted for true coffee lover.', available: true, image: '/src/assets/beardista blanc.jpg' },
  { id: 102, category: 'Specialty Coffee', name: 'Cappuccino', price: 'P170.00', description: 'Rich espresso topped with steamed milk and fluffy foam.', available: true, image: '/src/assets/beardista blanc.jpg' },
  { id: 103, category: 'Specialty Coffee', name: 'Single Origin', price: 'P170.00', description: 'Cortado of your beans choice from our guest beans.', available: true, image: '/src/assets/beardista blanc.jpg' },
  { id: 104, category: 'Specialty Coffee', name: 'Filter / Pour-Over', price: 'P180.00', description: 'Ask the barista for the guest beans.', available: true, image: '/src/assets/beardista blanc.jpg' },

  // COMPETITION ARTISANS
  { id: 201, category: 'Competition Artisans', name: 'M3 (Bicol Express)', price: 'P200.00', description: 'Espresso with creamy coconut notes, subtle spicy finish, topped with bacon.', available: true, image: '/src/assets/alon at apoy.png' },
  { id: 202, category: 'Competition Artisans', name: 'Palitaw', price: 'P250.00', description: 'Nostalgic Filipino Meryenda turned into a modern comforting beverage.', available: true, image: '/src/assets/alon at apoy.png' },
  { id: 203, category: 'Competition Artisans', name: 'Turon', price: 'P250.00', description: 'Classic fusion of espresso, milk, banana and langka syrup, garnished with lumpia wrapper.', available: true, image: '/src/assets/alon at apoy.png' },
  { id: 204, category: 'Competition Artisans', name: 'Tsamporado', price: 'P250.00', description: 'The signature taste of comforting food. Now in a cup', available: true, image: '/src/assets/alon at apoy.png' },
  { id: 205, category: 'Competition Artisans', name: 'Alon at Apoy', price: 'P280.00', description: 'Surftown Throwdown Battle of the Barista - Best Signature Beverage 2025', available: true, image: '/src/assets/alon at apoy.png' },
  { id: 206, category: 'Competition Artisans', name: 'Beardista Blanc', price: 'P250.00', description: 'Aerated espresso with rich cold cream. Inspired by the elegance of the classic Mont Blanc dessert.', available: true, image: '/src/assets/alon at apoy.png' },

  // MILK CREATIONS
  { id: 301, category: 'Milk Creations', name: 'Vanya', price: 'P170.00', description: 'A taste of the Philippines in every sip. This ube latte is a must try!', available: true, image: '/src/assets/goatee.png' },
  { id: 302, category: 'Milk Creations', name: 'Old Dutch', price: 'P170.00', description: 'Delicious and cozy dark chocolate latte', available: true, image: '/src/assets/goatee.png' },
  { id: 303, category: 'Milk Creations', name: 'Anchor', price: 'P170.00', description: 'Strawberries meets creamy milk in one drink!', available: true, image: '/src/assets/goatee.png' },
  { id: 304, category: 'Milk Creations', name: 'Full Beard', price: 'P180.00', description: 'Strawberry and chocolate combo.', available: true, image: '/src/assets/goatee.png' },
  { id: 305, category: 'Milk Creations', name: 'Yoda', price: 'P180.00', description: 'Enjoy the unique blend of dark chocolate and a touch of mint.', available: true, image: '/src/assets/goatee.png' },

  // ZERO-PROOF
  { id: 401, category: 'Zero-Proof', name: 'Gomu Gomu No Berry', price: 'P150.00', description: 'Tropical spark meets a berry blast', available: true, image: '/src/assets/juices.png' },
  { id: 402, category: 'Zero-Proof', name: 'Tori Tori Bloom', price: 'P160.00', description: 'sweet pineapple upfront balance by blueberry.', available: true, image: '/src/assets/juices.png' },
  { id: 403, category: 'Zero-Proof', name: 'Sunset Berry', price: 'P150.00', description: 'Lively mix of orange brightness and strawberry sweetness in a clean finish.', available: true, image: '/src/assets/juices.png' },
  { id: 404, category: 'Zero-Proof', name: 'Senbon Sakura', price: 'P160.00', description: 'Floral lychee layered with strawberry sweetness for an aromatic and balance finish.', available: true, image: '/src/assets/juices.png' },
  { id: 405, category: 'Zero-Proof', name: 'Mera Mera No Mi', price: 'P180.00', description: 'tropical,bold,sweet and fiery finish', available: true, image: '/src/assets/juices.png' },
  { id: 406, category: 'Zero-Proof', name: "Nami's Chai Tea", price: 'P190.00', description: 'Aromatic black tea blended with sweetened condensed milk and Fullcream milk', available: true, image: '/src/assets/juices.png' },

  // MATCHA
  { id: 501, category: 'Matcha', name: 'Goatee', price: 'P190.00', description: 'Hand-whisked matcha with lush umami and a smooth finish with oat-milk.', available: true, image: '/src/assets/goatee.png' },
  { id: 502, category: 'Matcha', name: 'Petite Goatee', price: 'P200.00', description: 'Strawberry and matcha meet in a creamy fusion.', available: true, image: '/src/assets/goatee.png' },
  { id: 503, category: 'Matcha', name: 'Uzuki', price: 'P200.00', description: 'Hand-whisked matcha fusion with sweet mango glow.', available: true, image: '/src/assets/goatee.png' },
  { id: 504, category: 'Matcha', name: 'Why So Serious?', price: 'P200.00', description: 'Bright blueberry notes with creamy oat-milk and hand-whisked matcha.', available: true, image: '/src/assets/goatee.png' },
  { id: 505, category: 'Matcha', name: 'Hoya', price: 'P210.00', description: 'Hand-whisked matcha with lush umami and oat-milk topped with delicate cold foam.', available: true, image: '/src/assets/goatee.png' },

  // FOAM SERIES
  { id: 601, category: 'Foam Series', name: 'Polaris', price: 'P190.00', description: 'Purple yam milk beverage topped with layer of cold foamed milk on top.', available: true, image: '/src/assets/goatee.png' },
  { id: 602, category: 'Foam Series', name: 'Aurora', price: 'P190.00', description: 'Dark Chocolate Drink with layer of foamed milk on top.', available: true, image: '/src/assets/goatee.png' },
  { id: 603, category: 'Foam Series', name: 'Oyayi', price: 'P190.00', description: 'Strawberry milk beverage topped with layer of cold foamed on top.', available: true, image: '/src/assets/goatee.png' },
  { id: 604, category: 'Foam Series', name: 'Vertigo', price: 'P190.00', description: 'Red Velvet Chocolate milk beverage topped with layer of cold foamed on top.', available: true, image: '/src/assets/goatee.png' },
  
  // BESPOKES
  { id: 701, category: 'Bespokes', name: 'Bahay Buko', price: 'P200.00', description: 'A unique ube cocktail featuring the richness of vodka and a tangy citrus finish.', available: true, image: '/src/assets/bespokes.png' },
  { id: 702, category: 'Bespokes', name: 'Berry Basil Smash', price: 'P250.00', description: 'A vibrant twist on the classic mojito, muddled with fresh berries and aromatic basil.', available: true, image: '/src/assets/bespokes.png' },
  { id: 703, category: 'Bespokes', name: 'Dark Side of the Moon', price: 'P200.00', description: 'New way of enjoying espresso, dark chocolate, and dark rhum.', available: true, image: '/src/assets/bespokes.png' },
  { id: 704, category: 'Bespokes', name: 'Purple Daze', price: 'P260.00', description: 'Fresh blueberries and herbs expertly shaken with premium white rum for a refreshing finish.', available: true, image: '/src/assets/bespokes.png' },
  { id: 705, category: 'Bespokes', name: "The Gentleman's Sour", price: 'P260.00', description: 'Oak-aged whiskey meets fresh lemon for a bold, perfectly balanced refreshment.', available: true, image: '/src/assets/bespokes.png' },
  { id: 706, category: 'Bespokes', name: 'Mama mo Blue', price: 'P190.00', description: 'A stunning blue cocktail delivering crisp citrus notes and a smooth vodka kick.', available: true, image: '/src/assets/bespokes.png' },
  { id: 707, category: 'Bespokes', name: 'The Fifth Strip', price: 'P350.00', description: 'Bold oak-aged whiskey perfectly paired with savory bacon notes for an unforgettable sip.', available: true, image: '/src/assets/bespokes.png' },
  { id: 708, category: 'Bespokes', name: 'Shroom Bloom', price: 'P200.00', description: 'An inventive and refreshing fusion of earthy shiitake vodka, sweet lychee, and ripe strawberry.', available: true, image: '/src/assets/bespokes.png' },
  { id: 709, category: 'Bespokes', name: 'Sawadee Sip', price: 'P260.00', description: 'Aromatic Thai tea infused with gin, perfectly balanced by fresh citrus and subtle sweetness.', available: true, image: '/src/assets/bespokes.png' },
  { id: 710, category: 'Bespokes', name: 'Kratos Wrath', price: 'P250.00', description: 'A formidable blend of ancient honey mead with deep flavors and a thunderous finish.', available: true, image: '/src/assets/bespokes.png' },
  
  // SAVORY BITES
  { id: 801, category: 'Savory Bites', name: 'French Fries', price: 'P140.00', description: 'Flavors: Plain, Sourcream, BBQ, Cheese', available: true, image: '/src/assets/chicken fingers.jpg' },
  { id: 802, category: 'Savory Bites', name: 'Nachos Supreme', price: 'P150.00', description: 'Crispy nachos loaded with rich savory toppings.', available: true, image: '/src/assets/chicken fingers.jpg' },
  { id: 803, category: 'Savory Bites', name: 'Chicken & Egg Sandwich', price: 'P160.00', description: 'Classic savory chicken and egg sandwich.', available: true, image: '/src/assets/chicken fingers.jpg' },
  { id: 804, category: 'Savory Bites', name: 'Crab & Egg Sandwich', price: 'P160.00', description: 'Delicious crab and egg mix filling.', available: true, image: '/src/assets/chicken fingers.jpg' },
  { id: 805, category: 'Savory Bites', name: 'Chick and Fries', price: 'P280.00', description: 'Crispy chicken paired with golden fries.', available: true, image: '/src/assets/chicken fingers.jpg' },
  { id: 806, category: 'Savory Bites', name: 'Chicken Fingers', price: 'P210.00', description: 'Flavors: Buffalo, Hickory BBQ, Mango Habanero, Salted Egg, Plain with Garlic Mayo Dip', available: true, image: '/src/assets/chicken fingers.jpg' },
  
  // PASTA
  { id: 901, category: 'Pasta', name: 'Carbonara', price: 'P190.00', description: 'Creamy pasta tossed in a rich carbonara sauce with crispy bacon, finished with parmesan cheese and a hint of garlic.', available: true, image: '/src/assets/pasta.jpg' },
  { id: 902, category: 'Pasta', name: 'Creamy Pesto', price: 'P190.00', description: 'Creamy fresh basil pesto pasta with peanut and full of flavor.', available: true, image: '/src/assets/pasta.jpg' },
  { id: 903, category: 'Pasta', name: 'Charlie Chan', price: 'P200.00', description: 'Savory-sweet dish tossed with mushroom, crunchy peanuts, finished with a bold soy-garlic sauce.', available: true, image: '/src/assets/pasta.jpg' },
  { id: 904, category: 'Pasta', name: 'Garlic Butter', price: 'P180.00', description: 'Butter, garlic, and a touch of chili flakes for a light yet flavorful dish.', available: true, image: '/src/assets/pasta.jpg' },
  { id: 905, category: 'Pasta', name: 'Black Truffle', price: 'P220.00', description: 'A luxurious blend of cream, cheese, and aromatic black truffle tossed with perfectly cooked pasta.', available: true, image: '/src/assets/pasta.jpg' },
  { id: 906, category: 'Pasta', name: 'Squid Ink Seafood Arrabiata', price: 'P260.00', description: 'Squid ink pasta tossed in a spicy arrabiata sauce with fresh seafood for a bold, savory flavor.', available: true, image: '/src/assets/pasta.jpg' },
  
  // RICE
  { id: 1001, category: 'Rice', name: 'Chicken Poppers', price: 'P150.00', description: 'Poppers with rice and egg in a bowl.', available: true, image: '/src/assets/ricemeal.jpg' },
  { id: 1002, category: 'Rice', name: 'Pad Kra Pao (Pork)', price: 'P190.00', description: 'Stir-fried pork with garlic, chili, and Thai basil in a savory sauce with egg on the side', available: true, image: '/src/assets/ricemeal.jpg' },
  { id: 1003, category: 'Rice', name: 'Pad Kra Pao (Beef)', price: 'P200.00', description: 'Stir-fried beef with garlic, chili, and Thai basil in a savory sauce, with egg on the side', available: true, image: '/src/assets/ricemeal.jpg' },
  { id: 1004, category: 'Rice', name: 'Bacon & Egg', price: 'P180.00', description: 'Crispy bacon and a fried egg served over rice.', available: true, image: '/src/assets/ricemeal.jpg' },

  // SALAD
  { id: 1101, category: 'Salad', name: 'Garden Salad', price: 'P150.00', description: 'A fresh mix of crisp lettuce, tomatoes, cucumbers, and seasonal vegetables, served with dressing.', available: true, image: '/src/assets/salad.jpg' },

  // EXTRAS
  { id: 1201, category: 'Extras', name: 'Espresso', price: 'P80.00', description: 'Extra shot of espresso.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1202, category: 'Extras', name: 'Syrup', price: 'P15.00', description: 'Additional flavor syrup.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1203, category: 'Extras', name: 'Sub Milk', price: 'P50.00', description: 'Alternative milk substitution.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1204, category: 'Extras', name: 'Artisan Salts', price: 'P15.00', description: 'Options: Asin Tibuok, Asin Tultul, Pink Himalayan', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1205, category: 'Extras', name: 'Rice', price: 'P25.00', description: 'Extra serving of rice.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1206, category: 'Extras', name: 'Egg', price: 'P25.00', description: 'Extra egg.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1207, category: 'Extras', name: 'Bacon', price: 'P25.00', description: 'Extra crispy bacon.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1208, category: 'Extras', name: 'Dip', price: 'P25.00', description: 'Extra dipping sauce.', available: true, image: '/src/assets/beardista sign.jpg' },
  { id: 1209, category: 'Extras', name: 'Parmesan', price: 'P20.00', description: 'Extra parmesan cheese.', available: true, image: '/src/assets/beardista sign.jpg' }
];

export const initialAuditLogs = [
  {
    id: 'log-101',
    date: 'Oct 16, 2026',
    time: '11:42 UTC',
    action: 'Availability Toggle',
    actionType: 'update',
    itemAffected: 'Beardista Signature Flat White',
    itemId: 'menu-7',
    previousValue: 'Available',
    newValue: 'Unavailable (Out of stock)',
    user: 'admin@beardistabrew.com'
  },
  {
    id: 'log-102',
    date: 'Oct 16, 2026',
    time: '09:15 UTC',
    action: 'Price Update',
    actionType: 'update',
    itemAffected: 'Alon at Apoy',
    itemId: 'menu-1',
    previousValue: '₱175.00',
    newValue: '₱180.00',
    user: 'admin@beardistabrew.com'
  },
  {
    id: 'log-103',
    date: 'Oct 15, 2026',
    time: '16:30 UTC',
    action: 'Update Event Banner',
    actionType: 'update',
    itemAffected: 'Latte Art Throwdown',
    itemId: 'EV-2026',
    previousValue: 'Slots Remaining: 6',
    newValue: 'Registration Open (32 Slots)',
    user: 'admin@beardistabrew.com'
  },
  {
    id: 'log-104',
    date: 'Oct 15, 2026',
    time: '14:20 UTC',
    action: 'New Category Added',
    actionType: 'create',
    itemAffected: 'Seasonal & Special',
    itemId: 'cat-seasonal',
    previousValue: 'None',
    newValue: 'Category created with 2 items',
    user: 'admin@beardistabrew.com'
  },
  {
    id: 'log-105',
    date: 'Oct 14, 2026',
    time: '11:05 UTC',
    action: 'Security Password Changed',
    actionType: 'security',
    itemAffected: 'Admin Credentials',
    itemId: 'AUTH-PASS',
    previousValue: 'Hash **********',
    newValue: 'Updated via Security Settings',
    user: 'admin@beardistabrew.com'
  },
  {
    id: 'log-106',
    date: 'Oct 14, 2026',
    time: '08:45 UTC',
    action: 'Wi-Fi Configuration',
    actionType: 'update',
    itemAffected: 'Store Wi-Fi SSID',
    itemId: 'CONF-WIFI',
    previousValue: 'Beardista_Guest_Old',
    newValue: 'BeardistaBrew_Guest',
    user: 'admin@beardistabrew.com'
  }
];

export const individualFeedbackList = [
  {
    id: 'fb-1',
    name: 'Samantha Reyes',
    date: 'Oct 16, 2026',
    rating: 5,
    visitFrequency: 'Weekly Regular',
    preference: 'Cold Brews & Bar Bites',
    comment: 'Alon at Apoy is hands down the most innovative coffee drink in North Caloocan! The chill vibes and music make working here so conducive.',
    syncToVoice: true
  },
  {
    id: 'fb-2',
    name: 'Mark Lester Cruz',
    date: 'Oct 15, 2026',
    rating: 5,
    visitFrequency: 'First-time Visitor',
    preference: 'Espresso',
    comment: 'The baristas are super knowledgeable and friendly. The Goatee latte has such a distinct creamy finish without being overly sweet.',
    syncToVoice: true
  },
  {
    id: 'fb-3',
    name: 'Patricia Gomez',
    date: 'Oct 14, 2026',
    rating: 4,
    visitFrequency: '2-3 Times a Month',
    preference: 'Afternoon Desserts',
    comment: 'Loving the Tsamporado special! Would love to see more vegan milk alternatives like oat milk or soy milk on the daily menu.',
    syncToVoice: false
  },
  {
    id: 'fb-4',
    name: 'Dave Kevin Tan',
    date: 'Oct 13, 2026',
    rating: 5,
    visitFrequency: 'Daily Regular',
    preference: 'Late Night Coffee',
    comment: 'Best late night coffee shop in Camarin. Staying open until midnight is a lifesaver for night shift creatives and freelancers.',
    syncToVoice: true
  }
];

export const initialContentData = {
  motto: 'To serve quality drinks and to serve the community.',
  founderName: 'Mr. Jim Carlo Gorospe',
  founderTitle: 'Visionary & Founder',
  founderBio: 'Beardista Brew began in 2020 during the height of the pandemic. Even with all the strict limitations, our passion for crafting and sharing great drinks never stopped. We wanted to build more than just a standard cafe; our vision was to create a unique space that offered the best of both worlds—a coffee shop and bar open from the afternoon straight through to midnight.',
  communityStory: 'We would not be where we are today without the incredible support of our community. From the local regulars who stood by us since our humble beginnings, to the talented artists who hang out and bring life to our space, you all made this dream possible. Today, Beardista Brew remains a welcoming home for everyone to connect over exceptional coffee and cocktails.',
  blendRoastLevel: 'Medium-Dark Artisan Roast',
  blendOrigins: 'Mt. Apo Arabica (Davao) & Benguet Typica',
  blendNotes: 'Bittersweet dark cacao, caramelized hazelnut, hints of wild tobacco and dried stone fruit.',
  teamMembers: [
    { id: 't-1', name: 'Head Barista', role: 'Coffee Artisan', image: '/src/assets/barista_ben.jpg' },
    { id: 't-2', name: 'Lead Roaster', role: 'Roast Master', image: '/src/assets/barista_dais.jpg' },
    { id: 't-3', name: 'Pastry Chef', role: 'Culinary Lead', image: '/src/assets/barista_ja.jpg' }
  ]
};

export const initialEventsData = {
  activeEvent: {
    id: 'ev-latte-2026',
    title: '1st Beardista Latte Art Throwdown',
    subtitle: 'Head-to-head bracket elimination with live judges & community prizes',
    date: 'November 14, 2026',
    time: '5:00 PM - 10:00 PM PST',
    location: 'Beardista Brew Flagship, Camarin Caloocan',
    competitorFee: '₱500',
    spectatorFee: 'Free Admission',
    competitorSlotsTotal: 32,
    competitorSlotsTaken: 26,
    spectatorSlotsReserved: 74,
    status: 'Registration Active'
  }
};

export const initialSettingsData = {
  storeName: 'Beardista Brew',
  tagline: 'Coffee Shop & Bar',
  city: 'Caloocan City',
  address: '2837 Yellowbell St., Area C, Brgy. 174 Camarin, Caloocan City',
  phone: '0917-829-4412',
  email: 'contact@beardistabrew.com',
  openingTime: '16:00',
  closingTime: '00:00',
  wifiSSID: 'BeardistaBrew_Guest',
  wifiPass: 'Beardista2026!',
  instagram: 'https://instagram.com/beardistabrew',
  facebook: 'https://facebook.com/beardistabrew'
};