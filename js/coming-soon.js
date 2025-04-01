document.addEventListener('DOMContentLoaded', () => {
    // Create a timeline for better control of animation sequence
    const mainTimeline = gsap.timeline();
    
    // Enhanced animation for THE NEXT ERA text
    mainTimeline.fromTo('.next-era-text', 
        { 
            opacity: 0, 
            y: -30,
            scale: 0.8 
        },
        { 
            opacity: 1, 
            y: 0,
            scale: 1, 
            duration: 1.2, 
            ease: "back.out(1.7)"
        }
    ).fromTo('.next-era-text', 
        { backgroundSize: "100% 100%" },
        { 
            backgroundSize: "200% 100%", 
            duration: 1.5, 
            ease: "power1.inOut" 
        },
        "-=0.5" // Overlap with previous animation
    );
    
    // Animate the "COMING SOON" text after THE NEXT ERA appears
    const comingSoonWords = document.querySelectorAll('.coming-soon-word');
    
    mainTimeline.fromTo(comingSoonWords, 
        { opacity: 0, y: 30 },
        { 
            opacity: 1, 
            y: 0, 
            stagger: 0.3,
            duration: 1.2,
            ease: "power3.out"
        },
        "-=0.8" // Start slightly before THE NEXT ERA finishes
    );
    
    // Fade in the logo
    gsap.fromTo('.logo-container', 
        { opacity: 0, scale: 0.95 },
        { 
            opacity: 0.1, 
            scale: 1,
            duration: 2.5,
            ease: "power2.out",
            onComplete: () => {
                // Start the floating and pulsing animations after fade-in completes
                // Subtle floating effect for the background logo
                gsap.to('.logo-container', {
                    y: '+=20',
                    x: '+=10',
                    rotation: 1,
                    duration: 8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
                
                // Pulsing opacity effect for the background logo
                gsap.to('.logo-container', {
                    opacity: 0.15,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    );
    
    // Animate the background lines
    const lines = document.querySelectorAll('.animated-line');
    
    lines.forEach((line, index) => {
        // Initial position off-screen
        gsap.set(line, { 
            x: -window.innerWidth,
            opacity: 0 
        });
        
        // Animate the line moving across the screen
        gsap.to(line, {
            x: window.innerWidth,
            opacity: 0.3,
            duration: 8,
            delay: index * 1.5,
            repeat: -1,
            ease: "none"
        });
    });
    
    // Note: No redirect needed here as GitHub Pages will automatically use 404.html
});

// Add event listener for resize to adjust animations
window.addEventListener('resize', () => {
    // Refresh animations if needed
    const lines = document.querySelectorAll('.animated-line');
    
    lines.forEach((line) => {
        gsap.killTweensOf(line);
        
        gsap.set(line, { 
            x: -window.innerWidth,
            opacity: 0 
        });
        
        gsap.to(line, {
            x: window.innerWidth,
            opacity: 0.3,
            duration: 8,
            repeat: -1,
            ease: "none"
        });
    });
}); 