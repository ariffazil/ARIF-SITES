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
import { Earth } from '@/pages/Earth';
import { EssayPage } from '@/pages/EssayPage';
import { Doctrine } from '@/pages/Doctrine';
import Economics from '@/pages/EconomicsArrow';
import Writing from '@/pages/WritingArrow';
import Proof from '@/pages/ProofArrow';
import { CommodityPage } from '@/pages/CommodityPage';
import { InstitutionPage } from '@/pages/InstitutionPage';
import { NotFound } from '@/pages/NotFound';

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
            {/* Home — Arrow of Time hero */}
            <Route path="/" element={<Home />} />

            {/* Earth — Malay Basin discoveries (human contrast register) */}
            <Route path="/earth" element={<Earth />} />
            <Route path="/earth/" element={<Earth />} />

            {/* Economics — human essay register; live briefing still at /wealth-live */}
            <Route path="/economics" element={<Economics />} />
            <Route path="/economics/" element={<Economics />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth-live" element={<Wealth />} />
            <Route path="/wealth-live/" element={<Wealth />} />
            {/* World — civic journalism + commodities + spatial politics */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />
            <Route path="/politics" element={<PoliticsHub />} />
            <Route path="/politics/" element={<PoliticsHub />} />
            <Route path="/malaysia" element={<PoliticsHub />} />
            <Route path="/malaysia/" element={<PoliticsHub />} />
            {/* /vitals is PETRONAS VITALS (static singleton at /vitals/). Never steal for politics. */}
            <Route path="/vitals" element={<Navigate to="/vitals/" replace />} />
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
            {/* MakcikGPT — canonical path */}
            <Route path="/world/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/world/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/world/makcikgpt/:slug" element={<MakcikGptArticle />} />
            {/* Commodities & Market Signal Terminals */}
            <Route path="/world/oil" element={<CommodityPageOil />} />
            <Route path="/world/gas" element={<CommodityPageGas />} />
            <Route path="/world/gold" element={<CommodityPageGold />} />
            <Route path="/world/klci" element={<CommodityPageKlci />} />
            <Route path="/world/usdmyr" element={<CommodityPageUsdmyr />} />
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

            {/* Read / Writing — human archive register */}
            <Route path="/read" element={<Writing />} />
            <Route path="/read/" element={<Writing />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/writing/" element={<Writing />} />
            <Route path="/writing/:slug" element={<EssayPage />} />

            {/* Doctrine & Federation — constitutional register */}
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/doctrine/" element={<Doctrine />} />
            <Route path="/federation" element={<Navigate to="/doctrine" replace />} />
            <Route path="/federation/" element={<Navigate to="/doctrine" replace />} />

            {/* Proof chamber (SPA) — static /999/ artifacts remain on disk */}
            <Route path="/proof" element={<Proof />} />
            <Route path="/proof/" element={<Proof />} />
            {/* Missions — human cockpit (machines use /missions.json) */}
            <Route path="/missions" element={<Missions />} />
            <Route path="/missions/" element={<Missions />} />

            {/* Institution */}
            <Route path="/institution" element={<InstitutionPage />} />
            <Route path="/institution/" element={<InstitutionPage />} />
            <Route path="/verify" element={<Navigate to="/institution" replace />} />
            <Route path="/verify/" element={<Navigate to="/institution" replace />} />
            <Route path="/compliance" element={<Navigate to="/institution" replace />} />
            <Route path="/compliance/" element={<Navigate to="/institution" replace />} />

            {/* Machine & Genesis */}
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />

            {/* Backward-compat redirects */}
            <Route path="/rss" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/rss/" element={<Navigate to="/feed.xml" replace />} />
            <Route path="/canon" element={<Navigate to="/doctrine" replace />} />
            <Route path="/canon/" element={<Navigate to="/doctrine" replace />} />
            <Route path="/constellation" element={<Navigate to="/federation" replace />} />
            <Route path="/constellation/" element={<Navigate to="/federation" replace />} />
            <Route path="/discoveries" element={<Navigate to="/earth" replace />} />
            <Route path="/discoveries/" element={<Navigate to="/earth" replace />} />
            <Route path="/wealth" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/" element={<Navigate to="/economics" replace />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/wealth/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/economics/makcikgpt" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/" element={<Navigate to="/world/makcikgpt" replace />} />
            <Route path="/economics/makcikgpt/index" element={<Navigate to="/world/makcikgpt/" replace />} />
            <Route path="/economics/makcikgpt/:slug" element={<MakcikGptRedirect />} />
            <Route path="/essays" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/" element={<Navigate to="/writing" replace />} />
            <Route path="/essays/:slug" element={<EssayRedirect />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ArrowFooter />
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
