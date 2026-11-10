
(function(){
  'use strict';
  function norm(s){ return (s || '').replace(/\s+/g,'').toLowerCase(); }

  function findTarget() {
    const selectors = 'article, li, .card, .member, .person, .team-member, section, div';
    const all = Array.from(document.querySelectorAll(selectors));
    return all.find(function(el){
      const t = norm(el.innerText);
      return (t.includes('易芊') || t.includes('cianyi')) && !!el.querySelector('img');
    });
  }

  function run() {
    const target = findTarget();
    if (!target) return;
    const img = target.querySelector('img');
    if (!img) return;
    img.src = 'assets/images/team/cian-yi.webp';
    img.removeAttribute('srcset');
    img.alt = '易芊 Cian Yi';
    img.style.objectPosition = 'center top';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
