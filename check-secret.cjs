const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('./engine.js'),UI=require('./app.js');
const secret=(s,broth,status='active')=>({...s,secret:{day:s.day,broth,status}});
const bowl=broth=>({broth,tops:[],spice:0});
const group=(bowls,online=false,vip=false)=>({bowls,index:bowls.length,online,vip});
const close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function ledger(s,r){
 assert.equal(r.sales,M.items.reduce((n,x)=>n+s.prices[x.id]*r.counts[x.id],0));
 assert.equal(r.cost,4500*r.served+M.items.reduce((n,x)=>n+x.cost*r.counts[x.id],0));
 assert.equal(r.profit,r.sales-r.fee-r.cost+r.tips-r.fixed-r.waste);
 assert.equal(r.served,r.appServed+r.dineServed);assert.equal(r.arrivals,r.admitted+r.full+r.priceLost);
 assert.equal(M.broths.reduce((n,x)=>n+r.counts[x.id],0),r.served);
 assert(r.endStars>=1&&r.endStars<=5);assert(r.secretCompleted<=r.secretServed&&r.secretServed<=r.served);
 assert(r.secretRatingGroups<=r.secretCompleted);assert(r.secretTips<=r.tips);
 for(const x of Object.values(r))if(typeof x==='number')assert(Number.isFinite(x));
}

test('gia truyền: ngày, trạng thái, menu, level và migration',()=>{
 const s={...M.defaults(),day:3};assert.equal(M.secretBroth(secret(s,'kimchi')),'kimchi');
 for(const day of [1,2,4])assert.equal(M.secretBroth({...secret(s,'kimchi'),day}),null);
 for(const status of ['none','locked','exhausted'])assert.equal(M.secretBroth({...s,secret:{day:3,broth:status==='none'?null:'kimchi',status}}),null);
 for(const x of [null,{},[],{day:NaN,status:'active',broth:'kimchi'},{day:3,status:'wrong',broth:'kimchi'},{day:3,status:'none',broth:'kimchi'},{day:3,status:'active',broth:'bo'},{day:3,status:'active',broth:'rieu'}])assert.throws(()=>M.validate({...s,secret:x}));
 assert.equal(M.secretBroth({...s,secret:{day:3,status:'active',broth:'rieu'}}),null);
 assert.deepEqual(UI.normalizeSecret({...secret(s,'kimchi'),day:4}),{day:4,broth:null,status:'none'});
 assert.deepEqual(UI.normalizeSecret({...secret(s,'kimchi'),broths:[]}),{day:3,broth:null,status:'none'});
 assert.deepEqual(UI.normalizeSecret(secret(s,'kimchi')),secret(s,'kimchi').secret);
 const legacy={...s};delete legacy.secret;M.validate(legacy);
 assert.deepEqual(UI.restore({getItem:()=>JSON.stringify(legacy)}).state.secret,{day:3,broth:null,status:'none'});
});

test('nhóm 1–3 tô: chỉ đúng nồi được tip, cộng 1 sao mỗi nhóm; kiểm tra cả 9 nồi',()=>{
 const base={...M.defaults(),day:3,level:9,chapter:4,broths:M.broths.map(b=>b.id),tops:[]};
 for(const b of M.broths)for(let n=1;n<=3;n++)for(let matches=0;matches<=n;matches++){
  const other=M.broths.find(x=>x.id!==b.id).id,bs=Array.from({length:n},(_,i)=>bowl(i<matches?b.id:other));
  for(const online of [false,true]){
   const o=M.completeGroup(secret(base,b.id),base.prices,group(bs,online),.6,'normal',()=>.5);
   assert.equal(o.rating,matches?5:4);assert.equal(o.secretRatingGroups,matches?1:0);
   assert.equal(o.secretCompleted,matches);assert.equal(o.secretTips,online?0:matches*2000);
   assert.equal(o.tips,online?0:n*2000+matches*2000);
  }
 }
});

test('không cộng cho nhóm chưa hoàn tất; rating đã 5 không cộng thêm',()=>{
 const s=secret({...M.defaults(),day:3},'kimchi'),g=group([bowl('kimchi'),bowl('kimchi')]);
 assert.equal(M.completeGroup(s,s.prices,{...g,index:1},.6,'normal',()=>{throw Error('không được rút random');}),null);
 const o=M.completeGroup(s,s.prices,g,.1,'normal',()=>.5);assert.equal(o.rating,5);assert.equal(o.secretRatingGroups,0);assert.equal(o.secretTips,4000);
});

test('thứ tự sao sau chê đắt và bù giá rẻ; không đổi ngưỡng giá hoặc forecast',()=>{
 const s=secret({...M.defaults(),day:3,level:6,chapter:3},'kimchi'),g=group([bowl('kimchi')]);
 const costly={...s.prices,kimchi:90000};
 assert.equal(M.completeGroup(s,costly,g,.6,'normal',()=>.5).rating,4);
 const cheap={...s.prices,kimchi:29000};
 assert.equal(M.completeGroup(s,cheap,g,.9,'normal',()=>.05).rating,4);
 const none={...s,secret:{day:3,broth:null,status:'none'}};
 assert.equal(M.completeGroup(none,cheap,g,.9,'normal',()=>.05).rating,3);
 assert.equal(M.gameForecast(s,s.prices),M.gameForecast(none,s.prices));
 assert.equal(M.expensive('kimchi',61000,s),M.expensive('kimchi',61000,none));
});

test('hũ tip không nhân 2k; payday nhân đôi; 3→4 mở thưởng tô sứ/mèo',()=>{
 const s=secret({...M.defaults(),day:3,level:6,chapter:3,upgrades:['tipjar','bowlset','luckycat']},'kimchi');
 const p={...s.prices,kimchi:90000},g=group([bowl('kimchi')]);
 // Wait .6 + expensive gives 3, secret gives 4. Base 2k -> jar 3k + bowl 3k + secret 2k + cat 5k = 13k.
 let n=0;const random=()=>[.5,.1][n++];
 const o=M.completeGroup(s,p,g,.6,'normal',random);assert.equal(n,2);assert.equal(o.rating,4);assert.equal(o.tips,13000);assert.equal(o.secretTips,2000);
 n=0;const payday=M.completeGroup(s,p,g,.6,'payday',random);assert.equal(payday.tips,26000);assert.equal(payday.secretTips,4000);
 n=0;const none=M.completeGroup({...s,secret:{day:3,broth:null,status:'none'}},p,g,.6,'normal',random);assert.equal(n,1);assert.equal(none.rating,3);assert.equal(none.tips,3000);
 n=0;const online=M.completeGroup(s,p,{...g,online:true},.6,'payday',random);assert.equal(n,1);assert.equal(online.tips,0);assert.equal(online.rating,4);
});

test('reviewer ghi rating cuối ba lần, không cộng gia truyền ba sao',()=>{
 const s=secret({...M.defaults(),day:3},'kimchi'),g=group([bowl('kimchi')],false,true);
 const o=M.completeGroup(s,s.prices,g,.9,'reviewer',()=>.5);
 assert.equal(o.rating,4);assert.equal(o.reviewWeight,3);assert.equal(o.secretRatingGroups,1);
});

test('riêng 9 nước lèo, 3 kênh bán, với/không gia truyền: sổ tiền và counts',()=>{
 let runs=0;
 for(const broth of M.broths)for(const channel of ['online','dine','mixed'])for(const active of [false,true]){
  const s={...M.defaults(),level:Math.max(3,broth.level),chapter:channel==='online'?1:2,day:9,event:'normal',broths:[broth.id],tops:[],reviews:30,stars:4,upgrades:channel==='mixed'?['app']:[]};
  if(channel==='mixed')s.level=Math.max(5,s.level);
  const c=active?secret(s,broth.id):s;M.validate(c);
  for(let seed=1;seed<=12;seed++){
   const r=M.simulate(c,c.prices,seed);ledger(c,r);runs++;
   assert.equal(r.cost,(4500+broth.cost)*r.served);assert.equal(r.counts[broth.id],r.served);
   if(!active){assert.equal(r.secretServed,0);assert.equal(r.secretTips,0);}
   else assert.equal(r.secretServed,r.served);
   if(channel==='online'){assert.equal(r.tips,0);assert.equal(r.secretTips,0);assert.equal(r.fee,r.sales*.2);}
   if(channel==='dine'){assert.equal(r.fee,0);assert.equal(r.secretTips,2000*r.secretCompleted);}
  }
 }
 assert.equal(runs,648);
});

test('menu trộn: topping/menu màu/sao/giá/sức bếp/kênh/sự kiện; min–max và không thưởng ngoài match',()=>{
 let sawPartial=false,sawOverload=false;
 for(const [level,chapter] of [[3,1],[3,2],[5,3],[8,4],[10,5]])for(const variant of [0,1,2,3]){
  const ids=M.broths.filter(x=>x.level<=level).map(x=>x.id),allTops=M.tops.filter(x=>x.level<=level).map(x=>x.id);
  const upgrades=variant===0?[]:M.upgrades.filter(x=>x.level<=level&&!['tiktok','kol'].includes(x.id)).map(x=>x.id);
  const s=secret({...M.defaults(),level,chapter,day:30,event:['normal','payday','reviewer','rain'][variant],broths:ids,tops:variant===0?[]:variant===1?allTops.slice(0,1):allTops,upgrades,stars:variant===2?2:5,reviews:30,action:variant===3?4:.2,extra:variant===3?10:0},ids.at(-1));
  if(variant===2)for(const id of ids)s.prices[id]=M.byId[id].base*2;
  M.validate(s);const stats=M.batch(s,s.prices,16,100);
  for(let i=0;i<16;i++){
   const r=M.simulate(s,s.prices,100+i*7919);ledger(s,r);assert.equal(r.secretServed,r.counts[s.secret.broth]);
   assert(r.served>=stats.servedMin&&r.served<=stats.servedMax);
   if(r.secretServed>r.secretCompleted)sawPartial=true;if(r.timeout+r.unfinished>0)sawOverload=true;
  }
  assert(stats.servedMin<=stats.served&&stats.served<=stats.servedMax);assert(stats.n===16);
 }
 assert(sawPartial,'phải có tô match giao dở nhóm');assert(sawOverload);
});

test('gia truyền giúp sao qua đánh giá mới, không tự sửa sao hoặc dự đoán đầu ngày',()=>{
 const s={...M.defaults(),day:3,stars:2,reviews:30,event:'normal'},a=secret(s,'kimchi');
 const before=JSON.stringify(a),r=M.batch(a,a.prices,32,44),none=M.batch(s,s.prices,32,44);
 assert(r.endStars>none.endStars);assert.equal(r.traffic,none.traffic);assert.equal(r.gameForecast,none.gameForecast);
 assert.equal(JSON.stringify(a),before);
});

test('chênh lệch cặp seed: SE/CI dựa trên delta, n=1 và mẫu sai',()=>{
 const a=[{profit:101},{profit:201},{profit:301}],b=[{profit:100},{profit:200},{profit:300}];
 assert.deepEqual(M.pairedDifference(a,b),{delta:1,se:0,low:1,high:1});
 assert.deepEqual(M.pairedDifference([{profit:5}],[{profit:8}]),{delta:-3,se:0,low:-3,high:-3});
 const spread=M.pairedDifference([{profit:0},{profit:2}],[{profit:0},{profit:0}]);assert.equal(spread.delta,1);assert.equal(spread.se,1);close(spread.low,-.96);close(spread.high,2.96);
 assert.throws(()=>M.pairedDifference([],[]));assert.throws(()=>M.pairedDifference(a,b.slice(1)));
});

test('so nồi cùng giá/cùng 256 seed; 9 nồi + none, ranking đúng lời, không mutate',async()=>{
 const s={...M.defaults(),level:9,chapter:4,day:10,event:'normal',broths:M.broths.map(x=>x.id),tops:[],action:.2,extra:0};
 const before=JSON.stringify(s),progress=[],c=await M.compareSecret(s,s.prices,t=>progress.push(t));
 assert.equal(c.rows.length,10);assert.equal(progress.length,9);assert.equal(c.mode,'none');assert.equal(JSON.stringify(s),before);
 for(let i=0;i<c.rows.length;i++){
  const row=c.rows[i],config=row.broth?secret(s,row.broth):{...s,secret:{day:s.day,broth:null,status:'none'}};
  assert.deepEqual(row.stats,M.batch(config,s.prices,256,9000000));
  close(row.difference.delta,row.stats.profit-c.rows.find(x=>x.broth===null).stats.profit);
  if(i)assert(c.rows[i-1].stats.profit>=row.stats.profit);
 }
 assert.equal(c.best,c.rows[0].broth);assert.equal(typeof c.uncertain,'boolean');
});

test('ngày 1–2/hết lượt không đề xuất; khóa/active chỉ so nồi đã chọn, không đổi nồi',async()=>{
 const s={...M.defaults(),day:3,level:3,chapter:2,broths:['kimchi','tomyum'],tops:[],event:'normal'};
 for(const day of [1,2])assert.deepEqual((await M.compareSecret({...s,day},s.prices)).rows,[]);
 assert.equal((await M.compareSecret(secret(s,'tomyum','exhausted'),s.prices)).mode,'exhausted');
 for(const status of ['locked','active']){
  const c=await M.compareSecret(secret(s,'tomyum',status),s.prices);assert.equal(c.mode,status);assert.deepEqual(c.rows.map(x=>x.broth).sort(),[null,'tomyum'].sort());
 }
 const single={...s,chapter:1,broths:['kimchi'],action:.05,extra:0,prices:{...s.prices,kimchi:29000}};
 const c=await M.compareSecret(single,single.prices);assert.equal(c.rows.length,2);
 assert(c.uncertain,'không cần tip/sao mới thì hai phương án phải không phân biệt');
});

// Frozen outputs from the engine before this feature, including RNG and money.
const golden=[{"config":{"level":1,"chapter":1,"day":1,"stars":4,"reviews":0,"action":0.45,"extra":1.2,"decor":0,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"auto","broths":["kimchi"],"tops":["bo","xucxich"],"upgrades":[],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":35000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":15000,"xucxich":8000,"rau":5000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":771000,"cost":271500,"fee":154200,"tips":0,"fixed":15000,"waste":0,"served":17,"appServed":17,"dineServed":0,"arrivals":17,"appArrivals":17,"dineArrivals":0,"admitted":17,"full":0,"priceLost":0,"timeout":0,"unfinished":0,"wait":4.494117647058828,"ratings":84,"ratingCount":17,"busy":78.09999999999984,"counts":{"kimchi":17,"tomyum":0,"tuongden":0,"phomai_s":0,"launam":0,"mala":0,"tieuxanh":0,"gala":0,"rieu":0,"bo":8,"xucxich":7,"rau":0,"kimchit":0,"trung":0,"dauhu":0,"nam":0,"bap":0,"cavien":0,"phomai":0,"trungcut":0,"banhgao":0,"haisan":0,"thanhcua":0,"bovien":0,"chaca":0,"rongbien":0,"suicao":0,"bachi":0,"gagion":0,"bachtuoc":0},"event":"normal","profit":330300,"endStars":4.9411764705882355,"rating":4.9411764705882355,"traffic":0.9135,"gameForecast":18}},{"config":{"level":1,"chapter":1,"day":2,"stars":5,"reviews":30,"action":0.45,"extra":1.2,"decor":5,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"auto","broths":["kimchi"],"tops":["bo","xucxich","rau"],"upgrades":[],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":30000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":22000,"xucxich":12000,"rau":7000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":1161000,"cost":400500,"fee":232200,"tips":0,"fixed":15000,"waste":0,"served":28,"appServed":28,"dineServed":0,"arrivals":28,"appArrivals":28,"dineArrivals":0,"admitted":28,"full":0,"priceLost":0,"timeout":0,"unfinished":0,"wait":4.482142857142857,"ratings":138,"ratingCount":28,"busy":128.299999999997,"counts":{"kimchi":28,"tomyum":0,"tuongden":0,"phomai_s":0,"launam":0,"mala":0,"tieuxanh":0,"gala":0,"rieu":0,"bo":8,"xucxich":8,"rau":7,"kimchit":0,"trung":0,"dauhu":0,"nam":0,"bap":0,"cavien":0,"phomai":0,"trungcut":0,"banhgao":0,"haisan":0,"thanhcua":0,"bovien":0,"chaca":0,"rongbien":0,"suicao":0,"bachi":0,"gagion":0,"bachtuoc":0},"event":"normal","profit":513300,"endStars":4.933333333333334,"rating":4.928571428571429,"traffic":1.8302861111111113,"gameForecast":37}},{"config":{"level":9,"chapter":4,"day":30,"stars":3,"reviews":30,"action":0.45,"extra":1.2,"decor":0,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"normal","broths":["kimchi","tomyum","tuongden","phomai_s","launam","mala","tieuxanh","gala","rieu"],"tops":["bo","xucxich","rau","kimchit","trung","dauhu","nam","bap","cavien","phomai","trungcut","banhgao","haisan","thanhcua","bovien","chaca","rongbien","suicao","bachi","gagion","bachtuoc"],"upgrades":["app","tipjar","bowlset","luckycat","menu","pot2","pot3"],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":35000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":15000,"xucxich":8000,"rau":5000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":2354000,"cost":763000,"fee":133600,"tips":277000,"fixed":73000,"waste":0,"served":42,"appServed":12,"dineServed":30,"arrivals":55,"appArrivals":16,"dineArrivals":39,"admitted":31,"full":24,"priceLost":0,"timeout":0,"unfinished":0,"wait":27.69354838709678,"ratings":149,"ratingCount":31,"busy":252.39999999998994,"counts":{"kimchi":4,"tomyum":3,"tuongden":3,"phomai_s":5,"launam":6,"mala":6,"tieuxanh":5,"gala":3,"rieu":7,"bo":5,"xucxich":3,"rau":1,"kimchit":3,"trung":4,"dauhu":4,"nam":4,"bap":4,"cavien":5,"phomai":2,"trungcut":2,"banhgao":5,"haisan":4,"thanhcua":4,"bovien":5,"chaca":3,"rongbien":2,"suicao":3,"bachi":2,"gagion":4,"bachtuoc":1},"event":"normal","profit":1661400,"endStars":4.8,"rating":4.806451612903226,"traffic":1.304498269896194,"gameForecast":26}},{"config":{"level":9,"chapter":4,"day":30,"stars":3,"reviews":30,"action":0.45,"extra":1.2,"decor":0,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"payday","broths":["kimchi","tomyum","tuongden","phomai_s","launam","mala","tieuxanh","gala","rieu"],"tops":["bo","xucxich","rau","kimchit","trung","dauhu","nam","bap","cavien","phomai","trungcut","banhgao","haisan","thanhcua","bovien","chaca","rongbien","suicao","bachi","gagion","bachtuoc"],"upgrades":["app","tipjar","bowlset","luckycat","menu","pot2","pot3"],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":35000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":15000,"xucxich":8000,"rau":5000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":2319000,"cost":764000,"fee":132200,"tips":536000,"fixed":73000,"waste":0,"served":41,"appServed":12,"dineServed":29,"arrivals":63,"appArrivals":18,"dineArrivals":45,"admitted":32,"full":31,"priceLost":0,"timeout":0,"unfinished":0,"wait":27.025000000000002,"ratings":158,"ratingCount":32,"busy":238.29999999999075,"counts":{"kimchi":4,"tomyum":3,"tuongden":4,"phomai_s":5,"launam":5,"mala":6,"tieuxanh":3,"gala":5,"rieu":6,"bo":2,"xucxich":4,"rau":5,"kimchit":4,"trung":3,"dauhu":4,"nam":1,"bap":3,"cavien":3,"phomai":2,"trungcut":3,"banhgao":4,"haisan":7,"thanhcua":4,"bovien":2,"chaca":0,"rongbien":4,"suicao":2,"bachi":5,"gagion":1,"bachtuoc":4},"event":"payday","profit":1885800,"endStars":4.933333333333334,"rating":4.9375,"traffic":1.4349480968858135,"gameForecast":29}},{"config":{"level":9,"chapter":4,"day":30,"stars":3,"reviews":30,"action":0.45,"extra":1.2,"decor":0,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"reviewer","broths":["kimchi","tomyum","tuongden","phomai_s","launam","mala","tieuxanh","gala","rieu"],"tops":["bo","xucxich","rau","kimchit","trung","dauhu","nam","bap","cavien","phomai","trungcut","banhgao","haisan","thanhcua","bovien","chaca","rongbien","suicao","bachi","gagion","bachtuoc"],"upgrades":["app","tipjar","bowlset","luckycat","menu","pot2","pot3"],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":35000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":15000,"xucxich":8000,"rau":5000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":2385000,"cost":779500,"fee":161000,"tips":233000,"fixed":73000,"waste":0,"served":42,"appServed":15,"dineServed":27,"arrivals":62,"appArrivals":18,"dineArrivals":44,"admitted":32,"full":30,"priceLost":0,"timeout":0,"unfinished":0,"wait":28.234375000000004,"ratings":155,"ratingCount":32,"busy":246.0999999999903,"counts":{"kimchi":3,"tomyum":5,"tuongden":4,"phomai_s":5,"launam":5,"mala":5,"tieuxanh":5,"gala":4,"rieu":6,"bo":3,"xucxich":5,"rau":2,"kimchit":3,"trung":3,"dauhu":3,"nam":4,"bap":3,"cavien":2,"phomai":3,"trungcut":5,"banhgao":5,"haisan":4,"thanhcua":3,"bovien":2,"chaca":1,"rongbien":6,"suicao":4,"bachi":4,"gagion":5,"bachtuoc":3},"event":"reviewer","profit":1604500,"endStars":4.833333333333333,"rating":4.84375,"traffic":1.304498269896194,"gameForecast":26}},{"config":{"level":9,"chapter":4,"day":30,"stars":3,"reviews":30,"action":3,"extra":1.2,"decor":0,"pet":false,"dirty":false,"noisy":false,"buzz":0,"event":"rain","broths":["kimchi","tomyum","tuongden","phomai_s","launam","mala","tieuxanh","gala","rieu"],"tops":["bo","xucxich","rau","kimchit","trung","dauhu","nam","bap","cavien","phomai","trungcut","banhgao","haisan","thanhcua","bovien","chaca","rongbien","suicao","bachi","gagion","bachtuoc"],"upgrades":["app","tipjar","bowlset","luckycat","menu","pot2","pot3"],"staff":[],"safe":true,"waste":0,"prices":{"kimchi":35000,"tomyum":39000,"tuongden":38000,"phomai_s":42000,"launam":38000,"mala":44000,"tieuxanh":43000,"gala":45000,"rieu":48000,"bo":15000,"xucxich":8000,"rau":5000,"kimchit":5000,"trung":6000,"dauhu":6000,"nam":6000,"bap":5000,"cavien":7000,"phomai":8000,"trungcut":7000,"banhgao":7000,"haisan":18000,"thanhcua":7000,"bovien":8000,"chaca":7000,"rongbien":5000,"suicao":9000,"bachi":13000,"gagion":11000,"bachtuoc":16000}},"seed":41,"expected":{"sales":393000,"cost":128500,"fee":21000,"tips":11000,"fixed":73000,"waste":49500,"served":7,"appServed":2,"dineServed":5,"arrivals":69,"appArrivals":31,"dineArrivals":38,"admitted":9,"full":60,"priceLost":0,"timeout":2,"unfinished":2,"wait":111.88000000000002,"ratings":21,"ratingCount":7,"busy":268.99999999999267,"counts":{"kimchi":0,"tomyum":0,"tuongden":0,"phomai_s":2,"launam":2,"mala":2,"tieuxanh":0,"gala":0,"rieu":1,"bo":1,"xucxich":0,"rau":0,"kimchit":0,"trung":1,"dauhu":2,"nam":1,"bap":0,"cavien":0,"phomai":0,"trungcut":0,"banhgao":2,"haisan":1,"thanhcua":0,"bovien":1,"chaca":0,"rongbien":1,"suicao":0,"bachi":1,"gagion":0,"bachtuoc":0},"event":"rain","profit":132000,"endStars":3,"rating":3,"traffic":1.7610726643598618,"gameForecast":35}}];
test("none giữ nguyên 6 kết quả trước cập nhật theo seed",()=>{for(const x of golden){const actual=M.simulate(x.config,x.config.prices,x.seed);for(const key of ["secretServed","secretCompleted","secretRatingGroups","secretTips"])delete actual[key];assert.deepEqual(actual,x.expected);}});

test('locked/exhausted/stale/ngày 1–2 không vô tình áp hiệu ứng vào mô phỏng',()=>{
 for(const day of [1,2,3,4]){
  const s={...M.defaults(),day,event:'normal'};
  const expected=M.simulate(s,s.prices,42);
  for(const record of [{day,broth:'kimchi',status:'locked'},{day,broth:'kimchi',status:'exhausted'},{day:day+1,broth:'kimchi',status:'active'},...(day<3?[{day,broth:'kimchi',status:'active'}]:[])])assert.deepEqual(M.simulate({...s,secret:record},s.prices,42),expected);
 }
});
test('comparator chặn giá không hợp lệ và báo progress đủ kịch bản',async()=>{
 const s={...M.defaults(),day:3};
 await assert.rejects(M.compareSecret(s,{...s.prices,kimchi:35500}),/1.000/);
});
