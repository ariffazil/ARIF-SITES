interface ConstellationHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function ConstellationHeader({ label, title, subtitle, badge }: ConstellationHeaderProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {badge && (
        <span style={{
          display: 'inline-block',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--accent, #D4A853)',
          border: '1px solid var(--accent, #D4A853)',
          borderRadius: '4px',
          padding: '0.15rem 0.5rem',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}>
          {badge}
        </span>
      )}
      <p style={{
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        color: 'var(--muted)',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
      }}>
        {label}
      </p>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        lineHeight: 1.1,
        marginBottom: subtitle ? '0.5rem' : 0,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}