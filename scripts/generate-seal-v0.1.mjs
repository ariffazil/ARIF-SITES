#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const SITE_ROOT = join(REPO_ROOT, "sites/arif-fazil.com");
const PUBLIC_ROOT = join(SITE_ROOT, "public");
const DIST_ROOT = join(SITE_ROOT, "dist");
const GENERATED_AT = new Date().toISOString();
const DID = "did:web:arif-fazil.com";
const BASE = "https://arif-fazil.com";
const DID_URL = `${BASE}/.well-known/did.json`;
const MANIFEST_URL = `${BASE}/arifos/AGENTS.md`;
const SIGNATURE_URL = `${BASE}/arifos/AGENTS.md.sig`;
const RUNTIME_ENDPOINTS = {
  arifos_health: "https://mcp.arif-fazil.com/health",
  arifos_tools: "https://mcp.arif-fazil.com/tools",
  aaa_cockpit: "https://aaa.arif-fazil.com/",
  aaa_health: "https://aaa.arif-fazil.com/health",
  vault_surface: "https://arif-fazil.com/999",
};

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function writeArtifact(relativePath, value, { mirrorDist = true } = {}) {
  const payload = typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`;
  for (const root of mirrorDist ? [PUBLIC_ROOT, DIST_ROOT] : [PUBLIC_ROOT]) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, payload);
  }
}

function base58btcDecode(value) {
  if (!value?.startsWith("z")) return Buffer.alloc(0);
  let bytes = [0];
  for (const char of value.slice(1)) {
    const carryStart = BASE58_ALPHABET.indexOf(char);
    if (carryStart === -1) return Buffer.alloc(0);
    let carry = carryStart;
    for (let i = 0; i < bytes.length; i += 1) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const char of value.slice(1)) {
    if (char !== "1") break;
    bytes.push(0);
  }
  return Buffer.from(bytes.reverse());
}

function fingerprintMultikey(publicKeyMultibase) {
  const decoded = base58btcDecode(publicKeyMultibase);
  if (!decoded.length) return "PENDING";
  return `sha256:${sha256(decoded)}`;
}

async function fetchEvidence(url, accept = "*/*") {
  const started = new Date().toISOString();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { accept, "user-agent": "arifos-seal-generator/0.1" },
    });
    const bytes = Buffer.from(await response.arrayBuffer());
    return {
      url,
      fetched_at: started,
      status_code: response.status,
      ok: response.ok,
      final_url: response.url,
      content_type: response.headers.get("content-type") || null,
      sha256: sha256(bytes),
      bytes,
      text: bytes.toString("utf8"),
      classification: response.ok ? "VERIFIED" : "FAILED",
    };
  } catch (error) {
    return {
      url,
      fetched_at: started,
      status_code: null,
      ok: false,
      final_url: null,
      content_type: null,
      sha256: null,
      bytes: Buffer.alloc(0),
      text: "",
      error: error.message,
      classification: "FAILED",
    };
  }
}

function classifyEndpoint(evidence) {
  if (!evidence.ok) return "FAILED";
  if (evidence.final_url && evidence.final_url !== evidence.url) return "DECLARED";
  return "VERIFIED";
}

function parseJsonEvidence(evidence) {
  if (!evidence.ok) return null;
  try {
    return JSON.parse(evidence.text);
  } catch {
    return null;
  }
}

function htmlPage(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { max-width: 780px; margin: 48px auto; padding: 0 20px; font-family: system-ui, sans-serif; line-height: 1.55; color: #1f2933; }
    code, pre { background: #f3f4f6; padding: 2px 5px; border-radius: 4px; }
    .status { font-weight: 700; }
  </style>
</head>
<body>
${body}
</body>
</html>
`;
}

async function main() {
  const localManifest = Buffer.from(readFileSync("/root/AGENTS.md", "utf8").replace(/\r\n/g, "\n"), "utf8");
  writeArtifact("arifos/AGENTS.md", localManifest.toString("utf8"));

  const didEvidence = await fetchEvidence(DID_URL, "application/json");
  const didDocument = parseJsonEvidence(didEvidence);
  const didHash = didEvidence.sha256 || "FAILED";
  const verificationMethod = didDocument?.verificationMethod?.find(
    (method) => method.id === "did:web:arif-fazil.com#arif-fazil",
  );
  const serviceEndpoints = {};
  for (const service of didDocument?.service || []) {
    const endpoint = service.serviceEndpoint;
    const endpointEvidence = endpoint ? await fetchEvidence(endpoint) : null;
    serviceEndpoints[service.id] = {
      type: service.type || "DECLARED",
      serviceEndpoint: endpoint || null,
      proof: service.proof || null,
      status: endpointEvidence ? classifyEndpoint(endpointEvidence) : "DECLARED",
      status_code: endpointEvidence?.status_code || null,
      content_type: endpointEvidence?.content_type || null,
      hash_sha256: endpointEvidence?.sha256 || null,
      final_url: endpointEvidence?.final_url || null,
    };
  }

  const didStatus = {
    schema: "did-status/v0.1",
    generated_at: GENERATED_AT,
    did: DID,
    did_document_url: DID_URL,
    did_document_hash_sha256: didHash,
    id_check: didDocument?.id === DID ? "VERIFIED" : "FAILED",
    verification_method_id: verificationMethod?.id || "FAILED",
    public_key_fingerprint: fingerprintMultikey(verificationMethod?.publicKeyMultibase),
    service_endpoints: serviceEndpoints,
    field_classification: {
      "@context": didDocument?.["@context"] ? "VERIFIED" : "FAILED",
      id: didDocument?.id === DID ? "VERIFIED" : "FAILED",
      controller: didDocument?.controller ? "DECLARED" : "PENDING",
      verificationMethod: verificationMethod ? "VERIFIED" : "FAILED",
      authentication: didDocument?.authentication?.length ? "VERIFIED" : "FAILED",
      assertionMethod: didDocument?.assertionMethod?.length ? "VERIFIED" : "FAILED",
      service: didDocument?.service?.length ? "VERIFIED" : "FAILED",
      created: didDocument?.created ? "DECLARED" : "PENDING",
      updated: didDocument?.updated ? "DECLARED" : "PENDING",
      relinkMetadata: didDocument?.relinkMetadata ? "DECLARED" : "PENDING",
    },
    status: didEvidence.ok && didDocument?.id === DID && verificationMethod ? "VERIFIED" : "FAILED",
  };

  const manifestLive = await fetchEvidence(MANIFEST_URL, "text/markdown,text/plain,*/*");
  const signatureLive = await fetchEvidence(SIGNATURE_URL);
  const manifestHash = sha256(localManifest);
  const manifestStatus = {
    schema: "manifest-status/v0.1",
    generated_at: GENERATED_AT,
    did: DID,
    verification_method_id: verificationMethod?.id || "PENDING",
    agents_md_url: MANIFEST_URL,
    local_source: "/root/AGENTS.md",
    sha256_lf_normalized: manifestHash,
    live_sha256: manifestLive.sha256,
    live_content_type: manifestLive.content_type,
    live_status_code: manifestLive.status_code,
    live_payload_matches_local: manifestLive.sha256 === manifestHash ? "VERIFIED" : "FAILED",
    signature_file_url: SIGNATURE_URL,
    signature_file_status: signatureLive.ok ? "DECLARED" : "PENDING",
    signature_verification_result: "PENDING_OPERATOR_SIGNATURE",
    constitution_checks: {
      names_arifos_as_governance_kernel: /Constitutional AI governance kernel/.test(localManifest.toString("utf8")),
      names_aaa_as_cockpit_or_observability: /AAA|cockpit|observability/.test(localManifest.toString("utf8")),
      names_vault999_as_ledger_or_seal_layer: /VAULT999|ledger|seal/i.test(localManifest.toString("utf8")),
      names_arif_or_888_as_human_sovereign: /Arif|888_HOLD|Human veto|SOVEREIGN/i.test(localManifest.toString("utf8")),
      irreversible_actions_require_888_hold: /irreversible.*888_HOLD|888_HOLD.*irreversible/is.test(localManifest.toString("utf8")),
    },
    status:
      manifestLive.sha256 === manifestHash && signatureLive.ok
        ? "PENDING"
        : manifestLive.sha256 === manifestHash
          ? "PENDING"
          : "FAILED",
  };

  const runtimeResponses = {};
  for (const [name, url] of Object.entries(RUNTIME_ENDPOINTS)) {
    const evidence = await fetchEvidence(url, "application/json,text/html,*/*");
    let bodySummary = null;
    const parsed = parseJsonEvidence(evidence);
    if (parsed) {
      bodySummary = parsed;
    } else if (evidence.text) {
      bodySummary = evidence.text.slice(0, 400);
    }
    runtimeResponses[name] = {
      url,
      status_code: evidence.status_code,
      ok: evidence.ok,
      final_url: evidence.final_url,
      content_type: evidence.content_type,
      response_sha256: evidence.sha256,
      classification: classifyEndpoint(evidence),
      body_summary: bodySummary,
    };
  }

  const toolsBody = runtimeResponses.arifos_tools.body_summary;
  const healthBody = runtimeResponses.arifos_health.body_summary;
  const toolsCount = Array.isArray(toolsBody?.tools)
    ? toolsBody.tools.length
    : Number(healthBody?.tools_loaded || healthBody?.tools_count || 0) || null;
  const holdsCount = Number(healthBody?.holds_count || healthBody?.open_holds || 0);
  const sealsCount = Number(healthBody?.seals_count || healthBody?.vault_seals_count || 0);
  const runtimeSnapshot = {
    schema: "runtime-snapshot/v0.1",
    generated_at: GENERATED_AT,
    endpoints: runtimeResponses,
    observed_counts: {
      tools_count: toolsCount,
      holds_count: Number.isFinite(holdsCount) ? holdsCount : null,
      seals_count: Number.isFinite(sealsCount) ? sealsCount : null,
    },
    limitations: [
      "Runtime attestation is based only on public endpoint responses.",
      "AAA cockpit is observed as a cockpit/telemetry surface, not an authority surface.",
      "VAULT999 is treated as evidence storage, not an oracle.",
    ],
  };
  const runtimeSnapshotHash = sha256(canonicalJson(runtimeSnapshot));
  const runtimeStatus = {
    schema: "runtime-status/v0.1",
    generated_at: GENERATED_AT,
    arifos_health_endpoint: RUNTIME_ENDPOINTS.arifos_health,
    aaa_cockpit_endpoint: RUNTIME_ENDPOINTS.aaa_cockpit,
    tools_count: toolsCount,
    holds_count: runtimeSnapshot.observed_counts.holds_count,
    seals_count: runtimeSnapshot.observed_counts.seals_count,
    timestamp: GENERATED_AT,
    runtime_snapshot_hash_sha256: runtimeSnapshotHash,
    endpoint_statuses: Object.fromEntries(
      Object.entries(runtimeResponses).map(([name, evidence]) => [name, evidence.classification]),
    ),
    status: Object.values(runtimeResponses).every((evidence) => evidence.ok) ? "VERIFIED" : "PARTIAL",
  };

  const proofSurfaces = {
    human: `${BASE}/proof/human`,
    authorship: `${BASE}/proof/authorship`,
    runtime: `${BASE}/proof/runtime`,
    index: `${BASE}/proof/index.json`,
  };
  const vaultSealUnsigned = {
    seal_id: "arifos-v0.1-2026-05-02",
    seal_version: "0.1",
    created_at: GENERATED_AT,
    did: DID,
    domain: "arif-fazil.com",
    operator_name: "Muhammad Arif bin Fazil",
    operator_role: "Human sovereign / final judge",
    constitution_manifest_url: MANIFEST_URL,
    constitution_manifest_sha256: manifestHash,
    did_document_sha256: didHash,
    runtime_snapshot_sha256: runtimeSnapshotHash,
    proof_surfaces: proofSurfaces,
    previous_seal_hash: null,
    evidence: {
      did_status: `${BASE}/999/did-status.json`,
      manifest_status: `${BASE}/999/manifest-status.json`,
      runtime_status: `${BASE}/999/runtime-status.json`,
      runtime_snapshot: `${BASE}/999/runtime-snapshot.json`,
    },
    verdict: manifestStatus.status === "FAILED" ? "FAIL" : "PARTIAL",
    human_witness: {
      required: true,
      status: "PENDING",
      statement: "Arif must approve publication and produce signatures from an operator-controlled signing environment.",
    },
    limitations: [
      "No ZK, VC, biometric, government ID, or third-party KYC proof is implemented.",
      "Manifest signature is pending operator-controlled signing.",
      "This seal records evidence and status; it does not prove metaphysical or legal identity.",
    ],
    signature: {
      status: "PENDING",
      verification_method: verificationMethod?.id || "PENDING",
      signature_url: `${BASE}/999/vault999-seal-v0.1.json.sig`,
    },
    status: manifestStatus.status === "FAILED" ? "FAIL" : "PARTIAL",
  };
  const sealSelfHash = sha256(canonicalJson(vaultSealUnsigned));
  const vaultSeal = { ...vaultSealUnsigned, seal_self_hash_sha256: sealSelfHash };

  const proofIndex = {
    schema: "proof-index/v0.1",
    generated_at: GENERATED_AT,
    did: DID,
    proofs: {
      human: {
        url: proofSurfaces.human,
        json: `${BASE}/proof/human.json`,
        status: "DECLARED",
        zk_vc_status: "not_implemented",
      },
      authorship: {
        url: proofSurfaces.authorship,
        json: `${BASE}/proof/authorship.json`,
        status: manifestStatus.status,
        zk_vc_status: "not_implemented",
      },
      runtime: {
        url: proofSurfaces.runtime,
        json: `${BASE}/proof/runtime.json`,
        status: runtimeStatus.status,
        zk_vc_status: "not_implemented",
      },
    },
  };

  const rootKey = {
    key_id: "did-web-arif-fazil-com-arif-fazil",
    algorithm: "Ed25519",
    type: "Multikey",
    public_key_multibase: verificationMethod?.publicKeyMultibase || "PENDING",
    public_key_fingerprint: fingerprintMultikey(verificationMethod?.publicKeyMultibase),
    verification_method: verificationMethod?.id || "PENDING",
    usage: ["assertionMethod", "authentication"],
    issued_at: didDocument?.updated || GENERATED_AT,
    rotation_policy:
      "Manual 888_HOLD required before publishing a new DID public key or replacing this root key.",
    issuer: DID,
    private_key_status: "not_published_not_requested",
    note:
      "This file publishes only public verification metadata. Private keys must remain in Arif/operator-controlled signing environment.",
  };

  const proofJson = {
    human: {
      claim: "The arif-fazil.com operator declares continuity with Muhammad Arif bin Fazil and did:web:arif-fazil.com.",
      evidence: ["Domain-hosted DID document", "Public proof and vault endpoints under the same domain"],
      verification_method: DID_URL,
      limitations: [
        "No government ID, biometric, ZK, VC, or third-party KYC proof is implemented.",
        "This is domain/DID/operator continuity evidence only.",
      ],
      status: "DECLARED",
      zk_vc_status: "not_implemented",
    },
    authorship: {
      claim: "The published AGENTS.md is the constitution manifest intended for v0.1 sealing.",
      evidence: {
        manifest_url: MANIFEST_URL,
        manifest_sha256: manifestHash,
        signature_url: SIGNATURE_URL,
        signature_status: manifestStatus.signature_verification_result,
      },
      verification_method: "Compare SHA256 and verify signature after Arif signs with the DID key.",
      limitations: ["Signature is pending operator-controlled signing."],
      status: manifestStatus.status,
      zk_vc_status: "not_implemented",
    },
    runtime: {
      claim: "Public arifOS/AAA runtime endpoints were observed at seal-generation time.",
      evidence: {
        runtime_status: `${BASE}/999/runtime-status.json`,
        runtime_snapshot: `${BASE}/999/runtime-snapshot.json`,
        runtime_snapshot_sha256: runtimeSnapshotHash,
      },
      verification_method: "Fetch runtime-status.json and runtime-snapshot.json; compare hashes and endpoint observations.",
      limitations: ["Public endpoint observation only; does not prove hidden internal state."],
      status: runtimeStatus.status,
      zk_vc_status: "not_implemented",
    },
  };

  const vaultSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "VAULT999 v0.1 seal",
    type: "object",
    required: [
      "seal_id",
      "seal_version",
      "created_at",
      "did",
      "domain",
      "operator_name",
      "operator_role",
      "constitution_manifest_url",
      "constitution_manifest_sha256",
      "did_document_sha256",
      "runtime_snapshot_sha256",
      "proof_surfaces",
      "previous_seal_hash",
      "evidence",
      "verdict",
      "human_witness",
      "limitations",
      "signature",
      "status",
    ],
    properties: {
      verdict: { enum: ["PASS", "PARTIAL", "HOLD", "FAIL"] },
      status: { enum: ["PASS", "PARTIAL", "HOLD", "FAIL"] },
    },
  };

  const holdList = `# 888 HOLD List - verify-arifos v0.1

Generated: ${GENERATED_AT}

| Action | Risk | Evidence | Recommended status | Exact command or file to approve | Arif approval |
|---|---|---|---|---|---|
| Publish updated DID document | Public identity statement | \`sites/arif-fazil.com/public/.well-known/did.json\` | APPROVE if fields match live intent | deploy static site after review | [ ] Approved by Arif |
| Publish real AGENTS.md | Public constitution manifest | \`sites/arif-fazil.com/public/arifos/AGENTS.md\` | APPROVE | deploy static site after review | [ ] Approved by Arif |
| Sign AGENTS.md | Uses operator key | \`sites/arif-fazil.com/public/arifos/AGENTS.md\` | HOLD until signed only by Arif-controlled environment | see \`manual-signing-commands.md\` | [ ] Approved by Arif |
| Publish VAULT999 v0.1 seal | Irreversible public seal statement | \`sites/arif-fazil.com/public/999/vault999-seal-v0.1.json\` | HOLD until Arif reviews PARTIAL status | deploy static site after review | [ ] Approved by Arif |
| Claim human verification | High overclaim risk | \`proof/human\` says DECLARED only | REJECT if phrased as VERIFIED | none | [ ] Approved by Arif |
| Claim ZK/VC/ZKPC readiness | Not implemented | proof index says \`not_implemented\` | REJECT | none | [ ] Approved by Arif |
| Key rotation or revocation | Can break existing verifier trust | no rotation event requested | HOLD | create explicit rotation packet first | [ ] Approved by Arif |
`;

  const redTeam = `# arifOS Seal Red-Team Report - v0.1

Generated: ${GENERATED_AT}

| Finding | Severity | Evidence | Fix | Required before public 999 seal |
|---|---|---|---|---|
| Manifest signature pending | HIGH | \`manifest-status.json\` marks \`PENDING_OPERATOR_SIGNATURE\` | Arif signs AGENTS.md in operator-controlled environment | yes |
| Seal signature pending | HIGH | \`vault999-seal-v0.1.json.signature.status=PENDING\` | Arif signs seal JSON after review | yes |
| Human proof overclaim risk | HIGH | /proof/human can only prove domain/DID continuity | Keep status DECLARED; do not claim government ID, biometric, ZK, VC, or KYC | yes |
| Runtime snapshot is time-bound | MEDIUM | Public endpoint observations can change | Include timestamp and snapshot hash; rerun verifier for fresh state | no |
| Previous seal hash is null | MEDIUM | v0.1 is genesis | Future seals must chain to this seal hash | no |
| Revocation path not formalized | MEDIUM | DID doc has no revocation service | Add revocation policy in v0.2 | no |
| Key rotation policy incomplete | MEDIUM | root key metadata may be stale | Publish key rotation policy before changing DID key | no |
| VAULT999 oracle confusion | LOW | Public language can overclaim | Keep wording: flight recorder, evidence layer, not oracle | yes |
`;

  const didStatusMd = `# DID Status - verify-arifos v0.1

Generated: ${GENERATED_AT}

- DID: ${DID}
- DID document URL: ${DID_URL}
- DID document SHA256: ${didHash}
- Verification method: ${verificationMethod?.id || "FAILED"}
- Public key fingerprint: ${fingerprintMultikey(verificationMethod?.publicKeyMultibase)}
- Status: ${didStatus.status}

This report verifies domain-hosted DID resolution only. It does not prove government ID, biometric identity, ZK, VC, or third-party KYC.
`;

  const runtimeAttestation = `# Runtime Attestation - verify-arifos v0.1

Generated: ${GENERATED_AT}

- arifOS health: ${RUNTIME_ENDPOINTS.arifos_health}
- AAA cockpit: ${RUNTIME_ENDPOINTS.aaa_cockpit}
- Tools count: ${toolsCount ?? "unknown"}
- Holds count: ${runtimeSnapshot.observed_counts.holds_count ?? "unknown"}
- Seals count: ${runtimeSnapshot.observed_counts.seals_count ?? "unknown"}
- Runtime snapshot SHA256: ${runtimeSnapshotHash}
- Status: ${runtimeStatus.status}

This is public endpoint observation only. AAA is cockpit/observability, not authority. arifOS remains the governance chokepoint.
`;

  const humanReadable = `# VAULT999 Seal v0.1

Status: PARTIAL

This seal records the current arifOS v0.1 public evidence spine:

- DID: ${DID}
- DID document SHA256: ${didHash}
- Constitution manifest: ${MANIFEST_URL}
- Constitution manifest SHA256: ${manifestHash}
- Runtime snapshot SHA256: ${runtimeSnapshotHash}
- Seal self hash: ${sealSelfHash}

Limitations:

- No ZK, VC, biometric, government ID, or third-party KYC proof is implemented.
- Manifest and seal signatures are pending Arif/operator-controlled signing.
- Runtime proof is public endpoint observation only.
- VAULT999 records evidence; it is not an oracle.

Verdict: PARTIAL until signatures and human witness are complete.
`;

  const manualSigning = `# Manual Signing Commands - verify-arifos v0.1

Do not run these unless you are Arif in the operator-controlled signing environment.

SSH signature flow using the DID Ed25519 key:

\`\`\`bash
cd /root/ARIF-SITES/sites/arif-fazil.com/public
ssh-keygen -Y sign -f /path/to/operator_did_ed25519 -n arifos-constitution arifos/AGENTS.md
mv arifos/AGENTS.md.sig arifos/AGENTS.md.sig

ssh-keygen -Y sign -f /path/to/operator_did_ed25519 -n arifos-vault999 999/vault999-seal-v0.1.json
mv 999/vault999-seal-v0.1.json.sig 999/vault999-seal-v0.1.json.sig
\`\`\`

After signing:

\`\`\`bash
cd /root/ARIF-SITES
node scripts/verify-arifos.mjs
\`\`\`
`;

  const signingPacket = {
    schema: "manifest-signing-packet/v0.1",
    generated_at: GENERATED_AT,
    file_path: "sites/arif-fazil.com/public/arifos/AGENTS.md",
    hash_sha256: manifestHash,
    did: DID,
    verification_method_id: verificationMethod?.id || "PENDING",
    namespace: "arifos-constitution",
    status: "PENDING_OPERATOR_SIGNATURE",
  };

  writeArtifact("999/did-status.json", didStatus);
  writeArtifact("999/did-status.md", didStatusMd);
  writeArtifact("999/manifest-status.json", manifestStatus);
  writeArtifact("999/runtime-status.json", runtimeStatus);
  writeArtifact("999/runtime-snapshot.json", runtimeSnapshot);
  writeArtifact("999/runtime-snapshot.sha256", `${runtimeSnapshotHash}  runtime-snapshot.json\n`);
  writeArtifact("999/runtime-attestation.md", runtimeAttestation);
  writeArtifact("999/vault999.schema.json", vaultSchema);
  writeArtifact("999/vault999-seal-v0.1.json", vaultSeal);
  writeArtifact("999/vault999-seal-v0.1.sha256", `${sealSelfHash}  vault999-seal-v0.1.json\n`);
  writeArtifact("999/vault999-human-readable.md", humanReadable);
  writeArtifact("999/manifest-signing-packet.json", signingPacket);
  writeArtifact("999/AGENTS.md.sha256", `${manifestHash}  AGENTS.md\n`);
  writeArtifact("999/AGENTS.md.sig.pending.md", "Signature pending operator-controlled signing.\n");
  writeArtifact("999/manual-signing-commands.md", manualSigning);
  writeArtifact("999/888-hold-list.md", holdList);
  writeArtifact("999/red-team-report.md", redTeam);
  writeArtifact("999/rootkey.json", rootKey);

  writeArtifact("proof/index.json", proofIndex);
  for (const [name, proof] of Object.entries(proofJson)) {
    const proofHtml = htmlPage(
      `arifOS proof/${name}`,
      `<h1>proof/${name}</h1>
<p class="status">Status: ${proof.status}</p>
<h2>Claim</h2>
<p>${proof.claim}</p>
<h2>Verification method</h2>
<p>${proof.verification_method}</p>
<h2>Machine-readable JSON</h2>
<p><a href="/proof/${name}.json">/proof/${name}.json</a></p>
<h2>Limitations</h2>
<ul>${proof.limitations.map((item) => `<li>${item}</li>`).join("")}</ul>
<p><strong>This is not yet a ZK/VC human credential system unless explicitly marked VERIFIED.</strong></p>`,
    );
    writeArtifact(`proof/${name}.json`, proof);
    writeArtifact(
      `proof/${name}.md`,
      `# proof/${name}

Status: ${proof.status}

## Claim

${proof.claim}

## Verification Method

${proof.verification_method}

## Machine-Readable JSON

https://arif-fazil.com/proof/${name}.json

## Limitations

${proof.limitations.map((item) => `- ${item}`).join("\n")}

This is not yet a ZK/VC human credential system unless explicitly marked VERIFIED.
`,
    );
    writeArtifact(`proof/${name}/index.html`, proofHtml);
  }

  console.log(
    JSON.stringify(
      {
        generated_at: GENERATED_AT,
        did_status: didStatus.status,
        manifest_status: manifestStatus.status,
        runtime_status: runtimeStatus.status,
        seal_status: vaultSeal.status,
        manifest_hash: manifestHash,
        runtime_snapshot_hash: runtimeSnapshotHash,
        seal_self_hash: sealSelfHash,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
