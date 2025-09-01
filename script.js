document.addEventListener('DOMContentLoaded', () => {
  const stickmanContainer = document.getElementById('stickman-container');
  const numStickmans = window.innerWidth < 768 ? 30 : 30;
  const colors = ['text-red-400', 'text-green-400'];

  for (let i = 0; i < numStickmans; i++) {
    const stickman = document.createElement('div');
    stickman.classList.add('absolute', 'transition-all', 'duration-1000', 'ease-in-out', 'z-10'); // Initial z-10
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
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    stickman.querySelector('svg').classList.add(colorClass);
    
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 50;
    stickman.style.left = `${x}%`;
    stickman.style.top = `${y}%`;
    
    stickmanContainer.appendChild(stickman);
  }

  gsap.registerPlugin(ScrollTrigger);

  const stickmans = document.querySelectorAll('.stickman');
  const funnel = document.getElementById('funnel');

  ScrollTrigger.create({
    trigger: '.section-glow',
    start: 'top top',
    end: 'bottom top',
    scrub: 0, // Sofortige Reaktion
    onUpdate: (self) => {
      const progress = self.progress;
      stickmans.forEach((stickman) => {
        const parent = stickman.parentElement;
        const initialX = parseFloat(parent.style.left);
        const initialY = parseFloat(parent.style.top);
        
        const targetX = 50; // Mitte
        const targetY = 90; // Etwas oberhalb des Funnel-Bodens
        const newX = initialX + (targetX - initialX) * progress;
        const newY = initialY + (targetY - initialY) * progress;
        const scale = 1 - (0.5 * progress);
        const opacity = 1 - progress;
        
        parent.style.left = `${newX}%`;
        parent.style.top = `${newY}%`;
        stickman.style.transform = `scale(${scale})`;
        stickman.style.opacity = opacity;
        
        // Z-Index: Hinter Funnel (z-20) bei progress > 0.8
        parent.style.zIndex = progress > 0.8 ? 0 : 10;
      });
    }
  });

  const workSection = document.getElementById('work');
  const outgoingStickman = document.createElement('div');
  outgoingStickman.classList.add('absolute', 'top-0', 'left-1/2', 'transform', '-translate-x-1/2', 'z-10');
  outgoingStickman.innerHTML = `
    <svg class="stickman w-12 h-12 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="5" r="4"/>
      <line x1="12" y1="9" x2="12" y2="15"/>
      <line x1="12" y1="15" x2="8" y2="20"/>
      <line x1="12" y1="15" x2="16" y2="20"/>
      <line x1="12" y1="11" x2="7" y2="8"/>
      <line x1="12" y1="11" x2="17" y2="8"/>
    </svg>
  `;
  workSection.prepend(outgoingStickman);

  gsap.from(outgoingStickman, {
    y: -100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '#work',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});