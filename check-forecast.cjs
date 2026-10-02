const assert=require('node:assert/strict');
const {test}=require('node:test');
const M=require('./engine.js');
const s={...M.defaults(),day:2,stars:5,reviews:30,decor:5,tops:['bo','xucxich','rau'],prices:{...M.defaults().prices,kimchi:30000,bo:22000,xucxich:12000,rau:7000}};

test('Ngày 2: dự đoán game là 37, không đồng nhất với khoảng 28 tô app giao được',()=>{
 assert.equal(M.gameForecast(s,s.prices),37);
 const a=M.batch(s,s.prices,256,9000000);
 assert.equal(a.gameForecast,37);assert(a.served>27&&a.served<30);
 assert.equal(a.dineServed,0);assert.equal(a.appServed,a.served);assert(a.served<a.gameForecast);
});
test('Min–max là cực trị số tô từng ngày của đúng tập seed, không phải CI lợi nhuận',()=>{
 const runs=Array.from({length:64},(_,i)=>M.simulate(s,s.prices,42+i*7919));
 const a=M.batch(s,s.prices,64,42),bowls=runs.map(r=>r.served);
 assert.equal(a.servedMin,Math.min(...bowls));assert.equal(a.servedMax,Math.max(...bowls));
 assert.equal(a.served,bowls.reduce((n,x)=>n+x,0)/64);
 assert(a.servedMin<=a.served&&a.served<=a.servedMax);
 assert(Number.isInteger(a.servedMin)&&Number.isInteger(a.servedMax));
 const mean=runs.reduce((n,r)=>n+r.profit,0)/64;
 const se=Math.sqrt(runs.reduce((n,r)=>n+(r.profit-mean)**2,0)/63/64);
 assert.equal(a.se,se);
});
test('Một ngày mô phỏng có min=max và SE bằng 0; số lượt sai bị từ chối',()=>{
 const a=M.batch(s,s.prices,1,42);
 assert.equal(a.servedMin,a.served);assert.equal(a.servedMax,a.served);assert.equal(a.se,0);
 for(const n of [0,-1,1.5,NaN])assert.throws(()=>M.batch(s,s.prices,n));
});
test('Chưa có đánh giá: thu hút và dự đoán dùng 4 sao như source game',()=>{
 const noReviews={...s,reviews:0,stars:1},four={...s,stars:4};
 assert.equal(M.traffic(noReviews,s.prices,0),M.traffic(four,s.prices,0));
 assert.equal(M.gameForecast(noReviews,s.prices),M.gameForecast(four,s.prices));
});
test('Dự đoán trước cửa dùng LED 45% ca; không áp sàn bẩn của ca bán',()=>{
 const c={...s,level:5,upgrades:['led'],dirty:true,buzz:.2};
 // Source wi: 1.4 sao × (1+.1 decor+.03 ngày+.1125 LED) × .85 ngày × 1.2 buzz / (30/35)^2.
 assert.equal(M.gameForecast(c,c.prices),Math.round(21*.95*1.4*1.2425*.85*1.2/(30/35)**2));
 assert.equal(M.gameForecast(c,c.prices),M.gameForecast({...c,dirty:false},c.prices));
 assert(M.traffic(c,c.prices,116)>M.traffic(c,c.prices,0));
});
test('Giá topping không đổi dự đoán; tỷ lệ giá nước lèo có sàn, trần và menu màu',()=>{
 assert.equal(M.gameForecast(s,{...s.prices,bo:45000}),37);
 assert.equal(M.gameForecast(s,{...s.prices,kimchi:1000}),M.gameForecast(s,{...s.prices,kimchi:29000}));
 assert.equal(M.gameForecast(s,{...s.prices,kimchi:56000}),M.gameForecast(s,{...s.prices,kimchi:105000}));
 const colored={...s,level:4,upgrades:['menu']};
 assert.equal(M.gameForecast(colored,{...s.prices,kimchi:36000}),37);
});
test('Dự đoán dùng sự kiện đã chọn và cuối tuần tự động, xe dạo có bonus thời tiết',()=>{
 assert.equal(M.gameForecast({...s,event:'rain'},s.prices),49);
 assert.equal(M.gameForecast({...s,day:6,event:'auto'},s.prices),M.gameForecast({...s,day:6,event:'weekend'},s.prices));
 assert.equal(M.gameForecast({...s,level:3,chapter:2,event:'rain'},s.prices),57);
});
