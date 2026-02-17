/**
 * Date utility functions used throughout the app.
 */

/** Get today's date as YYYY-MM-DD */
export function getToday(): string {
    return formatDateISO(new Date());
}

/** Format a Date to YYYY-MM-DD */
export function formatDateISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Format for display: "Tuesday, Nov 14" */
export function formatDateDisplay(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

/** Get greeting based on time of day */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

/** Get an array of dates for last N days (inclusive of today) */
export function getLastNDays(n: number): string[] {
    const dates: string[] = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(formatDateISO(d));
    }
    return dates;
}

/** Get day-of-week abbreviation from YYYY-MM-DD */
export function getDayAbbr(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
}
