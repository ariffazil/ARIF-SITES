# arif-fazil.com — Single Deploy Entry Point
# DITEMPA BUKAN DIBERI
#
# Every agent deploys the same way:
#   make deploy
#
# That's it. One command. The Makefile handles the rest.
# Read DEPLOY.md for the full runbook.

.PHONY: deploy verify build reload status clean help

# ── DEFAULT: full deploy ──────────────────────────────────────────────
deploy: verify build reload
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
	@echo "  make deploy       Full deploy: verify → build → reload"
	@echo "  make dry-run      Verify only, no mutation"
	@echo "  make verify       Pre-deploy surface truth + Caddy check"
	@echo "  make build        Build React SPA + regenerate catalogs"
	@echo "  make reload       Validate + reload Caddy"
	@echo "  make status       Health check (Caddy, surfaces, git)"
	@echo "  make commit       Stage all changes for git commit"
	@echo "  make deploy-full  Full rsync-based deploy (deploy-vps.sh)"
	@echo ""
	@echo "  Single command:   make deploy"
	@echo "  Runbook:          cat DEPLOY.md"
