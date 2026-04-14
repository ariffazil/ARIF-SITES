// /999/ — Browser Crypto Engine
// Corrected architecture (see Vault999 research report):
//   - Ed25519  : ROOTKEY signatures (prove you hold the key)
//   - X25519   : key agreement (derive shared secret)
//   - AES-GCM  : symmetric encryption (protect content)
// No private key ever leaves the browser in plain text.

let _signingKey = null;   // Ed25519 signing key (ROOTKEY)
let _encKey = null;       // AES-256-GCM session encryption key

async function cryptoInit() {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('WebCrypto not available in this browser');
  }
  _signingKey = null;
  _encKey = null;
  console.log('[VaultCrypto] Engine ready. Correct: Ed25519 + X25519 + AES-GCM');
}

// ── Signing (Ed25519) ────────────────────────────────────────────────────────

async function importEd25519SigningKey(privateKeyHex) {
  // Ed25519 raw 32-byte private key → CryptoKey for signing
  const keyBytes = hexToBuf(privateKeyHex);
  return window.crypto.subtle.importKey(
    'raw', keyBytes,
    { name: 'Ed25519' },   // Ed25519 signature scheme
    false,
    ['sign']
  );
}

async function signChallenge(challengeHex, privateKeyHex) {
  // Sign the challenge nonce with Ed25519 ROOTKEY
  // Returns: base64 signature
  const key = await importEd25519SigningKey(privateKeyHex);
  const challengeBytes = hexToBuf(challengeHex);
  const sig = await window.crypto.subtle.sign({ name: 'Ed25519' }, key, challengeBytes);
  return bufToBase64(sig);
}

async function verifyEd25519Signature(publicKeyHex, messageHex, signatureHex) {
  // Verify Ed25519 signature (used to verify ROOTKEY possession)
  try {
    const pubKeyBytes = hexToBuf(publicKeyHex);
    const pubKey = await window.crypto.subtle.importKey(
      'raw', pubKeyBytes,
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    const msg = hexToBuf(messageHex);
    const sig = hexToBuf(signatureHex);
    return await window.crypto.subtle.verify({ name: 'Ed25519' }, pubKey, sig, msg);
  } catch(e) {
    return false;
  }
}

// ── Key Agreement (X25519) ───────────────────────────────────────────────────

async function deriveSharedSecret(myPrivateKeyHex, theirPublicKeyHex) {
  // X25519 ECDH: my private + their public → shared secret
  // Then HKDF-SHA256 → AES-256-GCM session key
  const mySkBytes = hexToBuf(myPrivateKeyHex);
  const theirPkBytes = hexToBuf(theirPublicKeyHex);

  const mySk = await window.crypto.subtle.importKey(
    'raw', mySkBytes,
    { name: 'X25519' },
    false,
    ['deriveBits']
  );
  const theirPk = await window.crypto.subtle.importKey(
    'raw', theirPkBytes,
    { name: 'X25519' },
    false,
    ['deriveBits']
  );

  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: 'X25519', public: theirPk },
    mySk,
    256
  );

  // HKDF-SHA256 to derive AES key
  const hkdfKey = await window.crypto.subtle.importKey(
    'raw', sharedBits,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode('VAULT999-SESSION') },
    hkdfKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// ── Encryption (AES-GCM-256) ─────────────────────────────────────────────────

async function encryptContent(plaintext, sessionKey) {
  // AES-GCM-256: random 12-byte IV + ciphertext + auth tag
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sessionKey,
    encoded
  );
  // Prepend IV to ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufToHex(combined);  // hex encoded: IV || ciphertext || tag
}

async function decryptContent(ciphertextHex, sessionKey) {
  try {
    const combined = hexToBuf(ciphertextHex);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch(e) {
    throw new Error('Decryption failed: ' + e.message);
  }
}

// ── Challenge Generation ─────────────────────────────────────────────────────

function generateChallenge() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem('vault_challenge', hex);
  return hex;
}

function getStoredChallenge() {
  return sessionStorage.getItem('vault_challenge');
}

// ── Utilities ────────────────────────────────────────────────────────────────

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function bufToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBuf(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ── Session Management ────────────────────────────────────────────────────────

async function openVault(publicKeyHex, privateKeyHex) {
  // Full auth flow:
  // 1. Generate challenge
  // 2. Sign with Ed25519 ROOTKEY
  // 3. Verify signature against public key
  // 4. Derive AES-GCM session key via X25519

  const challenge = generateChallenge();
  const signature = await signChallenge(challenge, privateKeyHex);
  const sigValid = await verifyEd25519Signature(publicKeyHex, challenge, signature);

  if (!sigValid) {
    throw new Error('ROOTKEY signature invalid. Access denied.');
  }

  // Derive session encryption key from shared secret
  // In production: combine our X25519 private with server's public key
  // For local-only demo: derive from a fixed test public key
  _encKey = await deriveSharedSecret(privateKeyHex, publicKeyHex);
  _signingKey = await importEd25519SigningKey(privateKeyHex);
  sessionStorage.setItem('vault_session', 'open');
  return true;
}

function isVaultOpen() {
  return _encKey !== null || sessionStorage.getItem('vault_session') === 'open';
}

async function sealContent(plaintext) {
  if (!isVaultOpen()) throw new Error('Vault not open');
  return encryptContent(plaintext, _encKey);
}

async function openSeal(ciphertextHex) {
  if (!isVaultOpen()) throw new Error('Vault not open');
  return decryptContent(ciphertextHex, _encKey);
}

// Export
window.VaultCrypto = {
  init: cryptoInit,
  openVault,
  isVaultOpen,
  generateChallenge,
  signChallenge,
  verifyEd25519Signature,
  deriveSharedSecret,
  encryptContent,
  decryptContent,
  sealContent,
  openSeal,
  hexToBuf,
  bufToHex,
  bufToBase64,
  base64ToBuf
};
