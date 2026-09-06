import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle, Mail, MapPin, Phone, GraduationCap } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from '../components/SocialIcons';
import PageTransition from '../components/PageTransition';
import useTitle from '../lib/useTitle';
import { Atmosphere, Reveal, Rule, Section, FadeIn, EASE } from '../components/Motion';
import personal from '../data/personal.json';
import interests from '../data/interests.json';
import experience from '../data/experience.json';

/* ─── Interests as a plain, scannable list ─── */
function Interests() {
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      {interests.items.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: i * 0.035, ease: EASE }}
          className="interest-row"
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500 }}>
            {item.name}
          </span>
          <span className="text-small" style={{ color: 'var(--silver-dim)' }}>{item.note}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Contact form ─── */
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
        <input type="text" name="name" placeholder="Your name" aria-label="Your name" required className="input-field" />
        <input type="email" name="email" placeholder="Your email" aria-label="Your email" required className="input-field" />
      </div>
      <textarea
        name="message"
        placeholder="Your message"
        aria-label="Your message"
        rows={6}
        required
        className="input-field"
        style={{ marginBottom: 22, resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn btn-primary"
        style={{ opacity: status === 'sending' ? 0.6 : 1 }}
      >
        {status === 'sending' ? 'Sending…'
          : status === 'success' ? <><Check size={17} /> Sent</>
          : status === 'error' ? <><AlertCircle size={17} /> Didn't send</>
          : <><Send size={17} /> Send message</>}
      </button>

      <p aria-live="polite" className="text-small" style={{ marginTop: 16, color: 'var(--silver-mute)', minHeight: '1.3em' }}>
        {status === 'success' && "Got it — I'll get back to you soon."}
        {status === 'error' && (
          <>Something went wrong. Email me directly at{' '}
            <a href={`mailto:${personal.email}`} className="link-wipe" style={{ color: 'var(--silver-bright)' }}>{personal.email}</a>.
          </>
        )}
      </p>
    </form>
  );
}

export default function About() {
  useTitle('About');
  const contactRows = [
    { Icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { Icon: GraduationCap, label: 'School', value: personal.schoolEmail, href: `mailto:${personal.schoolEmail}` },
    { Icon: Phone, label: 'Phone', value: personal.phone, href: personal.phoneHref },
    { Icon: MapPin, label: 'Location', value: personal.location },
  ];

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Atmosphere />

        <style>{`
          .interest-row {
            display: grid; grid-template-columns: 1fr; gap: 4px;
            padding: 18px 12px; border-bottom: 1px solid var(--line);
            transition: background 0.35s var(--ease); border-radius: 6px;
          }
          @media (min-width: 700px) { .interest-row { grid-template-columns: 230px 1fr; align-items: baseline; gap: 20px; } }
          .contact-split { display: grid; grid-template-columns: 1fr; gap: 44px; align-items: start; }
          @media (min-width: 1000px) { .contact-split { grid-template-columns: 1.25fr 1fr; gap: 56px; } }
          .course-grid { display: grid; grid-template-columns: 1fr; gap: 38px; }
          @media (min-width: 700px) { .course-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ marginBottom: 20 }}
            >
              About
            </motion.p>

            <Reveal as="h1" className="text-page-title" text="Who I am" delay={0.08} />
            <Rule delay={0.45} style={{ marginTop: 30, marginBottom: 30, maxWidth: 420 }} />

            <motion.p
              className="text-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.5, ease: EASE }}
              style={{ color: 'var(--silver)', lineHeight: 2, maxWidth: 680, fontSize: '1.06rem' }}
            >
              {personal.aboutText}
            </motion.p>
          </div>
        </section>

        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <Section number="01" title="Outside of work" id="interests">
              {interests.intro}
            </Section>
            <Interests />
          </div>
        </section>

        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <Section number="02" title="Coursework" id="coursework" />
            <div className="course-grid">
              {Object.entries(experience.coursework).map(([group, courses], i) => (
                <FadeIn key={group} delay={i * 0.06}>
                  <p className="eyebrow" style={{ marginBottom: 16 }}>{group}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {courses.map(course => <span key={course} className="tag">{course}</span>)}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 130 }}>
          <div className="page-container">
            <Section number="03" title="Get in touch" id="contact">
              Send a message, or reach me directly.
            </Section>

            <div className="contact-split">
              <FadeIn>
                <ContactForm />
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="card card-pad">
                  {contactRows.map((row, i) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '15px 0',
                        borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                      }}
                    >
                      <row.Icon size={16} style={{ color: 'var(--silver-mute)', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p className="eyebrow" style={{ fontSize: '0.62rem', marginBottom: 3 }}>{row.label}</p>
                        {row.href ? (
                          <a href={row.href} className="link-wipe text-small" style={{ color: 'var(--silver-bright)' }}>
                            {row.value}
                          </a>
                        ) : (
                          <span className="text-small" style={{ color: 'var(--silver-bright)' }}>{row.value}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
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
                          width: 44, height: 44, borderRadius: 99,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid var(--line-bright)', color: 'var(--silver-dim)',
                          transition: 'all 0.35s var(--ease)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--silver-bright)';
                          e.currentTarget.style.borderColor = 'var(--silver-mute)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--silver-dim)';
                          e.currentTarget.style.borderColor = 'var(--line-bright)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
