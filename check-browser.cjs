// Run these read-only callbacks through the browser tool on the visible panels.
// They intentionally assert layout outcomes rather than CSS selector text.
function menuLayoutCheck(){
 const menu=document.querySelector('#menu');
 if(menu.hidden)throw Error('Open Menu before checking its layout.');
 const rows=[...menu.querySelectorAll('tr[data-item]')].filter(x=>!x.hidden);
 if(!rows.length)throw Error('Need at least one visible menu item.');
 const errors=[];
 for(const row of rows){
  const box=row.querySelector('input[type=checkbox]').getBoundingClientRect();
  const name=row.querySelector('label span').getBoundingClientRect();
  if(box.width>28)errors.push(row.dataset.item+': checkbox too wide ('+box.width+')');
  if(name.width<35)errors.push(row.dataset.item+': name collapsed ('+name.width+')');
  if(row.getBoundingClientRect().height>160)errors.push(row.dataset.item+': row excessively tall');
 }
 if(document.documentElement.scrollWidth>window.innerWidth+1)errors.push('Page overflows horizontally');
 if(errors.length)throw Error(errors.join('; '));
 return {rows:rows.length,viewport:window.innerWidth,result:'PASS'};
}
module.exports={menuLayoutCheck};
function errorLinksCheck(){
 const links=[...document.querySelectorAll('#errors a')];
 if(!links.length)throw Error('Reproduce a validation error first.');
 for(const link of links){
  const rect=link.getBoundingClientRect(),hit=document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
  if(!hit||!(hit===link||link.contains(hit)))throw Error('Middle of wrapped error link is not clickable: '+link.textContent);
 }
 return {links:links.length,result:'PASS'};
}
module.exports.errorLinksCheck=errorLinksCheck;
