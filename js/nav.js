// ---------- active nav link on scroll ----------
(function(){
    const sections = ['home','about','work','contact'].map(id => document.getElementById(id));
    const navLinks = document.querySelectorAll('.nav a, .nav-mobile a');
    if(!navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if(entry.isIntersecting){
            const key = entry.target.id;
            navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.key === key);
            });
        }
        });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-10% 0px -40% 0px' });

    sections.forEach(s => s && observer.observe(s));
})();