import {
  contactLinks,
  wellsPortfolio,
  systemProjects,
} from '@/data/siteContent';

export function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" style={{ padding: '5rem 0 4rem' }}>
        <div className="site-frame">
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: 'var(--muted)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            ΔΩΨ · Ditempa Bukan Diberi
          </p>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
            Arif Fazil
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: '600px' }}>
            ΔΩΨ Architect · Creator of arifOS<br />
            Exploration geoscientist, offshore Malaysia
          </p>

          <p style={{ maxWidth: '560px', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--text-secondary, var(--muted))' }}>
            I build sovereign AI systems that hold up under real operating conditions —
            constitutional kernels, earth-intelligence engines, and capital logic.
            The geology work came first: reading basin signals, making decisions on incomplete data,
            building the tools the work demanded.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a className="button" href="#systems">The Systems</a>
            <a className="button button--secondary" href="#wells">Wells</a>
          </div>
        </div>
      </section>

      {/* ── TRINITY MAP ────────────────────────────────────── */}
      <section className="site-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <div className="site-frame">
          <p className="section-eyebrow">The Trinity</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>
            Three organs. One operating system.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>

            {/* arifOS — SOUL */}
            <div className="trinity-card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ψ</p>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>arifOS</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>Constitutional kernel · F1–F13</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--muted)' }}>
                The law layer. 13 floors that keep AI systems grounded, reversible, and bounded.
                No black boxes. Every decision traceable to a floor.
              </p>
            </div>

            {/* GEOX — FIELD */}
            <div className="trinity-card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Φ</p>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>GEOX</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>Earth intelligence · Physics-9</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--muted)' }}>
                The field layer. Geology and geophysics tools that take physics seriously.
                Basin signals, well logs, seismic — all evidence-gated.
              </p>
            </div>

            {/* WEALTH — CAPITAL */}
            <div className="trinity-card" style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ξ</p>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>WEALTH</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>Capital intelligence · EMV/NPV</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--muted)' }}>
                The capital layer. NPV, EMV, cascade risk, and relational credit logic.
                Decision-quality intelligence for allocation under uncertainty.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── WELLS ─────────────────────────────────────────── */}
      <section className="site-section" id="wells">
        <div className="site-frame">
          <p className="section-eyebrow">Wells</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Prospects that changed the map.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {wellsPortfolio.map((well) => (
              <div key={well.name} style={{ borderLeft: '2px solid var(--accent, #c94b2e)', paddingLeft: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{well.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{well.playType} · {well.basin}</span>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.6rem' }}>{well.summary}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontStyle: 'italic' }}>{well.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEMS ────────────────────────────────────────── */}
      <section className="site-section" id="systems">
        <div className="site-frame">
          <p className="section-eyebrow">Systems</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            What I actually built.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {systemProjects.map((sys) => (
              <div key={sys.title} className="trinity-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{sys.title}</h3>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    background: sys.status === 'LIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                    color: sys.status === 'LIVE' ? '#22c55e' : '#eab308',
                    letterSpacing: '0.05em',
                  }}>
                    {sys.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{sys.role}</p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>{sys.summary}</p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <a href={sys.surfaceHref} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>
                    {sys.surfaceLabel} ↗
                  </a>
                  <a href={sys.artifactHref} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>
                    {sys.artifactLabel} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW I WORK ────────────────────────────────────── */}
      <section className="site-section">
        <div className="site-frame">
          <p className="section-eyebrow">Practice</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            How the work actually goes.
          </h2>
          <ul style={{ lineHeight: 2, paddingLeft: '1.5rem', color: 'var(--muted)' }}>
            <li>Basin analysis and prospect work under real uncertainty — not textbook scenarios.</li>
            <li>Structural interpretation in noisy data — reading signals others miss or dismiss.</li>
            <li>Decisions where knowing what you don&apos;t know matters more than the model.</li>
            <li>Building tools when the work demands them — not because it&apos;s fashionable.</li>
          </ul>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section className="site-section" id="contact">
        <div className="site-frame">
          <p className="section-eyebrow">Contact</p>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
            {contactLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} style={{ textDecoration: 'underline' }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
