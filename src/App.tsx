import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ChallengePage from '@/pages/ChallengePage';
import PortfolioPage from '@/pages/PortfolioPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import AdminPage from '@/pages/AdminPage';
import { PAGES, type PageId } from '@/types/router';

function getPageFromHash(): PageId {
  const hash = window.location.hash.replace('#', '').replace('/', '');
  const match = PAGES.find((p) => p.id === hash);
  return match ? match.id : 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    window.location.hash = `/${page}`;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return <HomePage onNavigate={handleNavigate} />;
    case 'challenge':
      return <ChallengePage onNavigate={handleNavigate} />;
    case 'portfolio':
      return <PortfolioPage />;
    case 'leaderboard':
      return <LeaderboardPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage onNavigate={handleNavigate} />;
  }
};
  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      <div key={currentPage} className="animate-page-enter">
        {renderPage()}
      </div>
    </Layout>
  );
}

export default App;
