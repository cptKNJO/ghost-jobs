DROP TRIGGER IF EXISTS update_job_post_updated_at ON job_posts;

-- 2. Create the trigger on the new table name
CREATE TRIGGER update_job_posts_updated_at
BEFORE UPDATE ON job_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
