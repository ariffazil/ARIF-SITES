import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Mono badge for an MCP tool call, e.g. geox.evaluate_prospect().
 * Copies to clipboard on click with a ripple + "COPIED" tooltip.
 */
export default function ToolBadge({ tool, className }: { tool: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tool)
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button
      onClick={copy}
      data-cursor="READ"
      className={`relative inline-flex items-center gap-1.5 overflow-hidden rounded-sm border border-strata-700 bg-basalt-800 px-2.5 py-1 font-mono text-[12px] text-telemetry-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-telemetry-400/50 ${className ?? ''}`}
      title="Click to copy"
    >
      <AnimatePresence>
        {copied && (
          <motion.span
            className="absolute inset-0 bg-telemetry-400/20"
            initial={{ scaleX: 0, opacity: 1, originX: 0 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
      {copied ? 'COPIED' : tool}
    </button>
  )
}
