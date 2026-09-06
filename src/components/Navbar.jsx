import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import personal from '../data/personal.json';

/* Plain words. Someone landing here should never have to work out
   what a link means before clicking it. */
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  const current = navItems.find(n => n.path === location.pathname)
    || navItems.find(n => n.path !== '/' && location.pathname.startsWith(n.path))
    || navItems[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // collapse the mobile menu on route change, including back/forward
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  // lock scroll behind the mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.5s var(--ease), border-color 0.5s var(--ease), backdrop-filter 0.5s',
        background: scrolled || mobileOpen ? 'rgba(0,0,0,0.94)' : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(20px) saturate(1.2)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <div
        className="page-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}
      >
        <NavLink to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }} aria-label={`${personal.name}, home`}>
          <svg width="24" height="24" viewBox="-12 -12 24 24" aria-hidden="true">
            <motion.circle
              r="9" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 5"
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            />
            <circle r="3.4" fill="currentColor" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {personal.name}
          </span>
        </NavLink>

        {/* Desktop */}
        <div className="nav-desktop" style={{ display: 'none', alignItems: 'center', gap: 6 }}>
          {navItems.map(item => {
            const isActive = item.path === current.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  position: 'relative', padding: '10px 18px',
                  fontSize: '0.94rem', fontWeight: 500,
                  color: isActive ? 'var(--silver-bright)' : 'var(--silver-dim)',
                  transition: 'color 0.35s var(--ease)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--silver)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--silver-dim)'; }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    style={{ position: 'absolute', inset: 0, borderRadius: 99, background: 'rgba(255,255,255,0.07)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
              </NavLink>
            );
          })}

          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ marginLeft: 12, padding: '10px 20px', fontSize: '0.88rem' }}
          >
            Resume <ArrowUpRight size={15} className="arrow-slide" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', padding: 10, marginRight: -10, cursor: 'pointer',
            background: 'none', border: 'none', color: 'var(--silver-bright)',
          }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* reading progress */}
      <motion.div
        style={{
          transformOrigin: 'left', scaleX: progress, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--silver), transparent)',
          opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s',
        }}
      />

      <style>{`
        @media (min-width: 820px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
        @media (max-width: 819px) { .nav-mobile-btn { display: block !important; } }
      `}</style>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderTop: '1px solid var(--line)', overflow: 'hidden' }}
          >
            <div className="page-container" style={{ paddingTop: 12, paddingBottom: 28 }}>
              {navItems.map((item, i) => {
                const isActive = item.path === current.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={item.path}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '20px 2px',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.03em',
                        borderBottom: '1px solid var(--line)',
                        color: isActive ? 'var(--silver-bright)' : 'var(--silver-dim)',
                      }}
                    >
                      {item.label}
                      <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
                    </NavLink>
                  </motion.div>
                );
              })}
              <motion.a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.5 }}
                style={{ marginTop: 26, width: '100%' }}
              >
                Resume <ArrowUpRight size={17} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
