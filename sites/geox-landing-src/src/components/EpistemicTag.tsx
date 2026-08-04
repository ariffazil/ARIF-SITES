import { cn } from '@/lib/utils'

export type EpistemicLayer = 'OBS' | 'DER' | 'INT' | 'SPEC'

const COLORS: Record<EpistemicLayer, string> = {
  OBS: 'border-telemetry-400/60 text-telemetry-400',
  DER: 'border-amber-450/60 text-amber-450',
  INT: 'border-magma-500/60 text-magma-500',
  SPEC: 'border-spec-300/60 text-spec-300',
}

const NAMES: Record<EpistemicLayer, string> = {
  OBS: 'Observed',
  DER: 'Derived',
  INT: 'Interpreted',
  SPEC: 'Speculated',
}

export default function EpistemicTag({
  layer,
  withName = false,
  className,
}: {
  layer: EpistemicLayer
  withName?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]',
        COLORS[layer],
        className,
      )}
    >
      {layer}
      {withName && <span className="ml-1.5 font-normal opacity-70">· {NAMES[layer]}</span>}
    </span>
  )
}
