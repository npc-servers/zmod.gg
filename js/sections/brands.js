document.addEventListener('DOMContentLoaded', () => {
    // Brand data with names and descriptions
    const brandData = {
        'hhh': {
            name: 'HARRISONS HOMIGRAD',
            description: 'A Homigrad server network we acquired in early 2025. Harrisons is the sister community of ZGRAD.',
            url: '/brands/harrisons-homigrad'
        },
        'npcz': {
            name: 'NPCZ',
            description: 'Our original servers: NPC Zombies Vs. Players, our Zombie Survival Sandbox; ZBOX, our Vanilla Sandbox; and Horde, our zombie survival wave gamemode.',
            url: '/brands/npcz'
        },
        'zgrad': {
            name: 'ZGRAD',
            description: 'Our in-house Homigrad gamemode network, featuring a built from the ground up Homigrad gamemode.',
            url: '/brands/zgrad'
        }
    };

    // Default header and description
    const defaultHeader = 'OUR BRANDS';
    const defaultDescription = 'Explore our family of gaming brands, each offering unique experiences within the ZMOD network';
    
    // Get DOM elements
    const headerFirstSpan = document.querySelector('.brands-header h2 .heading-first');
    const headerSecondSpan = document.querySelector('.brands-header h2 .heading-second');
    const descriptionElement = document.querySelector('.brands-header p');
    const logoContainers = document.querySelectorAll('.brand-logo-container');
    
    // Store original text
    const originalHeaderFirst = headerFirstSpan.textContent;
    const originalHeaderSecond = headerSecondSpan.textContent;
    const originalDescription = descriptionElement.textContent;
    
    // Function to handle brand click
    const handleBrandClick = (brandId) => {
        const url = brandData[brandId].url;
        window.location.href = url;
    };
    
    // Text scramble effect class
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Initialize scramblers
    const headerFirstScrambler = new TextScramble(headerFirstSpan);
    const headerSecondScrambler = new TextScramble(headerSecondSpan);
    const descriptionScrambler = new TextScramble(descriptionElement);
    
    // Add event listeners for mouse interactions
    logoContainers.forEach(container => {
        const brandId = container.querySelector('img').alt.split(' ')[0].toLowerCase();
        
        // Make container focusable for keyboard navigation
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', `Visit ${brandData[brandId].name} brand page`);
        
        container.addEventListener('mouseenter', () => {
            // Split the brand name for header animation
            let brandName = brandData[brandId].name;
            let nameParts = brandName.split(' ');
            let firstPart = nameParts.length > 1 ? nameParts[0] : '';
            let secondPart = nameParts.length > 1 ? nameParts.slice(1).join(' ') : brandName;
            
            // Animate header and description
            headerFirstScrambler.setText(firstPart);
            headerSecondScrambler.setText(secondPart);
            descriptionScrambler.setText(brandData[brandId].description);
            
            // Add click indicator
            container.setAttribute('title', `Click to visit ${brandData[brandId].name}`);
        });
        
        container.addEventListener('mouseleave', () => {
            // Animate back to original text
            headerFirstScrambler.setText(originalHeaderFirst);
            headerSecondScrambler.setText(originalHeaderSecond);
            descriptionScrambler.setText(originalDescription);
        });
        
        // Add focus events for keyboard navigation
        container.addEventListener('focus', () => {
            // Same animation as mouseenter
            let brandName = brandData[brandId].name;
            let nameParts = brandName.split(' ');
            let firstPart = nameParts.length > 1 ? nameParts[0] : '';
            let secondPart = nameParts.length > 1 ? nameParts.slice(1).join(' ') : brandName;
            
            headerFirstScrambler.setText(firstPart);
            headerSecondScrambler.setText(secondPart);
            descriptionScrambler.setText(brandData[brandId].description);
        });
        
        container.addEventListener('blur', () => {
            // Same animation as mouseleave
            headerFirstScrambler.setText(originalHeaderFirst);
            headerSecondScrambler.setText(originalHeaderSecond);
            descriptionScrambler.setText(originalDescription);
        });
        
        // Add click event listener
        container.addEventListener('click', () => {
            handleBrandClick(brandId);
        });
        
        // Add keyboard event listener for Enter key
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBrandClick(brandId);
            }
        });
    });
}); 