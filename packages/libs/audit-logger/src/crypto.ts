/**
 * AES-GCM 256-bit encryption for audit entries stored in IndexedDB.
 *
 * The key is derived from the user's UUID via HKDF-SHA-256 so that:
 *   - Each user's offline queue is opaque to other users on the same device.
 *   - Even a successful XSS that reads IndexedDB raw bytes cannot recover PHI
 *     without knowing the userUuid and running HKDF (which it technically could
 *     if it can call crypto.subtle — so pair this with a strict CSP).
 *   - Keys live only in memory and are GC'd on page unload.
 */

const ALGO = 'AES-GCM';
const KEY_LEN = 256;
const IV_LEN = 12; // 96-bit IV recommended for GCM

const SALT = new TextEncoder().encode('sihsalus-audit-v2');
const INFO = new TextEncoder().encode('audit-log-encryption');

// Avoid re-deriving the same key on every operation within a session.
const keyCache = new Map<string, CryptoKey>();

async function getKey(userUuid: string): Promise<CryptoKey> {
  const hit = keyCache.get(userUuid);
  if (hit) return hit;

  const raw = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(userUuid),
    'HKDF',
    false,
    ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: SALT, info: INFO },
    raw,
    { name: ALGO, length: KEY_LEN },
    false,
    ['encrypt', 'decrypt'],
  );
  keyCache.set(userUuid, key);
  return key;
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/** Encrypt arbitrary JSON-serialisable data. Returns a base64 blob: IV ∥ ciphertext. */
export async function encryptPayload(data: unknown, userUuid: string): Promise<string> {
  const key = await getKey(userUuid);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plain);

  const combined = new Uint8Array(IV_LEN + cipher.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(cipher), IV_LEN);
  return toBase64(combined);
}

/**
 * Decrypt a payload produced by {@link encryptPayload}.
 * Returns `null` if decryption fails (wrong key, corrupted data).
 * Never throws.
 */
export async function decryptPayload<T>(payload: string, userUuid: string): Promise<T | null> {
  try {
    const key = await getKey(userUuid);
    const combined = fromBase64(payload);
    const iv = combined.slice(0, IV_LEN);
    const cipher = combined.slice(IV_LEN);
    const plain = await crypto.subtle.decrypt({ name: ALGO, iv }, key, cipher);
    return JSON.parse(new TextDecoder().decode(plain)) as T;
  } catch {
    return null;
  }
}

/** Release cached keys from memory (call on logout). */
export function clearKeyCache(): void {
  keyCache.clear();
}
