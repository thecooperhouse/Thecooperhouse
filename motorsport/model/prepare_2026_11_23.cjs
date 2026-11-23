const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const priorPath = path.join(__dirname, 'inputs-2026-11-17.json');
const outputPath = path.join(__dirname, 'inputs-2026-11-23.json');
const archivePath = path.join(root, 'index-v23-1-2026-11-23-before-maintenance.html');
const input = JSON.parse(fs.readFileSync(priorPath, 'utf8'));

const f1RaceSource = 'https://www.fia.com/system/files/decision-document/2026_las_vegas_grand_prix_-_final_race_classification.pdf';
const f1QualifyingSource = 'https://www.fia.com/system/files/decision-document/2026_las_vegas_grand_prix_-_final_qualifying_classification.pdf';
const f1PointsSource = 'https://www.fia.com/system/files/decision-document/2026_las_vegas_grand_prix_-_championship_points.pdf';
const motoRaceSource = 'https://resources.motogp.com/files/results/2026/POR/MotoGP/RAC/Classification.pdf';
const motoSprintSource = 'https://resources.motogp.com/files/results/2026/POR/MotoGP/SPR/Classification.pdf';
const motoStandingsSource = 'https://stats.motogp.com/en/world-standing/2026/MotoGP/RidersChampionship';

const f1RaceRows = [
  ['Max Verstappen','Red Bull Racing',1,true,'1:27:39.624',25,50],
  ['Lando Norris','McLaren',2,true,'+0.639s',18,50],
  ['Oscar Piastri','McLaren',3,true,'+1.529s',15,50],
  ['Kimi Antonelli','Mercedes',4,true,'+2.574s',12,50],
  ['Pierre Gasly','Alpine',5,true,'+2.927s',10,50],
  ['Franco Colapinto','Alpine',6,true,'+7.955s',8,50],
  ['Lewis Hamilton','Ferrari',7,true,'+12.795s',6,50],
  ['Carlos Sainz','Williams',8,true,'+12.938s',4,50],
  ['George Russell','Mercedes',9,true,'+13.192s',2,50],
  ['Charles Leclerc','Ferrari',10,true,'+17.554s',1,50],
  ['Nico Hülkenberg','Audi',11,true,'+22.720s',0,50],
  ['Gabriel Bortoleto','Audi',12,true,'+28.602s',0,50],
  ['Oliver Bearman','Haas F1 Team',13,true,'+28.843s',0,50],
  ['Liam Lawson','Racing Bulls',14,true,'+36.588s',0,50],
  ['Isack Hadjar','Red Bull Racing',15,true,'+46.488s',0,50],
  ['Rafael Câmara','Haas F1 Team',16,true,'+47.814s',0,50],
  ['Lance Stroll','Aston Martin',17,true,'+68.353s',0,50],
  ['Valtteri Bottas','Cadillac',18,true,'+71.673s',0,50],
  ['Fernando Alonso','Aston Martin',19,true,'DNF',0,49],
  ['Arvid Lindblad','Racing Bulls',null,false,'DNF',0,19],
  ['Sergio Pérez','Cadillac',null,false,'DNF',0,17],
  ['Alexander Albon','Williams',null,false,'DNS',0,0]
];
const f1Entries = f1RaceRows.map(([name,team,position,classified,status,points,laps]) => ({name,team,position,classified,status,points,laps}));
const f1QualifyingRows = [
  ['Kimi Antonelli','Mercedes',1],['Max Verstappen','Red Bull Racing',2],['George Russell','Mercedes',3],
  ['Lando Norris','McLaren',4],['Isack Hadjar','Red Bull Racing',5],['Arvid Lindblad','Racing Bulls',6],
  ['Oscar Piastri','McLaren',7],['Liam Lawson','Racing Bulls',8],['Pierre Gasly','Alpine',9],
  ['Franco Colapinto','Alpine',10],['Charles Leclerc','Ferrari',11],['Lewis Hamilton','Ferrari',12],
  ['Nico Hülkenberg','Audi',13],['Carlos Sainz','Williams',14],['Gabriel Bortoleto','Audi',15],
  ['Alexander Albon','Williams',16],['Rafael Câmara','Haas F1 Team',17],['Sergio Pérez','Cadillac',18],
  ['Fernando Alonso','Aston Martin',19],['Lance Stroll','Aston Martin',20],['Valtteri Bottas','Cadillac',21],
  ['Oliver Bearman','Haas F1 Team',null]
];

const motoSprintRows = [
  ['Marco Bezzecchi',72,'Aprilia Racing',1,12,"19'48.999",'',12],
  ['Raúl Fernández',25,'Trackhouse Aprilia',2,9,"19'57.377",'8.378',12],
  ['Álex Márquez',73,'Gresini Ducati',3,7,"20'00.567",'11.568',12],
  ['Pedro Acosta',37,'Red Bull KTM',4,6,"20'00.887",'11.888',12],
  ['Jorge Martín',89,'Aprilia Racing',5,5,"20'01.057",'12.058',12],
  ['Ai Ogura',79,'Trackhouse Aprilia',6,4,"20'01.216",'12.217',12],
  ['Fabio Di Giannantonio',49,'VR46 Ducati',7,3,"20'01.657",'12.658',12],
  ['Fabio Quartararo',20,'Monster Yamaha',8,2,"20'07.391",'18.392',12],
  ['Iker Lecuona',27,'Ducati Lenovo',9,1,"20'08.076",'19.077',12],
  ['Jack Miller',43,'Pramac Yamaha',10,0,"20'08.466",'19.467',12],
  ['Enea Bastianini',23,'KTM Tech3',11,0,"20'10.897",'21.898',12],
  ['Jake Dixon',96,'Honda HRC',12,0,"20'11.379",'22.380',12],
  ['Pol Espargaró',44,'KTM Tech3',13,0,"20'11.568",'22.569',12],
  ['Álex Rins',42,'Monster Yamaha',14,0,"20'15.135",'26.136',12],
  ['Luca Marini',10,'Honda HRC',15,0,"20'16.064",'27.065',12],
  ['Franco Morbidelli',21,'VR46 Ducati',16,0,"21'28.023","1'39.024",12],
  ['Marc Márquez',93,'Ducati Lenovo',null,0,"16'34.407",'2 laps',10,'DNF'],
  ['Brad Binder',33,'Red Bull KTM',null,0,"13'20.083",'4 laps',8,'DNF'],
  ['Johann Zarco',5,'LCR Honda',null,0,"11'39.959",'5 laps',7,'DNF'],
  ['Fermín Aldeguer',54,'Gresini Ducati',null,0,"12'34.737",'6 laps',6,'DNF'],
  ['Augusto Fernández',47,'Pramac Yamaha',null,0,"5'08.825",'9 laps',3,'DNF'],
  ['Diogo Moreira',11,'LCR Honda',null,0,"6'18.802",'9 laps',3,'DNF']
];
const motoRaceRows = [
  ['Marco Bezzecchi',72,'Aprilia Racing',1,25,"41'30.802",'',25],
  ['Jorge Martín',89,'Aprilia Racing',2,20,"41'34.647",'3.845',25],
  ['Raúl Fernández',25,'Trackhouse Aprilia',3,16,"41'36.513",'5.711',25],
  ['Fabio Di Giannantonio',49,'VR46 Ducati',4,13,"41'39.630",'8.828',25],
  ['Ai Ogura',79,'Trackhouse Aprilia',5,11,"41'41.107",'10.305',25],
  ['Fermín Aldeguer',54,'Gresini Ducati',6,10,"41'44.909",'14.107',25],
  ['Brad Binder',33,'Red Bull KTM',7,9,"41'48.267",'17.465',25],
  ['Marc Márquez',93,'Ducati Lenovo',8,8,"41'48.964",'18.162',25],
  ['Luca Marini',10,'Honda HRC',9,7,"41'49.401",'18.599',25],
  ['Iker Lecuona',27,'Ducati Lenovo',10,6,"41'53.077",'22.275',25],
  ['Enea Bastianini',23,'KTM Tech3',11,5,"41'54.830",'24.028',25],
  ['Fabio Quartararo',20,'Monster Yamaha',12,4,"41'55.861",'25.059',25],
  ['Jack Miller',43,'Pramac Yamaha',13,3,"41'56.548",'25.746',25],
  ['Álex Rins',42,'Monster Yamaha',14,2,"42'03.948",'33.146',25],
  ['Franco Morbidelli',21,'VR46 Ducati',15,1,"42'05.297",'34.495',25],
  ['Pol Espargaró',44,'KTM Tech3',16,0,"42'05.526",'34.724',25],
  ['Jake Dixon',96,'Honda HRC',17,0,"42'05.753",'34.951',25],
  ['Augusto Fernández',47,'Pramac Yamaha',18,0,"42'34.719","1'03.917",25],
  ['Diogo Moreira',11,'LCR Honda',null,0,"40'05.388",'1 lap',24,'NC'],
  ['Álex Márquez',73,'Gresini Ducati',null,0,"19'01.105",'14 laps',11,'DNF'],
  ['Pedro Acosta',37,'Red Bull KTM',null,0,"9'05.450",'20 laps',5,'DNF'],
  ['Johann Zarco',5,'LCR Honda',null,0,'','',0,'DNF']
];
function motoEntries(rows) {
  return rows.map(([name,number,team,position,points,time,gap,laps,status]) => ({
    name,number,team,position,points,time,gap,classified:Boolean(position),laps,...(status ? {status} : {})
  }));
}

input.checked_at = '2026-11-23';
input.model_version = 'weekend-bootstrap-1.0.7';
input.check_scope = 'Official Las Vegas F1 final race, qualifying and championship points; official Portugal MotoGP Sprint, GP and championship standings; remaining calendars, Brisbane session conversions and confirmed entry changes.';

input.f1.standings = [
  ['Kimi Antonelli','Mercedes',402],['Max Verstappen','Red Bull Racing',304],['Lewis Hamilton','Ferrari',267],
  ['George Russell','Mercedes',264],['Lando Norris','McLaren',264],['Charles Leclerc','Ferrari',250],
  ['Oscar Piastri','McLaren',167],['Isack Hadjar','Red Bull Racing',122],['Liam Lawson','Racing Bulls',89],
  ['Pierre Gasly','Alpine',52],['Arvid Lindblad','Racing Bulls',38],['Franco Colapinto','Alpine',35],
  ['Oliver Bearman','Haas F1 Team',23],['Gabriel Bortoleto','Audi',14],['Nico Hülkenberg','Audi',14],
  ['Carlos Sainz','Williams',11],['Esteban Ocon','Haas F1 Team',7],['Fernando Alonso','Aston Martin',7],
  ['Alexander Albon','Williams',5],['Yuki Tsunoda','Racing Bulls',1],['Ryo Hirakawa','Haas F1 Team',1],
  ['Lance Stroll','Aston Martin',0],['Valtteri Bottas','Cadillac',0],['Sergio Pérez','Cadillac',0],
  ['Rafael Câmara','Haas F1 Team',0]
];
input.f1.constructors = [
  ['Mercedes',666],['Ferrari',517],['Red Bull Racing',440],['McLaren',431],['Racing Bulls',114],
  ['Alpine',87],['Haas F1 Team',31],['Audi',28],['Williams',16],['Aston Martin',7],['Cadillac',0]
];
assert(!input.f1.rounds.some(r => r.round === 21));
input.f1.rounds.push({
  round:21,slug:'las-vegas',
  race:{entries:f1Entries,source_url:f1RaceSource,source_sha256:'ce0eda13e406e49f8e3ee3401addcd8bd4cb715d3c5f0503d3c70057f7491e60',source_checked_at:'2026-11-23',classification_complete:true,verified_fastest_lap:{who:'Liam Lawson',t:'1:35.591',extra:'lap 50; official GP fastest lap'},notes:'Final FIA order includes 10-second penalties for Leclerc (causing a collision) and Hadjar (driving unnecessarily slowly under Safety Car conditions). Alonso is officially classified 19th despite retiring.'},
  qualifying:{entries:f1QualifyingRows.map(([name,team,position])=>({name,team,position})),source_url:f1QualifyingSource,source_sha256:'c677dd06fbaba8bcb35d76ddd8326a55c3b727ac459431ea412a4fe7a33f1940',source_checked_at:'2026-11-23'}
});
input.f1.remaining_calendar = input.f1.remaining_calendar.filter(e => e.rd > 21);

input.moto.standings = [
  ['Marc Márquez','Ducati Lenovo',439],['Jorge Martín','Aprilia Racing',396],['Marco Bezzecchi','Aprilia Racing',394],
  ['Pedro Acosta','Red Bull KTM',315],['Ai Ogura','Trackhouse Aprilia',309],['Fabio Di Giannantonio','VR46 Ducati',298],
  ['Raúl Fernández','Trackhouse Aprilia',283],['Álex Márquez','Gresini Ducati',204],['Francesco Bagnaia','Ducati Lenovo',173],
  ['Enea Bastianini','KTM Tech3',152],['Fermín Aldeguer','Gresini Ducati',139],['Brad Binder','Red Bull KTM',127],
  ['Luca Marini','Honda HRC',124],['Fabio Quartararo','Monster Yamaha',85],['Diogo Moreira','LCR Honda',78],
  ['Franco Morbidelli','VR46 Ducati',71],['Johann Zarco','LCR Honda',63],['Jack Miller','Pramac Yamaha',34],
  ['Joan Mir','Honda HRC',33],['Álex Rins','Monster Yamaha',31],['Iker Lecuona','Ducati Lenovo',25],
  ['Toprak Razgatlıoğlu','Pramac Yamaha',18],['Maverick Viñales','KTM Tech3',17],['Augusto Fernández','Pramac Yamaha',6],
  ['Pol Espargaró','KTM Tech3',5],['Somkiat Chantra','Honda HRC (sub)',3],['Takaaki Nakagami','Honda HRC (sub)',3],
  ['Jake Dixon','Honda HRC (sub)',2],['Cal Crutchlow','LCR Honda (sub)',0],['Jonas Folger','KTM Tech3 (sub)',0],
  ['Lorenzo Savadori','Trackhouse Aprilia (wildcard / sub)',0],['Michele Pirro','Gresini Ducati (sub)',0],['Aleix Espargaró','Honda HRC (sub)',0]
];
assert(!input.moto.rounds.some(r => r.round === 21));
input.moto.rounds.push({
  round:21,slug:'por',
  sprint:{entries:motoEntries(motoSprintRows),source_url:motoSprintSource,source_sha256:'6c4242e3028c1b7cef85446fdbdebedc346f8358d89e01b393548c71b865e5a8',source_checked_at:'2026-11-23',classification_complete:true,laps:12,verified_fastest_lap:{who:'Marco Bezzecchi',t:'1:38.418',extra:'lap 3; Sprint lap, not the GP race-lap record'},notes:'Official 12-lap Sprint classification. Six riders are unclassified; the event log records technical issues, retirements and crashes. No unsupported penalties are stated.'},
  race:{entries:motoEntries(motoRaceRows),source_url:motoRaceSource,source_sha256:'4457c3967b81821713c06c7d45a0c709cc3fc7c90529f417068547bbf4f83be0',source_checked_at:'2026-11-23',classification_complete:true,laps:25,verified_fastest_lap:{who:'Marco Bezzecchi',t:'1:39.121',extra:'lap 15; GP fastest lap'},notes:'Official 25-lap classification. Moreira is unclassified one lap down; Álex Márquez, Acosta and Zarco did not finish.'}
});
input.moto.remaining_calendar = input.moto.remaining_calendar.filter(e => e.rd > 21);

input.entry_overrides = {
  f1:{'22':{'Esteban Ocon':'Rafael Câmara'},'23':{'Esteban Ocon':'Rafael Câmara'}},
  moto:{'22':{'Toprak Razgatlıoğlu':'Augusto Fernández'}}
};
input.entry_assumptions = 'Haas confirmed Rafael Câmara for Qatar and Abu Dhabi after Esteban Ocon left the team; the model forces Ocon to zero in both remaining races and does not assign individual substitute points. Yamaha confirmed Toprak Razgatlıoğlu will miss Valencia and planned Augusto Fernández as replacement; Toprak is forced to zero. Bagnaia, Mir and Viñales were targeting Valencia returns but no definitive Valencia entry list was published when checked, so the regular riders remain the explicit assumption. These entry choices cannot affect either already-clinched riders title; the F1 constructors title is also clinched.';
input.entry_sources = [
  'https://www.formula1.com/en/latest/article/haas-confirm-camara-will-drive-for-the-team-in-final-races-of-2026.2wYY9ymhyqr7rXcuK6S7bj',
  'https://www.motogp.com/en/news/2026/11/18/razgatlioglu-to-miss-the-valencia-test/1185673',
  'https://www.motogp.com/en/calendar/2026/event/valencia/6ad2859f-51c4-459e-9714-338814e7537f'
];
input.standings_sources = {f1:f1PointsSource,moto:motoStandingsSource};
input.viewing_times = {
  sources:{
    f1:'https://www.formula1.com/en/latest/article/formula-1-qatar-airways-qatar-grand-prix-2026.3XJyoYSnpJEcuZovstTdcG',
    moto:'https://www.circuitricardotormo.com/wp-content/uploads/2026/11/FanGuide_ValenciaGP_2026.pdf'
  },
  sessions:{
    f1:[
      {session:'Practice 1',brisbane:'2026-11-27T23:30:00+10:00',display:'Fri 27 Nov · 11:30 PM'},
      {session:'Practice 2',brisbane:'2026-11-28T03:00:00+10:00',display:'Sat 28 Nov · 3:00 AM'},
      {session:'Practice 3',brisbane:'2026-11-29T00:30:00+10:00',display:'Sun 29 Nov · 12:30 AM'},
      {session:'Qualifying',brisbane:'2026-11-29T04:00:00+10:00',display:'Sun 29 Nov · 4:00 AM'},
      {session:'Grand Prix',brisbane:'2026-11-30T02:00:00+10:00',display:'Mon 30 Nov · 2:00 AM'}
    ],
    moto:[
      {session:'Practice 1',brisbane:'2026-11-27T19:45:00+10:00',display:'Fri 27 Nov · 7:45 PM'},
      {session:'Practice',brisbane:'2026-11-28T00:00:00+10:00',display:'Sat 28 Nov · 12:00 AM'},
      {session:'Practice 2',brisbane:'2026-11-28T19:10:00+10:00',display:'Sat 28 Nov · 7:10 PM'},
      {session:'Qualifying 1',brisbane:'2026-11-28T19:50:00+10:00',display:'Sat 28 Nov · 7:50 PM'},
      {session:'Qualifying 2',brisbane:'2026-11-28T20:15:00+10:00',display:'Sat 28 Nov · 8:15 PM'},
      {session:'Sprint',brisbane:'2026-11-29T00:00:00+10:00',display:'Sun 29 Nov · 12:00 AM'},
      {session:'Warm-up',brisbane:'2026-11-29T18:40:00+10:00',display:'Sun 29 Nov · 6:40 PM'},
      {session:'Grand Prix',brisbane:'2026-11-29T23:00:00+10:00',display:'Sun 29 Nov · 11:00 PM'}
    ]
  },
  conversion_note:'Qatar track time is UTC+3 (Brisbane +7 hours). Valencia local time is CET, UTC+1 (Brisbane +9 hours). Day and date rollovers were checked independently.'
};

assert(!fs.existsSync(outputPath), 'Refusing to overwrite dated model input');
assert(!fs.existsSync(archivePath), 'Refusing to overwrite exact prior-page archive');
fs.copyFileSync(path.join(root, 'index.html'), archivePath);
fs.writeFileSync(outputPath, JSON.stringify(input, null, 2) + '\n');
console.log(`Wrote ${outputPath}`);
console.log(`Archived ${archivePath}`);
