// Community Guidelines JavaScript Module
class Community {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
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
