const fs=require('fs');
const path=require('path');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const root=path.resolve(process.env.RACEBOARD_ROOT||path.resolve(__dirname,'../..'));
const evidence=path.resolve(process.env.RACEBOARD_EVIDENCE||'/tmp/raceboard-browser-evidence');fs.mkdirSync(evidence,{recursive:true});
async function main(){
 const browser=await chromium.launch({headless:true,executablePath:process.env.RACEBOARD_CHROMIUM||undefined});
 const context=await browser.newContext({viewport:{width:1280,height:1000}});
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='raceboard.test')return route.abort();
  const p=path.join(root,decodeURIComponent(u.pathname),u.pathname.endsWith('/')?'index.html':'');
  if(!p.startsWith(root)||!fs.existsSync(p))return route.fulfill({status:404,body:'missing'});
  const ext=path.extname(p),mime={'.html':'text/html','.jpg':'image/jpeg','.json':'application/json','.md':'text/plain','.py':'text/plain'}[ext]||'text/plain';
  return route.fulfill({status:200,contentType:mime,body:fs.readFileSync(p)});
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('https://raceboard.test/motorsport/');
 await page.waitForFunction(()=>document.querySelectorAll('[data-watch-series]').length===2);
 assert.equal(await page.locator('input[type=checkbox]').count(),2);
 const gateState=key=>page.evaluate(key=>[...document.querySelectorAll(`[data-latest="${key}"],#spoiler-${key}-standings`)].map(e=>{const v=e.querySelector(':scope > .veil');return {revealed:e.classList.contains('revealed'),hidden:v.hidden,inert:v.inert}}),key);
 for(const key of ['f1','moto'])assert((await gateState(key)).every(x=>!x.revealed&&x.hidden&&x.inert));
 assert.equal(await page.locator('#panel-f1 .race:not(.latest)').count(),14);
 assert.equal(await page.locator('#panel-moto .race:not(.latest)').count(),14);
 assert.equal(await page.locator('#panel-f1 .race:not(.latest)').first().isVisible(),true);
 await page.screenshot({path:path.join(evidence,'desktop-hidden.png')});
 await page.locator('#watched-f1').focus();await page.keyboard.press('Space');
 assert((await gateState('f1')).every(x=>x.revealed&&!x.hidden&&!x.inert));
 assert((await gateState('moto')).every(x=>!x.revealed&&x.hidden&&x.inert));
 await page.reload();assert.equal(await page.locator('#watched-f1').isChecked(),true);
 assert((await gateState('f1')).every(x=>x.revealed&&!x.hidden&&!x.inert));
 await page.locator('#f1-title-summary').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,'desktop-analysis.png')});
 await page.locator('#watched-f1').uncheck();assert((await gateState('f1')).every(x=>!x.revealed&&x.hidden&&x.inert));
 await page.reload();assert.equal(await page.locator('#watched-f1').isChecked(),false);
 // A prior event's watched state must not expose the newly completed event.
 await page.evaluate(()=>{state.f1[latestRound('f1').event_id]=true;saveState();latestRound('f1').event_id+=':next-event-fixture';applySeries('f1')});
 assert((await gateState('f1')).every(x=>!x.revealed&&x.hidden&&x.inert));
 await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.locator('#tab-f1').focus();await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('#tab-moto').getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('#panel-f1').isVisible(),false);
 assert.equal(await page.locator('#panel-moto').isVisible(),true);
 await page.locator('#watched-moto').focus();await page.keyboard.press('Space');
 assert((await gateState('moto')).every(x=>x.revealed&&!x.hidden&&!x.inert));
 assert.equal(await page.locator('#watched-f1').isChecked(),false);
 await page.reload();await page.locator('#tab-moto').click();assert.equal(await page.locator('#watched-moto').isChecked(),true);
 await page.locator('#moto-title-summary').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,'moto-analysis.png')});
 await page.locator('#watched-moto').uncheck();
 await page.locator('#tab-moto').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#tab-f1').getAttribute('aria-selected'),'true');
 await page.keyboard.press('End');assert.equal(await page.locator('#tab-moto').getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#tab-f1').getAttribute('aria-selected'),'true');
 const imageResult=await page.evaluate(async()=>{
  for(const i of document.images){i.loading='eager';await i.decode()}
  return [...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight}));
 });assert(imageResult.every(i=>i.loaded));
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.locator('#tab-f1').click();await page.evaluate(()=>scrollTo(0,0));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`F1 page overflow at ${width}`);
  await page.screenshot({path:path.join(evidence,`mobile-${width}-hidden.png`)});
  await page.locator('#watched-f1').check();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`F1 revealed overflow at ${width}`);
  await page.locator('#f1-title-summary').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,`mobile-${width}-analysis.png`)});
  await page.locator('#watched-f1').uncheck();await page.locator('#tab-moto').click();await page.locator('#watched-moto').check();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Moto revealed overflow at ${width}`);
  await page.locator('#moto-title-summary').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,`mobile-${width}-moto.png`)});
  await page.locator('#watched-moto').uncheck();
 }
 // Hidden/inert results must be absent from the accessibility tree and keyboard focus.
 await page.locator('#tab-f1').click();
 const ax=await page.locator('#f1-races .race.latest').ariaSnapshot();assert(!ax.includes('Full published classification'));assert(ax.includes('results hidden'));
 const hiddenFocusable=await page.evaluate(()=>[...document.querySelectorAll('.veil[hidden] a,.veil[hidden] summary')].some(e=>e.getClientRects().length>0));assert.equal(hiddenFocusable,false);
 // Fresh loads remain safe when storage is blocked, malformed, or from the older schema.
 for(const mode of ['blocked','malformed','legacy']){
  const p=await context.newPage();
  await p.addInitScript(mode=>{localStorage.clear();if(mode==='blocked'){Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')}}if(mode==='malformed')localStorage.setItem('raceboard:watched:v3','not json');if(mode==='legacy')localStorage.setItem('raceboard:watched:v2',JSON.stringify({f1:{'f1-2026-r15':{race:true,sprint:true}},moto:{'moto-2026-r15':{race:true,sprint:true}}}));},mode);
  await p.goto('https://raceboard.test/motorsport/');assert.equal(await p.locator('#watched-f1').isChecked(),false);assert.equal(await p.locator('#watched-moto').isChecked(),false);await p.close();
 }
 assert.deepEqual(errors,[]);
 const result={checked_at_utc:new Date().toISOString(),browser:'Chromium '+browser.version(),viewports:['1280×1000','390×844','320×844'],checks:['JavaScript execution','one checkbox per series','latest race/Sprint, standings, news and analysis hidden/inert by default','reveal/hide with keyboard and pointer','independent series choices','reload persistence','new-event protection','malformed, blocked and legacy storage','keyboard tabs and Home/End','earlier results accessible','images decode','no page overflow','hidden accessibility and focus exclusion'],images:imageResult,errors};
 fs.writeFileSync(path.join(evidence,'checks.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 await browser.close();
}
main().catch(e=>{console.error(e);process.exit(1)});
