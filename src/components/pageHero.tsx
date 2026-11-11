import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Reveal from '@/components/Reveal';

type PageHeroProps = {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
};

/** Shared page header used by Portfolio and Leaderboard. */
export default function PageHero({ icon: Icon, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-cream-300/70">
      {/* decorative backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid mask-fade-b opacity-70" />
        <div className="absolute -top-40 right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-gold-200/40 blur-3xl animate-float" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[24rem] h-[24rem] hidden md:block">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
            <circle cx="100" cy="100" r="74" fill="none" stroke="#94C2D8" strokeOpacity="0.45" strokeWidth="14" />
            <circle cx="100" cy="100" r="94" fill="none" stroke="#C5A66A" strokeOpacity="0.7" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="container-max relative py-14 lg:py-20">
        <div className="max-w-2xl">
          <Reveal direction="up">
            <div className="flex items-center gap-4 mb-5">
              {Icon && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <span className="absolute inset-0 rounded-2xl border border-gold-400 animate-pulse-ring" />
                  <div className="relative w-full h-full rounded-2xl bg-ink-900 flex items-center justify-center shadow-lift">
                    <Icon className="w-6 h-6 text-gold-300" strokeWidth={2} />
                  </div>
                </div>
              )}
              <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink-900 leading-tight">
                {title}
              </h1>
            </div>
          </Reveal>

          {description && (
            <Reveal direction="up" delay={100}>
              <p className="text-ink-600 text-lg leading-relaxed">{description}</p>
            </Reveal>
          )}

          <Reveal direction="left" delay={200}>
            <div className="mt-8 flex items-center gap-2">
              <span className="h-px w-16 bg-gold-500" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
              <span className="h-px w-6 bg-gold-300" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
