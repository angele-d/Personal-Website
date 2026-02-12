import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedBuffer = Buffer.from(derivedKey, 'hex');

  if (keyBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(keyBuffer, derivedBuffer);
}
