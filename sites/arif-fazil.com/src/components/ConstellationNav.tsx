import { Link } from 'react-router-dom';

export function ConstellationNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#FF3333]/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-[#FF3333] font-bold text-xl tracking-tight">
          ARIF FAZIL
        </Link>
        <div className="flex gap-6 text-sm">
          <Link to="/discoveries" className="text-[#F5E8E8]/70 hover:text-[#FF3333] transition-colors">Discoveries</Link>
          <Link to="/canon" className="text-[#F5E8E8]/70 hover:text-[#FF3333] transition-colors">Canon</Link>
          <Link to="/essays" className="text-[#F5E8E8]/70 hover:text-[#FF3333] transition-colors">Essays</Link>
          <Link to="/constellation" className="text-[#F5E8E8]/70 hover:text-[#FF3333] transition-colors">Constellation</Link>
        </div>
      </div>
    </nav>
  );
}