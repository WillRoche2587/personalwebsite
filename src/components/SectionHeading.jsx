import { motion } from 'framer-motion';

/* Section title with a monospace index marker and a trailing rule that
   fades out in the page's accent colour. */
export default function SectionHeading({ children, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-xl"
      style={{ display: 'flex', alignItems: 'center', gap: 18 }}
    >
      {index && (
        <span className="mono text-tiny" style={{ color: accent, opacity: 0.7, flexShrink: 0 }}>
          {index}
        </span>
      )}
      <h2 className="text-section" style={{ whiteSpace: 'nowrap' }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
    </motion.div>
  );
}
