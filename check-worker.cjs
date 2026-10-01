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
  for (const config of [M.defaults(), {...M.defaults(), level:9, chapter:4, day:30, reviews:30, broths:M.broths.map(x=>x.id), tops:M.tops.map(x=>x.id)}]) {
    const messages = await run(config, 17);
    assert(messages.some(m => m.type === 'progress'));
    assert(messages.every(m => m.id === 17));
    const result=messages.at(-1).result;
    assert.equal(result.stats.n,256);assert.equal(result.baseline.n,256);
    assert(result.alternatives.every(x=>x.stats.n===160));
    for(const id of [...config.broths,...config.tops]){assert.equal(result.prices[id]%1000,0);assert(!M.expensive(id,result.prices[id],config));}
    assert.deepEqual(messages.at(-1), {id:17, type:'result', result:await M.optimize(config)});
  }
  const bad = await run({...M.defaults(), broths:[]}, 18);
  assert.equal(bad.at(-1).type, 'error');
  assert.match(bad.at(-1).message, /nước lèo/);
  console.log('PASS: Worker source khớp engine LV1/LV9, progress/request id và lỗi validation.');
})().catch(e => { console.error(e); process.exitCode = 1; });
