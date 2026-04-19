#!/bin/bash
# 
# vps-deploy-runbook.sh — Idempotent VPS Deployment for af-forge
# Maps all arifOS ecosystem repos to Ubuntu Linux VPS
# 

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────
DRY_RUN="${DRY_RUN:-0}"
VPS_HOST="${VPS_HOST:-72.62.71.199}"
VPS_USER="${VPS_USER:-root}"
REPO_BASE="${REPO_BASE:-/opt}"
ETC_ARIFOS="${ETC_ARIFOS:-/etc/arifos}"
LOG_FILE="${LOG_FILE:-/var/log/arifos-deploy-$(date +%Y%m%d).log}"
GIT_USER="${GIT_USER:-ariffazil}"

# GitHub repos to deploy
REPOS=("arifOS" "arifosmcp" "GEOX" "A-FORGE" "WEALTH" "WAWA" "AAA" "arif-sites")

# Which branch to deploy from
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"

# ── Colors ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    local level="$1"
    shift
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] [vps-deploy] $*"
    echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
    case "$level" in
        INFO)  echo -e "${BLUE}ℹ${NC}  $*" ;;
        OK)    echo -e "${GREEN}✓${NC}  $*" ;;
        WARN)  echo -e "${YELLOW}⚠${NC}  $*" ;;
        ERROR) echo -e "${RED}✗${NC}  $*" ;;
        STEP)  echo -e "${BLUE}→${NC}  $*" ;;
    esac
}

run() {
    if [[ "$DRY_RUN" == "1" ]]; then
        log "INFO" "[DRY-RUN] Would: $*"
    else
        log "INFO" "EXEC: $*"
        "$@"
    fi
}

# ── Header ─────────────────────────────────────────────────────────────────
echo ""
echo "╔╗"
echo "║     arifOS Ecosystem — VPS Deployment Runbook                  ║"
echo "║     Host: ${VPS_HOST}                                           ║"
echo "║     Date: $(date '+%Y-%m-%d %H:%M:%S')                              ║"
echo "╚╝"
echo ""

if [[ "$DRY_RUN" == "1" ]]; then
    log "WARN" ""
    log "WARN" "  DRY RUN MODE — No changes will be made"
    log "WARN" "  Set DRY_RUN=0 to execute for real"
    log "WARN" ""
    echo ""
fi

# ── Phase 0: Pre-flight ──────────────────────────────────────────────────
log "STEP" "Phase 0: Pre-flight checks..."

# Check if running on the VPS or can SSH to it
if [[ "$(hostname -I 2>/dev/null | grep -c "$VPS_HOST" || true)" -gt 0 ]]; then
    log "OK" "Running directly on VPS ($VPS_HOST)"
    ON_VPS=1
else
    log "WARN" "Not running on VPS — checking SSH access..."
    if ssh -o ConnectTimeout=5 "${VPS_USER}@${VPS_HOST}" "echo OK" &>/dev/null; then
        log "OK" "SSH access to VPS confirmed"
        ON_VPS=0
    else
        log "ERROR" "Cannot reach VPS at ${VPS_USER}@${VPS_HOST}"
        log "ERROR" "Set up SSH access or run this script directly on the VPS"
        exit 1
    fi
fi

# Check prerequisites
for cmd in git docker docker-compose curl; do
    if command -v "$cmd" &>/dev/null; then
        log "OK" "$cmd is available"
    else
        log "WARN" "$cmd is NOT available — may need installation"
    fi
done

echo ""

# ── Phase 1: Directory Structure ──────────────────────────────────────────
log "STEP" ""
log "STEP" "Phase 1: Ensure directory structure"
log "STEP" ""
echo ""

# /opt/ — Source code (read-only at runtime)
log "STEP" "Creating /opt/ repository structure..."
run mkdir -p "$REPO_BASE"

# /etc/arifos/ — Runtime configuration
log "STEP" "Creating /etc/arifos/ runtime config..."
run mkdir -p "$ETC_ARIFOS/compose"

# /var/log/arifos/ — Centralized logs
log "STEP" "Creating /var/log/arifos/..."
run mkdir -p /var/log/arifos

# /etc/caddy/ — Caddy config
log "STEP" "Creating /etc/caddy/..."
run mkdir -p /etc/caddy

# /opt/portainer/ — Container management
log "STEP" "Creating /opt/portainer/..."
run mkdir -p /opt/portainer

echo ""

# ── Phase 2: Clone/Update Repositories ────────────────────────────────────
log "STEP" ""
log "STEP" "Phase 2: Clone/Update repositories"
log "STEP" ""
echo ""

for repo in "${REPOS[@]}"; do
    local repo_path="$REPO_BASE/$repo"
    local repo_url="https://github.com/${GIT_USER}/${repo}.git"

    if [[ -d "$repo_path/.git" ]]; then
        log "STEP" "[$repo] Repository exists — updating..."
        run cd "$repo_path"
        run git fetch origin "$DEPLOY_BRANCH"

        local local_hash remote_hash
        local_hash=$(git rev-parse HEAD)
        remote_hash=$(git rev-parse "origin/$DEPLOY_BRANCH")

        if [[ "$local_hash" == "$remote_hash" ]]; then
            log "OK" "[$repo] Already at latest ($local_hash)"
        else
            log "WARN" "[$repo] Update available: $local_hash → $remote_hash"
            run git checkout "$DEPLOY_BRANCH"
            run git pull origin "$DEPLOY_BRANCH"
            log "OK" "[$repo] Updated to $remote_hash"
        fi

        # Update submodules if present
        if [[ -f ".gitmodules" ]]; then
            log "INFO" "[$repo] Updating submodules..."
            run git submodule update --init --recursive
        fi
    else
        log "STEP" "[$repo] Cloning..."
        run git clone --branch "$DEPLOY_BRANCH" "$repo_url" "$repo_path"
        run cd "$repo_path"

        # Init submodules if present
        if [[ -f ".gitmodules" ]]; then
            log "INFO" "[$repo] Initializing submodules..."
            run git submodule update --init --recursive
        fi

        log "OK" "[$repo] Cloned to $repo_path"
    fi

    # Record deployed version
    local deployed_hash
    deployed_hash=$(cd "$repo_path" && git rev-parse HEAD)
    log "INFO" "[$repo] Deployed version: $deployed_hash"

done

echo ""

# ── Phase 3: Write Runtime Manifest ───────────────────────────────────────
log "STEP" ""
log "STEP" "Phase 3: Write runtime manifest"
log "STEP" ""
echo ""

write_runtime_manifest() {
    if [[ "$DRY_RUN" == "1" ]]; then
        log "INFO" "[DRY-RUN] Would write $ETC_ARIFOS/runtime-manifest.yaml"
        return 0
    fi

    cat > "$ETC_ARIFOS/runtime-manifest.yaml" << EOF
# arifOS Runtime Manifest
# Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
# Host: $VPS_HOST

version: "2026.4"
host:
  name: af-forge
  ip: $VPS_HOST
  os: Ubuntu Linux
  ingress: caddy

repositories:
EOF

    for repo in "${REPOS[@]}"; do
        local repo_path="$REPO_BASE/$repo"
        if [[ -d "$repo_path/.git" ]]; then
            local hash branch commit_date
            hash=$(cd "$repo_path" && git rev-parse HEAD)
            branch=$(cd "$repo_path" && git branch --show-current)
            commit_date=$(cd "$repo_path" && git log -1 --format=%ci)

            cat >> "$ETC_ARIFOS/runtime-manifest.yaml" << EOF
  $repo:
    path: $repo_path
    remote: https://github.com/${GIT_USER}/${repo}.git
    commit: $hash
    branch: $branch
    last_commit: $commit_date
EOF
        fi
    done

    cat >> "$ETC_ARIFOS/runtime-manifest.yaml" << EOF

services:
  arifosmcp:
    type: FastMCP server
    port: 8080
    repo: arifosmcp
    compose: $ETC_ARIFOS/compose/arifosmcp/
    status: enabled

  geox-mcp:
    type: FastMCP server
    port: 18080
    repo: GEOX
    compose: $ETC_ARIFOS/compose/geox/
    status: enabled

  postgres:
    type: database
    port: 5432
    volume: /var/lib/docker/volumes/postgres
    status: enabled

  redis:
    type: cache
    port: 6379
    volume: /var/lib/docker/volumes/redis
    status: enabled

  qdrant:
    type: vector store
    port: 6333
    volume: /var/lib/docker/volumes/qdrant
    status: enabled

  monitoring:
    type: observability
    stack: prometheus, grafana, loki, promtail, cadvisor, node-exporter
    status: enabled

  caddy:
    type: reverse proxy
    port: 80, 443
    config: /etc/caddy
    status: enabled

  portainer:
    type: container management
    port: 9443
    access: localhost only
    status: enabled

public_endpoints:
  - name: arif-fazil.com
    target: arif-sites (BODY)
    type: static
    method: Cloudflare Pages primary, VPS fallback

  - name: apex.arif-fazil.com
    target: arif-sites (SOUL)
    type: static
    method: Cloudflare Pages primary, VPS fallback

  - name: arifos.arif-fazil.com
    target: arif-sites (DOCS)
    type: static
    method: Cloudflare Pages primary, VPS fallback

  - name: mcp.arif-fazil.com
    target: arifOS MCP
    port: 8080
    type: MCP endpoint
    proxy: caddy

  - name: geox.arif-fazil.com
    target: GEOX MCP
    type: MCP endpoint
    proxy: caddy

  - name: waw.arif-fazil.com
    target: WEALTH
    type: web app
    proxy: caddy

  - name: af-forge:9443
    target: Portainer
    type: container management
    access: localhost only
    status: NOT public
EOF

    log "OK" "Runtime manifest written to $ETC_ARIFOS/runtime-manifest.yaml"
}

write_runtime_manifest

echo ""

# ── Phase 4: Docker Compose Setup ─────────────────────────────────────────
log "STEP" ""
log "STEP" "Phase 4: Docker Compose manifests"
log "STEP" ""
echo ""

setup_compose_manifests() {
    # Symlink compose files from repos to /etc/arifos/compose/
    local compose_mappings=(
        "arifosmcp:$REPO_BASE/arifosmcp/docker-compose.yml"
        "geox:$REPO_BASE/GEOX/docker-compose.yml"
    )

    for mapping in "${compose_mappings[@]}"; do
        local name="${mapping%%:*}"
        local source="${mapping##*:}"

        if [[ -f "$source" ]]; then
            run mkdir -p "$ETC_ARIFOS/compose/$name"
            run ln -sf "$source" "$ETC_ARIFOS/compose/$name/docker-compose.yml"
            log "OK" "Linked $name compose: $source → $ETC_ARIFOS/compose/$name/"
        else
            log "WARN" "Compose file not found for $name: $source"
        fi
    done

    # Write monitoring compose if not present
    if [[ ! -f "$ETC_ARIFOS/compose/monitoring/docker-compose.yml" ]]; then
        log "INFO" "Writing monitoring stack compose..."
        if [[ "$DRY_RUN" == "0" ]]; then
            run mkdir -p "$ETC_ARIFOS/compose/monitoring"
            cat > "$ETC_ARIFOS/compose/monitoring/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "127.0.0.1:9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "127.0.0.1:3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD__FILE=/run/secrets/grafana_admin_password
    restart: unless-stopped

  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "127.0.0.1:3100:3100"
    volumes:
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    restart: unless-stopped

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - /var/log:/var/log:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    restart: unless-stopped

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    ports:
      - "127.0.0.1:8081:8080"
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
    ports:
      - "127.0.0.1:9100:9100"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
EOF
            log "OK" "Monitoring compose written"
        fi
    fi
    # Write infrastructure compose (caddy + portainer)
    if [[ ! -f "$ETC_ARIFOS/compose/infrastructure/docker-compose.yml" ]]; then
        log "INFO" "Writing infrastructure compose..."
        if [[ "$DRY_RUN" == "0" ]]; then
            run mkdir -p "$ETC_ARIFOS/compose/infrastructure"
            cat > "$ETC_ARIFOS/compose/infrastructure/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  caddy:
    image: caddy:3
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - /etc/caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - /var/log/caddy:/var/log/caddy
      - caddy_data:/data
    restart: unless-stopped

  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    ports:
      - "127.0.0.1:9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /opt/portainer:/data
    restart: unless-stopped

volumes:
  caddy_data:
EOF
            log "OK" "Infrastructure compose written (Caddy + Portainer)"
        fi
    fi
}
setup_compose_manifests

echo ""


# ── Phase 5: Caddy Reverse Proxy Configuration ─────────────────────────────────
log "STEP" ""
log "STEP" "Phase 5: Caddy reverse proxy configuration"
log "STEP" ""
echo ""

setup_caddy() {
    # Caddy v3 — automatic HTTPS, Let's Encrypt, HTTP/3
    # Replace old nginx ingress with unified Caddy ingress
    CADDYFILE="/etc/caddy/Caddyfile"

    if [[ ! -f "$CADDYFILE" ]]; then
        log "INFO" "Creating Caddyfile at $CADDYFILE..."
        if [[ "$DRY_RUN" == "0" ]]; then
            run mkdir -p /etc/caddy /var/log/caddy
            cat > "$CADDYFILE" << 'CADDYEOF'
# arifOS Caddyfile — Unified Ingress
# Replaces nginx ingress

###############################################################################
# STATIC SITES → Cloudflare Pages (redirect)
###############################################################################

arif-fazil.com {
    redir https://ariffazil.pages.dev{uri}
}

aaa.arif-fazil.com {
    redir https://ariffazil.pages.dev/aaa{uri}
}

wiki.arif-fazil.com {
    redir https://ariffazil.pages.dev/wiki{uri}
}

forge.arif-fazil.com {
    redir https://ariffazil.pages.dev/forge{uri}
}

waw.arif-fazil.com {
    redir https://ariffazil.pages.dev/waw{uri}
}

###############################################################################
# DYNAMIC SERVICES → VPS Docker
###############################################################################

arifosmcp.arif-fazil.com {
    reverse_proxy localhost:8080

    @sse {
        path /sse
    }
    reverse_proxy @sse localhost:8080 {
        transport http {
            keepalive off
        }
    }
}

geox.arif-fazil.com {
    reverse_proxy localhost:8081
}

###############################################################################
# MONITORING STACK (internal access)
###############################################################################

grafana.arif-fazil.com {
    reverse_proxy localhost:3000
}

prometheus.arif-fazil.com {
    reverse_proxy localhost:9090
}

vault.arif-fazil.com {
    reverse_proxy localhost:8200
}

###############################################################################
# INTERNAL SERVICES (Apex stack)
###############################################################################

apex.arif-fazil.com {
    reverse_proxy localhost:8088
}

apex-judge.arif-fazil.com {
    reverse_proxy localhost:8889
}

###############################################################################
# GLOBAL
###############################################################################

{
    email admin@arif-fazil.com
    admin off
}
CADDYEOF
            log "OK" "Caddyfile written — covers 11 vhosts"
        fi
    else
        log "OK" "Caddyfile already exists at $CADDYFILE — skipping"
        log "INFO" "To update: edit $CADDYFILE manually then 'docker exec caddy caddy reload'"
    fi
}

setup_caddy

echo ""


# ── Phase 6: Validate & Summarize ─────────────────────────────────────────
log "STEP" ""
log "STEP" "Phase 6: Validation & Summary"
log "STEP" ""
echo ""

# Validate deployments directory
log "INFO" "Validating deployments/ structure..."
for repo in "${REPOS[@]}"; do
    local deploy_path="$REPO_BASE/$repo/deployments"
    if [[ -d "$deploy_path" ]]; then
        log "OK" "[$repo] deployments/ exists"
    else
        log "INFO" "[$repo] No deployments/ directory"
    fi
done

echo ""
log "OK" ""
log "OK" "  VPS DEPLOYMENT COMPLETE"
log "OK" ""
echo ""
log "INFO" "Filesystem map:"
echo ""
echo "  /etc/arifos/              Runtime configuration"
echo "  ├── runtime-manifest.yaml  Canonical inventory (just written)"
echo "  └── compose/               Docker compose manifests"
echo ""
echo "  /opt/                     Source code (read-only)"
for repo in "${REPOS[@]}"; do
    if [[ -d "$REPO_BASE/$repo/.git" ]]; then
        local hash
        hash=$(cd "$REPO_BASE/$repo" && git rev-parse --short HEAD)
        printf "  ├── %-20s @ %s\n" "$repo/" "$hash"
    fi
done
echo ""
echo "  /etc/caddy/               Caddy config"
echo "  /opt/portainer/           Container management (localhost:9443)"
echo "  /var/lib/docker/          Docker runtime state"
echo "  /var/log/arifos/          Centralized audit logs"
echo ""

if [[ "$DRY_RUN" == "1" ]]; then
    log "WARN" ""
    log "WARN" "  THIS WAS A DRY RUN — No changes were made"
    log "WARN" "  To execute for real: DRY_RUN=0 bash vps-deploy-runbook.sh"
    log "WARN" ""
else
    log "OK" "Run 'docker compose up -d' in each /etc/arifos/compose/*/ directory to start services"
fi

echo ""
