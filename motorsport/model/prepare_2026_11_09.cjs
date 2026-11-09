const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const prior = JSON.parse(fs.readFileSync(path.join(__dirname, 'inputs-2026-11-02.json'), 'utf8'));
const pagePath = path.join(root, 'index.html');

const f1Standings = [
  ['Kimi Antonelli','Mercedes',390],['Max Verstappen','Red Bull Racing',279],['Lewis Hamilton','Ferrari',261],
  ['George Russell','Mercedes',262],['Charles Leclerc','Ferrari',249],['Lando Norris','McLaren',246],
  ['Oscar Piastri','McLaren',152],['Isack Hadjar','Red Bull Racing',122],['Liam Lawson','Racing Bulls',89],
  ['Pierre Gasly','Alpine',42],['Arvid Lindblad','Racing Bulls',38],['Franco Colapinto','Alpine',27],
  ['Oliver Bearman','Haas F1 Team',23],['Gabriel Bortoleto','Audi',14],['Nico Hülkenberg','Audi',14],
  ['Esteban Ocon','Haas F1 Team',7],['Fernando Alonso','Aston Martin',7],['Carlos Sainz','Williams',7],
  ['Alexander Albon','Williams',5],['Yuki Tsunoda','Racing Bulls',1],['Ryo Hirakawa','Haas F1 Team',1],
  ['Rafael Câmara','Haas F1 Team',0],['Lance Stroll','Aston Martin',0],['Valtteri Bottas','Cadillac',0],['Sergio Pérez','Cadillac',0]
];
// Official published order is used for tied scores.
const f1OfficialOrder = ['Kimi Antonelli','Max Verstappen','George Russell','Lewis Hamilton','Charles Leclerc','Lando Norris','Oscar Piastri','Isack Hadjar','Liam Lawson','Pierre Gasly','Arvid Lindblad','Franco Colapinto','Oliver Bearman','Gabriel Bortoleto','Nico Hülkenberg','Esteban Ocon','Fernando Alonso','Carlos Sainz','Alexander Albon','Yuki Tsunoda','Ryo Hirakawa','Rafael Câmara','Lance Stroll','Valtteri Bottas','Sergio Pérez'];
f1Standings.sort((a,b)=>f1OfficialOrder.indexOf(a[0])-f1OfficialOrder.indexOf(b[0]));
const f1Constructors = [['Mercedes',652],['Ferrari',510],['Red Bull Racing',415],['McLaren',398],['Racing Bulls',114],['Alpine',69],['Haas F1 Team',31],['Audi',28],['Williams',12],['Aston Martin',7],['Cadillac',0]];

const motoStandings = [
  ['Marc Márquez','Ducati Lenovo',431],['Jorge Martín','Aprilia Racing',371],['Marco Bezzecchi','Aprilia Racing',357],
  ['Pedro Acosta','Red Bull KTM',309],['Ai Ogura','Trackhouse Aprilia',294],['Fabio Di Giannantonio','VR46 Ducati',282],
  ['Raúl Fernández','Trackhouse Aprilia',258],['Álex Márquez','Gresini Ducati',197],['Francesco Bagnaia','Ducati Lenovo',173],
  ['Enea Bastianini','KTM Tech3',147],['Fermín Aldeguer','Gresini Ducati',129],['Brad Binder','Red Bull KTM',118],
  ['Luca Marini','Honda HRC',117],['Fabio Quartararo','Monster Yamaha',79],['Diogo Moreira','LCR Honda',78],
  ['Franco Morbidelli','VR46 Ducati',70],['Johann Zarco','LCR Honda',63],['Joan Mir','Honda HRC',33],
  ['Jack Miller','Pramac Yamaha',31],['Álex Rins','Monster Yamaha',29],['Iker Lecuona','Gresini Ducati',18],
  ['Toprak Razgatlıoğlu','Pramac Yamaha',18],['Maverick Viñales','KTM Tech3',17],['Augusto Fernández','Yamaha (wildcard)',6],
  ['Pol Espargaró','KTM Tech3',5],['Somkiat Chantra','Honda HRC (sub)',3],['Takaaki Nakagami','Honda HRC (sub)',3],
  ['Jake Dixon','Honda HRC (sub)',2],['Cal Crutchlow','LCR Honda (sub)',0],['Jonas Folger','KTM Tech3 (sub)',0],
  ['Lorenzo Savadori','Aprilia / Trackhouse (wildcard / sub)',0],['Michele Pirro','Gresini Ducati (sub)',0],['Aleix Espargaró','Honda HRC (sub)',0]
];

const f1RaceEntries = [
 ['Lando Norris','McLaren',1,true,'1:35:23.504',25,71],['Max Verstappen','Red Bull Racing',2,true,'+14.602s',18,71],
 ['Isack Hadjar','Red Bull Racing',3,true,'+24.485s',15,71],['George Russell','Mercedes',4,true,'+33.991s',12,71],
 ['Kimi Antonelli','Mercedes',5,true,'+41.017s',10,71],['Oscar Piastri','McLaren',6,true,'+56.475s',8,71],
 ['Liam Lawson','Racing Bulls',7,true,'+75.402s',6,71],['Charles Leclerc','Ferrari',8,true,'+78.586s',4,71],
 ['Lewis Hamilton','Ferrari',9,true,'+1 lap',2,70],['Nico Hülkenberg','Audi',10,true,'+1 lap',1,70],
 ['Arvid Lindblad','Racing Bulls',11,true,'+1 lap',0,70],['Fernando Alonso','Aston Martin',12,true,'+1 lap',0,70],
 ['Franco Colapinto','Alpine',13,true,'+1 lap',0,70],['Pierre Gasly','Alpine',14,true,'+1 lap',0,70],
 ['Alexander Albon','Williams',15,true,'+1 lap',0,70],['Gabriel Bortoleto','Audi',16,true,'+1 lap',0,70],
 ['Oliver Bearman','Haas F1 Team',17,true,'+1 lap',0,70],['Sergio Pérez','Cadillac',18,true,'+2 laps',0,69],
 ['Carlos Sainz','Williams',19,true,'+2 laps',0,69],['Rafael Câmara','Haas F1 Team',20,true,'+2 laps',0,69],
 ['Lance Stroll','Aston Martin',null,false,'DNF',0,30],['Valtteri Bottas','Cadillac',null,false,'DNS',0,0]
].map(([name,team,position,classified,status,points,laps])=>({name,team,position,classified,status,points,laps}));
const f1QualifyingNames = ['Lando Norris','George Russell','Kimi Antonelli','Charles Leclerc','Liam Lawson','Nico Hülkenberg','Isack Hadjar','Oliver Bearman','Fernando Alonso','Alexander Albon','Lewis Hamilton','Oscar Piastri','Rafael Câmara','Arvid Lindblad','Carlos Sainz','Max Verstappen','Franco Colapinto','Pierre Gasly','Lance Stroll','Valtteri Bottas','Sergio Pérez','Gabriel Bortoleto'];
const f1Round = {
  round:20,slug:'brazil',
  race:{entries:f1RaceEntries,source_url:'https://www.formula1.com/en/results/2026/races/1299/brazil/race-result',verified_fastest_lap:{who:'Kimi Antonelli',t:'1:12.689',extra:'lap 55; official GP fastest lap'}},
  qualifying:{entries:f1QualifyingNames.map((name,i)=>({name,team:f1RaceEntries.find(e=>e.name===name)?.team||f1Standings.find(e=>e[0]===name)[1],position:i+1})),source_url:'https://www.formula1.com/en/results/2026/races/1299/brazil/qualifying'}
};

const motoSprintEntries = [
 ['Marc Márquez','Ducati Lenovo',1,12],['Fabio Di Giannantonio','VR46 Ducati',2,9],['Jorge Martín','Aprilia Racing',3,7],
 ['Raúl Fernández','Trackhouse Aprilia',4,6],['Johann Zarco','LCR Honda',5,5],['Pedro Acosta','Red Bull KTM',6,4],
 ['Ai Ogura','Trackhouse Aprilia',7,3],['Enea Bastianini','KTM Tech3',8,2],['Iker Lecuona','Gresini Ducati',9,1],
 ['Marco Bezzecchi','Aprilia Racing',null,0],['Fermín Aldeguer','Gresini Ducati',null,0],['Francesco Bagnaia','Ducati Lenovo',null,0]
].map(([name,team,position,points])=>({name,number:0,position,points,team,time:'',gap:position?'':'DNF',classified:!!position}));
const motoRaceEntries = [
 ['Marco Bezzecchi','Aprilia Racing',1,25,"41'29.173",''],['Marc Márquez','Ducati Lenovo',2,20,'','3.083'],
 ['Raúl Fernández','Trackhouse Aprilia',3,16,'','3.614'],['Ai Ogura','Trackhouse Aprilia',4,13,'','4.885'],
 ['Enea Bastianini','KTM Tech3',5,11,'',''],['Pedro Acosta','Red Bull KTM',6,10,'',''],
 ['Jorge Martín','Aprilia Racing',7,9,'',''],['Fabio Di Giannantonio','VR46 Ducati',8,8,'',''],
 ['Johann Zarco','LCR Honda',9,7,'',''],['Iker Lecuona','Gresini Ducati',10,6,'',''],
 ['Franco Morbidelli','VR46 Ducati',11,5,'',''],['Fermín Aldeguer','Gresini Ducati',12,4,'','20.576'],
 ['Maverick Viñales','KTM Tech3',13,3,'',''],['Jake Dixon','Honda HRC',14,2,'',''],
 ['Diogo Moreira','LCR Honda',null,0,'','DNF'],['Brad Binder','Red Bull KTM',null,0,'','DNF'],
 ['Francesco Bagnaia','Ducati Lenovo',null,0,'','DNS'],['Luca Marini','Honda HRC',null,0,'','DNS']
].map(([name,team,position,points,time,gap])=>({name,number:0,position,points,team,time,gap,classified:!!position}));
const motoRound = {round:20,slug:'qat',sprint:{entries:motoSprintEntries,source_url:'https://www.motogp.com/en/news/2026/11/05/matchpoint-am-sonntag-marquez-gewinnt-dramatischen-sprint-in-katar/1184253'},race:{entries:motoRaceEntries,source_url:'https://stats.motogp.com/en/gp-results',verified_fastest_lap:{who:'Marc Márquez',t:'1:52.558',extra:'lap 13; official best race lap'}}};

const input = JSON.parse(JSON.stringify(prior));
input.model_version = 'weekend-bootstrap-1.0.5';
input.checked_at = '2026-11-09';
input.f1.standings = f1Standings;
input.f1.constructors = f1Constructors;
input.f1.rounds.push(f1Round);
input.f1.remaining_calendar = [{rd:21,gp:'Las Vegas GP',circuit:'Las Vegas Strip Circuit',date:'19–21 Nov'},{rd:22,gp:'Qatar GP',circuit:'Lusail',date:'27–29 Nov'},{rd:23,gp:'Abu Dhabi GP',circuit:'Yas Marina',date:'4–6 Dec',note:'Season finale'}];
input.moto.standings = motoStandings;
input.moto.rounds.push(motoRound);
input.moto.remaining_calendar = [{rd:21,gp:'Portuguese GP',circuit:'Portimão',date:'20–22 Nov'},{rd:22,gp:'Valencia GP',circuit:'Ricardo Tormo',date:'27–29 Nov',note:'Season finale'}];
input.entry_overrides = {};
input.entry_assumptions = 'Remaining rounds use the regular grid. Bagnaia’s Qatar foot fractures, Marini’s fatigue withdrawal and the Qatar substitute entries are recorded, but no later-round absence was confirmed at the 9 November check.';
input.standings_sources = {f1_drivers:'https://www.formula1.com/en/results/2026/drivers',f1_teams:'https://www.formula1.com/en/results/2026/team',moto_riders:'https://stats.motogp.com/en/world-standing'};
input.calendar_sources = {f1:'https://www.formula1.com/en/racing/2026',moto:'https://www.motogp.com/en/calendar'};
input.viewing_times = {sources:{f1:'https://www.formula1.com/en/latest/article/formula-1-heineken-las-vegas-grand-prix-2026.1qmWzcBwKK5hkTbYbhVC22',moto:'https://www.motogp.com/en/calendar/2026/event/portugal/c7f7626b-807f-4a6f-813e-7ad2c68302a3'},sessions:{
 f1:[['Practice 1','2026-11-20T10:30:00+10:00','Fri 20 Nov · 10:30 AM'],['Practice 2','2026-11-20T14:00:00+10:00','Fri 20 Nov · 2:00 PM'],['Practice 3','2026-11-21T10:30:00+10:00','Sat 21 Nov · 10:30 AM'],['Qualifying','2026-11-21T14:00:00+10:00','Sat 21 Nov · 2:00 PM'],['Grand Prix','2026-11-22T14:00:00+10:00','Sun 22 Nov · 2:00 PM']].map(([session,brisbane,display])=>({session,brisbane,display})),
 moto:[['Practice 1','2026-11-20T20:45:00+10:00','Fri 20 Nov · 8:45 PM'],['Practice','2026-11-21T01:00:00+10:00','Sat 21 Nov · 1:00 AM'],['Practice 2','2026-11-21T20:10:00+10:00','Sat 21 Nov · 8:10 PM'],['Qualifying 1','2026-11-21T20:50:00+10:00','Sat 21 Nov · 8:50 PM'],['Qualifying 2','2026-11-21T21:15:00+10:00','Sat 21 Nov · 9:15 PM'],['Sprint','2026-11-22T01:00:00+10:00','Sun 22 Nov · 1:00 AM'],['Warm-up','2026-11-22T19:40:00+10:00','Sun 22 Nov · 7:40 PM'],['Grand Prix','2026-11-23T00:00:00+10:00','Mon 23 Nov · 12:00 AM']].map(([session,brisbane,display])=>({session,brisbane,display}))
}};
fs.writeFileSync(path.join(__dirname,'inputs-2026-11-09.json'),JSON.stringify(input,null,2)+'\n');
const standingsReference = {
  verified_date_brisbane:'2026-11-09',data_as_of:'2026-11-09',
  note:'Official ranking snapshot, including equal-point order. Formula 1 totals are reconciled from the last official table plus the final post-penalty São Paulo classification because the summary table initially lagged the Leclerc/Lawson swap.',
  tables:{
    f1:{source:'https://www.fia.com/system/files/decision-document/2026_sao_paulo_grand_prix_-_championship_points.pdf',rows:f1Standings.map(([name,,points])=>[name,points])},
    constructors:{source:'https://www.fia.com/system/files/decision-document/2026_sao_paulo_grand_prix_-_championship_points.pdf',rows:f1Constructors},
    moto:{source:'https://stats.motogp.com/en/world-standing',rows:motoStandings.map(([name,,points])=>[name,points])}
  }
};
fs.writeFileSync(path.join(root,'validation','standings-reference.json'),JSON.stringify(standingsReference,null,2)+'\n');

function extract(name, page) {
  const m = page.match(new RegExp(`const ${name} = (.*);`));
  if (!m) throw new Error(`missing ${name}`);
  return JSON.parse(m[1]);
}
function replaceConst(page,name,value){
  return page.replace(new RegExp(`const ${name} = .*;`),`const ${name} = ${JSON.stringify(value)};`);
}

const output = JSON.parse(fs.readFileSync(path.join(__dirname,'outputs-2026-11-09.json'),'utf8'));
let page = fs.readFileSync(pagePath,'utf8');
const f1Races = extract('F1_RACES',page);
const motoRaces = extract('MOTO_RACES',page);
f1Races.push({rd:20,gp:'São Paulo GP',circuit:'Autódromo José Carlos Pace, Interlagos',date:'8 Nov',season:2026,event_id:'f1:2026:brazil:r20',sources:[['Final classification','https://www.formula1.com/en/results/2026/races/1299/brazil/race-result'],['FIA final classification','https://www.fia.com/system/files/decision-document/2026_sao_paulo_grand_prix_-_final_race_classification.pdf'],['Fastest laps','https://www.formula1.com/en/results/2026/races/1299/brazil/fastest-laps'],['Post-race penalty','https://www.formula1.com/en/latest/article/leclerc-hit-with-post-race-penalty-for-sao-paulo-collision-with-lawson.scK3PbeAxR70InNjz1ph3'],['Official race report','https://www.formula1.com/en/latest/article/norris-beats-verstappen-in-wet-sao-paulo-gp-thriller-as-mercedes-win-constructors-championship.7JN7MXLZf5lk5l0C3gfKGI']],race:{podium:[['Lando Norris','McLaren','1:35:23.504'],['Max Verstappen','Red Bull Racing','+14.602s'],['Isack Hadjar','Red Bull Racing','+24.485s']],classification:f1RaceEntries,fl:{who:'Kimi Antonelli',t:'1:12.689',extra:'lap 55; official GP fastest lap'}},records:[{label:'Official race lap record',t:'1:10.540',who:'Valtteri Bottas',ev:'2018'}],note:'Final classification includes five-second penalties for unsafe releases and for causing a collision. The GP fastest lap is shown separately from the historical race lap record.'});
motoRaces.push({rd:20,gp:'Qatar GP',circuit:'Lusail International Circuit',date:'7–8 Nov',season:2026,event_id:'moto:2026:qatar:r20',sources:[['GP classification','https://stats.motogp.com/en/gp-results'],['Sprint report','https://www.motogp.com/en/news/2026/11/05/matchpoint-am-sonntag-marquez-gewinnt-dramatischen-sprint-in-katar/1184253'],['Official GP report','https://www.motogp.com/en/news/2026/11/08/bezzecchi-bounces-back-with-qatar-victory-as-marquez-extends-championship-lead/1184256'],['Bagnaia medical update','https://www.motogp.com/en/news/2026/11/05/bagnaia-out-of-qatar-gp-with-right-foot-fractures/1184688'],['Marini withdrawal','https://www.motogp.com/en/news/2026/11/08/luca-marini-withdraws-from-qatar-gp/1184735']],sprint:{podium:[['Marc Márquez','Ducati Lenovo','Winner'],['Fabio Di Giannantonio','VR46 Ducati','P2'],['Jorge Martín','Aprilia Racing','P3']],classification:motoSprintEntries.map(e=>({name:e.name,team:e.team,position:e.position,points:e.points,classified:true,status:e.position===1?'Winner':'Point scorer'})),fl:{who:'Not independently verified',extra:'The indexed official report did not publish a Sprint lap table.'}},race:{podium:[['Marco Bezzecchi','Aprilia Racing',"41'29.173"],['Marc Márquez','Ducati Lenovo','+3.083s'],['Raúl Fernández','Trackhouse Aprilia','+3.614s']],classification:motoRaceEntries.map(e=>({name:e.name,team:e.team,position:e.position,points:e.points,classified:e.classified,status:e.position===1?e.time:(e.position?(e.gap?`+${e.gap}s`:'Final order'):e.gap)})),fl:{who:'Marc Márquez',t:'1:52.558',extra:'lap 13; official best race lap'}},records:[{label:'Official best race lap',t:'1:52.558',who:'Marc Márquez',ev:'2026'}],note:'The GP final classification and best race lap are official. The Sprint card is limited to the nine officially reported point scorers; non-scoring order and Sprint fastest lap were not invented.'});
const f1News=[
 {tag:'confirmed',title:'São Paulo final classification published',body:'The final race order includes three post-race five-second penalties. This dashboard uses the revised official classification and standings.',src:'https://www.formula1.com/en/results/2026/races/1299/brazil/race-result',srcNote:'Official result · checked 9 November 2026'},
 {tag:'confirmed',title:'Constructors’ championship status confirmed',body:'Formula 1’s official race report confirms the constructors’ championship outcome at São Paulo; the dashboard keeps that separate from the already-decided drivers’ title.',src:'https://www.formula1.com/en/latest/article/norris-beats-verstappen-in-wet-sao-paulo-gp-thriller-as-mercedes-win-constructors-championship.7JN7MXLZf5lk5l0C3gfKGI',srcNote:'Official report · published 8 November 2026'},
 {tag:'confirmed',title:'Las Vegas timetable published',body:'The official timetable lists a conventional five-session weekend. All starts below are converted from Las Vegas local time to Australia/Brisbane AEST.',src:'https://www.formula1.com/en/latest/article/formula-1-heineken-las-vegas-grand-prix-2026.1qmWzcBwKK5hkTbYbhVC22',srcNote:'Official timetable · checked 9 November 2026'}
];
const motoNews=[
 {tag:'confirmed',title:'Qatar final results and standings published',body:'MotoGP’s official services record the Grand Prix classification, Sprint point scorers and updated championship standings. Unpublished Sprint details are omitted.',src:'https://stats.motogp.com/en/gp-results',srcNote:'Official results · checked 9 November 2026'},
 {tag:'confirmed',title:'Two Qatar non-starts medically confirmed',body:'Official MotoGP updates confirmed one rider was ruled out after foot fractures and another withdrew because of fatigue. Neither is assumed absent from Portugal without a later confirmation.',src:'https://www.motogp.com/en/news/2026/11/05/bagnaia-out-of-qatar-gp-with-right-foot-fractures/1184688',srcNote:'Official medical updates · published 7–8 November 2026'},
 {tag:'confirmed',title:'Portugal schedule published',body:'The official Portugal event page lists the next MotoGP weekend at Portimão. Session starts below are converted to Australia/Brisbane AEST.',src:'https://www.motogp.com/en/calendar/2026/event/portugal/c7f7626b-807f-4a6f-813e-7ad2c68302a3',srcNote:'Official event page · checked 9 November 2026'}
];
page = replaceConst(page,'F1_STANDINGS',f1Standings);
page = replaceConst(page,'F1_CONSTRUCTORS',f1Constructors);
page = replaceConst(page,'MOTO_STANDINGS',motoStandings);
page = replaceConst(page,'F1_RACES',f1Races);
page = replaceConst(page,'MOTO_RACES',motoRaces);
page = replaceConst(page,'F1_CALENDAR',input.f1.remaining_calendar);
page = replaceConst(page,'MOTO_CALENDAR',input.moto.remaining_calendar);
page = replaceConst(page,'F1_NEWS',f1News);
page = replaceConst(page,'MOTO_NEWS',motoNews);
page = replaceConst(page,'FORECAST',output);
page = replaceConst(page,'SESSIONS',input.viewing_times.sessions);
page = replaceConst(page,'SESSION_SOURCES',input.viewing_times.sources);
page = page.replaceAll('updated 2 November 2026 · v21','updated 9 November 2026 · v22')
 .replaceAll('Standings checked 2 November 2026','Standings checked 9 November 2026')
 .replace('round-19 <a href="https://www.formula1.com/en/results/2026/races/1298/mexico/race-result">final classification</a>. Driver and constructor totals both equal 2,135 points.','round-20 <a href="https://www.formula1.com/en/results/2026/races/1299/brazil/race-result">final classification</a>. Driver and constructor totals both equal 2,206 points.')
 .replace('and Malaysian GP result. GP and Sprint points total 3,450;','and Qatar GP result. GP and Sprint points total 3,638;')
 .replaceAll('Calendar checked against the official 2026 schedule on 2 November.','Calendar checked against the official 2026 schedule on 9 November.')
 .replace('The Malaysian timetable above is converted to Brisbane AEST.','The Portuguese timetable above is converted to Brisbane AEST.')
 .replaceAll('News checked: 2 November 2026.','News checked: 9 November 2026.')
 .replace('<strong>Checked 2 November 2026 · v21.</strong> This saved dashboard adds each series’ newly completed weekend, revised official standings, remaining calendars, Brisbane viewing times and current sourced news. Post-race changes are incorporated where verified.','<strong>Checked 9 November 2026 · v22.</strong> This saved dashboard adds each series’ newly completed weekend, revised official standings, remaining calendars, Brisbane viewing times and current sourced news. Post-race changes and confirmed non-starts are incorporated where verified.')
 .replace('This edition replaces both series photos with individually verified CC BY 2.0 Wikimedia Commons images and states the exact resizing disclosure.','This edition retains the existing individually verified CC BY 2.0 Wikimedia Commons images because two suitable replacements were not completed end-to-end before publication; the exact existing resizing disclosures remain visible.')
 .replace('<a href="index-v20-1-2026-11-02-before-maintenance.html">Previous edition · v20.1 · 29 October 2026</a>','<a href="index-v21-2026-11-09-before-maintenance.html">Previous edition · v21 · 2 November 2026</a>')
 .replace('Probabilities were recalculated on 2 November 2026','Probabilities were recalculated on 9 November 2026')
 .replaceAll('model/inputs-2026-11-02.json','model/inputs-2026-11-09.json')
 .replaceAll('model/outputs-2026-11-02.json','model/outputs-2026-11-09.json')
 .replace('Experimental model · calculated 2 November 2026.','Experimental model · calculated 9 November 2026.');
fs.writeFileSync(pagePath,page);

