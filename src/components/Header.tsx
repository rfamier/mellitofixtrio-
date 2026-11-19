import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { PAGES, type PageId } from '@/types/router';

// Admin stays reachable from the footer, but is hidden from the top navigation
const NAV_PAGES = PAGES.filter((page) => page.id !== 'admin');

type HeaderProps = {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  // Header style + gold reading-progress bar on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentPage]);

  // Sliding pill behind the active nav item
  const updatePill = useCallback(() => {
    const activeEl = itemRefs.current[currentPage];
    const navEl = navRef.current;
    if (activeEl && navEl) {
      const navBox = navEl.getBoundingClientRect();
      const box = activeEl.getBoundingClientRect();
      setPill({
        left: box.left - navBox.left - navEl.clientLeft,
        width: box.width,
        ready: true,
      });
    } else {
      // e.g. on the Admin page: no nav item is active, so hide the pill
      setPill((p) => ({ ...p, ready: false }));
    }
  }, [currentPage]);

  useEffect(() => {
    updatePill();
    // re-measure once web fonts finish loading (text width changes)
    document.fonts?.ready.then(updatePill).catch(() => {});
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-cream-50/80 backdrop-blur-xl border-b border-cream-300/70 shadow-soft'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-max">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Logo and Branding */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group rounded-xl"
          >
            <span className="relative">
              <img
                src="/images/eva_black.png"
                alt="Eva Pharma logo"
                className="h-10 w-auto rounded-lg ring-1 ring-cream-300 shadow-soft transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-cream-50 bg-sky-500" />
            </span>

            <span className="flex flex-col items-start leading-none">
              <span className="uppercase text-lg font-extrabold tracking-[0.08em] text-ink-900">
                Eva Pharma
              </span>
              <span className="mt-1 text-[10px] font-semibold text-gold-700 tracking-[0.2em] uppercase">
                Mellitofix Trio Clinical Challenge
              </span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-0.5 relative p-1 rounded-full bg-white/70 backdrop-blur border border-cream-300/80 shadow-soft"
          >
            {/* Sliding pill */}
            <span
              aria-hidden
              className="absolute top-1 bottom-1 rounded-full bg-ink-900 shadow-lift transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ left: pill.left, width: pill.width, opacity: pill.ready ? 1 : 0 }}
            />

            {NAV_PAGES.map((page) => {
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  ref={(el) => {
                    itemRefs.current[page.id] = el;
                  }}
                  onClick={() => handleNav(page.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-cream-50' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {isActive && (
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-75" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-gold-400" />
                      </span>
                    )}
                    {page.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-11 h-11 rounded-full flex items-center justify-center bg-white/70 border border-cream-300 text-ink-800 shadow-soft transition-transform active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <Menu
              className={`absolute w-5 h-5 transition-all duration-300 ${
                mobileOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <X
              className={`absolute w-5 h-5 transition-all duration-300 ${
                mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-cream-300/70 animate-slide-down">
          <div className="container-max py-4 flex flex-col gap-1.5">
            {NAV_PAGES.map((page, i) => {
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => handleNav(page.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group px-5 py-3.5 text-left rounded-2xl text-sm font-medium flex items-center justify-between transition-all duration-300 animate-slide-up [animation-fill-mode:backwards] ${
                    isActive
                      ? 'bg-ink-900 text-cream-50 shadow-lift'
                      : 'text-ink-600 hover:bg-white hover:text-ink-900'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive ? 'bg-gold-400' : 'bg-cream-400 group-hover:bg-gold-500'
                      }`}
                    />
                    {page.label}
                  </span>
                  <span
                    className={`font-serif italic text-xs ${
                      isActive ? 'text-gold-300' : 'text-ink-300'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Gold scroll-progress line */}
      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-[2px] w-full origin-left bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
