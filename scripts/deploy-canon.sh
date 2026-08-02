#!/bin/bash
# deploy-canon.sh — Deploy canon from source to webroot with hash verification
# Usage: bash scripts/deploy-canon.sh
set -euo pipefail

SRC="/root/arif-sites/canon"
DST="/var/www/html/canon"
MANIFEST="$SRC/HASH-MANIFEST.txt"

echo "=== Canon Deploy ==="
echo "Source: $SRC"
echo "Target: $DST"

# 1. Verify source integrity
echo "--- Verifying source hashes ---"
cd "$SRC"
FAIL=0
while read -r hash file; do
    [ "$file" = "./HASH-MANIFEST.txt" ] && continue
    actual=$(sha256sum "$file" 2>/dev/null | cut -d' ' -f1)
    if [ "$actual" != "$hash" ]; then
        echo "  MISMATCH: $file"
        FAIL=1
    fi
done < "$MANIFEST"
[ "$FAIL" -eq 1 ] && echo "ABORT: source hashes don't match manifest" && exit 1
echo "  All source hashes OK"

# 2. Backup current webroot canon
BACKUP="$DST.bak.$(date +%Y%m%dT%H%M%SZ)"
cp -r "$DST" "$BACKUP" 2>/dev/null && echo "Backup: $BACKUP"

# 3. Deploy (rsync, delete removed files)
rsync -a --delete --exclude='*.bak*' "$SRC/" "$DST/"
echo "Deployed"

# 4. Verify deployed hashes
echo "--- Verifying deployed hashes ---"
cd "$DST"
FAIL=0
while read -r hash file; do
    [ "$file" = "./HASH-MANIFEST.txt" ] && continue
    actual=$(sha256sum "$file" 2>/dev/null | cut -d' ' -f1)
    if [ "$actual" != "$hash" ]; then
        echo "  MISMATCH: $file"
        FAIL=1
    fi
done < "$SRC/HASH-MANIFEST.txt"
[ "$FAIL" -eq 1 ] && echo "ABORT: deployed hashes don't match" && exit 1
echo "  All deployed hashes OK"

echo "=== Canon deploy complete ==="
