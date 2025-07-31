// Servers section functionality for ZMod website
class Servers {
    constructor() {
        this.init();
    }
    
    init() {
        this.initializeServerShowcase();
        this.initializeContentButtons();
    }
    
    // Initialize server showcase functionality
    initializeServerShowcase() {
        // Add any interactive elements for the server showcase
        const serverShowcase = document.querySelector('.server-showcase');
        if (serverShowcase) {
            // Add hover effects or click handlers if needed
        }
        
        // Handle server button clicks
        const serverButtons = document.querySelectorAll('.server-button');
        serverButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // Handle server view action
                console.log('View server clicked');
            });
        });
    }
    
    // Initialize content buttons functionality
    initializeContentButtons() {
        const contentButtons = document.querySelectorAll('.content-button');
        
        contentButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                switch (action) {
                    case 'view-website':
                        // Handle view website action
                        console.log('View website clicked');
                        break;
                    case 'join-server':
                        // Handle join popular server action
                        console.log('Join popular server clicked');
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            });
        });
    }
}

// Export the Servers class for use in main.js
window.Servers = Servers;