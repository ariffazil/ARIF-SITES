#!/usr/bin/env bash
# inject-live-strip.sh — Post-build live market data injector
# DITEMPA BUKAN DIBERI
# 
# After render-propa.cjs produces dist/propa/index.html,
# this script replaces the static live-strip section with
# live market data fetched by live-market.py.
#

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(dirname "$SCRIPT_DIR")"
LIVE_MARKET="$SCRIPT_DIR/live-market.py"
TARGET_DIR="${1:-$SITE_DIR/dist/propa}"

echo "[inject-live-strip] Fetching live market data..."
LIVE_HTML=$("$LIVE_MARKET" 2>/dev/null)
if [ -z "$LIVE_HTML" ]; then
    echo "[inject-live-strip] WARNING: live-market.py returned empty output, skipping injection"
    exit 0
fi

TARGET="$TARGET_DIR/index.html"
if [ ! -f "$TARGET" ]; then
    echo "[inject-live-strip] ERROR: target $TARGET not found"
    exit 1
fi

# Escape for sed
ESCAPED=$(echo "$LIVE_HTML" | python3 -c "import sys; print(sys.stdin.read().replace('\\\\','\\\\\\\\').replace('&','\\\\&').replace('\n','\\\\n'))")

# Replace the live-strip div (from <div class="live-strip" to its closing </div>)
python3 -c "
import sys, re
html = open('$TARGET').read()
# Replace the live-strip section
pattern = r'<div class=\"live-strip\"[^>]*>.*?</div>\s*(?=<!\-\- B11-E)'
replacement = '''$LIVE_HTML'''
new_html = re.sub(pattern, replacement + '\n', html, count=1, flags=re.DOTALL)
open('$TARGET','w').write(new_html)
print('Injected live-strip into $TARGET')
" 2>/dev/null || {
    echo "[inject-live-strip] Python injection failed, trying sed fallback..."
    cp "$TARGET" "$TARGET.bak"
    # Simpler approach: just replace the entire live-strip div
    python3 -c "
html = open('$TARGET').read()
old_start = html.find('<div class=\"live-strip\"')
old_end = html.find('<!-- B11-E:', old_start) if old_start > 0 else -1
if old_start > 0 and old_end > 0:
    new_html = html[:old_start] + '''$LIVE_HTML''' + '\n\n' + html[old_end:]
    open('$TARGET','w').write(new_html)
    print('Injected live-strip (fallback method)')
else:
    print('Could not find live-strip markers')
"
}

echo "[inject-live-strip] Done. Live market data injected into $TARGET"
