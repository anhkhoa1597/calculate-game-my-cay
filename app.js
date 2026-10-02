'use strict';
const Model = typeof module === 'object' ? require('./engine.js') : M;
const storageKey = 'mi-cay-planner-v1';
function restore(storage) {
 try {
  const raw = storage.getItem(storageKey);
  if (!raw) return {state:Model.defaults(), error:''};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw Error('Cấu hình không phải đối tượng.');
  const state = Model.validate({...Model.defaults(), ...parsed, chapter:parsed.chapter??Model.maxChapter(parsed.level??1), prices:{...Model.defaults().prices, ...parsed.prices}});
  if(state.reviews===0)state.stars=4;
  return {state, error:'', migrated:parsed.chapter==null};
 } catch (error) { return {state:Model.defaults(), error:error.message}; }
}
function persist(storage, state) {
 Model.validate(state);
 for(const item of [...Model.broths,...Model.tops])if(numberError(String(state.prices[item.id]??''),1000,item.base*3,1000))throw Error('Giá chưa hợp lệ: '+item.name);
 storage.setItem(storageKey, JSON.stringify(state));
}
function numberError(raw,min,max,step){
 if(String(raw).trim()==='')return 'Cần nhập một giá trị.';
 const n=Number(raw);
 if(!Number.isFinite(n)||n<min||n>max)return `Nhập số từ ${min.toLocaleString('vi-VN')} đến ${max.toLocaleString('vi-VN')}.`;
 const ticks=(n-min)/step;
 if(Math.abs(ticks-Math.round(ticks))>1e-7)return `Nhập theo bước ${step.toLocaleString('vi-VN')}.`;
 return '';
}
function searchText(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();}
function menuMatch(item,state,filter,query){return (filter==='all'||filter==='available'&&item.level<=state.level||filter==='selling'&&[...state.broths,...state.tops].includes(item.id))&&searchText(item.name).includes(searchText(query));}
function decision(result,state){
 const delta=result.stats.profit-result.baseline.profit;
 const overlap=Math.abs(delta)<=1.96*Math.hypot(result.stats.se,result.baseline.se);
 const constrained=state.safe&&[...state.broths,...state.tops].some(id=>Model.expensive(id,state.prices[id],state));
 if(constrained)return {kind:'constraint',title:'Đề xuất trong giới hạn an toàn',text:'Giá hiện tại có món vượt ngưỡng bị chê đắt. Chênh lệch dưới đây so với giá cũ, không phải cam kết tăng lời.'};
 if(overlap)return {kind:'uncertain',title:'Chưa rõ đổi giá có lợi hơn',text:'Chênh lệch nằm trong vùng nhiễu mô phỏng. Bạn có thể giữ giá hiện tại và đo lại tốc độ phục vụ.'};
 if(delta<0)return {kind:'keep',title:'Giữ giá hiện tại có lợi hơn',text:'Bảng giá tìm được cho lợi nhuận thấp hơn giá hiện tại. Không cần áp dụng đề xuất này.'};
 return {kind:'gain',title:'Có thể thử bảng giá đề xuất',text:'Lợi nhuận ước tính cao hơn trong mô hình một ngày. Theo dõi thời gian chờ và sao khi áp dụng.'};
}
if (typeof module === 'object') module.exports = {restore, persist, numberError, searchText, menuMatch, decision};
else init();
function init() {
const M = Model;
const $=id=>document.getElementById(id),money=n=>Math.round(n).toLocaleString('vi-VN')+'đ',num=n=>typeof n==='number'?n.toLocaleString('vi-VN',{maximumFractionDigits:1}):String(n),escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numeric=['level','chapter','day','stars','reviews','action','extra','decor','buzz','waste'],bool=['pet','dirty','noisy','safe'];
let storage;
try { storage = window.localStorage; } catch (_) { storage = {getItem(){throw Error('Trình duyệt chặn lưu trữ.');},setItem(){throw Error('Trình duyệt chặn lưu trữ.');}}; }
const restored = restore(storage);
let state=restored.state,result=null,working=false,hasCalculated=false;
function save(){
 try { persist(storage,state); $('saved').textContent='Tự nhớ trên máy';$('storage-note').textContent=''; return true; }
 catch(_){ $('saved').textContent='Chưa nhớ được'; $('storage-note').textContent='Vẫn tính được bình thường; thông số có thể không được nhớ sau reload.'; return false; }
}
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);$('mobile-status').textContent=text;$('mobile-status').classList.toggle('error',error);}
function draw(){
 for(const option of $('chapter').options)option.disabled=Number(option.value)>M.maxChapter(state.level);for(const id of numeric)$(id).value=state[id];for(const id of bool)$(id).checked=state[id];$('event').value=state.event;
 for(const [kind,catalog] of [['upgrades',M.upgrades],['staff',M.staff]])$(kind).innerHTML=catalog.map(x=>`<label class="check"><input type="checkbox" data-kind="${kind}" value="${x.id}" ${state[kind].includes(x.id)?'checked':''} ${x.level>state.level?'disabled':''}><span>${escapeHTML(x.name)} <small>LV${x.level} · ${money(x.daily)} / ngày${kind==='upgrades'?' · mua '+money(x.cost):''}<br>${escapeHTML(x.hint)}</small></span></label>`).join('');
 $('menurows').innerHTML=[['NƯỚC LÈO',M.broths,'broths'],['TOPPING',M.tops,'tops']].map(([title,catalog,kind])=>`<tr class="category" role="row"><td role="cell" colspan="4" data-count="${kind}">${title}</td></tr>`+catalog.map(x=>`<tr role="row" data-item="${x.id}"><td role="cell"><label class="check"><input type="checkbox" data-kind="${kind}" value="${x.id}" ${state[kind].includes(x.id)?'checked':''} ${x.level>state.level?'disabled':''}><span>${escapeHTML(x.name)}<small>${x.level>state.level?'Cần LV'+x.level:'LV'+x.level}${x.unlock?' · mở '+money(x.unlock):' · có sẵn'}</small></span></label></td><td role="cell" data-label="Vốn / phần">${money(x.cost+(kind==='broths'?4500:0))}</td><td role="cell" data-label="Giá hiện tại (đ)"><input type="number" inputmode="numeric" aria-label="Giá hiện tại ${escapeHTML(x.name)}" data-price="${x.id}" min="1000" max="${x.base*3}" step="1000" value="${state.prices[x.id]}" ${!state[kind].includes(x.id)?'disabled':''}></td><td role="cell" data-label="Đề xuất (đ)" class="recommend" data-recommend="${x.id}">${result&&state[kind].includes(x.id)?money(result.prices[x.id]):hasCalculated?'Cần tính lại':'Chưa tính'}</td></tr>`).join('')).join('');
 groupCounts();filterMenu();capacity();
}
function filterMenu(){
 const filter=$('menu-filter').value,query=$('menu-search').value;
 let total=0;
 for(const [kind,catalog,title] of [['broths',M.broths,'NƯỚC LÈO'],['tops',M.tops,'TOPPING']]){
  let count=0;
  for(const item of catalog){const visible=menuMatch(item,state,filter,query);document.querySelector(`[data-item="${item.id}"]`).hidden=!visible;if(visible)count++;}
  document.querySelector(`[data-count="${kind}"]`).textContent=`${title} · ${count}/${catalog.length} hiện · ${state[kind].length} đang bán`;
  total+=count;
 }
 $('menu-empty').hidden=total>0;
}
$('menu-filter').onchange=filterMenu;$('menu-search').oninput=filterMenu;
function groupCounts(){
 $('equipment-count').textContent=`${state.upgrades.length} trang bị · ${state.staff.length} nhân viên`;
 const extras=state.decor+(state.pet?1:0)+(state.dirty?1:0)+(state.noisy?1:0)+(state.buzz!==0?1:0)+(state.waste!==0?1:0);
 $('conditions-count').textContent=extras?`${extras} lựa chọn / giá trị đang dùng`:'Theo mặc định';
}
function capacity(){const cycle=state.upgrades.includes('fire')?4.2:5.2,pots=state.upgrades.includes('pot3')?3:state.upgrades.includes('pot2')?2:1,settings=M.service(state);
 $('capacity').textContent=`Chương ${state.chapter}: ${settings.seats} chỗ tại quán · ${settings.app?settings.appSlots+' đơn app đang chờ':'chưa bật app'} · thuê ${money(settings.rent)}/ngày · ${pots} nồi, mì chín khoảng ${num(cycle*(state.staff.includes('boil')?.64:.6))} giây.`;
}
function read(){const s={...state,prices:{...state.prices}};for(const id of numeric)s[id]=($(id).value.trim()===''?NaN:Number($(id).value));for(const id of bool)s[id]=$(id).checked;s.event=$('event').value;
 for(const kind of ['broths','tops','upgrades','staff'])s[kind]=[...document.querySelectorAll(`[data-kind="${kind}"]:checked`)].map(x=>x.value);
 for(const el of document.querySelectorAll('[data-price]'))s.prices[el.dataset.price]=(el.value.trim()===''?NaN:Number(el.value));if(s.reviews===0)s.stars=4;return s;
}
function validateInputs(focus=false){
 for(const el of document.querySelectorAll('[aria-invalid]')){el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');}
 for(const el of document.querySelectorAll('.field-error'))el.remove();
 const errors=[];
 for(const el of document.querySelectorAll('#form input[type=number], #menurows input[data-price]:not(:disabled)')){
  const message=numberError(el.value,Number(el.min),Number(el.max),Number(el.step));
  if(message)errors.push({el,message});
 }
 if(!state.broths.length)errors.push({el:$('menu-selection'),message:'Chọn ít nhất một nước lèo đang bán.'});
 if(state.upgrades.includes('pot3')&&!state.upgrades.includes('pot2'))errors.push({el:$('upgrades'),message:'Nồi thứ ba cần nồi thứ hai.'});
 for(const [i,{el,message}] of errors.entries()){
  if(!el.id)el.id='price-'+el.dataset.price;
  const note=document.createElement('span');note.className='field-error';note.id='error-'+el.id;note.textContent=message;
  el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',note.id);el.after(note);
 }
 $('errors').hidden=!errors.length;
 $('errors').innerHTML=errors.length?'<h3>Kiểm tra '+errors.length+' mục trước khi tính</h3><ul>'+errors.map(({el,message})=>`<li><a href="#${el.id}">${escapeHTML(el.getAttribute('aria-label')||el.closest('label')?.firstChild?.textContent||'Menu / trang bị')}: ${escapeHTML(message)}</a></li>`).join('')+'</ul>':'';
 if(errors.length&&focus)$('errors').focus();
 return !errors.length;
}
$('errors').onclick=e=>{const link=e.target.closest('a');if(!link)return;e.preventDefault();const el=$(link.hash.slice(1));if(el.dataset.price){$('menu-filter').value='all';$('menu-search').value='';filterMenu();}for(let parent=el.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;el.focus();el.scrollIntoView({block:'center'});};
function stale(){hasCalculated=true;result=null;$('results').innerHTML='<div class="stale">Thông số đã thay đổi. Bấm “Tìm giá cho quán” để tính lại.</div>';for(const el of document.querySelectorAll('[data-recommend]'))el.textContent='Cần tính lại';}
function changed(e){if(working)return;if(e.target.id==='stars'&&$('reviews').value==='0'){$('reviews').value=30;$('reviews-note').textContent='Đã dùng xấp xỉ 30 đánh giá ở mức sao vừa nhập.';}state=read();
 if(e.target.id==='level'&&Number.isInteger(state.level)&&state.level>=1&&state.level<=10){const previous=[...state.broths,...state.tops,...state.upgrades,...state.staff];for(const [kind,catalog] of [['broths',M.broths],['tops',M.tops],['upgrades',M.upgrades],['staff',M.staff]])state[kind]=state[kind].filter(id=>catalog.find(x=>x.id===id).level<=state.level);state.chapter=Math.min(state.chapter,M.maxChapter(state.level));if(!state.upgrades.includes('pot2'))state.upgrades=state.upgrades.filter(x=>x!=='pot3');draw();const removed=previous.filter(id=>![...state.broths,...state.tops,...state.upgrades,...state.staff].includes(id));$('level-note').textContent=removed.length?'Đã bỏ khỏi cấu hình vì giảm cấp: '+removed.map(id=>M.byId[id]?.name||M.upgrades.find(x=>x.id===id)?.name||M.staff.find(x=>x.id===id)?.name).join(', '):'Tăng cấp không tự chọn món hoặc mua trang bị.';}
 if(e.target.dataset.kind){if(e.target.value==='pot3'&&e.target.checked&&!state.upgrades.includes('pot2')){state.upgrades.push('pot2');document.querySelector('[data-kind="upgrades"][value="pot2"]').checked=true;}if(e.target.value==='pot2'&&!e.target.checked){state.upgrades=state.upgrades.filter(x=>x!=='pot3');document.querySelector('[data-kind="upgrades"][value="pot3"]').checked=false;}for(const el of document.querySelectorAll('[data-price]'))el.disabled=![...state.broths,...state.tops].includes(el.dataset.price);}
 if(state.reviews===0)$('stars').value=4;groupCounts();filterMenu();capacity();stale();if(!validateInputs()){ $('saved').textContent='Chưa lưu · đang nhập dở';return;}try{M.validate(state);save();status('Sẵn sàng tính lại.');}catch(err){status(err.message+' Cấu hình chưa hợp lệ nên chưa ghi đè bản đã lưu.',true);}
}
$('form').addEventListener('input',e=>{if(e.target.id==='chapter'&&Number(e.target.value)>M.maxChapter(state.level))return;changed(e);});
$('form').addEventListener('change',e=>{if(e.target.id==='level')changed(e);});$('menurows').addEventListener('input',changed);
$('reset').onclick=()=>{$('reset-confirm').hidden=false;$('cancel-reset').focus();};
$('cancel-reset').onclick=()=>{$('reset-confirm').hidden=true;$('reset').focus();};
$('confirm-reset').onclick=()=>{$('reset-confirm').hidden=true;$('storage-note').textContent='';state=M.defaults();draw();save();stale();status('Đã trở về cấu hình khởi đầu LV1.');validateInputs();};
$('unlock').onclick=()=>{state.broths=M.broths.filter(x=>x.level<=state.level).map(x=>x.id);state.tops=M.tops.filter(x=>x.level<=state.level).map(x=>x.id);draw();save();stale();};

function show(r){const a=r.stats,b=r.baseline,delta=a.profit-b.profit,loss=a.timeout+a.unfinished;
 const advice=decision(r,state);const metrics=[['Tô giao trung bình / ngày',a.served],['Tô tối thiểu–tối đa (mẫu)',a.servedMin+'–'+a.servedMax],['Dự đoán theo công thức game',a.gameForecast],['Tô giao app',a.appServed],['Tô tại quán',a.dineServed],['Nhóm / đơn mất vì đầy',a.full],['Hết kiên nhẫn',a.timeout],['Chưa xong khi đóng',a.unfinished],['Sao cuối ngày',a.endStars]];
 const rows=[['Lợi nhuận',b.profit,a.profit,true],['Doanh thu',b.sales,a.sales,true],['Vốn các tô đã giao',b.cost,a.cost,true],['Phí app',b.fee,a.fee,true],['Tip',b.tips,a.tips,true],['Chi phí cố định',b.fixed,a.fixed,true],['Hao hụt',b.waste,a.waste,true],['Tô giao trung bình',b.served,a.served,false],['Tô ít nhất trong mẫu',b.servedMin,a.servedMin,false],['Tô nhiều nhất trong mẫu',b.servedMax,a.servedMax,false],['Dự đoán theo công thức game',b.gameForecast,a.gameForecast,false],['Lượt thử nhận khách / đơn',b.arrivals,a.arrivals,false],['Lượt app',b.appArrivals,a.appArrivals,false],['Lượt tại quán',b.dineArrivals,a.dineArrivals,false],['Tô giao app',b.appServed,a.appServed,false],['Tô tại quán',b.dineServed,a.dineServed,false],['Mất vì đầy bàn / app',b.full,a.full,false],['Từ chối vì giá',b.priceLost,a.priceLost,false],['Hết kiên nhẫn',b.timeout,a.timeout,false],['Chưa xong khi đóng',b.unfinished,a.unfinished,false],['Sao cuối ngày',b.endStars,a.endStars,false],['Chờ tới nhận đủ món (giây)',b.wait,a.wait,false]];
 const overlap=Math.abs(delta)<=1.96*Math.hypot(a.se,b.se);
 const notes=[...(loss>1?[`Khoảng ${num(loss)} nhóm / đơn không nhận đủ món mỗi ngày. Tăng giá chưa đủ để giải quyết: hãy giảm thời gian thao tác, thêm nồi hoặc tăng kiên nhẫn.`]:[]),...(a.endStars<state.stars-.2?[`Sao dự kiến giảm từ ${num(state.stars)} xuống ${num(a.endStars)}. Giá tối đa lợi nhuận hôm nay có thể làm giảm khách những ngày sau.`]:[]),...(overlap?['Chênh lệch lợi nhuận nằm trong vùng nhiễu mô phỏng; chưa đủ bằng chứng giá mới tốt hơn giá hiện tại.']:[]),...(!state.safe?['Bạn đang cho phép giá bị chê đắt. Kiểm tra dòng từ chối vì giá và sao cuối ngày.']:[])];
 const renderRows=entries=>entries.map(([title,v,w,currency])=>`<tr role="row"><td role="cell">${title}</td><td role="cell" data-label="Hiện tại">${currency?money(v):num(v)}</td><td role="cell" data-label="Đề xuất">${currency?money(w):num(w)}</td></tr>`).join('');
 const compareTable=entries=>`<div class="tablewrap"><table class="comparison" role="table"><thead role="rowgroup"><tr role="row"><th>Chỉ số</th><th>Giá hiện tại</th><th>Giá đề xuất</th></tr></thead><tbody role="rowgroup">${renderRows(entries)}</tbody></table></div>`;
 $('results').innerHTML=`<div class="resulthead"><p class="eyebrow">GIÁ TỐT NHẤT TRONG ${r.tested} PHƯƠNG ÁN ĐÃ THỬ</p><p class="decision">${escapeHTML(advice.title)}</p><h2 id="result-heading" tabindex="-1">${money(a.profit)} <small style="font-size:14px;font-weight:400">/ ngày</small></h2><p>Tối ưu lợi nhuận trung bình, có tính sức bếp.</p><p>Lợi nhuận trung bình · ± ${money(1.96*a.se)} · 256 lượt kiểm chứng</p><p>${delta>=0?'+':''}${money(delta)} so với giá hiện tại${overlap?' · chưa phân biệt chắc chắn do nhiễu':''}</p></div><div class="resultbody"><p>${escapeHTML(advice.text)}</p>${a.profit<0?'<p class="warning">Quán vẫn lỗ trong mô phỏng. Đổi giá chưa đủ bù chi phí và sức phục vụ hiện tại.</p>':''}<div class="metrics">${metrics.map(([title,n])=>`<div><span>${title}</span><strong>${num(n)}</strong></div>`).join('')}</div><p class="help">Khoảng tô là ít nhất–nhiều nhất trong ${a.n} ngày mô phỏng, không phải giới hạn bảo đảm trong game. Dự đoán game dùng công thức chung 210 × thu hút ÷ 10 × 0,95; chưa tính nhịp app, sức bếp hoặc đơn bị mất. Khi chọn sự kiện ngẫu nhiên, chỉ số này lấy trung bình các ngày được rút.</p><div class="actions"><button type="button" class="primary" id="apply">Dùng giá trong công cụ</button><span class="help">Chỉ lưu vào công cụ; bạn tự chỉnh giá trong game.</span></div>${notes.map(x=>`<p class="warning">${escapeHTML(x)}</p>`).join('')}<details open><summary>Thu chi một ngày</summary>${compareTable(rows.slice(0,7))}</details><details><summary>Khách, thời gian chờ & sao</summary>${compareTable(rows.slice(7))}</details><details><summary>Những phương án đứng đầu</summary><ol class="alternatives">${r.alternatives.map((x,i)=>`<li><strong>Phương án ${i+1}: ${money(x.stats.profit)} / ngày</strong><details><summary>Xem bảng giá phương án ${i+1}</summary><dl>${[...state.broths,...state.tops].map(id=>`<div><dt>${escapeHTML(M.byId[id].name)}</dt><dd>${money(x.prices[id])}</dd></div>`).join('')}</dl></details></li>`).join('')}</ol><p class="help">Các phương án dùng cùng tập ngày kiểm chứng để giảm nhiễu; giá khuyến nghị cuối cùng được đánh giá thêm bằng tập seed mới.</p></details><details><summary>Nguyên liệu tiêu thụ ước tính</summary><div class="tablewrap"><table><thead><tr><th>Nguyên liệu</th><th>Phần đã bán / ngày</th></tr></thead><tbody><tr><td>Tô + đũa / vắt mì</td><td>${num(a.served)} mỗi loại</td></tr>${[...state.broths,...state.tops].map(id=>`<tr><td>${escapeHTML(M.byId[id].name)}</td><td>${num(a.counts[id])}</td></tr>`).join('')}</tbody></table></div><p class="stock">Đây là mức tiêu thụ trung bình phần đã giao, chưa gồm tô bỏ dở và dự phòng. Mô phỏng luôn đủ hàng; hãy nhập hao hụt thêm nếu thực tế thường thiếu hoặc hỏng nguyên liệu.</p></details><p class="help">Ưu tiên đơn sắp hết hạn, giữ nồi chạy đều. Các chỉ số khách tính theo nhóm / đơn, không phải số người; thu hút đầu ngày khoảng ${num(a.traffic)}×. Xem giới hạn mô phỏng bên dưới trước khi áp dụng.</p></div>`;
 for(const el of document.querySelectorAll('[data-recommend]'))el.textContent=[...state.broths,...state.tops].includes(el.dataset.recommend)?money(r.prices[el.dataset.recommend]):'—';
 $('apply').onclick=()=>{if(result!==r||working)return;state.prices={...r.prices};draw();save();stale();status('Đã dùng giá đề xuất trong công cụ. Tính lại để so với mốc giá mới.');};
}
const bar=document.querySelector('.calculatebar');
function measureBar(){if(bar.getBoundingClientRect().height)document.documentElement.style.setProperty('--bar-height',Math.ceil(bar.getBoundingClientRect().height)+'px');}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(measureBar).observe(bar);else window.addEventListener('resize',measureBar);
measureBar();
let barPointer=false;
bar.addEventListener('pointerdown',()=>{barPointer=true;});
document.addEventListener('click',()=>{barPointer=false;keyboardLayout();});
function keyboardLayout(){if(barPointer)return;
 const editing=document.activeElement?.matches('input[type=number],input[type=search],select');
 const shrunk=window.visualViewport&&window.visualViewport.height<window.innerHeight*.75;
 document.body.classList.toggle('editing',window.visualViewport?!!shrunk:!!editing);
}
document.addEventListener('focusin',keyboardLayout);document.addEventListener('focusout',()=>queueMicrotask(keyboardLayout));
window.visualViewport?.addEventListener('resize',keyboardLayout);
let movedWhileWorking=false;
for(const event of ['pointerdown','keydown','scroll'])window.addEventListener(event,()=>{if(working)movedWhileWorking=true;},{passive:true});
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
 try{state=read();if(!validateInputs(true))return;M.validate(state);}catch(err){status(err.message,true);return;}
 save();working=true;movedWhileWorking=false;result=null;$('results').innerHTML='<div class="empty"><h2>Đang tìm giá…</h2><p>So sánh sức bếp, thời gian chờ và lợi nhuận qua nhiều ngày mô phỏng.</p></div>';$('controls').disabled=true;$('unlock').disabled=true;for(const el of document.querySelectorAll('#menurows input'))el.disabled=true;
 $('results').setAttribute('aria-busy','true');status('Đang mô phỏng các bảng giá…');await new Promise(r=>setTimeout(r,40));
 try{result=await findPrices(structuredClone(state));hasCalculated=true;draw();show(result);if(!movedWhileWorking&&(document.activeElement===document.body||document.activeElement===$('calculate')))$('result-heading').focus({preventScroll:true});status('Đã tính xong. Kết quả phụ thuộc tốc độ bạn nhập và giả định mô phỏng.');}
 catch(err){status('Không tính được: '+err.message,true);$('results').innerHTML='<div class="warning">Không tính được lượt này. Kiểm tra thông số hoặc tải lại trang rồi thử lại.</div>';draw();}
 finally{working=false;$('controls').disabled=false;$('unlock').disabled=false;$('results').removeAttribute('aria-busy');}
};
let databaseReady=false;
document.querySelector('details.database').addEventListener('toggle',event=>{
 if(!event.currentTarget.open||databaseReady)return;
 try{
  $('database').innerHTML=M.data.map((section,i)=>`<details><summary>${escapeHTML(section.title)}</summary><p class="scroll-hint">Bảng có thể rộng: vuốt ngang hoặc Tab vào vùng bảng rồi dùng phím mũi tên.</p><div class="tablewrap" tabindex="0" role="region" aria-label="${escapeHTML(section.title)}"><table><thead><tr>${section.headers.map(x=>`<th scope="col">${escapeHTML(x)}</th>`).join('')}</tr></thead><tbody>${section.rows.map(row=>`<tr>${row.map(x=>`<td>${escapeHTML(typeof x==='object'&&x!==null?JSON.stringify(x):x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`).join('');
  databaseReady=true;
 }catch(error){$('database').textContent='Không dựng được data: '+error.message+'. Đóng và mở lại để thử lại.';}
});
draw();
if(!restored.error&&storage){$('chapter-note').textContent=restored.migrated?'Cấu hình cũ được tạm chọn chương theo cấp. Hãy chọn lại đúng chương đang chơi.':'Chọn đúng chương đang thấy trong game; lên level không tự hoàn thành nhiệm vụ chương.';}
if(restored.error){$('storage-note').textContent='Không đọc được thông số cũ; đang dùng LV1. Bạn có thể tiếp tục nhập và tìm giá.';}
}
