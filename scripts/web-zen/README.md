# web-zen — agentic site control surface

**One CLI. Six human missions. Seven primitives. No tool inventory cosplay.**

```bash
# Always start here (future agents: do not reinvent)
python3 /root/arif-fazil.com/scripts/web-zen/web_zen.py doctor
```

## Modes

| Mode | Band | What it does |
|------|------|----------------|
| `sense` | GREEN | Source/live map, commodity :3456–3458, Caddy missions routes, missions.json |
| `verify` | GREEN | Content-truth crawl (markers, not status-only) |
| `orphan` | YELLOW | `rsync -n --delete` preview — **fail closed** if anything would delete |
| `ephemeral` | GREEN | Write → test → destroy disposable Python tool (no secrets/authority) |
| `doctor` | GREEN | sense + verify + ephemeral smoke |
| `caddy-reload-hint` | ORANGE info | Safe reload path when `systemctl reload caddy` hits NAMESPACE |

## Doctrine

- Humans: https://arif-fazil.com/missions  
- Machine: https://arif-fazil.com/missions.json  
- Engine room: https://mcp.arif-fazil.com/explorer.html (dev/audit only)  
- **Capability ≠ authority.** Ephemeral tools die. Promotion needs Arif.

## Live bindings (2026-07-30)

```bash
# Kernel — bind mission before tools
arif_route(mission_id="investigate|interpret|decide|build|monitor|remember", intent="…")

# A-FORGE MCP (HTTP, OBSERVE, stateless OK)
forge_web_zen(mode="doctor"|"sense"|"verify"|"orphan"|"ephemeral"|"caddy-reload-hint")
```

Caddy: `systemctl reload caddy` works (`PrivateTmp=false` in override).

## Anti-chaos rules (2026-07-23 scars)

1. Source first (`sites/arif-fazil.com/public` or `src/`) — never live-only edits.
2. Never `rsync --delete` without `orphan` first.
3. `/missions` 404 → Caddy `@spa_routes` missing `/missions*` (not “SPA broken”).
4. VITALS proxies UNAVAILABLE → `systemctl start gold-api oil-api gas-api` (not API keys).
5. Caddy: prefer `/usr/bin/caddy reload --config /etc/caddy/Caddyfile --force` if systemd reload fails.

## Skill

Load: `FORGE-agentic-web-builder` — OP 0 missions · OP 1–4 deploy/audit/repair/seal · OP 5 ephemeral via this CLI.

## Examples

```bash
python3 web_zen.py sense --json
python3 web_zen.py verify
python3 web_zen.py orphan --src /root/arif-fazil.com/sites/arif-fazil.com/dist --dest /var/www/html/arif
python3 web_zen.py ephemeral --task "gap: parse odd CSV sample" --code-file /tmp/parser.py
python3 web_zen.py doctor
```

DITEMPA BUKAN DIBERI.
