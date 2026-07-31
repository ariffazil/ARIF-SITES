import { useState, useEffect } from 'react';

const MYT_OFFSET = 8; // UTC+8

function formatMYT(): string {
  const now = new Date();
  // MYT = UTC + 8
  const myt = new Date(now.getTime() + (MYT_OFFSET - now.getTimezoneOffset() / 60) * 3600000);
  return myt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(): string {
  const now = new Date();
  const myt = new Date(now.getTime() + (MYT_OFFSET - now.getTimezoneOffset() / 60) * 3600000);
  return myt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function LiveClock() {
  const [time, setTime] = useState(formatMYT());

  useEffect(() => {
    const interval = setInterval(() => setTime(formatMYT()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-[0.65rem] text-forge-dim uppercase tracking-widest">
      <span className="text-forge-orange">{time}</span>
      <span>MYT</span>
      <span className="hidden sm:inline text-forge-dim/50">· {formatDate()}</span>
    </div>
  );
}
