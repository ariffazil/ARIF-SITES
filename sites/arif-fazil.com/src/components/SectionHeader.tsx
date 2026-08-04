import { cn } from '@/lib/utils'

/** Mono number + rule + title, e.g. `02 ————— DISCOVERIES`. */
export default function SectionHeader({
  number,
  title,
  className,
}: {
  number: string
  title: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="eyebrow text-ink">{number}</span>
      <span aria-hidden className="h-px flex-1 bg-ink/20" />
      <span className="eyebrow text-ink-soft">{title}</span>
    </div>
  )
}
