import { useEffect, useState } from "react";

type BriefingMeta = {
  date: string;
  generated_at: string;
  source: string;
  model_note: string;
  delta_vs_yesterday?: {
    klci_change: number;
    ringgit_change: number;
    brent_change: number;
  };
};

type SoWhatItem = {
  domain: string;
  signal: string;
  for_aia: string;
  for_izzu: string;
  for_aliff: string;
  for_arif: string;
  tone: string;
};

type Briefing = {
  meta: BriefingMeta;
  bursa: {
    klci_close: number | null;
    klci_change_pct: number | null;
    most_active: { title: string; url: string; desc: string } | null;
    top_gainers_search: { title: string; desc: string }[];
    source_urls: string[];
  };
  ringgit: {
    usd_myr: number | null;
    trend: string | null;
    sources: string[];
  };
  economy: { items: { title: string; desc: string; category: string }[] };
  politics: {
    narratives: { title: string; desc: string; source: string }[];
    economy_policy: { title: string; desc: string }[];
    regional: { title: string; desc: string }[];
  };
  social: {
    cost_of_living: { title: string; desc: string }[];
    labor: { title: string; desc: string }[];
    youth_career: { title: string; desc: string }[];
  };
  oil_energy: {
    brent_price: number | null;
    malaysia_oil: { title: string; desc: string }[];
    energy_transition: { title: string; desc: string }[];
  };
  global: {
    fed: { items: { title: string; desc: string }[] };
    china: { items: { title: string; desc: string }[] };
    asean: { items: { title: string; desc: string }[] };
  };
  so_what: SoWhatItem[];
};

type ArchiveEntry = {
  briefings: string[];
  last_updated: string;
};

function DeltaChip({ value, label, decimals = 2 }: { value: number; label: string; decimals?: number }) {
  if (value === 0) return null;
  const color = value > 0 ? "#22c55e" : "#ef4444";
  const sign = value > 0 ? "+" : "";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      fontSize: "0.7rem", padding: "0.1rem 0.4rem", borderRadius: "4px",
      background: `${color}22`, color: color, fontFamily: "IBM Plex Mono, monospace",
    }}>
      {sign}{value.toFixed(decimals)} {label}
    </span>
  );
}

function SoWhatCard({ item, idx: _idx }: { item: SoWhatItem; idx: number }) {
  const domainColor: Record<string, string> = {
    MARKET: "#3b82f6",
    "FX / RINGGIT": "#8b5cf6",
    "OIL & GAS": "#f59e0b",
    "COST OF LIVING": "#ef4444",
    POLITICS: "#64748b",
  };
  const accent = domainColor[item.domain] || "#D4A853";

  return (
    <div style={{
      border: `1px solid ${accent}44`,
      borderRadius: "12px",
      padding: "1.25rem",
      marginBottom: "1rem",
      background: `${accent}08`,
    }}>
      {/* Domain badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase",
          color: accent, border: `1px solid ${accent}`, borderRadius: "4px",
          padding: "0.1rem 0.5rem", fontFamily: "IBM Plex Mono, monospace",
        }}>
          {item.domain}
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>
          {item.signal}
        </span>
      </div>

      {/* AIA cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
        <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#D4A853", marginBottom: "0.25rem", textTransform: "uppercase" }}>All AIA</p>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{item.for_aia}</p>
        </div>
        <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#3b82f6", marginBottom: "0.25rem", textTransform: "uppercase" }}>Izzu</p>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{item.for_izzu}</p>
        </div>
        <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#22c55e", marginBottom: "0.25rem", textTransform: "uppercase" }}>Aliff</p>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{item.for_aliff}</p>
        </div>
        <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#f59e0b", marginBottom: "0.25rem", textTransform: "uppercase" }}>Arif</p>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{item.for_arif}</p>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({
  title, icon, children, accent = "#D4A853"
}: {
  title: string; icon: string; children: React.ReactNode; accent?: string;
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{
        fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
        color: accent, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem",
      }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export function Wealth() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [archives, setArchives] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const [bRes, aRes] = await Promise.all([
          fetch("/data/wealth/latest.json"),
          fetch("/data/wealth/archive_index.json"),
        ]);
        if (!bRes.ok) throw new Error(`HTTP ${bRes.status}`);
        const b: Briefing = await bRes.json();
        const a: ArchiveEntry = aRes.ok ? await aRes.json() : { briefings: [] };
        setBriefing(b);
        setArchives(a.briefings || []);
        setLastUpdated(b.meta.generated_at);
      } catch (e: any) {
        setError(e.message || "Failed to load briefing");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>Ξ</div>
          <p style={{ color: "var(--muted)", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem" }}>
            Loading WEALTH briefing...
          </p>
        </div>
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <div style={{ padding: "4rem 0", textAlign: "center" }}>
        <p style={{ color: "#ef4444", marginBottom: "1rem" }}>⚠ Failed to load briefing</p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{error || "No data"}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Briefing runs daily at 09:00 UTC (5pm MYT). If you're seeing this during market hours, check back after close.
        </p>
      </div>
    );
  }

  const delta = briefing.meta.delta_vs_yesterday;

  return (
    <div>
      {/* ── HERO HEADER ─────────────────────────────────── */}
      <section style={{ padding: "3rem 0 2rem", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--muted)",
            marginBottom: "0.5rem", textTransform: "uppercase",
          }}>
            ΔΩΨ · WEALTH · Capital Intelligence
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem", lineHeight: 1.1 }}>
            Daily Briefing
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            {briefing.meta.date} · BURSA Malaysia + Ekonomi + Politik + Social
          </p>

          {/* Key metrics strip */}
          <div style={{
            display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center",
            padding: "0.75rem 1rem", background: "var(--surface-2)",
            borderRadius: "8px", border: "1px solid var(--border)",
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>FBM KLCI</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "IBM Plex Mono, monospace" }}>
                {briefing.bursa.klci_close?.toLocaleString("en-MY", { minimumFractionDigits: 2 }) ?? "—"}
              </p>
              {delta && <DeltaChip value={delta.klci_change} label="pts" decimals={2} />}
            </div>
            <div style={{ width: "1px", background: "var(--border)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>USD/MYR</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "IBM Plex Mono, monospace" }}>
                {briefing.ringgit.usd_myr?.toFixed(4) ?? "—"}
              </p>
              {delta && <DeltaChip value={delta.ringgit_change} label="MYR" decimals={4} />}
            </div>
            <div style={{ width: "1px", background: "var(--border)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Brent Crude</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "IBM Plex Mono, monospace" }}>
                {briefing.oil_energy.brent_price ? `$${briefing.oil_energy.brent_price.toFixed(2)}` : "—"}
              </p>
              <p style={{ fontSize: "0.65rem", color: "var(--muted)" }}>per barrel</p>
              {delta && <DeltaChip value={delta.brent_change} label="$" decimals={2} />}
            </div>
            <div style={{ width: "1px", background: "var(--border)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>KLCI Chg</p>
              <p style={{
                fontSize: "1.1rem", fontWeight: 700, fontFamily: "IBM Plex Mono, monospace",
                color: (briefing.bursa.klci_change_pct ?? 0) >= 0 ? "#22c55e" : "#ef4444"
              }}>
                {briefing.bursa.klci_change_pct != null
                  ? `${briefing.bursa.klci_change_pct >= 0 ? "+" : ""}${briefing.bursa.klci_change_pct.toFixed(2)}%`
                  : "—"}
              </p>
            </div>
          </div>

          <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.75rem" }}>
            Generated: {new Date(lastUpdated).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })} MYT ·{" "}
            <a href="/data/wealth/archive_index.json" target="_blank" style={{ color: "#D4A853" }}>View archive</a>
            {archives.length > 1 && ` · ${archives.length - 1} past briefings available`}
          </p>
        </div>
      </section>

      {/* ── SO WHAT ──────────────────────────────────────── */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", color: "#D4A853",
            marginBottom: "1.5rem", textTransform: "uppercase",
          }}>
            ◆ SO WHAT — Why This Matters for AIA
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "600px", lineHeight: 1.7 }}>
            Data without context is noise. This section translates the numbers into decisions:
            what to watch, what to avoid, and how each of us in the AIA circle should think about today.
          </p>

          {briefing.so_what.length === 0 && (
            <div style={{
              padding: "2rem", textAlign: "center", border: "1px dashed var(--border)",
              borderRadius: "8px", color: "var(--muted)"
            }}>
              <p style={{ fontSize: "0.85rem" }}>Briefing data loaded. SO WHAT synthesis will appear after market close research.</p>
            </div>
          )}

          {briefing.so_what.map((item, i) => (
            <SoWhatCard key={i} item={item} idx={i} />
          ))}
        </div>
      </section>

      {/* ── MARKET DETAIL ─────────────────────────────────── */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>

            {/* BURSA */}
            <SectionBlock title="BURSA Malaysia" icon="📈" accent="#3b82f6">
              {briefing.bursa.klci_close && (
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                  <strong style={{ fontFamily: "IBM Plex Mono" }}>FBM KLCI:</strong>{" "}
                  {briefing.bursa.klci_close.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                  {briefing.bursa.klci_change_pct != null && (
                    <span style={{ color: briefing.bursa.klci_change_pct >= 0 ? "#22c55e" : "#ef4444", marginLeft: "0.5rem" }}>
                      {briefing.bursa.klci_change_pct >= 0 ? "▲" : "▼"} {Math.abs(briefing.bursa.klci_change_pct).toFixed(2)}%
                    </span>
                  )}
                </p>
              )}
              {briefing.bursa.most_active && (
                <div style={{ background: "var(--surface-2)", borderRadius: "6px", padding: "0.75rem", marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.65rem", color: "#3b82f6", textTransform: "uppercase", marginBottom: "0.25rem" }}>Most Active</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{briefing.bursa.most_active.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>{briefing.bursa.most_active.desc}</p>
                </div>
              )}
              {briefing.bursa.source_urls.length > 0 && (
                <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                  Sources:{" "}
                  {briefing.bursa.source_urls.slice(0, 2).map((u, i) => (
                    <a key={i} href={u} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#3b82f6", marginRight: "0.5rem", fontFamily: "IBM Plex Mono" }}>
                      {`[${i + 1}]`}
                    </a>
                  ))}
                </p>
              )}
            </SectionBlock>

            {/* RINGGIT */}
            <SectionBlock title="Ringgit & FX" icon="💱" accent="#8b5cf6">
              {briefing.ringgit.usd_myr && (
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "0.5rem" }}>
                  <strong style={{ fontFamily: "IBM Plex Mono" }}>USD/MYR:</strong> {briefing.ringgit.usd_myr.toFixed(4)}
                </p>
              )}
              {briefing.ringgit.trend && (
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "0.75rem",
                  padding: "0.5rem 0.75rem", background: "var(--surface-2)", borderRadius: "6px",
                  borderLeft: `2px solid #8b5cf6` }}>
                  {briefing.ringgit.trend}
                </p>
              )}
            </SectionBlock>

            {/* OIL & GAS */}
            <SectionBlock title="Oil & Gas" icon="🛢️" accent="#f59e0b">
              {briefing.oil_energy.brent_price && (
                <p style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "IBM Plex Mono", marginBottom: "0.75rem" }}>
                  ${briefing.oil_energy.brent_price.toFixed(2)}<span style={{ fontSize: "0.7rem", fontWeight: 400 }}>/bbl</span>
                </p>
              )}
              {briefing.oil_energy.malaysia_oil.map((item, i) => (
                <p key={i} style={{ fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  <strong>{item.title}</strong> — {item.desc.slice(0, 150)}
                </p>
              ))}
            </SectionBlock>

            {/* GLOBAL */}
            <SectionBlock title="Global Context" icon="🌏" accent="#64748b">
              {briefing.global.fed.items.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.65rem", color: "#ef4444", textTransform: "uppercase", marginBottom: "0.25rem" }}>US Fed</p>
                  {briefing.global.fed.items.map((item, i) => (
                    <p key={i} style={{ fontSize: "0.78rem", lineHeight: 1.5, marginBottom: "0.25rem" }}>{item.desc.slice(0, 180)}</p>
                  ))}
                </div>
              )}
              {briefing.global.china.items.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.65rem", color: "#ef4444", textTransform: "uppercase", marginBottom: "0.25rem" }}>China</p>
                  {briefing.global.china.items.map((item, i) => (
                    <p key={i} style={{ fontSize: "0.78rem", lineHeight: 1.5, marginBottom: "0.25rem" }}>{item.desc.slice(0, 180)}</p>
                  ))}
                </div>
              )}
            </SectionBlock>
          </div>
        </div>
      </section>

      {/* ── EKONOMI ──────────────────────────────────────── */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <SectionBlock title="Ekonomi Malaysia" icon="🏛️" accent="#22c55e">
            {briefing.economy.items.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data available.</p>
            )}
            {briefing.economy.items.map((item, i) => (
              <div key={i} style={{
                padding: "0.75rem", borderRadius: "6px", marginBottom: "0.5rem",
                background: "var(--surface-2)", borderLeft: `2px solid #22c55e`
              }}>
                <p style={{ fontSize: "0.75rem", color: "#22c55e", marginBottom: "0.25rem", textTransform: "uppercase" }}>{item.category}</p>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </SectionBlock>
        </div>
      </section>

      {/* ── POLITIK ──────────────────────────────────────── */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <SectionBlock title="Politik Malaysia" icon="⚖️" accent="#64748b">
            {briefing.politics.narratives.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data available.</p>
            )}
            {briefing.politics.narratives.map((item, i) => (
              <div key={i} style={{
                padding: "0.75rem", borderRadius: "6px", marginBottom: "0.5rem",
                background: "var(--surface-2)"
              }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.25rem" }}>{item.title}</p>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--muted)" }}>{item.desc}</p>
              </div>
            ))}
          </SectionBlock>
        </div>
      </section>

      {/* ── SOCIAL ────────────────────────────────────────── */}
      <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="site-frame">
          <SectionBlock title="Rakyat & Society" icon="🏠" accent="#ef4444">
            {briefing.social.cost_of_living.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data available.</p>
            )}
            {briefing.social.cost_of_living.map((item, i) => (
              <div key={i} style={{ marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600 }}>{item.title}</p>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--muted)" }}>{item.desc}</p>
              </div>
            ))}
            {briefing.social.youth_career.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontSize: "0.65rem", color: "#ef4444", textTransform: "uppercase", marginBottom: "0.5rem" }}>Youth & Career</p>
                {briefing.social.youth_career.map((item, i) => (
                  <p key={i} style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--muted)", marginBottom: "0.25rem" }}>
                    {item.desc.slice(0, 200)}
                  </p>
                ))}
              </div>
            )}
          </SectionBlock>
        </div>
      </section>

      {/* ── ARCHIVE ──────────────────────────────────────── */}
      {archives.length > 1 && (
        <section style={{ padding: "2.5rem 0" }}>
          <div className="site-frame">
            <p style={{
              fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--muted)",
              marginBottom: "1rem", textTransform: "uppercase"
            }}>
              ◆ Past Briefings
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {archives.filter(d => d !== briefing.meta.date).map(d => (
                <a key={d} href={`/data/wealth/archive/${d}.json`}
                  target="_blank"
                  style={{
                    padding: "0.25rem 0.6rem", border: "1px solid var(--border)",
                    borderRadius: "4px", color: "var(--text-secondary)",
                  }}>
                  {d}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER NOTE ───────────────────────────────────── */}
      <div style={{ padding: "2rem 0", borderTop: "1px solid var(--border)" }}>
        <div className="site-frame">
          <p style={{ fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "700px" }}>
            <strong style={{ color: "var(--text-secondary)" }}>Model note:</strong> {briefing.meta.model_note}
            <br />
            This briefing is synthesized for informational purposes. Not financial advice.
            Verify critical figures independently. Built on arifOS WEALTH engine + Brave Search live research.
          </p>
        </div>
      </div>
    </div>
  );
}
