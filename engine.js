/* Rules checked: aenhatrang.com/g/0b73001557557d1e26f9.js (2.3.8), 02/10/2026. Catalog unchanged from 27/09/2026. */
(function(root){
'use strict';
const data=typeof module==='object'?require('./game-data.js'):GAME_DATA;
const items=data[0].rows.filter(r=>r[3]!=null).map(r=>({id:r[0],name:r[1],cost:r[2],base:r[3],unlock:r[4],level:r[5],life:r[6]}));
const broths=items.slice(0,9),tops=items.slice(9),byId=Object.fromEntries(items.map(x=>[x.id,x]));
const upgrades=data[1].rows.map(r=>({id:r[0],name:r[1],cost:r[2],daily:r[3],traffic:r[4],level:r[5],requires:r[6],hint:r[7]}));
const staff=data[2].rows.map(r=>({id:r[0],name:r[1],daily:r[2],role:r[3],level:r[4],hint:r[7]}));
const events={normal:1,rain:1.35,hot:.8,weekend:1.25,challenge:1.15,students:1,reviewer:1,sale:1,cold:1.3,payday:1.1,festival:1.45};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const has=(s,id)=>s.upgrades.includes(id), hired=(s,id)=>s.staff.includes(id),menu=s=>has(s,'menu')?1.2:1;
const maxChapter=level=>level>=10?5:level>=8?4:level>=5?3:level>=3?2:1;
const chapter=s=>s.chapter??maxChapter(s.level);
function service(s){const ch=chapter(s);return {chapter:ch,seats:ch===1?0:has(s,'seat4')?4:ch===2?2:3,app:ch===1||has(s,'app'),appSlots:ch===1?3:2,rent:ch>=3?40000:0,appPace:ch===1?.55:1};}
function defaults(){return {level:1,chapter:1,day:1,stars:4,reviews:0,action:.45,extra:1.2,decor:0,pet:false,dirty:false,noisy:false,buzz:0,event:'auto',broths:['kimchi'],tops:['bo','xucxich'],upgrades:[],staff:[],safe:true,waste:0,prices:Object.fromEntries(items.map(x=>[x.id,x.base]))};}
function validate(s){
 for(const k of ['level','chapter','day','reviews','decor'])if(!Number.isInteger(s[k]))throw Error('Thông số phải là số nguyên: '+k);
 for(const k of ['pet','dirty','noisy','safe'])if(typeof s[k]!=='boolean')throw Error('Thông số không hợp lệ: '+k);
 for(const [k,a,b] of [['level',1,10],['day',1,9999],['stars',1,5],['reviews',0,30],['action',.05,10],['extra',0,120],['decor',0,13],['buzz',-.3,.6],['waste',0,10000000]]) if(!Number.isFinite(s[k])||s[k]<a||s[k]>b)throw Error('Thông số không hợp lệ: '+k);
 for(const [k,catalog] of [['broths',broths],['tops',tops],['upgrades',upgrades],['staff',staff]]) if(!Array.isArray(s[k])||new Set(s[k]).size!==s[k].length||s[k].some(id=>!catalog.some(x=>x.id===id)))throw Error('Danh sách không hợp lệ: '+k);
 if(s.chapter<1||s.chapter>maxChapter(s.level))throw Error('Chương không hợp lệ với cấp quán.');
 if(!s.broths.length)throw Error('Chọn ít nhất một nước lèo.');
 for(const id of [...s.broths,...s.tops])if(!Number.isFinite(s.prices[id])||s.prices[id]<1000||s.prices[id]>byId[id].base*3||s.prices[id]%1000)throw Error('Giá phải theo bước 1.000đ và trong giới hạn game: '+byId[id].name);
 if(!['auto',...Object.keys(events)].includes(s.event))throw Error('Sự kiện không hợp lệ.');
 for(const x of [...items,...upgrades,...staff])if((s.broths.includes(x.id)||s.tops.includes(x.id)||s.upgrades.includes(x.id)||s.staff.includes(x.id))&&x.level>s.level)throw Error(x.name+' cần cấp '+x.level+'.');
 if(has(s,'pot3')&&!has(s,'pot2'))throw Error('Nồi thứ ba cần nồi thứ hai.');
 return s;
}
function traffic(s,p,t,stars=s.stars,event='normal'){
 const ratio=s.broths.reduce((n,id)=>n+p[id]/byId[id].base,0)/s.broths.length/menu(s);
 const bonus=upgrades.reduce((n,x)=>n+(has(s,x.id)?x.traffic:0),0)+(has(s,'led')&&t>115.5?.25:0)+Math.min(.2,s.decor*.02)+Math.min(s.day,30)*.015;
 return (.6+.2*(stars-1))*(stars<4?.65:1)*(1+bonus)*Math.min(1,.65+s.day*.1)*clamp(1+s.buzz,.7,1.6)*(s.dirty?.75:1)*events[event]*(chapter(s)===2&&['rain','hot'].includes(event)?1.15:1)/clamp(ratio,.85,1.6)**2;
}
function expensive(id,p,s){return p>(broths.some(x=>x.id===id)?60000:byId[id].base*1.5)*menu(s);}
function patience(s){return (66+Math.min(s.level-1,8)*4)*(has(s,'fan')?1.25:1)*(has(s,'wifi')?1.12:1)*(has(s,'chair')?1.12:1)*(has(s,'tv')?1.1:1)*(s.pet?1.08:1);}
function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
function simulate(s,p,seed){
 const random=rng(seed),pick=(vals,w)=>{let r=random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<vals.length;i++){r-=w[i];if(r<0)return vals[i];}return vals.at(-1);};
 let event=s.event;
 if(event==='auto'){event=s.day>1&&[6,0].includes(s.day%7)?'weekend':s.day>2&&random()<.35?pick(['rain','rain','hot','students','reviewer','sale','cold','payday','festival',...(s.level>=3?['challenge','challenge']:[])],Array(s.level>=3?11:9).fill(1)):'normal';}
 const settings=service(s),phase=s.level<3?1:s.level<7?2:3,seats=settings.seats,pots=has(s,'pot3')?3:has(s,'pot2')?2:1,cycle=has(s,'fire')?4.2:5.2;
 const reviews=Array(Math.round(s.reviews)).fill(s.stars),recent=[],groups=[],pot=Array(pots).fill(null),counts=Object.fromEntries(items.map(x=>[x.id,0]));
 let t=0,spawn=1,on=10,basket=0,current=null,helper=1,burst=false,vipPending=false,vipDone=false;
 const fixed=15000+settings.rent+upgrades.reduce((n,x)=>n+(has(s,x.id)?x.daily:0),0)+staff.reduce((n,x)=>n+(hired(s,x.id)?x.daily:0),0);
 const r={sales:0,cost:0,fee:0,tips:0,fixed,waste:s.waste,served:0,appServed:0,dineServed:0,arrivals:0,appArrivals:0,dineArrivals:0,admitted:0,full:0,priceLost:0,timeout:0,unfinished:0,wait:0,ratings:0,ratingCount:0,busy:0,counts,event};
 const stars=()=>reviews.length?reviews.reduce((a,b)=>a+b,0)/reviews.length:4;
 const review=(v,vip=false)=>{for(let j=0;j<(vip?3:1);j++){reviews.unshift(v);if(reviews.length>30)reviews.pop();}r.ratings+=v;r.ratingCount++;};
 const weighted=ids=>pick(ids,ids.map(id=>1/(1+1.5*recent.reduce((n,b)=>n+(b.broth===id?1:0)+(b.tops.includes(id)?1:0),0))));
 const order=()=>{
  const broth=weighted(s.broths),n=Math.min(s.tops.length,phase===1?(random()<.85?1:0):phase===2?pick([0,1,2],[.15,.5,.35]):pick([0,1,2,3],[.1,.35,.35,.2])),selected=[];
  for(let j=0;j<n;j++)selected.push(weighted(s.tops.filter(id=>!selected.includes(id))));
  let spice=phase===1?pick([0,1,2,3],[.2,.3,.3,.2]):pick([0,1,2,3,4,5,6,7],[.07,.12,.17,.18,.15,.12,.1,.09]);
  if(event==='hot')spice=Math.min(spice,pick([0,1,2],[1,1,1]));
  if(event==='challenge'&&random()<.45)spice=7;
  if(event==='cold'&&random()<.6)spice=Math.max(spice,phase===1?pick([2,3],[1,1]):pick([4,5,6,7],[3,3,2,2]));
  const b={broth,tops:selected,spice};recent.unshift(b);recent.splice(6);return b;
 };
 const ids=b=>[b.broth,...b.tops],sale=b=>ids(b).reduce((n,id)=>n+p[id],0),cost=b=>4500+ids(b).reduce((n,id)=>n+byId[id].cost,0),pricey=b=>ids(b).some(id=>expensive(id,p[id],s));
 const arrival=(online=false,force=false)=>{
  r.arrivals++;if(online)r.appArrivals++;else r.dineArrivals++;
  if(groups.filter(g=>g.online===online).length>=(online?settings.appSlots:seats)){r.full++;return;}
  if(!online&&!force&&[...s.broths,...s.tops].some(id=>p[id]>2*byId[id].base*menu(s))&&random()<.8){r.priceLost++;if(random()<.1)review(random()<.5?1:2);return;}
  const n=online?1:phase===3?pick([1,2,3],[.5,.32,.18]):phase===2&&event==='weekend'&&random()<.3?2:1, bowls=Array.from({length:n},order);
  if(!force&&bowls.some(pricey)&&random()<.4){r.priceLost++;return;}
  const nt=bowls.reduce((n,b)=>n+b.tops.length,0)/n;
  let max=(online?96+Math.min(s.level-1,8)*5:patience(s)*(1+.65*(n-1)))*(1+.12*nt);
  const vip=!online&&vipPending;if(vip)vipPending=false;
  if(!online&&!vip&&s.day>=3&&random()<.13&&random()<1/3)max*=.6;
  const drain=online?1:(s.dirty?1.15:1)*(s.noisy?1.3:1)*(hired(s,'waiter')?.85:1);
  groups.push({online,bowls,index:0,arrival:t,max,deadline:t+max/drain,drain,vip});r.admitted++;
 };
 const finish=g=>{
  const waited=(t-g.arrival)*g.drain/g.max;
  let rating=5-(waited>.5?1:0)-(waited>.82?1:0)-(g.bowls.some(pricey)?1:0)-(random()<.1?1:0);
  const cheap=g.bowls.reduce((n,b)=>n+sale(b)/ids(b).reduce((a,id)=>a+byId[id].base,0),0)/g.bowls.length<.88;
  if(!g.bowls.some(pricey)&&cheap&&rating<5)rating++;
  review(clamp(rating,1,5),g.vip);r.wait+=t-g.arrival;
  if(!g.online){let tip=Math.round(Math.max(0,1-waited)*4)*1000*g.bowls.length*(event==='challenge'&&g.bowls.some(b=>b.spice===7)?2:1);if(has(s,'tipjar'))tip=Math.round(tip*1.5/1000)*1000;if(rating>=4&&has(s,'bowlset'))tip+=3000*g.bowls.length;if(rating>=4&&has(s,'luckycat')&&random()<.25)tip+=5000*g.bowls.length;if(event==='payday')tip*=2;r.tips+=tip;}
  groups.splice(groups.indexOf(g),1);
 };
 // ponytail: demand-driven noodle pipeline assumes player keeps manual pots running and collects good noodles.
 // Measured action time / overhead calibrates this upper-bound workflow; action-perfect play is not guaranteed.
 for(let tick=0;tick<2700;tick++){
  t=(tick+1)*.1;
  if(seats>0&&t<202&&(spawn-=.1)<=0){arrival();const q=t/210,h=q<.08?.8:q<.28?1.45:q<.5?.6:q<.78?1.4:.8;spawn=10/traffic(s,p,t,stars(),event)/h*(.75+random()*.5);}
  if(settings.chapter>=2&&event==='students'&&!burst&&t>94.5){burst=true;for(let j=0;j<3;j++)arrival(false,true);}
  if(event==='reviewer'&&!vipDone&&t>73.5){vipDone=true;vipPending=true;spawn=Math.min(spawn,.5);}
  if(settings.app&&t<200&&(on-=.1)<=0){arrival(true);on=22/traffic(s,p,t,stars(),event)*(event==='rain'?.5:1)*settings.appPace*(.7+random()*.6);}
  for(const g of [...groups])if(t>=g.deadline){r.timeout++;review(g.online?1:random()<.3?2:1,g.vip);groups.splice(groups.indexOf(g),1);if(current?.g===g){r.waste+=current.cost;current=null;}}
  for(let j=0;j<pot.length;j++)if(pot[j]!==null&&t>=pot[j]){basket++;pot[j]=null;}
  let demand=groups.reduce((n,g)=>n+g.bowls.length-g.index,0)-(current?.noodle?1:0),cooking=pot.filter(x=>x!==null).length;
  helper-=.1;
  for(let j=0;j<pot.length;j++)if(pot[j]===null&&basket+cooking<Math.min(3,demand)&&(!hired(s,'boil')||helper<=0)){pot[j]=t+cycle*(hired(s,'boil')?.64:.6);cooking++;helper=.8;}
  if(!current&&groups.length){const g=[...groups].sort((a,b)=>a.deadline-b.deadline)[0],b=g.bowls[g.index];const actions=3+(hired(s,'season')?0:1)+(hired(s,'topping')?0:b.tops.length)+b.spice+(hired(s,'boil')?0:1);current={g,b,remaining:s.extra+s.action*actions,noodle:false,cost:cost(b)};}
  if(current){r.busy+=.1;current.remaining-=.1;if(!current.noodle&&basket){basket--;current.noodle=true;}
   if(current.remaining<=0&&current.noodle){const {g,b}=current;r.sales+=sale(b);r.fee+=g.online?Math.round(sale(b)*.2):0;r.cost+=cost(b);for(const id of ids(b))counts[id]++;r.served++;if(g.online)r.appServed++;else r.dineServed++;g.index++;current=null;if(g.index===g.bowls.length)finish(g);}
  }
  if(t>=210&&!groups.length)break;
 }
 r.unfinished=groups.length;r.waste+=(basket+pot.filter(x=>x!==null).length)*3000+(current?.cost||0);
 r.profit=r.sales-r.fee-r.cost+r.tips-r.fixed-r.waste;r.endStars=stars();r.rating=r.ratingCount?r.ratings/r.ratingCount:0;
 r.wait=r.ratingCount?r.wait/Math.max(1,r.admitted-r.timeout-r.unfinished):0;
 r.traffic=traffic(s,p,0,s.stars,event);return r;
}
function batch(s,p,n=64,seed=7000){const runs=Array.from({length:n},(_,i)=>simulate(s,p,seed+i*7919)),a={};for(const key of Object.keys(runs[0]))if(typeof runs[0][key]==='number')a[key]=runs.reduce((v,r)=>v+r[key],0)/n;
 a.counts=Object.fromEntries(items.map(x=>[x.id,runs.reduce((v,r)=>v+r.counts[x.id],0)/n]));a.se=Math.sqrt(runs.reduce((v,r)=>v+(r.profit-a.profit)**2,0)/(n-1)/n);a.n=n;return a;}
const rounded=(id,p)=>clamp(Math.round(p/1000)*1000,1000,Math.floor(byId[id].base*3/1000)*1000);
async function optimize(s,progress=()=>{}){
 validate(s);const m=menu(s),seen=new Set(),all=[],active=[...s.broths,...s.tops];
 const add=p=>{const key=active.map(id=>p[id]).join(',');if(seen.has(key))return;seen.add(key);const stats=batch(s,p,20,1234);all.push({prices:p,stats});};
 const topCap=id=>Math.floor(byId[id].base*1.5*m/1000)*1000;
 for(const tr of (s.safe?[.85,1,1.5]:[.85,1,1.5,2,3]))for(let k=55;k<=(s.safe?180:300);k+=5){const p={...s.prices};for(const id of s.broths)p[id]=rounded(id,Math.min(byId[id].base*k/100*m,s.safe?60000*m:Infinity));for(const id of s.tops)p[id]=rounded(id,Math.min(byId[id].base*tr*m,s.safe?topCap(id):Infinity));add(p);}
 if(!s.safe||active.every(id=>!expensive(id,s.prices[id],s)))add({...s.prices});
 // ponytail: bounded grid + coordinate search, not exhaustive over every menu combination.
 // Increase search budget / exact optimizer only if calibrated simulations justify that cost.
 for(let pass=0;pass<2;pass++){
  let best=all.reduce((a,b)=>a.stats.profit>b.stats.profit?a:b);
  for(const id of active){const candidates=[best.prices[id]-1000,best.prices[id]+1000,byId[id].base*.85*m,byId[id].base*1.6*m,s.safe?(s.broths.includes(id)?60000*m:topCap(id)):byId[id].base*3];
   for(const v of candidates){const p={...best.prices,[id]:rounded(id,v)};if(s.safe&&expensive(id,p[id],s))continue;add(p);}best=all.reduce((a,b)=>a.stats.profit>b.stats.profit?a:b);
  }
  progress('Đang tìm giá: '+all.length+' bảng giá');await new Promise(r=>setTimeout(r,0));
 }
 const finalists=all.sort((a,b)=>b.stats.profit-a.stats.profit).slice(0,8);
 for(let j=0;j<finalists.length;j++){finalists[j].stats=batch(s,finalists[j].prices,160,800000);progress('Kiểm chứng phương án '+(j+1)+'/8');await new Promise(r=>setTimeout(r,0));}
 const best=finalists.sort((a,b)=>b.stats.profit-a.stats.profit)[0];
 const baseline=batch(s,s.prices,256,9000000),validated=batch(s,best.prices,256,9000000);
 return {prices:best.prices,stats:validated,baseline,alternatives:finalists.slice(0,5),tested:all.length};
}
const api={maxChapter,service,data,items,broths,tops,byId,upgrades,staff,events,defaults,validate,traffic,expensive,patience,simulate,batch,optimize};if(typeof module==='object')module.exports=api;else root.M=api;
})(typeof window!=='undefined'?window:globalThis);
