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
        root: null, // Use the viewport instead of container
        rootMargin: '-20% 0px 0px 0px', // Adjust threshold for better mobile experience
        threshold: [0, 0.1, 0.2] // Multiple thresholds for smoother transitions
    };

    const navbarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // User has scrolled past hero section
                navbar?.classList.add('visible');
            } else {
                // User is in hero section
                navbar?.classList.remove('visible');
            }
        });
    }, options);

    // Start observing hero section
    if (hero) {
        navbarObserver.observe(hero);
    }
}); 