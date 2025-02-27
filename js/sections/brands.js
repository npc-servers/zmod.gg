document.addEventListener('DOMContentLoaded', () => {
    // Brand data with names and descriptions
    const brandData = {
        'hhh': {
            name: 'HARRISONS HOMIGRAD',
            description: 'A premium gaming experience with custom maps and unique gameplay mechanics'
        },
        'npcz': {
            name: 'NPC ZONE',
            description: 'Immersive roleplay servers with advanced AI-driven NPCs and storylines'
        },
        'zgrad': {
            name: 'Z GRADIENT',
            description: 'Creative building servers with professional tools and community workshops'
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
        
        container.addEventListener('mouseenter', () => {
            // Split the brand name for header animation
            let brandName = brandData[brandId].name;
            let nameParts = brandName.split(' ');
            let firstPart = nameParts.length > 1 ? nameParts[0] : brandName;
            let secondPart = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            
            // Animate header and description
            headerFirstScrambler.setText(firstPart);
            if (secondPart) {
                headerSecondScrambler.setText(secondPart);
            } else {
                headerSecondScrambler.setText('');
            }
            descriptionScrambler.setText(brandData[brandId].description);
        });
        
        container.addEventListener('mouseleave', () => {
            // Animate back to original text
            headerFirstScrambler.setText(originalHeaderFirst);
            headerSecondScrambler.setText(originalHeaderSecond);
            descriptionScrambler.setText(originalDescription);
        });
    });
}); 