import crypto from 'crypto';

const KEY_HEX = process.env.NEXT_PUBLIC_CRYPTO_KEY!;

function getKeyBuffer(): Buffer {
  if (!KEY_HEX) throw new Error('NEXT_PUBLIC_CRYPTO_KEY is not set');
  // Pad to even length if necessary (hex must have even char count)
  const hex = KEY_HEX.length % 2 === 0 ? KEY_HEX : '0' + KEY_HEX;
  return Buffer.from(hex, 'hex');
}

// Pack format: IV (12 bytes) | AuthTag (16 bytes) | Ciphertext → base64
export function encryptServer(plaintext: string): string {
  const key = getKeyBuffer();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

export function decryptServer(base64: string): string {
  const key = getKeyBuffer();
  const packed = Buffer.from(base64, 'base64');
  const iv = packed.subarray(0, 12);
  const authTag = packed.subarray(12, 28);
  const ciphertext = packed.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
