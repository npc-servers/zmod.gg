class Navbar {
    constructor() {
        this.currentPath = window.location.pathname;
        this.currentHash = window.location.hash;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.hasScrambled = false;
        this.navLinks = [
            { href: '/', text: 'Home' },
            { href: '/servers', text: 'Servers' },
            { href: '/store', text: 'Store' },
            { href: '/support', text: 'Support' },
            { href: '/about', text: 'About' }
        ];

        // Special case for consulting page
        if (this.currentPath.includes('consulting')) {
            this.navLinks = [
                { href: '#home', text: 'Home' },
                { href: '#about', text: 'About' },
                { href: '#services', text: 'Services' },
                { href: '#contact', text: 'Contact' }
            ];
        }

        this.init();
    }

    scrambleText(element, finalText) {
        let frame = 0;
        const frames = 20;
        const randomChars = this.chars;
        
        const animate = () => {
            if (frame >= frames) {
                element.textContent = finalText;
                element.classList.add('scramble');
                return;
            }

            const progress = frame / frames;
            const scrambledText = finalText
                .split('')
                .map((char, i) => {
                    if (Math.random() < progress) return char;
                    return randomChars[Math.floor(Math.random() * randomChars.length)];
                })
                .join('');

            element.textContent = scrambledText;
            frame++;
            requestAnimationFrame(animate);
        };

        animate();
    }

    scrambleAllLinks() {
        if (this.hasScrambled) return;
        
        // Scramble desktop nav links
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            const finalText = this.navLinks[index].text;
            link.textContent = '';
            setTimeout(() => {
                this.scrambleText(link, finalText);
            }, Math.random() * 500);
        });

        // Scramble mobile nav links
        document.querySelectorAll('.mobile-nav-link').forEach((link, index) => {
            const finalText = this.navLinks[index].text;
            link.textContent = '';
            setTimeout(() => {
                this.scrambleText(link, finalText);
            }, Math.random() * 500);
        });

        this.hasScrambled = true;
    }

    isCurrentLink(href) {
        if (this.currentPath.includes('consulting')) {
            // For consulting page, check against hash
            return href === (this.currentHash || '#home'); // Default to #home if no hash
        } else {
            // For main site, check against pathname
            if (href === '/' && this.currentPath === '/') return true;
            if (href !== '/' && this.currentPath.includes(href)) return true;
            return false;
        }
    }

    createNavElement() {
        const nav = document.createElement('nav');
        nav.className = 'navbar';

        // Create nav links container
        const navLinksDiv = document.createElement('div');
        navLinksDiv.className = 'nav-links';
        
        // Add nav links
        this.navLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-link';
            if (this.isCurrentLink(link.href)) {
                a.classList.add('active');
            }
            a.textContent = link.text;
            navLinksDiv.appendChild(a);
        });

        // Create hamburger menu
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            hamburger.appendChild(span);
        }

        nav.appendChild(navLinksDiv);
        nav.appendChild(hamburger);
        return nav;
    }

    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        // Create mobile logo
        const mobileLogo = document.createElement('div');
        mobileLogo.className = 'mobile-logo';
        const logoImg = document.createElement('img');
        logoImg.src = this.currentPath.includes('consulting') ? '../zmodplaceholder.png' : 'zmodplaceholder.png';
        logoImg.alt = 'ZMOD.GG Logo';
        mobileLogo.appendChild(logoImg);

        // Create mobile nav links
        const mobileNavLinks = document.createElement('div');
        mobileNavLinks.className = 'mobile-nav-links';
        this.navLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'mobile-nav-link';
            if (this.isCurrentLink(link.href)) {
                a.classList.add('active');
            }
            a.textContent = link.text;
            mobileNavLinks.appendChild(a);
        });

        // Create mobile footer
        const mobileFooter = document.createElement('div');
        mobileFooter.className = 'mobile-footer';

        // Create social links
        const mobileSocialLinks = document.createElement('div');
        mobileSocialLinks.className = 'mobile-social-links';
        const socialPlatforms = ['discord', 'twitter', 'instagram'];
        socialPlatforms.forEach(platform => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'mobile-social-link';
            const i = document.createElement('i');
            i.className = `fab fa-${platform}`;
            a.appendChild(i);
            mobileSocialLinks.appendChild(a);
        });

        const copyright = document.createElement('p');
        copyright.textContent = '© 2024 ZMOD.GG. All rights reserved.';

        mobileFooter.appendChild(mobileSocialLinks);
        mobileFooter.appendChild(copyright);

        // Append all elements to mobile menu
        mobileMenu.appendChild(mobileLogo);
        mobileMenu.appendChild(mobileNavLinks);
        mobileMenu.appendChild(mobileFooter);

        return mobileMenu;
    }

    setupEventListeners() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const navbar = document.querySelector('.navbar');
        const body = document.body;

        // Toggle mobile menu
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu?.classList.toggle('active');
            body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
            
            // Trigger scramble effect when mobile menu opens
            if (mobileMenu?.classList.contains('active')) {
                this.hasScrambled = false;
                this.scrambleAllLinks();
            }
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
        const hero = document.querySelector('#hero');
        
        const options = {
            root: null,
            rootMargin: '-20% 0px 0px 0px',
            threshold: [0, 0.1, 0.2]
        };

        const navbarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    navbar?.classList.add('visible');
                    // Trigger scramble effect when navbar becomes visible
                    this.hasScrambled = false;
                    this.scrambleAllLinks();
                } else {
                    navbar?.classList.remove('visible');
                }
            });
        }, options);

        if (hero) {
            navbarObserver.observe(hero);
        }

        // Update active state on hash change for consulting page
        if (this.currentPath.includes('consulting')) {
            window.addEventListener('hashchange', () => {
                this.currentHash = window.location.hash;
                this.updateActiveLinks();
            });
        }
    }

    updateActiveLinks() {
        // Update desktop nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (this.isCurrentLink(link.getAttribute('href'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update mobile nav links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            if (this.isCurrentLink(link.getAttribute('href'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    init() {
        // Create and inject navbar and mobile menu
        document.body.insertBefore(this.createNavElement(), document.body.firstChild);
        document.body.insertBefore(this.createMobileMenu(), document.body.firstChild);

        // Setup event listeners
        this.setupEventListeners();
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
}); 