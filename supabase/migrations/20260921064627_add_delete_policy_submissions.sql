/*
# Add DELETE policy for submissions table

## Overview
Adds a DELETE policy to the submissions table so that entries can be removed.
This is a no-auth app, so anon + authenticated roles are allowed to delete.

## Security Changes
- New DELETE policy on `submissions` table allowing anon + authenticated to delete any row.
- This is acceptable for a single-tenant public app where all data is intentionally shared.

## Important Notes
1. This enables the admin page to delete submissions.
2. The policy is intentionally permissive because the app has no sign-in screen.
*/

DROP POLICY IF EXISTS "anon_delete_submissions" ON submissions;
CREATE POLICY "anon_delete_submissions" ON submissions FOR DELETE
  TO anon, authenticated USING (true);
