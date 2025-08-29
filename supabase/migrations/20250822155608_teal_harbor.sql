/*
  # Create uploads table for ML models and datasets

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key)
      - `file_name` (text, not null)
      - `file_type` (text, check constraint for 'model' or 'dataset')
      - `bucket` (text, not null)
      - `size` (bigint, not null)
      - `uploaded_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `uploads` table
    - Add policy for public read access (no auth required)
    - Add policy for public insert access (no auth required)
    - Add policy for public delete access (no auth required)
*/

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('model', 'dataset')),
  bucket text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON uploads
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access"
  ON uploads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access"
  ON uploads
  FOR DELETE
  TO public
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_uploads_file_type ON uploads(file_type);
CREATE INDEX IF NOT EXISTS idx_uploads_uploaded_at ON uploads(uploaded_at DESC);