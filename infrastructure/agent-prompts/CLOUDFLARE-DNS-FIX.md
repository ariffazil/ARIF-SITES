# Cloudflare DNS Fix Agent Prompt

> **Context:** aaa.arif-fazil.com returns 403 because DNS A record points to VPS IP instead of Cloudflare Pages.

## Problem

```
aaa.arif-fazil.com → A record → 72.62.71.199 (VPS)
                              ↓
                        nginx returns 403
                              ↓
                   Never reaches Cloudflare Pages
```

## Solution (Pick One)

### Option 1: Delete A Record (Recommended)
```bash
# Via Cloudflare API
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records/{RECORD_ID}" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json"
```

Then add as **CNAME** to Cloudflare Pages domain.

### Option 2: Add nginx reverse proxy (if keeping A record)
Edit nginx config:
```nginx
server {
    server_name aaa.arif-fazil.com;
    
    # Proxy to Cloudflare Pages
    location / {
        proxy_pass https://arif-sites.pages.dev;  # or actual Pages URL
        proxy_set_header Host aaa.arif-fazil.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Prevent 403 from Pages
        proxy_intercept_errors off;
    }
}
```

## Steps for VPS Agent

1. **Check current DNS:**
   ```bash
   dig aaa.arif-fazil.com +short
   # OR
   curl -s https://dns.google/resolve?name=aaa.arif-fazil.com&type=A
   ```

2. **List Cloudflare DNS records** (via API):
   ```bash
   curl -s "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records?name=aaa.arif-fazil.com" \
     -H "Authorization: Bearer {API_TOKEN}"
   ```

3. **Delete A record** or **Update to CNAME**

4. **Verify:**
   ```bash
   curl -I https://aaa.arif-fazil.com
   # Should return 200, not 403
   ```

## Required Info

| Item | Value |
|------|-------|
| Domain | aaa.arif-fazil.com |
| Zone ID | (from Cloudflare) |
| Record ID | (from DNS list) |
| API Token | (with Zone:DNS edit) |

## Verify Success

```bash
curl -sI https://aaa.arif-fazil.com | head -1
# Expected: HTTP/2 200
```

---

**SEAL:** DITEMPA BUKAN DIBERI  
**Agent:** VPS Operator  
**Target:** Fix aaa.arif-fazil.com → 200 OK