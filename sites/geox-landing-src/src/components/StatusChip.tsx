import { cn } from '@/lib/utils'

type Variant = 'live' | 'hold' | 'sealed'

const STYLES: Record<Variant, { dot: string; text: string; pulse?: boolean }> = {
  live: { dot: 'bg-telemetry-400 animate-pulse-dot', text: 'text-telemetry-400' },
  hold: { dot: 'bg-signal-red', text: 'text-signal-red' },
  sealed: { dot: 'bg-amber-450', text: 'text-amber-450' },
}

export default function StatusChip({
  variant,
  label,
  className,
}: {
  variant: Variant
  label: string
  className?: string
}) {
  const s = STYLES[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border border-strata-700 bg-basalt-900 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]',
        s.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {label}
    </span>
  )
}
