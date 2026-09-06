import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

/* ═══════════════════════════════════════════════════════════════
   Shared motion + atmosphere. Nothing here is themed — it's just
   the grammar the whole site animates in.
   ═══════════════════════════════════════════════════════════════ */

/* Word-by-word mask reveal. Words rise out of a clipped line box,
   which reads far more deliberate than a plain fade. */
export function Reveal({ text, className, style, delay = 0, stagger = 0.06, as: Tag = 'span' }) {
  const words = String(text).split(' ');
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Fade + rise on scroll. The workhorse. */
export function FadeIn({ children, delay = 0, y = 26, className, style, once = true }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* A rule that draws itself across. */
export function Rule({ delay = 0, duration = 1.1, style }) {
  return (
    <motion.div
      style={{ height: 1, background: 'var(--line-bright)', transformOrigin: 'left', ...style }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}

/* Section heading — a number, the plain word for what this is, and
   a rule. Deliberately unclever: the whole point is that you can
   tell at a glance what you're looking at. */
export function Section({ number, title, children, id }) {
  return (
    <div id={id} style={{ marginBottom: 52, scrollMarginTop: 110 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
          {number && (
            <span
              className="mono"
              style={{ fontSize: '0.72rem', color: 'var(--silver-mute)', letterSpacing: '0.18em', fontWeight: 600 }}
            >
              {number}
            </span>
          )}
          <h2 className="text-section-title">{title}</h2>
        </div>
        {children && (
          <p className="text-body" style={{ color: 'var(--silver-dim)', marginTop: 14, maxWidth: 560 }}>
            {children}
          </p>
        )}
      </motion.div>
      <Rule delay={0.12} style={{ marginTop: 22 }} />
    </div>
  );
}

/* Film grain. */
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

/* Slow drifting light blooms. Abstract atmosphere rather than any
   particular place — it just gives the black somewhere to breathe. */
export function Blooms() {
  const blooms = [
    { size: 620, x: '8%', y: '12%', dur: 26, dx: 70, dy: -50, o: 0.10 },
    { size: 520, x: '72%', y: '8%', dur: 34, dx: -90, dy: 60, o: 0.075 },
    { size: 700, x: '48%', y: '68%', dur: 30, dx: 60, dy: 50, o: 0.065 },
  ];
  return (
    <div className="decor-layer fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {blooms.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: b.x, top: b.y,
            width: b.size, height: b.size,
            marginLeft: -b.size / 2, marginTop: -b.size / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(214,226,255,${b.o}) 0%, transparent 66%)`,
            filter: 'blur(30px)',
          }}
          animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.14, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* Vignette, below content so it never dims the UI itself. */
export function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse 88% 82% at 50% 45%, transparent 48%, rgba(0,0,0,0.62) 100%)' }}
    />
  );
}

/* Cursor-tracked highlight on every .card, via a single delegated
   listener rather than handlers on each one. */
export function CardGlow() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let current = null;
    const clear = (el) => {
      if (!el) return;
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    };
    const onMove = (e) => {
      const card = e.target.closest?.('.card');
      if (card !== current) clear(current);
      current = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      clear(current);
    };
  }, []);
  return null;
}

/* Atmosphere bundle — every page mounts the same one. */
export function Atmosphere() {
  return (
    <>
      <Blooms />
      <Vignette />
    </>
  );
}
