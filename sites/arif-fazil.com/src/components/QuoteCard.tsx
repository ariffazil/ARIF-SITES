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
    <motion.figure
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`my-8 ${className}`}
    >
      {topic && (
        <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-forge-gold/80">
          {topic}
        </div>
      )}
      <blockquote className="font-serif text-base md:text-lg text-forge-white/70 italic leading-relaxed pl-4 border-l border-forge-gold/40">
        "{quote}"
      </blockquote>
      <figcaption className="mt-3 pl-4 flex flex-wrap items-center gap-x-3 text-[0.7rem] font-mono tracking-wide text-forge-dim">
        <span className="text-forge-gold/90">— {author}</span>
        {source && <span className="italic text-forge-dim/70">{source}</span>}
      </figcaption>
    </motion.figure>
  );
}
