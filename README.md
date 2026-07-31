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
    projects.json    projects (each needs a `ticker` — see below)
    skills.json      toolkit categories
    interests.json   the "off the clock" grid
  components/      Navbar, Footer, PageDecorations (ambient backgrounds), etc.
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
| `ticker` | yes | 4 letters, uppercase — the chart's x-axis label |
| `period` | yes | display string, e.g. `"Feb 2025"` |
| `context` | no | subtitle, e.g. `"CMU TartanHacks"` |
| `tools` | yes | array of tag strings |
| `description` | yes | one or two sentences |
| `link` | no | live site or repo |
| `papers` | no | `[{ label, url }]`, files live in `public/papers/` |
| `detail` | no | `{ overview, highlights[], role }` — powers the detail page |

## The projects chart

Projects are plotted as candlesticks. The candle shapes are generated
deterministically from each project's `ticker` (see `seededRandom` in
`src/pages/Projects.jsx`), so the chart looks the same on every render but
carries no real data — the y-axis is deliberately unlabelled and the caption says
so. Below 880px the chart is replaced by a plain card list.

## Theming

Colours and type live in `:root` in `src/index.css`. Each page has its own accent:

| page | accent |
| --- | --- |
| Home | `--accent-home` sky `#38bdf8` |
| Projects | `--accent-projects` green `#22c55e` |
| About | `--accent-about` amber `#f59e0b` |

The ambient background art per page is in `src/components/PageDecorations.jsx`.
It's all decorative and hidden entirely under `prefers-reduced-motion`.

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
