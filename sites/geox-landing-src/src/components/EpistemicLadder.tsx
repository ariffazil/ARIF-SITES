import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EpistemicTag from './EpistemicTag'
import type { EpistemicLayer } from './EpistemicTag'

gsap.registerPlugin(ScrollTrigger)

const BANDS: {
  layer: EpistemicLayer
  color: string
  glow: string
  desc: string
  artifacts: string
  claim: string
}[] = [
  {
    layer: 'OBS',
    color: '#5FD68A',
    glow: '0 0 40px #5FD68A33',
    desc: 'Wireline logs (LAS), SEG-Y trace amplitudes, core measurements. The ground truth. No interpretation.',
    artifacts: 'LAS · SEG-Y · CORE PHOTOS',
    claim: 'CLAIM',
  },
  {
    layer: 'DER',
    color: '#D9A441',
    glow: '0 0 40px #D9A44133',
    desc: 'Effective porosity, acoustic impedance, water saturation. Physics applied to observation.',
    artifacts: 'PHIE · AI · SW',
    claim: 'CLAIM',
  },
  {
    layer: 'INT',
    color: '#E8733B',
    glow: '0 0 40px #E8733B33',
    desc: 'Horizons, fault polygons, reservoir–seal–charge frameworks. Geological judgment, falsifiable.',
    artifacts: 'HORIZONS · FAULTS · PLAYS',
    claim: 'PLAUSIBLE',
  },
  {
    layer: 'SPEC',
    color: '#8FA8C8',
    glow: '0 0 40px #8FA8C833',
    desc: 'Migration pathways, fluid phases, compartmentalization. Hypothesis space — explicitly capped.',
    artifacts: 'MIGRATION · PHASE · COMPARTMENTS',
    claim: 'HYPOTHESIS',
  },
]

const RASA_LINE = 'RASA = evidence_credit × (1 − u_ambiguity)  →  capped at 0.90'

/** Pinned scroll story: four epistemic strata bands reveal in sequence. GSAP-isolated component. */
export default function EpistemicLadder() {
  const root = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const bands = gsap.utils.toArray<HTMLElement>('.epi-band')
      gsap.set(bands, { clipPath: 'inset(0 100% 0 0)' })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            setTyped(Math.floor(gsap.utils.clamp(0, 1, (self.progress - 0.85) / 0.15) * RASA_LINE.length))
          },
        },
      })
      bands.forEach((band, i) => {
        const at = [0.05, 0.25, 0.45, 0.65][i]
        tl.to(band, { clipPath: 'inset(0 0% 0 0)', duration: 0.18, ease: 'power3.out' }, at)
        tl.to(band, { boxShadow: BANDS[i].glow, duration: 0.08 }, at + 0.14)
        if (i > 0) tl.to(bands[i - 1], { opacity: 0.5, duration: 0.1 }, at)
      })
      const depth = { v: 0 }
      const depthEl = el.querySelector('.depth-label')
      tl.to('.depth-fill', { height: '100%', duration: 0.85, ease: 'none' }, 0)
      tl.to(
        depth,
        {
          v: -4500,
          duration: 0.85,
          ease: 'none',
          onUpdate: () => {
            if (depthEl) depthEl.textContent = String(Math.round(depth.v / 50) * 50)
          },
        },
        0,
      )
      tl.fromTo('.rasa-cap', { scale: 1 }, { scale: 1.06, yoyo: true, repeat: 1, duration: 0.05 }, 0.92)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative border-y border-strata-700 bg-basalt-950">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-8 py-24 max-md:px-5 md:grid-cols-2">
        <div>
          <p className="eyebrow text-magma-500">Epistemic Ladder</p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-[1.08] text-bone-100 max-md:text-3xl">
            Evidence ascends.
            <br />
            Certainty descends.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.65] text-bone-400">
            Every claim GEOX emits is tagged to its layer of knowing. agent:{' '}
            <code className="font-mono text-[13px] text-telemetry-400">geox.tag_epistemic()</code>
          </p>
          {/* depth ruler */}
          <div className="mt-12 flex items-end gap-3">
            <div className="relative h-48 w-1 overflow-hidden rounded bg-strata-700/50">
              <div className="depth-fill absolute bottom-0 left-0 w-full bg-magma-500/70" style={{ height: 0 }} />
            </div>
            <span className="font-mono text-[13px] tabular-nums text-bone-600">
              <span className="depth-label">0</span>m
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          {BANDS.map((b) => (
            <div
              key={b.layer}
              className="epi-band rounded-lg border border-strata-700 bg-basalt-900 p-5"
              style={{ borderLeft: `3px solid ${b.color}` }}
            >
              <div className="flex items-center justify-between gap-3">
                <EpistemicTag layer={b.layer} withName />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: b.color }}>
                  {b.claim}
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-[1.6] text-bone-400">{b.desc}</p>
              <p className="mt-2 font-mono text-[11px] text-bone-600">{b.artifacts}</p>
            </div>
          ))}

          <div className="mt-4 rounded-lg border border-amber-450/40 bg-basalt-900 p-5">
            <p className="min-h-[24px] font-mono text-[14px] text-amber-450">
              {RASA_LINE.slice(0, typed)}
              <span className="rasa-cap ml-1 inline-block font-semibold text-amber-450">
                {typed >= RASA_LINE.length ? '' : ''}
              </span>
            </p>
            <p className="mt-2 text-[13px] leading-[1.6] text-bone-600">
              F7 Humility: 10% epistemic room is mandatory. The Earth always keeps its margin.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
