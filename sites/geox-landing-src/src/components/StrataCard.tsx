import type { ReactNode } from 'react'

/**
 * Card with a left strata band; hover lifts -4px and brightens border to magma-500/40.
 */
export default function StrataCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-strata-700 bg-basalt-900 p-6 pl-8 transition-all duration-300 hover:-translate-y-1 hover:border-magma-500/40 ${className ?? ''}`}
    >
      <div className="absolute inset-y-0 left-0 w-2 transition-transform duration-300 group-hover:translate-x-2">
        {['bg-basalt-800', 'bg-strata-700', 'bg-basalt-800', 'bg-magma-500/30', 'bg-basalt-800', 'bg-strata-700'].map(
          (c, i) => (
            <div key={i} className={`h-[16.66%] border-b border-basalt-950 ${c}`} />
          ),
        )}
      </div>
      {children}
    </div>
  )
}
