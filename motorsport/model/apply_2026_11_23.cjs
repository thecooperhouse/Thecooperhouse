const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'index.html');
const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs-2026-11-23.json'), 'utf8'));
const output = JSON.parse(fs.readFileSync(path.join(__dirname, 'outputs-2026-11-23.json'), 'utf8'));

function getConst(page, name) {
  const match = page.match(new RegExp(`const ${name} = (.*);`));
  assert(match, `Missing ${name}`);
  return JSON.parse(match[1]);
}
function setConst(page, name, value) {
  const re = new RegExp(`const ${name} = .*;`);
  assert(re.test(page), `Missing ${name}`);
  return page.replace(re, `const ${name} = ${JSON.stringify(value)};`);
}
function replaceExact(page, before, after) {
  assert(page.includes(before), `Missing expected text: ${before.slice(0, 120)}`);
  return page.replace(before, after);
}
function motoDisplayEntry(e) {
  const status = e.status || (e.position === 1 ? e.time : `+${e.gap}`);
  return {name:e.name,team:e.team,position:e.position,points:e.points,classified:e.classified,laps:e.laps,status};
}

const f1InputRound = input.f1.rounds.at(-1);
const motoInputRound = input.moto.rounds.at(-1);
assert.equal(f1InputRound.round, 21);
assert.equal(motoInputRound.round, 21);

const f1Round = {
  rd:21,gp:'Las Vegas GP',circuit:'Las Vegas Strip Circuit',date:'21 Nov',season:2026,
  event_id:'f1:2026:las-vegas:r21',checked_at:'23 November 2026',
  sources:[
    ['FIA final classification',f1InputRound.race.source_url],
    ['Official race result','https://www.formula1.com/en/results/2026/races/1300/las-vegas/race-result'],
    ['Official fastest laps','https://www.formula1.com/en/results/2026/races/1300/las-vegas/fastest-laps'],
    ['Official race report','https://www.formula1.com/en/latest/article/verstappen-wins-exhilarating-las-vegas-grand-prix-from-norris-and-piastri.2eeBWqekZdir9mdDVK9YVX'],
    ['Official circuit record','https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-the-las-vegas-strip-circuit.1W9ULMy0aEkvfsJ9tRzItg.1W9ULMy0aEkvfsJ9tRzItg']
  ],
  race:{
    podium:f1InputRound.race.entries.slice(0,3).map(e=>[e.name,e.team,e.status]),
    classification:f1InputRound.race.entries,
    fl:f1InputRound.race.verified_fastest_lap
  },
  records:[{label:'Official race lap record',t:'1:33.365',who:'Max Verstappen',ev:'2025'}],
  note:'FIA final classification: Leclerc received 10 seconds for causing a collision and Hadjar 10 seconds for driving unnecessarily slowly under Safety Car conditions. Alonso is classified 19th despite retiring. The 2026 GP fastest lap is separate from the official historical race-lap record.'
};
const motoSprint = motoInputRound.sprint.entries.map(motoDisplayEntry);
const motoRace = motoInputRound.race.entries.map(motoDisplayEntry);
const motoRound = {
  rd:21,gp:'Portuguese GP',circuit:'Autódromo Internacional do Algarve, Portimão',date:'21–22 Nov',season:2026,
  event_id:'moto:2026:portugal:r21',checked_at:'23 November 2026',
  sources:[
    ['Official Sprint classification',motoInputRound.sprint.source_url],
    ['Official GP classification',motoInputRound.race.source_url],
    ['Official GP result table','https://stats.motogp.com/en/gp-results'],
    ['Official GP report','https://www.motogp.com/en/news/2026/11/19/bezzecchi-doubles-up-in-portugal-as-marc-marquez-finishes-p8-to-clinch-his-8th-motogp-title/1186076']
  ],
  sprint:{podium:motoSprint.slice(0,3).map(e=>[e.name,e.team,e.status]),classification:motoSprint,fl:motoInputRound.sprint.verified_fastest_lap},
  race:{podium:motoRace.slice(0,3).map(e=>[e.name,e.team,e.status]),classification:motoRace,fl:motoInputRound.race.verified_fastest_lap},
  records:[
    {label:'Official best GP race lap',t:'1:38.237',who:'Pedro Acosta',ev:'2025'},
    {label:'All-time lap record (qualifying)',t:'1:37.201',who:'Marco Bezzecchi',ev:'2026'}
  ],
  note:'Published Sprint and GP classifications are shown in full. The GP fastest lap, official best race lap and all-time qualifying record are deliberately labelled separately. No penalty is claimed where the official classification sheets do not state one.'
};

const f1News = [
  {tag:'confirmed',title:'Las Vegas classification and standings published',body:'The FIA final classification includes the recorded post-race penalties, and its championship-points sheet supplies the revised driver and constructor totals used here.',src:'https://www.fia.com/system/files/decision-document/2026_las_vegas_grand_prix_-_championship_points.pdf',srcNote:'FIA official document 66 · published 22 November; checked 23 November 2026'},
  {tag:'confirmed',title:'Haas confirms its final two-race line-up',body:'Haas confirmed Rafael Câmara will race in Qatar and Abu Dhabi. The model records the confirmed change rather than assuming the earlier regular driver returns.',src:'https://www.formula1.com/en/latest/article/haas-confirm-camara-will-drive-for-the-team-in-final-races-of-2026.2wYY9ymhyqr7rXcuK6S7bj',srcNote:'Official Formula 1 report of team confirmation · published 22 November 2026'},
  {tag:'confirmed',title:'Las Vegas penalty carries into Qatar',body:'The stewards converted an unserved 10-second Las Vegas penalty into a five-place grid drop for the next race. It is reported as a confirmed Qatar grid penalty, not folded into the championship simulation.',src:'https://www.formula1.com/en/latest/article/perez-hit-with-five-place-penalty-in-qatar-after-camara-clash-during-las-vegas-grand-prix.30GG7oJuJ1As0MrkavmStN',srcNote:'Official Formula 1 report · published 22 November 2026'}
];
const motoNews = [
  {tag:'confirmed',title:'Portugal classifications and standings published',body:'MotoGP’s official Sprint and Grand Prix sheets provide the complete classifications, points and lap distinctions used in this update; the current rider table was then reconciled to both sessions.',src:'https://stats.motogp.com/en/world-standing/2026/MotoGP/RidersChampionship',srcNote:'Official MotoGP standings · checked 23 November 2026'},
  {tag:'confirmed',title:'Valencia timetable is available',body:'The Circuit Ricardo Tormo event guide lists the MotoGP practice, qualifying, Sprint, warm-up and Grand Prix starts. The dashboard converts the CET times to Brisbane AEST with the date rollovers shown.',src:'https://www.circuitricardotormo.com/wp-content/uploads/2026/11/FanGuide_ValenciaGP_2026.pdf',srcNote:'Official circuit event guide · checked 23 November 2026; timetable remains subject to change'},
  {tag:'confirmed',title:'One Valencia replacement is confirmed',body:'Yamaha confirmed a continuing injury absence through Valencia and said Augusto Fernández was planned as the replacement. Other riders targeting returns remain regular-grid assumptions until a definitive event entry list is published.',src:'https://www.motogp.com/en/news/2026/11/18/razgatlioglu-to-miss-the-valencia-test/1185673',srcNote:'Official MotoGP report of Yamaha announcement · published 18 November; rechecked 23 November 2026'}
];

let page = fs.readFileSync(pagePath, 'utf8');
assert(page.includes('updated 17 November 2026 · v23.1'));
const f1Races = getConst(page, 'F1_RACES');
const motoRaces = getConst(page, 'MOTO_RACES');
assert.equal(f1Races.at(-1).rd, 20);
assert.equal(motoRaces.at(-1).rd, 20);
f1Races.push(f1Round);
motoRaces.push(motoRound);

page = setConst(page, 'F1_STANDINGS', input.f1.standings);
page = setConst(page, 'F1_CONSTRUCTORS', input.f1.constructors);
page = setConst(page, 'MOTO_STANDINGS', input.moto.standings);
page = setConst(page, 'F1_RACES', f1Races);
page = setConst(page, 'MOTO_RACES', motoRaces);
page = setConst(page, 'F1_CALENDAR', input.f1.remaining_calendar);
page = setConst(page, 'MOTO_CALENDAR', input.moto.remaining_calendar);
page = setConst(page, 'F1_NEWS', f1News);
page = setConst(page, 'MOTO_NEWS', motoNews);
page = setConst(page, 'SESSIONS', input.viewing_times.sessions);
page = setConst(page, 'SESSION_SOURCES', input.viewing_times.sources);
page = setConst(page, 'FORECAST', output);

page = replaceExact(page,
  '<div class="kicker">Points board · 2026 season · updated 17 November 2026 · v23.1 · Qatar Sprint corrected · model recalculated</div>',
  '<div class="kicker">Points board · 2026 season · updated 23 November 2026 · v24 · official results reconciled · model recalculated</div>');
page = replaceExact(page,
  '<figure class="archive-photo"><img src="photos/leclerc-silverstone-2024-20261116.jpg" alt="Charles Leclerc driving a Ferrari at the 2024 British Grand Prix" width="960" height="483" decoding="async"><figcaption><strong>Archive photo · Charles Leclerc, British Grand Prix at Silverstone, 2024.</strong><br>Photo © Jen Ross / <a href="https://commons.wikimedia.org/wiki/File:2024_British_Grand_Prix,_Leclerc_(1).jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>',
  '<figure class="archive-photo"><img src="photos/zhou-singapore-2024-20261123.jpg" alt="Zhou Guanyu driving a Sauber during practice at the 2024 Singapore Grand Prix" width="960" height="640" decoding="async"><figcaption><strong>Archive photo · Zhou Guanyu, Singapore Grand Prix practice, 2024.</strong><br>Photo © Henrikkoh333 / <a href="https://commons.wikimedia.org/wiki/File:Zhou_Guanyu_on_track,_Singapore_Grand_Prix_2024.jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">Creative Commons Attribution 4.0 International (CC BY 4.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>');
page = replaceExact(page,
  '<figure class="archive-photo"><img src="photos/espargaro-martin-sachsenring-2021-20261116.jpg" alt="Pol Espargaró ahead of Jorge Martín during the 2021 German Grand Prix at the Sachsenring" width="960" height="640" decoding="async" loading="lazy"><figcaption><strong>Archive photo · Pol Espargaró and Jorge Martín, German Grand Prix at the Sachsenring, 2021.</strong><br>Photo © Box Repsol / <a href="https://commons.wikimedia.org/wiki/File:Pol_Espargar%C3%B3_and_Jorge_Mart%C3%ADn_2021_Sachsenring.jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>',
  '<figure class="archive-photo"><img src="photos/dovizioso-fernandez-espargaro-catalunya-2022-20261123.jpg" alt="Andrea Dovizioso, Raúl Fernández and Pol Espargaró racing at the 2022 Catalan Grand Prix" width="960" height="640" decoding="async" loading="lazy"><figcaption><strong>Archive photo · Andrea Dovizioso, Raúl Fernández and Pol Espargaró, Catalan Grand Prix, 2022.</strong><br>Photo © Box Repsol / <a href="https://commons.wikimedia.org/wiki/File:Andrea_Dovizioso,_Ra%C3%BAl_Fern%C3%A1ndez_and_Pol_Espargar%C3%B3_2022_Catalunya.jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>');

page = replaceExact(page,
  '<p class="source-line">Standings checked 16 November 2026 against the official <a href="https://www.formula1.com/en/results/2026/drivers">driver table</a>, <a href="https://www.formula1.com/en/results/2026/team">team table</a> and round-20 <a href="https://www.formula1.com/en/results/2026/races/1299/brazil/race-result">final classification</a>. Driver and constructor totals both equal 2,206 points.</p>',
  '<p class="source-line">Standings checked 23 November 2026 against the FIA round-21 <a href="https://www.fia.com/system/files/decision-document/2026_las_vegas_grand_prix_-_championship_points.pdf">championship-points sheet</a>, <a href="https://www.formula1.com/en/results/2026/drivers">official driver table</a> and <a href="https://www.formula1.com/en/results/2026/team">official team table</a>. Driver and constructor totals both equal 2,337 points.</p>');
page = replaceExact(page,
  '<p class="source-line">Standings checked 16 November 2026 against MotoGP’s official <a href="https://stats.motogp.com/en/world-standing">championship standings</a> and Qatar GP result. GP and Sprint points total 3,638; substitutes and wildcards needed to reconcile the season, including zero-point entries, are shown.</p>',
  '<p class="source-line">Standings checked 23 November 2026 against MotoGP’s official <a href="https://stats.motogp.com/en/world-standing/2026/MotoGP/RidersChampionship">riders’ championship table</a> and the Portugal Sprint and GP sheets. GP and Sprint points total 3,827; substitutes and wildcards needed to reconcile the season, including zero-point entries, are shown.</p>');
page = replaceExact(page,
  '<p class="cal-foot"><span class="sprint-chip">S</span>= sprint weekend. Calendar checked against the official 2026 schedule on 16 November. Dates are local to the event; viewing times above use Brisbane AEST. All listed rounds are counted in the title calculations. <a href="https://www.formula1.com/en/racing/2026">Check the official F1 calendar</a> for changes.</p>',
  '<p class="cal-foot"><span class="sprint-chip">S</span>= sprint weekend. Calendar checked against the official 2026 schedule on 23 November. Dates are local to the event; viewing times above use Brisbane AEST. Both listed rounds are counted in the calculations. <a href="https://www.formula1.com/en/racing/2026">Check the official F1 calendar</a> for changes.</p>');
page = replaceExact(page,
  '<p class="cal-foot">Every remaining round includes a Saturday Sprint. The Portuguese timetable above is converted to Brisbane AEST. Calendar checked against the official 2026 schedule on 16 November. Dates are local to the event; viewing times above use Brisbane AEST. All listed rounds are counted in the title calculations. <a href="https://www.motogp.com/en/calendar/2026">Check the official MotoGP calendar</a> for changes.</p>',
  '<p class="cal-foot">The remaining Valencia round includes a Saturday Sprint. Its CET timetable above is converted to Brisbane AEST, including date rollovers. Calendar checked against the official 2026 schedule on 23 November. <a href="https://www.motogp.com/en/calendar/2026">Check the official MotoGP calendar</a> for changes.</p>');
page = replaceExact(page,
  '<p class="news-foot">News checked: 16 November 2026. Stories stay hidden until the latest weekend is marked watched. Each summary links to its source; publication dates are shown below.</p>',
  '<p class="news-foot">News checked: 23 November 2026. Stories stay hidden until the latest weekend is marked watched. Each original summary links directly to its source; only confirmed items are included this week.</p>');
page = replaceExact(page,
  '<p class="news-foot">Portugal updates checked: 17 November 2026; other news retained from 16 November. Stories stay hidden until the latest weekend is marked watched. Each summary links to its source; publication dates are shown below.</p>',
  '<p class="news-foot">News checked: 23 November 2026. Stories stay hidden until the latest weekend is marked watched. Each original summary links directly to its source; only confirmed items are included this week.</p>');

page = replaceExact(page,
  '<p><strong>Corrected 17 November 2026 · v23.1.</strong> Completed the Qatar Sprint details from the official timing sheet, corrected Portugal viewing times and entry assumptions, and reran both championship models. Other facts retain their 16 November check date. Latest-weekend spoiler protection remains unchanged.</p>',
  '<p><strong>Checked 23 November 2026 · v24.</strong> Added each series’ newly completed weekend, final or published official classifications, revised standings, remaining calendars, Brisbane viewing times, current sourced news, replacement photographs and recalculated championship analysis. The two new weekends start protected independently.</p>');
page = replaceExact(page,
  '<p>Historical photos have visible creator, source and exact licence links. This corrective edition retains the two individually verified CC BY 2.0 Wikimedia Commons images added on 16 November; the exact resizing disclosures are visible. <a href="photos/CREDITS.md">Photo credits and reuse details</a>. No endorsement is implied.</p>',
  '<p>Historical photos have visible creator, source, exact licence/version links and resizing disclosures. This edition uses two individually verified Wikimedia Commons images: one CC BY 4.0 and one CC BY 2.0. <a href="photos/CREDITS.md">Photo credits and reuse details</a>. No endorsement is implied.</p>');
page = replaceExact(page,
  '<p><a href="index-v23-2026-11-17-before-qatar-correction.html">Previous edition · v23 · 16 November 2026</a> — exact pre-correction archive; contains known Qatar Sprint errors and may contain spoilers and superseded information. Earlier archives and their assets are preserved.</p>',
  '<p><a href="index-v23-1-2026-11-23-before-maintenance.html">Previous edition · v23.1 · 17 November 2026</a> — exact pre-maintenance archive; may contain spoilers and superseded information. Every earlier archive and referenced image remains preserved.</p>');
page = replaceExact(page,
  '<p>Probabilities were recalculated on 17 November 2026 using 200,000 simulations per championship. They are experimental estimates with limited historical validation. Maximum possible points and mathematical elimination are calculated separately; zero simulated titles do not mean elimination.</p>',
  '<p>Probabilities were recalculated on 23 November 2026 using 200,000 simulations per championship with recorded seeds. Both mathematical eligibility and maximum possible points are calculated separately from simulated chances; the model remains experimental with limited historical validation.</p>');

page = page
  .replaceAll('Experimental model · calculated 17 November 2026.', 'Experimental model · calculated 23 November 2026.')
  .replaceAll('model/inputs-2026-11-17.json', 'model/inputs-2026-11-23.json')
  .replaceAll('model/outputs-2026-11-17.json', 'model/outputs-2026-11-23.json')
  .replace("${r.checked_at?'Checked '+esc(r.checked_at):latest?'Checked 16 November 2026':'Previously verified source'}", "${r.checked_at?'Checked '+esc(r.checked_at):latest?'Checked 23 November 2026':'Previously verified source'}")
  .replace("Official timetable</a> · checked ${key==='moto'?'17':'16'} November 2026", 'Official timetable</a> · checked 23 November 2026')
  .replace('Confirmed next-event absences apply; an occupied substitute seat retains its sampled finishing position without promoting other riders. This is a seat-performance proxy, not an individual substitute forecast. Other remaining entries assume the regular grid.', 'Confirmed remaining-event absences force the unavailable regular entrant to zero; replacement and wildcard riders are not individually forecast. Other entries use the documented regular-grid assumptions. These choices cannot change an already-clinched title.')
  .replace('The model resamples ${T.rounds_observed} complete observed 2026 weekends', 'The model resamples ${T.rounds_observed} completed 2026 Grand Prix weekends');

fs.writeFileSync(pagePath, page);
console.log(`Updated ${pagePath}`);
