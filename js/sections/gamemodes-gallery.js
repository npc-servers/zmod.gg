import gamemodes from '../data/gamemodes.js';

gsap.registerPlugin(ScrollTrigger);

// Create scroll trigger for fade-in effect
ScrollTrigger.create({
    trigger: '.gamemodes-section',
    start: 'top 80%',
    end: 'top 20%',
    onUpdate: self => {
        gsap.to('.gamemodes-container', {
            opacity: self.progress,
            duration: 0.1,
            ease: 'none'
        });
        
        if (self.progress > 0.1) {
            document.querySelector('.gamemodes-section').classList.add('fade-in');
        } else {
            document.querySelector('.gamemodes-section').classList.remove('fade-in');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const showcaseContainer = document.querySelector('.gamemodes-showcase');
    const gamemodesContainer = document.querySelector('.gamemodes-container');
    
    // Corner elements removed
    
    // Clear existing content and generate from data
    showcaseContainer.innerHTML = '';
    
    // Triangle element removed
    
    // Add gamemode items
    const activeGamemodes = Object.values(gamemodes).filter(gamemode => gamemode.isActive);
    
    activeGamemodes.forEach((gamemode, index) => {
        const showcaseItem = document.createElement('div');
        showcaseItem.className = `showcase-item${index === 0 ? ' active' : ''}`;
        showcaseItem.dataset.gamemode = gamemode.id;
        
        showcaseItem.innerHTML = `
            <div class="showcase-content">
                <h2>${gamemode.name}</h2>
                <p>${gamemode.shortDescription}</p>
                <button class="check-it-out-btn">CHECK IT OUT <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="showcase-background">
                <img src="${gamemode.image}" alt="${gamemode.name} Gamemode">
            </div>
        `;
        
        showcaseContainer.appendChild(showcaseItem);
    });
    
    // Add view more item
    const viewMoreItem = document.createElement('div');
    viewMoreItem.className = 'showcase-item view-more';
    viewMoreItem.innerHTML = `
        <div class="showcase-content">
            <h2><span class="heading-first">DISCOVER</span> <span class="heading-second">MORE</span></h2>
            <p>Explore our full collection of unique gamemodes</p>
            <button class="view-more-btn">VIEW ALL GAMEMODES <i class="fas fa-arrow-right"></i></button>
        </div>
    `;
    showcaseContainer.appendChild(viewMoreItem);

    // Add navigation dots
    const gamemodesNav = document.createElement('div');
    gamemodesNav.className = 'gamemodes-nav';
    gamemodesNav.style.opacity = '1';
    
    // Create a dot for each active gamemode plus the "view more" section
    const totalItems = activeGamemodes.length + 1; // +1 for "view more"
    
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('div');
        dot.className = `gamemode-dot${i === 0 ? ' active' : ''}`;
        dot.dataset.index = i;
        
        // Add inner progress bar element
        const progressDiv = document.createElement('div');
        progressDiv.className = 'gamemode-dot-progress';
        dot.appendChild(progressDiv);
        
        // Add click event to navigate to the corresponding gamemode
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                stopShowcase(); // Stop auto-rotation
                updateShowcase(i);
                startShowcase(); // Restart auto-rotation
            }
        });
        
        gamemodesNav.appendChild(dot);
    }
    
    // Append to the gamemodes container instead of section for better positioning with section padding
    document.querySelector('.gamemodes-container').appendChild(gamemodesNav);

    const showcaseItems = gsap.utils.toArray('.showcase-item');
    const gamemodeDots = gsap.utils.toArray('.gamemode-dot');
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 5000; // Duration for each showcase item in milliseconds
    let showcaseInterval;
    let isVisible = false;
    let hasStarted = false;
    let dotProgressAnimation = null; // Variable to store the dot progress GSAP animation

    function clearDotProgressAnimation() {
        if (dotProgressAnimation) {
            dotProgressAnimation.kill();
            dotProgressAnimation = null;
        }
        // Reset progress on all dots
        gamemodeDots.forEach(dot => {
            const progressEl = dot.querySelector('.gamemode-dot-progress');
            if (progressEl) {
                gsap.set(progressEl, { width: '0%' });
            }
        });
    }

    function animateDotProgress(dotElement) {
        clearDotProgressAnimation(); // Clear any existing animation first
        const progressEl = dotElement.querySelector('.gamemode-dot-progress');
        if (progressEl) {
            dotProgressAnimation = gsap.to(progressEl, {
                width: '100%',
                duration: animationDuration / 1000,
                ease: 'linear'
            });
        }
    }

    function updateShowcase(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        clearDotProgressAnimation(); // Clear progress on old dot

        showcaseItems[currentIndex].classList.remove('active');
        gamemodeDots[currentIndex].classList.remove('active');

        showcaseItems[newIndex].classList.add('active');
        gamemodeDots[newIndex].classList.add('active');

        currentIndex = newIndex;
        animateDotProgress(gamemodeDots[currentIndex]); // Animate progress on new active dot

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function startShowcase() {
        if (showcaseInterval) clearInterval(showcaseInterval);
        
        // Ensure current dot's animation is running or starts
        animateDotProgress(gamemodeDots[currentIndex]);

        showcaseInterval = setInterval(() => {
            // updateShowcase will handle the animation for the next dot
            if (currentIndex < showcaseItems.length - 1) {
                updateShowcase(currentIndex + 1);
            } else {
                updateShowcase(0);
            }
        }, animationDuration);
    }

    function stopShowcase() {
        if (showcaseInterval) clearInterval(showcaseInterval);
        clearDotProgressAnimation(); // Stop and reset dot progress animation
    }

    function resumeShowcase() {
        if (!isVisible) return;
        
        if (currentIndex >= showcaseItems.length - 1) {
            updateShowcase(0); // This will also start its progress animation
        } else {
            // Ensure current dot's animation restarts properly
            // updateShowcase(currentIndex) might not be ideal if no actual index change
            // Directly animating the current dot is better here.
        }
        startShowcase(); // This will call animateDotProgress for the current index and set interval
    }

    function initializeShowcase() {
        if (hasStarted || !isVisible) return;
        hasStarted = true;
        updateShowcase(0); // This will set the first item active and start its progress animation
        startShowcase(); // This sets the interval
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