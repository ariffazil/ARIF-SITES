#!/usr/bin/env python3
"""Sign a DID DomainLinkageCredential with W3C eddsa-jcs-2022."""
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path
import nacl.signing
from cryptography.hazmat.primitives.serialization import load_ssh_private_key

def load_key(path):
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    key = load_ssh_private_key(Path(path).read_bytes(), password=None)
    if not isinstance(key, Ed25519PrivateKey): raise ValueError("Not Ed25519")
    return key.private_bytes_raw()

def _canonicalize(value):
    """RFC 8785 canonical JSON for this string-only credential profile."""
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True).encode()

def _base58(data):
    alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    zeros = len(data) - len(data.lstrip(b"\0"))
    number = int.from_bytes(data, "big")
    encoded = ""
    while number:
        number, remainder = divmod(number, 58)
        encoded = alphabet[remainder] + encoded
    return "1" * zeros + encoded

def sign(cred, proof_options, seed):
    """W3C DI EdDSA hashing: SHA256(proof config) || SHA256(document)."""
    sk = nacl.signing.SigningKey(seed)
    proof_config = {**proof_options, "@context": cred["@context"]}
    hash_data = hashlib.sha256(_canonicalize(proof_config)).digest() + hashlib.sha256(_canonicalize(cred)).digest()
    return f"z{_base58(sk.sign(hash_data).signature)}"

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--key")
    p.add_argument("--check", action="store_true")
    p.add_argument("--output", default="/root/ARIF-SITES/sites/arif-fazil.com/public/.well-known/did-configuration.json")
    args = p.parse_args()

    key_path = args.key
    if not key_path:
        for c in ["/root/.ssh/operator_did_ed25519", "/root/.secrets/vault-signing-ed25519"]:
            if Path(c).exists(): key_path = c; break
        if not key_path: print("ERROR: no key found", file=sys.stderr); sys.exit(1)

    print(f"Key: {key_path}")
    seed = load_key(key_path)
    sk = nacl.signing.SigningKey(seed)
    # Multikey uses the Ed25519 public-key multicodec prefix 0xed01.
    pub_mb = f"z{_base58(bytes.fromhex('ed01') + bytes(sk.verify_key))}"

    # Read expected key from DID document
    did_doc_path = Path("/root/ARIF-SITES/sites/arif-fazil.com/public/.well-known/did.json")
    did_doc = json.loads(did_doc_path.read_bytes())
    expected = did_doc["verificationMethod"][0]["publicKeyMultibase"]

    print(f"Public key:  {pub_mb}")
    print(f"DID expects: {expected}")
    match = pub_mb == expected
    print(f"Match: {match}")
    if args.check: sys.exit(0 if match else 1)
    if not match: print("ERROR: key mismatch"); sys.exit(1)

    credential = {
        "@context": ["https://www.w3.org/2018/credentials/v1", "https://w3id.org/security/multikey/v1"],
        "type": ["VerifiableCredential", "DomainLinkageCredential"],
        "issuer": "did:web:arif-fazil.com",
        "issuanceDate": "2026-04-30T00:00:00Z",
        "expirationDate": "2027-04-30T00:00:00Z",
        "credentialSubject": {"id": "did:web:arif-fazil.com", "origin": "https://arif-fazil.com"},
    }
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    proof = {
        "type": "DataIntegrityProof", "cryptosuite": "eddsa-jcs-2022",
        "created": now, "verificationMethod": f"did:web:arif-fazil.com#{did_doc['verificationMethod'][0]['id'].split('#')[-1]}",
        "proofPurpose": "assertionMethod",
    }
    proof["proofValue"] = sign(credential, proof, seed)
    did_config = {
        "@context": "https://identity.foundation/well-known/did-configuration/v1",
        "linked_dids": [{
            **credential,
            "proof": proof,
        }],
    }
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(did_config, indent=2) + "\n")
    print(f"\nSigned: {out}")

    deploy = Path("/var/www/html/arif/.well-known/did-configuration.json")
    if deploy.parent.exists():
        deploy.write_text(json.dumps(did_config, indent=2) + "\n")
        print(f"Deployed: {deploy}")

    # Also deploy updated did.json
    did_deploy = Path("/var/www/html/arif/.well-known/did.json")
    if did_deploy.parent.exists():
        did_deploy.write_bytes(did_doc_path.read_bytes())
        print(f"Deployed: {did_deploy}")

if __name__ == "__main__":
    main()
