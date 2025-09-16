// Server configuration
const servers = [
    { ip: '193.243.190.18', port: '27015', id: 'server1' },
    { ip: '193.243.190.18', port: '27065', id: 'server2' },
    { ip: '193.243.190.18', port: '27066', id: 'server3' },
    { ip: '193.243.190.18', port: '27064', id: 'server4' },
    { ip: '193.243.190.18', port: '27051', id: 'server5' },
    { ip: '193.243.190.18', port: '27052', id: 'server6' },
    { ip: '193.243.190.18', port: '27053', id: 'server7' }
];

// Fetch server status from GameServerAnalytics API
const fetchServerStatus = (server) => {
    return fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`)
        .then(response => response.json())
        .then(serverInfo => {
            const status = {
                online: false,
                players: 0,
                maxPlayers: 0,
                map: 'Unknown',
                server: server
            };

            if (serverInfo && (serverInfo.status?.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                status.online = true;
                status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || 32;
                status.map = serverInfo.map || 'Unknown';
            }

            return status;
        })
        .catch(error => {
            console.error(`Error fetching data for ${server.id}:`, error);
            return { 
                online: false, 
                players: 0, 
                maxPlayers: 32, 
                map: 'Unknown',
                server: server 
            };
        });
};

// Update playercount display
const updatePlayerCount = async () => {
    const playercountElement = document.querySelector('.playercount-text');
    
    try {
        // Fetch status for all servers
        const serverStatuses = await Promise.all(servers.map(fetchServerStatus));
        
        // Calculate totals
        const totalPlayers = serverStatuses.reduce((sum, status) => sum + status.players, 0);
        const onlineServers = serverStatuses.filter(status => status.online).length;
        const totalServers = servers.length;
        
        // Update display
        if (onlineServers > 0) {
            playercountElement.textContent = `${totalPlayers} players across ${onlineServers} servers`;
            playercountElement.className = 'playercount-text online';
        } else {
            playercountElement.textContent = `0 players across ${totalServers} servers`;
            playercountElement.className = 'playercount-text offline';
        }
    } catch (error) {
        console.error('Error updating player count:', error);
        playercountElement.textContent = 'Unable to load server status';
        playercountElement.className = 'playercount-text error';
    }
};

// Initialize playercount when page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePlayerCount();
    
    // Update every 30 seconds
    setInterval(updatePlayerCount, 30000);
});
