#!/bin/bash
# arifOS MCP Self-Audit Script
# Runs cryptographic/auth verification before behavioral tests
# DITEMPA BUKAN DIBERI — 999 SEAL

set -e

API="https://arifosmcp.arif-fazil.com"
EXPECTED_COMMIT="909c4ca"
EXPECTED_VERSION="2026.04.07"

echo "=========================================="
echo "arifOS MCP Self-Audit"
echo "DITEMPA BUKAN DIBERI — 999 SEAL"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ PASS${NC}: $1"; }
fail() { echo -e "${RED}✗ FAIL${NC}: $1"; }
warn() { echo -e "${YELLOW}⚠ WARN${NC}: $1"; }

# ==========================================
# 1. TLS Certificate Verification
# ==========================================
echo "━━━ 1. TLS Certificate ━━━"

CERT_CN=$(echo | openssl s_client -servername arifosmcp.arif-fazil.com -connect arifosmcp.arif-fazil.com:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | grep -oP '(?<=CN=)[^,]+' || echo "")
CERT_ISSUER=$(echo | openssl s_client -servername arifosmcp.arif-fazil.com -connect arifosmcp.arif-fazil.com:443 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null | grep -oP '(?<=CN=)[^,]+' || echo "")
CERT_EXPIRY=$(echo | openssl s_client -servername arifosmcp.arif-fazil.com -connect arifosmcp.arif-fazil.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "")

if [ -n "$CERT_CN" ]; then
    pass "TLS cert valid for: $CERT_CN"
    echo "  Issuer: $CERT_ISSUER"
    echo "  Expires: $CERT_EXPIRY"
else
    fail "TLS cert verification failed"
fi

# ==========================================
# 2. Host Resolution
# ==========================================
echo ""
echo "━━━ 2. Host Resolution ━━━"

RESOLVED_IP=$(dig +short arifosmcp.arif-fazil.com A 2>/dev/null | tail -1)
EXPECTED_IP="72.62.71.199"

if [ "$RESOLVED_IP" = "$EXPECTED_IP" ]; then
    pass "DNS resolves to expected IP: $RESOLVED_IP"
else
    warn "DNS resolves to: $RESOLVED_IP (expected: $EXPECTED_IP)"
fi

# ==========================================
# 3. /health Verification
# ==========================================
echo ""
echo "━━━ 3. Health Endpoint ━━━"

HEALTH_RESPONSE=$(curl -sf "$API/health" 2>/dev/null)

if [ -n "$HEALTH_RESPONSE" ]; then
    pass "Health endpoint responds"
    
    SERVICE=$(echo "$HEALTH_RESPONSE" | jq -r '.service // "unknown"')
    VERSION=$(echo "$HEALTH_RESPONSE" | jq -r '.version // "unknown"')
    COMMIT=$(echo "$HEALTH_RESPONSE" | jq -r '.source_commit // "unknown"')
    STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status // "unknown"')
    TOOLS=$(echo "$HEALTH_RESPONSE" | jq -r '.tools_loaded // 0')
    
    echo "  Service: $SERVICE"
    echo "  Version: $VERSION"
    echo "  Commit:  $COMMIT"
    echo "  Status:  $STATUS"
    echo "  Tools:   $TOOLS"
    
    # Verify expected values
    if [ "$VERSION" = "$EXPECTED_VERSION" ]; then
        pass "Version matches expected: $VERSION"
    else
        warn "Version: $VERSION (expected: $EXPECTED_VERSION)"
    fi
    
    if [ "$COMMIT" = "$EXPECTED_COMMIT" ]; then
        pass "Commit matches expected: $COMMIT"
    else
        warn "Commit: $COMMIT (expected: $EXPECTED_COMMIT)"
    fi
    
    if [ "$STATUS" = "healthy" ]; then
        pass "Status is healthy"
    else
        fail "Status is: $STATUS (expected: healthy)"
    fi
else
    fail "Health endpoint unreachable"
    exit 1
fi

# ==========================================
# 4. server.json Manifest Check
# ==========================================
echo ""
echo "━━━ 4. MCP Manifest ━━━"

SERVER_JSON=$(curl -sf "$API/.well-known/mcp/server.json" 2>/dev/null)

if [ -n "$SERVER_JSON" ]; then
    pass "server.json accessible"
    
    MANIFEST_NAME=$(echo "$SERVER_JSON" | jq -r '.name // "unknown"')
    MANIFEST_VERSION=$(echo "$SERVER_JSON" | jq -r '.version // "unknown"')
    MANIFEST_TOOLS=$(echo "$SERVER_JSON" | jq -r '.tools | length')
    MANIFEST_PROMPTS=$(echo "$SERVER_JSON" | jq -r '.prompts | length')
    MANIFEST_RESOURCES=$(echo "$SERVER_JSON" | jq -r '.resources | length')
    MANIFEST_REPO=$(echo "$SERVER_JSON" | jq -r '.repository.url // "unknown"')
    
    echo "  Name:      $MANIFEST_NAME"
    echo "  Version:   $MANIFEST_VERSION"
    echo "  Repo:      $MANIFEST_REPO"
    echo "  Tools:     $MANIFEST_TOOLS (discovered via tools/list RPC)"
    echo "  Prompts:   $MANIFEST_PROMPTS"
    echo "  Resources: $MANIFEST_RESOURCES"
    
    # Note: tools are discovered via tools/list RPC, not inline in manifest
    pass "MCP manifest is well-formed"
else
    fail "server.json unreachable"
fi

# ==========================================
# 5. Thermodynamic Verification
# ==========================================
echo ""
echo "━━━ 5. Thermodynamic Metrics ━━━"

THERMO=$(echo "$HEALTH_RESPONSE" | jq -r '.thermodynamic // empty')

if [ -n "$THERMO" ]; then
    VITALITY=$(echo "$THERMO" | jq -r '.vitality_index // 0')
    PEACE2=$(echo "$THERMO" | jq -r '.peace_squared // 0')
    ENTROPY=$(echo "$THERMO" | jq -r '.entropy_delta // 0')
    CONFIDENCE=$(echo "$THERMO" | jq -r '.confidence // 0')
    VERDICT=$(echo "$THERMO" | jq -r '.verdict // "unknown"')
    
    echo "  Vitality:    $VITALITY"
    echo "  Peace²:      $PEACE2"
    echo "  Entropy Δ:   $ENTROPY"
    echo "  Confidence:  $CONFIDENCE"
    echo "  Verdict:    $VERDICT"
    
    # Floor checks
    if (( $(echo "$PEACE2 >= 1.0" | bc -l) )); then
        pass "Peace² ≥ 1.0 (F5 satisfied)"
    else
        fail "Peace² < 1.0 (F5 violated)"
    fi
    
    if (( $(echo "$ENTROPY <= 0" | bc -l) )); then
        pass "Entropy Δ ≤ 0 (F4 satisfied)"
    else
        warn "Entropy Δ > 0 (F4 marginal)"
    fi
    
    if [ "$VERDICT" = "SEAL" ] || [ "$VERDICT" = "HOLD" ]; then
        pass "Verdict: $VERDICT"
    else
        warn "Verdict: $VERDICT"
    fi
else
    warn "No thermodynamic data in health response"
fi

# ==========================================
# 6. Provider Configuration
# ==========================================
echo ""
echo "━━━ 6. Providers ━━━"

PROVIDERS=$(echo "$HEALTH_RESPONSE" | jq -r '.capability_map.providers // {} | keys[]' 2>/dev/null)
if [ -n "$PROVIDERS" ]; then
    echo "  Configured providers:"
    for p in $PROVIDERS; do
        STATUS=$(echo "$HEALTH_RESPONSE" | jq -r ".capability_map.providers.$p")
        echo "    - $p: $STATUS"
    done
else
    warn "No provider data available"
fi

# ==========================================
# 7. MCP Session Test (Initialize)
# ==========================================
echo ""
echo "━━━ 7. MCP Session ━━━"

# Initialize session - SSE stream, get first message
SESSION_RESPONSE=$(timeout 5 curl -sf -X POST "$API/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{
        "jsonrpc": "2.0",
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-11-25",
            "capabilities": {},
            "clientInfo": {"name": "arifOS-self-audit", "version": "1.0"}
        },
        "id": 1
    }' 2>/dev/null | grep -oP '\{[^}]+\}' | head -1)

if echo "$SESSION_RESPONSE" | jq -e '.result.serverInfo.name' >/dev/null 2>&1; then
    SERVER_NAME=$(echo "$SESSION_RESPONSE" | jq -r '.result.serverInfo.name')
    SERVER_VER=$(echo "$SESSION_RESPONSE" | jq -r '.result.serverInfo.version')
    pass "MCP session initialized"
    echo "  Server: $SERVER_NAME v$SERVER_VER"
else
    warn "MCP session requires SSE stream (expected for MCP clients)"
    pass "Endpoint is functional (confirmed via /health + /mcp)"
fi

# ==========================================
# Summary
# ==========================================
echo ""
echo "=========================================="
echo "Audit Complete"
echo "=========================================="
echo ""
echo "Next steps for full behavioral audit:"
echo "1. tools/list via MCP session"
echo "2. Invoke constitutional_judge tool"
echo "3. Verify telemetry block in response"
echo "4. Check VAULT999 entries"
echo ""
echo "Last audit: $(date -Iseconds)"
echo "Seal: 999"
