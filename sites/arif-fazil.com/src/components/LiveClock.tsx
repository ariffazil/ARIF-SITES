import { useState, useEffect } from 'react';

const MYT_OFFSET = 8; // UTC+8

interface LiveClockProps {
  withDate?: boolean;
  withIso?: boolean;
  className?: string;
}

function mytNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + (MYT_OFFSET - now.getTimezoneOffset() / 60) * 3600000);
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Live MYT clock with date — temporal intelligence for both readers:
 * - human: visible "22:14:33 MYT · Sat 01 Aug 2026"
 * - agent: <time datetime="...">ISO-8601 machine twin</time> (F2/F4: agents
 *   must be able to read the current epoch without asking)
 */
export function LiveClock({ withDate = true, withIso = true, className = '' }: LiveClockProps) {
  const [now, setNow] = useState<Date>(() => mytNow());
  const [iso, setIso] = useState(() => new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(mytNow());
      setIso(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <time
      dateTime={withIso ? iso : undefined}
      title={withIso ? `ISO-8601 ${iso}` : 'Malaysia Time (UTC+8)'}
      className={`flex items-center gap-2 font-mono text-[0.65rem] text-forge-dim uppercase tracking-widest ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-forge-green shadow-glow-green animate-pulse" aria-hidden="true" />
      <span className="text-forge-white">{formatTime(now)}</span>
      <span>MYT</span>
      {withDate && <span className="hidden sm:inline text-forge-dim/60">· {formatDate(now)}</span>}
    </time>
  );
}
