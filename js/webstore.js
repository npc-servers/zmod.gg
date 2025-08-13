// Webstore functionality for ZMod website
class Webstore {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupWebstoreButton();
        this.setupAnimations();
        this.setupCarousel();
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
        
        // Add subtle hover effects for benefit items
        const hoverBenefitItems = document.querySelectorAll('.benefit-item');
        
        hoverBenefitItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.borderLeftColor = 'var(--color-red)';
                item.style.borderLeftWidth = '6px';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.borderLeftColor = 'var(--color-red)';
                item.style.borderLeftWidth = '4px';
            });
        });
    }
    
    setupSupporterCountAnimation() {
        const supporterCount = document.querySelector('.supporter-count');
        
        if (supporterCount) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCount(entry.target, 0, 160, 2000);
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
            
            // Add hover effects to the new item
            benefitItem.addEventListener('mouseenter', () => {
                benefitItem.style.borderLeftColor = 'var(--color-red)';
                benefitItem.style.borderLeftWidth = '6px';
            });
            
            benefitItem.addEventListener('mouseleave', () => {
                benefitItem.style.borderLeftColor = 'var(--color-red)';
                benefitItem.style.borderLeftWidth = '4px';
            });
        }
    }
    
    // GSAP Carousel functionality
    setupCarousel() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, using basic carousel');
            this.setupBasicCarousel();
            return;
        }
        
        const carousel = document.querySelector('.webstore-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        let isAnimating = false;
        
        // Set initial states
        gsap.set(slides, { opacity: 0 });
        gsap.set(slides[0], { opacity: 1 });
        
        // Function to animate to specific slide
        const showSlide = (index, direction = 1) => {
            if (isAnimating || index === currentSlide) return;
            
            isAnimating = true;
            const outgoingSlide = slides[currentSlide];
            const incomingSlide = slides[index];
            
            // Simple crossfade animation
            gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                    currentSlide = index;
                    
                    // Update indicators
                    indicators.forEach(indicator => indicator.classList.remove('active'));
                    indicators[index].classList.add('active');
                }
            })
            .to(outgoingSlide, { 
                opacity: 0, 
                duration: 0.15, 
                ease: "power2.inOut" 
            })
            .to(incomingSlide, { 
                opacity: 1, 
                duration: 0.15, 
                ease: "power2.inOut" 
            }, "-=0.1"); // Overlap animations slightly for smooth crossfade
        };
        
        // Function to go to next slide
        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % slides.length;
            const direction = 1; // Moving forward
            showSlide(nextIndex, direction);
        };
        
        // Function to go to previous slide
        const prevSlide = () => {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            const direction = -1; // Moving backward
            showSlide(prevIndex, direction);
        };
        
        // Start automatic slideshow with GSAP delayed call
        const startAutoSlide = () => {
            autoSlideInterval = gsap.delayedCall(4, () => {
                nextSlide();
                startAutoSlide(); // Recursive call for continuous loop
            });
        };
        
        // Stop automatic slideshow
        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                autoSlideInterval.kill();
                autoSlideInterval = null;
            }
        };
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const direction = index > currentSlide ? 1 : -1;
                showSlide(index, direction);
                stopAutoSlide();
                
                // Restart auto-slide after manual interaction with delay
                gsap.delayedCall(5, startAutoSlide);
            });
        });
        
        // Simple hover effects for carousel
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize first slide
        indicators[0].classList.add('active');
        startAutoSlide();
        
        // Store carousel controls for external access
        this.carouselControls = {
            showSlide,
            nextSlide,
            prevSlide,
            startAutoSlide,
            stopAutoSlide,
            getCurrentSlide: () => currentSlide,
            getTotalSlides: () => slides.length,
            isAnimating: () => isAnimating
        };
    }
    
    // Method to manually control carousel (for external use)
    goToSlide(index) {
        if (this.carouselControls && typeof index === 'number') {
            const direction = index > this.carouselControls.getCurrentSlide() ? 1 : -1;
            this.carouselControls.showSlide(index, direction);
        }
    }
    
    // Method to go to next slide (external use)
    nextSlide() {
        if (this.carouselControls) {
            this.carouselControls.nextSlide();
        }
    }
    
    // Method to go to previous slide (external use)
    prevSlide() {
        if (this.carouselControls) {
            this.carouselControls.prevSlide();
        }
    }
    
    // Method to pause/resume carousel
    pauseCarousel() {
        if (this.carouselControls) {
            this.carouselControls.stopAutoSlide();
        }
    }
    
    resumeCarousel() {
        if (this.carouselControls) {
            this.carouselControls.startAutoSlide();
        }
    }
    
    // Method to check if carousel is animating
    isCarouselAnimating() {
        return this.carouselControls ? this.carouselControls.isAnimating() : false;
    }
    
    // Basic carousel fallback (no GSAP)
    setupBasicCarousel() {
        const carousel = document.querySelector('.webstore-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        
        // Function to show specific slide
        const showSlide = (index) => {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentSlide = index;
        };
        
        // Function to go to next slide
        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };
        
        // Start automatic slideshow
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 4000);
        };
        
        // Stop automatic slideshow
        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
                stopAutoSlide();
                setTimeout(startAutoSlide, 5000); // Restart after 5 seconds
            });
        });
        
        // Pause auto-slide on hover, resume on mouse leave
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize carousel
        showSlide(0);
        startAutoSlide();
        
        // Store carousel controls for external access
        this.carouselControls = {
            showSlide,
            nextSlide,
            startAutoSlide,
            stopAutoSlide,
            getCurrentSlide: () => currentSlide,
            getTotalSlides: () => slides.length,
            isAnimating: () => false
        };
    }
}

// Export the Webstore class for use in main.js
window.Webstore = Webstore;