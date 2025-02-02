document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('#hero');
    const body = document.body;

    // Toggle mobile menu
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            mobileMenu?.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Set up IntersectionObserver for navbar visibility
    const options = {
        root: document.querySelector('.container'),
        rootMargin: '-10% 0px 0px 0px', // Start transition slightly before leaving hero
        threshold: 0
    };

    const navbarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // User has scrolled past hero section
                navbar?.classList.add('visible');
                navbar?.classList.add('scroll-up');
                navbar?.classList.remove('scroll-down');
            } else {
                // User is in hero section
                navbar?.classList.remove('visible');
                navbar?.classList.remove('scroll-up');
                navbar?.classList.remove('scroll-down');
            }
        });
    }, options);

    // Start observing hero section
    if (hero) {
        navbarObserver.observe(hero);
    }
}); 