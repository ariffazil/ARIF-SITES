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

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            {/* Home — human reality: Arif */}
            <Route path="/" element={<Home />} />

            {/* Earth — subsurface discoveries, geoscience */}
            <Route path="/earth" element={<Discoveries />} />
            <Route path="/earth/" element={<Discoveries />} />

            {/* Economics — Malaysia briefing + MakcikGPT */}
            <Route path="/economics" element={<Wealth />} />
            <Route path="/economics/" element={<Wealth />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />
            <Route path="/economics/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/economics/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/economics/makcikgpt/index" element={<MakcikGPT />} />
            <Route path="/economics/makcikgpt/:slug" element={<MakcikGptArticle />} />

            {/* World — commodity dashboards */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />

            {/* Writing — narrative essays */}
            <Route path="/writing" element={<Essays />} />
            <Route path="/writing/" element={<Essays />} />
            <Route path="/writing/:slug" element={<EssayPage />} />

            {/* Doctrine — constitution + constellation + manifesto (merged) */}
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/doctrine/" element={<Doctrine />} />

            {/* Machine-facing — genesis, proof */}
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />

            {/* Backward-compat redirects — zero broken links */}
            <Route path="/canon" element={<Navigate to="/doctrine" replace />} />
            <Route path="/canon/" element={<Navigate to="/doctrine" replace />} />
            <Route path="/constellation" element={<Navigate to="/doctrine" replace />} />
            <Route path="/constellation/" element={<Navigate to="/doctrine" replace />} />
            <Route path="/discoveries" element={<Navigate to="/earth" replace />} />
            <Route path="/discoveries/" element={<Navigate to="/earth" replace />} />
            <Route path="/wealth" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/wealth/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/wealth/makcikgpt/index" element={<MakcikGPT />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptArticle />} />
            <Route path="/essays" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/:slug" element={<EssayRedirect />} />
          </Routes>
        </main>
        <ConstellationFooter />
      </div>
    </BrowserRouter>
  );
}

function EssayRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/writing/${slug ?? ''}`} replace />;
}

export default App;
