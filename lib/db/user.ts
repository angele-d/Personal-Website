import 'server-only';
import { sql } from './client';

/**
 * =====================================================
 * USERS - Gestion des utilisateurs
 * =====================================================
 * 
 * Table : users
 * Colonnes : id, name, email, email_verified, image
 */

// Types pour cette table spécifiquement
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  email_verified: Date | null;
  image: string | null;
}

export interface PublicUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(
  email: string
): Promise<User | null> {
  const [user] = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;
  
  return user as User | null;
}

/**
 * Récupère un utilisateur par ID
 */
export async function getUserById(
  userId: string
): Promise<User | null> {
  const [user] = await sql`
    SELECT *
    FROM users
    WHERE id = ${userId}
  `;
  
  return user as User | null;
}

/**
 * Récupère un utilisateur sans le password_hash (données publiques)
 */
export async function getPublicUserById(
  userId: string
): Promise<PublicUser | null> {
  const [user] = await sql`
    SELECT id, email, name, image
    FROM users
    WHERE id = ${userId}
  `;
  
  return user as PublicUser | null;
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(data: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  email_verified?: Date | null;
}): Promise<User> {
  const [user] = await sql`
    INSERT INTO users (email, name, image, email_verified)
    VALUES (${data.email ?? null}, ${data.name ?? null}, ${data.image ?? null}, ${data.email_verified ?? null})
    RETURNING *
  `;
  
  return user as User;
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUser(
  userId: string,
  updates: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    email_verified?: Date | null;
  }
): Promise<User | null> {
  const [user] = await sql`
    UPDATE users
    SET 
      email = COALESCE(${updates.email ?? null}, email),
      name = COALESCE(${updates.name ?? null}, name),
      image = COALESCE(${updates.image ?? null}, image),
      email_verified = COALESCE(${updates.email_verified ?? null}, email_verified)
    WHERE id = ${userId}
    RETURNING *
  `;
  
  return user as User | null;
}

/**
 * Supprime un utilisateur (CASCADE supprimera aussi ses logs)
 */
export async function deleteUser(
  userId: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM users
    WHERE id = ${userId}
  `;
  
  return result.length > 0;
}

/**
 * Vérifie si un email existe déjà
 */
export async function emailExists(
  email: string
): Promise<boolean> {
  const [result] = await sql`
    SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) as exists
  `;
  
  return result.exists;
}
