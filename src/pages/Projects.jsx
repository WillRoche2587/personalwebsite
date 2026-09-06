import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProjectCard from '../components/ProjectCard';
import { Atmosphere, Reveal, Rule, EASE } from '../components/Motion';
import data from '../data/projects.json';

const projects = data.featured;

export default function Projects() {
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Atmosphere />

        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ marginBottom: 20 }}
            >
              {projects.length} Projects
            </motion.p>

            <Reveal as="h1" className="text-page-title" text="Things I've built" delay={0.08} />

            <Rule delay={0.45} style={{ marginTop: 30, marginBottom: 30, maxWidth: 420 }} />

            <motion.p
              className="text-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              style={{ color: 'var(--silver-dim)', maxWidth: 520 }}
            >
              Click any project to read the full story behind it.
            </motion.p>
          </div>
        </section>

        <section className="section" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <div className="tile-band"><div className="grid-projects">
              {[...projects].reverse().map((project, i) => (
                <ProjectCard
                  key={project.code}
                  project={project}
                  number={projects.length - projects.indexOf(project)}
                  delay={i * 0.05}
                />
              ))}
            </div></div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
