import type { ReactNode } from 'react'

/**
 * Terminal window chrome: title bar (three dot glyphs + mono path) + mono body
 * with optional blinking block cursor.
 */
export default function TerminalWindow({
  title,
  children,
  className,
  showCursor = true,
}: {
  title: string
  children: ReactNode
  className?: string
  showCursor?: boolean
}) {
  return (
    <div className={`overflow-hidden rounded-md border border-strata-700 bg-basalt-900 ${className ?? ''}`}>
      <div className="flex items-center gap-2 border-b border-strata-700 bg-basalt-800 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-signal-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-450/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-telemetry-400/80" />
        <span className="ml-3 font-mono text-[12px] text-bone-600">{title}</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed text-bone-100">
        {children}
        {showCursor && <span className="ml-1 inline-block h-4 w-2.5 translate-y-0.5 bg-telemetry-400 animate-blink-block" />}
      </div>
    </div>
  )
}
