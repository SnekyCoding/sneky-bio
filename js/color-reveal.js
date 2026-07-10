// ---------- color-on-scroll for photos (mobile only) ----------
// Desktop keeps the existing hover-to-color effect (see sections.css).
// On mobile there's no hover, so instead we color the photo in when it
// passes through the center band of the screen while scrolling.
(function(){
    const targets = [
        document.querySelector('.avatar-frame'),
        ...document.querySelectorAll('.card')
    ].filter(Boolean);
    if(!targets.length) return;
    
    const mq = window.matchMedia('(max-width:860px)');
    let observer = null;
    
    function enable(){
        if(observer) return;
        observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
        }, {
        // only counts as "in view" while inside the middle band of the screen
        rootMargin: '-32% 0px -32% 0px',
        threshold: 0
        });
        targets.forEach(t => observer.observe(t));
    }
    
    function disable(){
        if(!observer) return;
        observer.disconnect();
        observer = null;
        targets.forEach(t => t.classList.remove('in-view'));
    }
    
    function sync(){
        if(mq.matches){ enable(); } else { disable(); }
    }
    
    mq.addEventListener('change', sync);
    sync();
})();