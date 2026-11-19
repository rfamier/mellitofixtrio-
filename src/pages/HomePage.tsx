import {
  Brain,
  Trophy,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Award,
  Stethoscope,
  Ribbon,
} from 'lucide-react';
import type { PageId } from '@/types/router';
import Reveal from '@/components/Reveal';
import { useInView } from '@/hooks/useInView';

type HomePageProps = {
  onNavigate: (page: PageId) => void;
};

const steps = [
  {
    icon: ClipboardList,
    title: 'Register',
    // description: 'Fill in your personal and clinic information to get started.',
  },
  {
    icon: Brain,
    title: 'Answer Questions',
    // description: 'Respond to randomized clinical questions from our diabetes dataset.',
  },
  {
    icon: CheckCircle2,
    title: 'See Your Score',
    // description: 'Get instant feedback with explanations for each answer.',
  },
  {
    icon: Award,
    title: 'Climb the Leaderboard',
    // description: 'Your score is saved and ranked against other participants.',
  },
];

/*
  Hidden sections (were commented out in the original page):
  - Stats: 10 Clinical Questions · 537M People with Diabetes · Nov 14 World Diabetes Day · 100+ Challenge Categories
  - "What the Challenge Offers": Test Your Knowledge / Track Your Progress / Compete Globally
*/

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 dot-grid mask-fade-b opacity-80" />
          <div className="absolute top-16 -left-40 w-[30rem] h-[30rem] rounded-full bg-sky-300/25 blur-3xl animate-float" />
          <div className="absolute -bottom-40 right-[-6rem] w-[36rem] h-[36rem] rounded-full bg-gold-300/30 blur-3xl animate-float [animation-delay:-3s]" />
        </div>

        <div className="container-max relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-10 pb-20 lg:pt-16 lg:pb-28">
            {/* Copy */}
            <div className="lg:col-span-7">
  {/* <Reveal direction="up">
    <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold uppercase tracking-[0.14em]">
      <span className="relative flex w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-60" />
        <span className="relative w-2 h-2 rounded-full bg-sky-500" />
      </span>
      Mellitofix Trio Clinical Challenge &middot; November 14
    </div>
    </Reveal> */}

              <Reveal direction="up" delay={80}>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-ink-900 leading-[1.05] mb-7">
                  From Initiation to Intensification{' '}
                  <span className="relative inline-block">
                    {/* hand-drawn underline */}
                    <svg
                      aria-hidden
                      viewBox="0 0 300 20"
                      preserveAspectRatio="none"
                      className="absolute left-0 -bottom-2 w-full h-3 lg:h-4"
                    >
                      <path
                        d="M2 14 C 60 4, 140 4, 298 10"
                        fill="none"
                        stroke="#C5A66A"
                        strokeWidth="3"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="1"
                        strokeDashoffset="1"
                        className="animate-draw [animation-delay:700ms]"
                      />
                    </svg>
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={160}>
                <p className="text-lg lg:text-xl text-ink-600 leading-relaxed mb-10 max-w-xl">
                  Every clinical decision is a step forward. Explore the challenge and take part in a journey focused on better diabetes care.
                </p>
              </Reveal>

              <Reveal direction="up" delay={240}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => onNavigate('challenge')} className="btn-primary group px-8 py-4">
                    Start the Challenge
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => onNavigate('portfolio')} className="btn-secondary px-8 py-4">
                    Explore Portfolio
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <div className="lg:col-span-5 hidden sm:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <HowItWorks />

      {/* ================= CTA ================= */}
      <section className="container-max py-20 lg:py-28">
        <Reveal direction="scale">
          <div className="ink-panel rounded-[2rem] px-8 py-16 lg:px-16 lg:py-20 text-center shadow-lift">
            <div aria-hidden className="absolute inset-0 dot-grid-light pointer-events-none" />
            <div aria-hidden className="absolute -top-28 -left-28 w-80 h-80 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#5E94AE" strokeOpacity="0.4" strokeWidth="14" />
                <circle cx="100" cy="100" r="92" fill="none" stroke="#C5A66A" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative">
              <div className="relative w-16 h-16 mx-auto mb-8 animate-float">
                <span className="absolute inset-0 rounded-2xl border border-gold-400 animate-pulse-ring" />
                <div className="relative w-full h-full rounded-2xl border border-gold-400/50 bg-white/5 backdrop-blur flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-gold-300" strokeWidth={1.75} />
                </div>
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-cream-50 mb-5">
                Ready To Join The Challenge?
              </h2>
              <p className="text-cream-300 text-lg mb-10 max-w-xl mx-auto">
                Take the Mellitofix Trio Clinical Challenge and see how you rank.
              </p>
              <button onClick={() => onNavigate('challenge')} className="btn-gold group mx-auto">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ---------- Hero visual: the World Diabetes Day blue circle, animated ---------- */

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[28rem] aspect-square animate-reveal-scale [animation-delay:200ms]">
      {/* halo */}
      <div className="absolute inset-[14%] rounded-full bg-sky-200/50 blur-2xl" />

      {/* slow dotted orbit */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full animate-spin-slower">
        <circle cx="200" cy="200" r="190" fill="none" stroke="#C5A66A" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="1 9" strokeLinecap="round" />
      </svg>

      {/* the blue circle draws itself in */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full -rotate-90">
        <defs>
          <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94C2D8" />
            <stop offset="100%" stopColor="#3B6378" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="138" fill="none" stroke="#DCEBF3" strokeWidth="28" />
        <circle
          cx="200"
          cy="200"
          r="138"
          fill="none"
          stroke="url(#heroRing)"
          strokeWidth="28"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          className="animate-draw [animation-delay:400ms] [animation-duration:2.2s]"
        />
      </svg>

      {/* gold dot orbiting on the outer ring */}
      <div className="absolute inset-0 animate-spin-slow">
        <span className="absolute left-1/2 top-[2.5%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gold-500 shadow-[0_0_0_6px_rgba(197,166,106,0.22)]" />
      </div>

            {/* centre */}
      <div className="absolute inset-[31%]">
        <span className="absolute inset-0 rounded-full border-2 border-sky-400 animate-pulse-ring" />
        <div className="relative w-full h-full rounded-full bg-ink-900 shadow-lift flex items-center justify-center">
                    <Ribbon className="w-1/2 h-1/2 text-sky-300" strokeWidth={2.25} />
        </div>
      </div>

      {/* floating chips */}
      <FloatChip className="top-[8%] right-[6%]" delay="0s">
        <Brain className="w-6 h-6 text-ink-800" strokeWidth={1.75} />
      </FloatChip>
      <FloatChip className="bottom-[12%] left-[2%]" delay="-2s">
        <Trophy className="w-6 h-6 text-gold-600" strokeWidth={1.75} />
      </FloatChip>
      <FloatChip className="bottom-[4%] right-[14%]" delay="-4s">
        <CheckCircle2 className="w-6 h-6 text-sky-600" strokeWidth={1.75} />
      </FloatChip>
    </div>
  );
}

function FloatChip({
  className,
  delay,
  children,
}: {
  className: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`absolute ${className} animate-float`} style={{ animationDelay: delay }}>
      <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur border border-cream-300 shadow-lift flex items-center justify-center rotate-[-6deg]">
        {children}
      </div>
    </div>
  );
}

/* ---------- How it works: timeline that draws in on scroll ---------- */

function HowItWorks() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative border-y border-cream-300/70 bg-white/50 backdrop-blur-sm overflow-hidden">
      <div aria-hidden className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="container-max relative py-20 lg:py-24">
        <Reveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
            <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-ink-900">
              How It Works
            </h2>
          </div>
        </Reveal>

        <div ref={ref} className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {/* connector line (desktop) */}
          <div aria-hidden className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-cream-300">
            <div
              className={`h-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 origin-left transition-transform duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                inView ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`relative flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 250}ms` }}
            >
              <div className="group relative w-16 h-16 mb-6">
                <div className="absolute inset-1 rounded-2xl bg-ink-900 rotate-45 shadow-lift transition-transform duration-500 ease-out group-hover:rotate-[135deg] group-hover:scale-110" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-gold-300" strokeWidth={2} />
                </div>
                <span className="absolute -top-3 -right-5 w-8 h-8 rounded-full bg-cream-50 border border-gold-300 shadow-soft flex items-center justify-center font-serif italic text-xs text-gold-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
