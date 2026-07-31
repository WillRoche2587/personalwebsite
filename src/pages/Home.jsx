import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, Code2, Layers, Database, Terminal, GraduationCap } from 'lucide-react';
import { GitHubIcon } from '../components/SocialIcons';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { HomeDecorations } from '../components/PageDecorations';
import personal from '../data/personal.json';
import skills from '../data/skills.json';
import experience from '../data/experience.json';

const A = 'var(--accent-home)';
const ACCENT_HEX = '#38bdf8';

/* ─── Rotating role in the subhead ─── */
function TypingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const role = personal.roles[roleIndex];

  useEffect(() => {
    const speed = deleting ? 35 : 75;
    const timer = setTimeout(() => {
      if (!deleting && charIndex === role.length) {
        setTimeout(() => setDeleting(true), 1600);
        return;
      }
      if (deleting && charIndex === 0) {
        setDeleting(false);
        setRoleIndex((roleIndex + 1) % personal.roles.length);
        return;
      }
      setCharIndex(charIndex + (deleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charIndex, deleting, role, roleIndex]);

  return (
    <span className="typing-cursor" style={{ color: A }}>
      {role.substring(0, charIndex)}
    </span>
  );
}

/* ─── Hero visual: a shell session typing itself, over a live candlestick
       backdrop. The shell is a nod to the Linux shell project; the candles
       to where most of the other work points. ─── */

const SESSION = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: "William Roche — CS @ NYU '27" },
  { kind: 'cmd', text: 'cat focus.txt' },
  { kind: 'out', text: 'market systems · low-level · data pipelines' },
  { kind: 'cmd', text: 'git log --oneline -1' },
  { kind: 'out', text: 'a4f2c1e  feat: ship it' },
];

/* Character offset at which each line begins, so a single "typed" counter
   can be sliced across all of them without mutating state during render. */
const SESSION_OFFSETS = SESSION.reduce(
  (acc, line) => [...acc, acc[acc.length - 1] + line.text.length],
  [0],
);
const SESSION_TOTAL = SESSION_OFFSETS[SESSION_OFFSETS.length - 1];

function useTypedSession() {
  const total = SESSION_TOTAL;
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let raf;
    let start;
    const typeMs = 6000;
    const holdMs = 2200;
    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % (typeMs + holdMs);
      const progress = Math.min(1, elapsed / typeMs);
      setTyped(Math.floor(progress * total));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // Slice the session down to the characters revealed so far.
  const lines = SESSION.map((line, i) => {
    const available = typed - SESSION_OFFSETS[i];
    const shown = line.text.slice(0, Math.max(0, Math.min(line.text.length, available)));
    return { ...line, shown, done: shown.length === line.text.length };
  });
  const activeIndex = lines.findIndex(l => !l.done);

  return { lines, activeIndex };
}

/* Deterministic candles so the backdrop is stable across renders. */
const BACKDROP_CANDLES = [
  { o: 58, c: 44, h: 40, l: 62 }, { o: 44, c: 50, h: 38, l: 55 },
  { o: 50, c: 36, h: 31, l: 54 }, { o: 36, c: 41, h: 30, l: 46 },
  { o: 41, c: 30, h: 25, l: 45 }, { o: 30, c: 34, h: 24, l: 39 },
  { o: 34, c: 22, h: 17, l: 38 }, { o: 22, c: 27, h: 16, l: 31 },
  { o: 27, c: 15, h: 11, l: 30 }, { o: 15, c: 19, h: 9, l: 23 },
];

function HeroVisual() {
  const { lines, activeIndex } = useTypedSession();
  const up = '#22c55e';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1/1', minHeight: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        style={{
          position: 'absolute', inset: '6%', borderRadius: 28,
          background: `radial-gradient(circle at 30% 25%, ${ACCENT_HEX}38, transparent 58%), radial-gradient(circle at 78% 80%, ${up}22, transparent 58%)`,
          filter: 'blur(52px)',
        }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Candlestick backdrop */}
      <svg
        viewBox="0 0 400 400"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Chart gridlines */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1="10" y1={40 + i * 50} x2="390" y2={40 + i * 50}
            stroke={ACCENT_HEX} strokeWidth="0.5" opacity="0.07"
          />
        ))}

        {/* Candles rising left to right */}
        {BACKDROP_CANDLES.map((k, i) => {
          const x = 34 + i * 36;
          const top = Math.min(k.o, k.c) * 4;
          const bodyH = Math.max(6, Math.abs(k.o - k.c) * 4);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.09, ease: 'easeOut' }}
            >
              <line x1={x} y1={k.h * 4} x2={x} y2={k.l * 4} stroke={up} strokeWidth="1" opacity="0.6" />
              <rect x={x - 6} y={top} width="12" height={bodyH} fill={`${up}33`} stroke={up} strokeWidth="1" rx="1" />
            </motion.g>
          );
        })}

        {/* Trend line through the closes */}
        <motion.path
          d={BACKDROP_CANDLES.map((k, i) => `${i === 0 ? 'M' : 'L'}${34 + i * 36},${k.c * 4}`).join(' ')}
          fill="none"
          stroke={ACCENT_HEX}
          strokeWidth="1.5"
          strokeDasharray="4 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, delay: 1.4, ease: 'easeOut' }}
        />
      </svg>

      {/* Drifting glyphs */}
      {[
        { ch: '$_', top: '7%', left: '5%', size: 22, dur: 10, delay: 0 },
        { ch: '↑', top: '13%', right: '7%', size: 20, dur: 12, delay: 1.4 },
        { ch: '{ }', top: '80%', left: '8%', size: 19, dur: 11, delay: 0.7 },
        { ch: 'σ', top: '84%', right: '11%', size: 22, dur: 13, delay: 2.1 },
        { ch: '~', top: '47%', left: '1%', size: 24, dur: 14, delay: 0.3 },
        { ch: '%', top: '52%', right: '2%', size: 20, dur: 11, delay: 1.1 },
      ].map((g, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: g.top, left: g.left, right: g.right,
            fontFamily: 'var(--font-mono)',
            fontSize: g.size, fontWeight: 600,
            color: i % 2 === 0 ? ACCENT_HEX : up,
            textShadow: `0 0 12px ${i % 2 === 0 ? ACCENT_HEX : up}80`,
            userSelect: 'none', pointerEvents: 'none',
          }}
          animate={{ y: [-6, 8, -6], opacity: [0.22, 0.5, 0.22] }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {g.ch}
        </motion.div>
      ))}

      {/* Terminal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', width: '82%',
          background: 'linear-gradient(180deg, #11161f 0%, #0a0e15 100%)',
          border: `1px solid ${ACCENT_HEX}38`,
          borderRadius: 12,
          boxShadow: `0 30px 80px -20px ${ACCENT_HEX}4d, inset 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px ${ACCENT_HEX}1f`,
          overflow: 'hidden', zIndex: 5,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 13px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
            willroche@nyu: ~
          </span>
        </div>

        <div style={{ padding: '14px 14px 18px', fontSize: 'clamp(0.68rem, 1.05vw, 0.82rem)', lineHeight: 1.75, minHeight: 190 }}>
          {lines.map((line, i) => {
            if (!line.shown && i > activeIndex) return <div key={i} style={{ height: '1.75em' }} />;
            return (
              <div key={i} style={{ display: 'flex', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {line.kind === 'cmd' && (
                  <span style={{ color: ACCENT_HEX, flexShrink: 0, marginRight: 8 }}>$</span>
                )}
                <span style={{ color: line.kind === 'cmd' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {line.shown}
                  {i === activeIndex && (
                    <motion.span
                      style={{
                        display: 'inline-block', width: 7, height: '0.95em',
                        background: ACCENT_HEX, marginLeft: 2,
                        verticalAlign: 'text-bottom', boxShadow: `0 0 8px ${ACCENT_HEX}`,
                      }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Status tape: a Bloomberg-style marquee of actual facts ─── */
const TAPE = [
  'NYU · B.S. COMPUTER SCIENCE',
  'MINOR IN MATHEMATICS',
  'GPA 3.946',
  "DEAN'S LIST",
  'NATIXIS CIB · SWE INTERN',
  'NYU CQIP · QUANTUM HARDWARE RESEARCH',
  'UPSILON PI EPSILON',
  'NEW YORK, NY',
];

function StatusTape() {
  const items = [...TAPE, ...TAPE];
  return (
    <div
      className="ticker-rail"
      style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(12, 16, 24, 0.6)',
        overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
      }}
    >
      <div className="ticker-track" style={{ padding: '11px 0' }}>
        {items.map((item, i) => (
          <span
            key={i}
            className="mono text-tiny"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '0 26px', whiteSpace: 'nowrap',
              color: 'var(--text-secondary)', letterSpacing: '0.09em',
            }}
          >
            <span style={{ color: A, opacity: 0.65 }}>▲</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills ─── */
const CATEGORY_ICONS = { Code2, Layers, Database, Terminal };

function SkillCategory({ category, index }) {
  const Icon = CATEGORY_ICONS[category.icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card card-pad"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${A}, transparent)` }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-home-dim)', border: `1px solid ${ACCENT_HEX}30`,
            color: A, flexShrink: 0,
          }}
        >
          <Icon size={17} />
        </div>
        <span className="text-card-title">{category.name}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {category.skills.map(skill => (
          <span
            key={skill}
            className="skill-chip mono"
            style={{
              padding: '5px 11px', borderRadius: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.72rem', fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              '--chip-accent': A,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Experience timeline ─── */
function WorkItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      style={{ position: 'relative', paddingLeft: 28, paddingBottom: 34 }}
    >
      {/* Rail + node */}
      <div style={{ position: 'absolute', left: 3, top: 12, bottom: 0, width: 1, background: `${ACCENT_HEX}22` }} />
      <div
        style={{
          position: 'absolute', left: 0, top: 8, width: 7, height: 7, borderRadius: '50%',
          background: A, boxShadow: `0 0 10px ${ACCENT_HEX}66`,
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 12px' }}>
        <p className="text-card-title">{item.title}</p>
        <span className="mono text-tiny" style={{ color: A }}>{item.company}</span>
      </div>
      <p className="mono text-tiny mt-sm" style={{ color: 'var(--text-dim)' }}>
        {item.date} · {item.location}
      </p>

      <ul style={{ listStyle: 'none', marginTop: 12 }}>
        {item.highlights.map((h, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: i === 0 ? 0 : 8 }}>
            <span
              style={{
                flexShrink: 0, width: 4, height: 4, borderRadius: '50%',
                background: 'var(--text-dim)', marginTop: 9,
              }}
            />
            <span className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{h}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function EducationCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card card-pad"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-home-dim)', border: `1px solid ${ACCENT_HEX}30`, color: A,
          }}
        >
          <GraduationCap size={17} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="text-card-title">{item.institution}</p>
          <p className="text-small mt-sm" style={{ color: 'var(--text-secondary)' }}>{item.degree}</p>
          <p className="mono text-tiny mt-sm" style={{ color: 'var(--text-dim)' }}>
            {item.date} · {item.location}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {item.notes.map(note => (
              <span
                key={note}
                className="mono"
                style={{
                  fontSize: '0.68rem', fontWeight: 500, padding: '3px 9px', borderRadius: 5,
                  background: 'var(--accent-home-dim)', border: `1px solid ${ACCENT_HEX}2e`, color: A,
                }}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <div className="theme-home" style={{ minHeight: '100vh', position: 'relative' }}>
        <HomeDecorations />

        <style>{`
          .hero-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
          @media (min-width: 1024px) { .hero-grid { grid-template-columns: 1.05fr 0.95fr; gap: 56px; } }
          .hero-visual-wrap { display: none; }
          @media (min-width: 1024px) { .hero-visual-wrap { display: block; } }
          .edu-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
          @media (min-width: 768px) { .edu-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>

        {/* Hero */}
        <section style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', minHeight: '90vh' }}>
          <div className="page-container" style={{ width: '100%', paddingTop: 130, paddingBottom: 70 }}>
            <div className="hero-grid">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-label mb-lg" style={{ color: A }}>{personal.location}</p>

                <h1 className="text-hero" style={{ marginBottom: 14 }}>
                  {personal.name}
                </h1>

                <h2 style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.7rem)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 26, color: 'var(--text-secondary)' }}>
                  a <TypingRole />
                </h2>

                <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 34, maxWidth: 500 }}>
                  {personal.heroText}
                </p>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a
                    href={personal.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pad"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      borderRadius: 10, fontWeight: 600, fontSize: '0.88rem',
                      background: A, color: 'var(--bg-primary)',
                      boxShadow: `0 4px 24px ${ACCENT_HEX}30`,
                    }}
                  >
                    <GitHubIcon size={16} /> GitHub
                  </a>
                  <a
                    href={personal.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pad"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      borderRadius: 10, fontWeight: 600, fontSize: '0.88rem',
                      border: `1px solid ${ACCENT_HEX}45`, color: A,
                    }}
                  >
                    <FileText size={16} /> Resume
                  </a>
                  <Link
                    to="/projects"
                    className="btn-pad"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      borderRadius: 10, fontWeight: 600, fontSize: '0.88rem',
                      border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                    }}
                  >
                    Projects <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.div>

              <div className="hero-visual-wrap">
                <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        <StatusTape />

        {/* Skills */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="01">Toolkit</SectionHeading>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: 20 }}>
              {skills.categories.map((cat, i) => (
                <SkillCategory key={cat.name} category={cat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 24 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="02">Experience</SectionHeading>
            <div>
              {experience.work.map((item, i) => (
                <WorkItem key={`${item.company}-${i}`} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="03">Education</SectionHeading>
            <div className="edu-grid">
              {experience.education.map((item, i) => (
                <EducationCard key={item.institution} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
