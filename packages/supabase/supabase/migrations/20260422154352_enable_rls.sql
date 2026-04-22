-- statuses
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;

-- companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_select_all_signed_in ON public.companies;
CREATE POLICY companies_select_all_signed_in
ON public.companies
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS companies_insert_all_signed_in ON public.companies;
CREATE POLICY companies_insert_all_signed_in
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- sources
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sources_select_all_signed_in ON public.sources;
CREATE POLICY sources_select_all_signed_in
ON public.sources
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS sources_insert_all_signed_in ON public.sources;
CREATE POLICY sources_insert_all_signed_in
ON public.sources
FOR INSERT
TO authenticated
WITH CHECK (true);

-- skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skills_select_all_signed_in ON public.skills;
CREATE POLICY skills_select_all_signed_in
ON public.skills
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS skills_insert_all_signed_in ON public.skills;
CREATE POLICY skills_insert_all_signed_in
ON public.skills
FOR INSERT
TO authenticated
WITH CHECK (true);

-- job_posts
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- INSERT: only authenticated users
DROP POLICY IF EXISTS job_posts_insert_authenticated ON public.job_posts;
CREATE POLICY job_posts_insert_authenticated
ON public.job_posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- SELECT: only if the authenticated user's profile.id matches job_post.profile_id
DROP POLICY IF EXISTS job_posts_select_own ON public.job_posts;
CREATE POLICY job_posts_select_own
ON public.job_posts
FOR SELECT
TO authenticated
USING (
  public.job_posts.profile_id = (
    SELECT public.profiles.id
    FROM public.profiles
    WHERE public.profiles.user_id = auth.uid()
  )
);

-- UPDATE: only if the authenticated user's profile.id matches job_post.profile_id
DROP POLICY IF EXISTS job_posts_update_own ON public.job_posts;
CREATE POLICY job_posts_update_own
ON public.job_posts
FOR UPDATE
TO authenticated
USING (
  public.job_posts.profile_id = (
    SELECT public.profiles.id
    FROM public.profiles
    WHERE public.profiles.user_id = auth.uid()
  )
)
WITH CHECK (
  public.job_posts.profile_id = (
    SELECT public.profiles.id
    FROM public.profiles
    WHERE public.profiles.user_id = auth.uid()
  )
);

-- DELETE: only if the authenticated user's profile.id matches job_post.profile_id
DROP POLICY IF EXISTS job_posts_delete_own ON public.job_posts;
CREATE POLICY job_posts_delete_own
ON public.job_posts
FOR DELETE
TO authenticated
USING (
  public.job_posts.profile_id = (
    SELECT public.profiles.id
    FROM public.profiles
    WHERE public.profiles.user_id = auth.uid()
  )
);

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT (view own profile)
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
);

-- UPDATE (update own profile)
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
)
WITH CHECK (
  user_id = (SELECT auth.uid())
);

-- DELETE (delete own profile)
DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;
CREATE POLICY profiles_delete_own
ON public.profiles
FOR DELETE
TO authenticated
USING (
  user_id = (SELECT auth.uid())
);

-- enable auto-RLS for new tables
CREATE OR REPLACE FUNCTION rls_auto_enable()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls;
CREATE EVENT TRIGGER ensure_rls
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
EXECUTE FUNCTION rls_auto_enable();
