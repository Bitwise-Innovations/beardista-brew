export const categoryGroups = [
  "Beverages - Coffee Bar",
  "Beverages - Non-Coffee",
  "Food",
];

export const toSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
