/*
# Five-question challenge with takeaways and one attempt per person

## Overview
1. Adds a `takeaway` note to every challenge question. It is shown to participants under the correct answer.
2. Changes the meaning of `is_active` on `challenge_questions`: every active question now belongs to the challenge. The challenge uses the first five active questions, oldest first.
3. Prevents a person from taking the challenge more than once. Emails are unique on submissions (case-insensitive), and a function lets the form check beforehand whether an email already has a result.
4. Seeds five challenge questions with takeaways if they are not already present.

## Modified Tables
- `challenge_questions`
  - New column `takeaway` (text, default empty string).
- `submissions`
  - New unique index on the lower-cased `email`.

## New Functions
- `challenge_already_taken(p_email text)` returns true when a submission already exists for that email. It runs with owner rights so visitors never read the submissions table directly.

## Security Changes
- `challenge_already_taken` is executable only by the anon and authenticated roles. It is not granted to PUBLIC.
- No existing policies are changed.

## Important Notes
1. Seeding uses the question text as its identity, so re-running this migration never duplicates questions.
2. Existing rows are never deleted or altered except for filling an empty takeaway on the first seeded question.
*/

ALTER TABLE challenge_questions ADD COLUMN IF NOT EXISTS takeaway text NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS submissions_email_unique ON submissions (lower(email));

CREATE OR REPLACE FUNCTION challenge_already_taken(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM submissions WHERE lower(email) = lower(trim(p_email))
  );
$$;

REVOKE EXECUTE ON FUNCTION challenge_already_taken(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION challenge_already_taken(text) TO anon, authenticated;

UPDATE challenge_questions
SET takeaway = 'When a patient stays above target on dual oral therapy, add a third oral agent before moving to injectables. Mellitofix Trio combines empagliflozin, linagliptin, and metformin XR in one daily pill.'
WHERE question LIKE 'A 58-year-old female with type 2 diabetes%' AND takeaway = '';

WITH seed (question, option_a, option_b, option_c, option_d, correct_answer, explanation, takeaway, category) AS (
  VALUES
  (
    'A 58-year-old female with type 2 diabetes has been on metformin 1000 mg BID and empagliflozin 10 mg daily for the past 6 months. Her most recent HbA1c is 8.2%, having not reached her target of <7.0% for approximately 3 months. What is the most appropriate next step in her pharmacologic management?',
    'Add a DPP-4 inhibitor to create a triple oral combination therapy',
    'Discontinue all oral medications and start insulin monotherapy',
    'Increase the metformin dose to 1500 mg BID',
    'Switch empagliflozin to a sulfonylurea',
    0,
    'The patient is uncontrolled on dual therapy (SGLT2i + metformin) and has not reached her A1c target for ~3 months. Adding a DPP-4 inhibitor as a third oral agent is an appropriate escalation to achieve triple combination oral anti-diabetic therapy before considering injectable options.',
    'When a patient stays above target on dual oral therapy, add a third oral agent before moving to injectables. Mellitofix Trio combines empagliflozin, linagliptin, and metformin XR in one daily pill.',
    'Pharmacology'
  ),
  (
    'A 62-year-old male with type 2 diabetes is on metformin 1000 mg BID and sitagliptin 100 mg daily. His HbA1c remains at 8.0% after 3 months, well above his target of <7.0%. Which class of oral anti-diabetic drugs would be most appropriate to add as a third agent?',
    'SGLT2 inhibitor (e.g., empagliflozin or canagliflozin)',
    'Alpha-glucosidase inhibitor (e.g., acarbose)',
    'Bile acid sequestrant (e.g., colesevelam)',
    'Dopamine-2 agonist (e.g., bromocriptine)',
    0,
    'An SGLT2 inhibitor is the most appropriate third agent for a patient uncontrolled on DPP-4i + metformin dual therapy. SGLT2 inhibitors offer robust A1c reduction, cardiovascular and renal benefits, and are well-suited for triple combination oral therapy.',
    'An SGLT2 inhibitor is a strong third agent with added cardiovascular and kidney benefits. Empagliflozin is the SGLT2 inhibitor found in the Mellitofix range.',
    'Pharmacology'
  ),
  (
    'What is the general HbA1c target recommended for most non-pregnant adults with type 2 diabetes according to ADA guidelines?',
    '< 6.0%',
    '< 7.0%',
    '< 8.0%',
    '< 9.0%',
    1,
    'The ADA recommends a general HbA1c target of <7.0% for most non-pregnant adults. Targets may be individualized based on age, comorbidities, and hypoglycemia risk.',
    'The general ADA target is below 7.0% for most non-pregnant adults. Individualize it for age, comorbidities, and hypoglycemia risk.',
    'Clinical Targets'
  ),
  (
    'Which of the following is the primary mechanism of action of metformin?',
    'Stimulates insulin secretion from pancreatic beta cells',
    'Reduces hepatic glucose production and improves insulin sensitivity',
    'Inhibits SGLT2 in the proximal tubule to reduce glucose reabsorption',
    'Slows carbohydrate absorption in the intestine',
    1,
    'Metformin primarily reduces hepatic gluconeogenesis and improves peripheral insulin sensitivity. It does not stimulate insulin secretion, making it unlikely to cause hypoglycemia when used alone.',
    'Metformin lowers liver glucose output and improves insulin sensitivity without stimulating insulin, so it rarely causes low blood sugar on its own. Mellitofix Met pairs it with empagliflozin.',
    'Pharmacology'
  ),
  (
    'SGLT2 inhibitors reduce blood glucose by which mechanism?',
    'Increasing insulin secretion from pancreatic beta cells',
    'Inhibiting glucose reabsorption in the proximal renal tubule',
    'Reducing intestinal glucose absorption',
    'Enhancing peripheral tissue insulin sensitivity',
    1,
    'SGLT2 inhibitors block the sodium-glucose cotransporter 2 in the proximal renal tubule, preventing glucose reabsorption and promoting glucosuria, which lowers blood glucose levels independently of insulin.',
    'SGLT2 inhibitors lower glucose by letting the kidneys excrete it, independent of insulin, and they also offer cardiovascular benefits.',
    'Pharmacology'
  )
)
INSERT INTO challenge_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, takeaway, category, is_active)
SELECT s.question, s.option_a, s.option_b, s.option_c, s.option_d, s.correct_answer, s.explanation, s.takeaway, s.category, true
FROM seed s
WHERE NOT EXISTS (SELECT 1 FROM challenge_questions c WHERE c.question = s.question);
