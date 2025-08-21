// Main JavaScript for ZMod website - Coordination Module

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    const navbar = new Navbar();
    const landing = new Landing();
    const servers = new Servers();
    const serverBrowser = new ServerBrowser();
    const discord = new Discord();
    const community = new Community();
    
    if (typeof Webstore !== 'undefined') {
        const webstore = new Webstore();
        window.ZModWebstore = webstore;
    }
    
    // Expose navbar functions globally for debugging and external access
    window.ZModTracking = {
        getCurrentPage: () => navbar.getCurrentPage(),
        getPageStats: () => navbar.getPageStats(),
        setCurrentPage: (page) => navbar.setCurrentPage(page)
    };
    
    // Expose community functions globally for debugging and external access
    window.ZModCommunity = community;
    
    console.log('ZMod website initialized successfully');
    

}); 