import ownerPhoto from "../../../assets/owner_pic.jpg";

// No clean logo file exists in src/assets yet (the logo only appears inside photos).
// Add one as src/assets/beardista_logo.png (or .svg / .jpg / .webp) and the sidebar and
// login page pick it up automatically; until then they show the cup icon.
const logoFiles = import.meta.glob("../../../assets/beardista_logo.{png,svg,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export const LOGO_URL = Object.values(logoFiles)[0] ?? null;

// The signed-in account shown in the sidebar, top bar and My Account (sample data).
export const OWNER = {
  name: "Jim Carlo Gorospe",
  role: "Owner",
  initials: "JC",
  email: "founder@beardistabrew.com",
  photo: ownerPhoto,
};
