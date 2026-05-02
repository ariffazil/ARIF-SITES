# Caddyfile Ingress Patch — Trinity Network v2
# File: /root/Caddyfile
# Version: v2026.05.02-TRINITY-PATCH | 888_HOLD: review before apply
#
# Changes proposed:
#   1. arifosmcp.arif-fazil.com → 302 redirect to mcp.arif-fazil.com (NOT file_server)
#   2. arifos.arif-fazil.com → Cloudflare Pages (import static), not VPS landing
#   3. apex.arif-fazil.com → marked legacy (kept for backward compat, no new links)
#   4. waw/wawa → redirect to aaa.arif-fazil.com (archived surfaces)
#   5. mcp.arif-fazil.com → canonical MCP API only (static landing removed)
#
# Reversibility: FULLY REVERSIBLE via git restore /root/Caddyfile
# 888_HOLD: Not auto-applied — operator reviews and applies manually

# ══════════════════════════════════════════════════════════════
# CHANGE A: arifosmcp.arif-fazil.com → redirect only
# OLD:
#   arifosmcp.arif-fazil.com {
#       import aasic-landing arifosmcp
#   }
# NEW:
arifosmcp.arif-fazil.com {
    import constitutional-headers
    encode zstd gzip
    redir https://mcp.arif-fazil.com{uri} 302
}

# ══════════════════════════════════════════════════════════════
# CHANGE B: arifos.arif-fazil.com → Cloudflare Pages (no VPS landing)
# OLD: served from /var/www/html/arifos (VPS static)
# NEW: delegate to Cloudflare Pages DNS-only (remove VPS landing)
# arifos.arif-fazil.com is now handled by Cloudflare Pages — Caddy serves nothing here
# In production, remove this block entirely OR leave as DNS pass-through
# arifos.arif-fazil.com {
#     import constitutional-headers
#     # Delegated to Cloudflare Pages — no VPS landing needed
#     # Uncomment only if you need a VPS fallback
#     # import aasic-landing arifos
# }

# ══════════════════════════════════════════════════════════════
# CHANGE C: mcp.arif-fazil.com → canonical MCP API only
# OLD: had a static file_server fallback at /var/www/html/mcp
# NEW: pure MCP reverse proxy — no static landing
# Rationale: mcp.arif-fazil.com is the machine API, not a human surface
mcp.arif-fazil.com {
    import constitutional-headers
    encode zstd gzip

    # MCP transport — arifOS MCP container
    reverse_proxy /mcp* arifosmcp:8080
    reverse_proxy /sse* arifosmcp:8080
    reverse_proxy /health arifosmcp:8080
    reverse_proxy /tools arifosmcp:8080
    reverse_proxy /* arifosmcp:8080

    header Strict-Transport-Security "max-age=31536000; includeSubDomains"
}

# ══════════════════════════════════════════════════════════════
# CHANGE D: waw + wawa → redirect to aaa (archived surfaces)
# OLD: served from /var/www/html/{waw,wawa}
# NEW: 302 redirects to aaa.arif-fazil.com
waw.arif-fazil.com, wawa.arif-fazil.com {
    import constitutional-headers
    redir https://aaa.arif-fazil.com{uri} 302
}

# ══════════════════════════════════════════════════════════════
# CHANGE E: apex.arif-fazil.com → legacy status (comment only)
# No change to running config — just documentation that this is legacy
# Kept for backward compat; do not link from any new surface
# apex.arif-fazil.com {
#     import aasic-landing apex
# }

# ══════════════════════════════════════════════════════════════
# CHANGE F: well.arif-fazil.com → internal only (remove from public)
# This hostname should not be in public DNS or Caddy — WELL is internal
# well.arif-fazil.com block should be REMOVED from Caddyfile
# (keep for ops reference only — mark as internal)
