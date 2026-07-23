# FEDERATION.md — arif-sites

```yaml
role: PUBLIC_SURFACE
organ: arif-sites
layer: L4
citizenship: warga-aaa
canon: ariffazil/arif-sites

depends_on:
  - repo: ariffazil/arifOS
    reason: Federation identity, health data for dashboards

deploy: Cloudflare Pages (auto-deploy on push main)
authority: DISPLAY_ONLY (static surfaces — never adjudicate)
```
