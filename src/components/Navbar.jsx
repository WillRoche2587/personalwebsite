import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import personal from '../data/personal.json';

const navItems = [
  { path: '/', label: 'Home', theme: 'home' },
  { path: '/projects', label: 'Projects', theme: 'projects' },
  { path: '/about', label: 'About', theme: 'about' },
];

const accentMap = {
  home: 'var(--accent-home)',
  projects: 'var(--accent-projects)',
  about: 'var(--accent-about)',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const current = navItems.find(n => n.path === location.pathname)
    || navItems.find(n => n.path !== '/' && location.pathname.startsWith(n.path))
    || navItems[0];
  const accent = accentMap[current.theme];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Collapse the mobile menu whenever the route changes — including on
  // browser back/forward. Adjusting state during render (rather than in an
  // effect) avoids a visible frame with the menu still open.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        background: scrolled ? 'rgba(7, 10, 16, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border-color)' : 'transparent'}`,
      }}
    >
      <div
        className="page-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}
      >
        {/* Monogram: a bracketed ticker, matching the site's mono voice */}
        <NavLink
          to="/"
          className="mono"
          style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 1,
            fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em',
            color: 'var(--text-primary)', lineHeight: 1,
          }}
          aria-label={`${personal.name} — home`}
        >
          <span style={{ color: accent, transition: 'color 0.3s' }}>[</span>
          {personal.initials}
          <span style={{ color: accent, transition: 'color 0.3s' }}>]</span>
        </NavLink>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: 'none', alignItems: 'center', gap: 6 }}>
          {navItems.map(item => {
            const isActive = item.path === current.path;
            const itemAccent = accentMap[item.theme];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  position: 'relative',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  borderRadius: 8,
                  transition: 'color 0.2s',
                  color: isActive ? itemAccent : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 8,
                      background: `${itemAccent}14`,
                      border: `1px solid ${itemAccent}2e`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 10 }}>{item.label}</span>
              </NavLink>
            );
          })}

          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{
              marginLeft: 10, padding: '7px 16px', borderRadius: 8,
              fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em',
              border: `1px solid ${accent}45`, color: accent,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}14`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            RESUME
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', padding: 8, marginRight: -8, cursor: 'pointer',
            background: 'none', border: 'none', color: accent,
          }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(7, 10, 16, 0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div
              className="page-container"
              style={{ paddingTop: 14, paddingBottom: 18, display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {navItems.map(item => {
                const isActive = item.path === current.path;
                const itemAccent = accentMap[item.theme];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: '12px 18px', borderRadius: 10,
                      fontSize: '0.92rem', fontWeight: 500,
                      color: isActive ? itemAccent : 'var(--text-secondary)',
                      background: isActive ? `${itemAccent}12` : 'transparent',
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono"
                style={{
                  marginTop: 6, padding: '12px 18px', borderRadius: 10,
                  fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em',
                  border: `1px solid ${accent}45`, color: accent, textAlign: 'center',
                }}
              >
                RESUME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
