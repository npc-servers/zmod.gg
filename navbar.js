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
        const currentScroll = document.querySelector('.container').scrollTop;
        
        // Show/hide navbar based on hero section
        if (currentScroll > heroHeight * 0.3) {
            navbar?.classList.add('visible');
            
            // Handle scroll direction
            if (currentScroll < lastScroll) {
                // Scrolling up - hide navbar
                navbar?.classList.add('scroll-down');
                navbar?.classList.remove('scroll-up');
            } else {
                // Scrolling down - show navbar
                navbar?.classList.remove('scroll-down');
                navbar?.classList.add('scroll-up');
            }
        } else {
            // At top of page - hide navbar
            navbar?.classList.remove('visible');
            navbar?.classList.remove('scroll-up');
            navbar?.classList.remove('scroll-down');
        }
        
        lastScroll = currentScroll;
    };

    const container = document.querySelector('.container');
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', () => {
        heroHeight = hero?.offsetHeight || 0;
    });
}); 