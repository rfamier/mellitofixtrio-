import { useState, useEffect, useCallback } from 'react';
import {
  getChallengeQuestions,
  challengeAlreadyTaken,
  insertSubmission,
  type ChallengeQuestionData,
} from '@/lib/supabase';
import type { PageId } from '@/types/router';
import ParticipantForm, {
  type ParticipantFormData,
  type ParticipantFormErrors,
  type FormNotice,
} from '@/components/challenge/ParticipantForm';
import ChallengeQuestion from '@/components/challenge/ChallengeQuestion';
import ChallengeResults from '@/components/challenge/ChallengeResults';

type ChallengePhase = 'form' | 'quiz' | 'results';

type ChallengePageProps = {
  onNavigate: (page: PageId) => void;
};

const EMPTY_FORM: ParticipantFormData = {
  fullName: '',
  email: '',
  phone: '',
  clinicAddress: '',
};

export default function ChallengePage({ onNavigate }: ChallengePageProps) {
  const [phase, setPhase] = useState<ChallengePhase>('form');
  const [formData, setFormData] = useState<ParticipantFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ParticipantFormErrors>({});
  const [notice, setNotice] = useState<FormNotice>(null);

  const [questions, setQuestions] = useState<ChallengeQuestionData[]>([]);
  const [questionsStatus, setQuestionsStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [checking, setChecking] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setQuestionsStatus('loading');
      const data = await getChallengeQuestions();
      if (cancelled) return;
      if (data.length > 0) {
        setQuestions(data);
        setQuestionsStatus('ready');
      } else {
        setQuestionsStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const validateForm = (): boolean => {
    const next: ParticipantFormErrors = {};
    if (!formData.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!formData.email.trim()) {
      next.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) next.phone = 'Please enter your phone number.';
    if (!formData.clinicAddress.trim()) next.clinicAddress = 'Please enter your clinic address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (questionsStatus !== 'ready') return;

    setChecking(true);
    setNotice(null);
    const taken = await challengeAlreadyTaken(formData.email.trim().toLowerCase());
    setChecking(false);

    if (taken === null) {
      setNotice('check_failed');
      return;
    }
    if (taken) {
      setNotice('taken');
      return;
    }

    setPhase('quiz');
  };

  const handleNext = useCallback(
    (selectedAnswer: number) => {
      const updatedAnswers = [...answers, selectedAnswer];
      setAnswers(updatedAnswers);

      if (selectedAnswer === questions[currentIndex].correct_answer) {
        setScore((s) => s + 1);
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        const finalScore =
          updatedAnswers.reduce(
            (acc, ans, i) => acc + (ans === questions[i].correct_answer ? 1 : 0),
            0,
          );
        setScore(finalScore);
        setPhase('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setSaving(true);
        setSaveError(false);
        insertSubmission({
          full_name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          clinic_address: formData.clinicAddress.trim(),
          score: finalScore,
          total_questions: questions.length,
        }).then((ok) => {
          setSaving(false);
          if (!ok) setSaveError(true);
        });
      }
    },
    [answers, currentIndex, questions, formData],
  );

  if (phase === 'form') {
    return (
      <ParticipantForm
        formData={formData}
        errors={errors}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onBack={() => onNavigate('home')}
        questionsStatus={questionsStatus}
        checking={checking}
        notice={notice}
      />
    );
  }

  if (phase === 'quiz' && questions.length > 0) {
    return (
      <ChallengeQuestion
        key={currentIndex}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        onNext={handleNext}
      />
    );
  }

  return (
    <ChallengeResults
      score={score}
      total={questions.length}
      fullName={formData.fullName}
      saving={saving}
      saveError={saveError}
      onLeaderboard={() => onNavigate('leaderboard')}
    />
  );
}
