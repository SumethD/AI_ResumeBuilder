/*
  # Resumes Schema

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_active` (boolean)
      - `analysis_score` (integer)

  2. Security
    - Enable RLS on `resumes` table
    - Add policies for:
      - Users can CRUD their own resumes
      - Users cannot access other users' resumes
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  analysis_score integer DEFAULT 0,
  
  CONSTRAINT valid_score CHECK (analysis_score >= 0 AND analysis_score <= 100)
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle resume updates
CREATE OR REPLACE FUNCTION handle_resume_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating the updated_at timestamp
CREATE TRIGGER update_resumes_timestamp
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION handle_resume_update();

-- Function to update resume count in profiles
CREATE OR REPLACE FUNCTION update_resume_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET resume_count = resume_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET resume_count = resume_count - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for maintaining resume count
CREATE TRIGGER on_resume_created
  AFTER INSERT ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_count();

CREATE TRIGGER on_resume_deleted
  AFTER DELETE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_count();