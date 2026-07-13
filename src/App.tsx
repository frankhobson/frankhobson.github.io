import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { Work } from './pages/Work/Work';
import { Travel } from './pages/Travel/Travel';
import { Volunteering } from './pages/Volunteering/Volunteering';
import { Projects } from './pages/Projects/Projects';
import { Admin } from '@admin-page';
import { UnderDevelopment } from './components/UnderDevelopment/UnderDevelopment';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { home } from './data/mockData';
import type { HomeData } from './types';

interface BlockedRouteProps {
  tabName: 'home' | 'work' | 'projects' | 'travel' | 'volunteering';
  element: React.ReactElement;
}

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const BlockedRoute: React.FC<BlockedRouteProps> = ({ tabName, element }) => {
  const [homeData] = useLocalStorageState<HomeData>("portfolio_home", home);
  const isBlocked = !!homeData.blockedTabs?.[tabName];

  if (isBlocked) {
    return <UnderDevelopment tabName={tabName} />;
  }

  return element;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BlockedRoute tabName="home" element={<Home />} />} />
          <Route path="work" element={<BlockedRoute tabName="work" element={<Work />} />} />
          <Route path="projects" element={<BlockedRoute tabName="projects" element={<Projects />} />} />
          <Route path="travel" element={<BlockedRoute tabName="travel" element={<Travel />} />} />
          <Route path="volunteering" element={<BlockedRoute tabName="volunteering" element={<Volunteering />} />} />
          {(import.meta.env.DEV || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
            <Route path="admin" element={<Admin />} />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
