// Community Guidelines JavaScript Module
class Community {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleHashChange(); // Check for existing hash on page load
        window.addEventListener('hashchange', () => this.handleHashChange());
        console.log('Community module initialized');
    }

    bindEvents() {
        // Get the toggle button
        const toggleButton = document.querySelector('.server-guidelines-toggle');
        const subGuidelines = document.querySelector('.server-guidelines');
        
        if (toggleButton && subGuidelines) {
            toggleButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleSubGuidelines();
            });
        }

        // Handle clicks on individual guideline boxes to prevent unwanted navigation
        const guidelineBoxes = document.querySelectorAll('.server-guideline-box');
        guidelineBoxes.forEach(box => {
            box.addEventListener('click', (event) => {
                event.preventDefault();
                // Here you can add functionality to navigate to actual guideline pages
                console.log('Guideline clicked:', box.querySelector('.server-guideline-title').textContent);
            });
        });

        // Handle FAQ item clicks
        this.bindFAQEvents();
    }

    bindFAQEvents() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            // Add copy link functionality to paperclip icons
            const paperclipIcon = item.querySelector('.faq-paperclip');
            if (paperclipIcon) {
                paperclipIcon.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.copyFAQLink(item);
                });
            }
        });
    }

    copyFAQLink(faqItem) {
        const faqId = faqItem.id;
        if (faqId) {
            const currentUrl = new URL(window.location);
            currentUrl.hash = faqId;
            const linkToCopy = currentUrl.toString();
            
            // Copy to clipboard
            navigator.clipboard.writeText(linkToCopy).then(() => {
                this.showCopyFeedback(faqItem);
            }).catch(() => {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(linkToCopy, faqItem);
            });
        }
    }

    fallbackCopyToClipboard(text, faqItem) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showCopyFeedback(faqItem);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    }

    showCopyFeedback(faqItem) {
        const paperclipButton = faqItem.querySelector('.faq-paperclip');
        if (paperclipButton) {
            // Add the copied class to change the icon color to green
            paperclipButton.classList.add('copied');
            
            // Remove the copied class after 2 seconds to return to white
            setTimeout(() => {
                paperclipButton.classList.remove('copied');
            }, 2000);
        }
    }

    // Method to handle URL hash changes
    handleHashChange() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#faq-')) {
            const faqId = hash.substring(1);
            
            // Scroll to the FAQ item
            const faqItem = document.getElementById(faqId);
            if (faqItem) {
                // Use a small delay to ensure the page is ready
                setTimeout(() => {
                    // Get the element's position and dimensions
                    const elementRect = faqItem.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const elementHeight = elementRect.height;
                    const windowHeight = window.innerHeight;
                    
                    // Calculate scroll position to perfectly center the element
                    const scrollPosition = elementTop - (windowHeight / 2) + (elementHeight / 2);
                    
                    // Scroll to the calculated position
                    window.scrollTo({
                        top: Math.max(0, scrollPosition),
                        behavior: 'smooth'
                    });
                    
                    // Add highlight effect after scrolling starts
                    setTimeout(() => {
                        this.highlightFAQItem(faqItem);
                    }, 100);
                }, 100);
            }
        }
    }

    highlightFAQItem(faqItem) {
        // Add highlight class
        faqItem.classList.add('highlighted');
        
        // Remove highlight class after animation completes
        setTimeout(() => {
            faqItem.classList.remove('highlighted');
        }, 2000);
    }

    toggleSubGuidelines() {
        const toggleButton = document.querySelector('.server-guidelines-toggle');
        const subGuidelines = document.querySelector('.server-guidelines');
        
        if (toggleButton && subGuidelines) {
            const isCurrentlyCollapsed = subGuidelines.classList.contains('collapsed');
            
            if (isCurrentlyCollapsed) {
                // Expanding: first remove collapsed class to measure height
                subGuidelines.classList.remove('collapsed');
                const fullHeight = subGuidelines.scrollHeight;
                
                // Set height to 0 temporarily to animate from
                subGuidelines.style.height = '0px';
                
                // Force reflow
                subGuidelines.offsetHeight;
                
                // Animate to full height (including padding)
                subGuidelines.style.height = fullHeight + 'px';
                
                // Clean up after animation
                setTimeout(() => {
                    subGuidelines.style.height = 'auto';
                }, 400);
                
            } else {
                // Collapsing: set explicit height first
                const currentHeight = subGuidelines.scrollHeight;
                subGuidelines.style.height = currentHeight + 'px';
                
                // Force reflow
                subGuidelines.offsetHeight;
                
                // Animate to 0 height
                subGuidelines.style.height = '0px';
                
                // Add collapsed class after a brief delay to allow height animation to start
                setTimeout(() => {
                    subGuidelines.classList.add('collapsed');
                }, 10);
            }
            
            // Toggle button state
            toggleButton.classList.toggle('expanded');
            
            // Update ARIA attributes for accessibility
            const isExpanded = !isCurrentlyCollapsed;
            toggleButton.setAttribute('aria-expanded', isExpanded);
            
            // Update the arrow content
            const arrow = toggleButton.querySelector('.toggle-arrow');
            if (arrow) {
                if (isExpanded) {
                    // Show dash text for collapse
                    arrow.innerHTML = '—';
                    arrow.classList.add('text-mode');
                } else {
                    // Show SVG arrow for expand
                    arrow.innerHTML = '<img src="assets/svgs/arrow_down.svg" alt="" class="toggle-arrow-icon">';
                    arrow.classList.remove('text-mode');
                }
            }
        }
    }

    // Public method to check if sub-guidelines are expanded
    isExpanded() {
        const subGuidelines = document.querySelector('.server-guidelines');
        return subGuidelines && !subGuidelines.classList.contains('collapsed');
    }

    // Public method to expand sub-guidelines
    expandSubGuidelines() {
        const toggleButton = document.querySelector('.server-guidelines-toggle');
        const subGuidelines = document.querySelector('.server-guidelines');
        
        if (toggleButton && subGuidelines && subGuidelines.classList.contains('collapsed')) {
            this.toggleSubGuidelines();
        }
    }

    // Public method to collapse sub-guidelines
    collapseSubGuidelines() {
        const toggleButton = document.querySelector('.server-guidelines-toggle');
        const subGuidelines = document.querySelector('.server-guidelines');
        
        if (toggleButton && subGuidelines && !subGuidelines.classList.contains('collapsed')) {
            this.toggleSubGuidelines();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Community;
}
