const EVENT_CATEGORY = {performance:'演出', workshop:'工作坊', exchange:'交流', other:'其他'};

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function parseDate(s){const [y,m,d]=(s||'').split('-').map(Number); return y&&m&&d ? new Date(y,m-1,d) : null;}
function dateLabel(s){const d=parseDate(s); if(!d)return ''; return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;}
function eventEnd(e){return parseDate(e.endDate||e.date);}
function eventDateLabel(e){const start=dateLabel(e.date),end=e.endDate?dateLabel(e.endDate):''; return end&&end!==start?`${start}–${end}`:start;}
function dateInEvent(ds,e){const d=parseDate(ds),a=parseDate(e.date),b=eventEnd(e); return !!(d&&a&&b&&d>=a&&d<=b);}
function todayStart(){const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),n.getDate());}
function externalLink(url=''){return /^https?:\/\//i.test(url);}
async function loadEvents(){try{const r=await fetch('data/events.json',{cache:'no-store'}); if(!r.ok)throw new Error('events'); const j=await r.json(); return Array.isArray(j)?j.filter(e=>e.published!==false):[];}catch(e){return [];}}

function setupNav(){const b=document.querySelector('.menu-btn'), n=document.querySelector('.nav-links'); if(!b||!n)return; b.addEventListener('click',()=>{const open=n.classList.toggle('open'); b.setAttribute('aria-expanded',String(open));}); n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));}
function setupHero(){const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.dot')]; if(!slides.length)return; let i=0,t; const show=x=>{i=(x+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));}; const restart=()=>{clearInterval(t);t=setInterval(()=>show(i+1),6500)}; dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);restart();})); show(0); if(!matchMedia('(prefers-reduced-motion: reduce)').matches)restart();}
function setupReveal(){const els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('visible'));return;} const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>o.observe(e));}
function setupBrokenImages(){
  document.addEventListener('error',e=>{
    const img=e.target;
    if(!(img instanceof HTMLImageElement))return;
    if(img.closest('.person-photo,.bio-photo')){img.classList.add('is-broken');return;}
    if(img.dataset.fallbackApplied==='1')return;
    if(img.matches('.festival-feature-card img,.home-event-thumb img,.upcoming-card-thumb img,.current-event-image img,.series-hero img')){
      img.dataset.fallbackApplied='1';
      img.src='assets/images/qingminglong-stage.jpg';
      img.style.objectFit='cover';
    }
  },true);
}
function setupPersonDialogs(){document.querySelectorAll('.person-open').forEach(btn=>btn.addEventListener('click',()=>{const d=document.getElementById(btn.dataset.dialog); if(d&&typeof d.showModal==='function')d.showModal();}));document.querySelectorAll('.bio-dialog').forEach(d=>{const close=d.querySelector('.bio-close'); if(close)close.addEventListener('click',()=>d.close()); d.addEventListener('click',e=>{if(e.target===d)d.close();});});}



function setupCounters(){
  const nums=[...document.querySelectorAll('[data-counter]')];
  if(!nums.length)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run=(el)=>{
    if(el.dataset.done==='1')return;
    el.dataset.done='1';
    const end=Number(el.dataset.counter)||0;
    const suffix=el.dataset.suffix||'';
    if(reduce){el.textContent=`${end}${suffix}`;return;}
    const duration=end>1000?1800:1400;
    const startTime=performance.now();
    const tick=(now)=>{
      const p=Math.min((now-startTime)/duration,1);
      const eased=1-Math.pow(1-p,3);
      const value=Math.round(end*eased);
      el.textContent=`${value}${suffix}`;
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if(!('IntersectionObserver' in window)){nums.forEach(run);return;}
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){run(entry.target);io.unobserve(entry.target);}}),{threshold:.35});
  nums.forEach(n=>io.observe(n));
}


function setupBackstageCarousel(){
  document.querySelectorAll('[data-backstage-carousel]').forEach(carousel=>{
    const track=carousel.querySelector('[data-backstage-track]');
    const prev=carousel.querySelector('[data-backstage-prev]');
    const next=carousel.querySelector('[data-backstage-next]');
    if(!track)return;
    const step=()=>{const card=track.querySelector('figure');return card?card.getBoundingClientRect().width:track.clientWidth};
    prev&&prev.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
    next&&next.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
  });
}


function setupImageProtection(){
  document.querySelectorAll('img').forEach(img=>img.setAttribute('draggable','false'));
  document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('img,picture'))e.preventDefault();});
  document.addEventListener('dragstart',e=>{if(e.target.closest&&e.target.closest('img,picture'))e.preventDefault();});
}

function setupBackToTop(){
  const b=document.createElement('button');
  b.type='button'; b.className='back-to-top'; b.setAttribute('aria-label','回到頁面頂端'); b.setAttribute('title','回到頂端'); b.textContent='↑';
  document.body.appendChild(b);
  const sync=()=>b.classList.toggle('is-visible',window.scrollY>700);
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  window.addEventListener('scroll',sync,{passive:true}); sync();
}

async function renderHomeEvents(){const host=document.querySelector('[data-home-events]'); if(!host)return; const ev=(await loadEvents()).filter(e=>eventEnd(e)>=todayStart()&&e.showOnHome!==false).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3); if(!ev.length){host.innerHTML='<div class="schedule-empty">近期公開行程整理中。活動確認後會第一時間更新在這裡。</div>';return;} host.innerHTML=ev.map(e=>{const url=e.url||'schedule.html';const ext=externalLink(url)?' target="_blank" rel="noopener"':'';const tags=(Array.isArray(e.tags)?e.tags:[]).map(tag=>`<span>${esc(tag)}</span>`).join('');const fit=e.imageFit==='contain'?' is-contain':'';const img=e.image?`<img src="${esc(e.image)}" alt="${esc(e.title)}" loading="eager" decoding="async"/>`:'';return `<a class="home-event-card" href="${esc(url)}"${ext}><div class="home-event-thumb${fit}">${img}<div class="home-event-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</div></div><div class="home-event-body"><div class="home-event-date">${eventDateLabel(e)}${e.time?' · '+esc(e.time):''}</div><div class="home-event-title">${esc(e.title)}</div>${e.subtitle?`<div class="home-event-subtitle">${esc(e.subtitle)}</div>`:''}<div class="home-event-meta">${e.location?esc(e.location):''}</div>${tags?`<div class="home-event-tags">${tags}</div>`:''}</div></a>`}).join('');}

let calCursor=new Date();
async function renderSchedule(){const root=document.querySelector('[data-calendar]'); if(!root)return; const events=(await loadEvents()).sort((a,b)=>a.date.localeCompare(b.date)); const monthTitle=document.querySelector('[data-month-title]'); const grid=document.querySelector('[data-calendar-grid]'); const list=document.querySelector('[data-upcoming-list]');
  let preview=document.querySelector('[data-calendar-preview]');
  if(!preview){preview=document.createElement('div');preview.className='calendar-event-preview';preview.setAttribute('data-calendar-preview','');preview.setAttribute('aria-hidden','true');preview.innerHTML='<div class="calendar-event-preview-backdrop" data-preview-close></div><section class="calendar-event-preview-sheet" role="dialog" aria-modal="true" aria-labelledby="calendar-preview-title"><button class="calendar-event-preview-close" type="button" data-preview-close aria-label="關閉活動資訊">×</button><div data-preview-content></div></section>';document.body.appendChild(preview);}
  const previewContent=preview.querySelector('[data-preview-content]');
  const closePreview=()=>{preview.classList.remove('is-open');preview.setAttribute('aria-hidden','true');grid.querySelectorAll('.day.is-selected').forEach(el=>el.classList.remove('is-selected'));};
  const showDayPreview=(dateStr,dayEvents,trigger)=>{const sorted=[...dayEvents].sort((a,b)=>(a.time||'').localeCompare(b.time||''));const dateObj=parseDate(dateStr);const dateText=dateObj?`${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')} · ${sorted.length} 場`:`${dateStr} · ${sorted.length} 場`;const items=sorted.map((e,i)=>{const url=e.url||'';const ext=externalLink(url)?' target="_blank" rel="noopener"':'';const location=e.location?`<div class="calendar-preview-meta"><span>地點</span><strong>${esc(e.location)}</strong></div>`:'';const description=e.description?`<p class="calendar-preview-description">${esc(e.description)}</p>`:'';const fit=e.imageFit==='contain'?' is-contain':'';const image=e.image?`<figure class="calendar-preview-banner${fit}"><img src="${esc(e.image)}" alt="${esc(e.subtitle||e.title)}" loading="eager" decoding="async"></figure>`:'';const cta=url?`<a class="calendar-preview-link" href="${esc(url)}"${ext}>查看詳情／報名 →</a>`:'<div class="calendar-preview-note">此場為行程資訊，無另設公開連結。</div>';return `<article class="calendar-preview-item"><div class="calendar-preview-item-head"><div class="calendar-preview-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</div>${e.time?`<div class="calendar-preview-time">${esc(e.time)}</div>`:''}</div>${image}<h3${i===0?' id="calendar-preview-title"':''}>${esc(e.title)}</h3>${location}${description}${cta}</article>`;}).join('');previewContent.innerHTML=`<div class="calendar-preview-date">${dateText}</div><div class="calendar-preview-day-list">${items}</div>`;grid.querySelectorAll('.day.is-selected').forEach(el=>el.classList.remove('is-selected'));if(trigger)trigger.classList.add('is-selected');preview.classList.add('is-open');preview.setAttribute('aria-hidden','false');};
  preview.querySelectorAll('[data-preview-close]').forEach(el=>el.addEventListener('click',closePreview));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview.classList.contains('is-open'))closePreview();});
  function draw(){closePreview();const y=calCursor.getFullYear(),m=calCursor.getMonth(); monthTitle.textContent=`${y} 年 ${m+1} 月`; const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()); let html=['日','一','二','三','四','五','六'].map(w=>`<div class="weekday">${w}</div>`).join(''); for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const dayEv=events.filter(e=>dateInEvent(ds,e));const dayClass=`day ${d.getMonth()!==m?'muted ':''}${dayEv.length?'has-events':''}`.trim();const dayLabel=dayEv.length&&matchMedia('(max-width: 600px)').matches?` aria-label="${d.getMonth()+1}月${d.getDate()}日，共${dayEv.length}場活動" tabindex="0" role="button"`:'';html+=`<div class="${dayClass}" data-date="${ds}"${dayLabel}><div class="day-num">${d.getDate()}</div>${dayEv.map(e=>{const idx=events.indexOf(e);return `<button class="cal-event" type="button" data-event-index="${idx}" aria-label="${esc(e.title)}，${esc(e.time||'')}">${esc(e.title)}<span>${esc(e.time||'')}${e.location?' · '+esc(e.location.split('｜')[0]):''}</span></button>`}).join('')}</div>`;}grid.innerHTML=html;}
  const openDayFromCell=(cell)=>{if(!cell||!cell.dataset.date)return;const dayEvents=events.filter(item=>dateInEvent(cell.dataset.date,item));if(!dayEvents.length)return;showDayPreview(cell.dataset.date,dayEvents,cell);};
  grid.addEventListener('click',e=>{if(matchMedia('(max-width: 600px)').matches){const cell=e.target.closest('.day.has-events');if(!cell)return;e.preventDefault();e.stopPropagation();openDayFromCell(cell);return;}const trigger=e.target.closest('.cal-event');if(!trigger)return;e.preventDefault();e.stopPropagation();const item=events[Number(trigger.dataset.eventIndex)];if(!item)return;if(item.url){if(externalLink(item.url))window.open(item.url,'_blank','noopener');else window.location.href=item.url;}});
  grid.addEventListener('keydown',e=>{if(!matchMedia('(max-width: 600px)').matches||!['Enter',' '].includes(e.key))return;const cell=e.target.closest('.day.has-events');if(!cell)return;e.preventDefault();openDayFromCell(cell);});
  document.querySelector('[data-prev-month]').addEventListener('click',()=>{calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()-1,1);draw()});document.querySelector('[data-next-month]').addEventListener('click',()=>{calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()+1,1);draw()});
  if(list){const upcoming=events.filter(e=>eventEnd(e)>=todayStart()); list.innerHTML=upcoming.length?`<div class="upcoming-card-list">${upcoming.map(e=>{const ext=externalLink(e.url||'')?' target="_blank" rel="noopener"':'';const tags=(Array.isArray(e.tags)?e.tags:[]).map(tag=>`<span>${esc(tag)}</span>`).join('');const fit=e.imageFit==='contain'?' is-contain':'';const img=e.image?`<div class="upcoming-card-thumb${fit}"><img src="${esc(e.image)}" alt="${esc(e.subtitle||e.title)}" loading="eager" decoding="async"><span class="upcoming-card-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</span></div>`:'';return `<article class="upcoming-event-card">${img}<div class="upcoming-card-content"><div class="upcoming-card-date">${eventDateLabel(e)}${e.time?' · '+esc(e.time):''}</div><h3>${esc(e.title)}</h3>${e.subtitle?`<div class="upcoming-card-subtitle">${esc(e.subtitle)}</div>`:''}<div class="upcoming-card-meta">${e.location?esc(e.location):''}</div>${tags?`<div class="upcoming-card-tags">${tags}</div>`:''}${e.description?`<div class="upcoming-card-description">${esc(e.description)}</div>`:''}${e.url?`<a class="upcoming-card-link" href="${esc(e.url)}"${ext}>查看詳情／報名 →</a>`:''}</div></article>`}).join('')}</div>`:'<div class="schedule-empty">目前尚無公開行程。新的演出、工作坊與交流活動確認後會更新於此。</div>';} draw();}

document.addEventListener('DOMContentLoaded',()=>{setupNav();setupHero();setupReveal();setupBrokenImages();setupPersonDialogs();setupCounters();setupBackstageCarousel();setupImageProtection();setupBackToTop();renderHomeEvents();renderSchedule();});
