/**
 * Utilitaires de formattage et validation
 */

export function formatDuration(hours: number): string {
    // Ex: 1.5 -> "1h30", 2 -> "2h"
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h${m}` : `${h}h`;
}

export function validateEmail(email: string): boolean {
    // Simple regex de validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
// Min 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

export function slugify(text: string): string {
    // Convertit un texte en slug (ex: "Hello World!" -> "hello-world")
    return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
    // Tronque un texte à une longueur donnée et ajoute "..." si nécessaire
    return text.length > length ? text.slice(0, length) + '...' : text;
}
