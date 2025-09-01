document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle und andere bestehende Funktionen bleiben unverändert
  
  // Stickman Animation Setup
  const stickmanContainer = document.getElementById('stickman-container');
  const numStickmans = window.innerWidth < 768 ? 20 : 30;
  const colors = ['text-red-400', 'text-green-400']; // Nur rot und grün
  
  // Strichmännchen generieren
  for (let i = 0; i < numStickmans; i++) {
    const stickman = document.createElement('div');
    stickman.classList.add('stickman-wrapper', 'absolute', 'transition-none'); // keine CSS transitions, GSAP übernimmt
    
    stickman.innerHTML = `
      <svg class="stickman w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="5" r="4"/>
        <line x1="12" y1="9" x2="12" y2="15"/>
        <line x1="12" y1="15" x2="8" y2="20"/>
        <line x1="12" y1="15" x2="16" y2="20"/>
        <line x1="12" y1="11" x2="7" y2="12"/>
        <line x1="12" y1="11" x2="17" y2="12"/>
      </svg>
    `;
    
    // Zufällige Farbe
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    stickman.querySelector('svg').classList.add(colorClass);
    
    // Zufällige Startposition (mit Abstand zum Funnel)
    const x = Math.random() * 80 + 10; // 10% bis 90%
    const y = Math.random() * 40 + 5;  // 5% bis 45% (oberhalb des Funnels)
    
    // Startposition und feste Zielposition speichern
    stickman.dataset.startX = x;
    stickman.dataset.startY = y;
    stickman.dataset.targetX = 48 + (Math.random() - 0.5) * 6; // Feste Zielposition für jeden Stickman
    stickman.dataset.targetY = 85;
    
    gsap.set(stickman, {
      left: `${x}%`,
      top: `${y}%`,
      scale: 1,
      opacity: 1,
      zIndex: 10
    });
    
    stickmanContainer.appendChild(stickman);
  }

  // GSAP Animation Setup
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const stickmans = document.querySelectorAll('.stickman-wrapper');
    
    // Haupt-Animation für alle Strichmännchen
    ScrollTrigger.create({
      trigger: '.section-glow',
      start: 'top top',
      end: 'bottom top',
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        const progress = self.progress;
        
        stickmans.forEach((stickman, index) => {
          const startX = parseFloat(stickman.dataset.startX);
          const startY = parseFloat(stickman.dataset.startY);
          const targetX = parseFloat(stickman.dataset.targetX);
          const targetY = parseFloat(stickman.dataset.targetY);
          
          // Interpolation basierend auf Scroll-Progress
          const currentX = startX + (targetX - startX) * progress;
          const currentY = startY + (targetY - startY) * progress;
          
          // Keine Skalierung - bleiben in Originalgröße
          const scale = 1;
          
          // Sichtbarkeit: Verschwinden erst ganz am Ende (hinter Funnel)
          const opacity = progress > 0.9 ? 0 : 1;
          
          // Z-Index: Hinter Funnel bei hohem Progress
          const zIndex = progress > 0.7 ? 5 : 10;
          
          // GSAP für smooth Animation
          gsap.set(stickman, {
            left: `${currentX}%`,
            top: `${currentY}%`,
            scale: scale,
            opacity: opacity,
            zIndex: zIndex
          });
        });
      }
    });

    // Outgoing Stickman Animation (bereinigt)
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.classList.add('relative');
      
      // Alte Versionen entfernen
      document.querySelectorAll('#outgoing-stickman').forEach(el => el.remove());
      
      // Neuen Outgoing Stickman erstellen
      const outgoingStickman = document.createElement('div');
      outgoingStickman.id = 'outgoing-stickman';
      outgoingStickman.className = 'absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none';
      outgoingStickman.innerHTML = `
        <svg class="w-16 h-16 md:w-24 md:h-24 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="4"/>
          <line x1="12" y1="9" x2="12" y2="15"/>
          <line x1="12" y1="15" x2="8" y2="20"/>
          <line x1="12" y1="15" x2="16" y2="20"/>
          <line x1="12" y1="11" x2="7" y2="12"/>
          <line x1="12" y1="11" x2="17" y2="12"/>
        </svg>
      `;
      
      workSection.prepend(outgoingStickman);
      
      // Animation für den ausgehenden Stickman
      gsap.fromTo(outgoingStickman, 
        {
          y: -100,
          opacity: 0,
          scale: 0.5
        },
        {
          y: 50,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: '#work',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Lottie Preloader Logic (unverändert)
  (function(){
    var pre = document.getElementById('preloader');
    var player = document.getElementById('lottieAnim');
    var finished = false;

    function dismiss(){
      pre.classList.add('-translate-y-full','opacity-0');
      pre.addEventListener('transitionend', function(){ pre.style.display = 'none'; }, { once:true });
    }

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced){ dismiss(); return; }

    function ensurePlay(){ try{ if(player && player.play) player.play(); }catch(_){} }

    player?.addEventListener('complete', function(){ finished = true; dismiss(); });
    player?.addEventListener('error', function(){ if(!finished) setTimeout(dismiss, 200); });
    player?.addEventListener('loaded', function(){ 
      setTimeout(ensurePlay, 50);
    });

    setTimeout(function(){ if(!finished) dismiss(); }, 2500);
    window.addEventListener('load', ensurePlay);
  })();
});