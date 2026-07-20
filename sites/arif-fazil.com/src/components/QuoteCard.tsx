import { motion } from 'framer-motion';

interface QuoteCardProps {
  quote: string;
  author: string;
  source?: string;
  topic?: string;
  className?: string;
}

export function QuoteCard({ quote, author, source, topic, className = '' }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`my-8 p-6 md:p-8 rounded-lg bg-forge-black/60 border border-forge-iron/60 relative overflow-hidden backdrop-blur-sm shadow-xl ${className}`}
    >
      {topic && (
        <div className="inline-block px-3 py-0.5 mb-3 bg-forge-iron/80 rounded border border-forge-gold/30 text-[0.65rem] font-technical uppercase tracking-widest text-forge-gold">
          {topic}
        </div>
      )}
      <blockquote className="relative z-10 font-body text-base md:text-lg text-forge-white/90 italic leading-relaxed pl-4 border-l-2 border-forge-orange/60">
        "{quote}"
      </blockquote>
      <div className="mt-4 pt-3 border-t border-forge-iron/40 flex flex-wrap items-center justify-between text-xs font-technical uppercase tracking-wider text-forge-dim">
        <span className="font-bold text-forge-gold">— {author}</span>
        {source && <span className="italic text-forge-dim/80">{source}</span>}
      </div>
    </motion.div>
  );
}
