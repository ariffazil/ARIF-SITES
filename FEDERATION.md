# FEDERATION.md — arif-sites

```yaml
role: PUBLIC_SURFACE
organ: arif-sites
layer: L4
citizenship: warga-aaa
canon: ariffazil/ariffazil

depends_on:
  - repo: ariffazil/arifOS
    reason: Kernel health, MCP endpoint discovery, llms.txt
  - repo: ariffazil/AAA
    reason: Cockpit embedding, state display
  - repo: ariffazil/A-FORGE
    reason: Forge status, deployment surface
  - repo: ariffazil/geox
    reason: Geoscience public surface
  - repo: ariffazil/wealth
    reason: Capital public surface
  - repo: ariffazil/well
    reason: Vitality public surface

mcp: N/A (static sites + Cloudflare Pages — no MCP server)

governance:
  judge: arifOS
  seal: VAULT999
  floors: F1-F13
  mutation_rule: Content changes are reversible. DNS/domain changes require 888_HOLD.

stack_role: |
  arif-sites is L4 PUBLIC_SURFACE — the public face of the civilization stack.
  It hosts arif-fazil.com and all subdomain sites via Cloudflare Pages.
  It exposes the federation's public presence: docs, landing pages,
  operator surfaces, and MCP endpoint discovery (llms.txt).
  It is the "window" through which the outside world sees the federation.
  Content flows out; governance flows in.

entrypoints:
  - Main: https://arif-fazil.com
  - arifOS: https://arifos.arif-fazil.com
  - MCP: https://mcp.arif-fazil.com
  - GEOX: https://geox.arif-fazil.com
  - WEALTH: https://wealth.arif-fazil.com
  - WELL: https://well.arif-fazil.com
  - AAA: https://aaa.arif-fazil.com
  - Discovery: https://arif-fazil.com/llms.txt
  - Code: https://github.com/ariffazil/arif-sites
```

---

**DITEMPA BUKAN DIBERI — Forged, Not Given.**
**Part of the arifOS Federation. See `/root/AAA/docs/FEDERATION_MAP.md` for canonical topology.**
