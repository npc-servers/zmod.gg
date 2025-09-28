// Community Guidelines Page JavaScript Module
class CommunityGuidelines {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
        console.log('Community Guidelines module initialized');
    }

    bindEvents() {
        // Bind category toggle events
        const categoryToggles = document.querySelectorAll('.category-toggle');
        categoryToggles.forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleCategory(toggle);
            });
        });

        // Bind keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.collapseAllCategories();
            }
        });

        // Bind smooth scrolling for any anchor links
        this.bindSmoothScrolling();
    }

    toggleCategory(toggle) {
        const category = toggle.closest('.guideline-category');
        const content = category.querySelector('.category-content');
        const arrow = toggle.querySelector('.category-arrow');
        
        const isExpanded = toggle.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse the category
            this.collapseCategory(toggle, content, arrow);
        } else {
            // Expand the category
            this.expandCategory(toggle, content, arrow);
        }
    }

    expandCategory(toggle, content, arrow) {
        // Add expanded class to toggle
        toggle.classList.add('expanded');
        
        // Set initial height to 0 for smooth animation
        content.style.maxHeight = '0px';
        content.style.padding = '0 2rem';
        
        // Force reflow
        content.offsetHeight;
        
        // Get the full height needed
        const fullHeight = content.scrollHeight;
        
        // Animate to full height
        content.style.maxHeight = fullHeight + 'px';
        content.style.padding = '0 2rem 2rem 2rem';
        
        // Add expanded class to content after animation starts
        setTimeout(() => {
            content.classList.add('expanded');
        }, 50);
        
        // Clean up after animation
        setTimeout(() => {
            content.style.maxHeight = 'none';
        }, 400);
        
        // Animate arrow rotation
        this.animateArrow(arrow, true);
        
        // Add smooth scroll to category if it's not fully visible
        setTimeout(() => {
            this.scrollToCategoryIfNeeded(toggle);
        }, 200);
    }

    collapseCategory(toggle, content, arrow) {
        // Remove expanded class from toggle
        toggle.classList.remove('expanded');
        
        // Get current height
        const currentHeight = content.scrollHeight;
        
        // Set explicit height for animation
        content.style.maxHeight = currentHeight + 'px';
        content.style.padding = '0 2rem 2rem 2rem';
        
        // Force reflow
        content.offsetHeight;
        
        // Animate to 0 height
        content.style.maxHeight = '0px';
        content.style.padding = '0 2rem';
        
        // Remove expanded class after animation starts
        setTimeout(() => {
            content.classList.remove('expanded');
        }, 50);
        
        // Animate arrow rotation
        this.animateArrow(arrow, false);
    }

    animateArrow(arrow, isExpanding) {
        if (isExpanding) {
            arrow.style.transform = 'rotate(180deg)';
            arrow.style.color = 'var(--color-white)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
            arrow.style.color = 'var(--color-red)';
        }
    }

    scrollToCategoryIfNeeded(toggle) {
        const rect = toggle.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if the toggle is not fully visible
        if (rect.top < 100 || rect.bottom > windowHeight - 100) {
            const scrollPosition = window.pageYOffset + rect.top - 100;
            
            window.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }

    collapseAllCategories() {
        const expandedToggles = document.querySelectorAll('.category-toggle.expanded');
        expandedToggles.forEach(toggle => {
            this.toggleCategory(toggle);
        });
    }

    expandAllCategories() {
        const collapsedToggles = document.querySelectorAll('.category-toggle:not(.expanded)');
        collapsedToggles.forEach(toggle => {
            this.toggleCategory(toggle);
        });
    }

    bindSmoothScrolling() {
        // Handle any anchor links for smooth scrolling
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        event.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    initializeAnimations() {
        // Initialize GSAP animations for page load
        if (typeof gsap !== 'undefined') {
            // Animate the header
            gsap.from('.guidelines-title', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power2.out'
            });

            gsap.from('.guidelines-subtitle', {
                duration: 1,
                y: 30,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out'
            });

            // Animate categories on scroll
            this.initializeScrollAnimations();
        }
    }

    initializeScrollAnimations() {
        if (typeof gsap !== 'undefined') {
            // Create scroll-triggered animations for categories
            const categories = document.querySelectorAll('.guideline-category');
            
            categories.forEach((category, index) => {
                gsap.from(category, {
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: category,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Animate help section
            gsap.from('.help-section', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.help-section',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }

    // Public methods for external control
    expandCategoryByName(categoryName) {
        const toggle = document.querySelector(`[data-category="${categoryName}"]`);
        if (toggle && !toggle.classList.contains('expanded')) {
            this.toggleCategory(toggle);
        }
    }

    collapseCategoryByName(categoryName) {
        const toggle = document.querySelector(`[data-category="${categoryName}"]`);
        if (toggle && toggle.classList.contains('expanded')) {
            this.toggleCategory(toggle);
        }
    }

    // Method to get current state
    getExpandedCategories() {
        const expandedToggles = document.querySelectorAll('.category-toggle.expanded');
        return Array.from(expandedToggles).map(toggle => 
            toggle.getAttribute('data-category')
        );
    }

    // Method to set specific categories as expanded
    setExpandedCategories(categoryNames) {
        // First collapse all
        this.collapseAllCategories();
        
        // Then expand specified ones
        categoryNames.forEach(name => {
            setTimeout(() => {
                this.expandCategoryByName(name);
            }, 100);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityGuidelines;
}

// Make available globally
window.CommunityGuidelines = CommunityGuidelines;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CommunityGuidelines();
});
