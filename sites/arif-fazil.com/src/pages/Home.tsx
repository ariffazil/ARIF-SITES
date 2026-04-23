import {
  collaborationOffers,
  contactLinks,
  ecosystemLinks,
  selectedWork,
  trustStrip,
  workingStyle,
} from '@/data/siteContent';

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="site-frame hero__grid">
          <div>
            <p className="section-eyebrow">human homepage · present layer</p>
            <h1 className="hero__title">Arif Fazil</h1>
            <p className="hero__subtitle">Geologist. AI systems architect. Builder of arifOS.</p>
            <p className="hero__copy">
              Senior exploration geoscientist working with uncertainty, evidence, and real operational
              consequences. I apply that same discipline to AI systems, geospatial products, and
              machine-readable public surfaces.
            </p>
            <div className="hero__actions">
              <a className="button" href="#work">
                View selected work
              </a>
              <a className="button button--secondary" href="/000/">
                Read /000 genesis
              </a>
              <a className="button button--secondary" href="/999/">
                Inspect /999 proof
              </a>
            </div>
          </div>

          <aside className="card card--accent">
            <p className="section-eyebrow">thesis</p>
            <h2 className="section-title section-title--sm">
              Professional at the surface. Origin and proof in deeper layers.
            </h2>
            <p className="section-copy">
              This domain is split on purpose: <code>/</code> is the hireable human entry,{' '}
              <code>/000</code> explains how the work was forged, and <code>/999</code> exposes
              bounded trust artifacts for verifiers and agents.
            </p>
          </aside>
        </div>
      </section>

      <section className="site-section">
        <div className="site-frame">
          <p className="section-eyebrow">trust strip</p>
          <div className="pill-row">
            {trustStrip.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" id="work">
        <div className="site-frame">
          <p className="section-eyebrow">selected work</p>
          <div className="section-head">
            <h2 className="section-title">Work that translates uncertainty into usable structure.</h2>
            <p className="section-copy">
              The through-line is consistent: name the unknowns honestly, build the right frame, and
              leave behind a system other people can trust.
            </p>
          </div>

          <div className="card-grid card-grid--two">
            {selectedWork.map((item) => (
              <article className="card" key={item.title}>
                <p className="card__meta">{item.role}</p>
                <h3 className="card__title">{item.title}</h3>
                <p className="card__body">
                  <strong>Problem:</strong> {item.problem}
                </p>
                <p className="card__body">
                  <strong>Value:</strong> {item.value}
                </p>
                {item.href ? (
                  <p className="card__action">
                    <a href={item.href} target="_blank" rel="noreferrer">
                      Open related surface
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" id="about">
        <div className="site-frame card-grid card-grid--two">
          <article className="card">
            <p className="section-eyebrow">about</p>
            <h2 className="section-title section-title--sm">Grounded by geology, not by branding.</h2>
            <p className="section-copy">
              The public face should stay calm, exact, and useful. The work comes from exploration
              geology, basin thinking, and the habit of showing what is known, what is inferred, and
              what is still uncertain.
            </p>
            <p className="section-copy">
              arifOS emerged from that same discipline: human authority visible, evidence explicit,
              and system behaviour constrained by law instead of optimistic storytelling.
            </p>
          </article>

          <article className="card">
            <p className="section-eyebrow">working style</p>
            <ul className="stack-list">
              {workingStyle.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section">
        <div className="site-frame card-grid card-grid--two">
          <article className="card">
            <p className="section-eyebrow">collaboration</p>
            <h2 className="section-title section-title--sm">Where collaboration makes sense.</h2>
            <ul className="stack-list">
              {collaborationOffers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <p className="section-eyebrow">ecosystem</p>
            <h2 className="section-title section-title--sm">One domain, deeper surfaces.</h2>
            <ul className="link-list">
              {ecosystemLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section" id="contact">
        <div className="site-frame">
          <article className="card card--accent">
            <p className="section-eyebrow">contact</p>
            <h2 className="section-title">Low-friction entry points.</h2>
            <p className="section-copy">
              Use the surfaces that already carry real authorship and proof. This keeps contact grounded
              in the same trust layer as the work itself.
            </p>
            <ul className="link-list link-list--inline">
              {contactLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
