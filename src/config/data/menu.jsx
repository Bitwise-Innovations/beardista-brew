import alonImg from '../assets/alon at apoy.png';
import goateeImg from '../assets/goatee.png';
import chickenImg from '../assets/chicken fingers.jpg';
import palitawImg from '../assets/palitaw.jpg';

export const customerFavoritesData = [
  {
    id: "alon-at-apoy",
    name: "ALON AT APOY",
    category: "Coffee",
    price: "₱160",
    flavorProfile: ["BOLD", "CREAMY"],
    contains: "COFFEE, DAIRY",
    description: "A perfectly balanced blend of rich espresso and sweetened condensed milk, crafted for those who love a creamy, bold kick.",
    image: alonImg, // Updated to local asset
    details: {
      profile: "Double Shot Espresso with Smoked Condensed Crema",
      origin: "Benguet Highland Arabica + Brazil Santos",
      tastingNotes: "Toasted marshmallow, dark cacao, citrus zest",
      servingTemperature: "Iced or Hot",
      allergens: "Dairy (Condensed milk)"
    }
  },
  {
    id: "goatee",
    name: "Goatee",
    category: "Non-Coffee",
    price: "₱170",
    flavorProfile: ["EARTHY", "SWEET"],
    contains: "MATCHA, DAIRY",
    description: "Earthy, slightly sweet ceremonial grade matcha whisked to perfection and layered over creamy milk. A refreshing alternative.",
    image: goateeImg, // Updated to local asset
    details: {
      profile: "Stone-ground Ceremonial Uji Matcha with Silky Fresh Milk",
      origin: "Uji, Kyoto, Japan",
      tastingNotes: "Earthy umami, grassy sweetness, velvet finish",
      servingTemperature: "Iced",
      allergens: "Dairy"
    }
  },
  {
    id: "chicken-fingers",
    name: "Chicken Fingers",
    category: "Food",
    price: "₱180",
    flavorProfile: ["CRISPY", "SAVORY"],
    contains: "POULTRY, GLUTEN, EGG",
    description: "Flaky, golden, and fried fresh daily. The perfect companion to your morning brew or afternoon pick-me-up.",
    image: chickenImg, // Updated to local asset
    details: {
      profile: "Double-crunch buttermilk marinated tenderloin fillets",
      origin: "Farm-fresh local poultry",
      tastingNotes: "Garlic herb seasoning, honey mustard dip",
      servingTemperature: "Freshly Fried / Hot",
      allergens: "Gluten, Egg"
    }
  }
];

// Data for the What's Brewing highlight cards
export const whatsBrewingData = {
  event: {
    tag: "EVENT",
    title: "Latte Art Throwdown",
    description: "Show off your skills and compete for the crown in our monthly pour-off.",
    buttonLabel: "REGISTER & JOIN",
    details: {
      date: "Saturday, 7:00 PM onwards",
      venue: "Beardista Brew Arena, Camarin, Caloocan",
      entryFee: "Free Admission for Spectators / ₱300 Competitor Pool",
      prize: "₱15,000 Grand Prize Pool + Custom Trophy"
    }
  },
  mustTry: {
    tag: "MUST TRY!",
    title: "Tsamporado",
    description: "Our signature cold brew topped with a generous scoop of artisanal vanilla bean ice cream.",
    buttonLabel: "VIEW DETAILS",
    image: palitawImg, // Added local asset here
    details: {
      profile: "Traditional heirloom tablea cacao infusion with cold-steeped espresso and gelato",
      origin: "Davao Single-Origin Criollo Cacao + House Blend",
      tastingNotes: "Deep dark chocolate, Madagascar vanilla, toasted rice crunch",
      servingTemperature: "Chilled with warm cacao swirl",
      allergens: "Dairy"
    }
  }
};

export const whyChooseData = [
  {
    id: 1,
    title: "Specialty Coffee",
    description: "Expertly roasted beans crafted for the perfect cup every time.",
    iconType: "coffee"
  },
  {
    id: 2,
    title: "Bold Creations",
    description: "Innovative drinks and flavors that push the boundaries of coffee.",
    iconType: "sparkle"
  },
  {
    id: 3,
    title: "Quality Ingredients",
    description: "Ethically sourced and carefully selected for the best taste.",
    iconType: "shield"
  },
  {
    id: 4,
    title: "Community First",
    description: "A welcoming space for everyone to connect and share moments.",
    iconType: "users"
  }
];

export const blendDetailsData = [
  { label: "ROAST PROFILE", value: "Dark & Chaotic" },
  { label: "FLAVOR NOTES", value: "Blueberry, Smoke, Grit" },
  { label: "ORIGIN INFO", value: "Brazil" }
];

export const reviewsData = [
  { id: 1, quote: "Best Spanish Latte I've ever had. The atmosphere is perfect for working or just chilling with friends.", author: "Maria S.", rating: 5 },
  { id: 2, quote: "Their matcha is ceremonial grade and you can taste the difference. Friendly staff and great vibes.", author: "John D.", rating: 5 },
  { id: 3, quote: "The pastries are always fresh. My go-to spot every Sunday morning. Highly recommend the butter croissant!", author: "Elena R.", rating: 5 }
];

export const wifiData = {
  ssid: "BEARDISTA_BREW",
  password: "ILOVEBEARDISTA"
};

export const faqData = [
  { id: 1, question: "Is this a good place to work or study?", answer: "Absolutely! We provide high-speed fiber Wi-Fi, accessible power outlets throughout both indoor and patio tables, and a comfortable ambient atmosphere ideal for productivity." },
  { id: 2, question: "Are pets allowed?", answer: "Yes, we are proudly pet-friendly! We just ask that you keep a close eye on your furry friends, as we have resident cats and stray dogs around the area." },
  { id: 3, question: "Can we bring outside food or drinks?", answer: "To uphold our food safety standards and support our kitchen staff, outside food and beverages are not permitted. We offer an extensive selection of drinks and freshly prepared artisanal bites." },
  { id: 4, question: "What payment methods do you accept?", answer: "We accept Cash, GCash, Maya, and major credit and debit cards (Visa & Mastercard) for your convenience." }
];