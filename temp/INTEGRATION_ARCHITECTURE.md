# ARIF-OS Dynamic Integration Architecture
**Authority:** 888_APEX → 999_SEAL  
**Version:** v2.0-DYNAMIC  
**Ω₀:** 0.04

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARIF-OS TRINITY ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   Ψ SOUL     │    │   Ω MIND     │    │   Δ BODY     │                  │
│  │  (Static)    │◄──►│  (Static)    │◄──►│  (Dynamic)   │                  │
│  │arif-fazil.com│    │arifos.arif-  │    │arifosmcp.arif│                  │
│  │              │    │fazil.com     │    │-fazil.com    │                  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                  │
│         │                   │                   │                          │
│         └───────────────────┴───────────────────┘                          │
│                             │                                              │
│                    ┌────────┴────────┐                                     │
│                    │  API GATEWAY    │                                     │
│                    │  /api/v1/*      │                                     │
│                    └────────┬────────┘                                     │
│                             │                                              │
│         ┌───────────────────┼───────────────────┐                          │
│         │                   │                   │                          │
│  ┌──────▼───────┐    ┌──────▼───────┐    ┌──────▼───────┐                  │
│  │  GEOX-MCP    │    │ arifOS-MCP   │    │  VAULT999    │                  │
│  │  geox.arif-  │    │  (MCP Server)│    │  (Data Store)│                  │
│  │  fazil.com   │    │              │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Integration Patterns

### 2.1 Static-to-Dynamic Bridge

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **API Polling** | Metrics, status updates | `fetch()` every 5-30s |
| **WebSocket** | Real-time telemetry | `ws://` connection |
| **Server-Sent Events** | Live logs, events | `EventSource` |
| **MCP Client** | Tool execution | `@modelcontextprotocol/sdk` |

### 2.2 CORS Configuration

```nginx
# /api/v1/ CORS headers
add_header 'Access-Control-Allow-Origin' 'https://arif-fazil.com' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
```

---

## 3. API Endpoints

### 3.1 arifosmcp.arif-fazil.com API

```
GET  /api/v1/health          → Health check
GET  /api/v1/vitals          → Live metrics (CPU, memory, Ω₀)
GET  /api/v1/tools           → Available MCP tools
POST /api/v1/tools/:name     → Execute tool
GET  /api/v1/logs            → Recent log entries
GET  /api/v1/constitution    → Current constitutional state
```

### 3.2 geox.arif-fazil.com API

```
GET  /api/v1/health          → Health check
GET  /api/v1/materials       → Material database
POST /api/v1/interpret       → Run interpretation
GET  /api/v1/atlas           → Geological atlas data
POST /api/v1/calculate       → Physics calculation
```

---

## 4. Frontend Integration

### 4.1 Live Vitals Component

```typescript
// Fetches live data from arifosmcp API
const useVitals = () => {
  const [vitals, setVitals] = useState(null);
  
  useEffect(() => {
    const fetchVitals = async () => {
      const res = await fetch('https://arifosmcp.arif-fazil.com/api/v1/vitals');
      setVitals(await res.json());
    };
    
    fetchVitals();
    const interval = setInterval(fetchVitals, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return vitals;
};
```

### 4.2 MCP Tool Executor

```typescript
// Execute tools via arifOS MCP
const executeTool = async (toolName: string, params: object) => {
  const res = await fetch(`https://arifosmcp.arif-fazil.com/api/v1/tools/${toolName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
};
```

---

## 5. Deployment Architecture

### 5.1 Docker Compose Stack

```yaml
version: '3.8'

services:
  # Static sites (nginx)
  static-sites:
    image: nginx:alpine
    volumes:
      - ./dist/soul:/usr/share/nginx/html/soul:ro
      - ./dist/mind:/usr/share/nginx/html/mind:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
      - "443:443"

  # arifOS MCP Server
  arifosmcp:
    image: ariffazil/arifosmcp:latest
    environment:
      - MCP_TRANSPORT=http
      - VAULT999_URL=http://vault:8080
    ports:
      - "3001:3000"

  # GEOX MCP Server
  geox:
    image: ariffazil/geox:latest
    environment:
      - FASTMCP_TRANSPORT=http
    ports:
      - "3002:3000"

  # VAULT999 Data Store
  vault:
    image: ariffazil/vault999:latest
    volumes:
      - vault-data:/data
    ports:
      - "8080:8080"

volumes:
  vault-data:
```

### 5.2 Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name arif-fazil.com;
    
    # Static site
    location / {
        root /usr/share/nginx/html/soul;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy to arifosmcp
    location /api/ {
        proxy_pass http://arifosmcp:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}

server {
    listen 443 ssl http2;
    server_name arifosmcp.arif-fazil.com;
    
    location / {
        proxy_pass http://arifosmcp:3000/;
    }
}

server {
    listen 443 ssl http2;
    server_name geox.arif-fazil.com;
    
    location / {
        proxy_pass http://geox:3000/;
    }
}
```

---

## 6. Security Model

### 6.1 F12 Wall Enforcement

| Layer | Protection |
|-------|------------|
| Edge | Cloudflare WAF |
| Gateway | Nginx rate limiting |
| API | JWT authentication |
| MCP | Constitutional validation |

### 6.2 Authentication Flow

```
User → Static Site → API Request → JWT Validation → MCP Execution
                    ↑                              ↓
                    └────── Response ←─────────────┘
```

---

## 7. Constitutional Compliance

All dynamic integrations must respect:

- **F1 Amanah**: All API calls are logged and reversible
- **F2 Truth**: API responses include provenance metadata
- **F9 Anti-Hantu**: No human imagery in dynamic content
- **F10 Wall**: API rate limiting and input validation
- **F11 Auditability**: All tool executions logged to VAULT999

---

**Ditempa Bukan Diberi** — Forged, Not Given  
Ω₀ ≈ 0.04
