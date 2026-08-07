// arif-fazil.com — 5-Bucket Architecture (v8.0.0)
// F13 SOVEREIGN directive: collapse all artifacts into HOME · EARTH · WORLD · WORDS · WORK
// Forged: 2026-08-07 by 333-AGI under F13
// canon version: 8.0.0 · as_of: 2026-08-07 · trinity: LIVE

export interface NavItem {
  label: string;
  href: string;
  mode?: 'spa' | 'static' | 'external';
  external?: boolean;
}

export const brand = {
  "label": "ARIF FAZIL",
  "href": "/",
  "creed": "Forged, not given."
} as const;

export const primaryNav: NavItem[] = [
  {
    "label": "Home",
    "href": "/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Earth",
    "href": "/earth",
    "mode": "spa",
    "external": false
  },
  {
    "label": "World",
    "href": "/world",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Words",
    "href": "/words",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Work",
    "href": "/work",
    "mode": "spa",
    "external": false
  }
];

export const secondaryNav: NavItem[] = [
  {
    "label": "Origin",
    "href": "/000/",
    "mode": "static",
    "external": false
  },
  {
    "label": "MakcikGPT",
    "href": "/world/makcikgpt/",
    "mode": "static",
    "external": false
  },
  {
    "label": "PROPA",
    "href": "/world/propa/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Proof",
    "href": "/work/proof/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Missions",
    "href": "/work/missions/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Signal",
    "href": "/connect/",
    "mode": "static",
    "external": false
  }
];

export const machineNav: NavItem[] = [
  {
    "label": "llms.txt",
    "href": "/llms.txt",
    "mode": "spa",
    "external": false
  },
  {
    "label": "missions.json",
    "href": "/missions.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "surfaces.json",
    "href": "/surfaces.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "webmcp",
    "href": "/.well-known/webmcp.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "MCP Gateway",
    "href": "https://mcp.arif-fazil.com/mcp",
    "mode": "external",
    "external": true
  },
  {
    "label": "DID",
    "href": "/.well-known/did.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "arifOS",
    "href": "https://arifos.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "GEOX",
    "href": "https://geox.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WEALTH",
    "href": "https://wealth.arif-fazil.com",
    "mode": "external",
    "external": true
  },
  {
    "label": "WELL",
    "href": "https://well.arif-fazil.com",
    "mode": "external",
    "external": true
  }
];

/** 5-Bucket Architecture — LIVE */
export const trinityStatus = "LIVE" as const;
