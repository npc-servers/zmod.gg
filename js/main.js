// Main JavaScript for ZMod website

document.addEventListener('DOMContentLoaded', function() {
    // Page tracking variables
    let currentPage = 'home';
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const sections = [];
    
    // Server configuration
    const serverGroups = [
        {
            id: 'sandbox',
            name: 'Sandbox',
            type: 'single',
            servers: [{ id: 'sandbox', name: 'Sandbox', ip: '193.243.190.18', port: '27015' }]
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
            id: 'zscenario',
            name: 'ZScenario',
            type: 'single',
            servers: [{ id: 'zscenario', name: 'ZScenario', ip: '193.243.190.18', port: '27025' }]
        },
        {
            id: 'mapsweepers',
            name: 'MapSweepers',
            type: 'single',
            servers: [{ id: 'mapsweepers', name: 'MapSweepers', ip: '193.243.190.18', port: '27027' }]
        }
    ];
    
    // Initialize scramble animation
    initializeScrambleAnimation();
    
    // Initialize hamburger menu
    initializeHamburgerMenu();
    
    // Initialize page tracking
    initializePageTracking();
    
    // Initialize server browser
    initializeServerBrowser();
    

    
    // Scramble animation functionality
    function initializeScrambleAnimation() {
        const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        
        function scrambleText(element, originalText, duration = 600) {
            const chars = originalText.split('');
            const totalFrames = Math.floor(duration / 50); // 50ms per frame
            let frame = 0;
            
            // Store original text to restore later
            const finalText = originalText;
            
            // Fix the width before animation starts
            const originalWidth = element.offsetWidth;
            const originalMinWidth = element.style.minWidth;
            const originalWidth_style = element.style.width;
            element.style.width = originalWidth + 'px';
            element.style.minWidth = originalWidth + 'px';
            
            const scrambleInterval = setInterval(() => {
                let scrambledText = '';
                
                // Build scrambled text with exact same character count
                for (let i = 0; i < chars.length; i++) {
                    const originalChar = finalText[i];
                    const progress = frame / totalFrames;
                    const charProgress = Math.max(0, (progress - (i * 0.1)) * 2);
                    
                    // Preserve spaces and special characters as-is
                    if (originalChar === ' ' || originalChar === '-' || originalChar === '_') {
                        scrambledText += originalChar;
                    } else if (charProgress >= 1) {
                        // Character is finalized
                        scrambledText += originalChar;
                    } else {
                        // Character is scrambling - use random character
                        scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    }
                }
                
                element.textContent = scrambledText;
                frame++;
                
                if (frame > totalFrames) {
                    clearInterval(scrambleInterval);
                    element.textContent = finalText; // Ensure final text is correct
                    
                    // Reset width styles after animation
                    element.style.width = originalWidth_style;
                    element.style.minWidth = originalMinWidth;
                }
            }, 50);
        }
        
        // Apply scramble animation to desktop nav links
        navLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
        
        // Apply scramble animation to mobile nav links
        mobileNavLinks.forEach(link => {
            const originalText = link.textContent.trim();
            let isScrambling = false;
            
            link.addEventListener('mouseenter', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
            
            // Also trigger on touch for mobile devices
            link.addEventListener('touchstart', function() {
                if (!isScrambling) {
                    isScrambling = true;
                    scrambleText(this, originalText, 500);
                    setTimeout(() => {
                        isScrambling = false;
                    }, 500);
                }
            });
        });
    }
    
    // Initialize hamburger menu functionality
    function initializeHamburgerMenu() {
        // Toggle hamburger menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeHamburgerMenu();
            }
        });
        
        // Handle mobile navigation links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetPage = this.getAttribute('data-page');
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
                
                // Close mobile menu
                closeHamburgerMenu();
                
                // Update active state immediately for better UX
                updateActiveNavLink(targetPage);
                
                if (targetElement) {
                    // Smooth scroll to target
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update page tracking
                    setCurrentPage(targetPage);
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeHamburgerMenu();
            }
        });
    }
    
    // Close hamburger menu
    function closeHamburgerMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Smooth scrolling for desktop navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId) || document.querySelector('.landing');
            
            // Update active state immediately for better UX
            updateActiveNavLink(targetPage);
            
            if (targetElement) {
                // Smooth scroll to target
                const offsetTop = targetElement.offsetTop - 100; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update page tracking
                setCurrentPage(targetPage);
            }
        });
    });
    
    // Initialize page tracking system
    function initializePageTracking() {
        // Set up intersection observer for automatic page detection
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };
        
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || 'home';
                    setCurrentPage(sectionId);
                }
            });
        }, observerOptions);
        
        // Observe the landing section (home)
        const landingSection = document.querySelector('.landing');
        if (landingSection) {
            landingSection.id = 'home';
            sectionObserver.observe(landingSection);
        }
        
        // Set initial active state
        updateActiveNavLink('home');
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                trackPageView(currentPage);
            }
        });
        
        // Track initial page load
        trackPageView('home');
    }
    
    // Update current page and navigation state
    function setCurrentPage(page) {
        if (currentPage !== page) {
            currentPage = page;
            updateActiveNavLink(page);
            trackPageView(page);
            
            // Update URL hash without triggering scroll
            if (history.replaceState) {
                history.replaceState(null, null, `#${page}`);
            }
        }
    }
    
    // Update active navigation link
    function updateActiveNavLink(activePage) {
        // Update desktop navigation links
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update mobile navigation links
        mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Track page views (can be extended for analytics)
    function trackPageView(page) {
        console.log(`Page tracked: ${page} at ${new Date().toISOString()}`);
        
        // Store in localStorage for session tracking
        const pageViews = JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
        pageViews[page] = pageViews[page] || 0;
        pageViews[page]++;
        pageViews.lastVisited = page;
        pageViews.lastVisitTime = new Date().toISOString();
        localStorage.setItem('zmod_page_views', JSON.stringify(pageViews));
        
        // Trigger custom event for potential analytics integration
        document.dispatchEvent(new CustomEvent('pageTracked', {
            detail: {
                page: page,
                timestamp: new Date().toISOString(),
                totalViews: pageViews[page]
            }
        }));
    }
    
    // Get page tracking stats
    function getPageStats() {
        return JSON.parse(localStorage.getItem('zmod_page_views') || '{}');
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash.slice(1) || 'home';
        setCurrentPage(hash);
        
        // Scroll to section if it exists
        const targetElement = document.querySelector(`#${hash}`) || document.querySelector('.landing');
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Navbar scroll effect with hide/show functionality
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position (only when not at very top)
        if (currentScrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScrollY > 100) { // Only hide after scrolling past 100px
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide navbar
                header.classList.add('hidden');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show navbar
                header.classList.remove('hidden');
            }
        } else {
            // Always show navbar when near the top
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Intersection Observer for scroll animations (for future sections)
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, animationObserverOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.landing-content');
    animateElements.forEach(el => animationObserver.observe(el));
    
    // Observe servers section for intersection
    const serversSection = document.querySelector('.servers');
    if (serversSection) {
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentPage('servers');
                }
            });
        }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });
        
        sectionObserver.observe(serversSection);
    }
    
    // Expose page tracking functions globally for debugging
    window.ZModTracking = {
        getCurrentPage: () => currentPage,
        getPageStats: getPageStats,
        setCurrentPage: setCurrentPage
    };
    
    // Handle smooth scrolling for server section links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href="#servers"]') || e.target.matches('a[data-page="servers"]')) {
            e.preventDefault();
            const serversSection = document.querySelector('.servers');
            if (serversSection) {
                const offsetTop = serversSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                setCurrentPage('servers');
            }
        }
    });
    
    // Server browser functionality
    // Helper function to determine background class based on server data
    function getServerBackgroundClass(serverData) {
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
        
        // For ZScenario and MapSweepers, use homigrad as they're tactical/scenario based
        if (serverId.includes('zscenario') || serverName.toLowerCase().includes('zscenario') ||
            serverId.includes('mapsweepers') || serverName.toLowerCase().includes('mapsweepers')) {
            return 'bg-homigrad';
        }
        
        // Default fallback - no background
        return '';
    }

    function updateServerStatus(server) {
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
    
    function createServerCard(server, status) {
        const card = document.createElement('div');
        const backgroundClass = getServerBackgroundClass(server);
        card.className = `server-card ${status.online ? 'online' : 'offline'} ${backgroundClass}`;
        card.innerHTML = `
            <div class="server-status-indicator ${status.online ? 'online' : 'offline'}"></div>
            <div class="server-info-left">
                <div class="server-details">
                    <h3 class="server-name">${server.name}</h3>
                    <p class="server-map">${status.map}</p>
                </div>
            </div>
            <div class="server-info-right">
                <div class="server-players">${status.players}/${status.maxPlayers}</div>
                <button class="server-join-btn" onclick="connectToServer('${server.ip}', '${server.port}')" ${!status.online ? 'disabled' : ''}>
                    ${status.online ? 'Connect' : 'Offline'}
                </button>
            </div>
        `;
        return card;
    }
    
    function createSubServerCard(server, status) {
        const card = document.createElement('div');
        const backgroundClass = getServerBackgroundClass(server);
        card.className = `server-sub-card ${status.online ? 'online' : 'offline'} ${backgroundClass}`;
        card.innerHTML = `
            <div class="server-sub-status-indicator ${status.online ? 'online' : 'offline'}"></div>
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
    
    function createServerGroup(group, statuses) {
        const totalPlayers = statuses.reduce((sum, status) => sum + status.players, 0);
        const totalMaxPlayers = statuses.reduce((sum, status) => sum + (typeof status.maxPlayers === 'number' ? status.maxPlayers : 0), 0);
        const onlineServers = statuses.length; // All statuses are online since we filtered them
        
        // Use group data to determine background class (for groups like ZGRAD)
        const backgroundClass = getServerBackgroundClass(group);
        
        const groupContainer = document.createElement('div');
        groupContainer.className = 'server-group';
        groupContainer.innerHTML = `
            <div class="server-group-main ${backgroundClass}" onclick="toggleServerGroup('${group.id}')">
                <div class="server-group-info-left">
                    <div class="server-group-details">
                        <h3 class="server-group-name">${group.name}</h3>
                        <p class="server-group-subtitle">${onlineServers} ${onlineServers === 1 ? 'server' : 'servers'} online</p>
                    </div>
                </div>
                <div class="server-group-info-right">
                    <div class="server-group-players">${totalPlayers}/${totalMaxPlayers > 0 ? totalMaxPlayers : '?'}</div>
                    <button class="server-expand-btn" onclick="event.stopPropagation(); toggleServerGroup('${group.id}')">
                        <span>Expand</span>
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
    
    function initializeServerBrowser() {
        const serverList = document.getElementById('server-list');
        const totalPlayersCountElement = document.getElementById('total-players-count');
        
        // Collect all servers from all groups
        const allServers = [];
        serverGroups.forEach(group => {
            allServers.push(...group.servers);
        });
        
        // Fetch all server statuses
        Promise.all(allServers.map(server => updateServerStatus(server)))
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

                serverGroups.forEach(group => {
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
                            
                            const groupElement = createServerGroup(onlineGroup, onlineStatuses);
                            
                            // Add sub-servers to the sub-list (sorted by player count)
                            const subList = groupElement.querySelector(`#sub-list-${group.id}`);
                            const sortedSubServers = onlineServers
                                .map((server, subIndex) => ({ server, status: onlineStatuses[subIndex] }))
                                .sort((a, b) => b.status.players - a.status.players);
                            
                            sortedSubServers.forEach(({ server, status }) => {
                                const subCard = createSubServerCard(server, status);
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
                            const card = createServerCard(server, status);
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
                    serverElements.forEach(({ element }) => {
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
                initializeServerBrowser();
            }, 30000);
        }
    }
    
    // Toggle server group expansion
    window.toggleServerGroup = function(groupId) {
        const subList = document.getElementById(`sub-list-${groupId}`);
        const groupContainer = subList ? subList.closest('.server-group') : null;
        const expandBtn = groupContainer ? groupContainer.querySelector('.server-expand-btn') : null;
        const mainContainer = groupContainer ? groupContainer.querySelector('.server-group-main') : null;
        
        if (subList && expandBtn && mainContainer) {
            const isExpanded = subList.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                subList.classList.remove('expanded');
                expandBtn.classList.remove('expanded');
                mainContainer.classList.remove('expanded');
                expandBtn.querySelector('span:first-child').textContent = 'Expand';
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
    
    // Observer for server browser section
    const serverBrowserSection = document.querySelector('.server-browser');
    if (serverBrowserSection) {
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentPage('server-browser');
                }
            });
        }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });
        
        sectionObserver.observe(serverBrowserSection);
    }
}); 