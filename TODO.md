# TODO

- [x] Rebuild `index.html` into full 2026 premium brand architecture (all requested sections + semantic upgrades)
- [x] Rebuild `style.css` with exact premium palette, glassmorphism system, responsive polish, and advanced component styling
- [x] Rebuild `script.js` with neural-network hero canvas, cursor glow, counters, carousel, magnetic/tilt/parallax interactions, and performance guards
- [x] Run final consistency pass for accessibility, responsiveness, and navigation clarity on small screens in both themes
  - Lightbox dialog now traps Tab focus and restores focus to the triggering gallery item on close
  - Escape-closing the mobile nav returns focus to the menu toggle
  - Impact counters and testimonial auto-rotation now respect `prefers-reduced-motion`
  - Light-theme accent text now uses `--accent-ink` (#0e7490), fixing WCAG AA contrast failures (was 1.83:1, now ~5.1:1); decorative accents unchanged
