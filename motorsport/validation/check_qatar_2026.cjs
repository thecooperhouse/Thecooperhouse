const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
// Independent expected order/time/status from official Qatar SPR Classification.pdf,
// 7 November 2026, pages 1–2; verified 17 November, SHA recorded in model input.
const expected=[
 [1,'Marc Márquez',12,"18'46.450"],[2,'Fabio Di Giannantonio',9,'+0.862s'],
 [3,'Jorge Martín',7,'+1.519s'],[4,'Raúl Fernández',6,'+2.700s'],
 [5,'Johann Zarco',5,'+3.720s'],[6,'Pedro Acosta',4,'+4.664s'],
 [7,'Ai Ogura',3,'+4.858s'],[8,'Enea Bastianini',2,'+5.582s'],
 [9,'Iker Lecuona',1,'+8.082s'],[10,'Diogo Moreira',0,'+9.220s'],
 [11,'Fermín Aldeguer',0,'+9.429s'],[12,'Brad Binder',0,'+9.483s'],
 [13,'Luca Marini',0,'+12.727s'],[14,'Franco Morbidelli',0,'+12.874s'],
 [15,'Maverick Viñales',0,'+13.483s'],[16,'Jake Dixon',0,'+19.373s'],
 [null,'Marco Bezzecchi',0,'DNF'],[null,'Francesco Bagnaia',0,'DNS']
];
function check(root){
 const base=path.join(root,'motorsport'),page=fs.readFileSync(path.join(base,'index.html'),'utf8');
 const data=name=>JSON.parse(page.match(new RegExp(`const ${name} = (.*);`))[1]);
 const q=data('MOTO_RACES').find(r=>r.event_id==='moto:2026:qatar:r20');
 assert.deepEqual(q.sprint.classification.map(e=>[e.position,e.name,e.points,e.status]),expected);
 for(const e of q.sprint.classification)assert.equal(e.classified,Boolean(e.position));
 assert.deepEqual(q.sprint.podium,q.sprint.classification.slice(0,3).map(e=>[e.name,e.team,e.status]));
 assert.equal(q.sprint.fl.t,'1:52.218');assert(q.sprint.fl.extra.includes('lap 7'));
 assert.equal(q.race.fl.t,'1:52.558');assert.equal(q.records[0].t,'1:52.558');
 const inputFile=page.match(/href="(model\/inputs-[^"]+\.json)"/)[1];
 const outputFile=page.match(/href="(model\/outputs-[^"]+\.json)"/)[1];
 const inputBytes=fs.readFileSync(path.join(base,inputFile));
 const input=JSON.parse(inputBytes),s=input.moto.rounds.find(r=>r.slug==='qat').sprint;
 assert.deepEqual(s.entries.map(e=>[e.position,e.name,e.points,e.status||(e.position===1?e.time:'+'+e.gap+'s')]),expected);
 const ms=s=>{const [m,sec]=s.split("'");return +m*60000+Math.round(+sec*1000)};
 for(const e of s.entries.filter(e=>e.position>1))assert.equal(ms(e.time)-ms(s.entries[0].time),Math.round(+e.gap*1000));
 assert.equal(s.entries.reduce((a,e)=>a+e.points,0),49);
 const output=JSON.parse(fs.readFileSync(path.join(base,outputFile)));
 assert.equal(output.input_sha256,crypto.createHash('sha256').update(inputBytes).digest('hex'));
 assert.equal(output.code_sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(base,'model/championship_model.py'))).digest('hex'));
 assert.deepEqual(data('FORECAST'),output);assert(Object.values(output.checks).every(Boolean));
 for(const key of ['f1','moto'])assert(output[key].simulations>=200000);
 const old=JSON.parse(fs.readFileSync(path.join(base,'model/inputs-2026-11-16.json')));
 if(inputFile==='model/inputs-2026-11-17.json'){
  assert.deepEqual(input.f1,old.f1);assert.deepEqual(input.moto.standings,old.moto.standings);
 }
 assert.deepEqual(data('SESSIONS'),input.viewing_times.sessions);
 if(inputFile==='model/inputs-2026-11-17.json')assert.equal(data('SESSIONS').moto.at(-1).brisbane,'2026-11-22T23:00:00+10:00');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(base,'index-v23-2026-11-17-before-qatar-correction.html'))).digest('hex'),'741dd1852f015221a9766ce4b49e42e37665e9eba678ebb702c99805e18f3b5d');
 // Compile inline JS without executing browser-only APIs.
 for(const m of page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new (require('vm').Script)(m[1]);
 return expected;
}
module.exports={check,expected};
if(require.main===module){check(path.resolve(__dirname,'../..'));console.log('Qatar restart, timing arithmetic, snapshot, model and archive checks passed');}
