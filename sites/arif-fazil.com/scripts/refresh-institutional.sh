#!/usr/bin/env bash
# Refresh WEALTH institutional panel on propa page
# Called by cron every 30 min. Idempotent.
set -euo pipefail
cd /root/arif-fazil.com/sites/arif-fazil.com
INST_HTML=$(python3 scripts/wealth-institutional.py 2>/dev/null)
if [ -n "$INST_HTML" ]; then
    # Check if already injected
    if ! grep -q "WEALTH MCP" /var/www/html/arif/propa/index.html 2>/dev/null; then
        TARGET=/var/www/html/arif/propa/index.html
        python3 -c "
html = open('$TARGET').read()
marker = '<!-- B11-E: RECENT EVENTS PANEL'
inst = '''$INST_HTML'''
if marker in html and inst not in html:
    html = html.replace(marker, inst + '\n\n' + marker)
    open('$TARGET','w').write(html)
    print('Institutional panel refreshed')
" 2>/dev/null
    fi
fi
