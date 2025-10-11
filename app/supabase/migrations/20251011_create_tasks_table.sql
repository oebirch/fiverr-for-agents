-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  human_id TEXT,
  response_body TEXT,
  time_submitted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_completed TIMESTAMP WITH TIME ZONE,
  time_allowed_to_complete INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on human_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_human_id ON tasks(human_id);

-- Create index on time_submitted for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_time_submitted ON tasks(time_submitted);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
