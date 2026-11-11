export type PageId = 'home' | 'challenge' | 'portfolio' | 'leaderboard' | 'admin';

export type PageMeta = {
  id: PageId;
  label: string;
  path: string;
};

export const PAGES: PageMeta[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'challenge', label: 'Challenge', path: '/challenge' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio' },
  { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
  { id: 'admin', label: 'Admin', path: '/admin' },
];
