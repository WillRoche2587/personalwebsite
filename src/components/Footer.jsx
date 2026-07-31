import { GitHubIcon, LinkedInIcon, EmailIcon } from './SocialIcons';
import personal from '../data/personal.json';

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
};

const socialLabels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  email: 'Email',
};

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border-color)',
        paddingTop: 40, paddingBottom: 40,
      }}
    >
      <div
        className="page-container"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}
      >
        <p className="mono text-tiny" style={{ color: 'var(--text-dim)' }}>
          &copy; {personal.copyright}
        </p>
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
                style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'inline-flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
