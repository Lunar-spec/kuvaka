export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date)
}

export function formatTime(date: Date | string | number): string {
    // Convert to Date object if it's not already
    let dateObj: Date;

    if (date instanceof Date) {
        dateObj = date;
    } else {
        dateObj = new Date(date);
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        console.error('Invalid date passed to formatTime:', date);
        return 'Invalid time';
    }

    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateObj);
}

export function formatRelativeTime(date: Date | string | number): string {
    const now = new Date();

    // Convert to Date object if it's not already
    let dateObj: Date;

    if (date instanceof Date) {
        dateObj = date;
    } else {
        dateObj = new Date(date);
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        console.error('Invalid date passed to formatRelativeTime:', date);
        return 'Invalid time';
    }

    const diff = now.getTime() - dateObj.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}