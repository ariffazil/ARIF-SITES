#!/usr/bin/env bash
# shell-wrap.sh — WEB_ATLAS remediation: give static pages shell inheritance.
# Adds tokens.css + data-ring/data-plane + canon footer to hand-rolled static HTML.
# NON-DESTRUCTIVE: backs up originals, only adds what's missing (idempotent).
# Law: ATLAS decides. SHELL renders. TOKENS style. ARIF seals.
# Ref: /root/web-canon/canon/atlas.yaml (ring/plane map)
set -euo pipefail

PUB=/root/arif-fazil.com/sites/arif-fazil.com/public
TOKENS='/_shared/design-system/tokens.css'
BACKUP_DIR="$PUB/.shell-wrap-backup-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"

# route|ring|plane
MAP=(
  "000|SOUL|narrative"
  "999|MIND|proof"
  "earth|ORGAN|domain"
  "geox|ORGAN|domain"
  "vitals|BODY|organ"
  "mcp|MIND|proof"
  "forge|BODY|organ"
  "malaysia|BODY|organ"
  "politics/shadow|SOUL|narrative"
  "politics/ns-election|BODY|organ"
  "politics/ns-election/compare|BODY|organ"
  "politics/ns-election/playbook|BODY|organ"
)

FOOTER_BLOCK='
<!-- CanonFooter (WEB_ATLAS shell invariant I4) -->
<footer class="canon-footer" style="margin-top:3rem;padding:1.2rem 1.5rem;border-top:1px solid #1e293b;font-size:0.8rem;color:#94a3b8;text-align:center;">
  <div><strong>arifOS · Federation Intelligence</strong> — governed by <a href="/canon/atlas.yaml" style="color:#60a5fa">WEB_ATLAS</a> · <a href="/canon/file-authority.yaml" style="color:#60a5fa">file authority</a></div>
  <div style="margin-top:0.3rem;font-style:italic;">DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi.</div>
</footer>'

wrapped=0
for entry in "${MAP[@]}"; do
  dir="${entry%%|*}"
  rest="${entry#*|}"
  ring="${rest%%|*}"
  plane="${rest#*|}"
  file="$PUB/$dir/index.html"
  [ -f "$file" ] || { echo "SKIP $dir (no index.html)"; continue; }

  # Backup once
  cp "$file" "$BACKUP_DIR/$(echo "$dir" | tr '/' '_').html"

  changed=0

  # 1. tokens.css — inject after <head> if missing
  if ! grep -q 'tokens.css' "$file"; then
    sed -i "s|<head>|<head>\n<link rel=\"stylesheet\" href=\"$TOKENS\" />|" "$file"
    changed=1
  fi

  # 2. data-ring / data-plane on <html> — handle lang attr between
  if ! grep -q 'data-ring=' "$file"; then
    sed -i "s|<html |<html data-ring=\"$ring\" data-plane=\"$plane\" |" "$file"
    changed=1
  else
    # Replace existing data-ring value + ensure data-plane present
    python3 - "$file" "$ring" "$plane" <<'EOF'
import re, sys
p, ring, plane = sys.argv[1:4]
s = open(p).read()
s = re.sub(r'<html([^>]*?)data-ring="[^"]*"', lambda m: f'<html{m.group(1)}data-ring="{ring}"', s, count=1)
if 'data-plane=' not in s:
    s = re.sub(r'<html([^>]*?)data-ring="[^"]*"', lambda m: f'<html{m.group(1)}data-ring="{ring}" data-plane="{plane}"', s, count=1)
open(p, 'w').write(s)
EOF
    changed=1
  fi

  # 3. Canon footer before </body> if missing
  if ! grep -q 'CanonFooter' "$file"; then
    python3 - "$file" "$FOOTER_BLOCK" <<'EOF'
import sys
p, footer = sys.argv[1], sys.argv[2]
s = open(p).read()
if '</body>' in s:
    s = s.replace('</body>', footer + '\n</body>', 1)
else:
    s = s + footer
open(p, 'w').write(s)
EOF
    changed=1
  fi

  if [ "$changed" -eq 1 ]; then
    echo "WRAPPED $dir → ring=$ring plane=$plane"
    wrapped=$((wrapped+1))
  else
    echo "OK      $dir (already aligned)"
  fi
done

echo ""
echo "═ shell-wrap: $wrapped pages wrapped · backups at $BACKUP_DIR"
