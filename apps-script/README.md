# Apps Script — reference copy

This directory holds a reference copy of the Google Apps Script that powers
the KUFC Touch Challenge backend. **The live source of truth is the Apps
Script project itself**, not this file.

- **Project:** "KUFC Touch Challenge"
- **Owner:** rwang@compuray.ca
- **Web app URL:** the `SCRIPT_URL` constant in the HTML files
  (`https://script.google.com/macros/s/AKfycby.../exec`)

## When to update this file

After any edit to the live Apps Script, paste the updated code into
`Code.gs` here and commit, with a CHANGELOG entry describing the deploy.
This keeps the repo's reference in sync so future Claude sessions can
diff and patch without asking for the source again.

## How to deploy a change

1. Open the Apps Script project (Drive → KUFC Touch Challenge spreadsheet
   → Extensions → Apps Script).
2. Paste the new `Code.gs` contents over the existing code.
3. **Save** (Ctrl/Cmd+S).
4. **Deploy → Manage deployments → ✏ pencil → Version → New version → Deploy.**
   The web app URL must stay the same — *don't* create a fresh deployment.
5. Smoke-test by loading a leaderboard page; if the script throws, the
   leaderboard shows the connection-error banner.

## Sheet schema this script expects

For each team (key in `TEAMS`):

- `<TEAM>_Players` — `Name`, `PIN`, `Initials`
- `<TEAM>_Submissions` — `Timestamp`, `Player Name`, `Touches`, `PIN`,
  `Day`, `Touch Types` (comma-joined drill ids)
- `<TEAM>_Total` — `Player`, `Total Touches`, `Percentage` (rebuilt by
  `updateTotals` on every submit and every leaderboard load)

Adding a new division means adding three tabs with this schema **and**
adding the matching entry to the `TEAMS` config in `Code.gs`.

## Notes on the current implementation

- The script trusts the client-sent `touches` total. It doesn't recompute
  from `checkedTypes`, doesn't enforce `MAX_DAILY`, and doesn't allowlist
  drill ids. New drill ids work transparently — they're stored as
  comma-joined strings in the `Touch Types` column.
- `updateTotals` runs on every submit and every leaderboard `doGet`.
  That's fine at this player count but does scale linearly with the
  Submissions tab.
- There's no rate limiting and no CSRF protection. PIN is the only auth.
