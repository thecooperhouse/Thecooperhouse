const fs = require('fs');
const path = require('path');

const priorPath = path.join(__dirname, 'inputs-2026-11-09.json');
const outputPath = path.join(__dirname, 'inputs-2026-11-16.json');
const input = JSON.parse(fs.readFileSync(priorPath, 'utf8'));

// No championship round was held between the 9 and 16 November checks.
// Preserve the verified result history, standings and remaining calendars while
// recording the current source/entry review used by this week's model run.
input.checked_at = '2026-11-16';
input.model_version = 'weekend-bootstrap-1.0.5';
input.entry_overrides = {};
input.entry_assumptions = 'Remaining rounds use the regular grid. Francesco Bagnaia underwent successful surgery on 10 November, but the official update gave no confirmed return date; the checked Portugal event page had not published a definitive entry list, so no absence or substitute is forced. Earlier Qatar withdrawals and substitute results remain recorded in completed-round inputs.';

fs.writeFileSync(outputPath, JSON.stringify(input, null, 2) + '\n');
console.log(`Wrote ${outputPath}`);
