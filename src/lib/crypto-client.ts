'use client';

const KEY_HEX = process.env.NEXT_PUBLIC_CRYPTO_KEY!;

let cachedKey: CryptoKey | null = null;

function hexToArrayBuffer(hex: string): ArrayBuffer {
  // Pad to even length if necessary
  const normalized = hex.length % 2 === 0 ? hex : '0' + hex;
  const buf = new ArrayBuffer(normalized.length / 2);
  const view = new Uint8Array(buf);
  for (let i = 0; i < normalized.length; i += 2) {
    view[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return buf;
}

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  if (!KEY_HEX) throw new Error('NEXT_PUBLIC_CRYPTO_KEY is not set');
  cachedKey = await window.crypto.subtle.importKey(
    'raw',
    hexToArrayBuffer(KEY_HEX),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
  return cachedKey;
}

// Pack format: IV (12 bytes) | AuthTag (16 bytes) | Ciphertext → base64
export async function encryptClient(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoded
  );
  // WebCrypto AES-GCM output = ciphertext || authTag (last 16 bytes)
  const encBuf = new Uint8Array(encrypted);
  const ciphertext = encBuf.slice(0, -16);
  const authTag = encBuf.slice(-16);
  const packed = new Uint8Array(12 + 16 + ciphertext.length);
  packed.set(iv, 0);
  packed.set(authTag, 12);
  packed.set(ciphertext, 28);
  return btoa(String.fromCharCode(...Array.from(packed)));
}

export async function decryptClient(base64: string): Promise<string> {
  const key = await getKey();
  const packed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const iv = packed.slice(0, 12);
  const authTag = packed.slice(12, 28);
  const ciphertext = packed.slice(28);
  // WebCrypto expects input as ciphertext || authTag
  const combined = new Uint8Array(ciphertext.length + 16);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    combined
  );
  return new TextDecoder().decode(decrypted);
}
