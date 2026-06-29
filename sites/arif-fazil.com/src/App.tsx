import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';
import { Discoveries } from '@/pages/Discoveries';
import { Constellation } from '@/pages/Constellation';
import { Canon } from '@/pages/Canon';
import { Essays } from '@/pages/Essays';
import { EssayPage } from '@/pages/EssayPage';

function App() {
  return (
    <BrowserRouter>
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/wealth" element={<Wealth />} />
            <Route path="/wealth/" element={<Wealth />} />
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
