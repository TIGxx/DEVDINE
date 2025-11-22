-- Fix RLS policies for queue_counter table to allow system operations
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to queue_counter" ON queue_counter;
DROP POLICY IF EXISTS "Allow public insert access to queue_counter" ON queue_counter;
DROP POLICY IF EXISTS "Allow public update access to queue_counter" ON queue_counter;

-- Create permissive policies for queue_counter (system table)
CREATE POLICY "Allow public read access to queue_counter"
ON queue_counter FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to queue_counter"
ON queue_counter FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to queue_counter"
ON queue_counter FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Ensure the initial row exists
INSERT INTO queue_counter (id, current_number, last_reset_date)
VALUES (1, 0, CURRENT_DATE)
ON CONFLICT (id) DO UPDATE
SET current_number = EXCLUDED.current_number,
    last_reset_date = EXCLUDED.last_reset_date;
