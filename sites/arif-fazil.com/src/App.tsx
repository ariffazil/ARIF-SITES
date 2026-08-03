import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';
import AtlasGate from '@/components/AtlasGate';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { WealthArticle } from '@/pages/WealthArticle';
import { World } from '@/pages/World';
import { MakcikGPTAlias } from '@/pages/MakcikGptAlias';
import { MakcikGptArticle } from '@/pages/MakcikGptArticle';
import { Discoveries } from '@/pages/Discoveries';
import { Essays } from '@/pages/Essays';
import { EssayPage } from '@/pages/EssayPage';
import { Doctrine } from '@/pages/Doctrine';
import { CommodityPage } from '@/pages/CommodityPage';
import { InstitutionPage } from '@/pages/InstitutionPage';
import { NotFound } from '@/pages/NotFound';

import { NSElectionPage } from '@/pages/NSElectionPage';
import { PlaybookPage } from '@/pages/PlaybookPage';
import { ShadowPMs } from '@/pages/ShadowPMs';
import { PoliticsHub } from '@/pages/PoliticsHub';

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
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            {/* Home — sovereign identity */}
            <Route path="/" element={<Home />} />

            {/* Earth — pure geoscience, no civic/commodity */}
            <Route path="/earth" element={<Discoveries />} />
            <Route path="/earth/" element={<Discoveries />} />

            {/* Economics — WEALTH capital briefing */}
            <Route path="/economics" element={<Wealth />} />
            <Route path="/economics/" element={<Wealth />} />
            <Route path="/economics/article/:slug" element={<WealthArticle />} />

            {/* World — civic journalism + commodities + spatial politics */}
            <Route path="/world" element={<World />} />
            <Route path="/world/" element={<World />} />
            <Route path="/politics" element={<PoliticsHub />} />
            <Route path="/politics/" element={<PoliticsHub />} />
            <Route path="/malaysia" element={<PoliticsHub />} />
            <Route path="/malaysia/" element={<PoliticsHub />} />
            <Route path="/vitals" element={<Navigate to="/politics/ns-election" replace />} />
            <Route path="/vitals/" element={<Navigate to="/politics/ns-election" replace />} />
            <Route path="/politics/ns-election" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/" element={<NSElectionPage />} />
            <Route path="/politics/ns-election/playbook" element={<PlaybookPage />} />
            <Route path="/politics/ns-election/playbook/" element={<PlaybookPage />} />
            <Route path="/politics/shadow" element={<ShadowPMs />} />
            <Route path="/politics/shadow/" element={<ShadowPMs />} />
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

            {/* Writing */}
            <Route path="/writing" element={<Essays />} />
            <Route path="/writing/" element={<Essays />} />
            <Route path="/writing/:slug" element={<EssayPage />} />

            {/* Doctrine & Federation — unified governance */}
            <Route path="/doctrine" element={<Doctrine />} />
            <Route path="/doctrine/" element={<Doctrine />} />
            <Route path="/federation" element={<Navigate to="/doctrine" replace />} />
            <Route path="/federation/" element={<Navigate to="/doctrine" replace />} />

            {/* Missions */}
            <Route path="/missions" element={<Navigate to="/" replace />} />
            <Route path="/missions/" element={<Navigate to="/" replace />} />

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
