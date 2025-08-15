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
            toggleButton.addEventListener('click', () => {
                this.toggleSubGuidelines();
            });
        }
    }

    toggleSubGuidelines() {
        const toggleButton = document.querySelector('.server-guidelines-toggle');
        const subGuidelines = document.querySelector('.server-guidelines');
        
        if (toggleButton && subGuidelines) {
            // Toggle the classes
            toggleButton.classList.toggle('expanded');
            subGuidelines.classList.toggle('collapsed');
            
            // Update ARIA attributes for accessibility
            const isExpanded = !subGuidelines.classList.contains('collapsed');
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
