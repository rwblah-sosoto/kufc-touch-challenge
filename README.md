# KUFC Touch Challenge

A static, mobile-first PWA for tracking Kamloops United FC's **25,000 Touch
Challenge**. Players log daily ball-touch drills, and team leaderboards show
live progress toward the 25,000-touch goal.

Built by [CompuRay Technologies](http://www.compuray.ca), proudly sponsored by
[APEX Surgical](http://www.apexsurgical.ca).

## How it works

1. **Pick your team** — U11, U12, or PST (Position Specific Training).
2. **Pick your name** from the roster (loaded from a Google Sheet).
3. **Enter your 4-digit PIN** (provided by your coach to your parent).
4. **Pick the day** of the 50-day challenge you're logging.
5. **Check off the drills** you completed. Daily total is auto-calculated.
6. **Submit** — touches save to the Sheet and the leaderboard updates within
   ~5 minutes.

Each day can only be submitted once. Already-submitted days appear green with
a ✓ on the day picker.

## Drill list

Drills are grouped into three sections. Daily target is the sum of all drills
(currently **465** including the bonus pattern):

**Instep Juggling** (100)
- Right Foot Top Surface Juggling — 25
- Left Foot Top Surface Juggling — 25
- Alternating Feet Top Surface Juggling — 50

**Inside Surface & Roll Pass** (100)
- Right Foot Inside Surface Juggling — 25
- Left Foot Inside Surface Juggling — 25
- Pass, Roll Pass — 50

**Passing & Receiving** (265)
- Pass and Receive Half Turn Right — 50
- Pass and Receive Half Turn Left — 50
- Pass and Receive Half Turn Alternating or Avoid Pressure — 50
- Alternating Wall 1 Touch — 50
- Bonus Touch Pattern — 65

## Pages

| Page | URL | Purpose |
| --- | --- | --- |
| Submit Touches | `/index.html` | Player flow to log a day's touches |
| U11 Leaderboard | `/u11-leaderboard.html` | Live U11 standings |
| U12 Leaderboard | `/u12-leaderboard.html` | Live U12 standings |
| PST Leaderboard | `/pst-leaderboard.html` | Live PST standings |

Leaderboards refresh automatically every 5 minutes and on demand via the
**↻ Refresh** button.

## Architecture

- **Frontend**: pure HTML / CSS / vanilla JS, no build step. Each page is a
  single self-contained file. Fonts via Google Fonts (Barlow / Barlow Condensed).
- **Backend**: a Google Apps Script web app (`SCRIPT_URL`) backed by a Google
  Sheet. Endpoints (all on the same URL):
  - `GET ?players=1&team=<TEAM>` → roster for a team
  - `GET ?team=<TEAM>` → leaderboard rows (`{ name, total, pct }`)
  - `POST { team, name, pin, verifyOnly: true }` → PIN check, returns submitted days
  - `POST { team, name, pin, day, touches, checkedTypes }` → record a day
- **PWA**: `manifest.json` + `sw.js` (cache-first fallback). Bump the cache
  name in `sw.js` whenever shipped HTML changes so clients pick up updates.
- **Hosting**: GitHub Pages from `main` at
  `https://rwblah-sosoto.github.io/kufc-touch-challenge/`.

## Local development

No build, no server required for HTML edits — open the files directly or
serve the directory with any static server, e.g.:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

The Apps Script backend runs against the production Sheet, so test
submissions will land in real data unless you point `SCRIPT_URL` at a
separate deployment.

## Adding a new drill

Drills are defined in one place: the `TOUCH_TYPES` array in `index.html`.
Each entry has `id`, `name`, `touches`, and `group` (`instep`, `inside`, or
`passing`). `MAX_DAILY` and the daily total bar derive from the array, so
no other code needs to change.

## Repo layout

```
index.html              # Submit-touches flow
u11-leaderboard.html    # U11 leaderboard
u12-leaderboard.html    # U12 leaderboard
pst-leaderboard.html    # PST leaderboard
sw.js                   # Service worker (bump CACHE on changes)
manifest.json           # PWA manifest
icon-192.svg / icon-512.svg / kufc-logo.jpg / apex-logo.jpg
README.md               # This file (human docs)
CLAUDE.md               # Conventions for Claude / AI contributors
CHANGELOG.md            # Per-change history
```

## Contributing

Every change must:
1. Update **CHANGELOG.md** with a dated entry describing the change.
2. Update **README.md** and/or **CLAUDE.md** if behavior, drills, or
   architecture shift.
3. Be committed and pushed to GitHub on its working branch.
