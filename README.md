# Guides

A small static site: a landing page with four cards (Guide One–Four), each
linking to its own page. Compass theme — the four cards sit in the four
quadrants of a compass (NW / NE / SW / SE), and the logo mark doubles as a
compass rose in the top-left and bottom-right corners of every page.

## Structure

```
.
├── index.html          landing page (the 4 cards)
├── guide-one.html
├── guide-two.html
├── guide-three.html
├── guide-four.html
├── assets/
│   ├── style.css        all styling — one shared file
│   └── logo.svg          compass-rose mark, used top-left & bottom-right
└── README.md
```

All links are relative, so this works whether it's served from a user site
(`username.github.io`) or a project site (`username.github.io/repo-name`) —
no path changes needed either way.

## Publish with GitHub Pages

1. Create a new GitHub repo and push these files to the root of the `main`
   branch (see commands below).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
5. GitHub gives you a URL a minute or two later — usually
   `https://<your-username>.github.io/<repo-name>/`.

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Editing content

- **Card titles / links on the landing page** → edit the four `<a class="guide-card">`
  blocks in `index.html`.
- **Adding a new pages** → add this block and fill in the relevant html reference or webpage
      <a class="guide-card" href="HTML OR WEBPAGE">
        <div class="card-top">
          <div class="card-bearing">SHORTNAME</div>
          <div class="card-index">INDEX</div>
        </div>
        <div>
          <p class="card-meta">META INFO</p>
          <h2 class="card-title">TITLE</h2>
          <p class="card-desc">Short description of the tool</p>
        </div>
        <span class="card-cta">Open tool <span class="arrow">→</span></span>
      </a>
- **Each guide's content** → edit the `<section>` blocks in the matching
  `guide-*.html` file (Overview / Steps / Notes — replace freely, this is
  just a starting structure).
- **Colors / fonts** → all defined as CSS variables at the top of
  `assets/style.css` under `:root`.
- **Logo** → `assets/logo.svg`. It's a single-color line mark that inherits
  `currentColor`, so it recolors automatically if you change the text color
  around it. Swap in your own SVG or PNG and update the two `<img>` tags in
  each HTML file if you'd rather use a different logo.
- **Add a 5th page** → copy any `guide-*.html` file, edit its content, then
  add a matching card block in `index.html`.
