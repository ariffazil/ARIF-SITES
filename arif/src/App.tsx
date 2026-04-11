import { useEffect, useState } from 'react';
import './index.css';

// Age Clock with fractal precision
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
      <span style={{ color: 'var(--text-muted)' }}>Age:</span> {age}
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
    <div className="app">
      {/* Fractal Background */}
      <div className="fractal-bg" />
      
      {/* Header */}
      <header>
        <div className="container">
          <div className="motto">Ditempa Bukan Diberi</div>
        </div>
      </header>

      {/* Hero - ARIF FAZIL as First Act */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-name">
            <span className="arif">ARIF</span>
            <span className="fazil">FAZIL</span>
          </h1>
          
          <div className="hero-paradox">
            "The one who knows he doesn't know.<br />
            The name is the first act of creation."
          </div>
          
          <p className="hero-subtitle">
            Listening to the <span style={{ color: 'var(--primer-red)' }}>Earth</span>. 
            Interpreting the <span style={{ color: 'var(--primer-blue)' }}>subsurface</span>. 
            Decisions under <span style={{ color: 'var(--primer-yellow)' }}>uncertainty</span>.
          </p>
          
          <div className="hero-meta">
            <span className="role">Senior Exploration Geoscientist @ PETRONAS</span>
            <AgeClock birthDate="1990-05-22" />
          </div>
        </div>
      </section>

      {/* Strata Divider */}
      <div className="strata-divider" />

      {/* Stats */}
      <section className="section strata">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">13+</span>
              <span className="stat-label">Years Forging</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">4</span>
              <span className="stat-label">Discoveries</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">2</span>
              <span className="stat-label">Basins Explored</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Journey */}
      <section className="section strata">
        <div className="container">
          <h3 className="section-title">Journey</h3>
          <p style={{ maxWidth: '700px', lineHeight: '1.8', color: 'var(--text-dim)', marginBottom: '2rem' }}>
            My work is simple: read the Earth's quiet signals, translate them into high-stakes decisions, 
            and never forget that every interpretation is provisional. The same discipline—rigorous verification, 
            calibrated humility, and respect for what remains unknown—gave birth to <strong style={{ color: 'var(--primer-yellow)' }}>arifOS</strong>.
          </p>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Well</th>
                  <th>Basin</th>
                  <th>Play</th>
                  <th>Significance</th>
                </tr>
              </thead>
              <tbody>
                {DISCOVERIES.map(d => (
                  <tr key={d.name}>
                    <td className="discovery-name">{d.name}</td>
                    <td>{d.basin}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d.play}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Strata Divider */}
      <div className="strata-divider" />

      {/* Trinity Architecture */}
      <section className="section strata">
        <div className="container">
          <h3 className="section-title">Trinity</h3>
          <div className="trinity-grid">
            <div className="ring-card">
              <span className="ring-symbol">Ψ</span>
              <h4 className="ring-name">SOUL</h4>
              <p style={{ color: 'var(--primer-red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Human Anchor</p>
              <p className="ring-desc">Personal identity, philosophy, and the gentle jaggedness of being human.</p>
            </div>
            <div className="ring-card">
              <span className="ring-symbol">Ω</span>
              <h4 className="ring-name">MIND</h4>
              <p style={{ color: 'var(--primer-blue)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Theory & Law</p>
              <p className="ring-desc">Constitutional axioms and the philosophical grounding of arifOS.</p>
            </div>
            <div className="ring-card">
              <span className="ring-symbol">Δ</span>
              <h4 className="ring-name">BODY</h4>
              <p style={{ color: 'var(--primer-yellow)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Execution</p>
              <p className="ring-desc">Production runtime, MCP tools, and the metabolic execution kernel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Integrations */}
      <section className="section strata">
        <div className="container">
          <h3 className="section-title">Live</h3>
          <div className="integration-grid">
            <div className="integration-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge">LIVE</span>
                <h4 style={{ fontSize: '1.1rem' }}>GEOX Earth Witness</h4>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                Governed geological intelligence coprocessor. FastMCP-powered well log interpretation 
                with constitutional safeguards.
              </p>
            </div>
            <div className="integration-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge">LIVE</span>
                <h4 style={{ fontSize: '1.1rem' }}>arifOS MCP</h4>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                Constitutional MCP kernel with live telemetry, tool registry, and VAULT999 
                immutable audit logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section strata" id="contact">
        <div className="container">
          <h3 className="section-title">Connect</h3>
          <div className="contact-list">
            <a href="https://t.me/ariffazil" className="contact-link">Telegram</a>
            <a href="https://linkedin.com/in/ariffazil" className="contact-link">LinkedIn</a>
            <a href="mailto:arifbfazil@gmail.com" className="contact-link">Email</a>
            <a href="https://github.com/ariffazil" className="contact-link">GitHub</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-seal">Forged, Not Given — ΔΩΨ | ARIF</div>
        <div className="footer-copy">
          © 2026 ARIF FAZIL. All rights reserved.<br />
          Constitutional Version: arifOS v54.1-SEAL
        </div>
      </footer>
    </div>
  );
}

export default App;
