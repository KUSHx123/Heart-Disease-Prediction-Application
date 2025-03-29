/*
  # Add City and Country Columns to Profiles Table

  1. Changes
    - Add `city` column to profiles table
    - Add `country` column to profiles table
    - Add `mobile_number` column to profiles table
    - Add `gender` column to profiles table

  2. Notes
    - All columns are nullable to maintain backward compatibility
    - Using text type for flexibility with different formats
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS mobile_number text,
ADD COLUMN IF NOT EXISTS gender text;

-- Add comment to explain columns
COMMENT ON COLUMN profiles.city IS 'User''s city of residence';
COMMENT ON COLUMN profiles.country IS 'User''s country of residence';
COMMENT ON COLUMN profiles.mobile_number IS 'User''s mobile phone number';
COMMENT ON COLUMN profiles.gender IS 'User''s gender (male, female, other)';