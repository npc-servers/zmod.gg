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
}); 