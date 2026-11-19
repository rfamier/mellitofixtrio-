import { useEffect, useMemo, useState } from 'react';
import { Award, Trophy, ArrowRight, AlertCircle, Loader2, Timer } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { formatDuration } from '@/lib/supabase';

type ChallengeResultsProps = {
  score: number;
  total: number;
  timeTakenMs: number;
  fullName: string;
  saving: boolean;
  saveError: boolean;
  onLeaderboard: () => void;
};

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CONFETTI_COLORS = ['#C5A66A', '#DFC68F', '#5E94AE', '#94C2D8', '#252B2B'];

export default function ChallengeResults({
  score,
  total,
  timeTakenMs,
  fullName,
  saving,
  saveError,
  onLeaderboard,
}: ChallengeResultsProps) {
  const perfect = score === total;
  const ratio = total > 0 ? score / total : 0;

  const [ring, setRing] = useState(0);
  const [count, setCount] = useState(0);

  // Ring fill + number count-up
  useEffect(() => {
    const startDelay = 350;
    const duration = 1300;
    const timer = window.setTimeout(() => setRing(ratio), startDelay);

    let raf = 0;
    const start = performance.now() + startDelay;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [ratio, score]);

  // Confetti pieces (only used for a perfect score)
  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 120 + Math.random() * 110;
        return {
          x: `${Math.cos(angle) * dist}px`,
          y: `${Math.sin(angle) * dist}px`,
          r: `${Math.random() * 720 - 360}deg`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: 1500 + Math.random() * 200,
          round: i % 3 === 0,
        };
      }),
    []
  );

  return (
    <div className="container-max py-12 lg:py-20">
      <div className="max-w-2xl mx-auto">
        <Reveal direction="scale">
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-7">
              <span className="absolute inset-0 rounded-2xl border border-gold-400 animate-pulse-ring" />
              <div className="relative w-full h-full rounded-2xl bg-ink-900 flex items-center justify-center shadow-lift animate-pop">
                <Award className="w-10 h-10 text-gold-300" strokeWidth={1.75} />
              </div>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink-900 mb-3">
              Challenge Complete
            </h1>
            <p className="text-lg text-ink-600">
              Well done, <span className="text-gold-gradient font-serif">{fullName.split(' ')[0] || 'Participant'}</span>!
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={120}>
          <div className="card relative overflow-hidden p-8 lg:p-12 mb-6 text-center">
            <div aria-hidden className="absolute inset-0 dot-grid mask-fade-b opacity-60 pointer-events-none" />

            {/* Score ring */}
            <div className="relative w-56 h-56 mx-auto">
              <div className="absolute -inset-4 rounded-full border border-dashed border-gold-300 animate-spin-slower" />
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="scoreRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#DFC68F" />
                    <stop offset="100%" stopColor="#8A6B36" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#E9E3D3" strokeWidth="12" />
                <circle
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke="url(#scoreRing)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - ring)}
                  strokeOpacity={ring > 0 ? 1 : 0}
                  style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-serif text-6xl font-semibold text-ink-900 tabular-nums">
                  {count}
                  <span className="text-2xl text-ink-300"> / {total}</span>
                </div>
              </div>

              {perfect &&
                confetti.map((c, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={`absolute left-1/2 top-1/2 w-2 ${c.round ? 'h-2 rounded-full' : 'h-3 rounded-sm'} animate-confetti pointer-events-none`}
                    style={
                      {
                        backgroundColor: c.color,
                        animationDelay: `${c.delay}ms`,
                        '--x': c.x,
                        '--y': c.y,
                        '--r': c.r,
                      } as React.CSSProperties
                    }
                  />
                ))}
            </div>

            <span
              className={`relative inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-8 animate-pop [animation-delay:1.4s] ${
                perfect
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gold-50 text-gold-800 border border-gold-200'
              }`}
            >
              {perfect ? 'Perfect Score' : 'Challenge Score'}
            </span>
            <p className="relative mt-4 inline-flex items-center gap-2 text-sm text-ink-600 animate-pop [animation-delay:1.5s] ml-2">
              <Timer className="w-4 h-4 text-gold-600" />
              Total time <span className="font-semibold text-ink-900 tabular-nums">{formatDuration(timeTakenMs)}</span>
            </p>
            <p className="relative mt-5 text-xs text-ink-400">The challenge can be taken once per participant.</p>
          </div>
        </Reveal>

        {saving && (
          <div className="card p-4 mb-6 flex items-center justify-center gap-2.5 animate-slide-down">
            <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
            <p className="text-sm text-ink-600">Saving your result to the leaderboard...</p>
          </div>
        )}

        {saveError && !saving && (
          <div className="notice-error mb-6">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Could not save your result to the leaderboard, but your score is shown above.
          </div>
        )}

        <Reveal direction="up" delay={240}>
          <div className="flex justify-center">
            <button onClick={onLeaderboard} className="btn-primary group px-8 py-4">
              <Trophy className="w-4 h-4 text-gold-300" />
              View Leaderboard
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
