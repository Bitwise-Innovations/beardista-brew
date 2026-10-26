-- Safe to re-run: no duplicates are created

insert into categories (name, sort_order) values
  ('Coffee', 1), ('Non-Coffee', 2), ('Food', 3)
on conflict (name) do nothing;

insert into items (slug, category_id, name, description, price, flavor_profile, contains, is_featured, details)
select 'alon-at-apoy', c.id, 'ALON AT APOY',
  'A perfectly balanced blend of rich espresso and sweetened condensed milk, crafted for those who love a creamy, bold kick.',
  160, '{BOLD,CREAMY}'::text[], 'COFFEE, DAIRY', true,
  '{"profile":"Double Shot Espresso with Smoked Condensed Crema","origin":"Benguet Highland Arabica + Brazil Santos","tastingNotes":"Toasted marshmallow, dark cacao, citrus zest","servingTemperature":"Iced or Hot","allergens":"Dairy (Condensed milk)"}'::jsonb
from categories c where c.name = 'Coffee'
on conflict (slug) do update set price = excluded.price, description = excluded.description;

insert into items (slug, category_id, name, description, price, flavor_profile, contains, is_featured, details)
select 'goatee', c.id, 'Goatee',
  'Earthy, slightly sweet ceremonial grade matcha whisked to perfection and layered over creamy milk. A refreshing alternative.',
  170, '{EARTHY,SWEET}'::text[], 'MATCHA, DAIRY', true,
  '{"profile":"Stone-ground Ceremonial Uji Matcha with Silky Fresh Milk","origin":"Uji, Kyoto, Japan","tastingNotes":"Earthy umami, grassy sweetness, velvet finish","servingTemperature":"Iced","allergens":"Dairy"}'::jsonb
from categories c where c.name = 'Non-Coffee'
on conflict (slug) do update set price = excluded.price, description = excluded.description;

insert into items (slug, category_id, name, description, price, flavor_profile, contains, is_featured, details)
select 'chicken-fingers', c.id, 'Chicken Fingers',
  'Flaky, golden, and fried fresh daily. The perfect companion to your morning brew or afternoon pick-me-up.',
  180, '{CRISPY,SAVORY}'::text[], 'POULTRY, GLUTEN, EGG', true,
  '{"profile":"Double-crunch buttermilk marinated tenderloin fillets","origin":"Farm-fresh local poultry","tastingNotes":"Garlic herb seasoning, honey mustard dip","servingTemperature":"Freshly Fried / Hot","allergens":"Gluten, Egg"}'::jsonb
from categories c where c.name = 'Food'
on conflict (slug) do update set price = excluded.price, description = excluded.description;

insert into faqs (question, answer, sort_order) values
  ('Is this a good place to work or study?', 'Absolutely! We provide high-speed fiber Wi-Fi, accessible power outlets throughout both indoor and patio tables, and a comfortable ambient atmosphere ideal for productivity.', 1),
  ('Are pets allowed?', 'Yes, we are proudly pet-friendly! We just ask that you keep a close eye on your furry friends, as we have resident cats and stray dogs around the area.', 2),
  ('Can we bring outside food or drinks?', 'To uphold our food safety standards and support our kitchen staff, outside food and beverages are not permitted. We offer an extensive selection of drinks and freshly prepared artisanal bites.', 3),
  ('What payment methods do you accept?', 'We accept Cash, GCash, Maya, and major credit and debit cards (Visa & Mastercard) for your convenience.', 4)
on conflict (question) do nothing;