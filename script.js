const EVENT_CATEGORY = {performance:'演出', workshop:'工作坊', exchange:'交流', other:'其他'};

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function parseDate(s){const [y,m,d]=(s||'').split('-').map(Number); return y&&m&&d ? new Date(y,m-1,d) : null;}
function dateLabel(s){const d=parseDate(s); if(!d)return ''; return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;}
function todayStart(){const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),n.getDate());}
function externalLink(url=''){return /^https?:\/\//i.test(url);}
async function loadEvents(){try{const r=await fetch('data/events.json',{cache:'no-store'}); if(!r.ok)throw new Error('events'); const j=await r.json(); return Array.isArray(j)?j.filter(e=>e.published!==false):[];}catch(e){return [];}}

function setupNav(){const b=document.querySelector('.menu-btn'), n=document.querySelector('.nav-links'); if(!b||!n)return; b.addEventListener('click',()=>{const open=n.classList.toggle('open'); b.setAttribute('aria-expanded',String(open));}); n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));}
function setupHero(){const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.dot')]; if(!slides.length)return; let i=0,t; const show=x=>{i=(x+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));}; const restart=()=>{clearInterval(t);t=setInterval(()=>show(i+1),6500)}; dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);restart();})); show(0); if(!matchMedia('(prefers-reduced-motion: reduce)').matches)restart();}
function setupReveal(){const els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('visible'));return;} const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>o.observe(e));}
function setupBrokenImages(){document.querySelectorAll('.person-photo img,.bio-photo img').forEach(img=>img.addEventListener('error',()=>img.classList.add('is-broken')));}
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

function setupBackToTop(){
  const b=document.createElement('button');
  b.type='button'; b.className='back-to-top'; b.setAttribute('aria-label','回到頁面頂端'); b.setAttribute('title','回到頂端'); b.textContent='↑';
  document.body.appendChild(b);
  const sync=()=>b.classList.toggle('is-visible',window.scrollY>700);
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  window.addEventListener('scroll',sync,{passive:true}); sync();
}

async function renderHomeEvents(){const host=document.querySelector('[data-home-events]'); if(!host)return; const ev=(await loadEvents()).filter(e=>parseDate(e.date)>=todayStart()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3); if(!ev.length){host.innerHTML='<div class="schedule-empty">近期公開行程整理中。活動確認後會第一時間更新在這裡。</div>';return;} host.innerHTML=ev.map(e=>{const url=e.url||'schedule.html';const ext=externalLink(url)?' target="_blank" rel="noopener"':'';const tags=(Array.isArray(e.tags)?e.tags:[]).map(tag=>`<span>${esc(tag)}</span>`).join('');const img=e.image?`<img src="${esc(e.image)}" alt="${esc(e.title)}" loading="lazy"/>`:'';return `<a class="home-event-card" href="${esc(url)}"${ext}><div class="home-event-thumb">${img}<div class="home-event-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</div></div><div class="home-event-body"><div class="home-event-date">${dateLabel(e.date)}${e.time?' · '+esc(e.time):''}</div><div class="home-event-title">${esc(e.title)}</div><div class="home-event-meta">${e.location?esc(e.location):''}</div>${tags?`<div class="home-event-tags">${tags}</div>`:''}</div></a>`}).join('');}

let calCursor=new Date();
async function renderSchedule(){const root=document.querySelector('[data-calendar]'); if(!root)return; const events=(await loadEvents()).sort((a,b)=>a.date.localeCompare(b.date)); const monthTitle=document.querySelector('[data-month-title]'); const grid=document.querySelector('[data-calendar-grid]'); const list=document.querySelector('[data-upcoming-list]');
  function draw(){const y=calCursor.getFullYear(),m=calCursor.getMonth(); monthTitle.textContent=`${y} 年 ${m+1} 月`; const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()); let html=['日','一','二','三','四','五','六'].map(w=>`<div class="weekday">${w}</div>`).join(''); for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const dayEv=events.filter(e=>e.date===ds);html+=`<div class="day ${d.getMonth()!==m?'muted':''}"><div class="day-num">${d.getDate()}</div>${dayEv.map(e=>`<a class="cal-event" href="${esc(e.url||'#')}">${esc(e.title)}<span>${esc(e.time||'')}${e.location?' · '+esc(e.location):''}</span></a>`).join('')}</div>`;}grid.innerHTML=html;}
  document.querySelector('[data-prev-month]').addEventListener('click',()=>{calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()-1,1);draw()});document.querySelector('[data-next-month]').addEventListener('click',()=>{calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()+1,1);draw()});
  const upcoming=events.filter(e=>parseDate(e.date)>=todayStart()); list.innerHTML=upcoming.length?upcoming.map(e=>{const ext=externalLink(e.url||'')?' target="_blank" rel="noopener"':'';return `<div class="event-row event-row-detail"><div class="event-date">${dateLabel(e.date)}</div><div><div class="event-title">${esc(e.title)}</div><div class="event-meta">${esc(EVENT_CATEGORY[e.category]||'活動')}${e.time?' · '+esc(e.time):''}${e.location?' · '+esc(e.location):''}</div>${e.description?`<div class="event-description">${esc(e.description)}</div>`:''}</div><div class="arrow">${e.url?`<a href="${esc(e.url)}"${ext}>詳情 →</a>`:''}</div></div>`}).join(''):'<div class="schedule-empty">目前尚無公開行程。新的演出、工作坊與交流活動確認後會更新於此。</div>'; draw();}

document.addEventListener('DOMContentLoaded',()=>{setupNav();setupHero();setupReveal();setupBrokenImages();setupPersonDialogs();setupCounters();setupBackToTop();renderHomeEvents();renderSchedule();});
