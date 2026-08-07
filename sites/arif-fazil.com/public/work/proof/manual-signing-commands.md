# Manual Signing Commands - verify-arifos v0.1

Do not run these unless you are Arif in the operator-controlled signing environment.

SSH signature flow using the DID Ed25519 key:

```bash
cd /root/arif-sites/sites/arif-fazil.com/public
ssh-keygen -Y sign -f /path/to/operator_did_ed25519 -n arifos-constitution arifos/AGENTS.md
mv arifos/AGENTS.md.sig arifos/AGENTS.md.sig

ssh-keygen -Y sign -f /path/to/operator_did_ed25519 -n arifos-vault999 999/vault999-seal-v0.1.json
mv 999/vault999-seal-v0.1.json.sig 999/vault999-seal-v0.1.json.sig
```

After signing:

```bash
cd /root/arif-sites
node scripts/verify-arifos.mjs
```
