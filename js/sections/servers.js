import { servers } from '../data/servers.js';
import gamemodes from '../data/gamemodes.js';

class ServersSection {
    constructor() {
        this.serversList = document.getElementById('servers-list');
        this.totalPlayersElement = document.getElementById('total-players');
        this.totalServersElement = document.getElementById('total-servers');
        this.serverStatuses = new Map(); // Store server statuses for sorting
        this.initialize();
    }

    async initialize() {
        this.renderServers();
        await this.updateAllServers();
        // Update server status every 30 seconds
        setInterval(() => this.updateAllServers(), 30000);
    }

    getTopServers() {
        // Sort servers by player count (descending) and take top 3
        const serversWithStatus = servers.map(server => ({
            ...server,
            status: this.serverStatuses.get(server.id) || { online: false, players: 0, maxPlayers: 0 }
        }));

        return serversWithStatus
            .sort((a, b) => b.status.players - a.status.players)
            .slice(0, 3);
    }

    renderServers() {
        const topServers = this.getTopServers();
        
        const serversHTML = topServers.map(server => {
            const gamemodeInfo = gamemodes[server.gamemode] || { name: 'Unknown', id: 'unknown' };
            
            return `
            <div class="server-card" id="server-${server.id}">
                <div class="server-info">
                    <div class="server-header">
                        <h3>${server.title}</h3>
                    </div>
                    <div class="server-gamemode">
                        <a href="#gamemode/${gamemodeInfo.id}" class="gamemode-link">
                            ${gamemodeInfo.name}<i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
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
            `;
        }).join('');

        // Add VIEW MORE button
        const viewMoreHTML = `
            <div class="view-more-servers">
                <button class="view-more-servers-btn">VIEW MORE <i class="fas fa-arrow-right"></i></button>
            </div>
        `;

        this.serversList.innerHTML = serversHTML + viewMoreHTML;
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
            this.serverStatuses.set(server.id, status); // Store status for sorting
            return { server, status };
        });

        const allResults = await Promise.all(statusPromises);
        
        // Re-render servers with updated sorting
        this.renderServers();
        
        // Update the displayed servers with their status
        const topServers = this.getTopServers();
        topServers.forEach(server => {
            const serverElement = document.getElementById(`server-${server.id}`);
            const status = server.status;
            
            if (serverElement) {
                const statusIndicator = serverElement.querySelector('.status-indicator');
                const playerCount = serverElement.querySelector('.player-count');
                const mobileBtn = serverElement.querySelector('.connect-btn.mobile-only');
                const desktopBtn = serverElement.querySelector('.connect-btn.desktop-only');
                const serverCard = serverElement;
                
                statusIndicator.className = `status-indicator ${status.online ? 'online' : 'offline'}`;
                
                if (status.online) {
                    const isFull = status.players >= status.maxPlayers;
                    playerCount.textContent = `${status.players}/${status.maxPlayers}`;
                    mobileBtn.textContent = isFull ? 'Server Full' : 'Only available on PC';
                    desktopBtn.textContent = isFull ? 'Server Full' : 'Connect';
                    desktopBtn.disabled = isFull;
                    desktopBtn.onclick = isFull ? null : () => window.location.href = `steam://connect/${server.ip}:${server.port}`;
                    serverCard.classList.remove('is-offline');
                    
                    // Toggle full server state
                    const statusContainer = serverElement.querySelector('.server-status-container');
                    if (isFull) {
                        statusContainer.classList.add('is-full');
                        const reserveSlot = serverElement.querySelector('.reserve-slot');
                        if (reserveSlot) {
                            reserveSlot.classList.add('show');
                        }
                    } else {
                        statusContainer.classList.remove('is-full');
                        const reserveSlot = serverElement.querySelector('.reserve-slot');
                        if (reserveSlot) {
                            reserveSlot.classList.remove('show');
                        }
                    }
                } else {
                    playerCount.textContent = 'Server Down';
                    mobileBtn.textContent = 'Server Offline';
                    desktopBtn.textContent = 'Server Offline';
                    desktopBtn.disabled = true;
                    desktopBtn.onclick = null;
                    serverCard.classList.add('is-offline');
                }
            }
        });

        // Update total stats (using all servers, not just displayed ones)
        const totalPlayers = allResults.reduce((sum, result) => sum + result.status.players, 0);
        const onlineServers = allResults.filter(result => result.status.online).length;
        
        this.totalPlayersElement.textContent = totalPlayers;
        this.totalServersElement.textContent = onlineServers;
    }
}

// Initialize the servers section
new ServersSection(); 