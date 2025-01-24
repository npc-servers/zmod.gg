document.addEventListener('DOMContentLoaded', () => {
    // Initial GSAP animations
    gsap.set(".decorative-square", { opacity: 0 });
    
    gsap.to(".decorative-square.top-left", {
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
    });

    gsap.to(".decorative-square.top-right", {
        opacity: 1,
        duration: 1,
        delay: 0.8,
        ease: "power2.out"
    });

    gsap.to(".decorative-square.bottom-right", {
        opacity: 1,
        duration: 1,
        delay: 1.4,
        ease: "power2.out"
    });

    gsap.to(".decorative-square.bottom-left", {
        opacity: 1,
        duration: 1,
        delay: 2,
        ease: "power2.out"
    });

    // Animate scroll cue text
    const scrollCueText = document.querySelector('.scroll-cue .text-wrapper');
    const text = scrollCueText.textContent.trim();
    scrollCueText.textContent = '';
    
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;  // Use non-breaking space for spaces
        span.style.animationDelay = `${1.5 + (i * 0.05)}s`;
        scrollCueText.appendChild(span);
    });

    // Chart initialization
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

    // Notification System
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
        rightSideDelay: 4000 // Delay for right side
    };

    // Track active notifications and animation state
    const activeNotifications = {
        left: [],
        right: []
    };

    let isPageVisible = true;
    let notificationTimers = {
        left: null,
        right: null
    };

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        isPageVisible = document.visibilityState === 'visible';
        
        // Clear existing timers when page becomes hidden
        if (!isPageVisible) {
            Object.keys(notificationTimers).forEach(side => {
                if (notificationTimers[side]) {
                    cancelAnimationFrame(notificationTimers[side]);
                    notificationTimers[side] = null;
                }
            });
        } else {
            // Restart notifications when page becomes visible
            startNotifications('left');
            startNotifications('right');
        }
    });

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
        if (!isPageVisible || activeNotifications[side].length >= NOTIFICATION_CONFIG.maxPerSide) return;

        const container = document.querySelector(`.notifications-${side}`);
        const notification = document.createElement('div');
        const notificationContent = generateNotification();
        
        notification.className = 'notification-box';
        notification.innerHTML = notificationContent.html;
        container.appendChild(notification);
        
        activeNotifications[side].push(notification);
        
        gsap.fromTo(notification, 
            {
                y: window.innerHeight + 20,
                opacity: 0
            },
            {
                y: -100,
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

    function scheduleNextNotification(side) {
        if (!isPageVisible) return;

        createNotification(side);
        
        // Schedule next notification using requestAnimationFrame
        const startTime = performance.now();
        const animate = (currentTime) => {
            if (!isPageVisible) return;
            
            const elapsed = currentTime - startTime;
            if (elapsed >= NOTIFICATION_CONFIG.spawnInterval) {
                scheduleNextNotification(side);
            } else {
                notificationTimers[side] = requestAnimationFrame(animate);
            }
        };
        
        notificationTimers[side] = requestAnimationFrame(animate);
    }

    // Start notification system
    function startNotifications(side) {
        if (!isPageVisible || notificationTimers[side]) return;
        
        setTimeout(() => {
            scheduleNextNotification(side);
        }, NOTIFICATION_CONFIG.startDelay + (side === 'right' ? NOTIFICATION_CONFIG.rightSideDelay : 0));
    }

    // Start both sides
    startNotifications('left');
    startNotifications('right');

    // Scroll behavior
    const scrollCue = document.querySelector('.scroll-cue');
    const container = document.querySelector('.container');
    let lastScrollTop = 0;
    let isScrollCueVisible = true;
    
    container.addEventListener('scroll', () => {
        const scrollTop = container.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down and past threshold
            if (isScrollCueVisible) {
                isScrollCueVisible = false;
                gsap.to(scrollCue, {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            }
        } else if (scrollTop < 50) {
            // Back at top
            if (!isScrollCueVisible) {
                isScrollCueVisible = true;
                gsap.to(scrollCue, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scroll handling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Move scrollToAbout function outside the event listener
    window.scrollToAbout = function() {
        const container = document.querySelector('.container');
        const aboutSection = document.getElementById('about');
        container.scrollTo({
            top: aboutSection.offsetTop,
            behavior: 'smooth'
        });
    }
}); 