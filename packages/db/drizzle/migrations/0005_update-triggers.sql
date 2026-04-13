DROP TRIGGER IF EXISTS update_status_updated_at ON statuses;

-- 2. Create the trigger on the new table name
CREATE TRIGGER update_statuses_updated_at
BEFORE UPDATE ON statuses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Repeat for 'companies'
DROP TRIGGER IF EXISTS update_company_updated_at ON companies;

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
