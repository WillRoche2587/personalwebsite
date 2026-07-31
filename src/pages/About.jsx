import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, CheckCircle, AlertCircle, Sparkles,
  ChefHat, Fish, Mountain, Swords, Boxes, Waves, Goal, TrendingUp, Dumbbell,
} from 'lucide-react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from '../components/SocialIcons';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { AboutDecorations } from '../components/PageDecorations';
import personal from '../data/personal.json';
import interests from '../data/interests.json';
import experience from '../data/experience.json';

const A = 'var(--accent-about)';
const ACCENT_HEX = '#f59e0b';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
});

const INTEREST_ICONS = {
  ChefHat, Fish, Mountain, Swords, Boxes, Waves, Goal, TrendingUp, Dumbbell,
};

/* ─── Interests ─── */
function InterestGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
      {interests.items.map((item, i) => {
        const Icon = INTEREST_ICONS[item.icon] || Sparkles;
        return (
          <motion.div
            key={item.name}
            {...fadeUp(i * 0.04)}
            className="card card-pad"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--accent-about-dim)',
                  border: `1px solid ${ACCENT_HEX}30`, color: A,
                }}
              >
                <Icon size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem' }}>
                {item.name}
              </span>
            </div>
            <p className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {item.note}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Coursework ─── */
function Coursework() {
  const groups = Object.entries(experience.coursework);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 32 }}>
      {groups.map(([group, courses], gi) => (
        <motion.div key={group} {...fadeUp(gi * 0.08)}>
          <p className="text-label mb-lg" style={{ color: A }}>{group}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {courses.map(course => (
              <span
                key={course}
                className="skill-chip"
                style={{
                  padding: '6px 12px', borderRadius: 6,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem', fontWeight: 500,
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  '--chip-accent': A,
                }}
              >
                {course}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Contact form (Formspree) ─── */
function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');

    try {
      const res = await fetch(personal.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
        <input type="text" name="name" placeholder="Name" required className="input-field" />
        <input type="email" name="email" placeholder="Email" required className="input-field" />
      </div>
      <textarea
        name="message"
        placeholder="What's on your mind?"
        rows={6}
        required
        className="input-field"
        style={{ marginBottom: 20, resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-pad"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          borderRadius: 10, fontWeight: 600, fontSize: '0.88rem',
          background: A, color: 'var(--bg-primary)',
          boxShadow: `0 4px 24px ${ACCENT_HEX}30`,
          border: 'none', cursor: status === 'sending' ? 'default' : 'pointer',
          opacity: status === 'sending' ? 0.55 : 1,
        }}
      >
        {status === 'sending' ? 'Sending…'
          : status === 'success' ? <><CheckCircle size={16} /> Sent — thanks!</>
          : status === 'error' ? <><AlertCircle size={16} /> Didn't send, try email</>
          : <><Send size={16} /> Send message</>}
      </button>

      <p aria-live="polite" className="text-tiny" style={{ marginTop: 14, color: 'var(--text-dim)', minHeight: '1.2em' }}>
        {status === 'success' && "Message received — I'll get back to you."}
        {status === 'error' && (
          <>Something went wrong. Reach me directly at{' '}
            <a href={personal.socials.email} style={{ color: A }}>{personal.email}</a>.
          </>
        )}
      </p>
    </form>
  );
}

/* ─── Contact details ─── */
function ContactDetails() {
  const rows = [
    { label: 'EMAIL', value: personal.email, href: `mailto:${personal.email}` },
    { label: 'SCHOOL', value: personal.schoolEmail, href: `mailto:${personal.schoolEmail}` },
    { label: 'PHONE', value: personal.phone, href: personal.phoneHref },
    { label: 'BASED IN', value: personal.location },
  ];

  return (
    <motion.div {...fadeUp(0.1)} className="card card-pad-lg">
      <div className="stack">
        {rows.map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span className="mono text-tiny" style={{ color: 'var(--text-dim)', width: 74, flexShrink: 0, letterSpacing: '0.12em' }}>
              {row.label}
            </span>
            {row.href ? (
              <a
                href={row.href}
                className="text-small"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_HEX; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {row.value}
              </a>
            ) : (
              <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--border-color)' }}>
        {[
          { key: 'github', Icon: GitHubIcon, label: 'GitHub', href: personal.socials.github },
          { key: 'linkedin', Icon: LinkedInIcon, label: 'LinkedIn', href: personal.socials.linkedin },
          { key: 'email', Icon: EmailIcon, label: 'Email', href: personal.socials.email },
        ].map(({ key, Icon, label, href }) => (
          <a
            key={key}
            href={href}
            target={key === 'email' ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              width: 38, height: 38, borderRadius: 9,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = ACCENT_HEX;
              e.currentTarget.style.borderColor = `${ACCENT_HEX}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <Icon size={16} />
          </a>
        ))}
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <PageTransition>
      <div className="theme-about" style={{ minHeight: '100vh', position: 'relative' }}>
        <AboutDecorations />

        <style>{`
          .contact-split { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start; }
          @media (min-width: 1024px) { .contact-split { grid-template-columns: 1.25fr 1fr; gap: 52px; } }
        `}</style>

        {/* Hero */}
        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-label mb-lg" style={{ color: A }}>Who's writing this</p>
              <h1 className="text-hero" style={{ marginBottom: 24 }}>About</h1>
              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.9, maxWidth: 660 }}>
                {personal.aboutText}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interests */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 24 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="01">Off the Clock</SectionHeading>
            <motion.p
              {...fadeUp()}
              className="text-body"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: 660, marginBottom: 32 }}
            >
              {interests.intro}
            </motion.p>
            <InterestGrid />
          </div>
        </section>

        {/* Coursework */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="02">Coursework</SectionHeading>
            <Coursework />
          </div>
        </section>

        {/* Contact */}
        <section className="section-gap" style={{ position: 'relative', zIndex: 10, paddingTop: 0, paddingBottom: 100 }}>
          <div className="page-container">
            <SectionHeading accent={ACCENT_HEX} index="03">Get in Touch</SectionHeading>
            <div className="contact-split">
              <div>
                <motion.p
                  {...fadeUp()}
                  className="text-body"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 30, maxWidth: 520 }}
                >
                  Recruiting, collaborating, or just want to tell me the y-axis on that chart
                  is meaningless — all of it reaches me here.
                </motion.p>
                <motion.div {...fadeUp(0.05)}>
                  <ContactForm />
                </motion.div>
              </div>
              <ContactDetails />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
