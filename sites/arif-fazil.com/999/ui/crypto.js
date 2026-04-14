// /999/ — Browser Crypto Engine
// Handles challenge/response for ROOTKEY auth
// No private key ever leaves the browser in plain text

let _cryptoKey = null;

async function cryptoInit() {
  // Check for WebAssembly crypto support
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('WebCrypto not available');
  }
  _cryptoKey = null;
  console.log('Crypto engine ready');
}

function generateChallenge() {
  // Generate a random challenge for signing
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem('vault_challenge', hex);
  return hex;
}

async function verifySignature(pubkeyHex, challengeHex, signatureHex) {
  // In production: verify Ed25519 signature
  // For demo: accept any valid-looking hex as "session open"
  if (!pubkeyHex || !challengeHex || !signatureHex) return false;
  if (pubkeyHex.length < 32 || signatureHex.length < 64) return false;
  return true;
}

async function deriveSessionKey(privKeyBytes, challenge) {
  // HKDF-style key derivation for session
  const keyMaterial = await crypto.subtle.importKey(
    'raw', privKeyBytes, { name: 'HKDF' }, false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode(challenge) },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function encryptData(plaintext, sessionKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sessionKey, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufToHex(combined);
}

async function decryptData(ciphertextHex, sessionKey) {
  try {
    const combined = hexToBuf(ciphertextHex);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sessionKey, data);
    return new TextDecoder().decode(decrypted);
  } catch(e) {
    throw new Error('Decryption failed: ' + e.message);
  }
}

// Export for use by seals.js
window.VaultCrypto = {
  init: cryptoInit,
  generateChallenge,
  verifySignature,
  deriveSessionKey,
  encryptData,
  decryptData,
  bufToHex,
  hexToBuf
};
