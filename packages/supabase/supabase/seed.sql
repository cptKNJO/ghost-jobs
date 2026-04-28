insert into public.statuses (code, name)
values
  ('want-to-apply', 'Want to apply'),
  ('applied', 'Applied'),
  ('rejected', 'Rejected')
on conflict (code) do update
set name = excluded.name;

insert into public.pricing_plans (name, features, interval, currency, amount, hard_limit, billing_provider, provider_price_base_id, provider_price_metered_id)
values
  ('free', '["50 jobs per month", "Basic job tracking"]', 'month', 'usd', 0, 50, 'stripe', null, null),
  ('human', '["100 jobs per month", "Special ''I am human'' label", "7-day trial"]', 'month', 'usd', 200, 400, 'stripe', 'price_1TR8zBKKEkmOtrFM3sEyWis4', 'price_1TR8zBKKEkmOtrFMhKGaoPRR'),
  ('robot', '["500 jobs per month", "Special ''I am robot'' label", "7-day trial"]', 'month', 'usd', 500, 800, 'stripe', 'price_1TR90jKKEkmOtrFMgE8M6i1o', 'price_1TR90jKKEkmOtrFM9YYSlVkW')
on conflict (name) do update
set
  features = excluded.features,
  amount = excluded.amount,
  hard_limit = excluded.hard_limit,
  provider_price_base_id = excluded.provider_price_base_id,
  provider_price_metered_id = excluded.provider_price_metered_id;
