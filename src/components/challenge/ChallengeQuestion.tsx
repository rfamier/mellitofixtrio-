import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Timer } from 'lucide-react';
import { QUESTION_TIME_SECONDS, type ChallengeQuestionData } from '@/lib/supabase';

type ChallengeQuestionProps = {
  question: ChallengeQuestionData;
  index: number;
  total: number;
  /** selectedAnswer is -1 when time ran out without an answer; timeMs = time spent before submitting */
  onNext: (selectedAnswer: number, timeMs: number) => void;
};

const letter = (i: number) => String.fromCharCode(65 + i);
const LIMIT_MS = QUESTION_TIME_SECONDS * 1000;

const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

export default function ChallengeQuestion({ question, index, total, onNext }: ChallengeQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [remainingMs, setRemainingMs] = useState(LIMIT_MS);
  const [spentMs, setSpentMs] = useState<number | null>(null);
  const startRef = useRef<number>(performance.now());

  const options = [question.option_a, question.option_b, question.option_c, question.option_d];
  const isLast = index === total - 1;
  const correct = question.correct_answer;

  // Countdown — stops as soon as the answer is revealed
  useEffect(() => {
    if (revealed) return;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      const left = Math.max(0, LIMIT_MS - elapsed);
      setRemainingMs(left);
      if (left <= 0) {
        window.clearInterval(id);
        setSelected(null); // unanswered when time runs out
        setTimedOut(true);
        setSpentMs(LIMIT_MS);
        setRevealed(true);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [revealed]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSpentMs(Math.min(LIMIT_MS, performance.now() - startRef.current));
    setRevealed(true);
  };

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const urgent = !revealed && secondsLeft <= 10;
  const warning = !revealed && secondsLeft <= 20 && !urgent;

  const optionClass = (i: number): string => {
    if (!revealed) {
      return selected === i
        ? 'border-ink-900 bg-cream-50 shadow-lift -translate-y-0.5'
        : 'border-cream-300 bg-white hover:border-gold-400 hover:bg-cream-50 hover:-translate-y-0.5 hover:shadow-soft';
    }
    if (i === correct) return 'border-green-500 bg-green-50';
    if (i === selected) return 'border-red-400 bg-red-50 animate-shake';
    return 'border-cream-200 bg-white opacity-50';
  };

  const letterClass = (i: number): string => {
    if (revealed && i === correct) return 'bg-green-500 border-green-500 text-white animate-pop';
    if (revealed && i === selected) return 'bg-red-500 border-red-500 text-white';
    if (selected === i) return 'bg-ink-900 border-ink-900 text-gold-300';
    return 'bg-cream-50 border-cream-300 text-ink-500 group-hover:border-gold-400 group-hover:text-gold-700';
  };

  return (
    <div className="container-max py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-3">
          <div className="flex items-end gap-3">
            <p className="text-sm font-medium text-ink-500">
              Question{' '}
              <span className="font-serif text-2xl font-semibold text-ink-900 tabular-nums">{index + 1}</span>{' '}
              of {total}
            </p>
            {question.category && <span className="eyebrow hidden sm:inline-flex">{question.category}</span>}
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-colors duration-300 ${
              revealed
                ? 'bg-cream-50 border-cream-300 text-ink-400'
                : urgent
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                : warning
                ? 'bg-gold-50 border-gold-300 text-gold-800'
                : 'bg-white border-cream-300 text-ink-800'
            }`}
            role="timer"
            aria-live="off"
            aria-label={`${secondsLeft} seconds left`}
          >
            <span className="relative w-11 h-11 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="24" cy="24" r={RING_R} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r={RING_R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - remainingMs / LIMIT_MS)}
                  style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                />
              </svg>
              <Timer className="w-4 h-4" />
            </span>
            <span className="font-serif text-xl font-semibold tabular-nums">
              0:{String(secondsLeft).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Segmented progress */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-cream-300/80 overflow-hidden">
              {i < index && <div className="h-full w-full rounded-full bg-ink-900" />}
              {i === index && (
                <div className="h-full w-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 origin-left animate-grow-x" />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card relative overflow-hidden p-5 sm:p-6 lg:p-7 animate-slide-up">
          <span
            aria-hidden
            className="absolute top-2 right-5 font-serif italic text-[5rem] leading-none text-cream-200 select-none pointer-events-none"
          >
            {index + 1}
          </span>

          <h2 className="relative font-serif text-lg lg:text-xl font-medium text-ink-900 mb-5 pr-10 leading-relaxed whitespace-pre-line">
            {question.question}
          </h2>

          {/* Options */}
          <div className="relative space-y-2.5">
            {options.map((option, i) => (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={`group w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out animate-slide-up [animation-fill-mode:backwards] disabled:cursor-default ${optionClass(i)}`}
                style={{ animationDelay: `${120 + i * 70}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-colors duration-300 ${letterClass(i)}`}
                  >
                    {letter(i)}
                  </span>
                  <span className="text-sm text-ink-900 leading-relaxed">{option}</span>
                  {revealed && i === correct && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0 animate-pop" />
                  )}
                  {revealed && i === selected && i !== correct && (
                    <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0 animate-pop" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Time's up */}
          {timedOut && (
            <div className="relative mt-5 flex items-center gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 animate-slide-down">
              <Timer className="w-4 h-4 flex-shrink-0" />
              Time's up! This question was not answered.
            </div>
          )}

          {/* Takeaway */}
          {revealed && question.takeaway.trim() && (
            <div className="relative mt-5 overflow-hidden rounded-xl border border-gold-200 bg-gradient-to-br from-gold-50 to-cream-50 p-4 pl-5 animate-slide-up">
              <span className="absolute left-0 inset-y-0 w-1 bg-gold-500" />
              <div className="flex items-start gap-3.5">
                <span className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0 animate-pop [animation-delay:150ms]">
                  <Lightbulb className="w-[18px] h-[18px] text-gold-700" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-800 mb-1.5">Takeaway</p>
                  <p className="text-sm text-ink-800 leading-relaxed">{question.takeaway}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative mt-6 flex justify-end">
            {!revealed ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => onNext(selected ?? -1, spentMs ?? LIMIT_MS)}
                className="btn-primary group animate-pop"
              >
                {isLast ? 'See Results' : 'Next Question'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
