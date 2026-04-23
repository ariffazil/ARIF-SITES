import { discoveries } from '../data/discoveries';

export function Discoveries() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5E8E8]">
      <section className="max-w-4xl mx-auto px-4 pt-32 pb-12">
        <h1 className="text-5xl font-bold text-[#FF3333] mb-4">Discoveries</h1>
        <p className="text-[#F5E8E8]/60">
          Wells I signed off on. Each one material, each one irreversible.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-12">
          {discoveries.map((d) => (
            <div key={d.id} className="border border-[#FF3333]/20 rounded p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#FF3333]">{d.title}</h2>
                  <p className="text-sm text-[#F5E8E8]/50 mt-1">{d.location}</p>
                </div>
                <span className="text-lg text-[#FF3333]/70">{d.year}</span>
              </div>
              <p className="text-[#F5E8E8]/80 mb-4">{d.summary}</p>
              <div className="bg-[#FF3333]/5 rounded p-4">
                <p className="text-xs text-[#FF3333]/50 uppercase tracking-wider mb-2">Evidence</p>
                <ul className="space-y-1">
                  {d.evidence.map((e, i) => (
                    <li key={i} className="text-sm text-[#F5E8E8]/60">· {e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}