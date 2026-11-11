/*
# Create challenge_questions table + secure submissions DELETE

## Overview
1. Creates a new `challenge_questions` table to store the active challenge question, its options, correct answer, and explanation — editable by admin staff without code changes.
2. Restricts the `submissions` DELETE policy to authenticated users only, so only logged-in admin staff can delete entries. The previous anon DELETE policy is dropped.
3. Seeds an initial challenge question so the app works out of the box.

## New Tables
- `challenge_questions`
  - `id` (uuid, primary key)
  - `question` (text, not null) — the question text
  - `option_a` (text, not null) — first answer option
  - `option_b` (text, not null) — second answer option
  - `option_c` (text, not null) — third answer option
  - `option_d` (text, not null) — fourth answer option
  - `correct_answer` (integer, not null, 0-3) — index of correct option
  - `explanation` (text, not null) — explanation shown after answering
  - `category` (text, not null) — question category label
  - `is_active` (boolean, default true) — only the active question is shown to participants
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Security Changes
- RLS enabled on `challenge_questions`.
- SELECT: anon + authenticated can read (participants need to see the question).
- INSERT/UPDATE/DELETE: authenticated only (admin staff).
- Submissions DELETE policy changed from anon+authenticated to authenticated only.

## Important Notes
1. Only one question should have `is_active = true` at a time.
2. The admin UI ensures this by setting all others to inactive when saving.
3. Initial seed data provides a working question immediately.
*/

-- Create challenge_questions table
CREATE TABLE IF NOT EXISTS challenge_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer integer NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE challenge_questions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read the active question
DROP POLICY IF EXISTS "read_challenge_questions" ON challenge_questions;
CREATE POLICY "read_challenge_questions" ON challenge_questions FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated staff can insert
DROP POLICY IF EXISTS "insert_challenge_questions" ON challenge_questions;
CREATE POLICY "insert_challenge_questions" ON challenge_questions FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only authenticated staff can update
DROP POLICY IF EXISTS "update_challenge_questions" ON challenge_questions;
CREATE POLICY "update_challenge_questions" ON challenge_questions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated staff can delete
DROP POLICY IF EXISTS "delete_challenge_questions" ON challenge_questions;
CREATE POLICY "delete_challenge_questions" ON challenge_questions FOR DELETE
  TO authenticated USING (true);

-- Update updated_at on every update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_challenge_questions_updated_at ON challenge_questions;
CREATE TRIGGER trigger_challenge_questions_updated_at
  BEFORE UPDATE ON challenge_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed an initial active question
INSERT INTO challenge_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, is_active)
SELECT
  'A 58-year-old female with type 2 diabetes has been on metformin 1000 mg BID and empagliflozin 10 mg daily for the past 6 months. Her most recent HbA1c is 8.2%, having not reached her target of <7.0% for approximately 3 months. What is the most appropriate next step in her pharmacologic management?',
  'Add a DPP-4 inhibitor to create a triple oral combination therapy',
  'Discontinue all oral medications and start insulin monotherapy',
  'Increase the metformin dose to 1500 mg BID',
  'Switch empagliflozin to a sulfonylurea',
  0,
  'The patient is uncontrolled on dual therapy (SGLT2i + metformin) and has not reached her A1c target for ~3 months. Adding a DPP-4 inhibitor as a third oral agent is an appropriate escalation to achieve triple combination oral anti-diabetic therapy before considering injectable options.',
  'Pharmacology',
  true
WHERE NOT EXISTS (SELECT 1 FROM challenge_questions WHERE is_active = true);

-- Restrict submissions DELETE to authenticated only
DROP POLICY IF EXISTS "anon_delete_submissions" ON submissions;
CREATE POLICY "authenticated_delete_submissions" ON submissions FOR DELETE
  TO authenticated USING (true);
