-- Create profile when user is created function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_display_name text;
begin
  v_display_name :=
    lower(
        coalesce(
            new.raw_user_meta_data->>'display_name',
            new.email,
            'user'
        )
    );

  insert into public.profiles (user_id, display_name)
  values (new.id, v_display_name);

  return new;
end;
$$;

-- trigger
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
