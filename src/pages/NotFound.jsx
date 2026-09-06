import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { Atmosphere, Reveal, Rule, EASE } from '../components/Motion';

export default function NotFound() {
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
              404
            </motion.p>

            <Reveal as="h1" className="text-page-title" text="Page not found" delay={0.08} />
            <Rule delay={0.45} style={{ marginTop: 30, marginBottom: 30, maxWidth: 340 }} />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            >
              <p className="text-body" style={{ color: 'var(--silver-dim)', maxWidth: 440, marginBottom: 36 }}>
                This page doesn't exist.
              </p>
              <Link to="/" className="btn btn-primary">
                <ArrowLeft size={17} /> Back home
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
