# williamroche.dev

Personal site — React + Vite, Tailwind v4, Framer Motion, React Router.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
npm run lint
```

## Structure

```
src/
  data/            all site content lives here — edit these, not the JSX
    personal.json    name, bio, contact, socials, resume path
    experience.json  work, education, coursework
    projects.json    projects (each needs a `code` — see below)
    skills.json      toolkit categories
    interests.json   the "off the clock" grid
  components/
    ProjectCard.jsx  the whole-card project link, and the 3D tilt interaction
    Motion.jsx       shared motion + atmosphere (see below)
    Navbar, Footer, PageTransition, ScrollToTop, SocialIcons
  pages/           Home, Projects, ProjectDetail, About, NotFound
  lib/slug.js      title -> URL slug, shared by Projects and ProjectDetail
public/
  resume.pdf       linked from the navbar and hero
  papers/          project write-ups
```

## Editing content

Almost everything is data-driven. To change what the site says, edit the JSON in
`src/data/` — no component changes needed.

**Adding a project** — append to `featured` in `projects.json`. Order matters: the
array runs oldest → newest, left to right on the chart. Each project needs:

| field | required | notes |
| --- | --- | --- |
| `title` | yes | also generates the URL slug |
| `code` | yes | 4 letters, uppercase — the body's label on the star chart |
| `period` | yes | display string, e.g. `"Feb 2025"` |
| `context` | no | subtitle, e.g. `"CMU TartanHacks"` |
| `tools` | yes | array of tag strings |
| `description` | yes | one or two sentences |
| `link` | no | live site or repo |
| `papers` | no | `[{ label, url }]`, files live in `public/papers/` |
| `detail` | no | `{ overview, highlights[], role }` — powers the detail page |

## Projects

Every project card shares one signature interaction
(`src/components/ProjectCard.jsx`): the card tilts in 3D toward the
cursor, a sheen tracks the pointer across its surface, and the layers
inside move at different depths so there's real parallax rather than a
flat hover state. It is deliberately identical on every card — the
animation is about how the card feels, not a claim about what the
project is.

The whole card is the link, so there's no small "read more" target to
hunt for. Each card shows where the project came from (its `context`)
above the title. `context` is the event name for hackathon projects and
"Personal Project" for everything else; the TCNJ Library App keeps
"Software Engineering Internship" because it was paid work, not a
personal project.

Featured projects on the homepage are pinned by code in
`FEATURED_CODES` (`src/pages/Home.jsx`) rather than by array position,
so reordering `projects.json` can't silently change them.

## Structure of the visuals

`src/components/Motion.jsx` holds the shared grammar: `Reveal`
(word-by-word mask reveal), `FadeIn`, `Rule`, `Section` (the numbered
section headings), `Grain`, `Blooms`, `Vignette` and `CardGlow` (one
delegated pointer listener driving the cursor highlight across every
card).

`App.jsx` wraps everything in `<MotionConfig reducedMotion="user">`, so
every Framer Motion animation honours `prefers-reduced-motion`
automatically; CSS removes the ambient layers and grain on top of that.

## Contact form

The About page posts to Formspree (`formspreeEndpoint` in `personal.json`). It's
the same endpoint the previous site used. Failures fall back to showing the email
address.

## Deploying

Static SPA — `vercel.json` already rewrites all routes to `index.html`, which
client-side routing needs. Build command `npm run build`, output `dist`.

For GitHub Pages, the SPA rewrite has to be handled differently (Pages has no
rewrite config); the usual workaround is copying `dist/index.html` to
`dist/404.html` after building.
