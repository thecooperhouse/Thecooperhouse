// Corrective edition: run `node motorsport/model/correct_2026_11_17.cjs prepare`,
// then the documented Python simulation, then this script with `apply`.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),pagePath=path.join(root,'index.html');
const pdf='https://resources.motogp.com/files/results/2026/QAT/MotoGP/SPR/Classification.pdf';
const timetable='https://www.motogp.com/en/news/2026/11/16/time-schedule-repsol-grand-prix-of-portugal/1185224';
const entrySource='https://www.motogp.com/en/news/2026/11/16/lecuona-to-stand-in-for-injured-bagnaia-in-portugal/1185490';
// Facts transcribed from both pages of the official 7 November timing sheet.
const rows=[
 ['Marc Márquez',93,'Ducati Lenovo',"18'46.450",''],
 ['Fabio Di Giannantonio',49,'VR46 Ducati',"18'47.312",'0.862'],
 ['Jorge Martín',89,'Aprilia Racing',"18'47.969",'1.519'],
 ['Raúl Fernández',25,'Trackhouse Aprilia',"18'49.150",'2.700'],
 ['Johann Zarco',5,'LCR Honda',"18'50.170",'3.720'],
 ['Pedro Acosta',37,'Red Bull KTM',"18'51.114",'4.664'],
 ['Ai Ogura',79,'Trackhouse Aprilia',"18'51.308",'4.858'],
 ['Enea Bastianini',23,'KTM Tech3',"18'52.032",'5.582'],
 ['Iker Lecuona',27,'Gresini Ducati',"18'54.532",'8.082'],
 ['Diogo Moreira',11,'LCR Honda',"18'55.670",'9.220'],
 ['Fermín Aldeguer',54,'Gresini Ducati',"18'55.879",'9.429'],
 ['Brad Binder',33,'Red Bull KTM',"18'55.933",'9.483'],
 ['Luca Marini',10,'Honda HRC',"18'59.177",'12.727'],
 ['Franco Morbidelli',21,'VR46 Ducati',"18'59.324",'12.874'],
 ['Maverick Viñales',12,'KTM Tech3',"18'59.933",'13.483'],
 ['Jake Dixon',96,'Honda HRC',"19'05.823",'19.373']
];
const entries=rows.map(([name,number,team,time,gap],i)=>({name,number,team,time,gap,position:i+1,points:[12,9,7,6,5,4,3,2,1][i]||0,classified:true,laps:10}));
entries.push({name:'Marco Bezzecchi',number:72,team:'Aprilia Racing',time:"5'38.143",gap:'7 laps',position:null,points:0,classified:false,status:'DNF',laps:3},
 {name:'Francesco Bagnaia',number:63,team:'Ducati Lenovo',time:'',gap:'DNS',position:null,points:0,classified:false,status:'DNS',laps:0});
const fl={who:'Marc Márquez',t:'1:52.218',extra:'lap 7 of the restarted 10-lap Sprint; not the Grand Prix race-lap record'};
const archive='index-v23-2026-11-17-before-qatar-correction.html';
const inputPath=path.join(__dirname,'inputs-2026-11-17.json');
const setConst=(page,name,value)=>{const re=new RegExp(`const ${name} = .*;`);assert(re.test(page));return page.replace(re,`const ${name} = ${JSON.stringify(value)};`)};
const getConst=(page,name)=>JSON.parse(page.match(new RegExp(`const ${name} = (.*);`))[1]);
if(process.argv[2]==='prepare'){
 const prior=JSON.parse(fs.readFileSync(path.join(__dirname,'inputs-2026-11-16.json'),'utf8'));
 prior.checked_at='2026-11-17';prior.model_version='weekend-bootstrap-1.0.6';
 prior.check_scope='Qatar restarted Sprint classification, fastest lap and penalties; Portugal entry announcement and revised session times. Other facts retained from 16 November, not claimed freshly reverified.';
 const sprint=prior.moto.rounds.find(r=>r.slug==='qat').sprint;
 Object.assign(sprint,{entries,source_url:pdf,source_sha256:'5058e91ecd14404f8f866670d155f29ef7cc368c9598da2631bcc44118828fcc',source_checked_at:'2026-11-17',classification_complete:true,laps:10,verified_fastest_lap:fl,
  notes:'Final restarted Sprint, not the abandoned first start. Aldeguer completed both long-lap penalties and finished 11th; Bezzecchi was unclassified after 3 laps; Bagnaia did not start the restart. Official report and independent classification corroborate order; no later classification change found.'});
 prior.entry_overrides={moto:{'21':{'Francesco Bagnaia':'Iker Lecuona'}}};
 prior.entry_assumptions='Portugal: confirmed Bagnaia absence and Lecuona replacement (MotoGP/Ducati, 16 November). The existing override sets Bagnaia scores to zero without promoting other sampled riders: the replacement occupies the sampled seat position, a regular-seat performance proxy, not a rider-specific Lecuona forecast. Lecuona is mathematically eliminated and is not individually simulated. Valencia assumes the regular grid; Bagnaia return is conditional on fitness. Other entry assumptions remain as on 16 November.';
 prior.entry_sources=[entrySource];
 prior.viewing_times.sources.moto=timetable;
 Object.assign(prior.viewing_times.sessions.moto.find(x=>x.session==='Warm-up'),{brisbane:'2026-11-22T19:00:00+10:00',display:'Sun 22 Nov · 7:00 PM'});
 Object.assign(prior.viewing_times.sessions.moto.find(x=>x.session==='Grand Prix'),{brisbane:'2026-11-22T23:00:00+10:00',display:'Sun 22 Nov · 11:00 PM'});
 prior.viewing_times.moto_revision_note='Direct official article fetched 17 November gives 09:00 warm-up and 13:00 race, Portugal UTC+0; older indexed article variants still show 09:40 warm-up. Revised 09:00 confirmed by Crash.net 16 November schedule-change report. Brisbane UTC+10 conversion checked.';
 fs.writeFileSync(inputPath,JSON.stringify(prior,null,2)+'\n');
 const archivePath=path.join(root,archive);assert(!fs.existsSync(archivePath),'Archive must never be overwritten');
 fs.writeFileSync(archivePath,require('child_process').execFileSync('git',['show','HEAD:motorsport/index.html'],{cwd:root,maxBuffer:2000000}));
}else if(process.argv[2]==='apply'){
 const input=JSON.parse(fs.readFileSync(inputPath,'utf8')),output=JSON.parse(fs.readFileSync(path.join(__dirname,'outputs-2026-11-17.json'),'utf8'));
 let page=fs.readFileSync(pagePath,'utf8');assert(page.includes('updated 16 November 2026 · v23 ·'));
 const races=getConst(page,'MOTO_RACES'),q=races.find(r=>r.event_id==='moto:2026:qatar:r20');
 const classification=entries.map(e=>({name:e.name,team:e.team,position:e.position,points:e.points,classified:e.classified,laps:e.laps,status:e.status||(e.position===1?e.time:'+'+e.gap+'s')}));
 q.sprint={podium:classification.slice(0,3).map(e=>[e.name,e.team,e.status]),classification,fl};
 q.sources.push(['Official Sprint classification and lap/penalty log',pdf]);q.checked_at='17 November 2026';
 q.note='Sprint: official restarted 10-lap classification (16 finishers, one DNF and one DNS). Aldeguer served both long-lap penalties and finished 11th; Bagnaia did not start the restart. No further action was taken over the Márquez–Bezzecchi contact. Sprint fastest lap and GP race-lap record are distinct. Corrected 17 November; GP data retained from the previous edition.';
 page=setConst(page,'MOTO_RACES',races);page=setConst(page,'FORECAST',output);
 page=setConst(page,'SESSIONS',input.viewing_times.sessions);page=setConst(page,'SESSION_SOURCES',input.viewing_times.sources);
 const news=getConst(page,'MOTO_NEWS');
 news[0]={tag:'confirmed',title:'Portugal Sunday timetable revised',body:'The revised official timetable lists warm-up at 09:00 and the Grand Prix at 13:00 local time (UTC+0). The Brisbane starts are Sunday 22 November at 7 pm and 11 pm respectively; earlier timetable versions are superseded.',src:timetable,srcNote:'Official timetable · published 16 November; revised text checked 17 November 2026'};
 news[1]={tag:'confirmed',title:'Portugal Ducati replacement confirmed',body:'Ducati confirmed Iker Lecuona will replace Francesco Bagnaia in Portugal. Bagnaia is targeting Valencia, subject to recovery and fitness clearance. The model now applies his confirmed Portugal absence.',src:entrySource,srcNote:'Official announcement · published 16 November 2026; checked 17 November'};
 page=setConst(page,'MOTO_NEWS',news);
 page=page.replace('updated 16 November 2026 · v23 · sources reconciled · model recalculated','updated 17 November 2026 · v23.1 · Qatar Sprint corrected · model recalculated')
  .replace('<p><strong>Checked 16 November 2026 · v23.</strong> No new championship round was held this week, so the protected São Paulo and Qatar results and official standings remain unchanged. Remaining calendars, Brisbane viewing times, current sourced news, photographs and probability calculations were refreshed. The latest Formula 1 and MotoGP weekends remain protected independently.</p>','<p><strong>Corrected 17 November 2026 · v23.1.</strong> Completed the Qatar Sprint details from the official timing sheet, corrected Portugal viewing times and entry assumptions, and reran both championship models. Other facts retain their 16 November check date. Latest-weekend spoiler protection remains unchanged.</p>')
  .replace('This edition uses two newly downloaded, individually verified CC BY 2.0 Wikimedia Commons images','This corrective edition retains the two individually verified CC BY 2.0 Wikimedia Commons images added on 16 November')
  .replace('<p><a href="index-v22-1-2026-11-16-before-maintenance.html">Previous edition · v22.1 · 9 November 2026</a> — exact pre-maintenance archive; may contain spoilers and superseded information. The v22 pre-hotfix archive and earlier archives remain available through the repository.</p>',`<p><a href="${archive}">Previous edition · v23 · 16 November 2026</a> — exact pre-correction archive; contains known Qatar Sprint errors and may contain spoilers and superseded information. Earlier archives and their assets are preserved.</p>`)
  .replaceAll('calculated 16 November 2026.','calculated 17 November 2026.').replace('recalculated on 16 November 2026','recalculated on 17 November 2026')
  .replaceAll('model/inputs-2026-11-16.json','model/inputs-2026-11-17.json').replaceAll('model/outputs-2026-11-16.json','model/outputs-2026-11-17.json')
  .replace("${latest?'Checked 16 November 2026':'Previously verified source'}","${r.checked_at?'Checked '+esc(r.checked_at):latest?'Checked 16 November 2026':'Previously verified source'}")
  .replace('Official timetable</a> · checked 16 November 2026','Official timetable</a> · checked ${key===\'moto\'?\'17\':\'16\'} November 2026')
  .replace('Confirmed next-event substitutions apply; other remaining entries assume the regular grid.','Confirmed next-event absences apply; an occupied substitute seat retains its sampled finishing position without promoting other riders. This is a seat-performance proxy, not an individual substitute forecast. Other remaining entries assume the regular grid.');
 // Change only the MotoGP news date, leaving the unreviewed F1 news date honest.
 const marker='<div class="news" id="moto-news"></div>\n  <p class="news-foot">News checked: 16 November 2026.';
 assert(page.includes(marker));page=page.replace(marker,'<div class="news" id="moto-news"></div>\n  <p class="news-foot">Portugal updates checked: 17 November 2026; other news retained from 16 November.');
 fs.writeFileSync(pagePath,page);
}else throw new Error('Use prepare or apply');
