// DUMMY DATA – for UI preview only. Replace with Supabase queries in the backend phase.
//
// Shared by Menu Management and the Announcements button links.
// Items with a matching photo in src/assets use it; the rest keep the placeholder icon.

import pastaPhoto from "../../../assets/pasta.jpg";
import saladPhoto from "../../../assets/salad.jpg";
import nachosPhoto from "../../../assets/nachos.png";
import juicesPhoto from "../../../assets/juices.png";
import riceMealPhoto from "../../../assets/ricemeal.jpg";
import chickenFingersPhoto from "../../../assets/chicken_fingers.jpg";
import bicolExpressPhoto from "../../../assets/bicol_express.png";
import palitawPhoto from "../../../assets/palitaw.jpg";

export const menu_items = [
  { id: 1, name: "Beardista Signature Brew", description: "House blend with brown sugar syrup and a velvety oat cream top.", category: "Signatures", price: 165, available: true },
  { id: 2, name: "Iced Latte", description: "Espresso blended with chilled milk over ice.", category: "Milk Creations", price: 110, available: true },
  { id: 3, name: "Spanish Latte", description: "Espresso with sweetened condensed milk and fresh milk.", category: "Milk Creations", price: 140, available: true },
  { id: 4, name: "Pour-Over Ethiopia", description: "Single-origin light roast with floral and citrus notes, brewed by hand.", category: "Specialty Coffee", price: 180, available: true },
  { id: 5, name: "Americano", description: "Double espresso topped with hot water for a clean, bold cup.", category: "Specialty Coffee", price: 95, available: true },
  { id: 6, name: "Ceremonial Matcha Latte", description: "Stone-ground matcha whisked with fresh milk.", category: "Matcha", price: 160, available: true },
  { id: 7, name: "Strawberry Matcha", description: "Matcha layered over house-made strawberry purée and milk.", category: "Matcha", price: 175, available: false },
  { id: 8, name: "Calamansi Sparkler", description: "Fresh calamansi, honey and sparkling water. Coffee-free.", category: "Zero-Proof", price: 120, available: true },
  { id: 9, name: "Chicken Pesto Panini", description: "Grilled chicken, basil pesto and mozzarella on toasted ciabatta.", category: "Savory Bites", price: 195, available: true },
  { id: 10, name: "Truffle Carbonara", description: "Creamy carbonara with bacon, parmesan and truffle oil.", category: "Pasta", price: 245, available: true, image: pastaPhoto },
  { id: 11, name: "Tapa Rice Bowl", description: "Garlic rice, beef tapa, fried egg and pickled papaya.", category: "Rice", price: 220, available: true, image: riceMealPhoto },
  { id: 12, name: "Garden Caesar Salad", description: "Romaine, parmesan, croutons and house Caesar dressing.", category: "Salad", price: 185, available: false, image: saladPhoto },
  { id: 13, name: "Loaded Nachos", description: "Tortilla chips with cheese sauce, salsa and jalapeños.", category: "Savory Bites", price: 180, available: true, image: nachosPhoto },
  { id: 14, name: "Chicken Fingers", description: "Crispy breaded chicken strips with a honey-mustard dip.", category: "Savory Bites", price: 175, available: true, image: chickenFingersPhoto },
  { id: 15, name: "Bicol Express Rice", description: "Pork simmered in coconut milk and chili, served with rice.", category: "Rice", price: 210, available: true, image: bicolExpressPhoto },
  { id: 16, name: "Fresh Fruit Juice", description: "Freshly pressed seasonal fruit juice. Coffee-free.", category: "Zero-Proof", price: 110, available: true, image: juicesPhoto },
  { id: 17, name: "Palitaw", description: "Sweet rice cakes rolled in grated coconut and sesame sugar.", category: "Extras", price: 85, available: true, image: palitawPhoto },
];
