import { useEffect } from 'react';

const BASE = 'William Roche';

/* Per-route document title. Pass nothing on the home page for the bare
   name; pass a label elsewhere ("Projects" -> "Projects — William Roche"). */
export default function useTitle(label) {
  useEffect(() => {
    document.title = label ? `${label} — ${BASE}` : BASE;
    return () => { document.title = BASE; };
  }, [label]);
}
