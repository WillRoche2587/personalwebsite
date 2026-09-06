import { Link } from 'react-router-dom';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './SocialIcons';
import personal from '../data/personal.json';

const socialIcons = { github: GitHubIcon, linkedin: LinkedInIcon, email: EmailIcon };
const socialLabels = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' };

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--line)',
        paddingTop: 48, paddingBottom: 48,
        background: 'rgba(0,0,0,0.55)',
      }}
    >
      <div
        className="page-container"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 28 }}
      >
        <nav style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="link-wipe text-small"
              style={{ color: 'var(--silver-dim)' }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-wipe text-small"
            style={{ color: 'var(--silver-dim)' }}
          >
            Resume
          </a>
        </nav>

        <div style={{ display: 'flex', gap: 22 }}>
          {Object.entries(personal.socials).map(([key, url]) => {
            const Icon = socialIcons[key];
            if (!Icon) return null;
            return (
              <a
                key={key}
                href={url}
                target={key === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={socialLabels[key]}
                style={{ color: 'var(--silver-mute)', transition: 'color 0.35s var(--ease)', display: 'inline-flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--silver-bright)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--silver-mute)'; }}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <p className="text-tiny" style={{ color: 'var(--silver-mute)', width: '100%' }}>
          &copy; {personal.copyright}
        </p>
      </div>
    </footer>
  );
}
