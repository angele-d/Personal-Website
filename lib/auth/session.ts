import 'server-only';
import { cookies } from 'next/headers';
import { Session } from '@/types';

const SESSION_COOKIE_NAME = 'session';

/**
 * Récupère la session utilisateur depuis les cookies
 * @returns Session ou null si non connecté
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }

  try {
    // TODO: Décrypter et valider le token JWT
    // Pour l'instant, on parse directement (NON SÉCURISÉ EN PRODUCTION)
    const session = JSON.parse(sessionCookie.value);
    
    // Vérifier l'expiration
    if (new Date(session.expires) < new Date()) {
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Require une session valide, sinon lève une erreur
 * À utiliser dans les Server Components et Server Actions
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized - Please login');
  }
  
  return session;
}

/**
 * Crée une session utilisateur (après login réussi)
 * TODO: Implémenter le chiffrement JWT
 */
export async function createSession(user: { id: string; email: string; name: string }) {
  const cookieStore = await cookies();
  
  const session: Session = {
    user,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
  };
  
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/**
 * Détruit la session (logout)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
