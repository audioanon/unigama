# unigama

Project page for UniGAMA. Plain static HTML, CSS, and JavaScript — no build step, no dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole page. All content is static markup. |
| `styles.css` | All styling. |
| `waveforms.js` | Precomputed waveform peaks for the demo clips. |
| `app.js` | Draws the clickable waveform above each `<audio>` element. |
| `audios/`, `figures/`, `logo.png` | Assets. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

Every path in the page is relative, so the site works at any URL — a project page
(`user.github.io/unigama/`), a user page, or a custom domain — with no configuration.

## Deploying to GitHub Pages

Push the repository, then in **Settings → Pages** set **Source** to *Deploy from a branch*
and pick the branch with **/ (root)** as the folder. The page is live a minute later.

## Editing

Open `index.html` in an editor and change the markup directly. To preview locally:

    python3 -m http.server 8000

then visit <http://localhost:8000>. (Opening `index.html` directly by double-clicking also
works, since nothing is fetched at runtime.)

To regenerate `waveforms.js`, recompute 96 peak values per clip and write them in the same
shape: `"audios/name.wav": { duration: <seconds>, peaks: [...] }`.

## `old-vite-app/`

The previous Vue + Vite + Tailwind source. Everything in it was carried over into the static
files above, so it is safe to delete.
