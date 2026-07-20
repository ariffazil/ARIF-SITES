import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { WealthArticle } from '@/pages/WealthArticle';
import { World } from '@/pages/World';
import { MakcikGPTAlias } from '@/pages/MakcikGptAlias';
import { MakcikGPT } from '@/pages/MakcikGPT';
import { MakcikGptArticle } from '@/pages/MakcikGptArticle';
import { Discoveries } from '@/pages/Discoveries';
import { Essays } from '@/pages/Essays';
import { EssayPage } from '@/pages/EssayPage';
import { Doctrine } from '@/pages/Doctrine';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            {/* Home — sovereign identity: Arif */}
            <Route path="/" element={<Home />} />

            {/* Earth — GEOX subsurface */}
            <Route path="/earth" element={<Discoveries />} />
            <Route path="/earth/" element={<Discoveries />} />

            {/* Economics — WEALTH daily briefing */}
            <Route path="/economics" element={<Wealth />} />
            <Route path="/economics/" element={<Wealth />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />

            {/* World — MakcikGPT civic journalism + commodity markets */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />
            <Route path="/world/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/index" element={<MakcikGPT />} />
            <Route path="/world/makcikgpt/:slug" element={<MakcikGptArticle />} />

            {/* Writing — narrative essays */}
            <Route path="/writing" element={<Essays />} />
            <Route path="/writing/" element={<Essays />} />
            <Route path="/writing/:slug" element={<EssayPage />} />

            {/* Doctrine — arifOS constitution */}
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/doctrine/" element={<Doctrine />} />

            {/* Machine-facing — static, no JS needed */}
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />

            {/* Backward-compat redirects — zero broken links */}
            <Route path="/rss" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/rss/" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/canon" element={<Navigate to="/doctrine" replace />} />
            <Route path="/canon/" element={<Navigate to="/doctrine" replace />} />
            <Route path="/constellation" element={<Navigate to="/doctrine" replace />} />
            <Route path="/constellation/" element={<Navigate to="/doctrine" replace />} />
            <Route path="/discoveries" element={<Navigate to="/earth" replace />} />
            <Route path="/discoveries/" element={<Navigate to="/earth" replace />} />
            <Route path="/wealth" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />
            {/* Legacy MakcikGPT paths */}
            <Route path="/wealth/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/index" element={<Navigate to="/world/makcikgpt/index" replace />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/economics/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/index" element={<Navigate to="/world/makcikgpt/index" replace />} />
            <Route path="/economics/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/essays" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/:slug" element={<EssayRedirect />} />

            {/* 404 — unknown routes die here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ConstellationFooter />
      </div>
    </BrowserRouter>
  );
}

function MakcikGptRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/world/makcikgpt/${slug ?? ''}`} replace />;
}

function EssayRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/writing/${slug ?? ''}`} replace />;
}

export default App;
