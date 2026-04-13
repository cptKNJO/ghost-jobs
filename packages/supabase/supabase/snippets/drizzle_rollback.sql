EXPLAIN DELETE FROM drizzle.__drizzle_migrations
WHERE id = (
  SELECT id 
  FROM drizzle.__drizzle_migrations 
  ORDER BY created_at DESC 
  LIMIT 1
);