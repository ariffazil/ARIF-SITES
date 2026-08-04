import { cn } from '@/lib/utils'

export type FactKind = 'OBS' | 'DER' | 'INT' | 'SPEC'

const styles: Record<FactKind, string> = {
  OBS: 'border-ink/40 text-ink',
  DER: 'border-ledger/60 text-ledger',
  INT: 'border-brass/70 text-brass',
  SPEC: 'border-ember/60 text-ember',
}

const titles: Record<FactKind, string> = {
  OBS: 'Observed — directly verified',
  DER: 'Derived — computed from observed data',
  INT: 'Interpretation — expert judgment',
  SPEC: 'Speculative — unverified estimate',
}

/** Inline mono fact-tag chip: the honesty doctrine made visual. */
export default function FactTag({ kind, className }: { kind: FactKind; className?: string }) {
  return (
    <span
      title={titles[kind]}
      className={cn(
        'inline-block rounded-sm border px-1.5 py-0.5 font-mono text-[11px] font-medium leading-none tracking-[0.04em]',
        styles[kind],
        className,
      )}
    >
      [{kind}]
    </span>
  )
}
