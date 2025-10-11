-- Add options column to tasks table for optional multiple-choice
ALTER TABLE tasks
ADD COLUMN options TEXT[];

-- Create index for better query performance when filtering by options
CREATE INDEX IF NOT EXISTS idx_tasks_options ON tasks USING GIN(options);

-- Add comment explaining the column
COMMENT ON COLUMN tasks.options IS 'Optional array of predefined choices for the specialized model to select from';
