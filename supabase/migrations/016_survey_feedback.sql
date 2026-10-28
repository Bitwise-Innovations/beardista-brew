alter table public.survey_responses
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_archived boolean not null default false;

create index if not exists survey_responses_feed_idx
  on public.survey_responses (is_archived, created_at desc);

drop policy if exists "survey responses public read featured" on public.survey_responses;
create policy "survey responses public read featured" on public.survey_responses
  for select to anon, authenticated
  using (is_featured and not is_archived);

drop trigger if exists audit_survey_responses on public.survey_responses;
create trigger audit_survey_responses
  after update or delete on public.survey_responses
  for each row execute function public.write_audit_log();