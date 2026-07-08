import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
// Fallback key for testing/dev (must be 32 bytes / 64 hex characters)
const DEFAULT_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY || DEFAULT_KEY;
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypts a string using AES-256-GCM
 * Output format: iv_hex:encrypted_hex:auth_tag_hex
 */
export function encrypt(text: string): string {
  if (!text) return '';
  try {
    const iv = randomBytes(12);
    const key = getEncryptionKey();
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  } catch (err: any) {
    console.error('Encryption failed:', err.message);
    throw new Error('Could not encrypt sensitive details');
  }
}

/**
 * Decrypts a string formatted as iv_hex:encrypted_hex:auth_tag_hex
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      // Fallback: If not formatted, it might be plain text from seeding/dev
      return encryptedText;
    }

    const [ivHex, encryptedHex, authTagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getEncryptionKey();

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err: any) {
    console.error('Decryption failed:', err.message);
    // If decryption fails, return placeholder or error indicating security boundary
    return '[ENCRYPTED_DATA_DECRYPTION_FAILED]';
  }
}
