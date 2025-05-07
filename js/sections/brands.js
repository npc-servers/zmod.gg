document.addEventListener('DOMContentLoaded', () => {
    initBrandsSection();
});

function initBrandsSection() {
    // Initialize brand videos
    initBrandVideos();
    
    // Set up brand navigation
    initBrandNavigation();
    
    // Initialize animations
    initBrandCardAnimations();
}

function initBrandVideos() {
    // Get all brand videos
    const brandVideos = document.querySelectorAll('.brand-video');
    
    // Ensure videos play properly
    brandVideos.forEach(video => {
        // Force load the video
        video.load();
        
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
        
        // Only try to play videos in active brand cards to save resources
        if (video.closest('.brand-card').classList.contains('active')) {
            playVideo(video);
        } else {
            // Pause videos in inactive cards
            video.pause();
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
    const tabButtons = document.querySelectorAll('.brand-tab');
    const brandCards = document.querySelectorAll('.brand-card');
    
    tabButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Skip if already active
            if (tab.classList.contains('active')) return;
            
            // Get target brand
            const targetBrand = tab.getAttribute('data-target');
            
            // Update active classes on tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            
            // Update brand cards
            brandCards.forEach(card => {
                const isCurrent = card.getAttribute('data-brand') === targetBrand;
                
                // Toggle visibility with classes
                card.classList.remove('active');
                
                if (isCurrent) {
                    // Show the target brand
                    setTimeout(() => {
                        card.classList.add('active');
                    }, 300); // Small delay for better transition
                    
                    // Play video for active card
                    const video = card.querySelector('.brand-video');
                    if (video) {
                        playVideo(video);
                    }
                } else {
                    // Pause video for inactive cards
                    const video = card.querySelector('.brand-video');
                    if (video) {
                        video.pause();
                    }
                }
            });
        });
    });
}

function initBrandCardAnimations() {
    // Remove hover effects that change video opacity/blur
    
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
        
        // Animate the tabs
        gsap.from('.brand-selector', {
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