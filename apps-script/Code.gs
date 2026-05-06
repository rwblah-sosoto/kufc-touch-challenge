const GOAL = 25000;
const TEAMS = {
  U11: { players: "U11_Players", submissions: "U11_Submissions", totals: "U11_Total" },
  U12: { players: "U12_Players", submissions: "U12_Submissions", totals: "U12_Total" },
  PST: { players: "PST_Players", submissions: "PST_Submissions", totals: "PST_Total" }
};

function getPlayers(ss, team) {
  const sheet = ss.getSheetByName(TEAMS[team].players);
  if (!sheet) throw new Error("Missing sheet tab: " + TEAMS[team].players);
  const rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(r => r[0] && r[1])
    .map(r => ({
      name: String(r[0]).trim(),
      pin: String(r[1]).trim(),
      initials: String(r[2] || "").trim()
    }));
}

function getSubmittedDays(ss, team, playerName) {
  const sheet = ss.getSheetByName(TEAMS[team].submissions);
  if (!sheet) throw new Error("Missing sheet tab: " + TEAMS[team].submissions);
  const rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(r => String(r[1]).trim() === playerName && r[4] !== undefined && r[4] !== "")
    .map(r => Number(r[4]));
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { team, name, pin, touches, day, verifyOnly, checkedTypes } = data;
    if (!TEAMS[team]) return response({ success: false, error: "Invalid team" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const players = getPlayers(ss, team);
    const player = players.find(p => p.name === name && p.pin === pin);
    if (!player) return response({ success: false, pinValid: false, error: "Invalid PIN" });
    if (verifyOnly) {
      const submittedDays = getSubmittedDays(ss, team, name);
      return response({ success: true, pinValid: true, submittedDays });
    }

    // Check if day already submitted
    const submittedDays = getSubmittedDays(ss, team, name);
    if (day && submittedDays.includes(Number(day))) {
      return response({ success: false, error: "DAY_ALREADY_SUBMITTED" });
    }

    const sheet = ss.getSheetByName(TEAMS[team].submissions);
    if (!sheet) throw new Error("Missing sheet tab: " + TEAMS[team].submissions);
    sheet.appendRow([new Date(), name, Number(touches), pin, Number(day), (checkedTypes||[]).join(",")]);
    updateTotals(ss, team, players);

    const totalsSheet = ss.getSheetByName(TEAMS[team].totals);
    if (!totalsSheet) throw new Error("Missing sheet tab: " + TEAMS[team].totals);
    const totalsData = totalsSheet.getDataRange().getValues();
    const playerRow = totalsData.find(r => r[0] === name);
    const total = playerRow ? playerRow[1] : 0;
    const pct = Math.min(100, Math.round(total / GOAL * 100));
    return response({ success: true, total, pct });
  } catch(err) {
    return response({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const team = e.parameter.team;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!team || !TEAMS[team]) return response({ success: false, error: "Please specify a valid team (" + Object.keys(TEAMS).join(", ") + ")" });

    const players = getPlayers(ss, team);
    if (e.parameter.players === "1") return response({ players });

    updateTotals(ss, team, players);
    const totalsSheet = ss.getSheetByName(TEAMS[team].totals);
    if (!totalsSheet) throw new Error("Missing sheet tab: " + TEAMS[team].totals);
    const rows = totalsSheet.getDataRange().getValues().slice(1);
    const playerData = rows.map(r => ({
      name: r[0], total: r[1], pct: r[2],
      initials: (players.find(pl => pl.name === r[0]) || {}).initials || ""
    }));
    return response({ players: playerData, team });
  } catch(err) {
    return response({ success: false, error: err.toString() });
  }
}

function updateTotals(ss, team, players) {
  const sheet = ss.getSheetByName(TEAMS[team].submissions);
  if (!sheet) throw new Error("Missing sheet tab: " + TEAMS[team].submissions);
  const data = sheet.getDataRange().getValues().slice(1);
  const totals = {};
  players.forEach(p => totals[p.name] = 0);
  data.forEach(row => {
    const name = row[1];
    const touches = Number(row[2]);
    if (totals[name] !== undefined) totals[name] += touches;
  });

  const totalsSheet = ss.getSheetByName(TEAMS[team].totals);
  if (!totalsSheet) throw new Error("Missing sheet tab: " + TEAMS[team].totals);
  totalsSheet.clearContents();
  totalsSheet.appendRow(["Player", "Total Touches", "Percentage"]);
  players.forEach(p => {
    const total = totals[p.name] || 0;
    const pct = Math.min(100, Math.round(total / GOAL * 100));
    totalsSheet.appendRow([p.name, total, pct]);
  });
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
