-- Migration to add missing columns to existing profiles table
-- Run these commands in your Supabase SQL editor

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achievements text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy text DEFAULT 'public';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications jsonb DEFAULT '{"email": true, "push": true, "marketing": false}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
