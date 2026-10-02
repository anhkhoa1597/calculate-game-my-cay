const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('./engine.js');
const clean=s=>({...s,secret:{day:s.day,broth:null,status:'none'}});
const active=(s,broth)=>({...s,secret:{day:s.day,broth,status:'active'}});
function verifyResult(s,r){
 assert(r.searchPasses===(s.day>=3?2:1));
 const config=r.secret.best?active(clean(s),r.secret.best):clean(s);
 assert.deepEqual(r.stats,M.batch(config,r.prices,256,9000000));
 assert.deepEqual(r.baseline,M.batch(config,s.prices,256,9000000));
 for(const alt of r.alternatives)assert.deepEqual(alt.stats,M.batch(config,alt.prices,160,800000));
 for(const id of [...s.broths,...s.tops]){assert.equal(r.prices[id]%1000,0);assert(r.prices[id]>=1000&&r.prices[id]<=M.byId[id].base*3);if(s.safe)assert(!M.expensive(id,r.prices[id],s));}
 assert(r.stats.servedMin<=r.stats.served&&r.stats.served<=r.stats.servedMax);
 if(s.day<3){assert.equal(r.secret.mode,'unavailable');assert.equal(r.secret.best,null);assert.equal(r.stats.secretServed,0);return;}
 assert.equal(r.secret.mode,'auto');assert(s.broths.includes(r.secret.best));
 const rows=r.secret.rows.filter(x=>x.broth!==null);
 assert.equal(rows.length,s.broths.length);assert.equal(r.secret.best,rows[0].broth);
 assert(rows.every(x=>x.stats.profit<=rows[0].stats.profit));
 assert.deepEqual(r.stats,rows[0].stats);
 for(const row of r.secret.rows){const c=row.broth?active(clean(s),row.broth):clean(s);assert.deepEqual(row.stats,M.batch(c,r.prices,256,9000000));}
}
test('auto bỏ mọi secret cũ, chỉ so đúng menu; không mutate',async()=>{
 const s={...M.defaults(),level:3,chapter:2,day:3,event:'normal',broths:['tomyum','kimchi'],tops:[]};
 const before=JSON.stringify(s),expected=await M.recommendSecret(s,s.prices);
 for(const old of [null,{},'broken',...['locked','exhausted','active'].map(status=>({day:3,broth:'tomyum',status}))])assert.deepEqual(await M.recommendSecret({...s,secret:old},s.prices),expected);
 assert.equal(JSON.stringify(s),before);assert.deepEqual(new Set(expected.rows.map(x=>x.broth)),new Set(['kimchi','tomyum',null]));
 await assert.rejects(M.recommendSecret({...s,broths:[]},s.prices),/nước lèo/);
 await assert.rejects(M.recommendSecret(s,{...s.prices,tomyum:39500}),/1.000/);
});
test('hòa với none vẫn chọn nồi; hòa nhiều nồi theo catalog, uncertainty chỉ so giữa nồi',async()=>{
 const s={...M.defaults(),level:9,chapter:1,day:3,event:'normal',tops:[],broths:M.broths.map(x=>x.id).reverse(),action:.05,extra:0};
 s.prices={...s.prices,...Object.fromEntries(M.broths.map(x=>[x.id,Math.round(x.base*.8/1000)*1000]))};
 const r=await M.recommendSecret(s,s.prices);assert.equal(r.best,'kimchi');assert.equal(r.uncertain,true);
 assert(r.rows.every(x=>x.stats.profit===r.rows[0].stats.profit));
 assert.deepEqual(r.rows.filter(x=>x.broth).map(x=>x.broth),M.broths.map(x=>x.id));
 const one=await M.recommendSecret({...s,broths:['rieu']},s.prices);assert.equal(one.best,'rieu');assert.equal(one.uncertain,false);assert.equal(one.lead,null);assert.equal(one.rows[0].difference.delta,0);
});
test('cả 9 nồi riêng lẻ được đề xuất đúng; online/tại quán/hỗn hợp và quá tải',async()=>{
 for(const [i,b] of M.broths.entries()){
  const s={...M.defaults(),level:Math.max(5,b.level),day:9,chapter:i%3===0?1:i%3===1?2:3,broths:[b.id],tops:['bo','rau'],reviews:30,stars:i%2?2:5,event:i%2?'payday':'normal',upgrades:i%3===2?['app','menu','tipjar']:[],action:i%2?3:.2};
  const r=await M.recommendSecret(s,s.prices);assert.equal(r.best,b.id);assert.equal(r.uncertain,false);
  assert.deepEqual(r.rows[0].stats,M.batch(active(s,b.id),s.prices,256,9000000));
  const a=r.rows[0].stats;assert(Math.abs(a.profit-(a.sales-a.fee-a.cost+a.tips-a.fixed-a.waste))<1e-7);
  if(s.chapter===1)assert.equal(a.secretTips,0);
 }
});
test('ngày 1–2 không buff, ngày 3 chỉ một nồi: giá/lời/tô/baseline/alternatives đúng nồi cuối',async()=>{
 for(const day of [1,2,3]){
  const s={...M.defaults(),day,event:'normal',secret:{day,broth:'bo',status:'obsolete'}};
  const before=JSON.stringify(s),r=await M.optimize(s);verifyResult(s,r);assert.equal(JSON.stringify(s),before);
 }
});
test('full menu payday và bếp quá tải: final ranking, paired CI, budget hai search',async()=>{
 for(const overloaded of [false,true]){
  const s={...M.defaults(),level:9,chapter:4,day:30,stars:overloaded?2:4,reviews:30,event:overloaded?'rain':'payday',broths:M.broths.map(x=>x.id),tops:M.tops.map(x=>x.id),upgrades:['app','menu','tipjar','bowlset','luckycat','pot2','pot3'],action:overloaded?3:.45,extra:overloaded?10:1.2};
  const start=performance.now(),r=await M.optimize(s);verifyResult(s,r);
  const winner=Array.from({length:256},(_,i)=>M.simulate(active(s,r.secret.best),r.prices,9000000+i*7919));
  const candidates=r.secret.rows.filter(x=>x.broth);let uncertain=false;
  for(const row of candidates.slice(1)){
   const runs=Array.from({length:256},(_,i)=>M.simulate(active(s,row.broth),r.prices,9000000+i*7919));
   const difference=M.pairedDifference(winner,runs);uncertain ||= difference.low<=0;
   if(row===candidates[1])assert.deepEqual(r.secret.lead,difference);
  }
  assert.equal(r.secret.uncertain,uncertain);if(overloaded)assert(r.stats.timeout+r.stats.unfinished>0);
  console.log(JSON.stringify({case:overloaded?'overload':'full-payday',seconds:(performance.now()-start)/1000,searchPasses:r.searchPasses,tested:r.tested,seedBroth:r.searchSeedBroth,finalBroth:r.secret.best,served:r.stats.served,min:r.stats.servedMin,max:r.stats.servedMax}));
 }
});

test('nồi cuối khác nồi hạt giống: tất cả số liệu dùng tomyum cuối, không dùng kimchi search',async()=>{
 const s={...M.defaults(),day:9,level:3,chapter:2,broths:['kimchi','tomyum'],tops:['bo','rau'],stars:5,reviews:30,action:.45,event:'normal'};
 const r=await M.optimize(s);assert.equal(r.searchSeedBroth,'kimchi');assert.equal(r.secret.best,'tomyum');verifyResult(s,r);
 assert.notDeepEqual(r.stats,M.batch(active(s,'kimchi'),r.prices,256,9000000));
});
