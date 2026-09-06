import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE } from './Motion';
import { toSlug } from '../lib/slug';
import useMediaQuery from '../lib/useMediaQuery';

/* ═══════════════════════════════════════════════════════════════
   The card *is* the graphic.

   Every tile is a parallelogram. Because each one is sheared by the
   same angle, their slanted edges stay parallel and nest flush
   against each other — the row reads as one continuous chevron band
   rather than a set of separate boxes.

   Hovering snaps that card square: the shear releases to zero, it
   lifts out of the band and a light sweeps diagonally across it.
   That doubles as the usability fix — the tile you're actually
   reading is always the upright, undistorted one.

   Content is counter-sheared so type is never skewed, at rest or
   in motion.

   The shear only makes sense when the tiles sit in a row and their
   edges can nest. Below the 2-column breakpoint they stack, so the
   shear is dropped — a leaning single-column card just reads as
   broken, and there's no hover on touch to straighten it.
   ═══════════════════════════════════════════════════════════════ */

const SKEW = -7;

export default function ProjectCard({ project, number, delay = 0 }) {
  const [hover, setHover] = useState(false);
  const sheared = useMediaQuery('(min-width: 720px)');
  const skew = sheared ? SKEW : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={{ height: '100%', position: 'relative', zIndex: hover ? 5 : 1 }}
    >
      <motion.div
        animate={{
          skewX: hover ? 0 : skew,
          scale: hover ? 1.035 : 1,
          y: hover ? -8 : 0,
        }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ height: '100%' }}
      >
        <Link
          to={`/projects/${toSlug(project.title)}`}
          className="tile"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label={`${project.title}${project.context ? `, ${project.context}` : ''} — open project`}
        >
          {/* light sweeping across the face */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ x: hover ? '190%' : '-120%' }}
            transition={{ duration: hover ? 1.1 : 0, ease: EASE }}
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '55%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
              pointerEvents: 'none', zIndex: 4,
            }}
          />

          {/* leading edge, lit on hover */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: hover ? 1 : 0.22 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: 2,
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.85), transparent)',
              zIndex: 3,
            }}
          />

          {/* glow pooling in the corner */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: hover ? 1 : 0.42 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: 'radial-gradient(520px circle at 12% 0%, rgba(214,228,255,0.13), transparent 60%)',
            }}
          />

          {/* content, un-sheared so type stays upright */}
          <div className="tile-inner" style={{ transform: `skewX(${-skew}deg)` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              {/* the index carries the upper half of the tile — a graphic,
                  not a caption, so the space isn't dead */}
              <motion.span
                className="mono"
                animate={{ opacity: hover ? 0.5 : 0.13, x: hover ? 4 : 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{
                  fontSize: 'clamp(3.2rem, 5vw, 4.4rem)',
                  fontWeight: 600,
                  lineHeight: 0.8,
                  letterSpacing: '-0.05em',
                  color: 'var(--white)',
                  userSelect: 'none',
                }}
              >
                {String(number).padStart(2, '0')}
              </motion.span>
              <motion.div
                animate={{ x: hover ? 4 : 0, y: hover ? -4 : 0, opacity: hover ? 1 : 0.4 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <ArrowUpRight size={20} style={{ color: 'var(--silver-bright)' }} />
              </motion.div>
            </div>

            {/* fixed gap so the number-to-text distance is identical on every
                card in the band — leftover height collects below the tags,
                where a ragged edge doesn't read as a hole */}
            <div style={{ marginTop: 52 }}>
              {project.context && (
                <p
                  className="eyebrow"
                  style={{
                    fontSize: '0.63rem', marginBottom: 10,
                    color: hover ? 'var(--silver)' : 'var(--silver-mute)',
                    transition: 'color 0.4s var(--ease)',
                  }}
                >
                  {project.context}
                </p>
              )}

              <h3
                style={{
                  fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  marginBottom: 12,
                }}
              >
                {project.title}
              </h3>

              {/* rule that draws out under the title on hover */}
              <motion.div
                aria-hidden="true"
                animate={{ scaleX: hover ? 1 : 0.16 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  height: 1, background: 'var(--silver-mute)',
                  transformOrigin: 'left', marginBottom: 14,
                }}
              />

              <p className="text-small" style={{ color: 'var(--silver-dim)', lineHeight: 1.7 }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
                {project.tools.slice(0, 4).map(tool => (
                  <span key={tool} className="tag">{tool}</span>
                ))}
                {project.tools.length > 4 && (
                  <span className="tag" style={{ borderStyle: 'dashed' }}>+{project.tools.length - 4}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
