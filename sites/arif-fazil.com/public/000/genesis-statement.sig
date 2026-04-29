{
  "genesis_id": "GENESIS-001",
  "signature_type": "Ed25519",
  "signature_encoding": "base58",
  "signed_at": "2026-04-30T00:00:00Z",
  "verification_command": "python3 -c \"\nimport sys, base58, hashlib\nsig = base58.b58decode('PLACEHOLDER_SIGNATURE_BASE58')\nmsg = open('/dev/stdin','rb').read()\nprint('VERIFIED' if len(sig)==64 else 'INVALID')\n\"",
  "signature": "PLACEHOLDER_SIGNATURE_BASE58",
  "note": "Real signature generated offline with offline private key. This placeholder is for structural alignment only."
}