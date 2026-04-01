import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ delay: 0.3 });
      
      heroTl
        .fromTo('.hero-rule', 
          { scaleY: 0 }, 
          { scaleY: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'top' }
        )
        .fromTo('.hero-headline span', 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out' }, 
          '-=0.5'
        )
        .fromTo('.hero-sub', 
          { y: 18, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 
          '-=0.3'
        )
        .fromTo('.hero-cta', 
          { y: 18, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 
          '-=0.4'
        )
        .fromTo('.scroll-hint', 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.5 }, 
          '-=0.2'
        );

      // Hero scroll animation
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set('.hero-headline', { x: 0, opacity: 1 });
            gsap.set('.hero-rule', { scaleY: 1, opacity: 1 });
            gsap.set('.hero-sub', { y: 0, opacity: 1 });
            gsap.set('.hero-cta', { y: 0, opacity: 1 });
          }
        }
      });

      heroScrollTl
        .fromTo('.hero-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-40vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-rule', 
          { scaleY: 1, opacity: 1 }, 
          { scaleY: 0.2, opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-sub', 
          { y: 0, opacity: 1 }, 
          { y: '12vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-cta', 
          { y: 0, opacity: 1 }, 
          { y: '12vh', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo('.scroll-hint', 
          { opacity: 1 }, 
          { opacity: 0, ease: 'power2.in' }, 
          0.6
        );

      // Section 2
      const section2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section2Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section2Tl
        .fromTo('.s2-bg', 
          { scale: 1.08, opacity: 0.6 }, 
          { scale: 1, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s2-rule', 
          { scaleY: 0, opacity: 0 }, 
          { scaleY: 1, opacity: 0.35, ease: 'none' }, 
          0
        )
        .fromTo('.s2-headline', 
          { x: '-50vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s2-body', 
          { y: '10vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s2-cta', 
          { y: '8vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.s2-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-35vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s2-body', 
          { y: 0, opacity: 1 }, 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s2-cta', 
          { y: 0, opacity: 1 }, 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo('.s2-bg', 
          { scale: 1, opacity: 1 }, 
          { scale: 1.05, opacity: 0.6, ease: 'power2.in' }, 
          0.7
        );

      // Section 3
      const section3Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section3Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section3Tl
        .fromTo('.s3-bg', 
          { x: '100vw', scale: 1.06, opacity: 0.7 }, 
          { x: 0, scale: 1, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s3-label', 
          { y: '-6vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s3-headline', 
          { x: '-60vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s3-body', 
          { x: '40vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s3-cta', 
          { x: '40vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.s3-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-40vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s3-body', 
          { x: 0, opacity: 1 }, 
          { x: '30vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s3-cta', 
          { x: 0, opacity: 1 }, 
          { x: '30vw', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo('.s3-bg', 
          { x: 0, opacity: 1 }, 
          { x: '-18vw', opacity: 0.6, ease: 'power2.in' }, 
          0.7
        );

      // Section 4
      const section4Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section4Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section4Tl
        .fromTo('.s4-bg', 
          { scale: 1.07, opacity: 0.65 }, 
          { scale: 1, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s4-headline', 
          { x: '-55vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s4-body', 
          { y: '10vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s4-cta', 
          { y: '8vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.s4-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-35vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s4-body', 
          { y: 0, opacity: 1 }, 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s4-cta', 
          { y: 0, opacity: 1 }, 
          { y: '10vh', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo('.s4-bg', 
          { scale: 1, opacity: 1 }, 
          { scale: 1.05, opacity: 0.6, ease: 'power2.in' }, 
          0.7
        );

      // Section 5
      const section5Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section5Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section5Tl
        .fromTo('.s5-bg', 
          { x: '100vw', scale: 1.06, opacity: 0.7 }, 
          { x: 0, scale: 1, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s5-label', 
          { y: '-6vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s5-headline', 
          { x: '-60vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s5-body', 
          { x: '40vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s5-cta', 
          { x: '40vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.s5-headline', 
          { x: 0, opacity: 1 }, 
          { x: '-40vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s5-body', 
          { x: 0, opacity: 1 }, 
          { x: '30vw', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s5-cta', 
          { x: 0, opacity: 1 }, 
          { x: '30vw', opacity: 0, ease: 'power2.in' }, 
          0.72
        )
        .fromTo('.s5-bg', 
          { x: 0, opacity: 1 }, 
          { x: '-18vw', opacity: 0.6, ease: 'power2.in' }, 
          0.7
        );

      // Section 6
      const section6Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section6Ref.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        }
      });

      section6Tl
        .fromTo('.s6-overlay', 
          { opacity: 0 }, 
          { opacity: 0.55, ease: 'none' }, 
          0
        )
        .fromTo('.s6-headline', 
          { x: '-55vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo('.s6-body', 
          { y: '10vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.s6-cta', 
          { y: '8vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.s6-email', 
          { y: '6vh', opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.15
        )
        .fromTo('.s6-text-group', 
          { y: 0, opacity: 1 }, 
          { y: '-8vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.s6-overlay', 
          { opacity: 0.55 }, 
          { opacity: 0.75, ease: 'power2.in' }, 
          0.7
        );

      // Footer
      gsap.fromTo('.footer-content', 
        { y: 24, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Global snap
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (maxScroll && pinned.length > 0) {
        const pinnedRanges = pinned.map(st => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(
                r => value >= r.start - 0.02 && value <= r.end + 0.02
              );
              if (!inPinned) return value;

              const target = pinnedRanges.reduce(
                (closest, r) =>
                  Math.abs(r.center - value) < Math.abs(closest - value)
                    ? r.center
                    : closest,
                pinnedRanges[0]?.center ?? 0
              );
              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          },
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <div className="grain-overlay" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <a href="/" className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          arif fazil
        </a>
        <button 
          onClick={toggleMenu}
          className="label-mono text-[var(--text-primary)] hover:text-[var(--accent-orange)] transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="menu-overlay">
          <button 
            onClick={toggleMenu}
            className="absolute top-6 right-8 text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
          {['Work', 'Archive', 'About', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={toggleMenu}
              className="menu-link"
            >
              {item}
            </a>
          ))}
        </div>
      )}

      <section ref={heroRef} className="section-pinned bg-[var(--bg-primary)] z-10">
        <div className="hero-rule absolute left-[8vw] top-[18vh] h-[64vh] w-[2px] rule-vertical-accent" style={{ transformOrigin: 'top' }} />
        <div className="hero-headline absolute left-[12vw] top-[26vh] max-w-[80vw]">
          <h1 className="headline-1 text-[var(--text-primary)]">
            <span className="block">ARIF FAZIL</span>
            <span className="block mt-2">DESIGN</span>
            <span className="block mt-2">TECHNOLOGIST</span>
          </h1>
        </div>
        <p className="hero-sub absolute left-[12vw] top-[70vh] body-text max-w-[400px]">
          Portfolio + selected experiments
        </p>
        <a href="#work" className="hero-cta absolute left-[12vw] top-[78vh] cta-button">
          Explore work <ArrowRight size={16} />
        </a>
        <div className="scroll-hint absolute left-1/2 bottom-[6vh] -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="label-mono text-[var(--text-secondary)]">SCROLL</span>
          <ChevronDown size={16} className="text-[var(--text-secondary)]" />
        </div>
      </section>

      <section ref={section2Ref} className="section-pinned z-20">
        <img src="/hero_portrait.jpg" alt="Portrait" className="s2-bg bg-image" />
        <div className="s2-rule absolute left-[6vw] top-[22vh] h-[56vh] w-[1px] rule-vertical" style={{ transformOrigin: 'top' }} />
        <div className="s2-headline absolute left-[10vw] top-[28vh]">
          <h2 className="headline-2 text-[var(--text-primary)]">
            <span className="block">I'M ARIF</span>
            <span className="block mt-1">FAZIL</span>
          </h2>
        </div>
        <p className="s2-body absolute left-[10vw] top-[58vh] max-w-[34vw] body-text text-[var(--text-primary)]">
          I build interfaces, tools, and stories at the edge of design and code.
        </p>
        <a href="#archive" className="s2-cta absolute left-[10vw] top-[74vh] cta-button">
          Read the archive <ArrowRight size={16} />
        </a>
      </section>

      <section ref={section3Ref} id="work" className="section-pinned z-30">
        <img src="/project_01.jpg" alt="Project 01" className="s3-bg bg-image" />
        <span className="s3-label absolute left-[8vw] top-[10vh] label-mono text-[var(--text-primary)]">PROJECT / 01</span>
        <div className="s3-headline absolute left-[8vw] top-[18vh]">
          <h2 className="headline-1 text-[var(--text-primary)]">
            <span className="block">ARIF FAZIL</span>
            <span className="block mt-2">DESIGN</span>
          </h2>
        </div>
        <p className="s3-body absolute right-[8vw] bottom-[18vh] max-w-[34vw] body-text text-[var(--text-primary)] text-right">
          A design system and web experience for a product launch—built for speed, clarity, and conversion.
        </p>
        <a href="#case-study-01" className="s3-cta absolute right-[8vw] bottom-[10vh] cta-button">
          View case study <ArrowRight size={16} />
        </a>
      </section>

      <section ref={section4Ref} className="section-pinned z-40">
        <img src="/philosophy_portrait.jpg" alt="Philosophy" className="s4-bg bg-image" />
        <div className="s4-headline absolute left-[8vw] top-[28vh]">
          <h2 className="headline-2 text-[var(--text-primary)]">
            <span className="block">ARIF</span>
            <span className="block mt-1">FAZIL</span>
          </h2>
        </div>
        <p className="s4-body absolute left-[8vw] top-[52vh] max-w-[34vw] body-text text-[var(--text-primary)]">
          Systems thinking, typography, and motion—built to last beyond trends.
        </p>
        <a href="#process" className="s4-cta absolute left-[8vw] top-[70vh] cta-button">
          See the process <ArrowRight size={16} />
        </a>
      </section>

      <section ref={section5Ref} className="section-pinned z-50">
        <img src="/project_02.jpg" alt="Project 02" className="s5-bg bg-image" />
        <span className="s5-label absolute left-[8vw] top-[10vh] label-mono text-[var(--text-primary)]">PROJECT / 02</span>
        <div className="s5-headline absolute left-[8vw] top-[18vh]">
          <h2 className="headline-1 text-[var(--text-primary)]">
            <span className="block">ARIF FAZIL</span>
            <span className="block mt-2">DESIGN</span>
          </h2>
        </div>
        <p className="s5-body absolute right-[8vw] bottom-[18vh] max-w-[34vw] body-text text-[var(--text-primary)] text-right">
          An interactive storytelling piece—scroll-driven, responsive, and performant.
        </p>
        <a href="#case-study-02" className="s5-cta absolute right-[8vw] bottom-[10vh] cta-button">
          View case study <ArrowRight size={16} />
        </a>
      </section>

      <section ref={section6Ref} id="contact" className="section-pinned z-[60]">
        <img src="/closing_portrait.jpg" alt="Closing" className="s6-bg bg-image" />
        <div className="s6-overlay earth-overlay" />
        <div className="s6-text-group">
          <div className="s6-headline absolute left-[8vw] top-[26vh]">
            <h2 className="headline-2 text-[var(--text-primary)]">
              <span className="block">ARIF</span>
              <span className="block mt-1">FAZIL</span>
            </h2>
          </div>
          <p className="s6-body absolute left-[8vw] top-[50vh] max-w-[34vw] body-text text-[var(--text-primary)]">
            Available for select collaborations. Tell me what you're building.
          </p>
          <a href="mailto:hello@ariffazil.com" className="s6-cta absolute left-[8vw] top-[68vh] cta-button">
            Send a message <ArrowRight size={16} />
          </a>
          <span className="s6-email absolute left-[8vw] top-[76vh] label-mono text-[var(--text-secondary)]">
            hello@ariffazil.com
          </span>
        </div>
      </section>

      <footer className="footer relative z-[70] bg-[var(--bg-primary)] py-[8vh] px-[8vw]">
        <div className="footer-content max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h3 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-4">
                Let's build something precise.
              </h3>
              <p className="body-text mb-8">
                Open for freelance and studio collaborations.
              </p>
              <a 
                href="mailto:hello@ariffazil.com"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--accent-orange)] text-[var(--accent-orange)] font-mono text-sm tracking-wide hover:bg-[var(--accent-orange)] hover:text-[var(--bg-primary)] transition-colors"
              >
                Start a project
              </a>
            </div>
            <div className="flex flex-col md:items-end gap-8">
              <div className="flex flex-wrap gap-8">
                {['Work', 'Archive', 'About', 'Contact'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="label-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-8">
                {['Twitter', 'LinkedIn', 'GitHub'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="label-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border)]">
            <span className="label-mono text-[var(--text-secondary)]">
              © 2026 Arif Fazil
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;