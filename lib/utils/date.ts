/**
 * Utilitaires de date et heure
 */

export function formatDate(date: Date | string): string {
    // Format JJ mois AAAA (ex: 25 décembre 2023)
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    });
}

export function formatTime(time: string): string {
    // Format HH:MM -> HH:MM
    return time.slice(0, 5);
}

export function calculateDuration(bedtime: string, wakeTime: string): number {
    // Calcule la durée entre l'heure de coucher et l'heure de réveil en heures (peut traverser minuit)
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

    let bedTotalMin = bedHour * 60 + bedMin;
    let wakeTotalMin = wakeHour * 60 + wakeMin;

    // Si le réveil est avant le coucher (lendemain)
    if (wakeTotalMin < bedTotalMin) {
    wakeTotalMin += 24 * 60;
    }

    const durationMin = wakeTotalMin - bedTotalMin;
    return durationMin / 60; // Pas d'arrondi
}

export function getDateRange(days: number = 7): { start: Date; end: Date } {
    // Retourne un objet avec la date de début et de fin pour les 'days' derniers jours
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    return { start, end };
}

export function isToday(date: Date | string): boolean {
    // Vérifie si une date donnée est aujourd'hui
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    );
}
