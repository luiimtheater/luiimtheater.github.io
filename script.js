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
function setupHero(){const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.dot')];if(!slides.length)return;let i=0,t;const ensure=x=>{const img=slides[x]?.querySelector('img[data-src]');if(img){img.src=img.dataset.src;img.removeAttribute('data-src');}};const show=x=>{i=(x+slides.length)%slides.length;ensure(i);slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));};const restart=()=>{clearInterval(t);t=setInterval(()=>show(i+1),6500)};dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);restart();}));show(0);const preloadRest=()=>setTimeout(()=>slides.forEach((_,k)=>k!==0&&ensure(k)),1400);if(document.readyState==='complete')preloadRest();else window.addEventListener('load',preloadRest,{once:true});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)restart();}
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


function shortPlace(location=''){
  let s=String(location||'').split('｜')[0].trim();
  s=s.replace(/^新北市/,'').replace(/^臺北市/,'').replace(/^台北市/,'').replace(/^宜蘭縣/,'');
  s=s.replace(/(區|鄉|鎮|市)$/,'');
  return s||String(location||'').split('｜')[0].trim();
}

async function renderCurrentSeries(){
  const hosts=[...document.querySelectorAll('[data-current-series]')];
  if(!hosts.length)return;

  const allEvents=(await loadEvents()).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
  const upcoming=allEvents.filter(e=>eventEnd(e)>=todayStart());
  if(!upcoming.length){
    hosts.forEach(host=>{
      const section=host.closest('[data-current-series-section]');
      if(section)section.hidden=true;
    });
    return;
  }

  const first=upcoming[0];
  const group=first.series ? allEvents.filter(e=>e.series===first.series) : [first];
  const isSchoolTour=first.series==='zuohuo-spring-school-tour-2026';

  let body='';
  if(isSchoolTour){
    const dateGroups=new Map();
    group.forEach(e=>{
      if(!dateGroups.has(e.date))dateGroups.set(e.date,[]);
      dateGroups.get(e.date).push(e);
    });
    body=`<div class="current-series-tour-list">${[...dateGroups.entries()].map(([date,items])=>{
      const d=parseDate(date);
      const label=d?`${d.getMonth()+1}/${d.getDate()}`:date;
      const completed=eventEnd(items[items.length-1])<todayStart();
      const stops=[...items].sort((a,b)=>(a.time||'').localeCompare(b.time||'')).map(e=>{
        const school=e.description||e.title.replace(/^.*?｜/,'');
        return `<div class="current-series-stop"><span class="current-series-stop-time">${esc(e.time||'')}</span><span class="current-series-stop-school">${esc(school)}</span></div>`;
      }).join('');
      return `<div class="current-series-date-group${completed?' is-complete':''}">
        <div class="current-series-date-label">${esc(label)}${completed?'<small>已完成</small>':''}</div>
        <div class="current-series-stops">${stops}</div>
      </div>`;
    }).join('')}</div>`;
  }else{
    const dateGroups=new Map();
    group.forEach(e=>{
      if(!dateGroups.has(e.date))dateGroups.set(e.date,[]);
      dateGroups.get(e.date).push(e);
    });
    body=`<div class="current-series-dates">${[...dateGroups.entries()].map(([date,items])=>{
      const d=parseDate(date);
      const label=d?`${d.getMonth()+1}/${d.getDate()}`:date;
      const places=[...new Set(items.map(e=>shortPlace(e.location)).filter(Boolean))];
      return `<span>${esc(label)}${places.length?' '+esc(places.join('・')):''}</span>`;
    }).join('<span class="current-series-sep" aria-hidden="true">｜</span>')}</div>`;
  }

  const title=isSchoolTour?'《做伙揣春天》校園巡迴':first.title;
  const eyebrow=isSchoolTour?'School Tour · 2026':'Now On';
  const lead=isSchoolTour
    ?'10–12月｜新北・宜蘭校園巡演，全臺語布袋戲把童謠與掌中戲帶進校園。'
    :(first.description||'近期活動進行中。');

  const actionUrl=isSchoolTour?'schedule.html':(first.seriesUrl||first.url||'schedule.html');
  const ext=externalLink(actionUrl)?' target="_blank" rel="noopener"':'';
  const actionText=isSchoolTour?'查看行事曆與地圖導航 →':'查看活動詳情 →';

  const html=`<div class="section-head reveal visible"><div><div class="eyebrow">${esc(eyebrow)}</div><h2>正在進行</h2></div><div class="lead">${esc(lead)}</div></div>
  <article class="current-series-card reveal visible">
    <div class="current-series-kicker">${esc(first.badge||EVENT_CATEGORY[first.category]||'活動')}</div>
    <h3>${esc(title)}</h3>
    ${body}
    <a class="current-series-link" href="${esc(actionUrl)}"${ext}>${actionText}</a>
  </article>`;

  hosts.forEach(host=>{host.innerHTML=html;});
}


let calCursor=new Date();
async function renderSchedule(){
  const root=document.querySelector('[data-calendar]');
  if(!root)return;

  const events=(await loadEvents()).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
  const monthTitle=document.querySelector('[data-month-title]');
  const grid=document.querySelector('[data-calendar-grid]');
  const details=document.querySelector('[data-calendar-details]');
  const list=document.querySelector('[data-upcoming-list]');

  const clearSelection=()=>{
    grid.querySelectorAll('.day.is-selected').forEach(el=>el.classList.remove('is-selected'));
  };

  const closeDetails=()=>{
    clearSelection();
    if(details){
      details.hidden=true;
      details.innerHTML='';
    }
  };

  const showDayDetails=(dateStr,dayEvents,trigger)=>{
    if(!details||!dayEvents.length)return;
    const sorted=[...dayEvents].sort((a,b)=>(a.time||'').localeCompare(b.time||''));
    const dateObj=parseDate(dateStr);
    const dateText=dateObj?`${dateObj.getFullYear()} 年 ${dateObj.getMonth()+1} 月 ${dateObj.getDate()} 日`:`${dateStr}`;

    const cards=sorted.map(e=>{
      const location=e.location?`<div class="calendar-inline-meta"><span>地點</span><strong>${esc(e.location)}</strong></div>`:'';
      const description=e.description?`<p class="calendar-inline-description">${esc(e.description)}</p>`:'';
      const fit=e.imageFit==='contain'?' is-contain':'';
      const image=e.image?`<figure class="calendar-inline-banner${fit}"><img src="${esc(e.image)}" alt="${esc(e.subtitle||e.title)}" loading="lazy" decoding="async"></figure>`:'';
      const mapLink=e.mapUrl?`<a class="calendar-inline-link map" href="${esc(e.mapUrl)}" target="_blank" rel="noopener">Google Maps 導航 ↗</a>`:'';
      const ext=externalLink(e.url||'')?' target="_blank" rel="noopener"':'';
      const detailLink=e.url?`<a class="calendar-inline-link" href="${esc(e.url)}"${ext}>查看詳情／報名 →</a>`:'';
      const actions=(mapLink||detailLink)?`<div class="calendar-inline-actions">${mapLink}${detailLink}</div>`:'';
      return `<article class="calendar-inline-card">
        <div class="calendar-inline-card-head">
          <span class="calendar-inline-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</span>
          ${e.time?`<span class="calendar-inline-time">${esc(e.time)}</span>`:''}
        </div>
        ${image}
        <h3>${esc(e.title)}</h3>
        ${location}
        ${description}
        ${actions}
      </article>`;
    }).join('');

    clearSelection();
    if(trigger)trigger.classList.add('is-selected');
    details.innerHTML=`<div class="calendar-inline-head">
      <div><div class="eyebrow">Day Schedule</div><h3>${esc(dateText)}・${sorted.length} 場</h3></div>
      <button class="calendar-inline-close" type="button" aria-label="收合當日活動">收合 ×</button>
    </div>
    <div class="calendar-inline-list">${cards}</div>`;
    details.hidden=false;

    const closeBtn=details.querySelector('.calendar-inline-close');
    if(closeBtn)closeBtn.addEventListener('click',closeDetails,{once:true});
  };

  function draw(){
    closeDetails();
    const y=calCursor.getFullYear(),m=calCursor.getMonth();
    monthTitle.textContent=`${y} 年 ${m+1} 月`;
    const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());
    let html=['日','一','二','三','四','五','六'].map(w=>`<div class="weekday">${w}</div>`).join('');

    for(let i=0;i<42;i++){
      const d=new Date(start);
      d.setDate(start.getDate()+i);
      const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayEv=events.filter(e=>dateInEvent(ds,e));
      const dayClass=`day ${d.getMonth()!==m?'muted ':''}${dayEv.length?'has-events':''}`.trim();
      const attrs=dayEv.length?` aria-label="${d.getMonth()+1}月${d.getDate()}日，共${dayEv.length}場活動" tabindex="0" role="button"`:'';

      html+=`<div class="${dayClass}" data-date="${ds}"${attrs}>
        <div class="day-num">${d.getDate()}</div>
        ${dayEv.map(e=>`<span class="cal-event" aria-hidden="true">${esc(e.title)}<span>${esc(e.time||'')}${e.location?' · '+esc(e.location.split('｜')[0]):''}</span></span>`).join('')}
      </div>`;
    }
    grid.innerHTML=html;
  }

  const openDayFromCell=cell=>{
    if(!cell||!cell.dataset.date)return;
    const dayEvents=events.filter(item=>dateInEvent(cell.dataset.date,item));
    if(!dayEvents.length)return;
    showDayDetails(cell.dataset.date,dayEvents,cell);
  };

  grid.addEventListener('click',e=>{
    const cell=e.target.closest('.day.has-events');
    if(!cell)return;
    e.preventDefault();
    openDayFromCell(cell);
  });

  grid.addEventListener('keydown',e=>{
    if(!['Enter',' '].includes(e.key))return;
    const cell=e.target.closest('.day.has-events');
    if(!cell)return;
    e.preventDefault();
    openDayFromCell(cell);
  });

  document.querySelector('[data-prev-month]').addEventListener('click',()=>{
    calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()-1,1);
    draw();
  });
  document.querySelector('[data-next-month]').addEventListener('click',()=>{
    calCursor=new Date(calCursor.getFullYear(),calCursor.getMonth()+1,1);
    draw();
  });

  if(list){
    const upcoming=events.filter(e=>eventEnd(e)>=todayStart());
    list.innerHTML=upcoming.length?`<div class="upcoming-card-list">${upcoming.map(e=>{
      const ext=externalLink(e.url||'')?' target="_blank" rel="noopener"':'';
      const tags=(Array.isArray(e.tags)?e.tags:[]).map(tag=>`<span>${esc(tag)}</span>`).join('');
      const fit=e.imageFit==='contain'?' is-contain':'';
      const img=e.image?`<div class="upcoming-card-thumb${fit}"><img src="${esc(e.image)}" alt="${esc(e.subtitle||e.title)}" loading="lazy" decoding="async"><span class="upcoming-card-badge">${esc(e.badge||EVENT_CATEGORY[e.category]||'活動')}</span></div>`:'';
      return `<article class="upcoming-event-card">${img}<div class="upcoming-card-content"><div class="upcoming-card-date">${eventDateLabel(e)}${e.time?' · '+esc(e.time):''}</div><h3>${esc(e.title)}</h3>${e.subtitle?`<div class="upcoming-card-subtitle">${esc(e.subtitle)}</div>`:''}<div class="upcoming-card-meta">${e.location?esc(e.location):''}</div>${tags?`<div class="upcoming-card-tags">${tags}</div>`:''}${e.description?`<div class="upcoming-card-description">${esc(e.description)}</div>`:''}${e.url?`<a class="upcoming-card-link" href="${esc(e.url)}"${ext}>查看詳情／報名 →</a>`:''}</div></article>`;
    }).join('')}</div>`:'<div class="schedule-empty">目前尚無公開行程。新的演出、工作坊與交流活動確認後會更新於此。</div>';
  }

  draw();
}


function setupProductionGalleries(){
  const tracks=[...document.querySelectorAll('.production-stills-section .production-stills')];
  if(!tracks.length)return;

  let lightbox=document.querySelector('[data-production-lightbox]');
  if(!lightbox){
    lightbox=document.createElement('div');
    lightbox.className='production-lightbox';
    lightbox.setAttribute('data-production-lightbox','');
    lightbox.setAttribute('aria-hidden','true');
    lightbox.innerHTML='<button class="production-lightbox-close" type="button" aria-label="關閉劇照">×</button><button class="production-lightbox-nav prev" type="button" aria-label="上一張劇照">←</button><div class="production-lightbox-stage"><img alt=""></div><button class="production-lightbox-nav next" type="button" aria-label="下一張劇照">→</button><div class="production-lightbox-counter" aria-live="polite"></div>';
    document.body.appendChild(lightbox);
  }
  const lbImg=lightbox.querySelector('img');
  const lbCounter=lightbox.querySelector('.production-lightbox-counter');
  let lbImages=[],lbIndex=0,lastTrigger=null;
  const renderLightbox=()=>{
    const img=lbImages[lbIndex]; if(!img)return;
    lbImg.src=img.currentSrc||img.src; lbImg.alt=img.alt||'演出劇照';
    lbCounter.textContent=`${lbIndex+1} / ${lbImages.length}`;
  };
  const openLightbox=(images,index,trigger)=>{lbImages=images;lbIndex=index;lastTrigger=trigger;renderLightbox();lightbox.classList.add('is-open');lightbox.setAttribute('aria-hidden','false');lightbox.querySelector('.production-lightbox-close').focus({preventScroll:true});};
  const closeLightbox=()=>{lightbox.classList.remove('is-open');lightbox.setAttribute('aria-hidden','true');lbImg.removeAttribute('src');if(lastTrigger)lastTrigger.focus({preventScroll:true});};
  const shiftLightbox=(dir)=>{if(!lbImages.length)return;lbIndex=(lbIndex+dir+lbImages.length)%lbImages.length;renderLightbox();};
  lightbox.querySelector('.production-lightbox-close').addEventListener('click',closeLightbox);
  lightbox.querySelector('.production-lightbox-nav.prev').addEventListener('click',()=>shiftLightbox(-1));
  lightbox.querySelector('.production-lightbox-nav.next').addEventListener('click',()=>shiftLightbox(1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('is-open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')shiftLightbox(-1);if(e.key==='ArrowRight')shiftLightbox(1);});

  tracks.forEach(track=>{
    if(track.dataset.galleryReady==='1')return;
    track.dataset.galleryReady='1';
    track.classList.add('production-stills-carousel');
    const figures=[...track.querySelectorAll('figure')];
    const images=figures.map(f=>f.querySelector('img')).filter(Boolean);
    if(!images.length)return;

    const shell=document.createElement('div');
    shell.className='production-gallery-shell';
    track.parentNode.insertBefore(shell,track); shell.appendChild(track);
    const prev=document.createElement('button');prev.type='button';prev.className='production-gallery-arrow prev';prev.setAttribute('aria-label','上一張劇照');prev.textContent='←';
    const next=document.createElement('button');next.type='button';next.className='production-gallery-arrow next';next.setAttribute('aria-label','下一張劇照');next.textContent='→';
    shell.append(prev,next);
    const dots=document.createElement('div');dots.className='production-gallery-dots';dots.setAttribute('aria-label','劇照頁次');shell.after(dots);
    figures.forEach((fig,i)=>{
      const dot=document.createElement('button');dot.type='button';dot.className='production-gallery-dot';dot.setAttribute('aria-label',`查看第 ${i+1} 張劇照`);dots.appendChild(dot);
      dot.addEventListener('click',()=>fig.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}));
      const img=images[i]; if(img){img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`${img.alt||'演出劇照'}，點擊放大`);img.addEventListener('click',()=>openLightbox(images,i,img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(images,i,img);}});}
    });
    const dotEls=[...dots.children];
    let active=0,raf=0;
    const update=()=>{raf=0;const center=track.scrollLeft+track.clientWidth/2;let best=0,dist=Infinity;figures.forEach((fig,i)=>{const c=fig.offsetLeft+fig.offsetWidth/2;const d=Math.abs(c-center);if(d<dist){dist=d;best=i;}});active=best;dotEls.forEach((d,i)=>d.classList.toggle('is-active',i===active));prev.disabled=active===0;next.disabled=active===figures.length-1;};
    const go=dir=>{const idx=Math.max(0,Math.min(figures.length-1,active+dir));figures[idx].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});};
    prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
    track.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update);},{passive:true});
    window.addEventListener('resize',update,{passive:true});
    update();
  });
}


/* v29.17 — 觀眾請戲單 / public request-show counter */
const REQUEST_SHOW_API='https://countapi.mileshilliard.com/api/v1';
const REQUEST_SHOW_PREFIX='luiimtheater_request_show_2026_v3_';
const requestShowMemory=new Set();

function requestShowStorageKey(id){return `luiimtheater_request_show_v3_${id}`;}
function requestShowCounterKey(id){return `${REQUEST_SHOW_PREFIX}${id}`;}

function hasRequestedShow(id){
  try{return localStorage.getItem(requestShowStorageKey(id))==='1';}
  catch(_){return requestShowMemory.has(id);}
}
function markRequestedShow(id){
  try{localStorage.setItem(requestShowStorageKey(id),'1');}
  catch(_){requestShowMemory.add(id);}
}
function requestShowValue(data){
  const n=Number(data&&data.value);
  return Number.isFinite(n)&&n>=0?Math.round(n):0;
}
async function requestShowFetch(kind,id){
  const key=encodeURIComponent(requestShowCounterKey(id));
  const res=await fetch(`${REQUEST_SHOW_API}/${kind}/${key}`,{cache:'no-store',headers:{'Accept':'application/json'}});
  if(kind==='get'&&res.status===404)return 0;
  if(!res.ok)throw new Error(`Counter API ${res.status}`);
  return requestShowValue(await res.json());
}
function requestShowRender(panel,count,voted){
  const button=panel.querySelector('[data-request-show-button]');
  const countEl=panel.querySelector('[data-request-show-count]');
  const state=panel.querySelector('[data-request-show-state]');
  const slip=panel.querySelector('[data-request-show-slip]');
  if(countEl&&Number.isFinite(count))countEl.textContent=count.toLocaleString('zh-TW');
  if(button){
    button.disabled=!!voted;
    button.classList.toggle('is-requested',!!voted);
    button.textContent=voted?'✓ 已送出':'送出請戲單';
  }
  if(slip)slip.classList.toggle('is-submitted',!!voted);
  if(state)state.textContent=voted?'請戲單已送出':'';
}
async function setupRequestShow(){
  const panels=[...document.querySelectorAll('[data-request-show]')];
  if(!panels.length)return;

  panels.forEach(async panel=>{
    const id=panel.dataset.workId||'';
    const title=panel.dataset.workTitle||document.title;
    const button=panel.querySelector('[data-request-show-button]');
    const countEl=panel.querySelector('[data-request-show-count]');
    const state=panel.querySelector('[data-request-show-state]');
    if(!id||!button)return;

    const voted=hasRequestedShow(id);
    if(voted)requestShowRender(panel,NaN,true);

    try{
      const count=await requestShowFetch('get',id);
      requestShowRender(panel,count,voted);
    }catch(_){
      if(countEl)countEl.textContent='0';
    }

    button.addEventListener('click',async()=>{
      if(hasRequestedShow(id)){
        requestShowRender(panel,NaN,true);
        return;
      }
      const slip=panel.querySelector('[data-request-show-slip]');
      button.disabled=true;
      button.textContent='送出中…';
      if(state)state.textContent='';
      if(slip)slip.classList.add('is-sending');

      try{
        const count=await requestShowFetch('hit',id);
        markRequestedShow(id);
        if(slip){
          slip.classList.remove('is-sending');
          slip.classList.add('is-stamping');
          setTimeout(()=>slip.classList.remove('is-stamping'),650);
        }
        requestShowRender(panel,count,true);

        if(typeof window.gtag==='function'){
          window.gtag('event','request_show',{
            work_id:id,
            work_title:title,
            event_category:'engagement'
          });
        }
      }catch(_){
        if(slip)slip.classList.remove('is-sending');
        button.disabled=false;
        button.textContent='再試一次';
        if(state)state.textContent='送出未完成，請再試一次';
      }
    });
  });
}


document.addEventListener('DOMContentLoaded',()=>{setupNav();setupHero();setupReveal();setupBrokenImages();setupPersonDialogs();setupCounters();setupBackstageCarousel();setupProductionGalleries();setupImageProtection();setupBackToTop();setupRequestShow();renderCurrentSeries();renderHomeEvents();renderSchedule();});
