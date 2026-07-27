// Cloudflare Pages Function: /api/observatory
// Public mirror of the arifOS Observatory snapshot for the institution surface
// on arif-fazil.com. Reads live federation probe when available; falls back to
// a curated static snapshot. Per F2 TRUTH: never green-wash — if the live probe
// is unreachable, return a DEGRADED state with the reason.

const FALLBACK_SNAPSHOT = {
  snapshot_id: "observatory-static-2026-07-27",
  observed_at: "2026-07-27T00:00:00Z",
  probe_version: "observatory.v1",
  sovereign: "ARIF",
  domain: "arif-fazil.com",
  floors_published: 13,
  source_of_truth: {
    federation_probe: "https://arif-fazil.com/api/federation-probe",
    observatory_live: "https://arifos.arif-fazil.com/api/observatory/v1/snapshot",
    constitution: "https://arif-fazil.com/constitution/",
    charter: "https://arif-fazil.com/charter/",
    governance: "https://arif-fazil.com/governance/",
    audit: "https://arif-fazil.com/audit/",
    seal_chamber: "https://arif-fazil.com/999/",
  },
  identity: {
    did: "did:web:arif-fazil.com",
    did_document: "https://arif-fazil.com/.well-known/did.json",
    did_configuration: "https://arif-fazil.com/.well-known/did-configuration.json",
  },
  capability: {
    constitutional_floors: 13,
    canonical_tools: ["arif_init", "arif_observe", "arif_think", "arif_route", "arif_memory", "arif_judge", "arif_forge", "arif_seal"],
    mcp_endpoint: "https://mcp.arif-fazil.com/mcp",
    webmcp_tools_inline: 4,
  },
  organs: [
    { id: "arifos", role: "constitutional governance kernel", url: "https://arifos.arif-fazil.com", port: 8088 },
    { id: "aaa", role: "control plane + A2A gateway", url: "https://aaa.arif-fazil.com", port: 3001 },
    { id: "aforge", role: "governed execution shell", url: "https://forge.arif-fazil.com", port: 7071 },
    { id: "geox", role: "earth intelligence", url: "https://geox.arif-fazil.com", port: 8081 },
    { id: "wealth", role: "capital intelligence", url: "https://wealth.arif-fazil.com", port: 18082 },
    { id: "well", role: "human readiness", url: "https://well.arif-fazil.com", port: 18083 },
  ],
  notes: [
    "This snapshot is a curated institution-facing mirror.",
    "For live runtime state, query /api/federation-probe directly.",
    "All receipts in /999/ are hash-chained and immutable.",
  ],
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Only GET
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Try live federation probe; never block the static fallback
  let liveProbe = null;
  let liveProbeOk = false;
  try {
    const probeOrigin = url.origin;
    const probeRes = await fetch(probeOrigin + "/api/federation-probe", {
      headers: { accept: "application/json" },
    });
    if (probeRes.ok) {
      liveProbe = await probeRes.json();
      liveProbeOk = true;
    }
  } catch (e) {
    // probe unreachable — fall through to fallback
  }

  const body = {
    ...FALLBACK_SNAPSHOT,
    snapshot_id: liveProbeOk
      ? "observatory-live-" + new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)
      : FALLBACK_SNAPSHOT.snapshot_id,
    observed_at: liveProbeOk && liveProbe && liveProbe.observed_at
      ? liveProbe.observed_at
      : FALLBACK_SNAPSHOT.observed_at,
    live_probe_status: liveProbeOk ? "REACHABLE" : "UNREACHABLE",
    live_probe: liveProbeOk ? {
      snapshot_id: liveProbe.snapshot_id,
      observed_at: liveProbe.observed_at,
      probe_version: liveProbe.probe_version,
      nodes_count: Array.isArray(liveProbe.nodes) ? liveProbe.nodes.length : 0,
      degraded: Array.isArray(liveProbe.nodes)
        ? liveProbe.nodes
            .filter((n) => n && n.overall && n.overall.state !== "READY")
            .map((n) => ({ id: n.id, state: n.overall.state, reasons: n.overall.reasons || [] }))
        : [],
    } : null,
    constitutional_floor: "F11",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      "X-Observatory-Surface": "arif-fazil.com/institution",
      "Access-Control-Allow-Origin": "*",
    },
  });
}