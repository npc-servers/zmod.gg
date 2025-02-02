document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScrollTop = 0;

    // Smooth scroll handling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll indicator fade
    container.addEventListener('scroll', () => {
        const scrollTop = container.scrollTop;
        
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