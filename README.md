# Statistical Foundations of AI — MBZUAI Workshop (January 6–8, 2027)

Workshop website, published with GitHub Pages:

**https://jinruinan.github.io/stats-foundations-of-ai-2027/**

- Event: Statistical Foundations of AI, MBZUAI (Masdar City, Abu Dhabi), January 6–8, 2027
- Chair: Prof. Qiang Sun
- Organizing committee: Haiyan Huang, Mladen Kolar, Boaz Nadler, Xinwei Shen, Qiang Sun
- Contact: ai.nexus@mbzuai.ac.ae

## Developing

This is a plain static site — no build step. Serve it locally with:

```bash
python3 -m http.server 8123 --directory .
```

Then open http://127.0.0.1:8123.

## Updating

Edit `index.html` (or files under `assets/`), commit and push to `main`. GitHub Pages
rebuilds the site automatically in about 30–60 seconds.

- `index.html` — all copy, speakers, program, venue, FAQ
- `assets/styles.css` — styling
- `assets/main.js` — navigation, countdown, reveal animations
- `assets/og.jpg` — social sharing image (1200×630)
- `assets/stats-foundations-of-ai-2027.ics` — add-to-calendar file
