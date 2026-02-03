import 'server-only';
import { sql } from './client';

/**
 * =====================================================
 * MEDIA - Gestion des médias consommés
 * =====================================================
 * 
 * Table : media
 * Colonnes : id, user_id, type, title, status, rating, rank,
 *            notes, started_at, finished_at, created_at
 * 
 * ENUM types :
 *   - media_type: 'film' | 'serie' | 'livre' | 'manga' | 'anime'
 *   - media_status: 'a_voir' | 'en_cours' | 'termine'
 */

// Types TypeScript correspondant au schéma Neon
export type MediaType = 'film' | 'serie' | 'livre' | 'manga' | 'anime';
export type MediaStatus = 'a_voir' | 'en_cours' | 'termine';

export interface MediaEntry {
  id: string;
  user_id: string;
  type: MediaType;
  title: string;
  status: MediaStatus;
  rating: number | null;
  rank: number | null;
  notes: string | null;
  started_at: Date | null;
  finished_at: Date | null;
  created_at: Date;
}

export interface MediaStats {
  type: MediaType;
  count: number;
  avg_rating: number | null;
}

/**
 * Récupère tous les médias d'un utilisateur
 */
export async function getMediaEntries(
  userId: string,
  limit?: number
): Promise<MediaEntry[]> {
  const query = limit
    ? sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    : sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `;

  return (await query) as MediaEntry[];
}

/**
 * Récupère un média par ID
 */
export async function getMediaById(
  userId: string,
  mediaId: string
): Promise<MediaEntry | null> {
  const [media] = await sql`
    SELECT *
    FROM media
    WHERE id = ${mediaId} AND user_id = ${userId}
  `;
  
  return media as MediaEntry | null;
}

/**
 * Crée une nouvelle entrée média
 */
export async function createMediaEntry(
  userId: string,
  data: {
    type: MediaType;
    title: string;
    status?: MediaStatus;
    rating?: number;
    rank?: number;
    notes?: string;
    started_at?: Date;
    finished_at?: Date;
  }
): Promise<MediaEntry> {
  const [result] = await sql`
    INSERT INTO media (
      user_id,
      type,
      title,
      status,
      rating,
      rank,
      notes,
      started_at,
      finished_at
    ) VALUES (
      ${userId},
      ${data.type},
      ${data.title},
      ${data.status || 'a_voir'},
      ${data.rating || null},
      ${data.rank || null},
      ${data.notes || null},
      ${data.started_at || null},
      ${data.finished_at || null}
    )
    RETURNING *
  `;
  
  return result as MediaEntry;
}

/**
 * Met à jour une entrée média
 */
export async function updateMediaEntry(
  userId: string,
  mediaId: string,
  updates: Partial<Omit<MediaEntry, 'id' | 'user_id' | 'created_at'>>
): Promise<MediaEntry | null> {
  const [result] = await sql`
    UPDATE media
    SET 
      type = COALESCE(${updates.type || null}, type),
      title = COALESCE(${updates.title || null}, title),
      status = COALESCE(${updates.status || null}, status),
      rating = COALESCE(${updates.rating}, rating),
      rank = COALESCE(${updates.rank}, rank),
      notes = COALESCE(${updates.notes}, notes),
      started_at = COALESCE(${updates.started_at}, started_at),
      finished_at = COALESCE(${updates.finished_at}, finished_at)
    WHERE id = ${mediaId} AND user_id = ${userId}
    RETURNING *
  `;
  
  return result as MediaEntry | null;
}

/**
 * Supprime une entrée média
 */
export async function deleteMediaEntry(
  userId: string,
  mediaId: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM media
    WHERE id = ${mediaId} AND user_id = ${userId}
  `;
  
  return result.length > 0;
}

/**
 * Récupère les statistiques par type de média
 */
export async function getMediaStatsByType(
  userId: string
): Promise<MediaStats[]> {
  const stats = await sql`
    SELECT 
      type,
      COUNT(*)::integer as count,
      ROUND(AVG(rating)::numeric, 2) as avg_rating
    FROM media
    WHERE user_id = ${userId}
    GROUP BY type
    ORDER BY count DESC
  `;
  
  return stats as MediaStats[];
}

/**
 * Récupère les médias par type
 */
export async function getMediaByType(
  userId: string,
  type: MediaType,
  limit?: number
): Promise<MediaEntry[]> {
  const query = limit
    ? sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} AND type = ${type}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    : sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} AND type = ${type}
        ORDER BY created_at DESC
      `;

  return (await query) as MediaEntry[];
}

/**
 * Récupère les médias par statut
 */
export async function getMediaByStatus(
  userId: string,
  status: MediaStatus,
  limit?: number
): Promise<MediaEntry[]> {
  const query = limit
    ? sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `
    : sql`
        SELECT * FROM media 
        WHERE user_id = ${userId} AND status = ${status}
        ORDER BY created_at DESC
      `;

  return (await query) as MediaEntry[];
}

/**
 * Recherche dans les titres de médias
 */
export async function searchMedia(
  userId: string,
  searchTerm: string
): Promise<MediaEntry[]> {
  const data = await sql`
    SELECT *
    FROM media
    WHERE user_id = ${userId}
      AND title ILIKE ${'%' + searchTerm + '%'}
    ORDER BY created_at DESC
  `;
  
  return data as MediaEntry[];
}

/**
 * Marque un média comme terminé
 */
export async function markAsFinished(
  userId: string,
  mediaId: string,
  rating?: number,
  finishedAt?: Date
): Promise<MediaEntry | null> {
  const [result] = await sql`
    UPDATE media
    SET 
      status = 'termine',
      finished_at = ${finishedAt || new Date()},
      rating = COALESCE(${rating || null}, rating)
    WHERE id = ${mediaId} AND user_id = ${userId}
    RETURNING *
  `;
  
  return result as MediaEntry | null;
}

/**
 * Marque un média comme en cours
 */
export async function markAsInProgress(
  userId: string,
  mediaId: string,
  startedAt?: Date
): Promise<MediaEntry | null> {
  const [result] = await sql`
    UPDATE media
    SET 
      status = 'en_cours',
      started_at = COALESCE(${startedAt || null}, started_at)
    WHERE id = ${mediaId} AND user_id = ${userId}
    RETURNING *
  `;
  
  return result as MediaEntry | null;
}
