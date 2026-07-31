import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Router keeps scroll position across route changes; reset it on navigation. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
