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
        
        this.init();
    }
    
    init() {
        this.initializeHamburgerMenu();
        this.initializePageTracking();
        this.initializeScrollEffects();
        this.setupNavigationLinks();
        this.setupBrowserNavigation();
    }
    
    // Initialize hamburger menu functionality
    initializeHamburgerMenu() {
        // Toggle hamburger menu
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
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
                e.preventDefault();
                
                const targetPage = link.getAttribute('data-page');
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Close mobile menu
                this.closeHamburgerMenu();
                
                // Update active state immediately for better UX
                this.updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    const offsetTop = targetElement.offsetTop - 100;
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
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Setup smooth scrolling for desktop navigation links
    setupNavigationLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetPage = link.getAttribute('data-page');
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Update active state immediately for better UX
                this.updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    const offsetTop = targetElement.offsetTop - 100; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update page tracking
                    this.setCurrentPage(targetPage);
                }
            });
        });
        
        // Handle smooth scrolling for server section links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#servers"]') || e.target.matches('a[data-page="servers"]')) {
                e.preventDefault();
                const serversSection = document.querySelector('.servers');
                if (serversSection) {
                    const offsetTop = serversSection.offsetTop - 100;
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
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || 'home';
                    this.setCurrentPage(sectionId);
                }
            });
        }, observerOptions);
        
        // Observe the landing section (home)
        const landingSection = document.querySelector('.landing');
        if (landingSection) {
            landingSection.id = 'home';
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
        
        // Set initial active state
        this.updateActiveNavLink('home');
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.trackPageView(this.currentPage);
            }
        });
        
        // Track initial page load
        this.trackPageView('home');
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
            const header = document.querySelector('.header');
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class based on scroll position (only when not at very top)
            if (currentScrollY > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > 100) { // Only hide after scrolling past 100px
                if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                    // Scrolling down - hide navbar
                    header.classList.add('hidden');
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
}

// Export the Navbar class for use in main.js
window.Navbar = Navbar;