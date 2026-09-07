import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FileText, Mail } from 'lucide-react';
import { GitHubIcon } from '../components/SocialIcons';
import PageTransition from '../components/PageTransition';
import ProjectCard from '../components/ProjectCard';
import useTitle from '../lib/useTitle';
import { Atmosphere, Reveal, Rule, Section, FadeIn, EASE } from '../components/Motion';
import personal from '../data/personal.json';
import skills from '../data/skills.json';
import experience from '../data/experience.json';
import projectData from '../data/projects.json';

const projects = projectData.featured;

/* Pinned by code rather than by array position, so reordering
   projects.json can't silently change what the homepage features. */
const FEATURED_CODES = ['RSKR', 'LMNK', 'GAUG'];
const featured = FEATURED_CODES
  .map(code => projects.find(p => p.code === code))
  .filter(Boolean);

/* ─── Rotating role in the subhead ─── */
function TypingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const role = personal.roles[roleIndex];

  useEffect(() => {
    const speed = deleting ? 32 : 68;
    const timer = setTimeout(() => {
      if (!deleting && charIndex === role.length) {
        setTimeout(() => setDeleting(true), 1900);
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

  return <span className="caret">{role.substring(0, charIndex)}</span>;
}

/* ─── Hero backdrop: a slow, breathing line field ─── */
function HeroField() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const rings = [
    { r: 120, dur: 46, dir: 1, dash: '2 9' },
    { r: 176, dur: 68, dir: -1, dash: '28 14' },
    { r: 236, dur: 92, dir: 1, dash: '1 7' },
    { r: 300, dur: 120, dir: -1, dash: '44 18 3 18' },
  ];

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="decor-layer"
      style={{
        y, opacity: fade,
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg viewBox="-340 -340 680 680" style={{ width: 'min(150vh, 118vw)', height: 'auto', overflow: 'visible' }}>
        <defs>
          <radialGradient id="hero-core">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#cfd9ef" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#8fa0c4" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          r="250"
          fill="url(#hero-core)"
          animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {rings.map((ring, i) => (
          <motion.g
            key={i}
            animate={{ rotate: 360 * ring.dir }}
            transition={{ duration: ring.dur, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              r={ring.r}
              fill="none"
              stroke="#fff"
              strokeWidth="0.7"
              strokeOpacity={0.16 - i * 0.025}
              strokeDasharray={ring.dash}
            />
            <circle cx={ring.r} cy="0" r="2" fill="#fff" fillOpacity={0.34 - i * 0.05} />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ─── Facts marquee ─── */
const TAPE = [
  'NYU · B.S. Computer Science',
  'Minor in Mathematics',
  'GPA 3.946',
  "Dean's List",
  'Teaching Assistant · CS-UY 4513',
  'Natixis CIB · SWE Intern',
  'NYU CQIP · Quantum Computing Research',
  'Upsilon Pi Epsilon',
  'New York, NY',
];

function Marquee() {
  const items = [...TAPE, ...TAPE];
  return (
    <div
      className="tape-rail"
      style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="tape-track" style={{ padding: '15px 0' }}>
        {items.map((item, i) => (
          <span
            key={i}
            className="text-small"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 18,
              padding: '0 26px', whiteSpace: 'nowrap', color: 'var(--silver-dim)',
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--silver-mute)' }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Experience ─── */
function Job({ item, index }) {
  return (
    <FadeIn delay={index * 0.05}>
      <div className="job-row">
        <div>
          <p className="mono text-tiny" style={{ color: 'var(--silver-bright)', letterSpacing: '0.06em' }}>
            {item.date}
          </p>
          <p className="mono text-tiny" style={{ color: 'var(--silver-mute)', marginTop: 6 }}>
            {item.location}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{item.title}</h3>
            <span className="text-small" style={{ color: 'var(--silver-dim)' }}>{item.company}</span>
          </div>
          <ul style={{ listStyle: 'none', marginTop: 14 }}>
            {item.highlights.map((h, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: i === 0 ? 0 : 10 }}>
                <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: 'var(--silver-mute)', marginTop: 9 }} />
                <span className="text-small" style={{ color: 'var(--silver)', lineHeight: 1.75 }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Home() {
  useTitle();
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Atmosphere />

        <style>{`
          .job-row {
            display: grid; grid-template-columns: 1fr; gap: 10px;
            padding: 32px 0; border-top: 1px solid var(--line);
          }
          @media (min-width: 820px) { .job-row { grid-template-columns: 210px 1fr; gap: 44px; } }
          .skills-grid { display: grid; grid-template-columns: 1fr; gap: 34px; }
          @media (min-width: 760px) { .skills-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; } }
        `}</style>

        {/* ══ HERO ══ */}
        <section
          style={{
            position: 'relative', zIndex: 10, minHeight: '100vh',
            display: 'flex', alignItems: 'center', textAlign: 'center',
          }}
        >
          <HeroField />
          <div className="page-container" style={{ width: '100%', paddingTop: 130, paddingBottom: 110, position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 30 }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', boxShadow: '0 0 14px rgba(230,240,255,0.9)' }} />
              <span className="eyebrow">{personal.location}</span>
            </motion.div>

            <Reveal
              as="h1"
              className="text-hero"
              text={personal.name}
              delay={0.12}
              stagger={0.1}
              style={{ display: 'block', marginBottom: 26 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.15rem, 2.6vw, 1.7rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: 'var(--silver)',
                  marginBottom: 34,
                  minHeight: '1.5em',
                }}
              >
                <TypingRole />
              </p>

              <p
                className="text-body"
                style={{ color: 'var(--silver-dim)', lineHeight: 1.9, maxWidth: 560, margin: '0 auto 42px' }}
              >
                {personal.heroText}
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/projects" className="btn btn-primary">
                  See my work <ArrowRight size={17} />
                </Link>
                <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <FileText size={17} /> Resume
                </a>
                <a href={personal.socials.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <GitHubIcon size={17} /> GitHub
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            <span className="eyebrow" style={{ fontSize: '0.62rem' }}>Scroll</span>
            <motion.div
              style={{ width: 1, height: 42, background: 'linear-gradient(180deg, var(--silver-mute), transparent)' }}
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </section>

        <Marquee />

        {/* ══ WORK ══ */}
        <section className="section" style={{ position: 'relative', zIndex: 10, paddingTop: 104 }}>
          <div className="page-container">
            <Section number="01" title="Selected Projects" id="work">
              A few favorites. Click through for the full story.
            </Section>

            <div className="tile-band"><div className="grid-projects">
              {featured.map((project, i) => (
                <ProjectCard
                  key={project.code}
                  project={project}
                  number={i + 1}
                  delay={i * 0.06}
                />
              ))}
            </div></div>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
                <Link to="/projects" className="btn btn-secondary">
                  All projects <ArrowRight size={17} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══ EXPERIENCE ══ */}
        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <Section number="02" title="Experience" id="experience" />
            <div>
              {experience.work.map((item, i) => (
                <Job key={`${item.company}-${i}`} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ SKILLS ══ */}
        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <Section number="03" title="Skills" id="skills" />
            <div className="skills-grid">
              {skills.categories.map((cat, i) => (
                <FadeIn key={cat.name} delay={i * 0.06}>
                  <p className="eyebrow" style={{ marginBottom: 16 }}>{cat.name}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.skills.map(skill => <span key={skill} className="tag">{skill}</span>)}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EDUCATION ══ */}
        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <Section number="04" title="Education" id="education" />
            <div className="grid-two">
              {experience.education.map((item, i) => (
                <FadeIn key={item.institution} delay={i * 0.07}>
                  <div className="card card-pad" style={{ height: '100%' }}>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 600, marginBottom: 8 }}>{item.institution}</h3>
                    <p className="text-small" style={{ color: 'var(--silver)' }}>{item.degree}</p>
                    <p className="mono text-tiny" style={{ color: 'var(--silver-mute)', marginTop: 10 }}>
                      {item.date} · {item.location}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
                      {item.notes.map(note => <span key={note} className="tag">{note}</span>)}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 130 }}>
          <div className="page-container">
            <Rule style={{ marginBottom: 64 }} />
            <FadeIn>
              <div style={{ textAlign: 'center' }}>
                <p className="eyebrow" style={{ marginBottom: 18 }}>Contact</p>
                <h2 className="text-section-title" style={{ marginBottom: 20 }}>
                  Let's talk.
                </h2>
                <p className="text-body" style={{ color: 'var(--silver-dim)', maxWidth: 420, margin: '0 auto 36px' }}>
                  Always up for a good problem.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href={`mailto:${personal.email}`} className="btn btn-primary">
                    <Mail size={17} /> {personal.email}
                  </a>
                  <Link to="/about" className="btn btn-secondary">
                    More about me <ArrowUpRight size={17} className="arrow-slide" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
