// Server browser functionality for ZMod website
class ServerBrowser {
    constructor() {
        // Server configuration
        this.serverGroups = [
            {
                id: 'sandbox',
                name: 'NPC Zombies Vs. Players',
                type: 'single',
                servers: [{ id: 'sandbox', name: 'NPC Zombies Vs. Players', ip: '193.243.190.18', port: '27015' }]
            },
            {
                id: 'horde',
                name: 'Horde',
                type: 'single',
                servers: [{ id: 'horde', name: 'Horde', ip: '193.243.190.18', port: '27065' }]
            },
            {
                id: 'zbox',
                name: 'ZBox',
                type: 'single',
                servers: [{ id: 'zbox', name: 'ZBox', ip: '193.243.190.18', port: '27064' }]
            },
            {
                id: 'zgrad',
                name: 'ZGRAD',
                type: 'group',
                servers: [
                    { id: 'zgrad-us1', name: 'ZGRAD US1', ip: '193.243.190.18', port: '27066' },
                    { id: 'zgrad-us2', name: 'ZGRAD US2', ip: '193.243.190.18', port: '27051' },
                    { id: 'zgrad-us3', name: 'ZGRAD US3', ip: '193.243.190.18', port: '27053' },
                    { id: 'zgrad-us4', name: 'ZGRAD US4', ip: '193.243.190.18', port: '27052' }
                ]
            },
            {
                id: 'mapsweepers',
                name: 'Map Sweepers',
                type: 'single',
                servers: [{ id: 'mapsweepers', name: 'Map Sweepers Official Server', ip: '193.243.190.18', port: '27027' }]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.initializeServerBrowser();
        this.setupGlobalFunctions();
    }
    
    // Helper function to determine background class based on server data
    getServerBackgroundClass(serverData) {
        const serverId = serverData.id || '';
        const serverName = serverData.name || '';
        
        // Check for Horde servers
        if (serverId.includes('horde') || serverName.toLowerCase().includes('horde')) {
            return 'bg-horde';
        }
        
        // Check for Sandbox servers
        if (serverId.includes('sandbox') || serverName.toLowerCase().includes('sandbox')) {
            return 'bg-sandbox';
        }
        
        // Check for ZGRAD servers (use homigrad image)
        if (serverId.includes('zgrad') || serverName.toLowerCase().includes('zgrad')) {
            return 'bg-homigrad';
        }
        
        // For ZBox (sandbox-like), use sandbox background
        if (serverId.includes('zbox') || serverName.toLowerCase().includes('zbox')) {
            return 'bg-sandbox';
        }
        
        // For MapSweepers, use its own background
        if (serverId.includes('mapsweepers') || serverName.toLowerCase().includes('mapsweepers')) {
            return 'bg-mapsweepers';
        }
        
        // Default fallback - no background
        return '';
    }

    updateServerStatus(server) {
        return fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`)
            .then(response => response.json())
            .then(serverInfo => {
                const status = {
                    online: false,
                    players: 0,
                    maxPlayers: 0,
                    map: 'Unknown'
                };

                if (serverInfo && (serverInfo.status?.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                    status.online = true;
                    status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                    status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || "?";
                    status.map = serverInfo.map || 'Unknown';
                }

                return status;
            })
            .catch(error => {
                console.error(`Error fetching data for ${server.id}:`, error);
                return { online: false, players: 0, maxPlayers: 0, map: 'Unknown' };
            });
    }
    
    createServerCard(server, status) {
        const card = document.createElement('div');
        const backgroundClass = this.getServerBackgroundClass(server);
        const isMapSweepers = server.id.includes('mapsweepers') || server.name.toLowerCase().includes('mapsweepers');
        const isSandbox = server.id.includes('sandbox');
        
        card.className = `server-card ${status.online ? 'online' : 'offline'} ${backgroundClass}`;
        card.innerHTML = `
            <div class="server-status-indicator ${status.online ? 'online' : 'offline'}"></div>
            ${isMapSweepers ? '<div class="partner-label"><img src="assets/logos/a_octantisaddons.png" alt="Partner" class="partner-icon">Partner</div>' : ''}
            <div class="server-info-left">
                <div class="server-details">
                    <div style="display: flex; align-items: center;">
                        <h3 class="server-name">${server.name}</h3>
                        ${isSandbox ? '<img src="assets/logos/npcz.png" alt="NPCZ Logo" class="npcz-logo-piece">' : ''}
                    </div>
                    <p class="server-map">${status.map}</p>
                </div>
            </div>
            <div class="server-info-right">
                <div class="server-players">${status.players}/${status.maxPlayers}</div>
                ${isMapSweepers ? '<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3179978923" target="_blank" class="workshop-btn">View on Workshop</a>' : ''}
                ${isSandbox ? '<a href="https://zmod.gg/npcz" target="_blank" class="learn-more-btn">Learn More</a>' : ''}
                <button class="server-join-btn" onclick="connectToServer('${server.ip}', '${server.port}')" ${!status.online ? 'disabled' : ''}>
                    ${status.online ? 'Connect' : 'Offline'}
                </button>
            </div>
        `;
        return card;
    }
    
    createSubServerCard(server, status) {
        const card = document.createElement('div');
        const backgroundClass = this.getServerBackgroundClass(server);
        const isMapSweepers = server.id.includes('mapsweepers') || server.name.toLowerCase().includes('mapsweepers');
        
        card.className = `server-sub-card ${status.online ? 'online' : 'offline'} ${backgroundClass}`;
        card.innerHTML = `
            <div class="server-sub-status-indicator ${status.online ? 'online' : 'offline'}"></div>
            ${isMapSweepers ? '<div class="partner-label"><img src="assets/logos/a_octantisaddons.png" alt="Partner" class="partner-icon">Partner</div>' : ''}
            <div class="server-sub-info-left">
                <div class="server-sub-details">
                    <h4 class="server-sub-name">${server.name}</h4>
                    <p class="server-sub-map">${status.map}</p>
                </div>
            </div>
            <div class="server-sub-info-right">
                <div class="server-sub-players">${status.players}/${status.maxPlayers}</div>
                <button class="server-sub-join-btn" onclick="connectToServer('${server.ip}', '${server.port}')" ${!status.online ? 'disabled' : ''}>
                    ${status.online ? 'Connect' : 'Offline'}
                </button>
            </div>
        `;
        return card;
    }
    
    createServerGroup(group, statuses) {
        const totalPlayers = statuses.reduce((sum, status) => sum + status.players, 0);
        const totalMaxPlayers = statuses.reduce((sum, status) => sum + (typeof status.maxPlayers === 'number' ? status.maxPlayers : 0), 0);
        const onlineServers = statuses.length; // All statuses are online since we filtered them
        
        // Use group data to determine background class (for groups like ZGRAD)
        const backgroundClass = this.getServerBackgroundClass(group);
        const isZGRAD = group.id === 'zgrad';
        
        const groupContainer = document.createElement('div');
        groupContainer.className = 'server-group';
        groupContainer.innerHTML = `
            <div class="server-group-main ${backgroundClass}" onclick="toggleServerGroup('${group.id}')">
                <div class="server-group-info-left">
                    <div class="server-group-details">
                        <div style="display: flex; align-items: center;">
                            <h3 class="server-group-name">${group.name}</h3>
                            ${isZGRAD ? '<img src="assets/zgrad/zgrad-logopiece-z.png" alt="ZGRAD Logo" class="zgrad-logo-piece">' : ''}
                        </div>
                        <div style="display: flex; align-items: center;">
                            <p class="server-group-subtitle">${onlineServers} ${onlineServers === 1 ? 'server' : 'servers'} online</p>
                            ${isZGRAD ? `
                                <span style="margin: 0 0.5rem; color: var(--color-light-gray);">•</span>
                                <div class="social-icons">
                                    <a href="https://www.tiktok.com/@zgradhomigrad" target="_blank" class="social-icon" title="TikTok">
                                        <img src="assets/svgs/tiktok.svg" alt="TikTok" class="social-svg">
                                    </a>
                                    <a href="https://www.youtube.com/@zgradhomigrad" target="_blank" class="social-icon" title="YouTube">
                                        <img src="assets/svgs/youtube.svg" alt="YouTube" class="social-svg">
                                    </a>
                                    <a href="https://www.instagram.com/zgradhomigrad" target="_blank" class="social-icon" title="Instagram">
                                        <img src="assets/svgs/instagram.svg" alt="Instagram" class="social-svg">
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="server-group-info-right">
                    <div class="server-group-players">${totalPlayers}/${totalMaxPlayers > 0 ? totalMaxPlayers : '?'}</div>
                    ${isZGRAD ? '<a href="https://zmod.gg/zgrad" target="_blank" class="learn-more-btn">Learn More</a>' : ''}
                    <button class="server-expand-btn" onclick="event.stopPropagation(); toggleServerGroup('${group.id}')">
                        <span>${isZGRAD ? 'See All' : 'Expand'}</span>
                        <span class="expand-arrow">▼</span>
                    </button>
                </div>
            </div>
            <div class="server-sub-list" id="sub-list-${group.id}">
                <!-- Sub-servers will be added here -->
            </div>
        `;
        return groupContainer;
    }
    
    initializeServerBrowser() {
        const serverList = document.getElementById('server-list');
        const totalPlayersCountElement = document.getElementById('total-players-count');
        
        // Collect all servers from all groups
        const allServers = [];
        this.serverGroups.forEach(group => {
            allServers.push(...group.servers);
        });
        
        // Fetch all server statuses
        Promise.all(allServers.map(server => this.updateServerStatus(server)))
            .then(allStatuses => {
                // Clear loading text
                serverList.innerHTML = '';
                
                // Calculate total players (only online servers)
                const totalPlayers = allStatuses
                    .filter(status => status.online)
                    .reduce((total, status) => total + status.players, 0);
                totalPlayersCountElement.textContent = totalPlayers;
                
                // Create server cards or groups with filtering and sorting
                let statusIndex = 0;
                const serverElements = [];

                this.serverGroups.forEach(group => {
                    const groupStatuses = allStatuses.slice(statusIndex, statusIndex + group.servers.length);
                    statusIndex += group.servers.length;
                    
                    if (group.type === 'group') {
                        // Filter out offline servers from the group
                        const onlineServers = [];
                        const onlineStatuses = [];
                        
                        group.servers.forEach((server, subIndex) => {
                            if (groupStatuses[subIndex].online) {
                                onlineServers.push(server);
                                onlineStatuses.push(groupStatuses[subIndex]);
                            }
                        });
                        
                        // Only show group if it has online servers
                        if (onlineServers.length > 0) {
                            // Calculate total players for sorting
                            const totalPlayers = onlineStatuses.reduce((sum, status) => sum + status.players, 0);
                            
                            // Create modified group with only online servers
                            const onlineGroup = {
                                ...group,
                                servers: onlineServers
                            };
                            
                            const groupElement = this.createServerGroup(onlineGroup, onlineStatuses);
                            
                            // Add sub-servers to the sub-list (sorted by player count)
                            const subList = groupElement.querySelector(`#sub-list-${group.id}`);
                            const sortedSubServers = onlineServers
                                .map((server, subIndex) => ({ server, status: onlineStatuses[subIndex] }))
                                .sort((a, b) => b.status.players - a.status.players);
                            
                            sortedSubServers.forEach(({ server, status }) => {
                                const subCard = this.createSubServerCard(server, status);
                                subList.appendChild(subCard);
                            });
                            
                            serverElements.push({
                                element: groupElement,
                                playerCount: totalPlayers,
                                isGroup: true
                            });
                        }
                    } else {
                        // Single server - only show if online
                        const server = group.servers[0];
                        const status = groupStatuses[0];
                        
                        if (status.online) {
                            const card = this.createServerCard(server, status);
                            serverElements.push({
                                element: card,
                                playerCount: status.players,
                                isGroup: false
                            });
                        }
                    }
                });

                // Sort all servers by player count (highest first)
                serverElements.sort((a, b) => b.playerCount - a.playerCount);

                // Add sorted elements to the server list
                if (serverElements.length === 0) {
                    serverList.innerHTML = '<div class="loading-text">No servers online at the moment.</div>';
                } else {
                    serverElements.forEach(({ element }, index) => {
                        // Highlight the #1 server (first in the list)
                        if (index === 0) {
                            const mainContainer = element.querySelector('.server-card') || element.querySelector('.server-group-main');
                            if (mainContainer) {
                                mainContainer.classList.add('number-one');
                            }
                        }
                        serverList.appendChild(element);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading server browser:', error);
                serverList.innerHTML = '<div class="loading-text">Error loading servers. Please try again later.</div>';
                totalPlayersCountElement.textContent = '?';
            });
        
        // Set up periodic refresh (every 30 seconds) - only if not already set
        if (!window.serverBrowserInterval) {
            window.serverBrowserInterval = setInterval(() => {
                this.initializeServerBrowser();
            }, 30000);
        }
    }
    
    // Setup global functions that need to be accessible from HTML onclick attributes
    setupGlobalFunctions() {
        // Toggle server group expansion
        window.toggleServerGroup = function(groupId) {
            const subList = document.getElementById(`sub-list-${groupId}`);
            const groupContainer = subList ? subList.closest('.server-group') : null;
            const expandBtn = groupContainer ? groupContainer.querySelector('.server-expand-btn') : null;
            const mainContainer = groupContainer ? groupContainer.querySelector('.server-group-main') : null;
            
            if (subList && expandBtn && mainContainer) {
                const isExpanded = subList.classList.contains('expanded');
                const isZGRAD = groupId === 'zgrad';
                
                if (isExpanded) {
                    // Collapse
                    subList.classList.remove('expanded');
                    expandBtn.classList.remove('expanded');
                    mainContainer.classList.remove('expanded');
                    expandBtn.querySelector('span:first-child').textContent = isZGRAD ? 'See All' : 'Expand';
                } else {
                    // Expand
                    subList.classList.add('expanded');
                    expandBtn.classList.add('expanded');
                    mainContainer.classList.add('expanded');
                    expandBtn.querySelector('span:first-child').textContent = 'Collapse';
                }
            }
        };
        
        // Global function to connect to servers
        window.connectToServer = function(ip, port) {
            const connectUrl = `steam://connect/${ip}:${port}`;
            window.open(connectUrl, '_blank');
        };
    }
}

// Export the ServerBrowser class for use in main.js
window.ServerBrowser = ServerBrowser;