# Changelog

All notable changes to this project are documented in this file.
Newest entries at the top.

## [2026-05-06]

### Added
- `CHANGELOG.md` (this file) for per-change history.
- `CLAUDE.md` documenting conventions and process expectations for AI
  contributors.
- Expanded `README.md` covering the player flow, drill list, pages,
  architecture, and contributing rules.
- Updated `CLAUDECODE_GITHUB.md` (uploaded by Ray) to reflect the new
  drill list (465/day), the PST division, the `--pst` color token, and
  added a "Backend Update — PST + New Drill List" section with concrete
  Sheet / Apps Script steps.
- Cross-link from `CLAUDE.md` → `CLAUDECODE_GITHUB.md` so future agents
  read the backend reference when work crosses the frontend/backend boundary.
- `apps-script/Code.gs` — versioned reference copy of the live Apps Script
  backend, with `PST` added to the `TEAMS` config and the `doGet` error
  string broadened to list teams from `Object.keys(TEAMS)`.
- `apps-script/README.md` — deploy steps and sheet schema for the script,
  with the rule that this directory must be re-pasted after every Apps
  Script deploy to keep the repo in sync.

### Changed
- Refined the "Backend Update" section of `CLAUDECODE_GITHUB.md` after
  reading the actual `Code.gs`: the script doesn't validate `checkedTypes`
  or enforce `MAX_DAILY`, so the only required edits are the `TEAMS`
  addition and the error-message broadening. Optional server-side total
  recompute is documented as a future hardening step, not a requirement.
- **PST (Position Specific Training)** division alongside U11 and U12:
  - New team button on the submit page (`index.html`) with orange
    `#c0560a` color tokens (`--pst`, `.selected-pst`, `.team-name.pst`).
  - New `pst-leaderboard.html` cloned from the U12 leaderboard, using
    `?team=PST` and PST branding.
  - "🏆 PST Leaderboard" nav link added to all four pages.
  - `pst-leaderboard.html` added to the service-worker cache.
- Bonus drill **"Bonus Touch Pattern"** worth **65** touches in the
  Passing & Receiving group.

### Changed
- Passing & Receiving drill list replaced with the new five drills:
  1. Pass and Receive Half Turn Right (50)
  2. Pass and Receive Half Turn Left (50)
  3. Pass and Receive Half Turn Alternating or Avoid Pressure (50)
  4. Alternating Wall 1 Touch (50)
  5. Bonus Touch Pattern (65)
- Daily total now derives from `TOUCH_TYPES` (`MAX_DAILY = 465`).
  Removed the hardcoded "0 of 500 touches" placeholder and the
  hardcoded "Full 500 touches" success-screen message; both now
  template-interpolate `MAX_DAILY`.
- Team-grid layout switched from 2 columns to 3 to accommodate PST.
- Service worker cache name bumped `kufc-v1` → `kufc-v2` so installed
  PWAs invalidate stale assets.

## [Pre-changelog history]

Prior changes were tracked only via git commit messages. Run
`git log --oneline` for the historical record.
