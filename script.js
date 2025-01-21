document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const container = document.querySelector('.container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScrollTop = 0;
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'hero') {
                if (!entry.isIntersecting) {
                    navbar.classList.add('visible');
                } else {
                    navbar.classList.remove('visible');
                }
            }
        });
    }, options);

    observer.observe(document.querySelector('#hero'));

    // Smooth scroll handling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll indicator fade
    container.addEventListener('scroll', () => {
        const scrollTop = container.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down and past threshold
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translate(-50%, 20px)';
        } else if (scrollTop < 50) {
            // Back at top
            scrollIndicator.style.opacity = '0.6';
            scrollIndicator.style.transform = 'translate(-50%, 0)';
        }
        
        lastScrollTop = scrollTop;
    });
}); 