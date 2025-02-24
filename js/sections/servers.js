import { servers } from '../data/servers.js';

class ServersSection {
    constructor() {
        this.serversList = document.getElementById('servers-list');
        this.totalPlayersElement = document.getElementById('total-players');
        this.totalServersElement = document.getElementById('total-servers');
        this.initialize();
    }

    async initialize() {
        this.renderServers();
        await this.updateAllServers();
        // Update server status every 30 seconds
        setInterval(() => this.updateAllServers(), 30000);
    }

    renderServers() {
        this.serversList.innerHTML = servers.map(server => `
            <div class="server-card" id="server-${server.id}">
                <div class="server-info">
                    <div class="server-header">
                        <h3>${server.title}</h3>
                    </div>
                    <p class="server-description">${server.description}</p>
                </div>
                <div class="server-status-container">
                    <div class="server-status">
                        <div class="status-indicator offline"></div>
                        <div class="server-status-info">
                            <span class="player-count">Server Down</span>
                            <span class="server-region">${server.region}</span>
                        </div>
                        <span class="connect-btn mobile-only">Server Offline</span>
                    </div>
                    <span class="reserve-slot">Reserve a slot <i class="fas fa-arrow-right"></i></span>
                </div>
                <button class="connect-btn desktop-only" disabled>
                    Server Offline
                </button>
            </div>
        `).join('');
    }

    async updateServerStatus(server) {
        try {
            const response = await fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`);
            const serverInfo = await response.json();
            
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
        } catch (error) {
            console.error(`Error fetching data for ${server.id}:`, error);
            return { online: false, players: 0, maxPlayers: 0 };
        }
    }

    async updateAllServers() {
        const statusPromises = servers.map(async server => {
            const status = await this.updateServerStatus(server);
            const serverElement = document.getElementById(`server-${server.id}`);
            
            if (serverElement) {
                const statusIndicator = serverElement.querySelector('.status-indicator');
                const playerCount = serverElement.querySelector('.player-count');
                const mobileBtn = serverElement.querySelector('.connect-btn.mobile-only');
                const desktopBtn = serverElement.querySelector('.connect-btn.desktop-only');
                const serverCard = serverElement;
                
                statusIndicator.className = `status-indicator ${status.online ? 'online' : 'offline'}`;
                
                if (status.online) {
                    playerCount.textContent = `${status.players}/${status.maxPlayers}`;
                    mobileBtn.textContent = 'Only available on PC';
                    desktopBtn.textContent = 'Connect';
                    desktopBtn.disabled = false;
                    desktopBtn.onclick = () => window.location.href = `steam://connect/${server.ip}:${server.port}`;
                    serverCard.classList.remove('is-offline');
                } else {
                    playerCount.textContent = 'Server Down';
                    mobileBtn.textContent = 'Server Offline';
                    desktopBtn.textContent = 'Server Offline';
                    desktopBtn.disabled = true;
                    desktopBtn.onclick = null;
                    serverCard.classList.add('is-offline');
                }
            }
            
            return status;
        });

        const allStatus = await Promise.all(statusPromises);
        
        // Update total stats
        const totalPlayers = allStatus.reduce((sum, status) => sum + status.players, 0);
        const onlineServers = allStatus.filter(status => status.online).length;
        
        this.totalPlayersElement.textContent = totalPlayers;
        this.totalServersElement.textContent = onlineServers;
    }
}

// Initialize the servers section
new ServersSection(); 