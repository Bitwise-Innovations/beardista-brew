// DUMMY DATA – for UI preview only. Replace with Supabase queries in the backend phase.
//
// One row per "What's Brewing" card on the customer landing page.
// The landing page shows the first 2 rows (by sort_order) that are visible and inside their dates.
//
// type: "new_event" | "new_drink" | "must_try" | "notice" | "custom" (custom shows custom_label instead)
// link_type: "none" | "event" | "menu_item" | "url"
// link_target: an events.id, a menu_items.id, or a URL, depending on link_type

import latteArtImage from "../../../assets/barista_ben.jpg";
import juiceImage from "../../../assets/juices.png";
import carbonaraImage from "../../../assets/pasta.jpg";
import communityImage from "../../../assets/beardista_aboutus.jpg";
import classImage from "../../../assets/barista_dais.jpg";

export const announcements = [
  {
    id: 1,
    type: "new_event",
    custom_label: "",
    title: "Latte Art Throwdown 2026",
    description: "Baristas go head to head on Nov 18. Sign up to compete, or come watch with free tasting cups.",
    image_url: latteArtImage,
    button_label: "Join the throwdown",
    link_type: "event",
    link_target: 1,
    starts_at: "2026-10-01",
    ends_at: "2026-11-18",
    is_visible: true,
    sort_order: 1,
  },
  {
    id: 2,
    type: "new_drink",
    custom_label: "",
    title: "Fresh Fruit Juice",
    description: "Freshly pressed seasonal fruit, no coffee needed. A bright pick for hot Caloocan afternoons.",
    image_url: juiceImage,
    button_label: "See it on the menu",
    link_type: "menu_item",
    link_target: 16,
    starts_at: "2026-10-10",
    ends_at: "",
    is_visible: true,
    sort_order: 2,
  },
  {
    id: 3,
    type: "must_try",
    custom_label: "",
    title: "Truffle Carbonara",
    description: "Creamy carbonara with bacon, parmesan and truffle oil. Our regulars' comfort food.",
    image_url: carbonaraImage,
    button_label: "View dish",
    link_type: "menu_item",
    link_target: 10,
    starts_at: "2026-09-01",
    ends_at: "",
    is_visible: true,
    sort_order: 3,
  },
  {
    id: 4,
    type: "notice",
    custom_label: "",
    title: "Holiday hours",
    description: "On Dec 24 we open at 2:00 PM and close early at 8:00 PM. Merry Christmas from the Beardista crew!",
    image_url: "",
    button_label: "",
    link_type: "none",
    link_target: "",
    starts_at: "2026-12-15",
    ends_at: "2026-12-26",
    is_visible: true,
    sort_order: 4,
  },
  {
    id: 5,
    type: "custom",
    custom_label: "Community",
    title: "Kalookan Kape Crawl",
    description: "We're a stop on the Kalookan Kape Crawl. Get your passport stamped at the counter.",
    image_url: communityImage,
    button_label: "Learn more",
    link_type: "url",
    link_target: "https://example.com/kalookan-kape-crawl",
    starts_at: "2026-10-01",
    ends_at: "2026-12-31",
    is_visible: false,
    sort_order: 5,
  },
  {
    id: 6,
    type: "new_event",
    custom_label: "",
    title: "Barista Basics Class",
    description: "A beginner class on espresso and milk steaming with our lead baristas. Small class, lots of hands-on time.",
    image_url: classImage,
    button_label: "See the class",
    link_type: "event",
    link_target: 5,
    starts_at: "2026-10-05",
    ends_at: "2026-11-07",
    is_visible: true,
    sort_order: 6,
  },
];
