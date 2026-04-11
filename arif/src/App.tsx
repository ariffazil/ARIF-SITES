import { useEffect, useState } from 'react';

// Age Clock Component
function AgeClock({ birthDate }: { birthDate: string }) {
  const [age, setAge] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const birth = new Date(birthDate);
      const diff = now.getTime() - birth.getTime();
      const years = diff / (1000 * 60 * 60 * 24 * 365.25);
      setAge(years.toFixed(9));
    }, 50);
    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="age-clock">
      <span className="text-gold">Age:</span> {age}
    </div>
  );
}

const DISCOVERIES = [
  { name: 'BEKANTAN-1', basin: 'Malay Basin', play: 'Structural', note: 'Shallowest flowing oil discovery in Malay Basin history' },
  { name: 'PUTERI BASEMENT-1', basin: 'Malay Basin', play: 'Fractured Basement', note: 'Critical to PSC block commercial value' },
  { name: 'LEBAH EMAS-1', basin: 'Malay Basin', play: 'New Play Concept', note: 'Frontier slope play discovery' },
  { name: 'BUNGA TASBIH-1', basin: 'Malay Basin', play: 'Structural/Stratigraphic', note: 'MBR+ Round I, July 2024' },
];

function App() {
  return (
    <div className="container">
      <header>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div className="motto">Ditempa Bukan Diberi</div>
          <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.02em' }}>ARIF FAZIL</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p className="mono text-gold">Senior Exploration Geoscientist @ PETRONAS</p>
            <AgeClock birthDate="1990-05-22" />
          </div>
        </div>
      </header>

      <section className="hero">
        <h2 className="hero-title">
          Listening to the <span className="text-gold">Earth</span>.<br />
          Interpreting the subsurface.<br />
          Decisions under uncertainty.
        </h2>
        <p className="hero-subtitle">
          I bridge the physical truth of the subsurface with digital governance—
          explorationist by nature, architect of arifOS by necessity.
          13+ years forging clarity where data ends and judgment begins.
        </p>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value text-gold">13+</span>
          <span className="stat-label">Years Experience</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-gold">4</span>
          <span className="stat-label">Major Discoveries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value text-gold">2</span>
          <span className="stat-label">Basins Explored</span>
        </div>
      </div>

      <section className="section">
        <h3 className="section-title text-gold">Professional Journey</h3>
        <p style={{ marginBottom: '2rem', maxWidth: '700px', lineHeight: '1.7' }}>
          My work is simple: read the Earth's quiet signals, translate them into high-stakes decisions, 
          and never forget that every interpretation is provisional. The same discipline—rigorous verification, 
          calibrated humility, and respect for what remains unknown—gave birth to <strong>arifOS</strong>.
        </p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Well Name</th>
                <th>Basin</th>
                <th>Play Type</th>
                <th>Significance</th>
              </tr>
            </thead>
            <tbody>
              {DISCOVERIES.map(d => (
                <tr key={d.name}>
                  <td className="discovery-name">{d.name}</td>
                  <td>{d.basin}</td>
                  <td className="mono">{d.play}</td>
                  <td className="scar-desc">{d.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h3 className="section-title text-gold">The Trinity Architecture</h3>
        <div className="trinity-grid">
          <div className="ring-card" style={{ borderColor: 'var(--accent-red)' }}>
            <span className="ring-symbol">Ψ</span>
            <h4 className="ring-name">SOUL</h4>
            <p className="mono text-red" style={{ marginBottom: '0.5rem' }}>Human Anchor</p>
            <p className="ring-desc">Personal identity, philosophy, and lived witness.</p>
          </div>
          <div className="ring-card" style={{ borderColor: 'var(--accent-gold)' }}>
            <span className="ring-symbol">Ω</span>
            <h4 className="ring-name">MIND</h4>
            <p className="mono text-gold" style={{ marginBottom: '0.5rem' }}>Theory & Law</p>
            <p className="ring-desc">Constitutional axioms and philosophical grounding of arifOS.</p>
          </div>
          <div className="ring-card" style={{ borderColor: '#2563eb' }}>
            <span className="ring-symbol">Δ</span>
            <h4 className="ring-name">BODY</h4>
            <p className="mono" style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Execution</p>
            <p className="ring-desc">Production runtime, MCP tools, and metabolic kernel.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h3 className="section-title text-gold">Dynamic Integration</h3>
        <div className="integration-card">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-live">LIVE</span>
                <h4 style={{ fontSize: '1.2rem' }}>GEOX Earth Witness</h4>
              </div>
              <p className="ring-desc">Governed geological intelligence coprocessor. FastMCP-powered well log interpretation.</p>
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-live">LIVE</span>
                <h4 style={{ fontSize: '1.2rem' }}>arifOS MCP</h4>
              </div>
              <p className="ring-desc">Constitutional MCP kernel with live telemetry, tool registry, and VAULT999 audit logging.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <h3 className="section-title text-gold">Get In Touch</h3>
        <div className="contact-list">
          <a href="https://t.me/ariffazil" className="contact-link">Telegram</a>
          <a href="https://linkedin.com/in/ariffazil" className="contact-link">LinkedIn</a>
          <a href="mailto:arifbfazil@gmail.com" className="contact-link">Email</a>
          <a href="https://github.com/ariffazil" className="contact-link">GitHub</a>
        </div>
      </section>

      <footer>
        <p className="motto" style={{ marginBottom: '1rem' }}>Forged, Not Given — ΔΩΨ | ARIF</p>
        <p className="mono">© 2026 ARIF FAZIL. All rights reserved.</p>
        <p className="mono" style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.5 }}>
          Constitutional Version: arifOS v54.1-SEAL
        </p>
      </footer>
    </div>
  );
}

export default App;
