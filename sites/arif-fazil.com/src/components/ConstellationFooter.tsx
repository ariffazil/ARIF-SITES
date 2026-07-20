import { contactLinks } from '@/data/siteContent';

export function ConstellationFooter() {
  return (
    <footer className="border-t-2 border-forge-iron bg-forge-black py-16 mt-auto">
      <div className="site-frame max-w-4xl mx-auto">
        {/* Philosophy line */}
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-2xl uppercase leading-none italic text-forge-white mb-3">
            One human page. Two AI pages.
          </h2>
          <p className="font-body text-forge-dim text-sm max-w-lg mx-auto leading-relaxed">
            The homepage is written for human observation. 
            <code className="text-forge-orange bg-forge-steel px-1 mx-1">/000</code> 
            holds scars and wisdom for AI agents. 
            <code className="text-forge-green bg-forge-steel px-1 mx-1">/999</code> 
            holds verification and machine-facing weight.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-forge-iron/30 mb-8" />

        {/* Minimal links row */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-center">
          {/* Contact */}
          <div className="flex items-center gap-4">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="font-technical text-[0.7rem] uppercase text-forge-dim hover:text-forge-white transition-colors tracking-widest"
              >
                {item.label} ↗
              </a>
            ))}
          </div>

          {/* Divider dot */}
          <span className="hidden md:block text-forge-iron select-none">·</span>

          {/* Federation entry points — only the two gates */}
          <div className="flex items-center gap-4">
            <a
              href="https://arifos.arif-fazil.com"
              target="_blank"
              rel="noreferrer"
              className="font-technical text-[0.7rem] uppercase text-forge-dim hover:text-forge-white transition-colors tracking-widest"
            >
              Observatory ↗
            </a>
            <a
              href="https://mcp.arif-fazil.com"
              target="_blank"
              rel="noreferrer"
              className="font-technical text-[0.7rem] uppercase text-forge-dim hover:text-forge-orange transition-colors tracking-widest"
            >
              MCP Gateway ↗
            </a>
          </div>
        </div>

        {/* Machine surface badges */}
        <div className="flex justify-center gap-4 mt-8 mb-8">
          <a href="/llms.txt" className="badge-status badge-status--live text-[0.55rem]">llms.txt</a>
          <a href="/soul.json" className="badge-status badge-status--live text-[0.55rem]">soul.json</a>
          <a href="/feed.xml" className="badge-status badge-status--live text-[0.55rem]">rss</a>
        </div>

        {/* Footer */}
        <div className="border-t border-forge-iron/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest">
            Arif Fazil · Ditempa Bukan Diberi
          </span>
          <a href="/999/" className="font-technical text-[0.6rem] text-forge-orange hover:text-forge-white transition-colors uppercase tracking-widest">
            verify at /999
          </a>
        </div>
      </div>
    </footer>
  );
}
