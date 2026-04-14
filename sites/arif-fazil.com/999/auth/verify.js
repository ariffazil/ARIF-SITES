// /999/auth/verify.js — ROOTKEY Verification Engine
// Implements Ed25519 signature verification for the challenge-response gate.

async function verifyROOTKEY(challengeHex, signatureBase64, publicKeyHex) {
  const challenge = hexToBuf(challengeHex);
  const signature = base64ToBuf(signatureBase64);
  const publicKey = await window.crypto.subtle.importKey(
    'raw', hexToBuf(publicKeyHex),
    { name: 'Ed25519' },
    false,
    ['verify']
  );

  return await window.crypto.subtle.verify(
    { name: 'Ed25519' },
    publicKey,
    signature,
    challenge
  );
}

function hexToBuf(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function base64ToBuf(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

window.SovereignAuth = { verifyROOTKEY };
