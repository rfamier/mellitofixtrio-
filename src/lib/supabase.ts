import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Types ----

export type Submission = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  clinic_address: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  full_name: string;
  clinic_address: string;
  score: number;
  total_questions: number;
  created_at: string;
  rank: number;
};

export type SubmissionInput = {
  full_name: string;
  email: string;
  phone: string;
  clinic_address: string;
  score: number;
  total_questions: number;
};

export type ChallengeQuestionData = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation: string;
  takeaway: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ChallengeQuestionInput = {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation: string;
  takeaway: string;
  category: string;
};

export const CHALLENGE_QUESTION_COUNT = 5;

// ---- Auth ----

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign in failed:', error.message);
    return false;
  }
  return true;
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ---- Submissions ----

export async function insertSubmission(input: SubmissionInput): Promise<Submission | null> {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      clinic_address: input.clinic_address,
      score: input.score,
      total_questions: input.total_questions,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save submission:', error.message);
    return null;
  }

  return data as Submission;
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('id, full_name, clinic_address, score, total_questions, created_at')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch leaderboard:', error.message);
    return [];
  }

  return (data || []).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  })) as LeaderboardEntry[];
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('id, full_name, email, phone, clinic_address, score, total_questions, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch submissions:', error.message);
    return [];
  }

  return (data || []) as Submission[];
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const { error } = await supabase.from('submissions').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete submission:', error.message);
    return false;
  }
  return true;
}

export async function resetLeaderboard(): Promise<boolean> {
  const { error } = await supabase.from('submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    console.error('Failed to reset leaderboard:', error.message);
    return false;
  }
  return true;
}

// ---- Challenge Questions ----

export async function getChallengeQuestions(): Promise<ChallengeQuestionData[]> {
  const { data, error } = await supabase
    .from('challenge_questions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(CHALLENGE_QUESTION_COUNT);

  if (error) {
    console.error('Failed to fetch challenge questions:', error.message);
    return [];
  }

  return (data || []) as ChallengeQuestionData[];
}

export async function challengeAlreadyTaken(email: string): Promise<boolean | null> {
  const { data, error } = await supabase.rpc('challenge_already_taken', { p_email: email });

  if (error || typeof data !== 'boolean') {
    console.error('Failed to check challenge attempt:', error?.message);
    return null;
  }

  return data;
}

export async function getAllQuestions(): Promise<ChallengeQuestionData[]> {
  const { data, error } = await supabase
    .from('challenge_questions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch questions:', error.message);
    return [];
  }

  return (data || []) as ChallengeQuestionData[];
}

export async function createQuestion(input: ChallengeQuestionInput): Promise<ChallengeQuestionData | null> {
  const { data, error } = await supabase
    .from('challenge_questions')
    .insert({
      question: input.question,
      option_a: input.option_a,
      option_b: input.option_b,
      option_c: input.option_c,
      option_d: input.option_d,
      correct_answer: input.correct_answer,
      explanation: input.explanation,
      takeaway: input.takeaway,
      category: input.category,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create question:', error.message);
    return null;
  }

  return data as ChallengeQuestionData;
}

export async function updateQuestion(id: string, input: ChallengeQuestionInput): Promise<ChallengeQuestionData | null> {
  const { data, error } = await supabase
    .from('challenge_questions')
    .update({
      question: input.question,
      option_a: input.option_a,
      option_b: input.option_b,
      option_c: input.option_c,
      option_d: input.option_d,
      correct_answer: input.correct_answer,
      explanation: input.explanation,
      takeaway: input.takeaway,
      category: input.category,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update question:', error.message);
    return null;
  }

  return data as ChallengeQuestionData;
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const { error } = await supabase.from('challenge_questions').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete question:', error.message);
    return false;
  }
  return true;
}

export async function setQuestionInChallenge(id: string, included: boolean): Promise<boolean> {
  const { error } = await supabase.from('challenge_questions').update({ is_active: included }).eq('id', id);
  if (error) {
    console.error('Failed to update challenge membership:', error.message);
    return false;
  }
  return true;
}

// ---- CSV Export ----

export function exportToCSV(submissions: Submission[]): void {
  const headers = ['Name', 'Email', 'Phone', 'Clinic Address', 'Score', 'Total Questions', 'Date'];
  const rows = submissions.map((s) => [
    s.full_name,
    s.email,
    s.phone,
    s.clinic_address,
    String(s.score),
    String(s.total_questions),
    new Date(s.created_at).toLocaleString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leaderboard-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
