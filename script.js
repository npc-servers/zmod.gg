document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScrollTop = 0;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    // Smooth scroll handling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            lenis.scrollTo(section, {
                offset: 0,
                duration: 1.2
            });
        });
    });

    // Scroll indicator fade
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down and past threshold
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translate(-50%, 20px)';
        } else if (scrollTop < 50) {
            // Back at top
            scrollIndicator.style.opacity = '0.6';
            scrollIndicator.style.transform = 'translate(-50%, 0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // RAF animation loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
});

document.addEventListener('DOMContentLoaded', function() {
    const servers = [
        {
            id: 'zgrad1',
            title: 'ZGRAD',
            number: 1,
            ip: '193.243.190.18',
            port: 27066,
            region: 'US',
            description: 'HOMIGRAD - All Gamemodes',
            link: '/us1/connect.html'
        },
        {
            id: 'hh1',
            title: 'Harrisons Homigrad',
            number: 1,
            ip: '193.243.190.18',
            port: 27051,
            region: 'US',
            description: 'HOMIGRAD - All Gamemodes',
            link: '/hh1/connect.html'
        },
        {
            id: 'hh2',
            title: 'Harrisons Homigrad',
            number: 2,
            ip: '193.243.190.18',
            port: 27052,
            region: 'US',
            description: 'HOMIGRAD - All Gamemodes',
            link: '/hh2/connect.html'
        },
        {
            id: 'hh3',
            title: 'Harrisons Homigrad',
            number: 3,
            ip: '193.243.190.18',
            port: 27053,
            region: 'US',
            description: 'HOMIGRAD - Homicide Only',
            link: '/hh3/connect.html'
        },
        {
            id: 'npcz',
            title: 'NPC Zombies Vs. Players',
            ip: '193.243.190.18',
            port: 27015,
            region: 'US',
            description: 'Sandbox',
            link: '/npcz/connect.html'
        },
        {
            id: 'zbox',
            title: 'ZBOX',
            ip: '193.243.190.18',
            port: 27064,
            region: 'US',
            description: 'Sandbox',
            link: '/zbox/connect.html'
        },
        {
            id: 'shelter',
            title: 'Official Server',
            ip: '193.243.190.18',
            port: 27025,
            region: 'US',
            description: 'Zombie Shelter',
            link: '/shelter/connect.html'
        },
        {
            id: 'horde',
            title: 'NPCZ Horde',
            ip: '193.243.190.18',
            port: 27065,
            region: 'US',
            description: 'Horde',
            link: '/horde/connect.html'
        }
    ];

    function updateServerStatus(server) {
        return fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`)
            .then(response => response.json())
            .then(serverInfo => {
                const status = {
                    online: false,
                    players: 0,
                    maxPlayers: 0
                };

                if (serverInfo && (serverInfo.status?.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                    status.online = true;
                    status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                    status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || "?";
                }

                return status;
            })
            .catch(error => {
                console.error(`Error fetching data for ${server.id}:`, error);
                return { online: false, players: 0, maxPlayers: 0 };
            });
    }

    function createServerCard(server, status) {
        const serverCard = document.createElement('div');
        serverCard.className = `server-card ${status.online ? 'online' : 'offline'} ${status.players >= status.maxPlayers ? 'full' : ''}`;
        const playerDisplay = status.players >= status.maxPlayers ? `${status.players}/${status.maxPlayers} FULL!` : `${status.players}/${status.maxPlayers} Players`;
        const buttonText = status.players >= status.maxPlayers ? 'JOIN QUEUE' : 'JOIN';
        
        serverCard.innerHTML = `
            <div class="server-gamemode">${server.description}</div>
            ${status.players >= status.maxPlayers ? '<a href="/store" class="reserve-slot">Reserve a slot</a>' : ''}
            <div class="server-info">
                <div class="server-title-container">
                    <div class="server-title">${server.title}</div>
                    <div class="server-players mobile-only ${status.players >= status.maxPlayers ? 'full' : ''}">${playerDisplay}</div>
                </div>
                <div class="server-stats">
                    <div class="server-meta">
                        <div class="server-number">${server.number ? `US${server.number}` : 'US'}</div>
                        <div class="server-players desktop-only ${status.players >= status.maxPlayers ? 'full' : ''}">${playerDisplay}</div>
                        <div class="mobile-only-message">
                            <span class="mobile-badge">
                                <i class="fas fa-desktop"></i>
                                PC ONLY
                            </span>
                        </div>
                    </div>
                    <a href="${server.link}" class="connect-button">${buttonText} <i class="fas fa-sign-in-alt"></i></a>
                </div>
            </div>
            <div class="server-status"></div>
        `;
        return serverCard;
    }

    function updateServerList() {
        const serverList = document.querySelector('.server-list');
        const serverContainer = document.querySelector('.server-container');
        if (!serverList || !serverContainer) return;

        Promise.all(servers.map(server => updateServerStatus(server)))
            .then(statuses => {
                // Calculate total current players
                const totalPlayers = statuses.reduce((sum, status) => sum + (status.players || 0), 0);
                const totalServers = servers.length;

                // Update the stats
                const currentPlayersElement = document.getElementById('current-players');
                const totalServersElement = document.getElementById('total-servers');
                
                if (currentPlayersElement) {
                    currentPlayersElement.textContent = totalPlayers;
                }
                if (totalServersElement) {
                    totalServersElement.textContent = totalServers;
                }

                // Create array of servers with their status
                const serverStatusPairs = servers.map((server, index) => ({
                    server,
                    status: statuses[index]
                }));

                // Sort by player count (highest first) and filter for online servers
                const sortedServers = serverStatusPairs
                    .filter(pair => pair.status.online)
                    .sort((a, b) => b.status.players - a.status.players)
                    .slice(0, 3); // Take only top 3

                // Clear and update server list
                serverList.innerHTML = '';
                sortedServers.forEach(({ server, status }) => {
                    const serverCard = createServerCard(server, status);
                    serverList.appendChild(serverCard);
                });

                // Remove existing View All Servers button if it exists
                const existingViewAll = serverContainer.querySelector('.view-all-servers');
                if (existingViewAll) {
                    existingViewAll.remove();
                }

                // Add View All Servers button after the server-list
                const viewAllServers = document.createElement('div');
                viewAllServers.className = 'view-all-servers';
                viewAllServers.innerHTML = `
                    <a href="/servers" class="view-all-servers-btn">
                        View All Servers <i class="fas fa-arrow-right"></i>
                    </a>
                `;
                serverContainer.appendChild(viewAllServers);
            })
            .catch(error => {
                console.error('Error updating server list:', error);
            });
    }

    // Initial update
    updateServerList();

    // Update every 30 seconds
    setInterval(updateServerList, 30000);
});

// Square animations for all sections
function initializeSquareAnimations() {
    // Get all sections that have decorative squares
    const sections = document.querySelectorAll('.section.about, .section.store-section');
    
    // Set initial state for all squares
    document.querySelectorAll('.decorative-square, .store-accent').forEach(square => {
        square.classList.add('hidden');
        square.style.opacity = '0';
    });

    // Track the currently visible section and last scroll position
    let currentVisibleSection = null;
    let animationTimeouts = [];
    let lastScrollY = window.scrollY;
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine scroll direction
                const scrollingDown = window.scrollY > lastScrollY;
                lastScrollY = window.scrollY;

                // If there's a currently visible section that's different from this one,
                // hide its squares immediately
                if (currentVisibleSection && currentVisibleSection !== entry.target) {
                    const previousSquares = currentVisibleSection.querySelectorAll('.decorative-square, .store-accent');
                    previousSquares.forEach(square => {
                        square.classList.remove('visible');
                        square.classList.add('hidden');
                        square.style.opacity = '0';
                    });
                }

                // Clear any pending animations
                animationTimeouts.forEach(timeout => clearTimeout(timeout));
                animationTimeouts = [];

                // Update current visible section
                currentVisibleSection = entry.target;

                // Get all squares in this section
                const squares = entry.target.querySelectorAll('.decorative-square, .store-accent');
                const squaresArray = Array.from(squares);
                
                // Sort squares based on scroll direction and position
                squaresArray.sort((a, b) => {
                    const aRect = a.getBoundingClientRect();
                    const bRect = b.getBoundingClientRect();
                    
                    // Calculate distance from the reference corner
                    // When scrolling down: distance from top-left
                    // When scrolling up: distance from bottom-left
                    const aDistance = scrollingDown 
                        ? Math.sqrt(Math.pow(aRect.left, 2) + Math.pow(aRect.top, 2))
                        : Math.sqrt(Math.pow(aRect.left, 2) + Math.pow(window.innerHeight - aRect.bottom, 2));
                    
                    const bDistance = scrollingDown
                        ? Math.sqrt(Math.pow(bRect.left, 2) + Math.pow(bRect.top, 2))
                        : Math.sqrt(Math.pow(bRect.left, 2) + Math.pow(window.innerHeight - bRect.bottom, 2));
                    
                    return aDistance - bDistance;
                });
                
                // When section is visible, trigger squares in sequence
                squaresArray.forEach((square, index) => {
                    const timeout = setTimeout(() => {
                        square.classList.remove('hidden');
                        // Use requestAnimationFrame to ensure opacity is 0 before adding visible class
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                if (currentVisibleSection === entry.target) {
                                    square.classList.add('visible');
                                }
                            });
                        });
                    }, index * 200); // Slightly faster delay between squares

                    animationTimeouts.push(timeout);
                });
            } else {
                // When section is no longer intersecting
                if (currentVisibleSection === entry.target) {
                    currentVisibleSection = null;
                }
                // Hide all squares in this section
                const squares = entry.target.querySelectorAll('.decorative-square, .store-accent');
                squares.forEach(square => {
                    square.classList.remove('visible');
                    square.classList.add('hidden');
                    square.style.opacity = '0';
                });
            }
        });
    }, {
        threshold: 0.5, // Require 50% of section to be visible
        rootMargin: '0px'
    });

    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize animations when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSquareAnimations();
}); 