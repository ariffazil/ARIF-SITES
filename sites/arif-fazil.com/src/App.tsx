import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { Home } from '@/pages/Home';
import { Genesis } from '@/pages/Genesis';
import { Wealth } from '@/pages/Wealth';

function App() {
  return (
    <BrowserRouter>
      <div className="site-shell">
        <ConstellationNav />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/000" element={<Genesis />} />
            <Route path="/000/" element={<Genesis />} />
            <Route path="/wealth" element={<Wealth />} />
            <Route path="/wealth/" element={<Wealth />} />
          </Routes>
        </main>
        <ConstellationFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
