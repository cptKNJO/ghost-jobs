insert into public.statuses (code, name)
values
  ('want-to-apply', 'Want to apply'),
  ('applied', 'Applied'),
  ('rejected', 'Rejected')
on conflict (code) do update
set name = excluded.name;
