const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Independent transcription of the official classifications checked on
// 23 November 2026. Keeping these outside the page/model input makes this a
// useful regression check rather than a comparison of a file with itself.
const f1RaceExpected = [
  [1,'Max Verstappen','Red Bull Racing',25,'1:27:39.624',50,true],
  [2,'Lando Norris','McLaren',18,'+0.639s',50,true],
  [3,'Oscar Piastri','McLaren',15,'+1.529s',50,true],
  [4,'Kimi Antonelli','Mercedes',12,'+2.574s',50,true],
  [5,'Pierre Gasly','Alpine',10,'+2.927s',50,true],
  [6,'Franco Colapinto','Alpine',8,'+7.955s',50,true],
  [7,'Lewis Hamilton','Ferrari',6,'+12.795s',50,true],
  [8,'Carlos Sainz','Williams',4,'+12.938s',50,true],
  [9,'George Russell','Mercedes',2,'+13.192s',50,true],
  [10,'Charles Leclerc','Ferrari',1,'+17.554s',50,true],
  [11,'Nico Hülkenberg','Audi',0,'+22.720s',50,true],
  [12,'Gabriel Bortoleto','Audi',0,'+28.602s',50,true],
  [13,'Oliver Bearman','Haas F1 Team',0,'+28.843s',50,true],
  [14,'Liam Lawson','Racing Bulls',0,'+36.588s',50,true],
  [15,'Isack Hadjar','Red Bull Racing',0,'+46.488s',50,true],
  [16,'Rafael Câmara','Haas F1 Team',0,'+47.814s',50,true],
  [17,'Lance Stroll','Aston Martin',0,'+68.353s',50,true],
  [18,'Valtteri Bottas','Cadillac',0,'+71.673s',50,true],
  [19,'Fernando Alonso','Aston Martin',0,'DNF',49,true],
  [null,'Arvid Lindblad','Racing Bulls',0,'DNF',19,false],
  [null,'Sergio Pérez','Cadillac',0,'DNF',17,false],
  [null,'Alexander Albon','Williams',0,'DNS',0,false]
];

const motoSprintExpected = [
  [1,'Marco Bezzecchi','Aprilia Racing',12,"19'48.999",12,true],
  [2,'Raúl Fernández','Trackhouse Aprilia',9,'+8.378',12,true],
  [3,'Álex Márquez','Gresini Ducati',7,'+11.568',12,true],
  [4,'Pedro Acosta','Red Bull KTM',6,'+11.888',12,true],
  [5,'Jorge Martín','Aprilia Racing',5,'+12.058',12,true],
  [6,'Ai Ogura','Trackhouse Aprilia',4,'+12.217',12,true],
  [7,'Fabio Di Giannantonio','VR46 Ducati',3,'+12.658',12,true],
  [8,'Fabio Quartararo','Monster Yamaha',2,'+18.392',12,true],
  [9,'Iker Lecuona','Ducati Lenovo',1,'+19.077',12,true],
  [10,'Jack Miller','Pramac Yamaha',0,'+19.467',12,true],
  [11,'Enea Bastianini','KTM Tech3',0,'+21.898',12,true],
  [12,'Jake Dixon','Honda HRC',0,'+22.380',12,true],
  [13,'Pol Espargaró','KTM Tech3',0,'+22.569',12,true],
  [14,'Álex Rins','Monster Yamaha',0,'+26.136',12,true],
  [15,'Luca Marini','Honda HRC',0,'+27.065',12,true],
  [16,'Franco Morbidelli','VR46 Ducati',0,"+1'39.024",12,true],
  [null,'Marc Márquez','Ducati Lenovo',0,'DNF',10,false],
  [null,'Brad Binder','Red Bull KTM',0,'DNF',8,false],
  [null,'Johann Zarco','LCR Honda',0,'DNF',7,false],
  [null,'Fermín Aldeguer','Gresini Ducati',0,'DNF',6,false],
  [null,'Augusto Fernández','Pramac Yamaha',0,'DNF',3,false],
  [null,'Diogo Moreira','LCR Honda',0,'DNF',3,false]
];

const motoRaceExpected = [
  [1,'Marco Bezzecchi','Aprilia Racing',25,"41'30.802",25,true],
  [2,'Jorge Martín','Aprilia Racing',20,'+3.845',25,true],
  [3,'Raúl Fernández','Trackhouse Aprilia',16,'+5.711',25,true],
  [4,'Fabio Di Giannantonio','VR46 Ducati',13,'+8.828',25,true],
  [5,'Ai Ogura','Trackhouse Aprilia',11,'+10.305',25,true],
  [6,'Fermín Aldeguer','Gresini Ducati',10,'+14.107',25,true],
  [7,'Brad Binder','Red Bull KTM',9,'+17.465',25,true],
  [8,'Marc Márquez','Ducati Lenovo',8,'+18.162',25,true],
  [9,'Luca Marini','Honda HRC',7,'+18.599',25,true],
  [10,'Iker Lecuona','Ducati Lenovo',6,'+22.275',25,true],
  [11,'Enea Bastianini','KTM Tech3',5,'+24.028',25,true],
  [12,'Fabio Quartararo','Monster Yamaha',4,'+25.059',25,true],
  [13,'Jack Miller','Pramac Yamaha',3,'+25.746',25,true],
  [14,'Álex Rins','Monster Yamaha',2,'+33.146',25,true],
  [15,'Franco Morbidelli','VR46 Ducati',1,'+34.495',25,true],
  [16,'Pol Espargaró','KTM Tech3',0,'+34.724',25,true],
  [17,'Jake Dixon','Honda HRC',0,'+34.951',25,true],
  [18,'Augusto Fernández','Pramac Yamaha',0,"+1'03.917",25,true],
  [null,'Diogo Moreira','LCR Honda',0,'NC',24,false],
  [null,'Álex Márquez','Gresini Ducati',0,'DNF',11,false],
  [null,'Pedro Acosta','Red Bull KTM',0,'DNF',5,false],
  [null,'Johann Zarco','LCR Honda',0,'DNF',0,false]
];

const expectedSessions = {
  f1:[
    ['Practice 1','2026-11-27T23:30:00+10:00','Fri 27 Nov · 11:30 PM'],
    ['Practice 2','2026-11-28T03:00:00+10:00','Sat 28 Nov · 3:00 AM'],
    ['Practice 3','2026-11-29T00:30:00+10:00','Sun 29 Nov · 12:30 AM'],
    ['Qualifying','2026-11-29T04:00:00+10:00','Sun 29 Nov · 4:00 AM'],
    ['Grand Prix','2026-11-30T02:00:00+10:00','Mon 30 Nov · 2:00 AM']
  ],
  moto:[
    ['Practice 1','2026-11-27T19:45:00+10:00','Fri 27 Nov · 7:45 PM'],
    ['Practice','2026-11-28T00:00:00+10:00','Sat 28 Nov · 12:00 AM'],
    ['Practice 2','2026-11-28T19:10:00+10:00','Sat 28 Nov · 7:10 PM'],
    ['Qualifying 1','2026-11-28T19:50:00+10:00','Sat 28 Nov · 7:50 PM'],
    ['Qualifying 2','2026-11-28T20:15:00+10:00','Sat 28 Nov · 8:15 PM'],
    ['Sprint','2026-11-29T00:00:00+10:00','Sun 29 Nov · 12:00 AM'],
    ['Warm-up','2026-11-29T18:40:00+10:00','Sun 29 Nov · 6:40 PM'],
    ['Grand Prix','2026-11-29T23:00:00+10:00','Sun 29 Nov · 11:00 PM']
  ]
};

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const pageRows = entries => entries.map(e => [e.position,e.name,e.team,e.points,e.status,e.laps,e.classified]);
const inputRows = entries => entries.map(e => [e.position,e.name,e.team,e.points,
  e.status || (e.position === 1 ? e.time : `+${e.gap}`),e.laps,e.classified]);

function check(root) {
  const base = path.join(root,'motorsport');
  const pageBytes = fs.readFileSync(path.join(base,'index.html'));
  const page = pageBytes.toString('utf8');
  const data = name => {
    const match = page.match(new RegExp(`const ${name} = (.*);`));
    assert(match, `Missing page data constant ${name}`);
    return JSON.parse(match[1]);
  };

  const f1 = data('F1_RACES').find(r => r.event_id === 'f1:2026:las-vegas:r21');
  const moto = data('MOTO_RACES').find(r => r.event_id === 'moto:2026:portugal:r21');
  assert(f1 && moto, 'Newest event IDs must be present');
  assert.deepEqual(pageRows(f1.race.classification), f1RaceExpected);
  assert.deepEqual(pageRows(moto.sprint.classification), motoSprintExpected);
  assert.deepEqual(pageRows(moto.race.classification), motoRaceExpected);
  assert.deepEqual(f1.race.podium, f1.race.classification.slice(0,3).map(e => [e.name,e.team,e.status]));
  assert.deepEqual(moto.sprint.podium, moto.sprint.classification.slice(0,3).map(e => [e.name,e.team,e.status]));
  assert.deepEqual(moto.race.podium, moto.race.classification.slice(0,3).map(e => [e.name,e.team,e.status]));
  assert.deepEqual([f1.race.fl.who,f1.race.fl.t], ['Liam Lawson','1:35.591']);
  assert.deepEqual([f1.records[0].label,f1.records[0].t,f1.records[0].ev], ['Official race lap record','1:33.365','2025']);
  assert.deepEqual([moto.sprint.fl.t,moto.race.fl.t,moto.records[0].t,moto.records[1].t], ['1:38.418','1:39.121','1:38.237','1:37.201']);
  assert(moto.records[0].label.includes('race') && moto.records[1].label.includes('qualifying'));
  assert.equal(f1.race.classification.reduce((n,e)=>n+e.points,0),101);
  assert.equal(moto.sprint.classification.reduce((n,e)=>n+e.points,0),49);
  assert.equal(moto.race.classification.reduce((n,e)=>n+e.points,0),140);

  const inputRel = page.match(/href="(model\/inputs-[^"]+\.json)"/)[1];
  const outputRel = page.match(/href="(model\/outputs-[^"]+\.json)"/)[1];
  assert.equal(inputRel,'model/inputs-2026-11-23.json');
  assert.equal(outputRel,'model/outputs-2026-11-23.json');
  const inputBytes = fs.readFileSync(path.join(base,inputRel));
  const input = JSON.parse(inputBytes);
  const output = JSON.parse(fs.readFileSync(path.join(base,outputRel)));
  assert.deepEqual(inputRows(input.f1.rounds.find(r=>r.round===21).race.entries),f1RaceExpected);
  assert.deepEqual(inputRows(input.moto.rounds.find(r=>r.round===21).sprint.entries),motoSprintExpected);
  assert.deepEqual(inputRows(input.moto.rounds.find(r=>r.round===21).race.entries),motoRaceExpected);
  assert.equal(output.model_version,'weekend-bootstrap-1.0.7');
  assert.equal(output.input_sha256,sha256(inputBytes));
  assert.equal(output.code_sha256,sha256(fs.readFileSync(path.join(base,'model/championship_model.py'))));
  assert.equal(output.f1.simulations,200000);
  assert.equal(output.moto.simulations,200000);
  assert.equal(output.f1.seed,20261123);
  assert.equal(output.moto.seed,20261124);
  assert.equal(output.f1.gps_remaining,2);
  assert.equal(output.f1.sprints_remaining,0);
  assert.equal(output.moto.gps_remaining,1);
  assert.equal(output.moto.sprints_remaining,1);
  assert.equal(output.f1.maximum_remaining_points,50);
  assert.equal(output.moto.maximum_remaining_points,37);
  assert(Object.values(output.checks).every(Boolean),'All model invariants must pass');
  assert.deepEqual(data('FORECAST'),output,'Embedded forecast must exactly match saved output');

  const f1Standings = data('F1_STANDINGS');
  const constructors = data('F1_CONSTRUCTORS');
  const motoStandings = data('MOTO_STANDINGS');
  assert.equal(f1Standings.reduce((n,r)=>n+r[2],0),2337);
  assert.equal(constructors.reduce((n,r)=>n+r[1],0),2337);
  assert.equal(motoStandings.reduce((n,r)=>n+r[2],0),3827);
  assert.deepEqual(f1Standings,input.f1.standings);
  assert.deepEqual(constructors,input.f1.constructors);
  assert.deepEqual(motoStandings,input.moto.standings);
  const prior = JSON.parse(fs.readFileSync(path.join(base,'model/inputs-2026-11-17.json')));
  assert.equal(2337-prior.f1.standings.reduce((n,r)=>n+r[2],0),101);
  assert.equal(3827-prior.moto.standings.reduce((n,r)=>n+r[2],0),189);

  assert.deepEqual(data('F1_CALENDAR').map(e=>e.rd),[22,23]);
  assert.deepEqual(data('MOTO_CALENDAR').map(e=>e.rd),[22]);
  assert.deepEqual(data('SESSIONS'),input.viewing_times.sessions);
  assert.deepEqual(Object.fromEntries(Object.entries(data('SESSIONS')).map(([k,v])=>[k,v.map(s=>[s.session,s.brisbane,s.display])])),expectedSessions);
  assert.equal(data('SESSIONS').f1.at(-1).display,'Mon 30 Nov · 2:00 AM');
  assert.equal(data('SESSIONS').moto.at(-1).display,'Sun 29 Nov · 11:00 PM');

  const archive = fs.readFileSync(path.join(base,'index-v23-1-2026-11-23-before-maintenance.html'));
  assert.equal(sha256(archive),'f335c43ab3862adfbccedc6ccd4805b4da1c5b23f676f21515e8c253d10a65a9');
  assert.equal(sha256(fs.readFileSync(path.join(base,'photos/zhou-singapore-2024-20261123.jpg'))),'005be3293d16266c3d8e80f2d27e36611d7ba82dec757b4f7a6223f30a1e94a1');
  assert.equal(sha256(fs.readFileSync(path.join(base,'photos/dovizioso-fernandez-espargaro-catalunya-2022-20261123.jpg'))),'ff9c3047d483de2b18b9d88c857c122380cf02e7c4a7cd9ba6e45dc346925c39');
  assert(page.includes('Creative Commons Attribution 4.0 International (CC BY 4.0)'));
  assert(page.includes('Creative Commons Attribution 2.0 Generic (CC BY 2.0)'));
  assert(page.includes('index-v23-1-2026-11-23-before-maintenance.html'));
  assert(page.includes('updated 23 November 2026 · v24'));
  for(const match of page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  return {f1RaceExpected,motoSprintExpected,motoRaceExpected};
}

module.exports = {check,f1RaceExpected,motoSprintExpected,motoRaceExpected};
if(require.main===module){
  check(path.resolve(__dirname,'../..'));
  console.log('23 November classifications, points, model, times, photos and archive checks passed');
}
