document.addEventListener('DOMContentLoaded', () => {
    initBrandsSection();
});

const SLIDESHOW_INTERVAL = 8000; // 8 seconds
let slideshowTimer = null;
let progressAnimation = null;
let isTransitioning = false;

function initBrandsSection() {
    // Initialize brand videos
    initBrandVideos();
    
    // Set up brand navigation
    initBrandNavigation();
    
    // Initialize animations
    initBrandCardAnimations();

    // Add click listener to the single NEXT indicator
    const nextIndicator = document.querySelector('.next-brand-indicator');
    const nextButton = document.querySelector('.next-brand'); // The main (hidden) next button

    if (nextIndicator && nextButton) {
        nextIndicator.addEventListener('click', () => {
            if (!isTransitioning) { 
                nextButton.click();
            }
        });
        nextIndicator.style.cursor = 'pointer'; // Add pointer cursor
    }

    // Start initial slideshow
    startSlideshowTimer(); // No longer pass activeCard
}

function initBrandVideos() {
    // Get all brand videos
    const brandVideos = document.querySelectorAll('.brand-video');
    
    // Ensure videos play properly
    brandVideos.forEach(video => {
        // Force load the video
        video.load();
        
        // Set rendering priority for smoother transitions
        video.style.willChange = 'opacity, transform';

        // Ensure video cannot be interacted with
        video.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Special handling for ZGRAD video
        if (video.closest('#zgrad-brand')) {
            // Make sure it always plays
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.controls = false;
            
            // Force play on canplay event for better autoplay compatibility
            video.addEventListener('canplay', () => {
                video.play().catch(e => console.log('Could not play ZGRAD video:', e));
            });
        }
        
        // Load and prepare all videos immediately but keep paused
        // This helps with smoother transitions between brands
        video.load();
        if (!video.closest('.brand-card').classList.contains('active')) {
            // Pause videos in inactive cards but keep them ready
            video.currentTime = 0;
            video.pause();
        } else {
            // Play active video
            playVideo(video);
        }
        
        // Reset video if it ends (backup for loop attribute)
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            if (video.closest('.brand-card').classList.contains('active')) {
                video.play().catch(e => console.log('Could not restart video:', e));
            }
        });
    });
}

function playVideo(video) {
    // Try to play the video
    video.play().catch(e => {
        console.log('Auto-play was prevented for video:', e);
        // Add play button if autoplay is blocked
        addPlayButton(video);
    });
}

function addPlayButton(video) {
    const parent = video.closest('.brand-video-container');
    
    // Only add a play button if it doesn't already exist
    if (!parent.querySelector('.video-play-btn')) {
        const playButton = document.createElement('button');
        playButton.classList.add('video-play-btn');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        
        playButton.addEventListener('click', () => {
            video.play().then(() => {
                playButton.style.display = 'none';
            }).catch(e => {
                console.log('Could not play video:', e);
            });
        });
        
        parent.appendChild(playButton);
    }
}

function initBrandNavigation() {
    const brandCards = document.querySelectorAll('.brand-card');
    const prevBtn = document.querySelector('.prev-brand');
    const nextBtn = document.querySelector('.next-brand');
    
    // Brand data
    const brands = Array.from(brandCards).map(card => {
        return {
            id: card.getAttribute('data-brand'),
            element: card
        };
    });
    
    // Track current brand index
    let currentIndex = brands.findIndex(brand => brand.element.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;
    
    // Previous brand button
    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        
        const newIndex = (currentIndex - 1 + brands.length) % brands.length;
        switchToBrand(newIndex, 'prev');
    });
    
    // Next brand button
    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        
        const newIndex = (currentIndex + 1) % brands.length;
        switchToBrand(newIndex, 'next');
    });
    
    function switchToBrand(index, direction = 'next') {
        if (isTransitioning) return;
        isTransitioning = true;

        clearSlideshowTimer(); // Clear existing timer
        
        const currentCard = brands[currentIndex].element;
        const newCard = brands[index].element;
        
        // Get the brand names for animation
        const currentBrandName = brands[currentIndex].id.toUpperCase();
        const newBrandName = brands[index].id.toUpperCase();
        
        // Preload the new video
        const newVideo = newCard.querySelector('.brand-video');
        if (newVideo) {
            newVideo.load();
            if (newVideo.paused) {
                // Set currentTime to 0 but don't play yet
                newVideo.currentTime = 0;
            }
        }
        
        // Simplify the approach - add both cards to the DOM with proper visibility
        // This ensures grid overlay and videos are both visible
        currentCard.classList.add('transitioning-out');
        newCard.classList.add('transitioning-in');
        
        // Make visible for transition, but start with opacity 0
        newCard.style.opacity = '0';
        newCard.style.visibility = 'visible';
        
        // Get elements to animate - content containers and their children
        const currentContent = currentCard.querySelector('.brand-content');
        const newContent = newCard.querySelector('.brand-content');
        
        // Get specific elements for more detailed animations
        const currentLogo = currentCard.querySelector('.brand-logo');
        const newLogo = newCard.querySelector('.brand-logo');
        const currentInfo = currentCard.querySelector('.brand-info');
        const newInfo = newCard.querySelector('.brand-info');
        const currentText = currentCard.querySelector('.brand-info p');
        const newText = newCard.querySelector('.brand-info p');
        const currentButton = currentCard.querySelector('.explore-brand-btn');
        const newButton = newCard.querySelector('.explore-brand-btn');
        const currentTitle = currentCard.querySelector('.brand-info h3');
        const newTitle = newCard.querySelector('.brand-info h3');
        
        // Determine if it's mobile view for animation changes
        const isMobileView = window.innerWidth < 993;

        // Create a timeline for the transition
        const tl = gsap.timeline({
            onComplete: () => {
                // Complete the transition
                currentCard.classList.remove('active', 'transitioning-out');
                newCard.classList.add('active');
                newCard.classList.remove('transitioning-in');
                
                // Only clear the specific styles we added
                currentCard.style.opacity = '';
                currentCard.style.visibility = '';
                
                newCard.style.opacity = '';
                newCard.style.visibility = '';
                
                // Update the current index
                currentIndex = index;
                
                // Handle videos after the transition
                const currentVideo = currentCard.querySelector('.brand-video');
                if (currentVideo) {
                    currentVideo.pause();
                }
                
                if (newVideo) {
                    playVideo(newVideo);
                }
                
                // Reset transition state
                isTransitioning = false;

                // Start slideshow timer for the new card
                startSlideshowTimer(); // No longer pass newCard
            }
        });
        
        // Animation sequence
        
        // 1. Animate out the current logo
        tl.to(currentLogo, {
            x: isMobileView ? 0 : (direction === 'next' ? -80 : 80),
            y: isMobileView ? -50 : 0, // Animate up on mobile
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        }, 0);
        
        // 2. Animate out the current title, text and button with staggered timing
        tl.to(currentTitle, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, 0.05);
        
        tl.to(currentText, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, 0.1);
        
        tl.to(currentButton, {
            y: -15,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, 0.2);
        
        // 3. Fade out the current card (not fully transparent)
        tl.to(currentCard, {
            opacity: 0.1, // Keep it slightly visible for smoother video transition if desired
            duration: 0.4,
            ease: "power2.inOut"
        }, 0.3);
        
        // 4. Fade in the new card
        tl.to(newCard, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut"
        }, 0.4);
        
        // 5. Animate in the new logo, title, text and button with staggered timing
        tl.fromTo(newLogo, 
            { 
                x: isMobileView ? 0 : (direction === 'next' ? 80 : -80),
                y: isMobileView ? 50 : 0, // Animate from bottom on mobile
                opacity: 0 
            },
            { 
                x: 0, 
                y: 0,
                opacity: 1, 
                duration: 0.5, 
                ease: "power2.out" 
            }, 
            0.45
        );
        
        tl.fromTo(newTitle, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 
            0.5
        );
        
        tl.fromTo(newText, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 
            0.55
        );
        
        tl.fromTo(newButton, 
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 
            0.65
        );
        
        // Start the animation
        tl.play();
    }
}

function clearSlideshowTimer() {
    if (slideshowTimer) {
        clearTimeout(slideshowTimer);
        slideshowTimer = null;
    }
    if (progressAnimation) {
        progressAnimation.kill(); // Kill GSAP animation if in progress
        progressAnimation = null;
    }
    // Reset progress bars on all cards
    document.querySelectorAll('.next-brand-progress-bar').forEach(bar => {
        gsap.set(bar, { width: '0%' });
    });
}

function startSlideshowTimer() { // Removed activeCard parameter
    clearSlideshowTimer(); 

    const progressBar = document.querySelector('.next-brand-indicator .next-brand-progress-bar'); // Select the single progress bar
    if (!progressBar) return;

    // Animate the progress bar
    progressAnimation = gsap.to(progressBar, {
        width: '100%',
        duration: SLIDESHOW_INTERVAL / 1000,
        ease: 'linear',
        onComplete: () => {
            // When progress bar is full, switch to the next brand
            const nextButton = document.querySelector('.next-brand');
            if (nextButton) {
                nextButton.click();
            }
        }
    });

    // Set a timeout to switch brands if GSAP animation doesn't trigger (fallback)
    slideshowTimer = setTimeout(() => {
        const nextButton = document.querySelector('.next-brand');
        if (nextButton) {
            nextButton.click();
        }
    }, SLIDESHOW_INTERVAL);
}

function initBrandCardAnimations() {
    // If GSAP is available, add scroll animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate the active brand card when it comes into view
        const activeCard = document.querySelector('.brand-card.active');
        if (activeCard) {
            gsap.from(activeCard, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: activeCard,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
        
        // Animate the brand navigation
        gsap.from('.brand-navigation', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: '.brands-showcase',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }
} 