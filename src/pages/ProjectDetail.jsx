import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import useTitle from '../lib/useTitle';
import { Atmosphere, Reveal, Rule, FadeIn, EASE } from '../components/Motion';
import { toSlug } from '../lib/slug';
import data from '../data/projects.json';

const projects = data.featured;

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex(p => toSlug(p.title) === slug);
  const project = projects[index];

  useTitle(project ? project.title : 'Project not found');

  if (!project) {
    return (
      <PageTransition>
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          <Atmosphere />
          <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
            <div className="page-container">
              <h1 className="text-page-title" style={{ marginBottom: 24 }}>Project not found</h1>
              <p className="text-body" style={{ color: 'var(--silver-dim)', marginBottom: 36, maxWidth: 440 }}>
                That project doesn't exist.
              </p>
              <Link to="/projects" className="btn btn-primary">
                <ArrowLeft size={17} /> All projects
              </Link>
            </div>
          </section>
        </div>
      </PageTransition>
    );
  }

  const detail = project.detail;
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Atmosphere />

        {/* a wash of light behind the title */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 560, zIndex: 1,
            background: 'radial-gradient(ellipse 62% 70% at 50% 0%, rgba(214,228,255,0.10) 0%, transparent 68%)',
          }}
        />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10, paddingBottom: 40 }}>
          <div className="page-container" style={{ maxWidth: 860 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Link
                to="/projects"
                className="link-wipe"
                style={{ color: 'var(--silver-dim)', fontSize: '0.9rem', marginBottom: 40 }}
              >
                <ArrowLeft size={16} /> All projects
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', margin: '28px 0 22px' }}
            >
              <span className="eyebrow">{project.period}</span>
              {project.context && (
                <>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--silver-mute)' }} />
                  <span className="eyebrow">{project.context}</span>
                </>
              )}
            </motion.div>

            <Reveal as="h1" className="text-page-title" text={project.title} delay={0.16} />

            <Rule delay={0.5} style={{ marginTop: 30, marginBottom: 30 }} />

            <motion.p
              className="text-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
              style={{ color: 'var(--silver)', lineHeight: 1.95, fontSize: '1.08rem' }}
            >
              {project.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 26 }}>
                {project.tools.map(tool => <span key={tool} className="tag">{tool}</span>)}
              </div>

              {(project.link || project.papers) && (
                <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Visit the project <ExternalLink size={16} />
                    </a>
                  )}
                  {project.papers?.map(paper => (
                    <a key={paper.url} href={paper.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <FileText size={16} /> {paper.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 110 }}>
          <div className="page-container" style={{ maxWidth: 860 }}>
            {detail && (
              <>
                <FadeIn>
                  <div style={{ marginTop: 30 }}>
                    <p className="eyebrow" style={{ marginBottom: 14 }}>Overview</p>
                    <Rule style={{ marginBottom: 26 }} />
                    <p className="text-body" style={{ color: 'var(--silver)', lineHeight: 2 }}>
                      {detail.overview}
                    </p>
                  </div>
                </FadeIn>

                {detail.highlights?.length > 0 && (
                  <FadeIn delay={0.06}>
                    <div style={{ marginTop: 62 }}>
                      <p className="eyebrow" style={{ marginBottom: 14 }}>What it does</p>
                      <Rule style={{ marginBottom: 10 }} />
                      <ul style={{ listStyle: 'none' }}>
                        {detail.highlights.map((item, i) => (
                          <li
                            key={i}
                            style={{
                              display: 'flex', gap: 18, alignItems: 'flex-start',
                              padding: '18px 0', borderBottom: '1px solid var(--line)',
                            }}
                          >
                            <span className="mono text-tiny" style={{ flexShrink: 0, color: 'var(--silver-mute)', paddingTop: 5 }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-body" style={{ color: 'var(--silver)', lineHeight: 1.8 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                )}

                {detail.role && (
                  <FadeIn delay={0.06}>
                    <div style={{ marginTop: 62 }}>
                      <p className="eyebrow" style={{ marginBottom: 14 }}>My role</p>
                      <Rule style={{ marginBottom: 26 }} />
                      <p className="text-body" style={{ color: 'var(--silver)', lineHeight: 2 }}>{detail.role}</p>
                    </div>
                  </FadeIn>
                )}
              </>
            )}

            {/* prev / next */}
            <FadeIn delay={0.06}>
              <div className="prevnext">
                {prev ? (
                  <Link to={`/projects/${toSlug(prev.title)}`} className="card card-pad" style={{ display: 'block' }}>
                    <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <ArrowLeft size={13} /> Previous
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', fontWeight: 600 }}>{prev.title}</span>
                  </Link>
                ) : <span />}

                {next ? (
                  <Link to={`/projects/${toSlug(next.title)}`} className="card card-pad" style={{ display: 'block', textAlign: 'right' }}>
                    <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, justifyContent: 'flex-end' }}>
                      Next <ArrowRight size={13} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', fontWeight: 600 }}>{next.title}</span>
                  </Link>
                ) : <span />}
              </div>
            </FadeIn>
          </div>
        </section>

        <style>{`
          .prevnext { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 78px; }
          @media (min-width: 640px) { .prevnext { grid-template-columns: 1fr 1fr; } }
        `}</style>
      </div>
    </PageTransition>
  );
}
