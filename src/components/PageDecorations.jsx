import { motion } from 'framer-motion';

/* Ambient background layers, one per page theme. Purely decorative —
   fixed, non-interactive, and hidden entirely under prefers-reduced-motion
   via the `decor-layer` class (see index.css). */

const LAYER = 'decor-layer fixed inset-0 pointer-events-none z-0 overflow-hidden';

/* ═══════════════════════════════════════════════════
   HOME — a data terminal: scanning grid, a price line
   drawing itself across the viewport, drifting bid/ask nodes
   ═══════════════════════════════════════════════════ */
export function HomeDecorations() {
  const c = '#38bdf8';

  return (
    <div className={LAYER} aria-hidden="true">
      {/* Fine grid — the backdrop of every trading screen */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${c}0a 1px, transparent 1px), linear-gradient(90deg, ${c}0a 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)',
        }}
      />

      {/* A price series drawing itself across the full width */}
      <svg
        className="absolute left-0 top-[22%] w-full h-64 hidden lg:block"
        preserveAspectRatio="none"
        viewBox="0 0 1200 240"
      >
        <defs>
          <linearGradient id="home-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c} stopOpacity="0" />
            <stop offset="35%" stopColor={c} stopOpacity="0.5" />
            <stop offset="100%" stopColor={c} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,180 L80,165 L150,190 L230,140 L300,158 L380,110 L460,132 L540,88 L620,105 L700,70 L780,92 L860,54 L940,72 L1020,40 L1100,58 L1200,26"
          fill="none"
          stroke="url(#home-line)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Vertical scan column — slow sweep down the left gutter */}
      <svg className="absolute left-[4%] top-0 h-full w-10 hidden xl:block">
        <motion.line
          x1="5" y1="0" x2="5" y2="100%"
          stroke={c}
          strokeWidth="1"
          strokeDasharray="3 9"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -120 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0.18 }}
        />
        {['20%', '48%', '76%'].map((y, i) => (
          <g key={i}>
            <line x1="5" y1={y} x2="34" y2={y} stroke={c} strokeWidth="1" opacity="0.1" />
            <circle cx="5" cy={y} r="2.5" fill={c} opacity="0.28" />
          </g>
        ))}
      </svg>

      {/* Pulsing quote nodes */}
      {[
        { top: '18%', right: '10%', size: 5, delay: 0 },
        { top: '38%', right: '20%', size: 4, delay: 1.1 },
        { top: '62%', right: '8%', size: 6, delay: 2.2 },
        { top: '30%', left: '14%', size: 4, delay: 0.6 },
        { top: '78%', left: '10%', size: 5, delay: 1.7 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{ width: dot.size, height: dot.size, background: c, top: dot.top, right: dot.right, left: dot.left }}
          animate={{
            opacity: [0.15, 0.55, 0.15],
            scale: [1, 1.7, 1],
            boxShadow: [`0 0 0 ${c}00`, `0 0 14px ${c}70`, `0 0 0 ${c}00`],
          }}
          transition={{ duration: 3.2, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Ambient glows */}
      <div
        className="absolute -top-40 -right-40 w-[620px] h-[620px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c}0d 0%, transparent 65%)` }}
      />
      <div
        className="absolute top-[58%] -left-40 w-[520px] h-[520px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 65%)` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS — a trading floor: edge candlesticks breathing,
   depth-ladder rungs, market grid
   ═══════════════════════════════════════════════════ */
export function ProjectsDecorations() {
  const up = '#22c55e';
  const down = '#ef4444';

  const candles = [
    { left: '3%', top: '16%', h: 46, dir: 1, delay: 0 },
    { left: '6%', top: '34%', h: 30, dir: -1, delay: 0.7 },
    { left: '2.5%', top: '54%', h: 54, dir: 1, delay: 1.4 },
    { left: '5.5%', top: '74%', h: 36, dir: 1, delay: 2.1 },
    { right: '3%', top: '20%', h: 40, dir: -1, delay: 0.4 },
    { right: '6%', top: '40%', h: 52, dir: 1, delay: 1.1 },
    { right: '2.5%', top: '62%', h: 32, dir: 1, delay: 1.8 },
    { right: '5.5%', top: '82%', h: 44, dir: -1, delay: 2.5 },
  ];

  return (
    <div className={LAYER} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${up}08 1px, transparent 1px), linear-gradient(90deg, ${up}08 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 45%, black 25%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 45%, black 25%, transparent 78%)',
        }}
      />

      {/* Edge candlesticks — body plus wick, gently breathing */}
      {candles.map((k, i) => {
        const color = k.dir > 0 ? up : down;
        return (
          <motion.div
            key={i}
            className="absolute hidden lg:flex flex-col items-center"
            style={{ left: k.left, right: k.right, top: k.top }}
            animate={{ opacity: [0.1, 0.26, 0.1], y: [0, -6, 0] }}
            transition={{ duration: 5, delay: k.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div style={{ width: 1, height: 10, background: color }} />
            <div style={{ width: 9, height: k.h, background: `${color}55`, border: `1px solid ${color}`, borderRadius: 1 }} />
            <div style={{ width: 1, height: 10, background: color }} />
          </motion.div>
        );
      })}

      {/* Depth ladder rungs */}
      {[
        { top: '26%', right: '14%', w: 34 },
        { top: '52%', right: '18%', w: 22 },
        { top: '70%', left: '13%', w: 28 },
        { top: '38%', left: '17%', w: 18 },
      ].map((rung, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block rounded-full"
          style={{ width: rung.w, height: 2, background: up, top: rung.top, right: rung.right, left: rung.left }}
          animate={{ opacity: [0.05, 0.18, 0.05], scaleX: [1, 1.3, 1] }}
          transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div
        className="absolute top-0 -left-32 w-[520px] h-[520px] rounded-full"
        style={{ background: `radial-gradient(circle, ${up}0b 0%, transparent 62%)` }}
      />
      <div
        className="absolute -bottom-32 -right-24 w-[460px] h-[460px] rounded-full"
        style={{ background: `radial-gradient(circle, ${up}08 0%, transparent 62%)` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT — off the screen and outdoors: topographic contours,
   drifting motes, warm ambient light
   ═══════════════════════════════════════════════════ */
export function AboutDecorations() {
  const c = '#f59e0b';

  return (
    <div className={LAYER} aria-hidden="true">
      {/* Topographic contour lines — nested ridges, drawn on load */}
      <svg
        className="absolute right-[-6%] top-[8%] w-[560px] h-[560px] hidden lg:block"
        viewBox="0 0 400 400"
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.path
            key={i}
            d={`M${40 + i * 22},${330 - i * 8}
                C${90 + i * 14},${250 - i * 20} ${140 + i * 8},${290 - i * 14} ${190 + i * 6},${210 - i * 22}
                C${240 + i * 4},${140 - i * 18} ${300 - i * 6},${200 - i * 10} ${360 - i * 18},${120 - i * 12}`}
            fill="none"
            stroke={c}
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.16 - i * 0.015 }}
            transition={{ duration: 2.6, delay: i * 0.22, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Second contour cluster, lower left */}
      <svg
        className="absolute left-[-8%] bottom-[4%] w-[460px] h-[460px] hidden xl:block"
        viewBox="0 0 400 400"
      >
        {[0, 1, 2, 3, 4].map(i => (
          <motion.path
            key={i}
            d={`M${10 + i * 16},${80 + i * 10}
                C${70 + i * 10},${150 + i * 16} ${130 + i * 6},${110 + i * 12} ${200 + i * 4},${180 + i * 18}
                C${260 + i * 3},${240 + i * 12} ${320 - i * 8},${200 + i * 8} ${380 - i * 14},${280 + i * 10}`}
            fill="none"
            stroke={c}
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.13 - i * 0.014 }}
            transition={{ duration: 2.6, delay: 0.4 + i * 0.22, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Slow-rising motes */}
      {[
        { left: '12%', size: 3, dur: 18, delay: 0 },
        { left: '26%', size: 2, dur: 24, delay: 4 },
        { left: '58%', size: 3, dur: 21, delay: 8 },
        { left: '74%', size: 2, dur: 27, delay: 2 },
        { left: '88%', size: 3, dur: 20, delay: 11 },
      ].map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full hidden lg:block"
          style={{ width: m.size, height: m.size, background: c, left: m.left, bottom: 0 }}
          animate={{ y: ['0vh', '-105vh'], x: [0, 24, -14, 0], opacity: [0, 0.35, 0.35, 0] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <div
        className="absolute top-[6%] -right-24 w-[600px] h-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c}0c 0%, transparent 58%)` }}
      />
      <div
        className="absolute -bottom-28 left-[10%] w-[520px] h-[520px] rounded-full"
        style={{ background: `radial-gradient(circle, ${c}08 0%, transparent 58%)` }}
      />
    </div>
  );
}
