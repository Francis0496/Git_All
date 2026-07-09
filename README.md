# Francis Sesay — Personal Brand Platform

A single-page personal brand and portfolio website for **Francis Sesay** (AI engineer, educator, and founder). Built as a plain static site — no framework, no build step, no dependencies.

## Stack

Hand-authored HTML, CSS, and vanilla JavaScript:

- `index.html` — all page content (hero, about, impact, leadership, experience, education, projects, awards, gallery, skills, testimonials, contact).
- `style.css` — all styling, including dark/light theming and responsive layout.
- `script.js` — all interactivity (scroll reveal, animated counters, hero canvas, gallery lightbox + filtering, testimonials carousel, theme toggle).
- `assets/` — portrait image, CV PDF, and gallery evidence photos.

## Preview locally

There is nothing to build. Serve the folder so relative paths resolve correctly:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` in a browser.

## Notes

See [`CLAUDE.md`](CLAUDE.md) for architecture details (CSS override layers, the HTML↔JS `data-*` contract, and motion/accessibility conventions).
