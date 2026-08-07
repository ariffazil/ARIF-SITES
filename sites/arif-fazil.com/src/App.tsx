import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import ArrowNavbar from '@/components/ArrowNavbar';
import ArrowFooter from '@/components/ArrowFooter';
import Cursor from '@/components/Cursor';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';
import AtlasGate from '@/components/AtlasGate';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { WealthArticle } from '@/pages/WealthArticle';
import World from '@/pages/WorldArrow';
import { MakcikGPTAlias } from '@/pages/MakcikGptAlias';
import { MakcikGptArticle } from '@/pages/MakcikGptArticle';
import { EssayPage } from '@/pages/EssayPage';
import { Doctrine } from '@/pages/Doctrine';
import Economics from '@/pages/EconomicsArrow';
import Writing from '@/pages/WritingArrow';
import Proof from '@/pages/ProofArrow';
import { CommodityPage } from '@/pages/CommodityPage';
import { InstitutionPage } from '@/pages/InstitutionPage';
import { NotFound } from '@/pages/NotFound';
import EarthPage from '@/pages/EarthPage';

import { NSElectionPage } from '@/pages/NSElectionPage';
import { PlaybookPage } from '@/pages/PlaybookPage';
import { ShadowPMs } from '@/pages/ShadowPMs';
import { ShadowBoard } from '@/pages/ShadowBoard';
import { DeritaMap } from '@/pages/DeritaMap';
import { PoliticsHub } from '@/pages/PoliticsHub';
import { Missions } from '@/pages/Missions';
function CommodityPageOil() { return <CommodityPage slug="oil" />; }
function CommodityPageGas() { return <CommodityPage slug="gas" />; }
function CommodityPageGold() { return <CommodityPage slug="gold" />; }
function CommodityPageKlci() { return <CommodityPage slug="klci" />; }
function CommodityPageUsdmyr() { return <CommodityPage slug="usdmyr" />; }

function App() {
  return (
    <BrowserRouter>
      <AtlasGate />
      <ScrollToHashElement />
      <div className="site-shell bg-paper text-ink">
        <Cursor />
        <ArrowNavbar />
        <main className="site-main" id="main-content">
          <Routes>
            {/* ═══════════════ HOME ═══════════════ */}
            <Route path="/" element={<Home />} />

            {/* ═══════════════ EARTH ═══════════════ */}
            <Route path="/earth" element={<EarthPage />} />
            <Route path="/earth/" element={<EarthGlobeRedirect />} />
            <Route path="/earth/*" element={<EarthGlobeRedirect />} />

            {/* ═══════════════ WORLD ═══════════════ */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />
            {/* World → MakcikGPT */}
            <Route path="/world/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/world/makcikgpt/:slug" element={<MakcikGptArticle />} />
            {/* World → Commodities */}
            <Route path="/world/oil" element={<CommodityPageOil />} />
            <Route path="/world/gas" element={<CommodityPageGas />} />
            <Route path="/world/gold" element={<CommodityPageGold />} />
            <Route path="/world/klci" element={<CommodityPageKlci />} />
            <Route path="/world/usdmyr" element={<CommodityPageUsdmyr />} />
            {/* World → Politics (legacy root-level kept for backcompat) */}
            <Route path="/world/politics" element={<PoliticsHub />} />
            <Route path="/world/politics/" element={<PoliticsHub />} />
            <Route path="/world/politics/ns-election" element={<NSElectionPage />} />
            <Route path="/world/politics/ns-election/" element={<NSElectionPage />} />
            <Route path="/world/politics/ns-election/playbook" element={<PlaybookPage />} />
            <Route path="/world/politics/ns-election/playbook/" element={<PlaybookPage />} />
            <Route path="/world/politics/shadow" element={<ShadowPMs />} />
            <Route path="/world/politics/shadow/" element={<ShadowPMs />} />
            <Route path="/world/politics/shadow/board" element={<ShadowBoard />} />
            <Route path="/world/politics/shadow/board/" element={<ShadowBoard />} />
            <Route path="/world/politics/shadow/derita" element={<DeritaMap />} />
            <Route path="/world/politics/shadow/derita/" element={<DeritaMap />} />
            {/* World → Economics (commodity pages) */}
            <Route path="/world/economics" element={<Economics />} />
            <Route path="/world/economics/" element={<Economics />} />
            <Route path="/world/economics/article/:slug" element={<WealthArticle />} />

            {/* ═══════════════ WORDS ═══════════════ */}
            <Route path="/words" element={<Writing />} />
            <Route path="/words/" element={<Writing />} />
            <Route path="/words/writing" element={<Writing />} />
            <Route path="/words/writing/" element={<Writing />} />
            <Route path="/words/writing/:slug" element={<EssayPage />} />
            <Route path="/words/doctrine" element={<Doctrine />} />
            <Route path="/words/doctrine/" element={<Doctrine />} />

            {/* ═══════════════ WORK ═══════════════ */}
            <Route path="/work" element={<Missions />} />
            <Route path="/work/" element={<Missions />} />
            <Route path="/work/missions" element={<Missions />} />
            <Route path="/work/missions/" element={<Missions />} />
            <Route path="/work/proof" element={<Proof />} />
            <Route path="/work/proof/" element={<Proof />} />

            {/* ═══════════════ LEGACY — BACKWARD COMPAT ═══════════════ */}
            {/* Legacy Earth */}
            <Route path="/discoveries" element={<Navigate to="/earth" replace />} />
            <Route path="/discoveries/" element={<Navigate to="/earth" replace />} />

            {/* Legacy World → Economics */}
            <Route path="/economics" element={<Economics />} />
            <Route path="/economics/" element={<Economics />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth-live" element={<Wealth />} />
            <Route path="/wealth-live/" element={<Wealth />} />
            <Route path="/wealth" element={<Navigate to="/world/economics" replace />} />
            <Route path="/wealth/" element={<Navigate to="/world/economics" replace />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />

            {/* Legacy World → Politics */}
            <Route path="/politics" element={<PoliticsHub />} />
            <Route path="/politics/" element={<PoliticsHub />} />
            <Route path="/malaysia" element={<PoliticsHub />} />
            <Route path="/malaysia/" element={<PoliticsHub />} />
            <Route path="/politics/ns-election" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/playbook" element={<PlaybookPage />} />
            <Route path="/politics/ns-election/playbook/" element={<PlaybookPage />} />
            <Route path="/politics/shadow" element={<ShadowPMs />} />
            <Route path="/politics/shadow/" element={<ShadowPMs />} />
            <Route path="/politics/shadow/board" element={<ShadowBoard />} />
            <Route path="/politics/shadow/board/" element={<ShadowBoard />} />
            <Route path="/politics/shadow/derita" element={<DeritaMap />} />
            <Route path="/politics/shadow/derita/" element={<DeritaMap />} />

            {/* Legacy World → PROPA */}
            <Route path="/vitals" element={<Navigate to="/world/propa/" replace />} />
            <Route path="/propa" element={<Navigate to="/world/propa/" replace />} />
            <Route path="/propa/" element={<Navigate to="/world/propa/" replace />} />

            {/* Legacy World → Commodities */}
            <Route path="/oil" element={<CommodityPageOil />} />
            <Route path="/oil/" element={<CommodityPageOil />} />
            <Route path="/gas" element={<CommodityPageGas />} />
            <Route path="/gas/" element={<CommodityPageGas />} />
            <Route path="/gold" element={<CommodityPageGold />} />
            <Route path="/gold/" element={<CommodityPageGold />} />
            <Route path="/klci" element={<CommodityPageKlci />} />
            <Route path="/klci/" element={<CommodityPageKlci />} />
            <Route path="/usdmyr" element={<CommodityPageUsdmyr />} />
            <Route path="/usdmyr/" element={<CommodityPageUsdmyr />} />

            {/* Legacy MakcikGPT redirects */}
            <Route path="/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/wealth/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/economics/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/economics/makcikgpt/:slug" element={<MakcikGptRedirect />} />

            {/* Legacy Words */}
            <Route path="/writing" element={<Writing />} />
            <Route path="/writing/" element={<Writing />} />
            <Route path="/writing/:slug" element={<EssayPage />} />
            <Route path="/read" element={<Navigate to="/words" replace />} />
            <Route path="/read/" element={<Navigate to="/words" replace />} />
            <Route path="/essays" element={<Navigate to="/words/writing" replace />} />
            <Route path="/essays/" element={<Navigate to="/words/writing" replace />} />
            <Route path="/essays/:slug" element={<EssayRedirect />} />
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/doctrine/" element={<Doctrine />} />
            <Route path="/federation" element={<Navigate to="/words/doctrine" replace />} />
            <Route path="/federation/" element={<Navigate to="/words/doctrine" replace />} />
            <Route path="/canon" element={<Navigate to="/words/doctrine" replace />} />
            <Route path="/canon/" element={<Navigate to="/words/doctrine" replace />} />
            <Route path="/constellation" element={<Navigate to="/words/doctrine" replace />} />
            <Route path="/constellation/" element={<Navigate to="/words/doctrine" replace />} />

            {/* Legacy Work */}
            <Route path="/missions" element={<Missions />} />
            <Route path="/missions/" element={<Missions />} />
            <Route path="/proof" element={<Proof />} />
            <Route path="/proof/" element={<Proof />} />
            <Route path="/verify" element={<Navigate to="/work/proof" replace />} />
            <Route path="/verify/" element={<Navigate to="/work/proof" replace />} />

            {/* Legacy Institution */}
            <Route path="/institution" element={<InstitutionPage />} />
            <Route path="/institution/" element={<InstitutionPage />} />
            <Route path="/compliance" element={<Navigate to="/work/proof" replace />} />
            <Route path="/compliance/" element={<Navigate to="/work/proof" replace />} />

            {/* Genesis (HOME) */}
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />

            {/* Misc */}
            <Route path="/rss" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/rss/" element={<Navigate to="/feed.xml" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ArrowFooter />
      </div>
    </BrowserRouter>
  );
}

function EarthGlobeRedirect() {
  // Hard load static Dynamic Planet (globe.gl + Macrostrat) — not SPA Earth.tsx
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.startsWith('/earth')
      ? window.location.pathname + window.location.search + window.location.hash
      : '/earth/';
    window.location.replace(path.endsWith('/') || path.includes('.') ? path : path + '/');
  }
  return (
    <div className="mx-auto max-w-[40rem] px-6 py-24 font-mono text-sm text-ink-soft">
      Loading EARTH globe… <a className="text-ember underline" href="/earth/">Continue →</a>
    </div>
  );
}

function MakcikGptRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/world/makcikgpt/${slug ?? ''}`} replace />;
}

function EssayRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/words/writing/${slug ?? ''}`} replace />;
}

export default App;
