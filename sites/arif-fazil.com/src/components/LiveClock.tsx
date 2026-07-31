import { useState, useEffect } from 'react';

const MYT_OFFSET = 8; // UTC+8

function formatMYT(): string {
  const now = new Date();
  // MYT = UTC + 8
  const myt = new Date(now.getTime() + (MYT_OFFSET - now.getTimezoneOffset() / 60) * 3600000);
  return myt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatUTC(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' });
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
    <div className="flex items-baseline gap-3 font-mono leading-none">
      <div className="flex items-baseline gap-2">
        <span className="text-forge-orange font-bold text-2xl md:text-3xl tabular-nums tracking-tight">{time}</span>
        <span className="text-[0.6rem] text-forge-orange uppercase tracking-widest font-semibold">MYT</span>
      </div>
      <span className="hidden sm:inline text-[0.55rem] text-forge-dim/60 uppercase tracking-widest">· UTC {formatUTC()}</span>
      <span className="hidden md:inline text-[0.55rem] text-forge-dim/60 uppercase tracking-widest ml-2">· {formatDate()}</span>
    </div>
  );
}
