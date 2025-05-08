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
    const brandCards = document.querySelectorAll('.brand-card');
    const prevBtn = document.querySelector('.prev-brand');
    const nextBtn = document.querySelector('.next-brand');
    const currentBrandDisplay = document.querySelector('.current-brand');
    
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
    
    // Initialize current brand display
    updateCurrentBrandDisplay();
    
    // Previous brand button
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + brands.length) % brands.length;
        switchToBrand(currentIndex);
    });
    
    // Next brand button
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % brands.length;
        switchToBrand(currentIndex);
    });
    
    function switchToBrand(index) {
        // Hide all brand cards
        brandCards.forEach(card => {
            card.classList.remove('active');
            
            // Pause video for inactive cards
            const video = card.querySelector('.brand-video');
            if (video) {
                video.pause();
            }
        });
        
        // Show the target brand after a small delay for transition
        setTimeout(() => {
            brands[index].element.classList.add('active');
            
            // Play video for active card
            const video = brands[index].element.querySelector('.brand-video');
            if (video) {
                playVideo(video);
            }
            
            // Update the display
            updateCurrentBrandDisplay();
        }, 300);
    }
    
    function updateCurrentBrandDisplay() {
        // Get current brand ID and update the display
        const currentBrand = brands[currentIndex].id.toUpperCase();
        currentBrandDisplay.textContent = currentBrand;
    }
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