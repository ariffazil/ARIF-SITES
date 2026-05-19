# Spatial Intelligence State Map — arifOS Federation VPS
<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-05-19
valid_from: 2026-05-19
valid_until: 2026-06-19
confidence: high
scope: /root
-->

> **DITEMPA BUKAN DIBERI** — Intelligence is forged, not given.

## Executive Summary

Your VPS already hosts a **sovereign spatial intelligence stack** capable of powering a Large World Model (LWM) travel app. You do not need to buy new APIs or install new engines. You need to **wire what you already own**.

---

## 1. Active API Keys & External Spatial Services

| Service | Status | Key Location | Capabilities Verified |
|---------|--------|--------------|----------------------|
| **Google Places API** | ✅ LIVE | `/root/.env` | Text search, place details, reviews, photos, types |
| **Google Directions API** | ✅ LIVE | `/root/.env` | Route polyline, duration, distance, turn-by-turn steps |
| **Google Geocoding API** | ❌ DENIED | `/root/.env` | Not enabled on this key (use Places textsearch fallback) |
| **Mapbox / MapLibre** | ✅ INSTALLED | `geox-gui/` | MapLibre GL v4.0.0 (free vector tiles, no API key needed) |
| **CesiumJS** | ✅ INSTALLED | `geox-gui/` | 3D globe, terrain, imagery layers |

**Key value:** `GOOGLE_PLACES_API_KEY=AIzaSyCe5SnCwExltGrIzbBqA41mp2u7bh4ClQg`
- Verified working 2026-05-08 against Hat Yai restaurant search
- Verified working 2026-05-08 against Penang → Hat Yai directions

---

## 2. Internal Spatial Intelligence Organs

### 2.1 GEOX — Earth Coprocessor (Ψ Node)
**Path:** `/root/geox`  
**Port:** 8081  
**Role:** Physical evidence, subsurface interpretation, mobility, terrain, infrastructure

**Frontend Stack (`geox-gui/`):**
- React 19 + Vite + Tailwind
- Cesium 1.114 (3D earth)
- MapLibre GL 4.0 (2D vector maps)
- D3 7.8.5 (data visualization)
- Framer Motion (animations)

**Spatial Skills (Draft → Runtime ready):**

| Skill | Domain | What It Does | Travel App Use |
|-------|--------|--------------|----------------|
| `mobility-route-viability` | Mobility | Route feasibility under time, weather, road class, terrain | "Is this mountain pass safe in monsoon?" |
| `mobility-chokepoint-detection` | Mobility | Bridges, ports, ferries, canal locks — criticality + fallback | "Ferry is down — show alternate route" |
| `mobility-fleet-patterns` | Mobility | AIS/vehicle tracking, movement signatures | "Traffic pattern at border crossing" |
| `geo-coordinate-frames` | Geodesy | Lat/lon ↔ projected grids ↔ local frames ↔ image tiles | Map tile alignment, GPS fusion |
| `geo-position-fix-fusion` | Geodesy | Fuse GPS/GNSS + inertial + map anchors into best-estimate position | Indoor/outdoor position confidence |
| `geo-scale-and-tiling` | Geodesy | Segment geo data into scale buckets and tile schemes | Zoom-level-appropriate detail |
| `terrain-surface-access` | Terrain | Traversability for foot, wheeled, tracked, drone | "Can a sedan drive this trail?" |
| `terrain-relief-and-slope` | Terrain | Slope, aspect, ridge/depression, movement cost | Hiking difficulty scoring |
| `infra-network-topology` | Infrastructure | Road, rail, power, comms network graphs | "Which roads are open after flood?" |
| `infra-critical-node-watch` | Infrastructure | Monitor bridges, substations, cell towers | Alert on infrastructure failure |
| `sensing-*` | Sensing | Satellite, drone, IoT sensor ingestion | Live weather, congestion, air quality |

**MCP Surface:** `geox` exposes FastMCP tools on port 8081. Any arifOS client can call `geox_*` tools.

### 2.2 arifOS — Governance Kernel (Law & Sense)
**Path:** `/root/arifOS`  
**Port:** 8080  
**Role:** Constitutional judgment, sense observation, vault anchoring

**Relevant Canonical Tools:**

| Tool | Mode | Spatial Capability | Status |
|------|------|-------------------|--------|
| `arif_sense_observe` | `search` | Web/semantic search | Stub (Qdrant index P1) |
| `arif_sense_observe` | `compass` | Geospatial heading query | Stub (returns static north) |
| `arif_sense_observe` | `atlas` | Structured map/layer retrieval | Stub (returns empty map) |
| `arif_sense_observe` | `ingest` | URL ingestion for evidence | Stub |
| `arif_evidence_fetch` | — | Evidence-preserving web fetch with sequential thinking | Active |
| `arif_mind_reason` | `plan` | Structural plan generation | Active |
| `arif_mind_reason` | `reason` | Cognitive reasoning | Active |

**Gap:** `atlas` and `compass` modes are stubs. They should be wired to GEOX and Google Places/Directions.

### 2.3 WELL — Universal Substrate Vitality Mirror
**Path:** `/root/WELL`  
**Port:** 8083  
**Role:** Operator biological state, cognitive pressure, livelihood assessment

**Travel App Relevance:** WELL can monitor operator fatigue, stress, and readiness during travel. It can gate agentic decisions (e.g., "Operator has been driving 4 hours — suggest rest stop").

### 2.4 A-FORGE — Metabolic Execution Shell
**Path:** `/root/A-FORGE`  
**Port:** 7071  
**Role:** Agent orchestration, tool registry, budget management

**Travel App Relevance:** A-FORGE can orchestrate multi-step travel planning agents that call Google Places, GEOX mobility skills, and arifOS judgment in a single loop.

---

## 3. Data Assets

| Asset | Path | Format | Description |
|-------|------|--------|-------------|
| `geox_atlas_99_materials.csv` | `/root/geox/` | CSV | 99 canonical earth materials registry |
| `geox_invariants.yaml` | `/root/geox/` | YAML | Constitutional invariants for earth science |
| `SITE_MAP_VISUAL.md` | `/root/geox/` | Markdown | Visual site map for geox.arif-fazil.com |
| `bad.las` / `empty.las` | `/root/` | LAS | LIDAR point cloud samples |
| `.grass8/` | `/root/` | GRASS GIS | Local GIS workspace (verify active) |
| `asset_memory.db` | `/root/geox/` | SQLite | GEOX asset memory |

---

## 4. Existing Frontend Projects

| Project | Path | Stack | Map Tech |
|---------|------|-------|----------|
| `geox-gui` | `/root/geox/geox-gui` | React 19 + Vite + Tailwind | Cesium + MapLibre GL |
| `AAA` | `/root/AAA` | React 19 + Vite + Radix UI | None (control plane) |
| `arif-sites/temp/app` | `/root/arif-sites/temp/app` | React 19 + Vite + Tailwind | None (MCP dashboard) |
| `arif-sites/sites/geox.*` | `/root/arif-sites/sites/geox.arif-fazil.com` | Static HTML | Custom viewer |
| `arif-sites/sites/waw.*` | `/root/arif-sites/sites/waw.arif-fazil.com` | Static HTML | None |

**Your test code** (`PlanView`, `TabButton`, `Live Route Spine`, `Place Nodes`) does **not** exist as files in the repo. It was only in the Gemini chat transcript. I will scaffold it now.

---

## 5. Recommended Architecture: LWM Travel App

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAVEL APP (React + Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  MapView │  │ PlanView │  │PlaceNodes│  │AgentChat │   │
│  │(MapLibre)│  │(Itinerary│  │(Places  │  │(LLM +   │   │
│  │          │  │  Spine)  │  │ Results) │  │ Tools)   │   │
│  └────┬─────┘  └──────────┘  └──────────┘  └────┬─────┘   │
│       │                                         │          │
│       └─────────────┬───────────────────────────┘          │
│                     │                                       │
│              ┌──────▼──────┐                                │
│              │  Travel API │  (Local hooks layer)           │
│              │  (usePlaces)│                                │
│              │(useDirectns)│                                │
│              └──────┬──────┘                                │
└─────────────────────┼───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌──────────┐
   │ Google  │  │  GEOX   │  │  arifOS  │
   │ Places  │  │ Mobility│  │  MCP     │
   │Directns │  │ Terrain │  │  Bridge  │
   └─────────┘  └─────────┘  └──────────┘
```

### Stack Decision
- **Map Renderer:** MapLibre GL (free tiles, matches geox-gui, no extra API key)
- **Place Search:** Google Places API (your key is live)
- **Routing:** Google Directions API (your key is live)
- **Agentic Layer:** arifOS MCP bridge (`/sense`, `/mind`, `/judge`)
- **Style:** Tailwind CSS + zinc/emerald palette (matches your test code)

---

## 6. Gaps to Close

| # | Gap | Severity | Fix |
|---|-----|----------|-----|
| 1 | `arif_sense_observe(mode='atlas')` is a stub | Medium | Wire to GEOX `geo-scale-and-tiling` + MapLibre |
| 2 | `arif_sense_observe(mode='compass')` is a stub | Low | Wire to device geolocation API + GEOX `geo-position-fix-fusion` |
| 3 | No travel-specific MCP tool surface | Medium | Create `travel_*` tools or extend GEOX mobility |
| 4 | No unified place cache | Low | Use Qdrant or Redis to cache Places results |
| 5 | No offline map tile storage | Low | Use protomaps + S3/R2 for offline regions |

---

## 7. Quick-Start Commands

```bash
# Verify Places API
curl -s "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Hat+Yai&key=${GOOGLE_PLACES_API_KEY}"

# Verify Directions API
curl -s "https://maps.googleapis.com/maps/api/directions/json?origin=Penang&destination=Hat+Yai&key=${GOOGLE_PLACES_API_KEY}"

# Start GEOX MCP server
cd /root/geox && python server.py

# Start arifOS MCP server
cd /root/arifOS && python -m arifosmcp.server
```

---

*Mapped by Kimi (arifOS Clerk) — 2026-05-08*
