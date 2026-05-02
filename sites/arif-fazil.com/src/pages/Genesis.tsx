import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { ConstellationHeader } from '@/components/ConstellationHeader';

export function Genesis() {
  return (
    <div className="site-shell">
      <ConstellationNav />
      <main className="site-main">
        <section style={{ padding: '4rem 0' }}>
          <div className="site-frame">
            <ConstellationHeader
              label="Ψ-SOUL · /000/"
              title="GENESIS"
              subtitle="Exploration · VOID playground · Unconstrained drafts"
              badge="GENESIS / EXPERIMENT"
            />

            <div style={{
              border: '1px solid var(--border, #333)',
              borderRadius: '12px',
              padding: '2rem',
              marginTop: '2rem',
              background: 'var(--surface-2, #1a1a1a)',
            }}>
              <p style={{
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                color: 'var(--accent, #D4A853)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}>
                ⚠️ EXPERIMENTAL — zkPC DISCALIMER
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                This space holds raw explorations, early prototypes, and unconstrained ideas.
                Nothing here is finalized, ratified, or sealed. Treat it as a scientific
                sandbox with the explicit disclaimer: <em>what happens in Genesis stays in Genesis</em>.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--muted, #888)' }}>
                The /000 path mirrors arifOS 000_VOID concept — a space for ideas that have
                not yet been through the 13-floor review. Zero commitment. Zero warranty.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>What lives here</h3>
              <ul style={{ lineHeight: 2, paddingLeft: '1.5rem' }}>
                <li>Early-stage ideas before they have a home in the Trinity</li>
                <li>Prototypes that may or may not survive contact with reality</li>
                <li>Raw experiments in the VOID — no floor enforcement yet</li>
                <li>Thought experiments, model sketches, architectural proposals</li>
              </ul>
            </div>

            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              borderLeft: '3px solid var(--accent, #D4A853)',
              background: 'var(--surface-2, #1a1a1a)',
              borderRadius: '0 12px 12px 0',
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted, #888)', fontStyle: 'italic' }}>
                "Intelligence is forged, not given. This is where the forging happens —
                before the seal, before the proof, before the commitment."
              </p>
            </div>
          </div>
        </section>
      </main>
      <ConstellationFooter />
    </div>
  );
}
