import {
  contactLinks,
  practiceAreas,
  wellsPortfolio,
} from '@/data/siteContent';

export function Home() {
  return (
    <>
      <section className="hero" style={{ padding: '4rem 0 3rem' }}>
        <div className="site-frame">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Arif Fazil
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            Exploration geoscientist, offshore Malaysia. Also writes code.
          </p>
          <p style={{ maxWidth: '540px', lineHeight: 1.7, marginBottom: '2rem' }}>
            I work the basin — reading signals, building prospects, making decisions when the data isn&apos;t clean.
            The software grew out of that: needed better tools for thinking and verifying, so I built them.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a className="button" href="#wells">Wells</a>
            <a className="button button--secondary" href="/999/">/999 for AI</a>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-frame">
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', fontSize: '0.9rem' }}>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Background</p>
              <p>PETRONAS Carigali, offshore Malaysia</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Training</p>
              <p>Geology, geophysics, economics — UW Madison</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>What I actually do</p>
              <p>Prospect work, basin analysis, write code when it helps</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section" id="wells">
        <div className="site-frame">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Wells</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {wellsPortfolio.map((well) => (
              <div key={well.name} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.25rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  {well.basin}
                </p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{well.name}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{well.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-frame">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>How I work</h2>
          <ul style={{ lineHeight: 1.8, paddingLeft: '1.5rem' }}>
            {practiceAreas.map((item) => (
              <li key={item} style={{ marginBottom: '0.5rem' }}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-section" id="contact">
        <div className="site-frame">
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Contact</p>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8 }}>
            {contactLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
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