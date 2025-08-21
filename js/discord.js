// Discord Widget JavaScript Module
class Discord {
    constructor() {
        this.guildId = '539289943004938251';
        this.apiUrl = `https://discord.com/api/guilds/${this.guildId}/widget.json`;
        this.init();
    }

    init() {
        this.loadDiscordData();
        // Refresh every 30 seconds
        setInterval(() => this.loadDiscordData(), 30000);
        console.log('Discord module initialized');
    }

    async loadDiscordData() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.updateWidget(data);
        } catch (error) {
            console.error('Error loading Discord data:', error);
            this.showError();
        }
    }

    updateWidget(data) {
        // Update member count
        const memberCountElement = document.getElementById('member-count');
        if (memberCountElement) {
            memberCountElement.textContent = data.presence_count || 0;
        }

        // Update members list
        const membersContainer = document.getElementById('discord-members');
        if (membersContainer && data.members) {
            this.renderMembers(data.members, membersContainer);
        }
    }

    renderMembers(members, container) {
        // Limit to first 20 members for performance
        const displayMembers = members.slice(0, 20);
        
        container.innerHTML = '';
        
        displayMembers.forEach(member => {
            const memberElement = this.createMemberElement(member);
            container.appendChild(memberElement);
        });
    }

    createMemberElement(member) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'discord-member';
        
        // Create avatar container
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'member-avatar';
        
        // Create avatar image or placeholder
        if (member.avatar_url) {
            const avatarImg = document.createElement('img');
            avatarImg.src = member.avatar_url;
            avatarImg.alt = member.username;
            avatarImg.onerror = () => {
                // Fallback to placeholder if image fails to load
                avatarImg.style.display = 'none';
            };
            avatarDiv.appendChild(avatarImg);
        }
        
        // Create status indicator
        const statusDiv = document.createElement('div');
        statusDiv.className = `member-status ${member.status}`;
        avatarDiv.appendChild(statusDiv);
        
        // Create member info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'member-info';
        
        const nameP = document.createElement('p');
        nameP.className = 'member-name';
        nameP.textContent = member.username;
        infoDiv.appendChild(nameP);
        
        // Add game info if available
        if (member.game && member.game.name) {
            const gameP = document.createElement('p');
            gameP.className = 'member-game';
            gameP.textContent = `Playing ${member.game.name}`;
            infoDiv.appendChild(gameP);
        }
        
        memberDiv.appendChild(avatarDiv);
        memberDiv.appendChild(infoDiv);
        
        return memberDiv;
    }

    showError() {
        const membersContainer = document.getElementById('discord-members');
        const memberCountElement = document.getElementById('member-count');
        
        if (membersContainer) {
            membersContainer.innerHTML = '<div class="loading-members">Unable to load Discord data</div>';
        }
        
        if (memberCountElement) {
            memberCountElement.textContent = '?';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Discord;
}
