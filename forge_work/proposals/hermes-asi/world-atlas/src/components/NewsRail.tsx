import type { GDELTArticle, Axis } from '../lib/types';

interface Props {
  articles: GDELTArticle[];
  loading: boolean;
  error: string | null;
  activeAxis: Axis | null;
}

function formatDate(seendate: string): string {
  // GDELT format: YYYYMMDDTHHMMSSZ
  if (!seendate || seendate.length < 8) return '';
  const y = seendate.slice(0, 4);
  const m = seendate.slice(4, 6);
  const d = seendate.slice(6, 8);
  const hh = seendate.slice(9, 11);
  const mm = seendate.slice(11, 13);
  return `${y}-${m}-${d} ${hh}:${mm}Z`;
}

export function NewsRail({ articles, loading, error, activeAxis }: Props) {
  const filtered = activeAxis ? articles.filter((a) => a.axis === activeAxis) : articles;

  return (
    <div className="news-list">
      {loading && filtered.length === 0 && (
        <div className="news-empty">
          <div>QUERYING GDELT…</div>
          <div style={{ marginTop: 8, fontSize: 10 }}>
            Respecting 5s rate-limit between theme calls
          </div>
        </div>
      )}
      {error && (
        <div className="news-empty">
          <div>⚠ {error}</div>
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="news-empty">
          <div>NO ARTICLES YET</div>
          <div style={{ marginTop: 8, fontSize: 10 }}>
            GDELT fetches 5 min. Refresh page if persistent.
          </div>
        </div>
      )}
      {filtered.map((a, i) => (
        <a
          key={i}
          className="news-item"
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', color: 'inherit' }}
        >
          <div className="head">{a.title}</div>
          <div className="meta">
            <span className="axis-tag" data-axis={a.axis}>
              {a.axis === 'geo' ? 'Δ' : a.axis === 'econ' ? 'Ω' : 'Ψ'} {a.axis?.toUpperCase()}
            </span>
            <span>{formatDate(a.seendate)}</span>
            <span>·</span>
            <span>{a.domain}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
