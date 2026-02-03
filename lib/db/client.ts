import 'server-only';
import { neon } from '@neondatabase/serverless';

/**
 * CLIENT NEON SERVERLESS
 * 
 * Pourquoi Neon ?
 * - Connection pooling natif via HTTP/WebSockets (port 443)
 * - Pas de limite de connexions TCP classiques
 * - Parfait pour Vercel Edge & Serverless Functions
 * - Scale to zero automatique
 * 
 * Sécurité :
 * - 'server-only' empêche l'import côté client
 * - Les tagged templates protègent contre les injections SQL
 */

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL manquante dans les variables d\'environnement');
}

// Client singleton - réutilisé dans tous les fichiers de requêtes
export const sql = neon(process.env.DATABASE_URL);

/**
 * Test de connexion à la base de données
 * Utiliser dans un endpoint /api/health ou au démarrage
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Connexion Neon établie');
    return result[0].test === 1;
  } catch (error) {
    console.error('❌ Échec de connexion Neon:', error);
    return false;
  }
}
