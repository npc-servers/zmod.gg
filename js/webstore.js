// Webstore functionality for ZMod website
class Webstore {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupWebstoreButton();
        this.setupAnimations();
    }
    
    setupWebstoreButton() {
        const webstoreButton = document.querySelector('.webstore-button');
        
        if (webstoreButton) {
            webstoreButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Add click animation
                webstoreButton.style.transform = 'translateY(2px)';
                setTimeout(() => {
                    webstoreButton.style.transform = 'translateY(-2px)';
                }, 100);
                
                // Placeholder for webstore URL - replace with actual URL when available
                const webstoreUrl = '#webstore'; // Replace with actual webstore URL
                
                // For now, just show an alert or redirect to a placeholder
                // In production, this would navigate to the actual webstore
                console.log('Navigating to webstore:', webstoreUrl);
                
                // Uncomment the line below when you have an actual webstore URL
                // window.open(webstoreUrl, '_blank');
                
                // Temporary alert for demonstration
                alert('Webstore coming soon! Stay tuned for exclusive supporter benefits.');
            });
        }
    }
    
    setupAnimations() {
        // Add animation for supporter count
        this.setupSupporterCountAnimation();
        
        // Add intersection observer for benefit items animation
        const benefitItems = document.querySelectorAll('.benefit-item');
        
        if (benefitItems.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger the animation of benefit items
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 150);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            benefitItems.forEach(item => {
                // Set initial state for animation
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                observer.observe(item);
            });
        }
        
        // Add animation for CTA section
        const ctaContent = document.querySelector('.cta-content');
        
        if (ctaContent) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            // Set initial state for animation
            ctaContent.style.opacity = '0';
            ctaContent.style.transform = 'translateX(50px)';
            ctaContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            observer.observe(ctaContent);
        }
        
        // Hover effects removed per user request
    }
    
    setupSupporterCountAnimation() {
        const supporterCount = document.querySelector('.supporter-count');
        
        if (supporterCount) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCount(entry.target, 0, 170, 2000);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(supporterCount);
        }
    }
    
    animateCount(element, start, end, duration) {
        const startTime = performance.now();
        const originalText = element.textContent;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = currentCount + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText; // Restore original text
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Method to update webstore URL when it becomes available
    updateWebstoreUrl(url) {
        const webstoreButton = document.querySelector('.webstore-button');
        if (webstoreButton) {
            webstoreButton.href = url;
            webstoreButton.target = '_blank';
        }
    }
    
    // Method to add custom benefits dynamically
    addBenefit(title, description) {
        const benefitsList = document.querySelector('.benefits-list');
        
        if (benefitsList) {
            const benefitItem = document.createElement('div');
            benefitItem.className = 'benefit-item';
            benefitItem.innerHTML = `
                <div class="benefit-text">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            `;
            
            benefitsList.appendChild(benefitItem);
            
            // Apply animations to the new item
            benefitItem.style.opacity = '0';
            benefitItem.style.transform = 'translateY(30px)';
            benefitItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Trigger animation
            setTimeout(() => {
                benefitItem.style.opacity = '1';
                benefitItem.style.transform = 'translateY(0)';
            }, 100);
            
            // Hover effects removed per user request
        }
    }
    
    
    
}

// Export the Webstore class for use in main.js
window.Webstore = Webstore;