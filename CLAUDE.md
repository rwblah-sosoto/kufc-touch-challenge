# CLAUDE.md — Project Guide for Claude

Guidance for Claude (and other AI agents) working in this repo. Read this
before making changes.

## What this project is

A small static PWA for KUFC's 25,000 Touch Challenge. Four HTML pages, a
service worker, a manifest, two logos, and an SVG icon. No build system, no
package manager, no tests. The Google Apps Script backend lives outside this
repo — only its URL is checked in (`SCRIPT_URL` constant).

## Process expectations (every change)

For **every** change you make, you MUST:

1. **Update `CHANGELOG.md`** — add a new dated entry at the top under a fresh
   `## [YYYY-MM-DD]` heading (or amend an existing same-day section). Use
   `Added`, `Changed`, `Fixed`, `Removed` subsections. Be specific (file +
   what + why).
2. **Update `README.md`** if user-visible behavior, drill list, pages, or
   architecture changed.
3. **Update `CLAUDE.md`** (this file) if conventions, file layout, or
   guardrails change.
4. **Commit and push** to GitHub on the working branch. The session has a
   stop-hook that flags unpushed commits — don't end a turn with anything
   unpushed unless the push is genuinely blocked.

The user has explicitly asked for this. Don't skip it.

## File layout

```
index.html              # Submit-touches single-page flow (6 screens)
u11-leaderboard.html    # U11 leaderboard
u12-leaderboard.html    # U12 leaderboard
pst-leaderboard.html    # PST (Position Specific Training) leaderboard
sw.js                   # Service worker — bump CACHE name when HTML changes
manifest.json           # PWA manifest
icon-192.svg, icon-512.svg, kufc-logo.jpg, apex-logo.jpg
apps-script/Code.gs     # Reference copy of the live Apps Script backend
apps-script/README.md   # Deploy steps + sheet schema for the script
README.md, CLAUDE.md, CHANGELOG.md, CLAUDECODE_GITHUB.md
```

## Conventions

### Drills
- Drills are defined **only** in the `TOUCH_TYPES` array in `index.html`.
- Each entry: `{ id, name, touches, group }`. Group is one of `instep`,
  `inside`, `passing`.
- `MAX_DAILY` is computed from `TOUCH_TYPES` — never hardcode the daily total.
  If you reference a daily-total number anywhere (UI text, success message),
  use `MAX_DAILY` via template literal.
- The `id` is sent to the backend in `checkedTypes`. Renaming an `id` would
  break historical sheet data — prefer adding a new `id` rather than renaming.

### Teams
- Three teams: `U11` (blue `#1a5a8a`), `U12` (purple `#7a2a5a`),
  `PST` (orange `#c0560a`). Defined once in `index.html` `:root` as
  `--u11`, `--u12`, `--pst`.
- Adding a team means: a `--<team>` color, a `selected-<team>` class, a
  `team-name.<team>` color rule, a button in the team grid, badge handling
  in `selectTeam()` and `startOver()`, a new leaderboard page, and nav links
  on every page.

### Leaderboard pages
- All three leaderboards are near-identical clones differing only by:
  - `<title>`, hero badge text/color, toolbar label,
  - the `?team=` query parameter in `loadData()`,
  - the `--team-color` CSS var.
- If you change leaderboard logic, change all three.

### Navigation
- The nav strip is duplicated inline at the top of every page. If you add or
  rename a page, update the nav on **all four** pages.

### Service worker
- `sw.js` lists every shipped HTML file in `ASSETS`. Add new pages there.
- Bump `CACHE` (e.g. `kufc-v2` → `kufc-v3`) any time shipped assets change so
  installed PWAs invalidate their cache.

### Backend contract
- `SCRIPT_URL` (Google Apps Script web app) is the same on every page.
- Endpoints (re-stated here for fast reference):
  - `GET ?players=1&team=<TEAM>&t=<cachebust>` → `{ players: [{ name, initials? }] }`
  - `GET ?team=<TEAM>&t=<cachebust>` → `{ players: [{ name, total, pct }] }`
  - `POST { team, name, pin, verifyOnly: true }` → `{ success|pinValid, submittedDays }`
  - `POST { team, name, pin, day, touches, checkedTypes }` → `{ success, total, pct }`
- New teams require the Apps Script + Sheet to support them — frontend changes
  alone won't make a team functional. Flag this when adding teams.
- Full backend reference (Sheet tab schema, `TEAMS` config, deploy steps,
  retired drill ids) lives in **`CLAUDECODE_GITHUB.md`**. Read that file when
  the work crosses the frontend/backend boundary.
- `apps-script/Code.gs` is a versioned reference copy of the live script.
  After any deploy, paste the new code here and commit so the repo stays in
  sync with what's running in production.

### Styling
- Fonts: Barlow (body) and Barlow Condensed (headings/numbers).
- Color tokens live in `:root` of each file. Reuse the existing palette
  (pitch greens, team colors, gold/silver/bronze for ranks).
- Mobile-first; max content width is 480px on the submit page and 640px on
  leaderboards.

## Things to avoid

- **No build step.** Don't introduce bundlers, frameworks, or `node_modules`.
- **Don't hardcode the daily total** — derive from `MAX_DAILY`.
- **Don't rename drill ids** — historical sheet rows reference them.
- **Don't change `SCRIPT_URL`** unless deploying a new Apps Script intentionally.
- **Don't add comments that just describe what the code does.** Existing files
  have minimal comments; match that style.

## Git workflow

- Develop on the branch the harness specifies (currently
  `claude/update-passing-receiving-drills-PDpq3`, but follow the per-session
  branch instruction).
- Commit with descriptive messages. Stage specific files, not `.` / `-A`.
- Push with `git push -u origin <branch>`. If the push is denied (403), say
  so plainly — don't loop on retries.

## Quick reference

- Current daily total: **465** (100 instep + 100 inside + 265 passing).
- Challenge length: **50 days**.
- Goal: **25,000 touches per player**.
- Leaderboard auto-refresh: **every 5 minutes**.
