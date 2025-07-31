// Main JavaScript for ZMod website - Coordination Module

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    const navbar = new Navbar();
    const landing = new Landing();
    const servers = new Servers();
    const serverBrowser = new ServerBrowser();
    
    // Expose navbar functions globally for debugging and external access
    window.ZModTracking = {
        getCurrentPage: () => navbar.getCurrentPage(),
        getPageStats: () => navbar.getPageStats(),
        setCurrentPage: (page) => navbar.setCurrentPage(page)
    };
    
    console.log('ZMod website initialized successfully');
    

}); 