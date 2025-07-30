// Main JavaScript for ZMod website

document.addEventListener('DOMContentLoaded', function() {
    // Page tracking variables
    let currentPage = 'home';
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const sections = [];
    
    // Initialize scramble animation
    initializeScrambleAnimation();
    
    // Initialize hamburger menu
    initializeHamburgerMenu();
    
    // Initialize page tracking
    initializePageTracking();
    
    // Scramble animation functionality
    function initializeScrambleAnimation() {
        const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        
        function scrambleText(element, originalText, duration = 600) {
            const chars = originalText.split('');
            const totalFrames = Math.floor(duration / 50); // 50ms per frame
            let frame = 0;
            
            // Store original text to restore later
            const finalText = originalText;
            
            // Fix the width before animation starts
            const originalWidth = element.offsetWidth;
            const originalMinWidth = element.style.minWidth;
            const originalWidth_style = element.style.width;
            element.style.width = originalWidth + 'px';
            element.style.minWidth = originalWidth + 'px';
            
            const scrambleInterval = setInterval(() => {
                let scrambledText = '';
                
                // Build scrambled text with exact same character count
                for (let i = 0; i < chars.length; i++) {
                    const originalChar = finalText[i];
                    const progress = frame / totalFrames;
                    const charProgress = Math.max(0, (progress - (i * 0.1)) * 2);
                    
                    // Preserve spaces and special characters as-is
                    if (originalChar === ' ' || originalChar === '-' || originalChar === '_') {
                        scrambledText += originalChar;
                    } else if (charProgress >= 1) {
                        // Character is finalized
                        scrambledText += originalChar;
                    } else {
                        // Character is scrambling - use random character
                        scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    }
                }
                
                element.textContent = scrambledText;
                frame++;
                
                if (frame > totalFrames) {
                    clearInterval(scrambleInterval);
                    element.textContent = finalText; // Ensure final text is correct
                    
                    // Reset width styles after animation
                    element.style.width = originalWidth_style;
                    element.style.minWidth = originalMinWidth;
                }
            }, 50);
        }
        
        // Apply scramble animation to desktop nav links
        navLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
        
        // Apply scramble animation to mobile nav links
        mobileNavLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
            
            // Also trigger on touch for mobile devices
            link.addEventListener('touchstart', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
    }
    
    // Initialize hamburger menu functionality
    function initializeHamburgerMenu() {
        // Toggle hamburger menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeHamburgerMenu();
            }
        });
        
        // Handle mobile navigation links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetPage = this.getAttribute('data-page');
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Close mobile menu
                closeHamburgerMenu();
                
                // Update active state immediately for better UX
                updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update page tracking
                    setCurrentPage(targetPage);
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeHamburgerMenu();
            }
        });
    }
    
    // Close hamburger menu
    function closeHamburgerMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Smooth scrolling for desktop navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
            
            // Update active state immediately for better UX
            updateActiveNavLink(targetPage);
            
            if (targetElement) {
                // Smooth scroll to target
                const offsetTop = targetElement.offsetTop - 100; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update page tracking
                setCurrentPage(targetPage);
            }
        });
    });
    
    // Initialize page tracking system
    function initializePageTracking() {
        // Set up intersection observer for automatic page detection
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };
        
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || 'home';
                    setCurrentPage(sectionId);
                }
            });
        }, observerOptions);
        
        // Observe the landing section (home)
        const landingSection = document.querySelector('.landing');
        if (landingSection) {
            landingSection.id = 'home';
            sectionObserver.observe(landingSection);
        }
        
        // Set initial active state
        updateActiveNavLink('home');
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                trackPageView(currentPage);
            }
        });
        
        // Track initial page load
        trackPageView('home');
    }
    
    // Update current page and navigation state
    function setCurrentPage(page) {
        if (currentPage !== page) {
            currentPage = page;
            updateActiveNavLink(page);
            trackPageView(page);
            
            // Update URL hash without triggering scroll
            if (history.replaceState) {
                history.replaceState(null, null, `#${page}`);
            }
        }
    }
    
    // Update active navigation link
    function updateActiveNavLink(activePage) {
        // Update desktop navigation links
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update mobile navigation links
        mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Track page views (can be extended for analytics)
    function trackPageView(page) {
        console.log(`Page tracked: ${page} at ${new Date().toISOString()}`);
        
        // Store in localStorage for session tracking
        const pageViews = JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
        pageViews[page] = pageViews[page] || 0;
        pageViews[page]++;
        pageViews.lastVisited = page;
        pageViews.lastVisitTime = new Date().toISOString();
        localStorage.setItem('zmod_page_views', JSON.stringify(pageViews));
        
        // Trigger custom event for potential analytics integration
        document.dispatchEvent(new CustomEvent('pageTracked', {
            detail: {
                page: page,
                timestamp: new Date().toISOString(),
                totalViews: pageViews[page]
            }
        }));
    }
    
    // Get page tracking stats
    function getPageStats() {
        return JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash.slice(1) || 'home';
        setCurrentPage(hash);
        
        // Scroll to section if it exists
        const targetElement = document.querySelector(`#${hash}`) || document.querySelector('.landing');
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.7)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Intersection Observer for scroll animations (for future sections)
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, animationObserverOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.landing-content');
    animateElements.forEach(el => animationObserver.observe(el));
    
    // Expose page tracking functions globally for debugging
    window.ZModTracking = {
        getCurrentPage: () => currentPage,
        getPageStats: getPageStats,
        setCurrentPage: setCurrentPage
    };
}); 