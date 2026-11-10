
(function(){
  function normalize(s){ return (s || '').replace(/\s+/g,'').toLowerCase(); }
  var cards = Array.from(document.querySelectorAll('article, .card, .member, .team-member, .person, li, section'));
  var target = cards.find(function(el){
    var t = normalize(el.innerText);
    return t.includes('易芊') || t.includes('cianyi');
  });
  if(!target) return;
  var img = target.querySelector('img');
  if(!img) return;
  img.src = 'assets/images/cian-yi.webp';
  img.srcset = '';
  img.alt = '易芊 Cian Yi';
  img.style.objectPosition = 'center top';
})();
