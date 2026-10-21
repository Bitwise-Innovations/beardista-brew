import alonImg from "@/assets/alon_at_apoy.png";
import goateeImg from "@/assets/goatee.png";
import chickenImg from "@/assets/chicken_fingers.jpg";

const images = {
  "alon-at-apoy": alonImg,
  goatee: goateeImg,
  "chicken-fingers": chickenImg,
};

export const mapItem = (row) => ({
  id: row.slug,
  name: row.name,
  category: row.categories?.name,
  price: `₱${Number(row.price)}`,
  flavorProfile: row.flavor_profile,
  contains: row.contains,
  description: row.description,
  image: row.image_url || images[row.slug],
  details: row.details,
});