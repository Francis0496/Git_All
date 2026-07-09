# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal brand / portfolio website for Francis Sesay (AI engineer & educator). It is **plain static front-end** — three hand-authored files, no framework, no build step, no package manager, no tests, no dependencies to install.

- `index.html` — all page content (semantic sections: hero, about, impact, leadership, experience, education, projects, awards, gallery, skills, testimonials, contact).
- `style.css` — all styling (~2700 lines).
- `script.js` — all interactivity (vanilla JS, no modules/imports).
- `assets/` — `francis-portrait.png`, `cv/francis-sesay-cv.pdf`, and `gallery/*.jpeg` evidence images.

## Running / previewing

There is nothing to build. Open `index.html` directly, or serve the folder for correct relative-path behavior:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

There is no lint, test, or CI configuration in the repo.

## Architecture notes that aren't obvious from one file

**CSS is layered by successive redesigns, not organized by component.** `style.css` redefines `:root` custom properties **three times**: the base theme at line ~3, then `/* 2026 platform expansion */` (~line 935), then `/* Elite portfolio redesign layer */` (~line 1421) which overrides the accent/background palette again. When changing colors or spacing, the *last* definition wins — search for the property across all three layers and edit the effective (latest) one, or your change silently won't take effect. Theming is driven by `data-theme="dark|light"` on `<html>`; light-mode overrides live under `:root[data-theme='light']` blocks.

**HTML ↔ JS contract is by `id` and `data-*` attribute, so markup and script must stay in sync:**
- Impact counters: `<h3 class="counter" data-target="3000" data-suffix="%">`. `animateCounters()` reads `data-target` (default suffix `+`) and only fires once, when `#impact` scrolls into view.
- Gallery: each `.gallery-item` button carries `data-category`, `data-image`, `data-title`, `data-caption`. `initGallery()` preloads each `data-image`; the tile only swaps from generated placeholder art to the real photo *after the image successfully loads* (adds `.has-image`, sets `--gallery-image`). Filter buttons match on `data-filter` vs `data-category`. Clicking an item opens the shared `#galleryLightbox`. Adding a gallery photo = drop the file in `assets/gallery/` **and** add a matching `.gallery-item` button referencing it.
- `.placeholder-link` (`aria-disabled="true"`) links have their click `preventDefault()`-ed — used for not-yet-available GitHub/demo/CV links. Replace the class + `href` when a real link exists (see `assets/cv/README.md` for the CV link swap pattern).

**Motion is centrally gated by `prefers-reduced-motion`.** The hero neural-network canvas (`initHeroNetwork`), cursor glow, magnetic buttons, and tilt cards all early-return when reduced motion is requested. Scroll-reveal uses an `IntersectionObserver` adding `.visible` to `.reveal` elements. Keep new decorative animations behind the same guard.

**`script.js` runs immediately (`<script src>` at end of `<body>`, no `DOMContentLoaded` wrapper)** and queries elements up front, so keep it as the last element before `</body>`. Everything is null-guarded (`if (!el) return`), so missing optional elements degrade gracefully rather than throwing.

## Conventions

- No emoji/icon fonts: UI "icons" are text (e.g. theme toggle shows the words `Moon`/`Sun`, `Prev`/`Next`, timeline badges are 2-letter text spans). Follow this when adding controls.
- Accessibility is maintained deliberately: `aria-*` attributes, `aria-pressed` on filter buttons, `aria-hidden` on decorative layers, a skip link, and `aria-expanded`/`aria-label` toggling on the mobile nav. Preserve these when editing markup.
- The remaining open task is tracked in `TODO.md` (final a11y/responsive pass on small screens in both themes).
