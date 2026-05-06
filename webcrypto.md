# WebCrypto Implementation Documentation

## Table of Contents
1. [Overview](#overview)
2. [WebCrypto Concepts](#webcrypto-concepts)
3. [Project Architecture](#project-architecture)
4. [Client-Side Implementation](#client-side-implementation)
5. [Server-Side Implementation](#server-side-implementation)
6. [Encrypted Storage](#encrypted-storage)
7. [Data Flow](#data-flow)
8. [Security Considerations](#security-considerations)
9. [Usage Examples](#usage-examples)

---

## Overview

This project uses cryptographic encryption to protect sensitive data both in transit and at rest. The implementation leverages:

- **Client-side**: Web Crypto API (browser native)
- **Server-side**: Node.js crypto module
- **Algorithm**: AES-256-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Management**: Environment variable (`NEXT_PUBLIC_CRYPTO_KEY`)

---

## WebCrypto Concepts

### AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)

**What is AES-GCM?**
- AES: Symmetric encryption algorithm (same key for encryption and decryption)
- GCM: Mode of operation that provides both confidentiality and integrity
- Key Size: 256 bits (32 bytes = 64 hex characters)
- Authenticated Encryption: Includes authentication tag to verify data integrity

**Key Components:**

1. **Key (32 bytes)**: The secret key used for encryption/decryption
   - Stored as hex string in environment variable
   - Must be 64 hex characters (256 bits)

2. **IV - Initialization Vector (12 bytes)**: 
   - Random value generated for each encryption
   - Ensures that encrypting the same data twice produces different outputs
   - Does not need to be secret, but must be unique per encryption
   - Sent alongside ciphertext for decryption

3. **AuthTag (16 bytes)**:
   - Generated during encryption
   - Used to verify data integrity during decryption
   - Detects any tampering with the encrypted data

4. **Ciphertext**: The actual encrypted data

**Pack Format:**
```
IV (12 bytes) | AuthTag (16 bytes) | Ciphertext → Base64 encoded
```

---

## Project Architecture

### File Structure

```
src/
├── lib/
│   ├── crypto-client.ts    # Client-side encryption/decryption (WebCrypto API)
│   ├── crypto-server.ts    # Server-side encryption/decryption (Node.js crypto)
│   └── encrypted-storage.ts # Zustand storage wrapper with encryption
└── service/
    └── ai-suggestion.ts    # Service using client-side decryption
```

### Key Files

1. **crypto-client.ts**: Browser-based encryption using WebCrypto API
2. **crypto-server.ts**: Node.js-based encryption using Node crypto module
3. **encrypted-storage.ts**: localStorage wrapper that encrypts data before storage
4. **ai-suggestion.ts**: Example service using client-side decryption for API responses

---

## Client-Side Implementation

### crypto-client.ts

This file implements encryption/decryption using the browser's native WebCrypto API.

#### Key Functions

**1. hexToArrayBuffer(hex: string)**
```typescript
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const normalized = hex.length % 2 === 0 ? hex : '0' + hex;
  const buf = new ArrayBuffer(normalized.length / 2);
  const view = new Uint8Array(buf);
  for (let i = 0; i < normalized.length; i += 2) {
    view[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return buf;
}
```
- Converts hex string to ArrayBuffer
- Pads with '0' if odd length (hex must have even character count)

**2. getKey(): Promise<CryptoKey>**
```typescript
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
```
- Imports the hex key as a CryptoKey object
- Caches the key for performance
- Throws error if environment variable is not set

**3. encryptClient(plaintext: string): Promise<string>**
```typescript
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
```

**Encryption Process:**
1. Get the CryptoKey
2. Generate random IV (12 bytes)
3. Encode plaintext to bytes
4. Encrypt using WebCrypto API
5. Extract ciphertext and authTag from output
6. Pack: IV | AuthTag | Ciphertext
7. Convert to base64 string

**4. decryptClient(base64: string): Promise<string>**
```typescript
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
```

**Decryption Process:**
1. Get the CryptoKey
2. Decode base64 to bytes
3. Extract IV (first 12 bytes)
4. Extract authTag (bytes 12-28)
5. Extract ciphertext (bytes 28+)
6. Combine: ciphertext || authTag (WebCrypto format)
7. Decrypt using WebCrypto API
8. Decode bytes to string

---

## Server-Side Implementation

### crypto-server.ts

This file implements encryption/decryption using Node.js crypto module.

#### Key Functions

**1. getKeyBuffer(): Buffer**
```typescript
function getKeyBuffer(): Buffer {
  if (!KEY_HEX) throw new Error('NEXT_PUBLIC_CRYPTO_KEY is not set');
  const hex = KEY_HEX.length % 2 === 0 ? KEY_HEX : '0' + KEY_HEX;
  return Buffer.from(hex, 'hex');
}
```
- Converts hex string to Buffer
- Pads with '0' if odd length

**2. encryptServer(plaintext: string): string**
```typescript
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
```

**Encryption Process:**
1. Get key buffer
2. Generate random IV
3. Create cipher instance
4. Encrypt plaintext
5. Get authTag
6. Pack: IV | AuthTag | Ciphertext
7. Convert to base64

**3. decryptServer(base64: string): string**
```typescript
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
```

**Decryption Process:**
1. Get key buffer
2. Decode base64 to buffer
3. Extract IV, authTag, ciphertext
4. Create decipher instance
5. Set authTag
6. Decrypt ciphertext
7. Convert to string

---

## Encrypted Storage

### encrypted-storage.ts

This file provides an encrypted storage adapter for Zustand state management.

```typescript
export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    try {
      return await decryptClient(encrypted);
    } catch {
      // Corrupted or unencrypted entry — clear it
      localStorage.removeItem(name);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const encrypted = await encryptClient(value);
    localStorage.setItem(name, encrypted);
  },

  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};
```

**Features:**
- Encrypts data before storing in localStorage
- Decrypts data when retrieving from localStorage
- Handles decryption errors by clearing corrupted data
- Server-side rendering safe (checks for window object)

---

## Data Flow

### Complete Encryption/Decryption Flow

#### 1. Server → Client (API Response)

```
Server Side:
1. Encrypt sensitive data using encryptServer()
2. Send encrypted base64 string in API response

Client Side:
1. Receive encrypted data
2. Decrypt using decryptClient()
3. Use plaintext data
```

**Example (ai-suggestion.ts):**
```typescript
const response = await fetch(apiUrl, {...});
const envelope: { data: string } = await response.json();
const plaintext = await decryptClient(envelope.data);
return JSON.parse(plaintext);
```

#### 2. Client → localStorage (State Persistence)

```
Client Side:
1. State update triggers setItem()
2. Encrypt data using encryptClient()
3. Store encrypted base64 in localStorage

Read:
1. Read encrypted base64 from localStorage
2. Decrypt using decryptClient()
3. Return plaintext to state
```

#### 3. Client → Server (API Request)

```
Client Side:
1. Encrypt sensitive data using encryptClient()
2. Send encrypted base64 in request body

Server Side:
1. Receive encrypted data
2. Decrypt using decryptServer()
3. Process plaintext data
```

---

## Security Considerations

### Key Management

1. **Environment Variable**: The encryption key is stored in `NEXT_PUBLIC_CRYPTO_KEY`
   - **Note**: This is visible in client-side code
   - **Recommendation**: For production, use server-side only keys or key exchange protocols

2. **Key Generation**: Generate a secure random key
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Best Practices

1. **IV Uniqueness**: Always use a new random IV for each encryption
   - Both implementations use `crypto.randomBytes(12)` or `window.crypto.getRandomValues()`

2. **AuthTag Verification**: Always verify the authTag during decryption
   - Built into the AES-GCM decryption process
   - Detects data tampering

3. **Error Handling**: Gracefully handle decryption failures
   - Clear corrupted data
   - Log errors for debugging

4. **Server-Side Rendering**: Check for window object before using WebCrypto API
   - Prevents errors during SSR

### Limitations

1. **Client-Side Key Exposure**: Using `NEXT_PUBLIC_` prefix exposes the key to the browser
   - This is acceptable for client-side encryption of localStorage data
   - Not suitable for protecting secrets from determined attackers

2. **Performance**: Encryption/decryption adds computational overhead
   - Caching the CryptoKey helps performance
   - Consider batch operations for large datasets

---

## Usage Examples

### Example 1: Encrypting API Response

```typescript
import { decryptClient } from '@/lib/crypto-client';

// API returns encrypted data
const response = await fetch('/api/data');
const { data: encryptedData } = await response.json();

// Decrypt on client
const plaintext = await decryptClient(encryptedData);
const data = JSON.parse(plaintext);
```

### Example 2: Encrypting Before Sending to API

```typescript
import { encryptClient } from '@/lib/crypto-client';

const sensitiveData = { username: 'john', password: 'secret' };
const encrypted = await encryptClient(JSON.stringify(sensitiveData));

await fetch('/api/save', {
  method: 'POST',
  body: JSON.stringify({ data: encrypted }),
});
```

### Example 3: Using Encrypted Storage with Zustand

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
```

### Example 4: Server-Side Encryption

```typescript
import { encryptServer, decryptServer } from '@/lib/crypto-server';

// Encrypt sensitive data before sending to client
const userData = { email: 'user@example.com', ssn: '123-45-6789' };
const encrypted = encryptServer(JSON.stringify(userData));

// Decrypt received data from client
const decrypted = decryptServer(encryptedData);
const data = JSON.parse(decrypted);
```

---

## Environment Setup

### Required Environment Variable

Add to `.env.local`:

```env
NEXT_PUBLIC_CRYPTO_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

**Generate a new key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Testing

### Testing Encryption/Decryption

```typescript
import { encryptClient, decryptClient } from '@/lib/crypto-client';

const plaintext = 'Hello, World!';
const encrypted = await encryptClient(plaintext);
const decrypted = await decryptClient(encrypted);

console.log(plaintext === decrypted); // true
```

### Testing Encrypted Storage

```typescript
import { encryptedStorage } from '@/lib/encrypted-storage';

await encryptedStorage.setItem('test', 'secret data');
const value = await encryptedStorage.getItem('test');
console.log(value); // 'secret data'
```

---

## Troubleshooting

### Common Issues

1. **"NEXT_PUBLIC_CRYPTO_KEY is not set"**
   - Ensure the environment variable is set in `.env.local`
   - Restart the development server after adding the variable

2. **Decryption fails with error**
   - Data may be corrupted or tampered with
   - Encrypted storage automatically clears corrupted entries
   - Check that the same key is used for encryption and decryption

3. **Server-side rendering errors**
   - WebCrypto API is not available on the server
   - Use crypto-server.ts for server-side operations
   - Check for `typeof window !== 'undefined'` before using client-side crypto

---

## References

- [Web Crypto API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [AES-GCM Wikipedia](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand/tree/main/middleware)

---

## Summary

This project implements a dual-encryption strategy:

- **Client-side**: WebCrypto API for browser-based encryption
- **Server-side**: Node.js crypto module for server-based encryption
- **Storage**: Encrypted localStorage wrapper for state persistence
- **Algorithm**: AES-256-GCM for authenticated encryption

The implementation ensures data security both in transit and at rest, with a focus on protecting sensitive user data and API responses.
