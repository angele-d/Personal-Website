import 'server-only';
import { sql } from './client';

/**
 * =====================================================
 * SLEEP LOGS - Gestion des logs de sommeil
 * =====================================================
 * 
 * Table : sleep_logs
 * Colonnes : id, user_id, sleep_date, bedtime, wake_time, 
 *            duration_hours, notes, created_at
 */

// Types pour cette table spécifiquement
export interface SleepLog {
  id: string;
  user_id: string;
  sleep_date: Date;
  bedtime: string;
  wake_time: string;
  duration_hours: number;
  notes: string | null;
  created_at: Date;
}

export interface SleepStats {
  avg_duration: number | null;
  total_logs: number;
}

/**
 * Récupère tous les logs de sommeil d'un utilisateur
 */
export async function getSleepLogs(
  userId: string,
  limit?: number
): Promise<SleepLog[]> {
  const query = limit
    ? sql`
        SELECT * FROM sleep_logs
        WHERE user_id = ${userId}
        ORDER BY sleep_date DESC
        LIMIT ${limit}
      `
    : sql`
        SELECT * FROM sleep_logs
        WHERE user_id = ${userId}
        ORDER BY sleep_date DESC
      `;

  return (await query) as SleepLog[];
}

/**
 * Récupère un log de sommeil par ID
 */
export async function getSleepLogById(
  userId: string,
  logId: string
): Promise<SleepLog | null> {
  const [log] = await sql`
    SELECT *
    FROM sleep_logs
    WHERE id = ${logId} AND user_id = ${userId}
  `;

  return log as SleepLog | null;
}

/**
 * Crée un nouveau log de sommeil
 */
export async function createSleepLog(
  userId: string,
  data: {
    sleep_date: Date;
    bedtime: string;
    wake_time: string;
    duration_hours: number;
    notes?: string;
  }
): Promise<SleepLog> {
  const [result] = await sql`
    INSERT INTO sleep_logs (
      user_id,
      sleep_date,
      bedtime,
      wake_time,
      duration_hours,
      notes
    ) VALUES (
      ${userId},
      ${data.sleep_date},
      ${data.bedtime},
      ${data.wake_time},
      ${data.duration_hours},
      ${data.notes || null}
    )
    RETURNING *
  `;
  
  return result as SleepLog;
}

/**
 * Met à jour un log de sommeil existant
 */
export async function updateSleepLog(
  userId: string,
  logId: string,
  updates: Partial<Omit<SleepLog, 'id' | 'user_id' | 'created_at'>>
): Promise<SleepLog | null> {
  const [result] = await sql`
    UPDATE sleep_logs
    SET
      sleep_date = COALESCE(${updates.sleep_date || null}, sleep_date),
      bedtime = COALESCE(${updates.bedtime || null}, bedtime),
      wake_time = COALESCE(${updates.wake_time || null}, wake_time),
      duration_hours = COALESCE(${updates.duration_hours || null}, duration_hours),
      notes = COALESCE(${updates.notes || null}, notes)
    WHERE id = ${logId} AND user_id = ${userId}
    RETURNING *
  `;

  return result as SleepLog | null;
}

/**
 * Supprime un log de sommeil
 */
export async function deleteSleepLog(
  userId: string,
  logId: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM sleep_logs
    WHERE id = ${logId} AND user_id = ${userId}
  `;

  return result.length > 0;
}

/**
 * Récupère les statistiques de sommeil (30 derniers jours par défaut)
 */
export async function getSleepStats(
  userId: string,
  days: number = 30
): Promise<SleepStats | null> {
  const [stats] = await sql`
    SELECT
      AVG(duration_hours) as avg_duration,
      COUNT(*) as total_logs
    FROM sleep_logs
    WHERE user_id = ${userId}
      AND sleep_date >= CURRENT_DATE - INTERVAL '${days} days'
  `;

  return stats as SleepStats | null;
}

/**
 * Récupère les logs de sommeil pour une période donnée
 */
export async function getSleepLogsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<SleepLog[]> {
  const data = await sql`
    SELECT *
    FROM sleep_logs
    WHERE user_id = ${userId}
      AND sleep_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY sleep_date DESC
  `;

  return data as SleepLog[];
}
