import { Activity, Mail, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl border border-gold-400/40 bg-white/5 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gold-300" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold text-cream-50">Diabetes Challenge</span>
                <span className="mt-1.5 text-[10px] font-semibold text-gold-400 tracking-[0.2em] uppercase">
                  World Diabetes Day
                </span>
              </div>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              A clinical knowledge platform dedicated to advancing diabetes care
              through education and professional challenge.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {PAGES.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => onNavigate(page.id)}
                    className="group inline-flex items-center gap-1.5 text-sm text-cream-200 hover:text-gold-300 transition-colors"
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

          {/* About */}
          <div className="md:col-span-4">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 mb-5">
              About
            </h4>
            <ul className="space-y-3.5">
              {[
                { icon: Calendar, text: 'November 14, World Diabetes Day' },
                { icon: Mail, text: 'info@diabeteschallenge.org' },
                { icon: MapPin, text: 'Global Health Initiative' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-cream-200">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-sky-300" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-400">
            &copy; {new Date().getFullYear()} Diabetes Challenge. All rights reserved.
          </p>
          <p className="text-xs text-cream-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-gold-500" />
            Advancing diabetes education worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
