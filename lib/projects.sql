-- Migration to add SAP-specific columns to existing projects table
-- Run these commands in your Supabase SQL editor

-- Add SAP-specific columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS members integer default 1;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());

-- Update creator_id reference to match auth.users instead of profiles
-- First, we need to change the foreign key reference
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_creator_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_creator_id_fkey
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

-- Create policies
CREATE POLICY "Users can view all projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for project_members table
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them for project_members
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Users can join projects" ON project_members;
DROP POLICY IF EXISTS "Users can leave projects they joined" ON project_members;

-- Create policies for project_members
CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join projects"
  ON project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave projects they joined"
  ON project_members FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS projects_creator_id_idx ON projects(creator_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects(category);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS project_members_project_id_idx ON project_members(project_id);
CREATE INDEX IF NOT EXISTS project_members_user_id_idx ON project_members(user_id);
