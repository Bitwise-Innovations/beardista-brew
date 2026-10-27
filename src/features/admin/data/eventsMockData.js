// DUMMY DATA – for UI preview only. Replace with Supabase queries in the backend phase.
//
// Each export mirrors a future database table. Rows link to each other by id
// (event_id, participant_type_id, registration_id, question_id).

import latteArtCover from "../../../assets/barista_ben.jpg";
import cuppingCover from "../../../assets/beardista_brew.jpg";
import anniversaryCover from "../../../assets/beardista_aboutus.jpg";
import workshopCover from "../../../assets/our_story.jpg";
import basicsCover from "../../../assets/barista_dais.jpg";
import holidayCover from "../../../assets/barista_ja.jpg";
import icedFestCover from "../../../assets/juices.png";
import coldBrewCover from "../../../assets/beardista_sign.jpg";

// The workshop (event 4) is dated today so the "Happening now" state always shows in the preview.
const isoDaysFromToday = (offset) => {
  const day = new Date();
  day.setDate(day.getDate() + offset);
  const pad = (number) => String(number).padStart(2, "0");
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
};

// status: "draft" | "open" | "closed" | "completed" | "cancelled"
export const events = [
  {
    id: 1,
    title: "Latte Art Throwdown 2026",
    description:
      "Baristas from around Caloocan go head to head in live latte art heats, judged on symmetry, contrast and speed. Spectators get free tasting cups all afternoon.",
    event_date: "2026-11-18",
    start_time: "10:00",
    end_time: "17:00",
    venue: "Beardista Brew Main Hall, Caloocan",
    cover_image_url: latteArtCover,
    status: "open",
    registration_opens_at: "2026-10-01",
    registration_closes_at: "2026-11-17",
  },
  {
    id: 2,
    title: "Sensory Cupping Session",
    description:
      "A small-group cupping of three single-origin Philippine coffees with our head roaster. Learn how to taste acidity, body and sweetness like a pro.",
    event_date: "2026-12-05",
    start_time: "16:00",
    end_time: "18:00",
    venue: "Roastery Lab, Caloocan",
    cover_image_url: cuppingCover,
    status: "draft",
    registration_opens_at: "2026-11-01",
    registration_closes_at: "2026-12-03",
  },
  {
    id: 3,
    title: "Beardista Anniversary Latte Jam",
    description:
      "Our yearly latte art jam to celebrate another year of Beardista Brew with the community. Open heats, live music and anniversary drinks.",
    event_date: "2026-05-04",
    start_time: "13:00",
    end_time: "18:00",
    venue: "Beardista Brew Flagship",
    cover_image_url: anniversaryCover,
    status: "completed",
    registration_opens_at: "2026-03-15",
    registration_closes_at: "2026-05-03",
  },
  {
    id: 4,
    title: "Pour-Over Afternoon Workshop",
    description:
      "Hands-on pour-over class: grind size, bloom, pouring technique and recipe tweaks. Every guest brews three cups and takes home a recipe card.",
    event_date: isoDaysFromToday(0),
    start_time: "15:00",
    end_time: "19:00",
    venue: "Beardista Brew Coffee Bar",
    cover_image_url: workshopCover,
    status: "closed",
    registration_opens_at: isoDaysFromToday(-21),
    registration_closes_at: isoDaysFromToday(-1),
  },
  {
    id: 5,
    title: "Barista Basics Class",
    description:
      "A beginner class on espresso, milk steaming and café workflow, taught by our lead baristas. Small class so everyone gets time on the machine.",
    event_date: "2026-11-07",
    start_time: "09:00",
    end_time: "12:00",
    venue: "Beardista Brew Training Corner",
    cover_image_url: basicsCover,
    status: "open",
    registration_opens_at: "2026-10-05",
    registration_closes_at: "2026-11-05",
  },
  {
    id: 6,
    title: "Holiday Latte Art Jam",
    description:
      "A festive latte art jam with holiday-themed patterns, an ugly-sweater contest and seasonal drinks for everyone who drops by.",
    event_date: "2026-12-19",
    start_time: "14:00",
    end_time: "20:00",
    venue: "Beardista Brew Main Hall, Caloocan",
    cover_image_url: holidayCover,
    status: "open",
    registration_opens_at: "2026-11-25",
    registration_closes_at: "2026-12-17",
  },
  {
    id: 7,
    title: "Summer Iced Coffee Fest",
    description:
      "A day of iced coffee flights, fruit sodas and cold brew cocktails (zero-proof) to beat the summer heat.",
    event_date: "2026-08-15",
    start_time: "11:00",
    end_time: "19:00",
    venue: "Beardista Brew Garden",
    cover_image_url: icedFestCover,
    status: "completed",
    registration_opens_at: "2026-07-15",
    registration_closes_at: "2026-08-14",
  },
  {
    id: 8,
    title: "Cold Brew Tasting Night",
    description:
      "Taste four cold brew recipes side by side, from a 12-hour light steep to a 24-hour concentrate, with snacks paired by our kitchen.",
    event_date: "2026-09-20",
    start_time: "18:00",
    end_time: "21:00",
    venue: "Roastery Lab, Caloocan",
    cover_image_url: coldBrewCover,
    status: "completed",
    registration_opens_at: "2026-08-25",
    registration_closes_at: "2026-09-18",
  },
];

export const participant_types = [
  { id: 1, event_id: 1, name: "Competitor", capacity: 16, opens_at: "2026-10-01", closes_at: "2026-11-10" },
  { id: 2, event_id: 1, name: "Spectator/Guest", capacity: 60, opens_at: "2026-10-01", closes_at: "2026-11-17" },
  { id: 3, event_id: 1, name: "Sponsor", capacity: 4, opens_at: "2026-09-15", closes_at: "2026-10-31" },
  { id: 4, event_id: 1, name: "Volunteer", capacity: 2, opens_at: "2026-10-01", closes_at: "2026-11-05" },
  { id: 5, event_id: 2, name: "Spectator/Guest", capacity: 20, opens_at: "2026-11-01", closes_at: "2026-12-03" },
  { id: 6, event_id: 3, name: "Competitor", capacity: 24, opens_at: "2026-03-15", closes_at: "2026-04-28" },
  { id: 7, event_id: 3, name: "Spectator/Guest", capacity: 50, opens_at: "2026-03-15", closes_at: "2026-05-03" },
  { id: 8, event_id: 4, name: "Spectator/Guest", capacity: 12, opens_at: isoDaysFromToday(-21), closes_at: isoDaysFromToday(-1) },
  { id: 9, event_id: 5, name: "Student", capacity: 3, opens_at: "2026-10-05", closes_at: "2026-11-05" },
  { id: 10, event_id: 6, name: "Competitor", capacity: 20, opens_at: "2026-11-25", closes_at: "2026-12-12" },
  { id: 11, event_id: 6, name: "Spectator/Guest", capacity: 40, opens_at: "2026-11-25", closes_at: "2026-12-17" },
  { id: 12, event_id: 7, name: "Spectator/Guest", capacity: 80, opens_at: "2026-07-15", closes_at: "2026-08-14" },
  { id: 13, event_id: 8, name: "Spectator/Guest", capacity: 25, opens_at: "2026-08-25", closes_at: "2026-09-18" },
];

// Name and email are stored on each registration, so they are not listed here.
// type: "short_answer" | "paragraph" | "multiple_choice" | "checkboxes" | "dropdown" | "date" | "email" | "phone"
export const form_questions = [
  // Latte Art Throwdown 2026 – Competitor
  { id: 1, participant_type_id: 1, label: "Café or shop you represent", type: "short_answer", required: true, help_text: "Write “Independent” if you are not with a café.", options: [], sort_order: 1 },
  { id: 2, participant_type_id: 1, label: "Years of barista experience", type: "dropdown", required: true, help_text: "", options: ["Less than 1 year", "1–3 years", "4–6 years", "7+ years"], sort_order: 2 },
  { id: 3, participant_type_id: 1, label: "Mobile number", type: "phone", required: true, help_text: "We will text you your heat schedule.", options: [], sort_order: 3 },
  { id: 4, participant_type_id: 1, label: "Milk for your heats", type: "multiple_choice", required: true, help_text: "", options: ["Whole milk", "Oat milk", "Either is fine"], sort_order: 4 },
  { id: 5, participant_type_id: 1, label: "Patterns you are confident with", type: "checkboxes", required: false, help_text: "", options: ["Heart", "Tulip", "Rosetta", "Swan", "Free pour design"], sort_order: 5 },
  { id: 6, participant_type_id: 1, label: "Instagram handle", type: "short_answer", required: false, help_text: "So we can tag you in event photos.", options: [], sort_order: 6 },

  // Latte Art Throwdown 2026 – Spectator/Guest
  { id: 7, participant_type_id: 2, label: "Companions coming with you", type: "dropdown", required: true, help_text: "", options: ["Just me", "+1", "+2", "+3"], sort_order: 1 },
  { id: 8, participant_type_id: 2, label: "How did you hear about the event?", type: "multiple_choice", required: true, help_text: "", options: ["Instagram", "Facebook", "A friend", "In the café"], sort_order: 2 },
  { id: 9, participant_type_id: 2, label: "Mobile number", type: "phone", required: false, help_text: "", options: [], sort_order: 3 },

  // Latte Art Throwdown 2026 – Sponsor
  { id: 10, participant_type_id: 3, label: "Company or brand name", type: "short_answer", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 11, participant_type_id: 3, label: "Sponsorship package", type: "multiple_choice", required: true, help_text: "", options: ["Gold", "Silver", "In-kind (products)"], sort_order: 2 },
  { id: 12, participant_type_id: 3, label: "Contact number", type: "phone", required: true, help_text: "", options: [], sort_order: 3 },
  { id: 13, participant_type_id: 3, label: "What would you like to showcase?", type: "paragraph", required: false, help_text: "Booths, sampling, giveaways, banners…", options: [], sort_order: 4 },

  // Latte Art Throwdown 2026 – Volunteer
  { id: 14, participant_type_id: 4, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 15, participant_type_id: 4, label: "Roles you can help with", type: "checkboxes", required: true, help_text: "Pick all that you are comfortable with.", options: ["Registration desk", "Judging assistant", "Backstage / cups & milk", "Photos & social media"], sort_order: 2 },
  { id: 16, participant_type_id: 4, label: "Day you can attend the volunteer briefing", type: "date", required: true, help_text: "Briefings run Nov 14–16.", options: [], sort_order: 3 },

  // Sensory Cupping Session – Spectator/Guest
  { id: 17, participant_type_id: 5, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 18, participant_type_id: 5, label: "Your coffee experience", type: "multiple_choice", required: true, help_text: "", options: ["New to specialty coffee", "Casual drinker", "Home brewer", "Industry professional"], sort_order: 2 },
  { id: 19, participant_type_id: 5, label: "Allergies or dietary needs", type: "paragraph", required: false, help_text: "", options: [], sort_order: 3 },

  // Beardista Anniversary Latte Jam – Competitor
  { id: 20, participant_type_id: 6, label: "Café or shop you represent", type: "short_answer", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 21, participant_type_id: 6, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 2 },
  { id: 22, participant_type_id: 6, label: "Date of birth", type: "date", required: true, help_text: "Competitors must be 18 or older.", options: [], sort_order: 3 },

  // Beardista Anniversary Latte Jam – Spectator/Guest
  { id: 23, participant_type_id: 7, label: "Companions coming with you", type: "dropdown", required: true, help_text: "", options: ["Just me", "+1", "+2", "+3"], sort_order: 1 },
  { id: 24, participant_type_id: 7, label: "Backup email for event updates", type: "email", required: false, help_text: "", options: [], sort_order: 2 },

  // Pour-Over Afternoon Workshop – Spectator/Guest
  { id: 25, participant_type_id: 8, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 26, participant_type_id: 8, label: "Brewing gear you own", type: "checkboxes", required: false, help_text: "", options: ["None yet", "V60", "AeroPress", "French press", "Chemex"], sort_order: 2 },

  // Barista Basics Class – Student
  { id: 27, participant_type_id: 9, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 28, participant_type_id: 9, label: "Why do you want to join?", type: "paragraph", required: false, help_text: "", options: [], sort_order: 2 },
  { id: 29, participant_type_id: 9, label: "Apron size", type: "dropdown", required: true, help_text: "Every student gets a Beardista apron.", options: ["S", "M", "L", "XL"], sort_order: 3 },

  // Holiday Latte Art Jam – Competitor
  { id: 30, participant_type_id: 10, label: "Café or shop you represent", type: "short_answer", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 31, participant_type_id: 10, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 2 },
  { id: 32, participant_type_id: 10, label: "Experience level", type: "multiple_choice", required: true, help_text: "", options: ["Beginner", "Intermediate", "Pro"], sort_order: 3 },

  // Holiday Latte Art Jam – Spectator/Guest
  { id: 33, participant_type_id: 11, label: "Companions coming with you", type: "dropdown", required: true, help_text: "", options: ["Just me", "+1", "+2", "+3"], sort_order: 1 },

  // Summer Iced Coffee Fest – Spectator/Guest
  { id: 34, participant_type_id: 12, label: "Companions coming with you", type: "dropdown", required: true, help_text: "", options: ["Just me", "+1", "+2", "+3"], sort_order: 1 },
  { id: 35, participant_type_id: 12, label: "Favorite iced drink", type: "short_answer", required: false, help_text: "", options: [], sort_order: 2 },

  // Cold Brew Tasting Night – Spectator/Guest
  { id: 36, participant_type_id: 13, label: "Mobile number", type: "phone", required: true, help_text: "", options: [], sort_order: 1 },
  { id: 37, participant_type_id: 13, label: "Cold brew strength you prefer", type: "multiple_choice", required: false, help_text: "", options: ["Light", "Balanced", "Strong"], sort_order: 2 },
];

// status: "pending" (email not verified yet) | "confirmed" | "waitlisted" | "cancelled"
// BACKEND TODO: when a participant enters the correct email code,
// set email_verified = true and status = 'confirmed' automatically
// (or 'waitlisted' if that participant type is full).
export const registrations = [
  { id: 1, event_id: 1, participant_type_id: 1, name: "Bianca Cruz", email: "bianca.cruz@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-22T08:40:00", registered_at: "2026-10-22T08:40:00" },
  { id: 2, event_id: 1, participant_type_id: 1, name: "Andrea Lim", email: "andrea.lim@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-21T19:12:00", registered_at: "2026-10-21T19:12:00" },
  { id: 3, event_id: 1, participant_type_id: 1, name: "Paolo Reyes", email: "paolo.reyes@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-20T14:05:00", registered_at: "2026-10-20T14:05:00" },
  { id: 4, event_id: 1, participant_type_id: 1, name: "Camille Garcia", email: "camille.garcia@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-18T10:30:00", registered_at: "2026-10-18T10:30:00" },
  { id: 5, event_id: 1, participant_type_id: 1, name: "Nicole Bautista", email: "nicole.bautista@example.com", status: "cancelled", email_verified: true, verification_sent_at: "2026-10-17T16:48:00", registered_at: "2026-10-17T16:48:00" },
  { id: 6, event_id: 1, participant_type_id: 1, name: "Patricia Ramos", email: "patricia.ramos@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-15T09:20:00", registered_at: "2026-10-15T09:20:00" },
  { id: 7, event_id: 1, participant_type_id: 2, name: "Miguel Santos", email: "miguel.santos@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-21T12:02:00", registered_at: "2026-10-21T12:02:00" },
  { id: 8, event_id: 1, participant_type_id: 2, name: "Kristine Dela Cruz", email: "kristine.dc@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-20T18:44:00", registered_at: "2026-10-20T18:44:00" },
  { id: 9, event_id: 1, participant_type_id: 2, name: "Joshua Tan", email: "joshua.tan@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-19T08:15:00", registered_at: "2026-10-19T08:15:00" },
  { id: 10, event_id: 1, participant_type_id: 2, name: "Rafael Mendoza", email: "rafael.mendoza@example.com", status: "cancelled", email_verified: true, verification_sent_at: "2026-10-18T21:30:00", registered_at: "2026-10-18T21:30:00" },
  { id: 11, event_id: 1, participant_type_id: 3, name: "Leo Navarro", email: "leo.navarro@hirayadairy.example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-03T11:00:00", registered_at: "2026-10-03T11:00:00" },
  { id: 12, event_id: 1, participant_type_id: 4, name: "Enzo Villanueva", email: "enzo.v@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-16T13:25:00", registered_at: "2026-10-16T13:25:00" },
  { id: 13, event_id: 1, participant_type_id: 4, name: "Mara Soriano", email: "mara.soriano@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-14T17:10:00", registered_at: "2026-10-14T17:10:00" },
  { id: 14, event_id: 1, participant_type_id: 4, name: "Gio Fernandez", email: "gio.fernandez@example.com", status: "waitlisted", email_verified: true, verification_sent_at: "2026-10-21T20:05:00", registered_at: "2026-10-21T20:05:00" },
  { id: 15, event_id: 3, participant_type_id: 6, name: "Jessa Ramirez", email: "jessa.ramirez@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-04-02T10:15:00", registered_at: "2026-04-02T10:15:00" },
  { id: 16, event_id: 3, participant_type_id: 6, name: "Mark Dizon", email: "mark.dizon@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-04-10T15:40:00", registered_at: "2026-04-10T15:40:00" },
  { id: 17, event_id: 3, participant_type_id: 6, name: "Trina Cortez", email: "trina.cortez@example.com", status: "cancelled", email_verified: true, verification_sent_at: "2026-04-12T09:05:00", registered_at: "2026-04-12T09:05:00" },
  { id: 18, event_id: 3, participant_type_id: 7, name: "Lea Manalo", email: "lea.manalo@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-04-20T19:30:00", registered_at: "2026-04-20T19:30:00" },
  { id: 19, event_id: 3, participant_type_id: 7, name: "Dan Robles", email: "dan.robles@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-04-25T12:45:00", registered_at: "2026-04-25T12:45:00" },
  { id: 20, event_id: 3, participant_type_id: 7, name: "Ica Pascual", email: "ica.pascual@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-05-01T08:20:00", registered_at: "2026-05-01T08:20:00" },
  { id: 21, event_id: 1, participant_type_id: 1, name: "Aira Domingo", email: "aira.domingo@example.com", status: "pending", email_verified: false, verification_sent_at: "2026-10-22T09:55:00", registered_at: "2026-10-22T09:54:00" },
  { id: 22, event_id: 1, participant_type_id: 2, name: "Noel Abad", email: "noel.abad@example.com", status: "pending", email_verified: false, verification_sent_at: "2026-10-21T22:18:00", registered_at: "2026-10-21T22:17:00" },
  { id: 23, event_id: 4, participant_type_id: 8, name: "Hannah Yu", email: "hannah.yu@example.com", status: "confirmed", email_verified: true, verification_sent_at: `${isoDaysFromToday(-9)}T10:12:00`, registered_at: `${isoDaysFromToday(-9)}T10:12:00` },
  { id: 24, event_id: 4, participant_type_id: 8, name: "Vince Cabrera", email: "vince.cabrera@example.com", status: "confirmed", email_verified: true, verification_sent_at: `${isoDaysFromToday(-6)}T19:40:00`, registered_at: `${isoDaysFromToday(-6)}T19:40:00` },
  { id: 25, event_id: 4, participant_type_id: 8, name: "Pia Lorenzo", email: "pia.lorenzo@example.com", status: "cancelled", email_verified: true, verification_sent_at: `${isoDaysFromToday(-4)}T08:05:00`, registered_at: `${isoDaysFromToday(-4)}T08:05:00` },
  { id: 26, event_id: 5, participant_type_id: 9, name: "Ella Santos", email: "ella.santos@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-06T09:30:00", registered_at: "2026-10-06T09:30:00" },
  { id: 27, event_id: 5, participant_type_id: 9, name: "Jomar Reyes", email: "jomar.reyes@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-08T13:10:00", registered_at: "2026-10-08T13:10:00" },
  { id: 28, event_id: 5, participant_type_id: 9, name: "Kat Villamor", email: "kat.villamor@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-10-11T20:45:00", registered_at: "2026-10-11T20:45:00" },
  { id: 29, event_id: 5, participant_type_id: 9, name: "Ben Uy", email: "ben.uy@example.com", status: "waitlisted", email_verified: true, verification_sent_at: "2026-10-19T07:55:00", registered_at: "2026-10-19T07:55:00" },
  { id: 30, event_id: 7, participant_type_id: 12, name: "Rica Torres", email: "rica.torres@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-07-20T11:00:00", registered_at: "2026-07-20T11:00:00" },
  { id: 31, event_id: 7, participant_type_id: 12, name: "Paul Gatchalian", email: "paul.gatchalian@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-08-02T16:25:00", registered_at: "2026-08-02T16:25:00" },
  { id: 32, event_id: 8, participant_type_id: 13, name: "Mika Lopez", email: "mika.lopez@example.com", status: "confirmed", email_verified: true, verification_sent_at: "2026-09-01T18:30:00", registered_at: "2026-09-01T18:30:00" },
  { id: 33, event_id: 8, participant_type_id: 13, name: "Jun Aquino", email: "jun.aquino@example.com", status: "cancelled", email_verified: true, verification_sent_at: "2026-09-05T12:15:00", registered_at: "2026-09-05T12:15:00" },
];

// Answers per registration, written as { question_id: value } and flattened into table rows below.
// Checkbox answers are arrays; every other answer is a string.
const submittedAnswers = {
  1: { 1: "Kapihan sa Kanto", 2: "4–6 years", 3: "0917 555 0142", 4: "Oat milk", 5: ["Heart", "Tulip", "Rosetta"], 6: "@biancapours" },
  2: { 1: "Brew Lab Manila", 2: "1–3 years", 3: "0918 555 0199", 4: "Whole milk", 5: ["Heart", "Tulip"], 6: "" },
  3: { 1: "Independent", 2: "7+ years", 3: "0927 555 0110", 4: "Either is fine", 5: ["Heart", "Tulip", "Rosetta", "Swan"], 6: "@paoloreyes.coffee" },
  4: { 1: "Sunday Grind Café", 2: "1–3 years", 3: "0915 555 0163", 4: "Oat milk", 5: ["Heart", "Rosetta"], 6: "@camillebrews" },
  5: { 1: "Roast & Co.", 2: "Less than 1 year", 3: "0906 555 0187", 4: "Whole milk", 5: ["Heart"], 6: "" },
  6: { 1: "Beanstalk Coffee", 2: "4–6 years", 3: "0995 555 0124", 4: "Either is fine", 5: ["Tulip", "Rosetta", "Free pour design"], 6: "@patpours" },
  7: { 7: "+1", 8: "Instagram", 9: "0917 555 0201" },
  8: { 7: "Just me", 8: "In the café", 9: "" },
  9: { 7: "+2", 8: "A friend", 9: "0928 555 0233" },
  10: { 7: "+1", 8: "Facebook", 9: "" },
  11: { 10: "Hiraya Dairy Co.", 11: "In-kind (products)", 12: "0917 555 0300", 13: "A fresh milk tasting station beside the stage, plus milk for all competition heats." },
  12: { 14: "0919 555 0412", 15: ["Registration desk", "Photos & social media"], 16: "2026-11-14" },
  13: { 14: "0916 555 0477", 15: ["Backstage / cups & milk"], 16: "2026-11-14" },
  14: { 14: "0905 555 0450", 15: ["Judging assistant", "Registration desk"], 16: "2026-11-15" },
  15: { 20: "Kapihan sa Kanto", 21: "0917 555 0521", 22: "1998-07-14" },
  16: { 20: "Independent", 21: "0918 555 0566", 22: "1995-02-03" },
  17: { 20: "Daily Dose PH", 21: "0927 555 0590", 22: "2001-11-22" },
  18: { 23: "+1", 24: "lea.manalo.alt@example.com" },
  19: { 23: "Just me", 24: "" },
  20: { 23: "+3", 24: "" },
  21: { 1: "Tasa Coffee Bar", 2: "1–3 years", 3: "0917 555 0611", 4: "Oat milk", 5: ["Heart"], 6: "" },
  22: { 7: "Just me", 8: "Instagram", 9: "" },
  23: { 25: "0917 555 0701", 26: ["V60", "AeroPress"] },
  24: { 25: "0918 555 0745", 26: ["None yet"] },
  25: { 25: "0927 555 0790", 26: ["French press"] },
  26: { 27: "0917 555 0802", 28: "I want to start working at a café next year.", 29: "M" },
  27: { 27: "0918 555 0833", 28: "", 29: "L" },
  28: { 27: "0995 555 0861", 28: "The class was a birthday gift from my partner!", 29: "S" },
  29: { 27: "0906 555 0877", 28: "Learning to make drinks for our small bakery.", 29: "XL" },
  30: { 34: "+2", 35: "Iced Spanish latte" },
  31: { 34: "Just me", 35: "Iced americano" },
  32: { 36: "0917 555 0920", 37: "Strong" },
  33: { 36: "0928 555 0945", 37: "Balanced" },
};

let answerId = 0;
export const registration_answers = Object.entries(submittedAnswers).flatMap(
  ([registrationId, answers]) =>
    Object.entries(answers).map(([questionId, value]) => ({
      id: ++answerId,
      registration_id: Number(registrationId),
      question_id: Number(questionId),
      value,
    }))
);
