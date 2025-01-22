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

    // Handle scroll behavior
    let lastScroll = 0;
    let heroHeight = hero?.offsetHeight || 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Show/hide navbar based on hero section
        if (currentScroll > heroHeight * 0.8) {
            navbar?.classList.add('visible');
        } else {
            navbar?.classList.remove('visible');
            navbar?.classList.remove('scroll-up');
            navbar?.classList.remove('scroll-down');
            return;
        }
        
        // Handle scroll up/down behavior
        if (currentScroll > lastScroll && !navbar?.classList.contains('scroll-down')) {
            // Scrolling down
            navbar?.classList.remove('scroll-up');
            navbar?.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar?.classList.contains('scroll-down')) {
            // Scrolling up
            navbar?.classList.remove('scroll-down');
            navbar?.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
        heroHeight = hero?.offsetHeight || 0;
    });
}); 