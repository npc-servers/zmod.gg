class LastUpdated {
    constructor() {
        this.container = document.querySelector('.text-wrapper');
        if (!this.container) return;
        
        // Get the last modified date of the terms.html file
        fetch('terms.html')
            .then(response => {
                const lastModified = response.headers.get('last-modified');
                if (lastModified) {
                    const date = new Date(lastModified);
                    const formattedDate = this.formatDate(date);
                    this.container.innerHTML = `Last updated: <span class="date">${formattedDate}</span>`;
                }
            })
            .catch(error => console.error('Error fetching last modified date:', error));
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