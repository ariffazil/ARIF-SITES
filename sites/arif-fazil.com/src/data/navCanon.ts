// AUTO-GENERATED from /root/web-canon/canon/navigation.json (generate-nav-canon.cjs)
// DERIVED — never hand-edit. Edit canon, regenerate.
// F2: this file must match canon exactly. Drift = entropy.
// canon version: 4.1.0 · as_of: 2026-08-06 · trinity: DRAFT_FUTURE

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
    "label": "Earth",
    "href": "/earth",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Capital",
    "href": "/economics",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Voice",
    "href": "/world",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Essays",
    "href": "/writing",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Law",
    "href": "/doctrine",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Work",
    "href": "/missions",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Proof",
    "href": "/999/",
    "mode": "static",
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
    "label": "Map",
    "href": "/map/",
    "mode": "static",
    "external": false
  },
  {
    "label": "PETRONAS",
    "href": "/propa/",
    "mode": "static",
    "external": false
  },
  {
    "label": "Politics",
    "href": "/politics/ns-election/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Signal",
    "href": "/connect/",
    "mode": "spa",
    "external": false
  },
  {
    "label": "Human",
    "href": "/human/map/",
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
    "label": "mcp",
    "href": "https://mcp.arif-fazil.com/mcp",
    "mode": "external",
    "external": true
  },
  {
    "label": "did",
    "href": "/.well-known/did.json",
    "mode": "spa",
    "external": false
  },
  {
    "label": "PyPI arifos",
    "href": "https://pypi.org/project/arifos/",
    "mode": "external",
    "external": true
  }
];

/** Trinity is DRAFT — do not render on public shell until status === LIVE */
export const trinityStatus = "DRAFT_FUTURE" as const;
