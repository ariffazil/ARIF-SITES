# arif-fazil.com — Single Deploy Entry Point
# DITEMPA BUKAN DIBERI
#
# Every agent deploys the same way:
#   make deploy
#
# That's it. One command. The Makefile handles the rest.
# Read DEPLOY.md for the full runbook.

.PHONY: deploy verify build reload status clean help sync-aaa verify-pages

# ── DEFAULT: full deploy ──────────────────────────────────────────────
deploy: verify sync-aaa build verify-pages reload
	@echo ""
	@echo "═══════════════════════════════════════════"
	@echo "  DEPLOY COMPLETE — arif-fazil.com live"
	@echo "═══════════════════════════════════════════"
	@echo "  Verify:  curl -sI https://arif-fazil.com"
	@echo "  Status:  make status"
	@echo ""

# ── Dry-run deploy (verify only, no mutation) ─────────────────────────
dry-run: verify
	@echo "✓ Dry-run passed. Ready for deploy."

# ── Pre-deploy verification gate ──────────────────────────────────────
verify:
	@echo "[verify] Checking surface catalog truth..."
	node scripts/verify-surfaces.cjs --base=https://arif-fazil.com
	@echo "[verify] Checking Caddy config..."
	caddy validate --config /etc/caddy/Caddyfile > /dev/null 2>&1 && echo "[verify] Caddy config: VALID"
	@echo "[verify] M3 fix 2026-08-01: scanning source HTML for dev-only entry points..."
	@if grep -rE 'src="/src/[^"]*"|src="/@vite/|src="/@id/' sites/ public/ 2>/dev/null; then \
		echo "✗ [verify] DEV-ONLY ENTRY FOUND — refuse to deploy."; \
		echo "  These paths only exist in Vite dev mode. Run 'make build' first to bundle."; \
		exit 1; \
	else \
		echo "[verify] No dev-only entry points — safe to deploy."; \
	fi
	@echo "✓ All gates passed."

# ── Build the React SPA ───────────────────────────────────────────────
build:
	@echo "[build] Building arif-fazil.com (React/Vite)..."
	cd sites/arif-fazil.com && npm run build
	@echo "[build] Regenerating discovery catalogs..."
	cd sites/arif-fazil.com && node scripts/generate-discovery.cjs
	@echo "✓ Build complete."

# ── Reload Caddy (apply config changes) ───────────────────────────────
reload:
	@echo "[reload] Validating Caddy config..."
	caddy validate --config /etc/caddy/Caddyfile
	@echo "[reload] Reloading Caddy..."
	systemctl reload caddy
	@echo "✓ Caddy reloaded."

# ── Status check ──────────────────────────────────────────────────────
status:
	@echo "=== Caddy ==="
	@systemctl is-active caddy 2>/dev/null || echo "DOWN"
	@echo ""
	@echo "=== Key surfaces ==="
	@for url in https://arif-fazil.com https://arif-fazil.com/surfaces.json https://arif-fazil.com/llms.txt https://arif-fazil.com/robots.txt https://arif-fazil.com/rsl.xml; do \
		code=$$(curl -sI -o /dev/null -w '%{http_code}' "$$url" 2>/dev/null); \
		printf "  %-50s HTTP %s\n" "$$url" "$$code"; \
	done
	@echo ""
	@echo "=== Git ==="
	@git status --short 2>/dev/null | head -10
	@echo ""
	@echo "=== Last deploy ==="
	@git log --oneline -1 2>/dev/null || echo "  No commits"

# ── Git: commit all changes ───────────────────────────────────────────
commit:
	@git add -A
	@git status --short | head -20
	@echo ""
	@echo "Ready to commit. Run: git commit -m '...' && git push"

# ── Full deploy via deploy-vps.sh (for rsync-based deploys) ───────────
deploy-full:
	@echo "[deploy-full] Running deploy-vps.sh..."
	bash deploy-vps.sh

# ── Help ──────────────────────────────────────────────────────────────
help:
	@echo "arif-fazil.com Deploy"
	@echo "===================="
	@echo ""
	@echo "  make deploy       Full deploy: verify → sync-aaa → build → verify-pages → reload"
	@echo "  make dry-run      Verify only, no mutation"
	@echo "  make verify       Pre-deploy surface truth + Caddy check"
	@echo "  make sync-aaa     Sync AAA dist/ into arif-fazil.com dist/aaa/"
	@echo "  make build        Build React SPA + regenerate catalogs"
	@echo "  make verify-pages Page inventory gate — curl every dist/ page, assert 200"
	@echo "  make reload       Validate + reload Caddy"
	@echo "  make status       Health check (Caddy, surfaces, git)"
	@echo "  make commit       Stage all changes for git commit"
	@echo "  make deploy-full  Full rsync-based deploy (deploy-vps.sh)"
	@echo ""
	@echo "  Single command:   make deploy"
	@echo "  Runbook:          cat DEPLOY.md"

# ── AAA sync — pull AAA dist into arif-fazil.com dist ───────────────
# 2026-08-03: AAA builds separately at /root/AAA/dist/. This target
# syncs it into the site dist so /aaa/* pages are served. Without this,
# every AAA change silently diverges from the live site.
sync-aaa:
	@echo "[sync-aaa] Syncing AAA dist into arif-fazil.com dist/aaa/..."
	@if [ -d /root/AAA/dist ]; then \
		mkdir -p sites/arif-fazil.com/dist/aaa; \
		rsync -av --delete /root/AAA/dist/ sites/arif-fazil.com/dist/aaa/; \
		echo "[sync-aaa] ✓ AAA synced."; \
	else \
		echo "[sync-aaa] ⚠ /root/AAA/dist/ not found — skipping (AAA may not be built)"; \
	fi

# ── Page inventory gate ─────────────────────────────────────────────
# 2026-08-03: Structural fix. Scans every dist/*/index.html → curls
# live URL → asserts 200. Any gap = HALT. No agent can seal site
# work with unreachable pages.
# DITEMPA BUKAN DIBERI — entropy must not accumulate at integration boundaries.
verify-pages:
	@echo "[verify-pages] Running page inventory gate..."
	@bash scripts/verify-pages.sh
	@echo ""
