// ---------- greeting glitch-cycle ("Привет, путник" -> "разработчик" -> "друг") ----------
(function(){
    const phrases = ["Привет, путник", "Привет, разработчик", "Привет, друг"];
    const greetEl = document.getElementById('greetText');
    if(!greetEl) return;
    let gi = 0;

    function cycleGreeting(){
        greetEl.classList.remove('is-glitching');
        void greetEl.offsetWidth; // restart animation
        greetEl.classList.add('is-glitching');

        setTimeout(() => {
            gi = (gi + 1) % phrases.length;
            greetEl.textContent = phrases[gi];
        }, 190);
        }
        setInterval(cycleGreeting, 3600);

    // occasional bigger ambient glitch flicker on the whole name
        const heroName = document.querySelector('.hero-name');
        if(!heroName) return;

        function ambientGlitch(){
            heroName.style.transition = 'none';
            heroName.style.transform = `translate(${(Math.random()*4-2).toFixed(1)}px,0)`;
            heroName.style.filter = 'contrast(1.4) brightness(1.15)';
            setTimeout(() => {
            heroName.style.transform = 'translate(0,0)';
            heroName.style.filter = 'none';
            }, 90);
            setTimeout(ambientGlitch, 2600 + Math.random()*3200);
        }
        setTimeout(ambientGlitch, 2000);
})();