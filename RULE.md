Beardista Brew: backend rules
Rules for Claude in VS Code when working on the backend (Supabase + Brevo). The project is a view-only digital menu
and customer analytics system (React, Vite, Tailwind CSS, Supabase).
How to work
Only read and edit the files I name in the task.
Always plan first in 5 bullets max, then wait for my OK before editing.
Explain changes in 1 short line each, in simple words.
Ask before installing packages.
No git commands (no commits, no pushes). I handle git myself.
Do not change the design (colors, fonts, Tailwind classes) or page layouts.
This is a view-only digital menu: never add ordering, carts, checkout or order buttons.
Do not edit files in src/testing/AdminRebuild unless I say so. Only exception for now: AdminLogin.jsx and the
logout button on backend/auth-roles .
Secrets (never break these)
The frontend may only use VITE*SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env .
Never put the service_role key, database password or Brevo API key in code, .env , VITE* variables,
comments, logs or commits.
The Brevo key and service*role key are read only inside Supabase Edge Functions with Deno.env.get(...) .
Never print or ask me to paste a secret into chat.
Never commit .env .
Where code goes
Supabase client: src/lib/supabase.js (reuse it, never create a second client).
Data functions: src/backend/services/<name>Service.js . One file per area (menu, events, content, feedback,
auth, audit).
React Query hooks: src/backend/hooks/use<Name>.js . Pages call hooks, never Supabase directly.
Row to page data: src/backend/mappers/<name>Mapper.js .
Tables and security rules: supabase/migrations/<number>*<name>.sql .
Edge Functions: supabase/functions/<name>/index.ts .
Database rules
Every database change is a NEW migration file. Never edit a migration that others already ran.
Reserved numbers: 004 auth, 005 events, 006 content, 007 feedback, 008 audit.
Table and column names are snake_case and match the sample data files ( data/\*MockData.js ).
Turn on Row Level Security for every new table, and write its policies in the same migration.
The public (anon) can only read what the customer site shows. Only active staff can write. Only the owner
manages staff.
Use is_staff() and is_owner() helpers in policies instead of to authenticated using (true) .
Uploaded images go to Storage buckets ( menu-images , site-images ): everyone can read, only staff can upload.
Email and verification (Brevo)
Emails are sent only from Edge Functions, never from the browser.
Verification codes are 6 digits, stored only as a hash, and expire after 10 minutes.
Limit resends to 1 per minute and 5 per hour per email. Lock after 5 wrong tries.
When the right code is entered, set email_verified = true and the status to confirmed , or waitlisted if the
participant type is full.
Errors and data
Services throw errors. Hooks and pages show a friendly message, never a raw error.
Keep sample data files until the real version of that page works. Swap one page at a time.
N
e
v
e
r
d
ele
t
e
r
e
al d
a
t
a in
b
ulk
,
a
n
d
n
e
v
e
r
r
u
n
d
e
s
t
r
u
c
tiv
e
S
Q
L
(
d
r
o
p
,
t
r
u
n
c
a
t
e
,
d
ele
t
e
wit
h
o
u
t
w
h
e
r
e
)
wit
h
o
u
t
a
s
kin
g
m
e
fi
r
s
t.
