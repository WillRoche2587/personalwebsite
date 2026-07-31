import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { ProjectsDecorations } from '../components/PageDecorations';
import { toSlug } from '../lib/slug';
import data from '../data/projects.json';

const A = 'var(--accent-projects)';
const ACCENT_HEX = '#22c55e';
const DOWN_HEX = '#ef4444';

const projects = data.featured;

/* ═══════════════════════════════════════════════════
   Chart geometry

   Each project is a candle, ordered oldest → newest. The series is
   generated deterministically from the ticker so it never reshuffles
   between renders. The y-axis is deliberately unlabelled — it's a shape,
   not a claim (see the caption under the chart).
   ═══════════════════════════════════════════════════ */

const W = 900;
const H = 400;
const PAD = { l: 30, r: 30, t: 34, b: 52 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const V_MIN = 0;
const V_MAX = 110;

/* Small deterministic PRNG so the same ticker always yields the same candle. */
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeries(list) {
  const n = list.length;
  let prevClose = 14;

  return list.map((p, i) => {
    const rand = seededRandom(p.ticker);
    const base = 20 + (i / Math.max(1, n - 1)) * 70;
    const open = prevClose;
    const close = Math.max(8, Math.min(104, base + (rand() * 12 - 3)));
    const high = Math.max(open, close) + rand() * 7 + 3;
    const low = Math.min(open, close) - (rand() * 7 + 3);
    prevClose = close;
    return { ...p, open, close, high, low, rising: close >= open, index: i };
  });
}

const series = buildSeries(projects);

const slotW = PLOT_W / series.length;
const candleX = (i) => PAD.l + slotW * (i + 0.5);
const valueY = (v) => PAD.t + PLOT_H - ((v - V_MIN) / (V_MAX - V_MIN)) * PLOT_H;
const bodyW = Math.min(34, slotW * 0.44);

/* ═══ Chart ═══ */
function Candle({ point, isSelected, isHovered, onSelect, onHover, onLeave }) {
  const color = point.rising ? ACCENT_HEX : DOWN_HEX;
  const x = candleX(point.index);
  const yHigh = valueY(point.high);
  const yLow = valueY(point.low);
  const yTop = valueY(Math.max(point.open, point.close));
  const yBottom = valueY(Math.min(point.open, point.close));
  const height = Math.max(4, yBottom - yTop);
  const active = isSelected || isHovered;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${point.ticker} — ${point.title}, ${point.period}`}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* Generous invisible hit area so the thin candle is easy to grab */}
      <rect
        x={x - slotW / 2}
        y={PAD.t}
        width={slotW}
        height={PLOT_H}
        fill="transparent"
      />

      {/* Column highlight */}
      <motion.rect
        x={x - slotW / 2}
        y={PAD.t}
        width={slotW}
        height={PLOT_H}
        fill={color}
        initial={false}
        animate={{ opacity: active ? 0.07 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Wick */}
      <motion.line
        x1={x} x2={x} y1={yHigh} y2={yLow}
        stroke={color}
        strokeWidth="1.5"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: active ? 1 : 0.6, scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.08 * point.index, ease: 'easeOut' }}
        style={{ transformOrigin: `${x}px ${(yHigh + yLow) / 2}px` }}
      />

      {/* Body */}
      <motion.rect
        x={x - bodyW / 2}
        y={yTop}
        width={bodyW}
        height={height}
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: 1,
          scaleY: 1,
          fill: active ? color : `${color}33`,
        }}
        transition={{
          opacity: { duration: 0.45, delay: 0.08 * point.index },
          scaleY: { duration: 0.45, delay: 0.08 * point.index, ease: 'easeOut' },
          fill: { duration: 0.2 },
        }}
        style={{
          filter: active ? `drop-shadow(0 0 10px ${color}88)` : 'none',
          transformBox: 'fill-box',
          transformOrigin: '50% 100%',
        }}
      />

      {/* Ticker label on the axis */}
      <motion.text
        x={x}
        y={H - PAD.b + 24}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-mono)"
        letterSpacing="0.06em"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0.5, fill: active ? color : '#4a5568' }}
        transition={{ duration: 0.2 }}
      >
        {point.ticker}
      </motion.text>

      {/* Period under the ticker */}
      <motion.text
        x={x}
        y={H - PAD.b + 38}
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="var(--font-mono)"
        fill="#4a5568"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.85 : 0.35 }}
        transition={{ duration: 0.2 }}
      >
        {point.period.split('–').pop().trim()}
      </motion.text>
    </g>
  );
}

function CandleChart({ selected, setSelected }) {
  const [hovered, setHovered] = useState(null);
  const focus = series[hovered ?? selected];

  const trendPath = useMemo(
    () => series.map((p, i) => `${i === 0 ? 'M' : 'L'}${candleX(i)},${valueY(p.close)}`).join(' '),
    [],
  );

  return (
    <div
      className="card"
      style={{ padding: '18px 18px 12px', overflow: 'hidden', background: 'var(--bg-card)' }}
    >
      {/* Chart header — a market data strip */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          paddingBottom: 14, marginBottom: 6,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            $WJR
          </span>
          <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>
            PROJECT INDEX
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>
            {series.length} POSITIONS
          </span>
          <span className="mono text-tiny" style={{ color: A }}>
            2023 – 2026
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        role="group"
        aria-label="Projects plotted as a candlestick chart. Select a candle to view that project."
      >
        {/* Gridlines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = PAD.t + (PLOT_H / 4) * i;
          return (
            <line
              key={i}
              x1={PAD.l} x2={W - PAD.r} y1={y} y2={y}
              stroke="#1b2231" strokeWidth="1"
            />
          );
        })}

        {/* Baseline */}
        <line
          x1={PAD.l} x2={W - PAD.r}
          y1={PAD.t + PLOT_H} y2={PAD.t + PLOT_H}
          stroke="#2a3345" strokeWidth="1"
        />

        {/* Trend line through the closes */}
        <motion.path
          d={trendPath}
          fill="none"
          stroke={ACCENT_HEX}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.42 }}
          transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
        />

        {/* Crosshair on the focused candle */}
        {focus && (
          <motion.line
            x1={PAD.l} x2={W - PAD.r}
            y1={valueY(focus.close)} y2={valueY(focus.close)}
            stroke={focus.rising ? ACCENT_HEX : DOWN_HEX}
            strokeWidth="1"
            strokeDasharray="3 5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {series.map((point, i) => (
          <Candle
            key={point.ticker}
            point={point}
            isSelected={selected === i}
            isHovered={hovered === i}
            onSelect={() => setSelected(i)}
            onHover={() => setHovered(i)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      <p
        className="mono text-tiny"
        style={{ color: 'var(--text-dim)', textAlign: 'center', paddingTop: 10, paddingBottom: 4 }}
      >
        x-axis: time · y-axis: vibes · click a candle
      </p>
    </div>
  );
}

/* ═══ Selected project panel ═══ */
function ProjectPanel({ project }) {
  const slug = toSlug(project.title);

  return (
    <motion.div
      key={project.ticker}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="card card-pad-lg"
      style={{ marginTop: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <span
          className="ticker-chip"
          style={{ background: 'var(--accent-projects-dim)', border: `1px solid ${ACCENT_HEX}55`, color: A }}
        >
          ${project.ticker}
        </span>
        <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>
          {project.period}
        </span>
        {project.context && (
          <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>
            · {project.context}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 12 }}>{project.title}</h3>

      <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 660 }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 20 }}>
        {project.tools.map(tool => (
          <span key={tool} className="tag">{tool}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
        <Link
          to={`/projects/${slug}`}
          className="btn-pad"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
            background: A, color: 'var(--bg-primary)',
          }}
        >
          Read more <ArrowUpRight size={15} />
        </Link>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pad"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
              border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
            }}
          >
            Visit <ExternalLink size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ═══ Mobile fallback: the same data as a plain list ═══ */
function ProjectList() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {[...series].reverse().map((project, i) => (
        <motion.div
          key={project.ticker}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="card card-pad"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <span
              className="ticker-chip"
              style={{ background: 'var(--accent-projects-dim)', border: `1px solid ${ACCENT_HEX}55`, color: A }}
            >
              ${project.ticker}
            </span>
            <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>{project.period}</span>
          </div>

          <p className="text-card-title mb-md">{project.title}</p>
          <p className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {project.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {project.tools.slice(0, 5).map(tool => (
              <span key={tool} className="tag">{tool}</span>
            ))}
          </div>

          <Link
            to={`/projects/${toSlug(project.title)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 18, fontSize: '0.85rem', fontWeight: 600, color: A,
            }}
          >
            Read more <ArrowUpRight size={15} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(series.length - 1);

  return (
    <PageTransition>
      <div className="theme-projects" style={{ minHeight: '100vh', position: 'relative' }}>
        <ProjectsDecorations />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-label mb-lg" style={{ color: A }}>Portfolio</p>
              <h1 className="text-hero" style={{ marginBottom: 20 }}>Projects</h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 620 }}>
                Everything I've built that I'd still defend, plotted the way I think about it —
                oldest position on the left, most recent on the right. Pick a candle.
              </p>
            </motion.div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 90 }}>
          <div className="page-container">
            {/* Desktop: the chart */}
            <div className="chart-desktop">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <CandleChart selected={selected} setSelected={setSelected} />
              </motion.div>
              <ProjectPanel project={series[selected]} />
            </div>

            {/* Mobile: the list */}
            <div className="chart-mobile">
              <SectionHeading accent={ACCENT_HEX}>All Positions</SectionHeading>
              <ProjectList />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
