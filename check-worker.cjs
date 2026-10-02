const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('./engine.js');

async function run(config, id) {
  const messages = [];
  const context = vm.createContext({setTimeout, onmessage:null, postMessage: m => messages.push(JSON.parse(JSON.stringify(m)))});
  context.importScripts = (...paths) => paths.forEach(p => vm.runInContext(fs.readFileSync(p, 'utf8'), context));
  vm.runInContext(fs.readFileSync('worker.js', 'utf8'), context);
  await context.onmessage({data: {id, config}});
  return messages;
}
(async () => {
  const dayTwo={...M.defaults(),day:2,stars:5,reviews:30,decor:5,tops:['bo','xucxich','rau'],prices:{...M.defaults().prices,kimchi:30000,bo:22000,xucxich:12000,rau:7000}};
  const onlineSecret={...M.defaults(),day:3,event:'normal',secret:{day:3,broth:'kimchi',status:'active'}};
  const fullSecret={...M.defaults(),level:9,chapter:4,day:30,event:'payday',broths:M.broths.map(x=>x.id),tops:M.tops.map(x=>x.id),upgrades:['app','tipjar','bowlset','luckycat','menu','pot2','pot3'],secret:{day:30,broth:'rieu',status:'active'}};
  for (const config of [dayTwo,onlineSecret,fullSecret]) {
    const messages = await run(config, 17);
    assert(messages.some(m => m.type === 'progress'));
    assert(messages.every(m => m.id === 17));
    const result=messages.at(-1).result;
    assert.equal(result.stats.n,256);assert.equal(result.baseline.n,256);
    for(const a of [result.stats,result.baseline]){assert(Number.isInteger(a.servedMin)&&Number.isInteger(a.servedMax));assert(a.servedMin<=a.served&&a.served<=a.servedMax);assert(Number.isFinite(a.gameForecast));}

    if(config.day>=3){assert.equal(result.secret.mode,'auto');assert(config.broths.includes(result.secret.best));assert.deepEqual(result.stats,result.secret.rows.find(x=>x.broth===result.secret.best).stats);}
    assert(result.alternatives.every(x=>x.stats.profit<=result.alternatives[0].stats.profit));
    assert(result.alternatives.every(x=>x.stats.n===160));
    for(const id of [...config.broths,...config.tops]){assert.equal(result.prices[id]%1000,0);assert(!M.expensive(id,result.prices[id],config));}
    assert.deepEqual(messages.at(-1), {id:17, type:'result', result:await M.optimize(config)});
  }
  const bad = await run({...M.defaults(), broths:[]}, 18);
  assert.equal(bad.at(-1).type, 'error');
  assert.match(bad.at(-1).message, /nước lèo/);
  const badSecret=await run({...onlineSecret,secret:{day:3,broth:'bo',status:'active'}},19);assert.equal(badSecret.at(-1).type,'result');assert.equal(badSecret.at(-1).result.secret.best,'kimchi');
  console.log('PASS: Worker source khớp engine ngày2/ngày3/LV9, auto/full menu/payday, min–max, progress/id, lỗi validation và bỏ secret cũ.');
})().catch(e => { console.error(e); process.exitCode = 1; });
