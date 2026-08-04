import { useEffect, useState } from 'react'

/** Live "now" in Kuala Lumpur (UTC+8), ticking once per second. */
export function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

/** HH:MM:SS in Asia/Kuala_Lumpur. */
export function formatKL(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return `${get('hour')}:${get('minute')}:${get('second')}`
}

/** Seconds elapsed since 22 May 1990 00:00 (UTC+8 birth moment). */
export function secondsSinceBirth(now: Date): number {
  const birthUtc = Date.UTC(1990, 4, 21, 16, 0, 0) // 22 May 1990 00:00 UTC+8
  return Math.max(0, Math.floor((now.getTime() - birthUtc) / 1000))
}

export { pad }
