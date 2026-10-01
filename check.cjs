const assert=require('node:assert/strict');
const M=require('./engine.js');
const s=M.defaults();
assert(Math.abs(M.traffic(s,s.prices,0,4)-1.2*1.015*.75)<1e-10);
const low={...s.prices,kimchi:1000}, floor={...s.prices,kimchi:29000};
assert.equal(M.traffic(s,low,0,4),M.traffic(s,floor,0,4));
assert.equal(M.traffic(s,{...s.prices,bo:45000},0,4),M.traffic(s,s.prices,0,4));
assert.equal(M.expensive('bo',22500,s),false);
assert.equal(M.expensive('bo',23000,s),true);
assert.equal(M.expensive('kimchi',60000,s),false);
assert.equal(M.expensive('kimchi',61000,s),true);
const busy={...s,day:30,stars:5,level:9,chapter:4,broths:M.broths.map(x=>x.id),tops:M.tops.map(x=>x.id),upgrades:['sign','tiktok','kol','gmap','flyer','speaker','seat4','app'],action:2,extra:10};
const slow=M.batch(busy,busy.prices,40,33);
const fast=M.batch({...busy,action:.1,extra:0},busy.prices,40,33);
assert(slow.timeout>0); assert(slow.full>0); assert(fast.served>slow.served);
assert(Math.abs(slow.profit-(slow.sales-slow.fee-slow.cost+slow.tips-slow.fixed-slow.waste))<1e-7);
assert.deepEqual(M.simulate(s,s.prices,41),M.simulate(s,s.prices,41));
assert.throws(()=>M.validate({...s,broths:[]}),/nước lèo/);
console.log('PASS: thu hút, ngưỡng giá, tái lập seed, quá tải, công suất, sổ lợi nhuận, cấu hình.');

// Rules audited against 2.3.8: chapters gate channels, seats, rent and weather.
assert.deepEqual(Array.from({length:10},(_,i)=>M.maxChapter(i+1)),[1,1,2,2,3,3,3,4,4,5]);
assert.deepEqual(M.service(s),{chapter:1,seats:0,app:true,appSlots:3,rent:0,appPace:.55});
for(const [chapter,level,seats,rent] of [[1,1,0,0],[2,3,2,0],[3,5,3,40000],[4,8,3,40000],[5,10,3,40000]]){
 const c={...s,chapter,level,event:'normal'};
 M.validate(c);assert.equal(M.service(c).seats,seats);assert.equal(M.service(c).rent,rent);
 for(let seed=1;seed<=30;seed++){
  const r=M.simulate(c,c.prices,seed);
  assert.equal(r.fixed,15000+rent);assert.equal(r.served,r.appServed+r.dineServed);
  assert.equal(r.arrivals,r.appArrivals+r.dineArrivals);
  assert.equal(r.arrivals,r.admitted+r.full+r.priceLost);
  assert(r.admitted>=r.timeout+r.unfinished);assert.equal(r.counts.kimchi,r.served);
  assert.equal(r.sales,M.items.reduce((n,x)=>n+c.prices[x.id]*r.counts[x.id],0));
  assert.equal(r.cost,10500*r.served+M.tops.reduce((n,x)=>n+x.cost*r.counts[x.id],0));
  assert.equal(r.profit,r.sales-r.fee-r.cost+r.tips-r.fixed-r.waste);
  if(chapter===1){assert.equal(r.dineArrivals,0);assert.equal(r.tips,0);assert.equal(r.fee,r.sales*.2);assert(r.appServed>0);}
  else {assert.equal(r.appArrivals,0);assert.equal(r.fee,0);assert(r.dineServed>0);}
 }
 const base=M.traffic(c,c.prices,0,4,'normal');
 assert(Math.abs(M.traffic(c,c.prices,0,4,'rain')/base-(chapter===2?1.5525:1.35))<1e-10);
 assert(Math.abs(M.traffic(c,c.prices,0,4,'hot')/base-(chapter===2?.92:.8))<1e-10);
}
for(const chapter of [0,2,1.5,NaN])assert.throws(()=>M.validate({...s,chapter}));
const oldChapter={...busy,chapter:1,action:10,extra:60};M.validate(oldChapter);
assert.equal(M.service(oldChapter).seats,0);assert.equal(M.service(oldChapter).appSlots,3);
const over=M.batch(oldChapter,oldChapter.prices,40,33);
assert.equal(over.dineArrivals,0);assert(over.full>0);assert(over.timeout>0);
assert.equal(M.service({...busy,chapter:2}).seats,4);
assert.equal(M.service({...busy,chapter:2}).appSlots,2);
const appShop=M.simulate({...busy,chapter:3,action:.1,extra:0},busy.prices,41);
assert(appShop.appServed>0&&appShop.dineServed>0);assert(appShop.fee>0&&appShop.fee<appShop.sales*.2);
const noBurst=M.simulate({...s,event:'students'},s.prices,41);
assert.equal(noBurst.dineArrivals,0);
assert.deepEqual({...noBurst,event:'normal'},M.simulate({...s,event:'normal'},s.prices,41));
const dayOne={...s,prices:{...s.prices,kimchi:30000}};
const sample=Array.from({length:1000},(_,i)=>M.simulate(dayOne,dayOne.prices,7000+i*7919));
const served=sample.map(r=>r.served),mean=served.reduce((a,b)=>a+b,0)/served.length;
assert(mean>15&&mean<35);assert(served.includes(24));
assert(Math.abs(M.traffic(dayOne,dayOne.prices,0,4)-1.2*1.015*.75/(30000/35000)**2)<1e-10);
console.log('PASS: 5 chương, kênh bán, phí app, vốn từng tô, thuê, bonus thời tiết, giữ chương thấp, quá tải, không burst tại nhà.');
console.log(JSON.stringify({case:'LV1/day1/kimchi30k/default speed; excludes tutorial',n:sample.length,mean,min:Math.min(...served),max:Math.max(...served),exact24:served.filter(n=>n===24).length}));
