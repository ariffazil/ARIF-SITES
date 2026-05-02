# arifOS Key Rotation Policy
**Version:** 1.0
**Epoch:** 2026-05-02T21:47:06Z
**Sovereign:** did:web:arif-fazil.com
**Status:** ACTIVE

## Trigger Conditions
A key rotation event is mandatory when ANY of the following occur:

1. Private key content is exposed in any chat, log, or communication channel
2. Private key file is accessible by any process or person other than the sovereign
3. Key fingerprint appears in any public or semi-public record unexpectedly
4. Sovereign suspects key compromise for any reason

When in doubt — rotate. The cost of unnecessary rotation is low.
The cost of ignoring a real compromise is irreversible.

## Quarantine Protocol (Within 1 Hour of Detection)
1. Do NOT delete the compromised key
2. Rename the compromised key at all known paths:
   - `mv <path> <path>.COMPROMISED_<reason>_<date>`
3. Confirm the renamed file exists before proceeding
4. Document the exposure vector in plain language

## Rotation Protocol (Within 24 Hours of Detection)
1. Confirm the new active key fingerprint with:
   `ssh-keygen -l -f ~/.ssh/operator_did_ed25519`
2. Confirm the new key matches the live DID doc public key:
   `ssh-keygen -y -f ~/.ssh/operator_did_ed25519`
   Compare against publicKeyMultibase in did.json
3. If DID doc does NOT match new key — update did.json first, deploy, confirm resolution
4. Re-sign all active constitution files under the new key
5. Verify all signatures before deploying
6. Deploy to live webroot
7. Run verify-arifos.mjs — must return PASS before any commit

## VAULT999 Record Requirement
Every rotation event requires a signed JSON record at:
  /999/key-rotation-<YYYY-MM-DD>.json

Required fields:
- event: "key_compromise_and_rotation"
- epoch: ISO8601 timestamp
- did: "did:web:arif-fazil.com"
- compromised_key.path_was
- compromised_key.reason
- compromised_key.exposure_vector
- compromised_key.status: "retired"
- compromised_key.renamed_to
- active_key.fingerprint
- active_key.status: "active"
- live_seal_status
- sovereign: "did:web:arif-fazil.com"

The rotation record must be signed under namespace arifos-vault999
and verified before committing.

## Maximum Allowable Response Times
| Phase | Maximum Time |
|---|---|
| Detection to quarantine | 1 hour |
| Quarantine to rotation record in VAULT999 | 24 hours |
| Rotation record to verifier PASS | 24 hours |
| Total: detection to clean PASS | 48 hours |

## What This Policy Does NOT Cover
- ZK/VC proof of sovereign presence (not yet implemented)
- Biometric attestation (not yet implemented)
- Multi-key quorum (not yet implemented)

These are future layers. This policy governs the current PKI layer only.

## Enforcement
This policy is part of the arifOS constitution.
It is binding on all agents operating under did:web:arif-fazil.com.
Any agent that detects a trigger condition must immediately emit 888_HOLD
and surface to the sovereign before taking any further action.

DITEMPA BUKAN DIBERI — 999 SEAL ALIVE
