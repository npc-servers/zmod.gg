document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [15, 65, 25, 85, 35, 95],
                borderColor: '#a30000',
                borderWidth: 4,
                fill: false,
                tension: 0,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                onProgress: function(animation) {
                    const progress = animation.currentStep / animation.numSteps;
                    ctx.canvas.style.clipPath = `inset(0 ${100 - (progress * 100)}% 0 0)`;
                },
                duration: 1000
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });

    // GSAP Text Animation
    gsap.set(".background-text", {
        opacity: 0,
        y: 50
    });

    gsap.to(".background-text", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3
    });

    // Simplified Notification System
    const notificationTypes = [
        {
            type: 'join',
            message: "joined!",
            icon: '<i class="fas fa-user-plus"></i>'
        },
        {
            type: 'donation',
            message: "subscribed for $VALUE!",
            values: [4.99, 9.99, 14.99, 19.99, 24.99],
            icon: '<i class="fas fa-star"></i>'
        }
    ];

    const usernames = [
        "DragonSlayer", "NightWalker", "CryptoKing", "PixelMaster", "ShadowHunter",
        "StarLord", "IronWolf", "ThunderBolt", "DarkKnight", "FrostQueen",
        "PhoenixRider", "StormChaser", "MoonWalker", "SunWarrior", "OceanRider",
        "FireBreather", "IceWizard", "EarthShaker", "WindRunner", "LightBringer"
    ];

    const NOTIFICATION_CONFIG = {
        maxPerSide: 4,
        spacing: 100,        // Pixels between each notification
        bottomOffset: 40,    // Pixels from bottom of screen
        duration: 8,         // Seconds to travel
        spawnInterval: 3000, // Milliseconds between spawns
        startDelay: 1000,    // Milliseconds before first notification
        rightSideDelay: 4000 // Increased delay for right side (was 2000)
    };

    // Track active notifications on each side
    const activeNotifications = {
        left: [],
        right: []
    };

    function generateNotification() {
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        
        let finalMessage = type.message;
        if (type.values) {
            const value = type.values[Math.floor(Math.random() * type.values.length)];
            finalMessage = finalMessage.replace('VALUE', value.toFixed(2));
        }

        return {
            html: `${type.icon} <span class="username">${username}</span> ${finalMessage}`
        };
    }

    function createNotification(side) {
        if (activeNotifications[side].length >= NOTIFICATION_CONFIG.maxPerSide) return;

        const container = document.querySelector(`.notifications-${side}`);
        const notification = document.createElement('div');
        const notificationContent = generateNotification();
        
        notification.className = 'notification-box';
        notification.innerHTML = notificationContent.html;
        container.appendChild(notification);
        
        // Add to active notifications
        activeNotifications[side].push(notification);
        
        // Single smooth animation from bottom to top
        gsap.fromTo(notification, 
            {
                y: window.innerHeight + 20,  // Start below viewport
                opacity: 0
            },
            {
                y: -100,  // End above viewport
                opacity: 1,
                duration: NOTIFICATION_CONFIG.duration,
                ease: "none",
                onComplete: () => {
                    activeNotifications[side] = activeNotifications[side].filter(n => n !== notification);
                    notification.remove();
                }
            }
        );
    }

    // Start notification system
    function startNotifications(side) {
        const spawnNotification = () => {
            createNotification(side);
            setTimeout(spawnNotification, NOTIFICATION_CONFIG.spawnInterval);
        };
        
        setTimeout(spawnNotification, 
            NOTIFICATION_CONFIG.startDelay + 
            (side === 'right' ? NOTIFICATION_CONFIG.rightSideDelay : 0)
        );
    }

    // Start both sides
    startNotifications('left');
    startNotifications('right');
}); 