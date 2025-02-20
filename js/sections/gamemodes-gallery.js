gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const showcaseItems = gsap.utils.toArray('.showcase-item');
    const progressBar = document.querySelector('.progress-bar');
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 5000; // Duration for each showcase item in milliseconds
    let progressTween;
    let showcaseInterval;
    let isVisible = false;
    let hasStarted = false;

    function updateShowcase(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        // Reset progress bar
        if (progressTween) progressTween.kill();
        gsap.set(progressBar, { width: '0%' });

        // Remove active class from current item
        showcaseItems[currentIndex].classList.remove('active');

        // Add active class to new item
        showcaseItems[newIndex].classList.add('active');

        // Update current index
        currentIndex = newIndex;

        // Animate progress bar if not on the last item
        if (currentIndex < showcaseItems.length - 1) {
            progressTween = gsap.to(progressBar, {
                width: '100%',
                duration: animationDuration / 1000,
                ease: 'none'
            });
        }

        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function startShowcase() {
        if (showcaseInterval) clearInterval(showcaseInterval);
        
        showcaseInterval = setInterval(() => {
            if (currentIndex < showcaseItems.length - 1) {
                updateShowcase(currentIndex + 1);
            }
        }, animationDuration);
    }

    function stopShowcase() {
        if (showcaseInterval) clearInterval(showcaseInterval);
        if (progressTween) progressTween.kill();
    }

    function resumeShowcase() {
        if (!isVisible) return;
        
        // If we're on the last slide, start from the beginning
        if (currentIndex >= showcaseItems.length - 1) {
            updateShowcase(0);
            startShowcase();
        } else {
            // Continue the progress bar from its current position
            const currentProgress = parseFloat(progressBar.style.width) || 0;
            const remainingDuration = (animationDuration / 1000) * (1 - (currentProgress / 100));
            
            progressTween = gsap.to(progressBar, {
                width: '100%',
                duration: remainingDuration,
                ease: 'none',
                onComplete: () => {
                    updateShowcase(currentIndex + 1);
                }
            });
            
            // Start a new interval that begins after the current animation completes
            if (showcaseInterval) clearInterval(showcaseInterval);
            showcaseInterval = setInterval(() => {
                if (currentIndex < showcaseItems.length - 1) {
                    updateShowcase(currentIndex + 1);
                }
            }, animationDuration);
        }
    }

    function initializeShowcase() {
        if (hasStarted || !isVisible) return;
        hasStarted = true;
        updateShowcase(0);
        startShowcase();
    }

    // Create scroll trigger for the section
    ScrollTrigger.create({
        trigger: '.gamemodes-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
            isVisible = true;
            if (!hasStarted) {
                initializeShowcase();
            } else {
                resumeShowcase();
            }
        },
        onLeave: () => {
            isVisible = false;
            stopShowcase();
        },
        onEnterBack: () => {
            isVisible = true;
            resumeShowcase();
        },
        onLeaveBack: () => {
            isVisible = false;
            stopShowcase();
        }
    });

    // Handle view more button click
    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            // Add your view more functionality here
            console.log('View more clicked');
        });
    }
}); 