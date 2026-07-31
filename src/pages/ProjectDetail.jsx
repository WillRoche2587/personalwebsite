import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ProjectsDecorations } from '../components/PageDecorations';
import { toSlug } from '../lib/slug';
import data from '../data/projects.json';

const A = 'var(--accent-projects)';
const ACCENT_HEX = '#22c55e';

const projects = data.featured;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex(p => toSlug(p.title) === slug);
  const project = projects[index];

  if (!project) {
    return (
      <PageTransition>
        <div className="theme-projects" style={{ minHeight: '100vh', position: 'relative' }}>
          <ProjectsDecorations />
          <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
            <div className="page-container">
              <p className="text-label mb-lg" style={{ color: A }}>404</p>
              <h1 className="text-hero mb-lg">Project not found</h1>
              <p className="text-body mb-xl" style={{ color: 'var(--text-secondary)' }}>
                That position isn't in the book.
              </p>
              <Link
                to="/projects"
                className="btn-pad"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                  background: A, color: 'var(--bg-primary)',
                }}
              >
                <ArrowLeft size={15} /> Back to projects
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
      <div className="theme-projects" style={{ minHeight: '100vh', position: 'relative' }}>
        <ProjectsDecorations />

        {/* Header */}
        <section className="page-hero" style={{ position: 'relative', zIndex: 10, paddingBottom: 32 }}>
          <div className="page-container" style={{ maxWidth: 780 }}>
            <motion.div {...fadeUp()}>
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 30,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_HEX; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <ArrowLeft size={15} /> All projects
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                <span
                  className="ticker-chip"
                  style={{ background: 'var(--accent-projects-dim)', border: `1px solid ${ACCENT_HEX}55`, color: A }}
                >
                  ${project.ticker}
                </span>
                <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>{project.period}</span>
                {project.context && (
                  <span className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>· {project.context}</span>
                )}
              </div>

              <h1 className="text-hero" style={{ marginBottom: 18 }}>{project.title}</h1>

              <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 24 }}>
                {project.tools.map(tool => (
                  <span key={tool} className="tag">{tool}</span>
                ))}
              </div>

              {(project.link || project.papers) && (
                <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pad"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                        background: 'var(--accent-projects-dim)',
                        border: `1px solid ${ACCENT_HEX}55`, color: A,
                      }}
                    >
                      View project <ExternalLink size={14} />
                    </a>
                  )}
                  {project.papers?.map(paper => (
                    <a
                      key={paper.url}
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pad"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                        border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                      }}
                    >
                      <FileText size={14} /> {paper.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <section style={{ position: 'relative', zIndex: 10, paddingBottom: 80 }}>
          <div className="page-container" style={{ maxWidth: 780 }}>
            {detail && (
              <>
                <motion.div {...fadeUp(0.1)} style={{ marginTop: 20 }}>
                  <h2 className="text-section mb-lg">Overview</h2>
                  <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                    {detail.overview}
                  </p>
                </motion.div>

                {detail.highlights?.length > 0 && (
                  <motion.div {...fadeUp(0.2)} style={{ marginTop: 44 }}>
                    <h2 className="text-section mb-lg">Highlights</h2>
                    <ul style={{ listStyle: 'none' }}>
                      {detail.highlights.map((item, i) => (
                        <li
                          key={i}
                          style={{
                            display: 'flex', gap: 14, alignItems: 'flex-start', padding: '13px 0',
                            borderBottom: i < detail.highlights.length - 1 ? '1px solid var(--border-color)' : 'none',
                          }}
                        >
                          <span
                            className="mono text-tiny"
                            style={{ flexShrink: 0, color: A, opacity: 0.7, paddingTop: 3, width: 22 }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {detail.role && (
                  <motion.div {...fadeUp(0.3)} style={{ marginTop: 44 }}>
                    <h2 className="text-section mb-lg">My Role</h2>
                    <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                      {detail.role}
                    </p>
                  </motion.div>
                )}
              </>
            )}

            {/* Prev / next */}
            <motion.div
              {...fadeUp(0.4)}
              style={{
                display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                marginTop: 64, paddingTop: 28, borderTop: '1px solid var(--border-color)',
              }}
            >
              {prev ? (
                <Link
                  to={`/projects/${toSlug(prev.title)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}
                >
                  <ArrowLeft size={15} />
                  <span>
                    <span className="mono text-tiny" style={{ display: 'block', color: 'var(--text-dim)' }}>PREVIOUS</span>
                    <span className="text-small" style={{ fontWeight: 500 }}>{prev.title}</span>
                  </span>
                </Link>
              ) : <span />}

              {next ? (
                <Link
                  to={`/projects/${toSlug(next.title)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', textAlign: 'right', marginLeft: 'auto' }}
                >
                  <span>
                    <span className="mono text-tiny" style={{ display: 'block', color: 'var(--text-dim)' }}>NEXT</span>
                    <span className="text-small" style={{ fontWeight: 500 }}>{next.title}</span>
                  </span>
                  <ArrowRight size={15} />
                </Link>
              ) : <span />}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
