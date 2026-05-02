# verify-arifos v0.1

`verify-arifos` is the first external seal check for `did:web:arif-fazil.com`.

It is intentionally narrow: no zero-knowledge credential layer, no biometric proof, no government ID proof, and no private vault activation. It verifies whether the public identity spine and v0.1 proof artifacts can be checked by an outside machine.

## What It Checks

- `https://arif-fazil.com/.well-known/did.json` resolves.
- The DID document id is `did:web:arif-fazil.com`.
- Required service endpoints exist: `#constitution`, `#proof-human`, `#proof-authorship`, `#proof-runtime`, and `#vault`.
- The DID Ed25519 public key converts into an OpenSSH verifier key.
- Published SSH signatures for proof artifacts were made by the DID key.
- Published payload bytes verify against the published SSH signatures.
- The runtime snapshot hash matches `runtime-status.json`.
- The VAULT999 seal self-hash, DID binding, runtime binding, and seal signature verify.

## Run

```bash
cd /root/arif-sites
node scripts/verify-arifos.mjs
```

## Current Verified Posture

As of 2026-05-02T21:24:58.528Z, the live verifier returns `PASS` for the v0.1 public proof loop:

```text
verify-arifos summary: 27 passed, 0 warnings, 0 failed
final_verdict: PASS
```

## Meaning of PASS

PASS means the public v0.1 proof loop is reproducible: DID resolution, service discovery, manifest signature, runtime snapshot hash, VAULT999 seal hash, and VAULT999 seal signature all verify from public URLs.

PASS does not mean ZK/VC/human biometric verification. Those remain explicitly not implemented.

```text
Identity spine: live
External proof verification: PASS
ZK/VC proof closure: not implemented
```
