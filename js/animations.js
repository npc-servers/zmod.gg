document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', () => {
        ScrollTrigger.update();
    });

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.2
                });
            }
        });
    });

    // Initial animations for hero section
    const mainTimeline = gsap.timeline({
        defaults: { 
            ease: "power3.out",
            duration: 0.8
        }
    });

    // Make sure buttons are visible initially
    gsap.set('.buttons', { autoAlpha: 1 });
    gsap.set('.buttons .btn', { autoAlpha: 0, y: 20 });
    gsap.set('.scroll-indicator', { autoAlpha: 0, y: 20 });
    gsap.set('.about .highlight', { color: 'var(--primary-color)' });

    // Animate the grid background
    mainTimeline
    .from('.grid-background', {
        opacity: 0,
        scale: 1.1,
        duration: 1
    })
    // Animate particles
    .from('.particle', {
        opacity: 0,
        scale: 0,
        y: 100,
        duration: 0.8,
        stagger: {
            amount: 0.3,
            from: "random"
        }
    }, "-=0.8")
    // Animate text content
    .from('.subtitle', {
        y: 50,
        opacity: 0
    }, "-=0.4")
    .from('h1', {
        y: 50,
        opacity: 0,
        duration: 0.8
    }, "-=0.6")
    .from('.hero .highlight', {
        color: "#fff",
        textShadow: "none",
        duration: 0.6
    }, "-=0.4")
    .from('.description', {
        y: 30,
        opacity: 0
    }, "-=0.3")
    // Animate buttons immediately after description
    .to('.buttons .btn', {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.2")
    // Animate scroll indicator
    .to('.scroll-indicator', {
        autoAlpha: 0.5,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.2");

    // Parallax effect on scroll
    gsap.to('.particle-container', {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // Subtle floating animation for particles
    gsap.to('.particle', {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 2,
            from: "random"
        }
    });

    // Scroll indicator fade
    let lastScrollTop = 0;
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
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

    // Square animations for all sections
    function initializeSquareAnimations() {
        // Get all sections that have decorative squares
        const sections = document.querySelectorAll('.section.about, .section.store-section');
        
        // Set initial state for all squares
        document.querySelectorAll('.decorative-square, .store-accent').forEach(square => {
            square.classList.add('hidden');
            square.style.opacity = '0';
        });

        // Track the currently visible section and last scroll position
        let currentVisibleSection = null;
        let animationTimeouts = [];
        let lastScrollY = window.scrollY;
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Determine scroll direction
                    const scrollingDown = window.scrollY > lastScrollY;
                    lastScrollY = window.scrollY;

                    // If there's a currently visible section that's different from this one,
                    // hide its squares immediately
                    if (currentVisibleSection && currentVisibleSection !== entry.target) {
                        const previousSquares = currentVisibleSection.querySelectorAll('.decorative-square, .store-accent');
                        previousSquares.forEach(square => {
                            square.classList.remove('visible');
                            square.classList.add('hidden');
                            square.style.opacity = '0';
                        });
                    }

                    // Clear any pending animations
                    animationTimeouts.forEach(timeout => clearTimeout(timeout));
                    animationTimeouts = [];

                    // Update current visible section
                    currentVisibleSection = entry.target;

                    // Get all squares in this section
                    const squares = entry.target.querySelectorAll('.decorative-square, .store-accent');
                    const squaresArray = Array.from(squares);
                    
                    // Sort squares based on scroll direction and position
                    squaresArray.sort((a, b) => {
                        const aRect = a.getBoundingClientRect();
                        const bRect = b.getBoundingClientRect();
                        
                        // Calculate distance from the reference corner
                        // When scrolling down: distance from top-left
                        // When scrolling up: distance from bottom-left
                        const aDistance = scrollingDown 
                            ? Math.sqrt(Math.pow(aRect.left, 2) + Math.pow(aRect.top, 2))
                            : Math.sqrt(Math.pow(aRect.left, 2) + Math.pow(window.innerHeight - aRect.bottom, 2));
                        
                        const bDistance = scrollingDown
                            ? Math.sqrt(Math.pow(bRect.left, 2) + Math.pow(bRect.top, 2))
                            : Math.sqrt(Math.pow(bRect.left, 2) + Math.pow(window.innerHeight - bRect.bottom, 2));
                        
                        return aDistance - bDistance;
                    });
                    
                    // When section is visible, trigger squares in sequence
                    squaresArray.forEach((square, index) => {
                        const timeout = setTimeout(() => {
                            square.classList.remove('hidden');
                            // Use requestAnimationFrame to ensure opacity is 0 before adding visible class
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    if (currentVisibleSection === entry.target) {
                                        square.classList.add('visible');
                                    }
                                });
                            });
                        }, index * 200);

                        animationTimeouts.push(timeout);
                    });
                } else {
                    // When section is no longer intersecting
                    if (currentVisibleSection === entry.target) {
                        currentVisibleSection = null;
                    }
                    // Hide all squares in this section
                    const squares = entry.target.querySelectorAll('.decorative-square, .store-accent');
                    squares.forEach(square => {
                        square.classList.remove('visible');
                        square.classList.add('hidden');
                        square.style.opacity = '0';
                    });
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        // Observe each section
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Initialize square animations
    initializeSquareAnimations();
}); 