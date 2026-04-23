import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5E8E8]">
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-[#FF3333] mb-6 tracking-tight">
          ARIF FAZIL
        </h1>
        <p className="text-xl md:text-2xl text-[#F5E8E8]/70 max-w-2xl mb-4">
          Senior Exploration Geoscientist · arifOS Framework Creator
        </p>
        <p className="text-[#F5E8E8]/50 max-w-xl">
          13+ years mapping Southeast Asian basins. Building constitutional AI with geological discipline.
        </p>
        <div className="flex gap-4 mt-8">
          <Link to="/discoveries" className="px-6 py-3 bg-[#FF3333] text-white rounded hover:bg-[#FF3333]/80 transition-colors">
            View Discoveries
          </Link>
          <Link to="/constellation" className="px-6 py-3 border border-[#FF3333]/50 text-[#FF3333] rounded hover:bg-[#FF3333]/10 transition-colors">
            Explore arifOS
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-[#FF3333]/10">
        <h2 className="text-3xl font-bold text-[#FF3333] mb-8 text-center">The Trinity</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 border border-[#FF3333]/20 rounded">
            <span className="text-4xl">Ψ</span>
            <h3 className="text-xl font-bold mt-2">SOUL</h3>
            <p className="text-[#F5E8E8]/50 mt-2">Human anchor — personal identity & geological journey</p>
          </div>
          <div className="p-6 border border-[#00D4AA]/20 rounded">
            <span className="text-4xl">Ω</span>
            <h3 className="text-xl font-bold mt-2">MIND</h3>
            <p className="text-[#F5E8E8]/50 mt-2">arifOS constitutional AI governance framework</p>
          </div>
          <div className="p-6 border border-[#D4A853]/20 rounded">
            <span className="text-4xl">Δ</span>
            <h3 className="text-xl font-bold mt-2">BODY</h3>
            <p className="text-[#F5E8E8]/50 mt-2">AAA wire — MCP/A2A protocol specifications</p>
          </div>
        </div>
      </section>
    </div>
  );
}