// Footer functionality for ZMod website
class Footer {
    constructor() {
        // Use the same server configuration as the server browser
        this.serverGroups = [
            {
                id: 'sandbox',
                name: 'NPC Zombies Vs. Players',
                displayName: 'NPCZ',
                type: 'single',
                servers: [{ id: 'sandbox', name: 'NPC Zombies Vs. Players', ip: '193.243.190.18', port: '27015' }]
            },
            {
                id: 'horde',
                name: 'Horde',
                displayName: 'Horde #1',
                type: 'single',
                servers: [{ id: 'horde', name: 'Horde', ip: '193.243.190.18', port: '27065' }]
            },
            {
                id: 'zbox',
                name: 'ZBox',
                displayName: 'ZBox #1',
                type: 'single',
                servers: [{ id: 'zbox', name: 'ZBox', ip: '193.243.190.18', port: '27064' }]
            },
            {
                id: 'zgrad',
                name: 'ZGRAD',
                displayName: 'ZGRAD',
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
                displayName: 'Map Sweepers',
                type: 'single',
                servers: [{ id: 'mapsweepers', name: 'Map Sweepers Official Server', ip: '193.243.190.18', port: '27027' }]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.updateFooterServerStatus();
        
        // Set up periodic refresh (every 30 seconds)
        if (!window.footerServerInterval) {
            window.footerServerInterval = setInterval(() => {
                this.updateFooterServerStatus();
            }, 30000);
        }
    }
    
    // Fetch server status using the same API as server browser
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
                console.error(`Error fetching footer data for ${server.id}:`, error);
                return { online: false, players: 0, maxPlayers: 0, map: 'Unknown' };
            });
    }
    
    // Get the top 4 servers by player count for footer display
    updateFooterServerStatus() {
        const footerServerStatus = document.querySelector('.footer-server-status');
        if (!footerServerStatus) return;
        
        // Collect all servers and handle groups differently
        const serverPromises = [];
        const serverEntries = [];
        
        this.serverGroups.forEach(group => {
            if (group.type === 'group') {
                // For server groups (like ZGRAD), fetch all servers in the group
                const groupPromises = group.servers.map(server => this.updateServerStatus(server));
                serverPromises.push(
                    Promise.all(groupPromises).then(statuses => {
                        // Calculate total players and max players for the group
                        const onlineServers = statuses.filter(status => status.online);
                        const totalPlayers = onlineServers.reduce((sum, status) => sum + status.players, 0);
                        const totalMaxPlayers = onlineServers.reduce((sum, status) => sum + (typeof status.maxPlayers === 'number' ? status.maxPlayers : 0), 0);
                        
                        return {
                            server: {
                                displayName: group.displayName,
                                groupId: group.id,
                                isGroup: true
                            },
                            status: {
                                online: onlineServers.length > 0,
                                players: totalPlayers,
                                maxPlayers: totalMaxPlayers > 0 ? totalMaxPlayers : '?',
                                onlineCount: onlineServers.length,
                                totalCount: group.servers.length
                            }
                        };
                    })
                );
                serverEntries.push({ type: 'group', group });
            } else {
                // For single servers
                const server = {
                    ...group.servers[0],
                    displayName: group.displayName,
                    groupId: group.id,
                    isGroup: false
                };
                serverPromises.push(
                    this.updateServerStatus(server).then(status => ({
                        server,
                        status
                    }))
                );
                serverEntries.push({ type: 'single', server });
            }
        });
        
        // Fetch all server/group statuses
        Promise.all(serverPromises)
            .then(allData => {
                // Filter online servers/groups and sort by player count
                const onlineData = allData
                    .filter(data => data.status.online)
                    .sort((a, b) => b.status.players - a.status.players);
                
                // Take top 4 servers/groups
                const topData = onlineData.slice(0, 4);
                
                // If we have fewer than 4 online servers/groups, fill with offline ones
                if (topData.length < 4) {
                    const offlineData = allData
                        .filter(data => !data.status.online)
                        .slice(0, 4 - topData.length);
                    topData.push(...offlineData);
                }
                
                // Update footer HTML
                footerServerStatus.innerHTML = '';
                topData.forEach(({ server, status }) => {
                    const serverItem = document.createElement('div');
                    serverItem.className = 'server-status-item';
                    
                    if (server.isGroup) {
                        // Display group with server count info
                        serverItem.innerHTML = `
                            <span class="server-name">${server.displayName}</span>
                            <span class="server-players ${status.online ? 'online' : 'offline'}">
                                ${status.online ? `${status.players}/${status.maxPlayers}` : 'Offline'}
                            </span>
                        `;
                    } else {
                        // Display single server
                        serverItem.innerHTML = `
                            <span class="server-name">${server.displayName}</span>
                            <span class="server-players ${status.online ? 'online' : 'offline'}">
                                ${status.online ? `${status.players}/${status.maxPlayers}` : 'Offline'}
                            </span>
                        `;
                    }
                    
                    footerServerStatus.appendChild(serverItem);
                });
                
                // If no servers at all, show placeholder
                if (topData.length === 0) {
                    footerServerStatus.innerHTML = `
                        <div class="server-status-item">
                            <span class="server-name">No servers available</span>
                            <span class="server-players offline">--</span>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error updating footer server status:', error);
                // Show error state
                footerServerStatus.innerHTML = `
                    <div class="server-status-item">
                        <span class="server-name">Error loading servers</span>
                        <span class="server-players offline">--</span>
                    </div>
                `;
            });
    }
}

// Export the Footer class for use in main.js
window.Footer = Footer;
