/**
 * Time utilities — conversion between 24h internal and 12h display formats.
 */

/**
 * Convert "14:30" → "2:30 PM", "06:00" → "6:00 AM"
 */
export function to12Hour(time24: string): string {
    if (!time24 || time24 === 'All Day') return time24;
    const [h, m] = time24.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return time24;
    const period = h >= 12 ? 'PM' : 'AM';
    const hours12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hours12}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Convert "2:30 PM" → "14:30", "6:00 AM" → "06:00"
 */
export function to24Hour(time12: string): string {
    if (!time12 || time12 === 'All Day') return time12;
    const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return time12;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Format time range: "6:00 AM - 7:15 AM"
 */
export function formatTimeRange(startTime: string, endTime: string): string {
    const start = to12Hour(startTime);
    if (!endTime) return start;
    return `${start} - ${to12Hour(endTime)}`;
}
