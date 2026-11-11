/*
# Create submissions table for World Diabetes Day Clinical Challenge

## Overview
This migration creates a single table to store challenge submissions from participants.
Each submission records the participant's personal information and their quiz score.

## New Tables
- `submissions`
  - `id` (uuid, primary key, auto-generated)
  - `full_name` (text, not null) — participant's full name
  - `email` (text, not null) — participant's email address
  - `phone` (text, not null) — participant's phone number
  - `clinic_address` (text, not null) — participant's clinic address
  - `score` (integer, not null) — number of correct answers
  - `total_questions` (integer, not null) — total questions answered
  - `created_at` (timestamptz, default now()) — submission timestamp

## Security
- Row Level Security enabled on `submissions`.
- This is a no-auth app (no sign-in screen), so policies allow anon + authenticated to:
  - SELECT: anyone can read leaderboard data
  - INSERT: anyone can submit a new challenge result
- No UPDATE or DELETE policies — submissions are immutable once created.

## Important Notes
1. This is a single-tenant public app — no user_id column, no auth dependency.
2. The leaderboard is derived from this table by ordering submissions by score descending.
3. All fields are required (NOT NULL) to ensure complete submissions.
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  clinic_address text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read submissions (for the leaderboard)
DROP POLICY IF EXISTS "anon_select_submissions" ON submissions;
CREATE POLICY "anon_select_submissions" ON submissions FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anyone to insert a new submission (for challenge completion)
DROP POLICY IF EXISTS "anon_insert_submissions" ON submissions;
CREATE POLICY "anon_insert_submissions" ON submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create an index for leaderboard queries (ordered by score desc)
CREATE INDEX IF NOT EXISTS idx_submissions_score_desc ON submissions (score DESC);

-- Create an index for filtering by created_at (most recent first)
CREATE INDEX IF NOT EXISTS idx_submissions_created_at_desc ON submissions (created_at DESC);
