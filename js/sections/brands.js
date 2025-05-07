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
    const navButtons = document.querySelectorAll('.brand-nav-btn');
    const brandCards = document.querySelectorAll('.brand-card');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Skip if already active
            if (button.classList.contains('active')) return;
            
            // Get target brand
            const targetBrand = button.getAttribute('data-target');
            
            // Update active classes on buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
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
    // Add hover effects to brand cards
    const brandCards = document.querySelectorAll('.brand-card');
    
    brandCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) return;
            
            const video = card.querySelector('.brand-video');
            // Make video slightly more visible on hover
            if (video) {
                video.style.opacity = '0.3';
                video.style.filter = 'blur(1px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const video = card.querySelector('.brand-video');
            // Reset video opacity when not hovering
            if (video) {
                video.style.opacity = '0.2';
                video.style.filter = 'blur(2px)';
            }
        });
    });
    
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
        
        // Animate the navigation buttons
        gsap.from('.brand-navigation', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.brands-showcase',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }
} 