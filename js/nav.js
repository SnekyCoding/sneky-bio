// ---------- active nav link on scroll (scrollspy) ----------
(function(){
    const sections = ['home','about','work','contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const navLinks = document.querySelectorAll('.nav a, .nav-mobile a');
    if(!navLinks.length || !sections.length) return;
    
    // "line" near the top of the viewport that counts as the current section
    const OFFSET = 160;
    
    function updateActive(){
        let currentId = sections[0].id;
    
        for(const sec of sections){
        const top = sec.getBoundingClientRect().top;
        if(top - OFFSET <= 0){
            currentId = sec.id;
        }
        }
    
        // if we've scrolled to the very bottom of the page, force the last section active
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if(atBottom){
        currentId = sections[sections.length - 1].id;
        }
    
        navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.key === currentId);
        });
    }
    
    let ticking = false;
    function onScroll(){
        if(!ticking){
        requestAnimationFrame(() => { updateActive(); ticking = false; });
        ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
})();