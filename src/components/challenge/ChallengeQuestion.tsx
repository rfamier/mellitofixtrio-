import { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import type { ChallengeQuestionData } from '@/lib/supabase';

type ChallengeQuestionProps = {
  question: ChallengeQuestionData;
  index: number;
  total: number;
  onNext: (selectedAnswer: number) => void;
};

const letter = (i: number) => String.fromCharCode(65 + i);

export default function ChallengeQuestion({ question, index, total, onNext }: ChallengeQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const options = [question.option_a, question.option_b, question.option_c, question.option_d];
  const isLast = index === total - 1;
  const correct = question.correct_answer;

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
          <p className="text-sm font-medium text-ink-500">
            Question{' '}
            <span className="font-serif text-2xl font-semibold text-ink-900 tabular-nums">{index + 1}</span>{' '}
            of {total}
          </p>
          {question.category && <span className="eyebrow">{question.category}</span>}
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
          {/* big faint number */}
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
                onClick={() => setRevealed(true)}
                disabled={selected === null}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={() => onNext(selected as number)} className="btn-primary group animate-pop">
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
