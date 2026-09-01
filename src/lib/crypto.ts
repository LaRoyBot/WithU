import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) {
    throw new Error('ENCRYPTION_KEY must be configured as a 32-byte hexadecimal key');
  }
  return Buffer.from(key, 'hex');
};

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
    if (parts.length !== 3) throw new Error('Malformed encrypted value');

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
    console.error('Decryption failed');
    throw new Error('Could not decrypt sensitive details');
  }
}
