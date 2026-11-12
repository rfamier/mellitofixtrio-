import { ArrowUpRight } from 'lucide-react';
import { PAGES, type PageId } from '@/types/router';

type FooterProps = {
  onNavigate: (page: PageId) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="ink-panel mt-auto">
      {/* decorative backdrop */}
      <div aria-hidden className="absolute inset-0 dot-grid-light opacity-60 pointer-events-none" />
      <div
        aria-hidden
        className="absolute -right-24 -bottom-24 w-[22rem] h-[22rem] pointer-events-none hidden md:block"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slower">
          <circle cx="100" cy="100" r="70" fill="none" stroke="#5E94AE" strokeOpacity="0.35" strokeWidth="16" />
          <circle cx="100" cy="100" r="92" fill="none" stroke="#C5A66A" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="container-max relative pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Brand */}
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 mb-5 rounded-xl"
            >
              <img
                src="/images/eva-removebg-preview.png"
                alt="Eva Pharma logo"
                className="h-10 w-auto mix-blend-screen transition-transform duration-500 group-hover:scale-105"
              />
              <span className="flex flex-col items-start leading-none">
                <span className="uppercase text-lg font-extrabold tracking-[0.08em] text-cream-50">
                  Eva Pharma
                </span>
                <span className="mt-1 text-[10px] font-semibold text-gold-400 tracking-[0.2em] uppercase">
                  World Diabetes Day
                </span>
              </span>
            </button>
          </div>

          {/* Quick Links (horizontal) */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-4 md:text-right">
              Quick Links
            </h4>
            <ul className="flex flex-wrap md:justify-end gap-x-6 gap-y-3">
              {PAGES.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => onNavigate(page.id)}
                    className="group inline-flex items-center gap-1 text-sm text-cream-200 hover:text-gold-300 transition-colors"
                  >
                    <span className="relative">
                      {page.label}
                      <span className="absolute left-0 -bottom-0.5 h-px w-full bg-gold-400 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-400">
            &copy; {new Date().getFullYear()} Eva Pharma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}