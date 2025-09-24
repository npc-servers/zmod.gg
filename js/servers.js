// Servers section functionality for ZMod website
class Servers {
    constructor() {
        this.currentGamemodeIndex = 0;
        this.rotationInterval = null;
        this.isTransitioning = false; // Add flag to prevent rapid clicking
        this.lastManualInteraction = 0; // Track last manual interaction time
        this.gamemodes = [
            {
                id: 'zgrad',
                name: 'ZGRAD',
                shortDescription: 'Experience intense tactical gameplay in our flagship survival server with realistic combat mechanics and strategic depth.',
                expandedDescription: 'ZGRAD (formerly Homigrad) is our flagship tactical survival experience featuring realistic combat mechanics, strategic base building, and intense PvP encounters. Players must scavenge for resources, craft weapons and equipment, and survive against both the environment and other players. With advanced ballistics, medical systems, and group dynamics, every decision matters in this unforgiving world where teamwork and strategy are essential for survival.',
                showcaseImage: 'assets/gamemodes/homigrad.png',
                sideImage: 'assets/gamemodes/sandbox.jpg',
                website: 'https://zgrad.gg',
                hasWebsite: true,
                serverGroupId: 'zgrad'
            },
            {
                id: 'horde',
                name: 'HORDE',
                shortDescription: 'Survive endless waves of enemies in this cooperative survival mode with friends.',
                expandedDescription: 'Face endless waves of increasingly difficult enemies in this cooperative survival experience. Team up with friends to build defenses, share resources, and survive as long as possible against relentless hordes. Features dynamic wave generation, progressive difficulty scaling, and strategic base building elements that require coordination and teamwork to master.',
                showcaseImage: 'assets/gamemodes/horde.jpg',
                sideImage: 'assets/gamemodes/mapsweepers.png',
                website: null,
                hasWebsite: false,
                serverGroupId: 'horde'
            },
            {
                id: 'sandbox',
                name: 'NPC ZOMBIES VS. PLAYERS',
                shortDescription: 'Classic zombie survival with NPC enemies and cooperative gameplay.',
                expandedDescription: 'Experience classic zombie survival gameplay with intelligent NPC enemies and cooperative multiplayer action. Build bases, craft weapons, and work together to survive against waves of zombies and other threats. Features advanced AI systems, dynamic spawning, and extensive customization options for a unique survival experience every time you play.',
                showcaseImage: 'assets/gamemodes/sandbox.jpg',
                sideImage: 'assets/gamemodes/horde.jpg',
                website: 'https://npcz.gg',
                hasWebsite: true,
                serverGroupId: 'sandbox'
            },
            {
                id: 'mapsweepers',
                name: 'MAP SWEEPERS',
                shortDescription: 'Strategic team-based gameplay with unique mechanics and objectives.',
                expandedDescription: 'Engage in strategic team-based combat with unique map control mechanics and objective-based gameplay. Teams must work together to secure territory, complete objectives, and outmaneuver their opponents using tactical coordination and strategic thinking. Features dynamic map elements, specialized roles, and competitive gameplay designed for skilled players.',
                showcaseImage: 'assets/gamemodes/mapsweepers.png',
                sideImage: 'assets/gamemodes/homigrad.png',
                website: null,
                hasWebsite: false,
                serverGroupId: 'mapsweepers'
            }
        ];
        this.init();
    }
    
    init() {
        this.initializeServerShowcase();
        this.initializeContentButtons();
        this.startRotation();
    }
    
    // Initialize server showcase functionality
    initializeServerShowcase() {
        this.updateGamemodeDisplay(0);
        this.updateButtonsDisplay();
        
        // Handle server button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('server-button')) {
                e.preventDefault();
                this.handleViewServer();
            }
        });
    }
    
    // Update the gamemode display
    updateGamemodeDisplay(index) {
        const gamemode = this.gamemodes[index];
        const serverContent = document.querySelector('.server-content');
        const contentDescription = document.querySelectorAll('.content-description');
        
        if (serverContent && gamemode) {
            // Add transition class
            serverContent.classList.add('transitioning');
            
            // Update after transition
            setTimeout(() => {
                // Update main showcase
                serverContent.innerHTML = `
                    <div class="server-info">
                        <h3 class="server-title">${gamemode.name}</h3>
                        <p class="server-description">${gamemode.shortDescription}</p>
                        <a href="#" class="server-button">View Server</a>
                    </div>
                    <div class="server-background" style="background-image: url('${gamemode.showcaseImage}');"></div>
                `;
                
                // Side image removed - no longer needed
                
                // Update expanded description
                if (contentDescription.length > 0) {
                    contentDescription[0].textContent = gamemode.expandedDescription;
                    if (contentDescription.length > 1) {
                        contentDescription[1].textContent = 'Our dedicated development team continuously works to improve and expand our offerings, ensuring fresh content and innovative features that keep our community engaged and excited about what\'s next.';
                    }
                }
                
                // Remove transition class
                serverContent.classList.remove('transitioning');
                
                // Update buttons display after content is updated
                this.updateButtonsDisplay();
            }, 250);
        }
    }
    
    // Update buttons display based on current gamemode
    updateButtonsDisplay() {
        const currentGamemode = this.gamemodes[this.currentGamemodeIndex];
        const contentButtons = document.querySelector('.content-buttons');
        
        if (contentButtons && currentGamemode) {
            if (currentGamemode.hasWebsite) {
                // Show both buttons
                contentButtons.innerHTML = `
                    <button class="content-button" data-action="view-website">VIEW WEBSITE</button>
                    <button class="content-button" data-action="next-gamemode">NEXT</button>
                `;
                contentButtons.classList.remove('single-button');
            } else {
                // Show only NEXT button
                contentButtons.innerHTML = `
                    <button class="content-button" data-action="next-gamemode">NEXT</button>
                `;
                contentButtons.classList.add('single-button');
            }
        }
    }
    
    // Start automatic rotation
    startRotation() {
        // Clear any existing interval first
        this.stopRotation();
        
        // Rotate every 8 seconds
        this.rotationInterval = setInterval(() => {
            // Don't auto-advance if we're transitioning or user recently interacted
            if (this.isTransitioning) {
                return;
            }
            
            // Check if user interacted recently (within last 100ms)
            const timeSinceLastInteraction = Date.now() - this.lastManualInteraction;
            if (timeSinceLastInteraction < 100) {
                return;
            }
            
            this.nextGamemode();
        }, 8000);
    }
    
    // Stop automatic rotation
    stopRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }
    
    // Go to next gamemode
    nextGamemode() {
        // Prevent rapid clicking during transitions
        if (this.isTransitioning) {
            return;
        }
        
        this.isTransitioning = true;
        this.currentGamemodeIndex = (this.currentGamemodeIndex + 1) % this.gamemodes.length;
        this.updateGamemodeDisplay(this.currentGamemodeIndex);
        
        // Reset transition flag after the display update completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300); // Slightly longer than the transition time (250ms)
    }
    
    // Handle view server button click
    handleViewServer() {
        const currentGamemode = this.gamemodes[this.currentGamemodeIndex];
        
        // Wait a moment to ensure server browser is loaded, then highlight and center
        setTimeout(() => {
            this.highlightServerGroup(currentGamemode.serverGroupId);
        }, 100);
    }
    
    // Highlight specific server group in browser
    highlightServerGroup(serverGroupId) {
        // Remove existing highlights
        const existingHighlights = document.querySelectorAll('.server-highlight');
        existingHighlights.forEach(el => el.classList.remove('server-highlight'));
        
        // Find and highlight the target server
        const serverCards = document.querySelectorAll('.server-card, .server-group-main');
        let targetCard = null;
        
        serverCards.forEach(card => {
            const serverName = card.querySelector('.server-name, .server-group-name');
            if (serverName) {
                const name = serverName.textContent.toLowerCase();
                const shouldHighlight = this.shouldHighlightServer(name, serverGroupId);
                
                if (shouldHighlight) {
                    card.classList.add('server-highlight');
                    targetCard = card;
                    
                    // Remove highlight after 5 seconds
                    setTimeout(() => {
                        card.classList.remove('server-highlight');
                    }, 5000);
                }
            }
        });
        
        // Center the highlighted server on screen
        if (targetCard) {
            this.centerServerOnScreen(targetCard);
        }
    }
    
    // Center the target server card on screen
    centerServerOnScreen(serverCard) {
        // Use smooth scrolling to center the server card
        const cardRect = serverCard.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const cardCenter = cardRect.top + cardRect.height / 2;
        const screenCenter = windowHeight / 2;
        const scrollOffset = cardCenter - screenCenter;
        
        // Scroll to center the card
        window.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
        });
    }
    
    // Helper to determine if server should be highlighted
    shouldHighlightServer(serverName, targetGroupId) {
        switch (targetGroupId) {
            case 'zgrad':
                return serverName.includes('zgrad');
            case 'horde':
                return serverName.includes('horde');
            case 'sandbox':
                return serverName.includes('npc zombies') || serverName.includes('sandbox');
            case 'mapsweepers':
                return serverName.includes('map sweepers');
            default:
                return false;
        }
    }
    
    // Initialize content buttons functionality
    initializeContentButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-button')) {
                e.preventDefault();
                const action = e.target.getAttribute('data-action');
                
                switch (action) {
                    case 'view-website':
                        const currentGamemode = this.gamemodes[this.currentGamemodeIndex];
                        if (currentGamemode && currentGamemode.hasWebsite && currentGamemode.website) {
                            window.open(currentGamemode.website, '_blank');
                        }
                        break;
                    case 'next-gamemode':
                        // Prevent rapid clicking
                        if (this.isTransitioning) {
                            return;
                        }
                        
                        // Record manual interaction time
                        this.lastManualInteraction = Date.now();
                        
                        this.stopRotation();
                        this.nextGamemode();
                        
                        // Restart rotation with proper timing after manual navigation
                        // Wait for transition to complete, then start fresh 8-second cycle
                        setTimeout(() => {
                            this.startRotation();
                        }, 400); // Wait for transition + small buffer
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }
        });
    }
}

// Export the Servers class for use in main.js
window.Servers = Servers;