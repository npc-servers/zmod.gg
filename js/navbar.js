// Navbar functionality for ZMod website
class Navbar {
    constructor() {
        this.currentPage = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        
        // Track initial page load to prevent intersection observer from overriding hash navigation
        this.isInitialLoad = true;
        this.pageLoadTime = Date.now();
        this.debugMode = false; // Set to true to enable debug logging
        
        this.init();
    }
    
    init() {
        this.initializeHamburgerMenu();
        this.initializePageTracking();
        this.initializeScrollEffects();
        this.setupNavigationLinks();
        this.setupBrowserNavigation();
        this.initializeScrambleAnimation();
    }
    
    // Initialize hamburger menu functionality
    initializeHamburgerMenu() {
        // Store original scroll position for restoration
        this.scrollPosition = 0;
        // Track if we recently closed mobile menu
        this.recentlyClosedMobileMenu = false;
        
        // Toggle hamburger menu
        this.hamburger.addEventListener('click', () => {
            const header = document.querySelector('.header');
            this.hamburger.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            
            // Add/remove class on header for z-index management
            if (this.mobileMenu.classList.contains('active')) {
                header.classList.add('mobile-menu-open');
                // Ensure navbar is visible when opening mobile menu
                header.classList.remove('hidden');
                this.recentlyClosedMobileMenu = false;
                this.preventScrolling();
            } else {
                header.classList.remove('mobile-menu-open');
                // Keep navbar visible for a moment after closing
                header.classList.remove('hidden');
                this.recentlyClosedMobileMenu = true;
                this.restoreScrolling();
                
                // Reset the flag after a delay
                setTimeout(() => {
                    this.recentlyClosedMobileMenu = false;
                }, 1000); // Keep navbar visible for 1 second after closing
            }
        });
        
        // Close menu when clicking outside
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeHamburgerMenu();
            }
        });
        
        // Handle mobile navigation links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetPage = link.getAttribute('data-page');
                const href = link.getAttribute('href');
                
                // Check if the link is pointing to a different page
                if (href.startsWith('index.html') || href.startsWith('../index.html')) {
                    // Close mobile menu but allow default navigation
                    this.closeHamburgerMenu();
                    return;
                }
                
                // Only prevent default and handle smooth scrolling for same-page navigation
                e.preventDefault();
                
                const targetId = href;
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Close mobile menu
                this.closeHamburgerMenu();
                
                // Update active state immediately for better UX
                this.updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    let offsetTop = targetElement.offsetTop - 100;
                    
                    // Special offset for webstore section due to large top padding (6rem = 96px)
                    if (targetPage === 'webstore') {
                        offsetTop = targetElement.offsetTop + 200; // Scroll INTO the section to account for padding
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update page tracking
                    this.setCurrentPage(targetPage);
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
                this.closeHamburgerMenu();
            }
        });
    }
    
    // Close hamburger menu
    closeHamburgerMenu() {
        const header = document.querySelector('.header');
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        header.classList.remove('mobile-menu-open');
        // Keep navbar visible when closing
        header.classList.remove('hidden');
        this.recentlyClosedMobileMenu = true;
        this.restoreScrolling();
        
        // Reset the flag after a delay
        setTimeout(() => {
            this.recentlyClosedMobileMenu = false;
        }, 1000); // Keep navbar visible for 1 second after closing
    }
    
    // Force navbar update (used when closing mobile menu)
    forceNavbarUpdate() {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        
        // Apply appropriate scroll state immediately
        if (currentScrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Apply hide/show state based on current scroll position
        if (currentScrollY > 100) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('hidden');
        }
    }
    
    // Prevent scrolling when mobile menu is open
    preventScrolling() {
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Prevent scrolling on html element for extra security
        document.documentElement.style.overflow = 'hidden';
        
        // Prevent touch scrolling on mobile
        document.addEventListener('touchmove', this.preventTouchMove, { passive: false });
    }
    
    // Restore scrolling when mobile menu is closed
    restoreScrolling() {
        // Restore body styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore html overflow
        document.documentElement.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, this.scrollPosition);
        
        // Remove touch move prevention
        document.removeEventListener('touchmove', this.preventTouchMove);
    }
    
    // Prevent touch move events (for mobile scroll prevention)
    preventTouchMove(e) {
        e.preventDefault();
    }
    
    // Setup smooth scrolling for desktop navigation links
    setupNavigationLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetPage = link.getAttribute('data-page');
                const href = link.getAttribute('href');
                
                // Check if the link is pointing to a different page
                if (href.startsWith('index.html') || href.startsWith('../index.html')) {
                    // Allow default behavior for external page navigation
                    return;
                }
                
                // Only prevent default and handle smooth scrolling for same-page navigation
                e.preventDefault();
                
                const targetId = href;
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Update active state immediately for better UX
                this.updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    let offsetTop = targetElement.offsetTop - 100; // Account for navbar height
                    
                    // Special offset for webstore section due to large top padding (6rem = 96px)
                    if (targetPage === 'webstore') {
                        offsetTop = targetElement.offsetTop + 200; // Scroll INTO the section to account for padding
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update page tracking
                    this.setCurrentPage(targetPage);
                }
            });
        });
        
        // Handle smooth scrolling for server section links (only for same-page navigation)
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#servers"]') || e.target.matches('a[data-page="servers"]')) {
                // Check if this is a cross-page navigation
                const href = e.target.getAttribute('href');
                if (href && (href.startsWith('index.html') || href.startsWith('../index.html'))) {
                    // Allow default behavior for external page navigation
                    return;
                }
                
                e.preventDefault();
                const serversSection = document.querySelector('.servers');
                if (serversSection) {
                    let offsetTop = serversSection.offsetTop - 100;
                    
                    // This is specifically for servers, but keeping consistent pattern
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    this.setCurrentPage('servers');
                }
            }
        });
    }
    
    // Initialize page tracking system
    initializePageTracking() {
        // Set up intersection observer for automatic page detection
        const observerOptions = {
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], // Multiple thresholds for precise ratio detection
            rootMargin: '-120px 0px -300px 0px' // More conservative margins to prevent false triggers
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            // Find the most intersecting entry (highest intersection ratio)
            let mostIntersecting = null;
            let highestRatio = 0;
            
            entries.forEach(entry => {
                // Only consider sections that are at least 30% visible
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3 && entry.intersectionRatio > highestRatio) {
                    mostIntersecting = entry;
                    highestRatio = entry.intersectionRatio;
                }
            });
            
            // Only process the most intersecting section
            if (mostIntersecting) {
                const sectionId = mostIntersecting.target.id || 'home';
                
                // Don't override hash navigation during initial page load (first 2 seconds)
                if (this.isInitialLoad && Date.now() - this.pageLoadTime < 2000) {
                    return;
                }
                
                this.setCurrentPage(sectionId);
            }
        }, observerOptions);
        
        // Observe the landing section (home)
        const landingSection = document.querySelector('.landing');
        if (landingSection) {
            sectionObserver.observe(landingSection);
        }
        
        // Observe servers section
        const serversSection = document.querySelector('.servers');
        if (serversSection) {
            sectionObserver.observe(serversSection);
        }
        
        // Observer for server browser section
        const serverBrowserSection = document.querySelector('.server-browser');
        if (serverBrowserSection) {
            sectionObserver.observe(serverBrowserSection);
        }
        
        // Observer for webstore section
        const webstoreSection = document.querySelector('.webstore');
        if (webstoreSection) {
            sectionObserver.observe(webstoreSection);
        }
        
        // Observer for community guidelines section
        const communitySection = document.querySelector('.community-guidelines');
        if (communitySection) {
            sectionObserver.observe(communitySection);
        }
        
        // Observer for discord section
        const discordSection = document.querySelector('.discord-section');
        if (discordSection) {
            sectionObserver.observe(discordSection);
        }
        
        // Handle initial hash navigation if present
        const initialHash = window.location.hash.slice(1);
        if (initialHash && initialHash !== 'home') {
            // Set the current page to match the hash
            this.currentPage = initialHash;
            this.updateActiveNavLink(initialHash);
            this.trackPageView(initialHash);
            
            // Apply proper scroll position after a short delay to override browser's default scroll
            setTimeout(() => {
                const targetElement = document.querySelector(`#${initialHash}`);
                if (targetElement) {
                    let offsetTop = targetElement.offsetTop - 100;
                    
                    // Special offset for webstore section due to large top padding (6rem = 96px)
                    if (initialHash === 'webstore') {
                        offsetTop = targetElement.offsetTop + 200; // Scroll INTO the section to account for padding
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 100); // Small delay to let the page fully load
        } else {
            // Set initial active state for home
            this.updateActiveNavLink('home');
        }
        
        // Reset initial load flag after a delay to allow normal intersection observer behavior
        setTimeout(() => {
            this.isInitialLoad = false;
        }, 2000);
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.trackPageView(this.currentPage);
            }
        });
        
        // Track initial page load (only if no hash present)  
        const currentHash = window.location.hash.slice(1);
        if (!currentHash || currentHash === 'home') {
            this.trackPageView('home');
        }
    }
    
    // Update current page and navigation state
    setCurrentPage(page) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.updateActiveNavLink(page);
            this.trackPageView(page);
            
            // Update URL hash without triggering scroll
            if (history.replaceState) {
                history.replaceState(null, null, `#${page}`);
            }
        }
    }
    
    // Update active navigation link
    updateActiveNavLink(activePage) {
        // Update desktop navigation links
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update mobile navigation links
        this.mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Track page views (can be extended for analytics)
    trackPageView(page) {
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
    getPageStats() {
        return JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
    }
    
    // Setup browser navigation (back/forward buttons)
    setupBrowserNavigation() {
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.setCurrentPage(hash);
            
            // Scroll to section if it exists
            const targetElement = document.querySelector(`#${hash}`) || document.querySelector('.landing');
            if (targetElement) {
                let offsetTop = targetElement.offsetTop - 100;
                
                // Special offset for webstore section due to large top padding (6rem = 96px)
                if (hash === 'webstore') {
                    offsetTop = targetElement.offsetTop + 200; // Scroll INTO the section to account for padding
                }
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Initialize scroll effects for navbar
    initializeScrollEffects() {
        const updateNavbar = () => {
            const header = document.querySelector('.header');
            const currentScrollY = window.scrollY;
            const isMobileMenuOpen = this.mobileMenu.classList.contains('active');
            const hasMobileMenuOpenClass = header.classList.contains('mobile-menu-open');
            
            // Don't apply scroll effects when mobile menu is open or recently closed
            if (isMobileMenuOpen || hasMobileMenuOpenClass || this.recentlyClosedMobileMenu) {
                // Ensure navbar stays visible
                header.classList.remove('hidden');
                this.lastScrollY = currentScrollY;
                this.ticking = false;
                return;
            }
            
            // Add/remove scrolled class based on scroll position (only when not at very top)
            if (currentScrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > 100) { // Only hide after scrolling past 100px
                if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                    // Scrolling down - hide navbar (only if not recently closed mobile menu)
                    if (!this.recentlyClosedMobileMenu) {
                        header.classList.add('hidden');
                    }
                } else if (currentScrollY < this.lastScrollY) {
                    // Scrolling up - show navbar
                    header.classList.remove('hidden');
                }
            } else {
                // Always show navbar when near the top
                header.classList.remove('hidden');
            }
            
            this.lastScrollY = currentScrollY;
            this.ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(updateNavbar);
                this.ticking = true;
            }
        });
    }
    
    // Getter for current page
    getCurrentPage() {
        return this.currentPage;
    }
    
    // Scramble animation functionality
    initializeScrambleAnimation() {
        // Apply scramble animation to desktop nav links
        this.navLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
        
        // Apply scramble animation to mobile nav links
        this.mobileNavLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
            
            // Also trigger on touch for mobile devices
            link.addEventListener('touchstart', () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
    }
    
    // Scramble text animation function
    scrambleText(element, originalText, duration = 600) {
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
                    scrambledText += this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
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
}

// Export the Navbar class for use in main.js
window.Navbar = Navbar;