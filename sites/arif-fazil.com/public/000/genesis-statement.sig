{
  "genesis_id": "GENESIS-001",
  "amendments": [
    "000-AMEND-001"
  ],
  "signature_type": "Ed25519",
  "signature_encoding": "base58",
  "signed_at": "2026-08-06T11:45:00Z",
  "signing_key": "did:web:arif-fazil.com#operator_did_ed25519",
  "signing_key_fingerprint": "SHA256:0zbqNfmTzvxnk/eyTKoIuvAVJ6xciSWZNIlMcIluiHI",
  "signature": "58aXkTTKS39Yz9CJ1rnMCsLaf6kGd4frN42WyBheAwriKvADPQg9fmGN9X9nKdRWnZeufBEQQpjX8LMoXXBxJKp9",
  "verification_command": "python3 -c \"import sys,json,base58,nacl.signing; d=json.load(open('genesis-statement.json')); pk=nacl.signing.VerifyKey(bytes.fromhex('FINGERPRINT_PLACEHOLDER')); raw=open('genesis-statement.json','rb').read(); sig=base58.b58decode(d['signature']); pk.verify(raw,sig); print('VERIFIED')\"",
  "note": "Signed with active operator_did_ed25519 (rotated 2026-05-02). Previous signature was a structural placeholder; this is the first live signature for GENESIS-001.",
  "previous_signature": "PLACEHOLDER_SIGNATURE_BASE58 (2026-04-30, structural only)"
}