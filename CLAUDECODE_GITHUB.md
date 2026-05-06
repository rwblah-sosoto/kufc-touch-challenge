# ClaudeCode Context — KUFC Touch Challenge (GitHub/PWA Version)

This document captures all context needed to continue development of the HTML/PWA version of the KUFC Touch Challenge in a new Claude Code session.

---

## Project Overview

A web-based Progressive Web App (PWA) for tracking the Kamloops United FC 25,000 Touch Challenge. Players log daily ball touches across 11 drill types over 50 days. Coaches manage rosters via Google Sheets. Live leaderboard updates every 5 minutes.

**Owner:** Ray Wang — rwang@compuray.ca — CompuRay Technologies (compuray.ca)
**Club:** Kamloops United FC (KUFC), BCSPL league, Kamloops BC Canada
**Sponsor:** APEX Surgical (apexsurgical.ca)
**GitHub repo:** github.com/rwblah-sosoto/kufc-touch-challenge
**Live URL:** https://rwblah-sosoto.github.io/kufc-touch-challenge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JavaScript (no framework) |
| Hosting | GitHub Pages (free) |
| Backend | Google Apps Script (web app) |
| Database | Google Sheets |
| Auth | 4-digit PIN per player (light protection) |
| PWA | manifest.json + sw.js service worker |

---

## Repository File Structure

```
kufc-touch-challenge/
├── index.html              # Submit form (main page parents bookmark)
├── u11-leaderboard.html    # U11 live leaderboard
├── u12-leaderboard.html    # U12 live leaderboard
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icon-192.svg            # PWA icon
├── icon-512.svg            # PWA icon
├── apex-logo.jpg           # APEX Surgical sponsor logo
├── kufc-logo.jpg           # KUFC crest
└── README.md
```

---

## Google Sheets Structure

**Spreadsheet name:** KUFC Touch Challenge
**Owner:** rwang@compuray.ca

### Tabs:
- `U11_Players` — Name, PIN, Initials (one row per U11 player)
- `U12_Players` — Name, PIN, Initials (one row per U12 player)
- `U11_Submissions` — Timestamp, Player Name, Touches, PIN, Day, Touch Types
- `U12_Submissions` — same structure
- `U11_Total` — Player, Total Touches, Percentage (auto-calculated)
- `U12_Total` — same structure

---

## Google Apps Script

**Deployment URL:** https://script.google.com/macros/s/AKfycbyBmra7OsrqemyZO8-n7jlpVd3FrEzHAriipSE4CJc6kWYDmwRiAj_qyuQXmNnyOSjk/exec
**Project name:** KUFC Touch Challenge
**Current version:** 5
**Owner:** rwang@compuray.ca

### Key functions:
- `doGet(e)` — returns player list (`?players=1&team=U11`) or leaderboard data (`?team=U11`)
- `doPost(e)` — verifies PIN, logs submission, updates totals. Accepts `verifyOnly: true` for PIN check without logging
- `getPlayers(ss, team)` — reads from Players tab
- `updateTotals(ss, team, players)` — recalculates Total tab
- `getSubmittedDays(ss, team, playerName)` — returns array of submitted day numbers
- `keepWarm()` — trigger runs every 5 min to prevent cold starts (optional, not currently active)

### TEAMS config in Apps Script:
```javascript
const TEAMS = {
  U11: { players: "U11_Players", submissions: "U11_Submissions", totals: "U11_Total" },
  U12: { players: "U12_Players", submissions: "U12_Submissions", totals: "U12_Total" }
};
```

---

## User Flow (Submit Form)

1. Select team (U11 or U12)
2. Pick player name from grid (loaded live from Google Sheets Players tab)
3. Enter 4-digit PIN (verified server-side by Apps Script)
4. Pick day (1-50). Already submitted days shown as green ✓ and blocked
5. Check off completed touch types (11 checkboxes, auto-calculates total)
6. Submit — saves to Google Sheets, shows success screen with stats

---

## Touch Types (11 total, 450 touches = full day)

```javascript
const TOUCH_TYPES = [
  { id: 'rf_top',    name: 'Right Foot Top Surface Juggling',       touches: 25, group: 'instep'  },
  { id: 'lf_top',    name: 'Left Foot Top Surface Juggling',        touches: 25, group: 'instep'  },
  { id: 'alt_top',   name: 'Alternating Feet Top Surface Juggling', touches: 50, group: 'instep'  },
  { id: 'rf_ins',    name: 'Right Foot Inside Surface Juggling',    touches: 25, group: 'inside'  },
  { id: 'lf_ins',    name: 'Left Foot Inside Surface Juggling',     touches: 25, group: 'inside'  },
  { id: 'roll_pass', name: 'Pass, Roll Pass',                       touches: 50, group: 'inside'  },
  { id: 'pass_str',  name: 'Pass and Receive Straight',             touches: 50, group: 'passing' },
  { id: 'pass_htr',  name: 'Pass and Receive Half Turn Right',      touches: 50, group: 'passing' },
  { id: 'pass_htl',  name: 'Pass and Receive Half Turn Left',       touches: 50, group: 'passing' },
  { id: 'pass_ang',  name: 'Pass and Receive on an Angle',          touches: 50, group: 'passing' },
  { id: 'pass_1t',   name: 'Pass and Receive 1 Touch',              touches: 50, group: 'passing' },
];
```

---

## Brand & Design

```css
--pitch: #1a4a2a;        /* dark green — headers, buttons */
--pitch-mid: #245c35;    /* nav bar, stats bar */
--green: #1a7a4a;        /* accents, checkmarks */
--green-light: #22a05e;  /* club label text */
--green-pale: #e8f5ee;   /* selected states background */
--u11: #1a5a8a;          /* U11 blue */
--u12: #7a2a5a;          /* U12 purple */
--gold: #e8a020;         /* trophies, badges */
--off-white: #f4f6f2;    /* page background */
--text: #1a1f1a;
--text-muted: #5a6a5a;
--warning-bg: #fff8e8;
--warning-border: #e8c060;
--warning-text: #7a4a00;
Font: Barlow Condensed (headers/titles) + Barlow (body) — Google Fonts
```

---

## Known Issues / Limitations

- Google Apps Script has 3-8 second cold start delay when unused
- Speed is acceptable in real use (kids submit daily, keeping script warm)
- Apps Script free tier: 6 min execution/day — leaderboard set to 5-min refresh to conserve
- Image paths must use full GitHub Pages URL: `https://rwblah-sosoto.github.io/kufc-touch-challenge/apex-logo.jpg`
- GitHub file replacement requires editing files directly in GitHub UI (upload doesn't always replace)
- Firestore security rules are in test mode — not applicable to this version

---

## What's Working

- Full submit flow (team → player → PIN → day → checkboxes → submit)
- Duplicate day blocking (greyed out in day picker)
- Real data saves to Google Sheets
- U11 and U12 leaderboards loading from Sheets
- PWA installable on iPhone and Android
- KUFC logo and APEX Surgical sponsor bar on all pages
- Navigation bar linking all pages
- End-of-day warning on team select, day picker, and touch log screens
- Parent instruction PDF with logos, warning, step-by-step guide
- Google Sites version also live (Pete manages videos page)

---

## What's NOT Done / Future Work

- Connect to custom domain (kufc.compuray.ca via GoDaddy CNAME → GitHub Pages)
- Native app replacing this version (see CLAUDENATIVEAPP.md)
- Instructional Videos page (Pete manages this on Google Sites)
- Adding more age groups (U13, U14) — just add tabs to Google Sheet and update TEAMS config

---

## How to Update Player List / PINs

Edit the `U11_Players` or `U12_Players` tab in Google Sheets. Changes take effect immediately — no code changes needed.

## How to Correct a Wrong Submission

1. Open Google Sheet → go to `U11_Submissions` or `U12_Submissions`
2. Find the row with the wrong player name and day number
3. Delete that entire row
4. The day unlocks automatically next time the player opens the app
5. The Total tab recalculates on next submission

---

## Deployment Process

Any change to HTML files:
1. Edit file directly on GitHub (click file → pencil icon → edit → commit)
2. OR upload new file via Add file → Upload files (sometimes doesn't replace — use direct edit to be safe)
3. Changes go live within 1-2 minutes

Any change to Apps Script:
1. Edit code in Apps Script editor
2. Deploy → Manage deployments → edit → New version → Deploy
3. Must create new version or old code stays live

---

## Google Sites (Pete's version)

Pete Stefanuto manages the Google Sites version which embeds the same HTML files plus his own Instructional Videos page.

- Site URL: sites.google.com/compuray.ca/kufc-touch-challenge
- Pete can add/edit YouTube videos on the Videos page himself
- The embedded HTML files should be kept in sync with GitHub versions
- Pete's email: (ask Ray)

