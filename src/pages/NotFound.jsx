import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { HomeDecorations } from '../components/PageDecorations';

const A = 'var(--accent-home)';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="theme-home" style={{ minHeight: '100vh', position: 'relative' }}>
        <HomeDecorations />
        <section className="page-hero" style={{ position: 'relative', zIndex: 10 }}>
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-label mb-lg" style={{ color: A }}>404</p>
              <h1 className="text-hero mb-lg">Page not found</h1>
              <p className="text-body mb-xl" style={{ color: 'var(--text-secondary)', maxWidth: 460 }}>
                This route doesn't exist. Nothing was lost, nothing was liquidated.
              </p>
              <Link
                to="/"
                className="btn-pad"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
                  background: A, color: 'var(--bg-primary)',
                }}
              >
                <ArrowLeft size={15} /> Back home
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
