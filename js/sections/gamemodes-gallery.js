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
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const showcaseContainer = document.querySelector('.gamemodes-showcase');
    const gamemodesContainer = document.querySelector('.gamemodes-container');
    
    // Add corner elements
    const cornerTopRight = document.createElement('div');
    cornerTopRight.className = 'corner-top-right';
    gamemodesContainer.appendChild(cornerTopRight);
    
    const cornerBottomLeft = document.createElement('div');
    cornerBottomLeft.className = 'corner-bottom-left';
    gamemodesContainer.appendChild(cornerBottomLeft);
    
    // Clear existing content and generate from data
    showcaseContainer.innerHTML = '';
    
    // Triangle element removed
    
    // Add gamemode items
    Object.values(gamemodes).forEach((gamemode, index) => {
        if (gamemode.isActive) {
            const showcaseItem = document.createElement('div');
            showcaseItem.className = `showcase-item${index === 0 ? ' active' : ''}`;
            showcaseItem.dataset.gamemode = gamemode.id;
            
            showcaseItem.innerHTML = `
                <div class="showcase-content">
                    <h2>${gamemode.name}</h2>
                    <p>${gamemode.shortDescription}</p>
                    <button class="check-it-out-btn">CHECK IT OUT</button>
                </div>
                <div class="showcase-background">
                    <img src="${gamemode.image}" alt="${gamemode.name} Gamemode">
                </div>
            `;
            
            showcaseContainer.appendChild(showcaseItem);
        }
    });
    
    // Add view more item
    const viewMoreItem = document.createElement('div');
    viewMoreItem.className = 'showcase-item view-more';
    viewMoreItem.innerHTML = `
        <div class="showcase-content">
            <h2><span class="heading-first">DISCOVER</span> <span class="heading-second">MORE</span></h2>
            <p>Explore our full collection of unique gamemodes</p>
            <button class="view-more-btn">VIEW ALL GAMEMODES</button>
        </div>
    `;
    showcaseContainer.appendChild(viewMoreItem);

    const showcaseItems = gsap.utils.toArray('.showcase-item');
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 5000; // Duration for each showcase item in milliseconds
    let showcaseInterval;
    let isVisible = false;
    let hasStarted = false;

    function updateShowcase(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from current item
        showcaseItems[currentIndex].classList.remove('active');

        // Add active class to new item
        showcaseItems[newIndex].classList.add('active');

        // Update current index
        currentIndex = newIndex;

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
    }

    function resumeShowcase() {
        if (!isVisible) return;
        
        // If we're on the last slide, start from the beginning
        if (currentIndex >= showcaseItems.length - 1) {
            updateShowcase(0);
            startShowcase();
            return;
        }

        // Start fresh from the current slide
        updateShowcase(currentIndex);
        startShowcase();
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