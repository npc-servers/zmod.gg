class LastUpdated {
    constructor() {
        this.container = document.querySelector('.text-wrapper');
        if (!this.container) return;
        
        // Get the current page path
        const currentPath = window.location.pathname;
        let targetFile;
        
        // Determine which file to check based on the current path
        if (currentPath.includes('store/terms')) {
            targetFile = window.location.pathname;  // Use the full current path
        } else if (currentPath.includes('privacy')) {
            targetFile = 'privacy.html';
        } else {
            targetFile = 'terms.html';
        }
        
        // Get the last modified date of the appropriate file
        fetch(targetFile)
            .then(response => {
                const lastModified = response.headers.get('last-modified');
                if (lastModified) {
                    const date = new Date(lastModified);
                    const formattedDate = this.formatDate(date);
                    this.container.innerHTML = `Last updated: <span class="date">${formattedDate}</span>`;
                }
            })
            .catch(error => {
                console.error('Error fetching last modified date:', error);
                // Fallback to current date if fetch fails
                const date = new Date();
                const formattedDate = this.formatDate(date);
                this.container.innerHTML = `Last updated: <span class="date">${formattedDate}</span>`;
            });
    }

    formatDate(date) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `<span class="month">${months[date.getMonth()]}</span>&nbsp;${date.getFullYear()}`;
    }
}

export default LastUpdated; 