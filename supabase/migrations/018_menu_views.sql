-- Customers can add one view to an available menu item. Nothing else.
create or replace function public.record_menu_item_view(p_item_id bigint)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.menu_items
  set view_count = coalesce(view_count, 0) + 1
  where id = p_item_id and is_available and not is_archived;
$$;

revoke all on function public.record_menu_item_view(bigint) from public;
grant execute on function public.record_menu_item_view(bigint) to anon, authenticated;