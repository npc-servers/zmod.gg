// Navbar functionality for ZMod website
class Navbar {
    constructor() {
        this.currentPage = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.scrollPosition = 0;
        this.scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        this.isInitialLoad = true;
        
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
        // Toggle hamburger menu
        this.hamburger.addEventListener('click', () => {
            const isActive = this.mobileMenu.classList.contains('active');
            
            this.hamburger.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            this.header.classList.toggle('mobile-menu-open');
            
            if (!isActive) {
                this.header.classList.remove('hidden');
                this.preventScrolling();
            } else {
                this.restoreScrolling();
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
                this.handleNavLinkClick(e, link, true);
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
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.header.classList.remove('mobile-menu-open', 'hidden');
        this.restoreScrolling();
    }
    
    // Prevent scrolling when mobile menu is open
    preventScrolling() {
        this.scrollPosition = window.pageYOffset;
        document.body.style.cssText = `overflow: hidden; position: fixed; top: -${this.scrollPosition}px; width: 100%;`;
        document.documentElement.style.overflow = 'hidden';
        document.addEventListener('touchmove', this.preventTouchMove, { passive: false });
    }
    
    // Restore scrolling when mobile menu is closed
    restoreScrolling() {
        document.body.style.cssText = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, this.scrollPosition);
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
                this.handleNavLinkClick(e, link, false);
            });
        });
        
        // Handle server section links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#servers"]') || e.target.matches('a[data-page="servers"]')) {
                this.handleNavLinkClick(e, e.target, false);
            }
        });
    }
    
    // Unified navigation link handler
    handleNavLinkClick(e, link, isMobile) {
        const targetPage = link.getAttribute('data-page');
        const href = link.getAttribute('href');
        
        // Check if the link already points to index.html (cross-page navigation)
        if (href && (href.startsWith('index.html') || href.startsWith('../index.html'))) {
            if (isMobile) this.closeHamburgerMenu();
            return; // Allow default navigation - browser will handle the redirect and hash
        }
        
        e.preventDefault();
        
        // Check if we're currently on the index page
        const currentPath = window.location.pathname;
        const isOnIndexPage = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/');
        
        // If we're not on the index page, navigate to index with hash
        if (!isOnIndexPage) {
            if (isMobile) this.closeHamburgerMenu();
            const targetHash = href || `#${targetPage}`;
            window.location.href = `index.html${targetHash}`;
            return;
        }
        
        // We're on the index page, handle normal scroll navigation
        const targetId = href || `#${targetPage}`;
        const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
        
        if (isMobile) this.closeHamburgerMenu();
        this.updateActiveNavLink(targetPage);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            this.setCurrentPage(targetPage);
        }
    }
    
    // Initialize page tracking system
    initializePageTracking() {
        const observerOptions = {
            threshold: [0.3, 0.5, 0.7],
            rootMargin: '-120px 0px -300px 0px'
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            let mostIntersecting = null;
            let highestRatio = 0;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3 && entry.intersectionRatio > highestRatio) {
                    mostIntersecting = entry;
                    highestRatio = entry.intersectionRatio;
                }
            });
            
            if (mostIntersecting && !this.isInitialLoad) {
                const sectionId = mostIntersecting.target.id || 'home';
                this.setCurrentPage(sectionId);
            }
        }, observerOptions);
        
        // Observe all sections
        const sections = ['.landing', '.servers', '.server-browser', '.webstore', '.community-guidelines', '.discord-section'];
        sections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) sectionObserver.observe(section);
        });
        
        // Handle initial hash navigation
        const initialHash = window.location.hash.slice(1);
        const targetPage = initialHash || 'home';
        
        this.currentPage = targetPage;
        this.updateActiveNavLink(targetPage);
        this.trackPageView(targetPage);
        
        if (initialHash) {
            // Special handling for webstore to ensure proper positioning
            if (initialHash === 'webstore') {
                // Wait for images and content to load before scrolling
                const scrollToWebstore = () => {
                    const targetElement = document.querySelector('#webstore');
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'instant' // Use instant to avoid conflicts with browser's default behavior
                        });
                    }
                };
                
                // Try immediately first
                setTimeout(scrollToWebstore, 100);
                
                // Fallback attempts with increasing delays
                setTimeout(scrollToWebstore, 300);
                setTimeout(scrollToWebstore, 600);
                
                // Final attempt after page is fully loaded
                if (document.readyState === 'complete') {
                    setTimeout(scrollToWebstore, 100);
                } else {
                    window.addEventListener('load', () => {
                        setTimeout(scrollToWebstore, 100);
                    });
                }
            } else {
                setTimeout(() => {
                    const targetElement = document.querySelector(`#${initialHash}`);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        }
        
        // Reset initial load flag
        setTimeout(() => this.isInitialLoad = false, 2000);
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.trackPageView(this.currentPage);
            }
        });
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
        const pageViews = JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
        pageViews[page] = (pageViews[page] || 0) + 1;
        pageViews.lastVisited = page;
        pageViews.lastVisitTime = new Date().toISOString();
        localStorage.setItem('zmod_page_views', JSON.stringify(pageViews));
        
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
                const offsetTop = targetElement.offsetTop - 100;
                
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
            const currentScrollY = window.scrollY;
            const isMobileMenuOpen = this.header.classList.contains('mobile-menu-open');
            
            // Don't apply scroll effects when mobile menu is open
            if (isMobileMenuOpen) {
                this.header.classList.remove('hidden');
                this.lastScrollY = currentScrollY;
                this.ticking = false;
                return;
            }
            
            // Toggle scrolled class
            this.header.classList.toggle('scrolled', currentScrollY > 0);
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > 100) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                    this.header.classList.add('hidden');
                } else if (currentScrollY < this.lastScrollY) {
                    this.header.classList.remove('hidden');
                }
            } else {
                this.header.classList.remove('hidden');
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
        const addScrambleToLink = (link) => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            const handleScramble = () => {
                if (!isScrambling) {
                    isScrambling = true;
                    this.scrambleText(link, originalText, 500);
                    setTimeout(() => isScrambling = false, 500);
                }
            };
            
            link.addEventListener('mouseenter', handleScramble);
            if (link.closest('.mobile-menu')) {
                link.addEventListener('touchstart', handleScramble);
            }
        };
        
        [...this.navLinks, ...this.mobileNavLinks].forEach(addScrambleToLink);
    }
    
    // Scramble text animation function
    scrambleText(element, originalText, duration = 600) {
        const totalFrames = Math.floor(duration / 50);
        let frame = 0;
        
        // Fix width during animation
        const originalStyles = {
            width: element.style.width,
            minWidth: element.style.minWidth
        };
        const currentWidth = element.offsetWidth;
        element.style.width = currentWidth + 'px';
        element.style.minWidth = currentWidth + 'px';
        
        const scrambleInterval = setInterval(() => {
            let scrambledText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                const char = originalText[i];
                const progress = frame / totalFrames;
                const charProgress = Math.max(0, (progress - (i * 0.1)) * 2);
                
                if (char === ' ' || char === '-' || char === '_' || charProgress >= 1) {
                    scrambledText += char;
                } else {
                    scrambledText += this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
                }
            }
            
            element.textContent = scrambledText;
            frame++;
            
            if (frame > totalFrames) {
                clearInterval(scrambleInterval);
                element.textContent = originalText;
                element.style.width = originalStyles.width;
                element.style.minWidth = originalStyles.minWidth;
            }
        }, 50);
    }
}

// Export the Navbar class for use in main.js
window.Navbar = Navbar;