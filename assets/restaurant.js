/* GSAP: staged entrance, scrubbed room transitions, horizontal filmstrip,
   3D plate reveal, SVG arch drawing and scroll-linked word choreography. */
(() => {
 'use strict';
 const c=window.RESTAURANT, root=document.documentElement;
 document.querySelectorAll('[data-restaurant]').forEach(el=>{const value=c[el.dataset.restaurant];if(value){el.textContent=value;el.hidden=false;}});
 document.title=c.name+' · Свадебный ресторан и банкетный дом';
 document.querySelector('.brand').setAttribute('aria-label',c.name+' — начало страницы');
 const url=value=>{try{const u=new URL(value,location.href);return value&&['https:','http:','file:'].includes(u.protocol)?u.href:null;}catch(_){return null;}};
 document.querySelectorAll('[data-image]').forEach(img=>{const value=url(c.images[img.dataset.image]);if(value)img.src=value;});
 const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)?c.email:'';
 const phone=(c.phone||'').replace(/[^+\d]/g,'');
 const contact=(key,href,text)=>{const a=document.querySelector('[data-contact="'+key+'"]');if(href){a.href=href;if(text)a.textContent=text;a.hidden=false;}};
 contact('phone',phone?'tel:'+phone:null,c.displayPhone||c.phone);
 contact('email',email?'mailto:'+email:null,email);contact('map',url(c.mapUrl));
 if(c.bookingUrl&&url(c.bookingUrl)){const a=document.createElement('a');a.className='line-link';a.href=url(c.bookingUrl);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Онлайн-заявка ↗';document.querySelector('.contact-links').append(a);}
 if(email){document.querySelector('[data-submit-label]').textContent='Подготовить письмо';document.querySelector('[data-form-explanation]').textContent='Откроется почтовое приложение с вашими пожеланиями.';document.querySelector('[data-request-note]').textContent='Подготовим письмо с деталями вашего вечера — останется его отправить.';}
 const form=document.querySelector('.enquiry-form'), status=form.querySelector('.form-status');
 form.addEventListener('submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form),body=[c.name+' — пожелания к вечеру','', 'Имя: '+data.get('name'),'Дата: '+data.get('date'),'Гостей: '+data.get('guests'),'Пространство: '+data.get('space'),'','Пожелания:',data.get('message')||'Обсудим лично.'].join('\n');
   if(email){location.href='mailto:'+email+'?subject='+encodeURIComponent('Обсудить свадебный вечер — '+data.get('name'))+'&body='+encodeURIComponent(body);status.textContent='Письмо подготовлено. Отправьте его в вашем почтовом приложении.';}
   else{const blob=new Blob(['\ufeff'+body],{type:'text/plain;charset=utf-8'}),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='maison-wedding-request.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1500);status.textContent='Пожелания сохранены. Возьмите файл с собой на обсуждение площадки.';}
 });
 const dialog=document.querySelector('#site-menu'), menuButton=document.querySelector('.menu-toggle');let menuTween;
 menuButton.addEventListener('click',()=>{dialog.showModal();if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){menuTween?.kill();menuTween=gsap.fromTo(dialog.querySelectorAll('nav a'),{y:35,opacity:0},{y:0,opacity:1,stagger:.08,duration:.7,ease:'power3.out',clearProps:'all'});}});
 const closeMenu=()=>{menuTween?.kill();dialog.close();menuButton.focus({preventScroll:true});};
 dialog.querySelector('.menu-close').addEventListener('click',closeMenu);
 dialog.addEventListener('close',()=>menuButton.focus({preventScroll:true}));
 dialog.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{closeMenu();const target=document.querySelector(a.getAttribute('href'));target.tabIndex=-1;target.focus({preventScroll:true});}));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const largeType=()=>{const large=parseFloat(getComputedStyle(root).fontSize)>20;root.classList.toggle('large-text',large);return large;};
 largeType();
 const nameTitle=document.querySelector('.hero h1');
 const length=Array.from(c.name).length;
 if(length>8){document.querySelector('.brand>span').style.fontSize='min(1.7rem,'+(90/length)+'vw)';document.querySelector('.footer-brand').style.fontSize=(130/length)+'vw';}
 nameTitle.style.fontSize='min('+(length>7?130/length:20.5)+'vw, 24rem)';
 nameTitle.setAttribute('aria-label',c.name);
 nameTitle.replaceChildren(...Array.from(c.name).map(char=>{const s=document.createElement('span');s.className='letter';s.setAttribute('aria-hidden','true');s.textContent=char===' '?'\u00a0':char;return s;}));
 const splitWords=el=>{
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
   for(const node of nodes){const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(text=>{if(!text)return;if(/^\s+$/.test(text))fragment.append(document.createTextNode(text));else{const word=document.createElement('span');word.className='word';word.textContent=text;fragment.append(word);}});node.replaceWith(fragment);}
 };
 document.querySelectorAll('.word-reveal,.evening h2').forEach(splitWords);
 const intro=document.querySelector('.opening'), skip=intro.querySelector('button');let entrance,failSafe;
 const finishIntro=()=>{entrance?.kill();clearTimeout(failSafe);intro.classList.remove('active');intro.setAttribute('aria-hidden','true');skip.tabIndex=-1;if(window.gsap)gsap.set('.hero h1 .letter,.hero-caption,.hero-bottom,.opening-left,.opening-right,.opening-emblem',{clearProps:'all'});};
 const playIntro=()=>{
   finishIntro();if(!window.gsap||reduced.matches)return;
   intro.classList.add('active');intro.removeAttribute('aria-hidden');skip.tabIndex=0;
   const arch=intro.querySelectorAll('svg path');arch.forEach(p=>{const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;});
   entrance=gsap.timeline({defaults:{ease:'power3.inOut'},onComplete:finishIntro});
   entrance.to(arch,{strokeDashoffset:0,duration:1,stagger:.1},0)
    .fromTo('.opening-emblem span',{opacity:0,y:10},{opacity:1,y:0,duration:.55},.35)
    .to('.opening-emblem',{opacity:0,scale:.93,duration:.4},1.1)
    .to('.opening-left',{xPercent:-101,duration:1.15},1.3)
    .to('.opening-right',{xPercent:101,duration:1.15},1.3)
    .fromTo('.hero h1 .letter',{yPercent:115,rotationX:-65,opacity:0},{yPercent:0,rotationX:0,opacity:1,duration:1.2,stagger:.055,ease:'power4.out'},1.65)
    .fromTo('.hero-caption,.hero-bottom',{opacity:0,y:15},{opacity:1,y:0,duration:.8,stagger:.12},2.05);
   failSafe=setTimeout(finishIntro,5000);
 };
 skip.addEventListener('click',()=>{finishIntro();document.querySelector('#main').tabIndex=-1;document.querySelector('#main').focus({preventScroll:true});});
 document.querySelector('[data-replay]').addEventListener('click',()=>{scrollTo({top:0,behavior:'instant'});playIntro();});
 reduced.addEventListener('change',finishIntro);
 const rooms=[...document.querySelectorAll('.room')],roomButtons=[...document.querySelectorAll('[data-room-jump]')];
 let roomTimeline, galleryTween,desktopContext,currentRoom=0,galleryIndex=0;
 const gallery=document.querySelector('.gallery'),windowEl=document.querySelector('.gallery-window'),track=document.querySelector('.gallery-track'),frames=[...track.children];
 const setRoom=i=>{currentRoom=i;roomButtons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));document.querySelector('.room-index b').textContent=String(i+1).padStart(2,'0');if(document.querySelector('.spaces').classList.contains('rooms-pinned'))rooms.forEach((room,j)=>{room.inert=i!==j;room.setAttribute('aria-hidden',String(i!==j));});};
 roomButtons.forEach((b,i)=>b.addEventListener('click',()=>{
   if(roomTimeline){const s=roomTimeline.scrollTrigger,at=[.3,2.9,5.5][i]/roomTimeline.duration();scrollTo({top:s.start+(s.end-s.start)*at,behavior:reduced.matches?'instant':'smooth'});}
   else{setRoom(i);rooms[i].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
 }));
 const galleryStep=i=>{
   galleryIndex=Math.max(0,Math.min(frames.length-1,i));
   if(galleryTween){const s=galleryTween.scrollTrigger,max=track.scrollWidth-windowEl.clientWidth,offset=Math.min(max,frames[galleryIndex].offsetLeft-parseFloat(getComputedStyle(track).paddingLeft));scrollTo({top:s.start+(s.end-s.start)*(offset/max),behavior:reduced.matches?'instant':'smooth'});}
   else{windowEl.scrollTo({left:frames[galleryIndex].offsetLeft-parseFloat(getComputedStyle(track).paddingLeft),behavior:reduced.matches?'instant':'smooth'});}
 };
 document.querySelector('[data-gallery-prev]').addEventListener('click',()=>galleryStep(galleryIndex-1));document.querySelector('[data-gallery-next]').addEventListener('click',()=>galleryStep(galleryIndex+1));
 windowEl.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();galleryStep(e.key==='Home'?0:e.key==='End'?2:galleryIndex+(e.key==='ArrowRight'?1:-1));}});
 windowEl.addEventListener('scroll',()=>{if(galleryTween)return;let nearest=0,distance=Infinity;frames.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft)-windowEl.scrollLeft);if(d<distance){distance=d;nearest=i;}});galleryIndex=nearest;});
 if(window.gsap&&window.ScrollTrigger){
   gsap.registerPlugin(ScrollTrigger);
   // Clean up pinned sequences before GSAP recreates reduced-motion timelines.
   reduced.addEventListener('change',()=>{enableDesktop();ScrollTrigger.refresh();});
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
     gsap.to('.reading-progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
     gsap.to('.hero-photo img',{scale:1.17,yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
     gsap.to('.hero h1',{yPercent:-26,opacity:.15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 15%',scrub:.8}});
     document.querySelectorAll('.hero-architecture path,.house-mark path,.details-arch path').forEach(p=>{const len=p.getTotalLength();gsap.fromTo(p,{strokeDasharray:len,strokeDashoffset:len},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut',scrollTrigger:{trigger:p.closest('svg'),start:'top 88%',toggleActions:'play none none none'}});});
     gsap.fromTo('.word-reveal .word',{opacity:.18,y:16},{opacity:1,y:0,stagger:.13,ease:'none',scrollTrigger:{trigger:'.word-reveal',start:'top 85%',end:'bottom 48%',scrub:.8}});
     gsap.fromTo('.type-ribbon p',{xPercent:8},{xPercent:-28,ease:'none',scrollTrigger:{trigger:'.type-ribbon',start:'top bottom',end:'bottom top',scrub:1}});
     const plate=gsap.timeline({scrollTrigger:{trigger:'.cuisine-visual',start:'top 90%',end:'bottom 45%',scrub:1}});
     plate.fromTo('.plate-frame',{rotationY:-15,rotationZ:7,y:70,clipPath:'inset(18% 18% 18% 18% round 50% 50% 50% 50%)'},{rotationY:0,rotationZ:0,y:0,clipPath:'inset(0% 0% 0% 0% round 48% 48% 2px 2px)',ease:'none',duration:2},0)
      .fromTo('.plate-frame img',{scale:1.35},{scale:1.05,ease:'none',duration:2},0)
      .fromTo('.plate-orbit',{rotation:-45,opacity:0},{rotation:15,opacity:.35,ease:'none',duration:2},0);
     document.querySelectorAll('.menu-story li,.detail-lines article').forEach(el=>{const t=gsap.timeline({scrollTrigger:{trigger:el,start:'top 91%',toggleActions:'play none none none'}});t.from(el,{y:25,opacity:.15,duration:.8,ease:'power3.out'}).from(el.querySelector('h3'),{x:20,opacity:0,duration:.7,ease:'power3.out'},.15);});
     gsap.fromTo('.evening-photo img',{scale:1.22,yPercent:-7},{scale:1,yPercent:7,ease:'none',scrollTrigger:{trigger:'.evening',start:'top bottom',end:'bottom top',scrub:1}});
     gsap.fromTo('.evening h2 .word',{opacity:.12,y:20},{opacity:1,y:0,stagger:.2,ease:'none',scrollTrigger:{trigger:'.evening',start:'top 60%',end:'center 45%',scrub:.8}});
     gsap.from('.contact-head h2,.enquiry-form',{y:35,opacity:0,stagger:.15,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.contact',start:'top 83%',toggleActions:'play none none none'}});
     return()=>{gsap.set('.reading-progress',{scaleX:0});};
   });
   const enableDesktop=()=>{
     desktopContext?.revert();desktopContext=null;roomTimeline=null;galleryTween=null;
     document.querySelector('.spaces').classList.remove('rooms-pinned');gallery.classList.remove('is-filmstrip');
     rooms.forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden');});
     if(innerWidth<1024||innerHeight<700||reduced.matches||largeType())return;
     desktopContext=gsap.context(()=>{
       document.querySelector('.spaces').classList.add('rooms-pinned');gallery.classList.add('is-filmstrip');windowEl.scrollLeft=0;
       gsap.set(rooms.slice(1),{clipPath:'inset(0% 0% 100% 0%)'});gsap.set(rooms,{zIndex:i=>i+1});
       roomTimeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{id:'restaurant-rooms',trigger:'.room-stage',start:'top top',end:()=>'+='+innerHeight*3.6,pin:true,scrub:.85,invalidateOnRefresh:true,anticipatePin:1}});
       roomTimeline.to(rooms[0].querySelector('img'),{scale:1.08,yPercent:-4,duration:2.4},0);
       [1,2].forEach((i)=>{const at=i===1?1.75:3.8;
         roomTimeline.to(rooms[i],{clipPath:'inset(0% 0% 0% 0%)',duration:1.2,ease:'power2.inOut'},at)
          .fromTo(rooms[i].querySelector('img'),{scale:i===2?1.65:1.3,yPercent:6},{scale:i===2?1.45:1.05,yPercent:-3,duration:2.1},at)
          .to(rooms[i-1].querySelector('.room-copy'),{y:-55,opacity:0,duration:.5},at)
          .fromTo(rooms[i].querySelector('.room-copy'),{y:50,opacity:0},{y:0,opacity:1,duration:.65,ease:'power3.out'},at+.65);
       });
       roomTimeline.to({hold:0},{hold:1,duration:.45},5.85);
       roomTimeline.eventCallback('onUpdate',()=>{const time=roomTimeline.time();const i=time<2.4?0:time<4.45?1:2;if(i!==currentRoom)setRoom(i);});setRoom(0);
       const max=()=>Math.max(0,track.scrollWidth-windowEl.clientWidth);
       galleryTween=gsap.timeline({scrollTrigger:{id:'restaurant-gallery',trigger:gallery,start:'top top',end:()=>'+='+max(),pin:true,scrub:.7,invalidateOnRefresh:true,anticipatePin:1,onUpdate:self=>{galleryIndex=Math.min(2,Math.round(self.progress*2));}}});
       galleryTween.to(track,{x:()=>-max(),ease:'none',duration:1},0);
       // Nested camera timelines share one scroll clock and tear down together.
       const cameras=gsap.timeline();
       frames.forEach((f,i)=>cameras.fromTo(f.querySelector('img'),{scale:1.09},{scale:1,ease:'none',duration:.65},i*.175));
       galleryTween.add(cameras,0);
     });
     ScrollTrigger.refresh();
   };
   enableDesktop();
   let timer,lastWidth=innerWidth,lastHeight=innerHeight,lastType=largeType();
   const rebuild=()=>{clearTimeout(timer);timer=setTimeout(()=>{const type=largeType();if(innerWidth!==lastWidth||Math.abs(innerHeight-lastHeight)>100||type!==lastType){lastWidth=innerWidth;lastHeight=innerHeight;lastType=type;enableDesktop();}ScrollTrigger.refresh();},180);};
   addEventListener('resize',rebuild);
   new ResizeObserver(()=>{if(lastType!==largeType())rebuild();}).observe(root);
   document.fonts?.ready.then(()=>ScrollTrigger.refresh());
   // Fixed image boxes keep geometry stable; refreshing on lazy loads would interrupt native smooth scrolling.
   addEventListener('pageshow',e=>{if(e.persisted){finishIntro();ScrollTrigger.refresh();}});
 }
 playIntro();
})();
