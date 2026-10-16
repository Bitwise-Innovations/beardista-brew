// ==============================================================================
// FILE: src/data/aboutUsData.js
// PURPOSE: Central mock database module for the 'Our Story' (About Us) page.
// 
// EXPLANATION FOR ACADEMIC PANEL DEFENSE:
// 1. Database Decoupling:
//    - In a production environment, this information would be retrieved
//      asynchronously from a persistent database (e.g., PostgreSQL, MongoDB,
//      or Firebase Cloud Firestore) via a REST/GraphQL API endpoint.
//    - To maintain clean separation of concerns, no text or records are
//      hardcoded directly within the UI layout components.
// 2. Data Structure Schema:
//    - `storyNarrative`: Chronological narrative chapters detailing the cafe's
//      founding during the 2020 pandemic and its community roots.
//    - `mottoData`: Core brand mission statement and background banner metadata.
//    - `visionaryData`: Profile of Founder & Head Roaster Mr. Jim Carlo Gorospe.
//    - `teamMembers`: Collection of barista staff profiles with personal fun facts.
// ==============================================================================

// Narrative chapters displayed beside the primary signage image
export const storyNarrative = [
  {
    id: 1,
    chapter: "01",
    tag: "THE 2020 ORIGIN",
    subtitle: "A Coffee Shop & Bar Born in Resilience",
    paragraph: "Beardista Brew began in 2020 during the height of the pandemic. Even with all the strict limitations, our passion for crafting and sharing great drinks never stopped. We wanted to build more than just a standard cafe; our vision was to create a unique space that offered the best of both worlds—a coffee shop and bar open from the afternoon straight through to midnight.",
    highlightPill: "☕ Afternoon Straight Through to Midnight"
  },
  {
    id: 2,
    chapter: "02",
    tag: "OUR COMMUNITY BOND",
    subtitle: "Made Possible by Local Artists & Regulars",
    paragraph: "We would not be where we are today without the incredible support of our community. From the local regulars who stood by us since our humble beginnings, to the talented artists who hang out and bring life to our space, you all made this dream possible. Today, Beardista Brew remains a welcoming home for everyone to connect over exceptional coffee and cocktails.",
    highlightPill: "🎨 Exceptional Coffee & Cocktails for Everyone"
  }
];

// Cafe Mission & Motto banner data
export const mottoData = {
  tagline: "OUR MISSION",
  motto: "To serve quality specialty handcrafted drinks and to serve the community.",
  // Bar & cafe interior image with warm ambient lighting and burlap coffee sacks
  backgroundImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
};

// Founder / Visionary profile data
export const visionaryData = {
  title: "The Visionary",
  name: "Jim Carlo Gorospe",
  role: "Founder & Head Roaster",
  bio: "Jim started his career as a bartender in the corporate world, but the grueling, fast-paced environment slowly drained his creative passion. Looking for a fresh spark, he began experimenting—blending his mixology background with rich espresso, craft alcohol, and the local art scene. Today, as the founder of Beardista Brew, Jim's philosophy is simple: every drink is a canvas.",
  favoriteDrink: "Cortado with a hint of orange zest",
  // Portrait of founder behind bar
  image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80"
};

// Barista Team member records mapped into the "Meet the Team" card grid
export const teamMembers = [
  {
    id: "barista-1",
    name: "Gab Evora",
    role: "Barista",
    funFact: "Before pulling espresso shots, he originally wanted to be a pastry chef.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "barista-2",
    name: "Ben Cabazares",
    role: "Lead Barista",
    funFact: "His go-to midnight shift drink is a double-shot espresso poured directly over tonic water.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "barista-3",
    name: "Jahnyne Galindez",
    role: "Barista",
    funFact: "Her signature custom drink is a matcha-infused cocktail that isn't even on the official menu yet.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
  }
];
