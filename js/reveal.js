// ---------- reveal on scroll ----------
(function(){
    const revealEls = document.querySelectorAll('.reveal');
    if(!revealEls.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
})();