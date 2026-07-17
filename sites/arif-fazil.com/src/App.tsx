import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';
import { getAliasRedirects } from '@/data/federationRoutes';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { WealthArticle } from '@/pages/WealthArticle';
import { MakcikGPT } from '@/pages/MakcikGPT';
import { MakcikGptArticle } from '@/pages/MakcikGptArticle';
import { Discoveries } from '@/pages/Discoveries';
import { Constellation } from '@/pages/Constellation';
import { Canon } from '@/pages/Canon';
import { Essays } from '@/pages/Essays';
import { EssayPage } from '@/pages/EssayPage';
import { Oil } from '@/pages/Oil';
import { Gas } from '@/pages/Gas';
import { Gold } from '@/pages/Gold';
import { Wells } from '@/pages/Wells';
import { NotFound } from '@/pages/NotFound';
import { ArifosOverview } from '@/pages/ArifosOverview';

const aliasRedirects = getAliasRedirects().filter(
  (a) => !a.to.startsWith('http') && a.from !== a.to,
);

function ExternalRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);
  return (
    <p className="site-frame py-16 font-technical text-sm text-forge-dim">
      Redirecting to <a href={href} className="text-forge-orange">{href}</a>…
    </p>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* EARTH */}
            <Route path="/oil" element={<Oil />} />
            <Route path="/oil/" element={<Oil />} />
            <Route path="/gas" element={<Gas />} />
            <Route path="/gas/" element={<Gas />} />
            <Route path="/wells" element={<Wells />} />
            <Route path="/wells/" element={<Wells />} />
            <Route path="/discoveries" element={<Discoveries />} />
            <Route path="/discoveries/" element={<Discoveries />} />

            {/* CAPITAL */}
            <Route path="/gold" element={<Gold />} />
            <Route path="/gold/" element={<Gold />} />
            <Route path="/wealth" element={<Wealth />} />
            <Route path="/wealth/" element={<Wealth />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />

            {/* HUMAN — MakcikGPT canonical at /makcikgpt */}
            <Route path="/makcikgpt" element={<MakcikGPT />} />
            <Route path="/makcikgpt/" element={<MakcikGPT />} />
            <Route path="/makcikgpt/:slug" element={<MakcikGptArticle />} />
            <Route path="/wealth/makcikgpt" element={<Navigate to="/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/" element={<Navigate to="/makcikgpt" replace />} />
            <Route
              path="/wealth/makcikgpt/:slug"
              element={<MakcikGptArticle />}
            />

            {/* ARIFOS / writing */}
            <Route path="/arifos" element={<ArifosOverview />} />
            <Route path="/arifos/" element={<ArifosOverview />} />
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/constellation" element={<Constellation />} />
            <Route path="/constellation/" element={<Constellation />} />
            <Route path="/canon" element={<Canon />} />
            <Route path="/canon/" element={<Canon />} />
            <Route path="/essays" element={<Essays />} />
            <Route path="/essays/" element={<Essays />} />
            <Route path="/essays/:slug" element={<EssayPage />} />
            {/* /999 and /federation served as static in prod; SPA fallback pages for preview */}
            <Route path="/federation" element={<ArifosOverview />} />
            <Route path="/federation/" element={<ArifosOverview />} />

            {/* Compatibility aliases (router-level, reversible) */}
            {aliasRedirects.map(({ from, to }) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}

            {/* External MCP helper: /mcp → gateway (production Caddy 301 documented in ROUTE_REDIRECT_PLAN) */}
            <Route path="/mcp" element={<ExternalRedirect href="https://mcp.arif-fazil.com/" />} />
            <Route path="/mcp/" element={<ExternalRedirect href="https://mcp.arif-fazil.com/" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ConstellationFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
