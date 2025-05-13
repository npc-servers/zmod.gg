document.addEventListener('DOMContentLoaded', function() {
    // GSAP animation for About section
    if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate header
        gsap.from('.about-header', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate image
        gsap.from('.about-image', {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate text content
        gsap.from('.about-text', {
            opacity: 0,
            x: 50,
            duration: 0.8,
            delay: 0.4,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate stats with stagger
        gsap.from('.stat-box', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate team members with stagger
        gsap.from('.team-member', {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.team-preview',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate hardware performance section
        gsap.from('.hardware-performance', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.hardware-performance',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        // Counter animation for stat values
        const statElements = document.querySelectorAll('.stat-value[data-value]');
        statElements.forEach(stat => {
            const value = parseInt(stat.getAttribute('data-value'));
            
            gsap.to(stat, {
                innerText: value,
                duration: 2,
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    stat.textContent = Math.floor(this.targets()[0].innerText);
                }
            });
        });
    }
    
    // TPS Chart with Chart.js
    function initTpsChart() {
        const ctx = document.getElementById('tpsChart').getContext('2d');
        const currentTpsEl = document.querySelector('.tps-current');
        const avgTpsEl = document.querySelector('.tps-avg');
        
        // Add blur effect to chart container
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.style.position = 'relative';
            chartContainer.style.zIndex = '1';
            
            // Add a pseudo-element with blur
            const blurBg = document.createElement('div');
            blurBg.style.position = 'absolute';
            blurBg.style.top = '0';
            blurBg.style.left = '0';
            blurBg.style.right = '0';
            blurBg.style.bottom = '0';
            blurBg.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            blurBg.style.backdropFilter = 'blur(15px)';
            blurBg.style.webkitBackdropFilter = 'blur(15px)';
            blurBg.style.borderRadius = '8px';
            blurBg.style.zIndex = '-1';
            
            chartContainer.appendChild(blurBg);
        }
        
        // Base values
        const maxTPS = 66;
        const minValue = 60;
        const dataPoints = 16; // Number of data points to show
        
        // Generate initial timestamps (past 4 minutes in 15-second intervals)
        function generateLabels() {
            const now = new Date();
            const labels = [];
            
            for (let i = dataPoints - 1; i >= 0; i--) {
                let secondsAgo = i * 15;
                let timeAgo = new Date(now - secondsAgo * 1000);
                let minuteAgo = timeAgo.getMinutes();
                let secondAgo = timeAgo.getSeconds();
                labels.push(`${String(minuteAgo).padStart(2, '0')}:${String(secondAgo).padStart(2, '0')}`);
            }
            
            return labels;
        }
        
        // Generate initial data (random values between minValue and maxTPS)
        function generateData() {
            const data = [];
            let total = 0;
            let prevValue = 65 + (Math.random() * 1 - 0.5); // Start closer to 65 rather than 66
            
            for (let i = 0; i < dataPoints; i++) {
                // Generate values with small variations from previous point for smoother line
                let maxChange = 1.2; // Maximum change between points (smaller for less variation)
                
                // Bias toward 65.5 instead of 66 to prevent top cutoff
                let bias = (65.5 - prevValue) * 0.3; // Target slightly below max
                
                let change = (Math.random() * maxChange * 2) - maxChange + bias;
                let value = prevValue + change;
                
                // Ensure value stays in range with buffer at top
                value = Math.max(minValue, Math.min(66, value));
                
                data.push(value);
                total += value;
                prevValue = value;
            }
            
            // Update stats
            updateStats(data[data.length - 1], total / dataPoints);
            
            return data;
        }
        
        // Update TPS stats display
        function updateStats(current, average) {
            if (currentTpsEl) {
                currentTpsEl.textContent = Math.round(current);
            }
            
            if (avgTpsEl) {
                avgTpsEl.textContent = average.toFixed(1);
            }
        }
        
        // Create gradient for fill
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)'); // Even more subtle
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Completely transparent
        
        // Create chart
        const tpsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: generateLabels(),
                datasets: [{
                    label: 'TPS',
                    data: generateData(),
                    borderColor: 'rgba(255, 255, 255, 0.2)', // More transparent line
                    borderWidth: 1, // Thinner line
                    tension: 0.6, // More smooth curve
                    fill: true,
                    backgroundColor: gradient,
                    pointRadius: 0, // Hide points
                    pointHoverRadius: 0,
                    pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
                    segment: {
                        borderColor: ctx => 'rgba(255, 255, 255, 0.2)'
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // Disable all animations
                layout: {
                    padding: {
                        top: 20, // Add padding to prevent cutoff
                        bottom: 0,
                        left: 0,
                        right: 0
                    }
                },
                elements: {
                    line: {
                        tension: 0.6 // More smooth curve
                    }
                },
                scales: {
                    y: {
                        min: 59.5, // Lower minimum to prevent cutoff
                        max: 66.5, // Slightly higher maximum for padding
                        grid: {
                            display: false, // Hide grid lines
                            drawBorder: false, // Remove border
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            display: false, // Hide ticks
                            padding: 8
                        },
                        title: {
                            display: false, // Hide title
                        },
                        display: false, // Hide y-axis completely
                    },
                    x: {
                        grid: {
                            display: false, // Hide grid lines
                            drawBorder: false, // Remove border
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            display: false, // Hide ticks
                        },
                        title: {
                            display: false, // Hide title
                        },
                        display: true // Keep x-axis (might not be necessary if labels are off)
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: 'rgba(255, 255, 255, 0.9)',
                        bodyColor: 'rgba(255, 255, 255, 0.9)',
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                return 'Time: ' + tooltipItems[0].label;
                            },
                            label: function(context) {
                                return 'TPS: ' + context.raw.toFixed(1);
                            }
                        }
                    }
                }
            }
        });
        
        // Update chart every second
        function updateChart() {
            // Get current data and last value
            const currentData = tpsChart.data.datasets[0].data;
            const lastValue = currentData[currentData.length - 1];
            
            // Generate new value with small variation from last value, biased toward 65.5
            let maxChange = 1.2; // Maximum change between points
            
            // Bias toward 65.5 - if we're far from 65.5, tend to move back toward it
            let bias = (65.5 - lastValue) * 0.3; // Target slightly below max for better display
            
            let change = ((Math.random() * maxChange * 2) - maxChange) + bias;
            let newValue = lastValue + change;
            
            // Ensure value stays in range 60-66 with slight buffer at top
            newValue = Math.max(minValue, Math.min(66, newValue));
            
            // Remove first data point and add new one
            tpsChart.data.datasets[0].data.shift();
            tpsChart.data.datasets[0].data.push(newValue);
            
            // Calculate new average
            const total = tpsChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const avg = total / tpsChart.data.datasets[0].data.length;
            
            // Update stats
            updateStats(newValue, avg);
            
            // Update labels (timestamps)
            const now = new Date();
            let minute = now.getMinutes();
            let second = now.getSeconds();
            const currentTime = `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
            
            tpsChart.data.labels.shift();
            tpsChart.data.labels.push(currentTime);
            
            // Update chart
            tpsChart.update('none');
        }
        
        // Update chart every second
        const updateInterval = setInterval(updateChart, 1000);
        
        return updateInterval;
    }
    
    // Hover effects for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const memberName = this.getAttribute('data-name');
            const memberRole = this.getAttribute('data-role');
            
            const teamText = document.querySelector('.team-text');
            if (teamText && memberName && memberRole) {
                teamText.innerHTML = `<strong>${memberName}</strong> - ${memberRole}`;
                teamText.style.opacity = '1';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const teamText = document.querySelector('.team-text');
            if (teamText) {
                teamText.innerHTML = 'Meet the team behind ZMOD';
                teamText.style.opacity = '0.8';
            }
        });
    });

    // Start the TPS chart when it becomes visible
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const updateInterval = initTpsChart();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        const tpsChart = document.querySelector('#tpsChart');
        if (tpsChart) {
            observer.observe(tpsChart);
        }
    } else {
        // Fallback for browsers without IntersectionObserver
        const updateInterval = initTpsChart();
    }
}); 