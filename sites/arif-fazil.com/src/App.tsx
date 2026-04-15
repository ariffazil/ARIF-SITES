import { Routes, Route } from 'react-router-dom';
import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { Home } from '@/pages/Home';
import { Discoveries } from '@/pages/Discoveries';
import { Canon } from '@/pages/Canon';
import { Essays } from '@/pages/Essays';
import { Constellation } from '@/pages/Constellation';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5E8E8] font-body selection:bg-[#D4AF37] selection:text-black">
      <ConstellationNav />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discoveries" element={<Discoveries />} />
          <Route path="/canon" element={<Canon />} />
          <Route path="/essays" element={<Essays />} />
          <Route path="/constellation" element={<Constellation />} />
        </Routes>
      </main>
      <ConstellationFooter />
    </div>
  );
}

export default App;
