document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial animations for hero section
    const mainTimeline = gsap.timeline({
        defaults: { 
            ease: "power3.out",
            duration: 0.8
        }
    });

    // Make sure buttons are visible initially
    gsap.set('.buttons', { autoAlpha: 1 });
    gsap.set('.buttons .btn', { autoAlpha: 0, y: 20 });

    // Animate the grid background
    mainTimeline
    .from('.grid-background', {
        opacity: 0,
        scale: 1.1,
        duration: 1
    })
    // Animate particles
    .from('.particle', {
        opacity: 0,
        scale: 0,
        y: 100,
        duration: 0.8,
        stagger: {
            amount: 0.3,
            from: "random"
        }
    }, "-=0.8")
    // Animate text content
    .from('.subtitle', {
        y: 50,
        opacity: 0
    }, "-=0.4")
    .from('h1', {
        y: 50,
        opacity: 0,
        duration: 0.8
    }, "-=0.6")
    .from('.highlight', {
        color: "#fff",
        textShadow: "none",
        duration: 0.6
    }, "-=0.4")
    .from('.description', {
        y: 30,
        opacity: 0
    }, "-=0.3")
    // Animate buttons immediately after description
    .to('.buttons .btn', {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.2");

    // Parallax effect on scroll
    gsap.to('.particle-container', {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // Subtle floating animation for particles
    gsap.to('.particle', {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            amount: 2,
            from: "random"
        }
    });

    // Debug: Log if buttons are found
    console.log("Buttons found:", document.querySelectorAll('.buttons .btn').length);
}); 