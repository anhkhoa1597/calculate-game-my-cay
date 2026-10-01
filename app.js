'use strict';
const Model = typeof module === 'object' ? require('./engine.js') : M;
const storageKey = 'mi-cay-planner-v1';
function restore(storage) {
 let raw = null;
 try {
  raw = storage.getItem(storageKey);
  if (!raw) return {state:Model.defaults(), raw:null, error:''};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw Error('Cấu hình không phải đối tượng.');
  const state = Model.validate({...Model.defaults(), ...parsed, prices:{...Model.defaults().prices, ...parsed.prices}});
  return {state, raw:null, error:''};
 } catch (error) { return {state:Model.defaults(), raw, error:error.message}; }
}
function persist(storage, state, recovery) {
 if (recovery) throw Error('Bản lưu cũ chưa đọc được. Tải bản gốc hoặc xác nhận Về LV1 trước khi thay thế.');
 Model.validate(state);
 storage.setItem(storageKey, JSON.stringify(state));
}
if (typeof module === 'object') module.exports = {restore, persist};
else init();
function init() {
const M = Model;
const $=id=>document.getElementById(id),money=n=>Math.round(n).toLocaleString('vi-VN')+'đ',num=n=>n.toLocaleString('vi-VN',{maximumFractionDigits:1}),escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numeric=['level','day','stars','reviews','action','extra','decor','buzz','waste'],bool=['pet','dirty','noisy','safe'];
let storage;
try { storage = window.localStorage; } catch (_) { storage = {getItem(){throw Error('Trình duyệt chặn lưu trữ.');},setItem(){throw Error('Trình duyệt chặn lưu trữ.');}}; }
const restored = restore(storage);
let state=restored.state,result=null,working=false,restoreError=restored.error,recoveryRaw=restored.raw;
function save(){
 try { persist(storage,state,!!restoreError); $('saved').textContent='Đã lưu trên máy'; return true; }
 catch(error){ $('saved').textContent='Chưa lưu · tải JSON để giữ lại'; $('storage-note').textContent=error.message; return false; }
}
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);$('mobile-status').textContent=text;$('mobile-status').classList.toggle('error',error);}
function draw(){
 for(const id of numeric)$(id).value=state[id];for(const id of bool)$(id).checked=state[id];$('event').value=state.event;
 for(const [kind,catalog] of [['upgrades',M.upgrades],['staff',M.staff]])$(kind).innerHTML=catalog.map(x=>`<label class="check"><input type="checkbox" data-kind="${kind}" value="${x.id}" ${state[kind].includes(x.id)?'checked':''} ${x.level>state.level?'disabled':''}><span>${escapeHTML(x.name)} <small>LV${x.level} · ${money(x.daily)} / ngày${kind==='upgrades'?' · mua '+money(x.cost):''}<br>${escapeHTML(x.hint)}</small></span></label>`).join('');
 $('menurows').innerHTML=[['NƯỚC LÈO',M.broths,'broths'],['TOPPING',M.tops,'tops']].map(([title,catalog,kind])=>`<tr class="category" role="row"><td role="cell" colspan="4">${title}</td></tr>`+catalog.map(x=>`<tr role="row"><td role="cell"><label class="check"><input type="checkbox" data-kind="${kind}" value="${x.id}" ${state[kind].includes(x.id)?'checked':''} ${x.level>state.level?'disabled':''}><span>${escapeHTML(x.name)}<small>LV${x.level}${x.unlock?' · mở '+money(x.unlock):' · có sẵn'}</small></span></label></td><td role="cell" data-label="Vốn / phần">${money(x.cost+(kind==='broths'?4500:0))}</td><td role="cell" data-label="Giá hiện tại (đ)"><input type="number" inputmode="numeric" aria-label="Giá hiện tại ${escapeHTML(x.name)}" data-price="${x.id}" min="1000" max="${x.base*3}" step="1000" value="${state.prices[x.id]}" ${!state[kind].includes(x.id)?'disabled':''}></td><td role="cell" data-label="Đề xuất (đ)" class="recommend" data-recommend="${x.id}">—</td></tr>`).join('')).join('');
 capacity();
}
function capacity(){const cycle=state.upgrades.includes('fire')?4.2:5.2,pots=state.upgrades.includes('pot3')?3:state.upgrades.includes('pot2')?2:1;
 $('capacity').textContent=`${state.upgrades.includes('seat4')?4:3} bàn · ${pots} nồi luộc · mì chín khoảng ${num(cycle*(state.staff.includes('boil')?.64:.6))} giây. Giảm thời gian thao tác giúp bếp theo kịp khách.`;
}
function read(){const s={...state,prices:{...state.prices}};for(const id of numeric)s[id]=Number($(id).value);for(const id of bool)s[id]=$(id).checked;s.event=$('event').value;
 for(const kind of ['broths','tops','upgrades','staff'])s[kind]=[...document.querySelectorAll(`[data-kind="${kind}"]:checked`)].map(x=>x.value);
 for(const el of document.querySelectorAll('[data-price]'))s.prices[el.dataset.price]=Number(el.value);if(s.reviews===0)s.stars=4;return s;
}
function stale(){result=null;$('results').innerHTML='<div class="stale">Thông số đã thay đổi. Bấm “Tìm giá cho quán” để tính lại.</div>';for(const el of document.querySelectorAll('[data-recommend]'))el.textContent='—';}
function changed(e){if(working)return;if(e.target.id==='stars'&&Number($('reviews').value)===0)$('reviews').value=30;state=read();
 if(e.target.id==='level'){for(const [kind,catalog] of [['broths',M.broths],['tops',M.tops],['upgrades',M.upgrades],['staff',M.staff]])state[kind]=state[kind].filter(id=>catalog.find(x=>x.id===id).level<=state.level);if(!state.broths.length)state.broths=['kimchi'];if(!state.upgrades.includes('pot2'))state.upgrades=state.upgrades.filter(x=>x!=='pot3');draw();}
 if(e.target.dataset.kind){if(e.target.value==='pot3'&&e.target.checked&&!state.upgrades.includes('pot2')){state.upgrades.push('pot2');document.querySelector('[data-kind="upgrades"][value="pot2"]').checked=true;}if(e.target.value==='pot2'&&!e.target.checked){state.upgrades=state.upgrades.filter(x=>x!=='pot3');document.querySelector('[data-kind="upgrades"][value="pot3"]').checked=false;}for(const el of document.querySelectorAll('[data-price]'))el.disabled=![...state.broths,...state.tops].includes(el.dataset.price);}
 capacity();stale();try{M.validate(state);save();status('Sẵn sàng tính lại.');}catch(err){status(err.message+' Cấu hình chưa hợp lệ nên chưa ghi đè bản đã lưu.',true);}
}
$('form').addEventListener('change',changed);$('menurows').addEventListener('change',changed);
$('reset').onclick=()=>{$('reset-confirm').hidden=false;$('cancel-reset').focus();};
$('cancel-reset').onclick=()=>{$('reset-confirm').hidden=true;$('reset').focus();};
$('confirm-reset').onclick=()=>{$('reset-confirm').hidden=true;restoreError='';recoveryRaw=null;$('storage-note').textContent='';$('recovery').hidden=true;state=M.defaults();draw();save();stale();status('Đã trở về cấu hình khởi đầu LV1.');};
$('unlock').onclick=()=>{state.broths=M.broths.filter(x=>x.level<=state.level).map(x=>x.id);state.tops=M.tops.filter(x=>x.level<=state.level).map(x=>x.id);draw();save();stale();};
$('export').onclick=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.href=url;a.download='quan-mi-cay.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function show(r){const a=r.stats,b=r.baseline,delta=a.profit-b.profit,loss=a.timeout+a.unfinished;
 const metrics=[['Tô phục vụ / ngày',a.served],['Nhóm / đơn mất do đầy',a.full],['Bỏ về / chưa xong',loss]];
 const rows=[['Lợi nhuận',b.profit,a.profit,true],['Doanh thu',b.sales,a.sales,true],['Vốn các tô đã giao',b.cost,a.cost,true],['Phí app',b.fee,a.fee,true],['Tip',b.tips,a.tips,true],['Chi phí cố định',b.fixed,a.fixed,true],['Hao hụt',b.waste,a.waste,true],['Tô đã giao',b.served,a.served,false],['Nhóm / đơn ghé',b.arrivals,a.arrivals,false],['Mất vì đầy bàn / app',b.full,a.full,false],['Từ chối vì giá',b.priceLost,a.priceLost,false],['Hết kiên nhẫn',b.timeout,a.timeout,false],['Chưa xong khi đóng',b.unfinished,a.unfinished,false],['Sao cuối ngày',b.endStars,a.endStars,false],['Chờ tới nhận đủ món (giây)',b.wait,a.wait,false]];
 const overlap=Math.abs(delta)<1.96*Math.sqrt(a.se*a.se+b.se*b.se);
 const notes=[...(loss>1?[`Khoảng ${num(loss)} nhóm / đơn không nhận đủ món mỗi ngày. Tăng giá chưa đủ để giải quyết: hãy giảm thời gian thao tác, thêm nồi hoặc tăng kiên nhẫn.`]:[]),...(a.endStars<state.stars-.2?[`Sao dự kiến giảm từ ${num(state.stars)} xuống ${num(a.endStars)}. Giá tối đa lợi nhuận hôm nay có thể làm giảm khách những ngày sau.`]:[]),...(overlap?['Chênh lệch lợi nhuận nằm trong vùng nhiễu mô phỏng; chưa đủ bằng chứng giá mới tốt hơn giá hiện tại.']:[]),...(!state.safe?['Bạn đang cho phép giá bị chê đắt. Kiểm tra dòng từ chối vì giá và sao cuối ngày.']:[])];
 const vals=r.alternatives.map(x=>x.stats.profit),min=Math.min(...vals,0),max=Math.max(...vals,1),range=max-min||1;
 const bars=r.alternatives.map((x,i)=>{const zero=120+360*(0-min)/range,end=120+360*(x.stats.profit-min)/range;return `<text x="0" y="${24+i*28}">Phương án ${i+1}</text><rect x="${Math.min(zero,end)}" y="${12+i*28}" width="${Math.max(1,Math.abs(end-zero))}" height="16" fill="${i?'#b2c4b4':'#216451'}" rx="2"/><text x="490" y="${24+i*28}">${escapeHTML(money(x.stats.profit))}</text>`;}).join('');
 $('results').innerHTML=`<div class="resulthead"><p class="eyebrow">GIÁ TỐT NHẤT TRONG ${r.tested} PHƯƠNG ÁN ĐÃ THỬ</p><h2>${money(a.profit)} <small style="font-size:14px;font-weight:400">/ ngày</small></h2><p>Lợi nhuận trung bình · ± ${money(1.96*a.se)} · 256 lượt kiểm chứng</p><p>${delta>=0?'+':''}${money(delta)} so với giá hiện tại${overlap?' · chưa phân biệt chắc chắn do nhiễu':''}</p></div><div class="resultbody"><div class="metrics">${metrics.map(([title,n])=>`<div><span>${title}</span><strong>${num(n)}</strong></div>`).join('')}</div><div class="actions"><button type="button" class="primary" id="apply">Dùng giá đề xuất</button><span class="help">Đề xuất ở cột cuối bảng menu</span></div>${notes.map(x=>`<p class="warning">${escapeHTML(x)}</p>`).join('')}<details open><summary>So sánh một ngày bán hàng</summary><div class="tablewrap"><table class="comparison" role="table"><thead role="rowgroup"><tr role="row"><th>Chỉ số</th><th>Giá hiện tại</th><th>Giá đề xuất</th></tr></thead><tbody role="rowgroup">${rows.map(([title,v,w,currency])=>`<tr role="row"><td role="cell">${title}</td><td role="cell" data-label="Hiện tại">${currency?money(v):num(v)}</td><td role="cell" data-label="Đề xuất">${currency?money(w):num(w)}</td></tr>`).join('')}</tbody></table></div></details><details><summary>Những phương án đứng đầu</summary><svg viewBox="0 0 640 160" class="chart" role="img" aria-label="So sánh lợi nhuận 5 bảng giá đứng đầu">${bars}</svg><p class="help">Các phương án dùng cùng tập ngày kiểm chứng để giảm nhiễu; giá khuyến nghị cuối cùng được đánh giá thêm bằng tập seed mới.</p></details><details><summary>Nguyên liệu tiêu thụ ước tính</summary><div class="tablewrap"><table><thead><tr><th>Nguyên liệu</th><th>Phần đã bán / ngày</th></tr></thead><tbody><tr><td>Tô + đũa / vắt mì</td><td>${num(a.served)} mỗi loại</td></tr>${[...state.broths,...state.tops].map(id=>`<tr><td>${escapeHTML(M.byId[id].name)}</td><td>${num(a.counts[id])}</td></tr>`).join('')}</tbody></table></div><p class="stock">Đây là mức tiêu thụ trung bình phần đã giao, chưa gồm tô bỏ dở và dự phòng. Mô phỏng luôn đủ hàng; hãy nhập hao hụt thêm nếu thực tế thường thiếu hoặc hỏng nguyên liệu.</p></details><p class="help">Ưu tiên đơn sắp hết hạn, giữ nồi chạy đều. Các chỉ số khách tính theo nhóm / đơn, không phải số người; thu hút đầu ngày khoảng ${num(a.traffic)}×. Xem giới hạn mô phỏng bên dưới trước khi áp dụng.</p></div>`;
 for(const el of document.querySelectorAll('[data-recommend]'))el.textContent=[...state.broths,...state.tops].includes(el.dataset.recommend)?money(r.prices[el.dataset.recommend]):'—';
 $('apply').onclick=()=>{state.prices={...r.prices};draw();save();stale();status('Đã lưu giá đề xuất vào cấu hình. Tính lại để so với mốc giá mới.');};
}
let requestId = 0;
function findPrices(config) {
 if (location.protocol === 'file:' || typeof Worker === 'undefined') {
  status('Đang tính trực tiếp: trình duyệt có thể chậm. Dùng localhost/Pages để tính nền.');
  return M.optimize(config, text => status(text + ' (chế độ tính trực tiếp)'));
 }
 return new Promise((resolve, reject) => {
  const id = ++requestId;
  const worker = new Worker('worker.js');
  const fail = message => { worker.terminate(); reject(new Error(message)); };
  worker.onmessage = ({data}) => {
   if (data.id !== id || id !== requestId) return;
   if (data.type === 'progress') status(data.text);
   else if (data.type === 'result') { worker.terminate(); resolve(data.result); }
   else if (data.type === 'error') fail(data.message);
  };
  worker.onerror = () => fail('Không khởi động được Worker. Kiểm tra kết nối và tải lại trang.');
  worker.onmessageerror = () => fail('Không đọc được kết quả từ Worker.');
  worker.postMessage({id, config});
 });
}
$('form').onsubmit=async e=>{e.preventDefault();if(working)return;
 try{state=read();M.validate(state);}catch(err){status(err.message,true);return;}
 save();working=true;result=null;$('results').innerHTML='<div class="empty"><h2>Đang tìm giá…</h2><p>So sánh sức bếp, thời gian chờ và lợi nhuận qua nhiều ngày mô phỏng.</p></div>';$('controls').disabled=true;$('unlock').disabled=true;$('export').disabled=true;for(const el of document.querySelectorAll('#menurows input'))el.disabled=true;
 $('results').setAttribute('aria-busy','true');status('Đang mô phỏng các bảng giá…');await new Promise(r=>setTimeout(r,40));
 try{result=await findPrices(structuredClone(state));draw();show(result);if(window.matchMedia('(max-width: 800px)').matches)$('results').scrollIntoView({block:'start'});status('Đã tính xong. Kết quả phụ thuộc tốc độ bạn nhập và giả định mô phỏng.');}
 catch(err){status('Không tính được: '+err.message,true);draw();}
 finally{working=false;$('controls').disabled=false;$('unlock').disabled=false;$('export').disabled=false;$('results').removeAttribute('aria-busy');}
};
$('database').innerHTML=M.data.map(section=>`<details><summary>${escapeHTML(section.title)}</summary><div class="tablewrap"><table><thead><tr>${section.headers.map(x=>`<th>${escapeHTML(x)}</th>`).join('')}</tr></thead><tbody>${section.rows.map(row=>`<tr>${row.map(x=>`<td>${escapeHTML(typeof x==='object'&&x!==null?JSON.stringify(x):x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`).join('');
draw();
if(restoreError){$('saved').textContent='Chưa lưu · cần phục hồi';$('storage-note').textContent='Không đọc được bản lưu: '+restoreError+'. Bản gốc được giữ nguyên; đang hiển thị LV1.';$('recovery').hidden=recoveryRaw===null;}
function download(text,name){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('recovery').onclick=()=>download(recoveryRaw,'quan-mi-cay-ban-goc.json');
}
