import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { ScrollToHashElement } from '@/components/ScrollToHashElement';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { WealthArticle } from '@/pages/WealthArticle';
import { MakcikGPTAlias } from '@/pages/MakcikGptAlias';
import { MakcikGPT } from '@/pages/MakcikGPT';
import { MakcikGptArticle } from '@/pages/MakcikGptArticle';
import { Discoveries } from '@/pages/Discoveries';
import { Constellation } from '@/pages/Constellation';
import { Canon } from '@/pages/Canon';
import { Essays } from '@/pages/Essays';
import { EssayPage } from '@/pages/EssayPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/genesis" element={<Genesis />} />
            <Route path="/genesis/" element={<Genesis />} />
            <Route path="/wealth" element={<Wealth />} />
            <Route path="/wealth/" element={<Wealth />} />
            <Route path="/wealth/article/:slug" element={<WealthArticle />} />
            <Route path="/wealth/makcikgpt" element={<MakcikGPTAlias />} />
            <Route path="/wealth/makcikgpt/" element={<MakcikGPTAlias />} />
            <Route path="/wealth/makcikgpt/index" element={<MakcikGPT />} />
            <Route path="/wealth/makcikgpt/:slug" element={<MakcikGptArticle />} />
            <Route path="/discoveries" element={<Discoveries />} />
            <Route path="/discoveries/" element={<Discoveries />} />
            <Route path="/constellation" element={<Constellation />} />
            <Route path="/constellation/" element={<Constellation />} />
            <Route path="/canon" element={<Canon />} />
            <Route path="/canon/" element={<Canon />} />
            <Route path="/essays" element={<Essays />} />
            <Route path="/essays/" element={<Essays />} />
            <Route path="/essays/:slug" element={<EssayPage />} />
          </Routes>
        </main>
        <ConstellationFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
