const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'index.html');
const output = JSON.parse(fs.readFileSync(path.join(__dirname, 'outputs-2026-11-16.json'), 'utf8'));

function replaceConst(page, name, value) {
  const pattern = new RegExp(`const ${name} = .*;`);
  if (!pattern.test(page)) throw new Error(`Missing ${name}`);
  return page.replace(pattern, `const ${name} = ${JSON.stringify(value)};`);
}

function replaceExact(page, before, after) {
  if (!page.includes(before)) throw new Error(`Missing expected text: ${before.slice(0, 120)}`);
  return page.replace(before, after);
}

const f1News = [
  {
    tag: 'confirmed',
    title: 'São Paulo classification remains current',
    body: 'No Formula 1 round was held after São Paulo. The dashboard retains the revised final classification and official championship tables.',
    src: 'https://www.formula1.com/en/results/2026/races/1299/brazil/race-result',
    srcNote: 'Official result and standings · rechecked 16 November 2026'
  },
  {
    tag: 'confirmed',
    title: 'Las Vegas timetable rechecked',
    body: 'The official timetable still lists a conventional five-session weekend. Every start below is converted from Las Vegas local time to Australia/Brisbane AEST.',
    src: 'https://www.formula1.com/en/latest/article/formula-1-heineken-las-vegas-grand-prix-2026.1qmWzcBwKK5hkTbYbhVC22',
    srcNote: 'Official timetable · checked 16 November 2026'
  },
  {
    tag: 'confirmed',
    title: 'Formula 1 announces multi-year supporter deal',
    body: 'Formula 1 confirmed Archer as an Official Supporter. The announcement says future air-taxi integration at selected events is exploratory and subject to regulatory approval.',
    src: 'https://corp.formula1.com/archer-partners-with-formula-1-as-official-supporter/',
    srcNote: 'Official announcement · published 12 November 2026'
  }
];

const motoNews = [
  {
    tag: 'confirmed',
    title: 'Portugal timetable rechecked',
    body: 'The official event page continues to list Portimão as the next MotoGP weekend. Session starts below are converted to Australia/Brisbane AEST.',
    src: 'https://www.motogp.com/en/calendar/2026/event/portugal/c7f7626b-807f-4a6f-813e-7ad2c68302a3',
    srcNote: 'Official event page · checked 16 November 2026'
  },
  {
    tag: 'confirmed',
    title: 'Ducati confirms successful surgery',
    body: 'Ducati confirmed successful surgery following the Qatar injury. The official update says recovery progress will determine the return timeline, so this dashboard does not assume a Portugal absence.',
    src: 'https://www.motogp.com/en/news/2026/11/10/ducati-confirm-successful-surgery-for-bagnaia/1184971',
    srcNote: 'Official MotoGP update · published 10 November 2026'
  },
  {
    tag: 'confirmed',
    title: 'Official title-fight explainer published',
    body: 'MotoGP’s official explainer reviews the remaining mathematical contenders and the two-round run-in. The dashboard’s eligibility calculation remains separate from its simulation.',
    src: 'https://www.motogp.com/en/news/2026/11/11/two-rounds-to-go-the-story-behind-the-2026-title-fight/1184983',
    srcNote: 'Official analysis · published 11 November 2026'
  }
];

let page = fs.readFileSync(pagePath, 'utf8');
page = replaceConst(page, 'F1_NEWS', f1News);
page = replaceConst(page, 'MOTO_NEWS', motoNews);
page = replaceConst(page, 'FORECAST', output);

page = replaceExact(page,
  '<div class="kicker">Points board · 2026 season · updated 9 November 2026 · v22.1 · sources reconciled · model recalculated</div>',
  '<div class="kicker">Points board · 2026 season · updated 16 November 2026 · v23 · sources reconciled · model recalculated</div>');
page = replaceExact(page,
  '<figure class="archive-photo"><img src="photos/hamilton-silverstone-2024-20261109.jpg" alt="Lewis Hamilton driving a Mercedes at the 2024 British Grand Prix" width="960" height="554" decoding="async"><figcaption><strong>Archive photo · Lewis Hamilton, British Grand Prix at Silverstone, 2024.</strong><br>Photo © Jen Ross / <a href="https://commons.wikimedia.org/wiki/File:2024_British_Grand_Prix,_Hamilton_(5).jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping or other edits.</figcaption></figure>',
  '<figure class="archive-photo"><img src="photos/leclerc-silverstone-2024-20261116.jpg" alt="Charles Leclerc driving a Ferrari at the 2024 British Grand Prix" width="960" height="483" decoding="async"><figcaption><strong>Archive photo · Charles Leclerc, British Grand Prix at Silverstone, 2024.</strong><br>Photo © Jen Ross / <a href="https://commons.wikimedia.org/wiki/File:2024_British_Grand_Prix,_Leclerc_(1).jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>');
page = replaceExact(page,
  '<figure class="archive-photo"><img src="photos/marquez-rabat-le-mans-2021-20261109.jpg" alt="Marc Márquez followed by Tito Rabat during the 2021 French Grand Prix at Le Mans" width="960" height="640" decoding="async" loading="lazy"><figcaption><strong>Archive photo · Marc Márquez and Tito Rabat, French Grand Prix at Le Mans, 2021.</strong><br>Photo © Box Repsol / <a href="https://commons.wikimedia.org/wiki/File:Marc_M%C3%A1rquez_and_Tito_Rabat_2021_Le_Mans.jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping or other edits.</figcaption></figure>',
  '<figure class="archive-photo"><img src="photos/espargaro-martin-sachsenring-2021-20261116.jpg" alt="Pol Espargaró ahead of Jorge Martín during the 2021 German Grand Prix at the Sachsenring" width="960" height="640" decoding="async" loading="lazy"><figcaption><strong>Archive photo · Pol Espargaró and Jorge Martín, German Grand Prix at the Sachsenring, 2021.</strong><br>Photo © Box Repsol / <a href="https://commons.wikimedia.org/wiki/File:Pol_Espargar%C3%B3_and_Jorge_Mart%C3%ADn_2021_Sachsenring.jpg">Wikimedia Commons source</a> · <a href="https://creativecommons.org/licenses/by/2.0/" rel="license">Creative Commons Attribution 2.0 Generic (CC BY 2.0)</a> · Wikimedia 960px thumbnail, proportionally resized; no cropping, recolouring or other edits.</figcaption></figure>');

page = page
  .replaceAll('Standings checked 9 November 2026', 'Standings checked 16 November 2026')
  .replaceAll('Calendar checked against the official 2026 schedule on 9 November.', 'Calendar checked against the official 2026 schedule on 16 November.')
  .replaceAll('News checked: 9 November 2026.', 'News checked: 16 November 2026.')
  .replaceAll('checked 9 November 2026 · session times may change', 'checked 16 November 2026 · session times may change')
  .replaceAll('Experimental model · calculated 9 November 2026.', 'Experimental model · calculated 16 November 2026.')
  .replaceAll('model/inputs-2026-11-09.json', 'model/inputs-2026-11-16.json')
  .replaceAll('model/outputs-2026-11-09.json', 'model/outputs-2026-11-16.json');

page = replaceExact(page,
  '<p><strong>Checked 9 November 2026 · v22.1.</strong> This saved dashboard adds each series’ newly completed weekend, revised official standings, remaining calendars, Brisbane viewing times and current sourced news. Post-race changes and confirmed non-starts are incorporated where verified. The latest Formula 1 and MotoGP weekends remain protected independently.</p>',
  '<p><strong>Checked 16 November 2026 · v23.</strong> No new championship round was held this week, so the protected São Paulo and Qatar results and official standings remain unchanged. Remaining calendars, Brisbane viewing times, current sourced news, photographs and probability calculations were refreshed. The latest Formula 1 and MotoGP weekends remain protected independently.</p>');
page = replaceExact(page,
  '<p><a href="index-v22-2026-11-09-pre-hotfix.html">Previous edition · v22 · 9 November 2026</a> — archived unchanged before the display hotfix; may contain spoilers and superseded information. The unchanged v21 archive and earlier archives remain available through the repository.</p>',
  '<p><a href="index-v22-1-2026-11-16-before-maintenance.html">Previous edition · v22.1 · 9 November 2026</a> — exact pre-maintenance archive; may contain spoilers and superseded information. The v22 pre-hotfix archive and earlier archives remain available through the repository.</p>');
page = replaceExact(page,
  '<p>Probabilities were recalculated on 9 November 2026 using 200,000 simulations per championship. They are experimental estimates with limited historical validation. Maximum possible points and mathematical elimination are calculated separately; zero simulated titles do not mean elimination.</p>',
  '<p>Probabilities were recalculated on 16 November 2026 using 200,000 simulations per championship. They are experimental estimates with limited historical validation. Maximum possible points and mathematical elimination are calculated separately; zero simulated titles do not mean elimination.</p>');

fs.writeFileSync(pagePath, page);
console.log(`Updated ${pagePath}`);
