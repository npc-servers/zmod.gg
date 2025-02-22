class Footer {
    constructor() {
        this.currentPath = window.location.pathname;
        this.footerElement = this.createFooter();
        this.init();
    }

    init() {
        document.body.appendChild(this.footerElement);
    }

    isCurrentPage(href) {
        if (href === '/' && this.currentPath === '/') return true;
        if (href !== '/' && this.currentPath.startsWith(href)) return true;
        return false;
    }

    sortLinksWithCurrentFirst(links) {
        return links.sort((a, b) => {
            const aIsCurrent = this.isCurrentPage(a.href);
            const bIsCurrent = this.isCurrentPage(b.href);
            if (aIsCurrent && !bIsCurrent) return -1;
            if (!aIsCurrent && bIsCurrent) return 1;
            return 0;
        });
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.className = 'footer';

        const container = document.createElement('div');
        container.className = 'footer-container';

        // Company Info Column
        const companyColumn = document.createElement('div');
        companyColumn.className = 'footer-column';

        const logo = document.createElement('img');
        logo.className = 'footer-logo';
        logo.src = '/assets/logos/zmod-logo.png';
        logo.alt = 'ZMOD.GG Logo';

        const description = document.createElement('p');
        description.className = 'footer-description';
        description.textContent = 'ZMOD is the new home of NPCZ, ZGRAD, and Harrison\'s Homigrad!';

        companyColumn.appendChild(logo);
        companyColumn.appendChild(description);

        // Quick Links Column
        const linksColumn = document.createElement('div');
        linksColumn.className = 'footer-column';

        const linksHeading = document.createElement('h3');
        linksHeading.className = 'footer-heading';
        linksHeading.textContent = 'Quick Links';

        const linksList = document.createElement('div');
        linksList.className = 'footer-links';

        const quickLinks = this.sortLinksWithCurrentFirst([
            { text: 'Home', href: '/' },
            { text: 'About', href: '/about' },
            { text: 'Services', href: '/services' },
            { text: 'Store', href: '/store' }
        ]);

        quickLinks.forEach(link => {
            const linkContainer = document.createElement('div');
            linkContainer.className = 'footer-link-container';

            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'footer-link';
            if (this.isCurrentPage(link.href)) {
                a.classList.add('current-page');
            }
            a.textContent = link.text;
            linkContainer.appendChild(a);

            if (this.isCurrentPage(link.href)) {
                const currentIndicator = document.createElement('span');
                currentIndicator.className = 'current-page-indicator';
                currentIndicator.textContent = '(You\'re here!)';
                linkContainer.appendChild(currentIndicator);
            }

            linksList.appendChild(linkContainer);
        });

        linksColumn.appendChild(linksHeading);
        linksColumn.appendChild(linksList);

        // Support Column
        const supportColumn = document.createElement('div');
        supportColumn.className = 'footer-column';

        const supportHeading = document.createElement('h3');
        supportHeading.className = 'footer-heading';
        supportHeading.textContent = 'Support';

        const supportLinks = document.createElement('div');
        supportLinks.className = 'footer-links';

        const supportItems = this.sortLinksWithCurrentFirst([
            { text: 'Help Center', href: '/help' },
            { text: 'Global Server Guidelines', href: '/guidelines' },
            { text: 'Server Guidelines Directory', href: '/guidelines/directory' },
            { text: 'Terms of Service', href: '/terms' },
            { text: 'Privacy Policy', href: '/privacy' },
            { text: 'Store Terms of Service', href: '/store/terms' }
        ]);

        supportItems.forEach(item => {
            const linkContainer = document.createElement('div');
            linkContainer.className = 'footer-link-container';

            const a = document.createElement('a');
            a.href = item.href;
            a.className = 'footer-link';
            if (this.isCurrentPage(item.href)) {
                a.classList.add('current-page');
            }
            a.textContent = item.text;
            linkContainer.appendChild(a);

            if (this.isCurrentPage(item.href)) {
                const currentIndicator = document.createElement('span');
                currentIndicator.className = 'current-page-indicator';
                currentIndicator.textContent = '(You\'re here!)';
                linkContainer.appendChild(currentIndicator);
            }

            supportLinks.appendChild(linkContainer);
        });

        supportColumn.appendChild(supportHeading);
        supportColumn.appendChild(supportLinks);

        // Connect Column
        const connectColumn = document.createElement('div');
        connectColumn.className = 'footer-column';

        const connectHeading = document.createElement('h3');
        connectHeading.className = 'footer-heading';
        connectHeading.textContent = 'Connect With Us';

        const socialLinks = document.createElement('div');
        socialLinks.className = 'social-links';

        const socialPlatforms = this.sortLinksWithCurrentFirst([
            { icon: 'discord', href: '#' },
            { icon: 'twitter', href: '#' },
            { icon: 'instagram', href: '#' }
        ]);

        socialPlatforms.forEach(platform => {
            const a = document.createElement('a');
            a.href = platform.href;
            a.className = 'social-link';
            const i = document.createElement('i');
            i.className = `fab fa-${platform.icon}`;
            a.appendChild(i);
            socialLinks.appendChild(a);
        });

        connectColumn.appendChild(connectHeading);
        connectColumn.appendChild(socialLinks);

        // Add all columns to container
        container.appendChild(companyColumn);
        container.appendChild(linksColumn);
        container.appendChild(supportColumn);
        container.appendChild(connectColumn);

        // Create footer bottom
        const footerBottom = document.createElement('div');
        footerBottom.className = 'footer-bottom';
        footerBottom.innerHTML = '© 2025 NPCZ, LLC DBA ZMOD ZOFTWORKS. All rights reserved.';

        // Add container and bottom section to footer
        footer.appendChild(container);
        footer.appendChild(footerBottom);

        return footer;
    }
}

// Export the Footer class
export default Footer; 