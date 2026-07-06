
(function(){
 var nav=document.getElementById('nav');
 function onScroll(){ if(window.scrollY>40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
 onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

 var burger=document.getElementById('burger'), links=document.getElementById('navLinks');
 if(burger){
   burger.setAttribute('aria-expanded','false');
   function setMenu(open){
     links.classList.toggle('open',open);
     document.body.classList.toggle('menu-open',open);
     burger.setAttribute('aria-expanded',open?'true':'false');
   }
   burger.addEventListener('click',function(e){ e.stopPropagation(); setMenu(!links.classList.contains('open')); });
   links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
   document.addEventListener('click',function(e){ if(links.classList.contains('open') && !links.contains(e.target)) setMenu(false); });
   document.addEventListener('keydown',function(e){ if(e.key==='Escape' && links.classList.contains('open')){ setMenu(false); burger.focus(); } });
 }

 // reveal (skip animation entirely when the tab is hidden: headless renderers
 // and background tabs pause CSS transitions, so gated content would stay blank)
 function revealAll(){ document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); }
 if(document.visibilityState==='hidden' || !('IntersectionObserver' in window)){
   revealAll();
 } else {
   var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
   document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
 }

 // lightbox
 var imgs=[].slice.call(document.querySelectorAll('[data-lightbox]'));
 if(imgs.length){
   var ov=document.createElement('div'); ov.className='lightbox';
   ov.innerHTML='<button class="lb-close" aria-label="Закрыть">&times;</button><button class="lb-prev" aria-label="Назад">&#8249;</button><img alt=""><button class="lb-next" aria-label="Вперёд">&#8250;</button>';
   document.body.appendChild(ov);
   var lbImg=ov.querySelector('img'), idx=0;
   function show(i){ idx=(i+imgs.length)%imgs.length; lbImg.src=imgs[idx].getAttribute('data-full')||imgs[idx].src; }
   function open(i){ show(i); ov.classList.add('open'); document.body.style.overflow='hidden'; }
   function close(){ ov.classList.remove('open'); document.body.style.overflow=''; }
   imgs.forEach(function(im,i){ im.addEventListener('click',function(){open(i);}); });
   ov.querySelector('.lb-close').addEventListener('click',close);
   ov.querySelector('.lb-next').addEventListener('click',function(){show(idx+1);});
   ov.querySelector('.lb-prev').addEventListener('click',function(){show(idx-1);});
   ov.addEventListener('click',function(e){if(e.target===ov)close();});
   document.addEventListener('keydown',function(e){ if(!ov.classList.contains('open'))return;
     if(e.key==='Escape')close(); if(e.key==='ArrowRight')show(idx+1); if(e.key==='ArrowLeft')show(idx-1); });
 }

 // catalog modal
 var modal=document.getElementById('catalogModal');
 if(modal){
   var curUrl=null, curName='';
   document.querySelectorAll('[data-catalog]').forEach(function(b){
     b.addEventListener('click',function(e){ e.preventDefault();
       curUrl=b.getAttribute('data-catalog'); curName=b.getAttribute('data-factory')||'';
       var title=b.getAttribute('data-catalog-title');
       var label=title ? (curName+' — '+title) : curName;
       document.getElementById('catalogFor').textContent='Каталог: '+label+'. Оставьте контакты — загрузка начнётся автоматически.';
       document.getElementById('catalogOk').hidden=true;
       document.getElementById('catalogForm').reset();
       if(typeof modal.showModal==='function') modal.showModal(); else modal.setAttribute('open','');
     });
   });
   modal.querySelector('.modal-close').addEventListener('click',function(){modal.close&&modal.close();});
   document.getElementById('catalogForm').addEventListener('submit',function(e){
     var btn=e.submitter; if(btn && btn.value==='cancel'){return;}
     e.preventDefault();
     if(!this.checkValidity()){this.reportValidity();return;}
     // trigger download
     if(curUrl){ var a=document.createElement('a'); a.href=curUrl; a.download=''; a.target='_blank';
       document.body.appendChild(a); a.click(); a.remove();
       var d=document.getElementById('catalogDirect'); d.href=curUrl; }
     document.getElementById('catalogOk').hidden=false;
     // NOTE: lead capture — connect a backend/Formspree here to store the contact.
   });
 }

 // contact form -> mailto
 var cf=document.getElementById('contactForm');
 if(cf){ cf.addEventListener('submit',function(e){ e.preventDefault();
   if(!cf.checkValidity()){cf.reportValidity();return;}
   var f=cf.elements;
   var body='Имя: '+f.name.value+'%0D%0AКомпания: '+(f.company.value||'')+'%0D%0AEmail: '+f.email.value+'%0D%0AТелефон: '+(f.phone.value||'')+'%0D%0A%0D%0A'+(f.message.value||'');
   window.location.href='mailto:info@italiarredo.ru?subject='+encodeURIComponent('Заявка с сайта — '+f.name.value)+'&body='+body;
   document.getElementById('contactOk').hidden=false; });
 }
})();
