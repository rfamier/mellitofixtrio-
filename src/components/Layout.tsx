import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { PageId } from '@/types/router';

type LayoutProps = {
  children: ReactNode;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
};

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    // No solid background here, so the warm glows on <body> (index.css) show through
    <div className="relative min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
