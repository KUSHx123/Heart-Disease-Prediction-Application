/*
  # Add predictions table and policies

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `input_features` (jsonb)
      - `result` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on predictions table
    - Add policies for authenticated users to:
      - Insert their own predictions
      - Read their own predictions
      - Delete their own predictions
*/

-- Create predictions table if it doesn't exist
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  input_features jsonb NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert own predictions" ON predictions;
  DROP POLICY IF EXISTS "Users can view own predictions" ON predictions;
  DROP POLICY IF EXISTS "Users can delete own predictions" ON predictions;
END $$;

-- Create policies
CREATE POLICY "Users can insert own predictions"
  ON predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions"
  ON predictions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
DROP INDEX IF EXISTS predictions_user_id_created_at_idx;
CREATE INDEX predictions_user_id_created_at_idx 
  ON predictions (user_id, created_at DESC);