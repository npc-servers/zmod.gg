gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const benefits = document.querySelectorAll('.benefit-text');
    let activeBenefit = null;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const highlightBenefit = (benefit) => {
        if (activeBenefit === benefit) return;
        
        // Unhighlight previous active benefit
        if (activeBenefit) {
            activeBenefit.classList.remove('highlighted');
            activeBenefit.querySelector('.benefit-highlight').style.transform = 'scaleX(0)';
        }
        
        // Highlight new benefit
        benefit.classList.add('highlighted');
        benefit.querySelector('.benefit-highlight').style.transform = 'scaleX(1)';
        activeBenefit = benefit;
    };

    // Create a single ScrollTrigger for the entire benefits container
    const benefitsContainer = document.querySelector('.store-benefits');
    let lastScrollPosition = 0;

    if (isMobile) {
        ScrollTrigger.create({
            trigger: benefitsContainer,
            start: "top center",
            end: "bottom center",
            onUpdate: (self) => {
                const currentScroll = window.scrollY;
                const scrollingDown = currentScroll > lastScrollPosition;
                const containerRect = benefitsContainer.getBoundingClientRect();
                const containerCenter = containerRect.top + containerRect.height / 2;
                
                // Find the benefit closest to the center of the viewport
                let closestBenefit = null;
                let closestDistance = Infinity;
                
                benefits.forEach((benefit) => {
                    const rect = benefit.getBoundingClientRect();
                    const benefitCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(benefitCenter - window.innerHeight / 2);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestBenefit = benefit;
                    }
                });
                
                if (closestBenefit) {
                    highlightBenefit(closestBenefit);
                }
                
                lastScrollPosition = currentScroll;
            }
        });
    } else {
        // Desktop version with single ScrollTrigger and progress-based highlighting
        const benefitsArray = Array.from(benefits);
        const totalBenefits = benefitsArray.length;
        
        ScrollTrigger.create({
            trigger: benefitsContainer,
            start: "top 70%",
            end: "bottom 30%",
            onUpdate: (self) => {
                // Calculate which benefit should be active based on scroll progress
                const progress = self.progress;
                const benefitIndex = Math.min(
                    Math.floor(progress * (totalBenefits + 0.5)),
                    totalBenefits - 1
                );
                
                // Add hysteresis to prevent rapid switching
                const currentIndex = activeBenefit ? benefitsArray.indexOf(activeBenefit) : -1;
                const threshold = 0.15; // Adjust this value to control sensitivity
                
                if (currentIndex === -1 || 
                    Math.abs(benefitIndex - currentIndex) >= 1 || 
                    Math.abs(progress - (currentIndex / (totalBenefits - 1))) > threshold) {
                    highlightBenefit(benefitsArray[benefitIndex]);
                }
            },
            scrub: 0.1
        });
    }

    // Initial highlight
    if (benefits.length > 0) {
        const firstBenefit = benefits[0];
        const rect = firstBenefit.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
            highlightBenefit(firstBenefit);
        }
    }

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (benefits.length > 0) {
                const firstBenefit = benefits[0];
                const rect = firstBenefit.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.6) {
                    highlightBenefit(firstBenefit);
                }
            }
        }, 150);
    });
}); 