import 'server-only';
import { sql } from './client';

/**
 * =====================================================
 * USERS - Gestion des utilisateurs
 * =====================================================
 * 
 * Table : users
 * Colonnes : id, email, name, password_hash, created_at
 */

// Types pour cette table spécifiquement
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  created_at: Date;
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
    SELECT id, email, name, created_at
    FROM users
    WHERE id = ${userId}
  `;
  
  return user as PublicUser | null;
}

/**
 * Crée un nouvel utilisateur
 */
export async function createUser(data: {
  email: string;
  name: string;
  password_hash: string;
}): Promise<User> {
  const [user] = await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${data.email}, ${data.name}, ${data.password_hash})
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
    email?: string;
    name?: string;
    password_hash?: string;
  }
): Promise<User | null> {
  const [user] = await sql`
    UPDATE users
    SET 
      email = COALESCE(${updates.email || null}, email),
      name = COALESCE(${updates.name || null}, name),
      password_hash = COALESCE(${updates.password_hash || null}, password_hash)
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
