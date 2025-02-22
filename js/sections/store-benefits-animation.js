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
    
    ScrollTrigger.create({
        trigger: benefitsContainer,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
            if (!isMobile) return; // Only use this logic for mobile

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

    // Desktop version remains the same
    if (!isMobile) {
        benefits.forEach((benefit) => {
            ScrollTrigger.create({
                trigger: benefit,
                start: "top 55%",
                end: "bottom 45%",
                onEnter: () => highlightBenefit(benefit),
                onLeave: () => {
                    const index = Array.from(benefits).indexOf(benefit);
                    if (index < benefits.length - 1) {
                        highlightBenefit(benefits[index + 1]);
                    }
                },
                onEnterBack: () => highlightBenefit(benefit),
                onLeaveBack: () => {
                    const index = Array.from(benefits).indexOf(benefit);
                    if (index > 0) {
                        highlightBenefit(benefits[index - 1]);
                    }
                }
            });
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