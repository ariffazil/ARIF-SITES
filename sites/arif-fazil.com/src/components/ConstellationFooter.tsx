import { Link } from 'react-router-dom';

export function ConstellationFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#FF3333]/20 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[#F5E8E8]/50 text-sm">
          Ψ SOUL · Ω MIND · Δ BODY — Ditempa Bukan Diberi
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-[#F5E8E8]/30">
          <Link to="/" className="hover:text-[#FF3333]">Home</Link>
          <Link to="/discoveries" className="hover:text-[#FF3333]">Discoveries</Link>
          <Link to="/canon" className="hover:text-[#FF3333]">Canon</Link>
        </div>
      </div>
    </footer>
  );
}