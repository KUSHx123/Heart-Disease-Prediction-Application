/*
  # Add Login Activity and User Preferences Tables

  1. New Tables
    - `login_activity`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `device_type` (text)
      - `browser` (text)
      - `location` (text)
      - `ip_address` (text)
      - `timestamp` (timestamptz)
      - `is_current_session` (boolean)

  2. Updates to Profiles Table
    - Add `social_links` column (jsonb)
    - Add `preferences` column (jsonb)

  3. Security
    - Enable RLS on login_activity table
    - Add policies for authenticated users
*/

-- Create login_activity table
CREATE TABLE IF NOT EXISTS login_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  device_type text NOT NULL,
  browser text NOT NULL,
  location text NOT NULL,
  ip_address text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_current_session boolean DEFAULT false
);

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{
  "visibility": {
    "profileVisibility": "private",
    "activityHistory": true,
    "lastSeen": true
  },
  "notifications": {
    "marketing": true,
    "securityAlerts": true,
    "updates": true,
    "appointments": true,
    "predictions": true
  }
}'::jsonb;

-- Enable RLS on login_activity
ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for login_activity
CREATE POLICY "Users can view own login activity"
  ON login_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login activity"
  ON login_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_login_activity_user_timestamp 
  ON login_activity (user_id, timestamp DESC);