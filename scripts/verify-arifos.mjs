#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DID = "did:web:arif-fazil.com";
const BASE = "https://arif-fazil.com";
const DID_URL = `${BASE}/.well-known/did.json`;
const RUNTIME_STATUS_URL = `${BASE}/999/runtime-status.json`;
const RUNTIME_SNAPSHOT_URL = `${BASE}/999/runtime-snapshot.json`;
const SEAL_URL = `${BASE}/999/vault999-seal-v0.1.json`;

const REQUIRED_SERVICES = new Map([
  ["did:web:arif-fazil.com#constitution", "https://arif-fazil.com/arifos/AGENTS.md"],
  ["did:web:arif-fazil.com#proof-human", "https://arif-fazil.com/proof/human"],
  ["did:web:arif-fazil.com#proof-authorship", "https://arif-fazil.com/proof/authorship"],
  ["did:web:arif-fazil.com#proof-runtime", "https://arif-fazil.com/proof/runtime"],
  ["did:web:arif-fazil.com#vault", "https://arif-fazil.com/999"],
]);

const SIGNED_ARTIFACTS = [
  {
    label: "constitution manifest",
    payloadUrl: `${BASE}/arifos/AGENTS.md`,
    signatureUrl: `${BASE}/arifos/AGENTS.md.sig`,
    namespace: "arifos-constitution",
    expectedContentTypes: ["text/markdown", "text/plain", "application/octet-stream"],
    required: true,
  },
  {
    label: "geologist credential",
    payloadUrl: `${BASE}/proof/geologist-credential.json`,
    signatureUrl: `${BASE}/proof/geologist-credential.json.sig`,
    namespace: "arifos-credential",
    expectedContentTypes: ["application/json"],
    required: false,
  },
];

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

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function base58btcDecode(value) {
  if (!value.startsWith("z")) {
    throw new Error(`expected multibase base58btc value starting with z, got ${value}`);
  }

  let bytes = [0];
  for (const char of value.slice(1)) {
    const carryStart = BASE58_ALPHABET.indexOf(char);
    if (carryStart === -1) {
      throw new Error(`invalid base58btc character ${char}`);
    }

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

function sshString(buffer) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(buffer.length, 0);
  return Buffer.concat([length, buffer]);
}

function readSshString(buffer, offset) {
  if (offset + 4 > buffer.length) {
    throw new Error("truncated SSH string length");
  }
  const length = buffer.readUInt32BE(offset);
  const start = offset + 4;
  const end = start + length;
  if (end > buffer.length) {
    throw new Error("truncated SSH string body");
  }
  return { value: buffer.subarray(start, end), offset: end };
}

function sshBlobToAuthorizedKey(blob) {
  const keyType = readSshString(blob, 0);
  return `${keyType.value.toString("utf8")} ${blob.toString("base64")}`;
}

function parseSshSignaturePublicKey(signature) {
  const armor = signature
    .toString("utf8")
    .replace("-----BEGIN SSH SIGNATURE-----", "")
    .replace("-----END SSH SIGNATURE-----", "")
    .replace(/\s+/g, "");
  const decoded = Buffer.from(armor, "base64");
  let cursor = 0;

  const magic = decoded.subarray(cursor, cursor + 6).toString("utf8");
  cursor += 6;
  if (magic !== "SSHSIG") {
    throw new Error(`unexpected SSH signature magic ${magic}`);
  }

  cursor += 4; // version
  const publicKey = readSshString(decoded, cursor);
  return sshBlobToAuthorizedKey(publicKey.value);
}

function didMultikeyToAuthorizedKey(publicKeyMultibase) {
  const decoded = base58btcDecode(publicKeyMultibase);
  const rawKey =
    decoded.length === 34 && decoded[0] === 0xed && decoded[1] === 0x01
      ? decoded.subarray(2)
      : decoded;

  if (rawKey.length !== 32) {
    throw new Error(`expected 32 byte Ed25519 public key, got ${rawKey.length}`);
  }

  const keyType = Buffer.from("ssh-ed25519", "utf8");
  const sshBlob = Buffer.concat([sshString(keyType), sshString(rawKey)]);
  return `ssh-ed25519 ${sshBlob.toString("base64")}`;
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "verify-arifos/0.1",
      accept: "*/*",
    },
  });

  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    url,
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    bytes,
    text: bytes.toString("utf8"),
  };
}

function result(results, status, label, detail) {
  results.push({ status, label, detail });
  const marker = status === "PASS" ? "PASS" : status === "WARN" ? "WARN" : "FAIL";
  console.log(`${marker} ${label}${detail ? ` - ${detail}` : ""}`);
}

function artifactResult(results, artifact, status, label, detail) {
  result(results, artifact.required === false && status === "FAIL" ? "WARN" : status, label, detail);
}

function verifySshSignature({ payload, signature, namespace, authorizedKey }) {
  const workdir = mkdtempSync(join(tmpdir(), "verify-arifos-"));
  try {
    const allowedSigners = join(workdir, "allowed_signers");
    const signatureFile = join(workdir, "artifact.sig");
    writeFileSync(allowedSigners, `${DID} ${authorizedKey}\n`);
    writeFileSync(signatureFile, signature);

    const verification = spawnSync(
      "ssh-keygen",
      ["-Y", "verify", "-f", allowedSigners, "-I", DID, "-n", namespace, "-s", signatureFile],
      { input: payload, encoding: "utf8" },
    );

    return {
      ok: verification.status === 0,
      stdout: verification.stdout.trim(),
      stderr: verification.stderr.trim(),
    };
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}

function parseJsonOrNull(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function main() {
  const results = [];
  const did = argValue("--did", DID);
  const manifestUrl = argValue("--manifest", `${BASE}/arifos/AGENTS.md`);
  const sealUrl = argValue("--seal", SEAL_URL);
  const runtimeStatusUrl = argValue("--runtime-status", RUNTIME_STATUS_URL);
  const runtimeSnapshotUrl = argValue("--runtime-snapshot", RUNTIME_SNAPSHOT_URL);

  if (did !== DID) {
    result(results, "FAIL", "DID argument", `only ${DID} is supported by v0.1, got ${did}`);
  }

  const didResponse = await fetchBytes(DID_URL);
  if (!didResponse.ok) {
    result(results, "FAIL", "DID resolves", `${DID_URL} returned ${didResponse.status}`);
    process.exit(1);
  }

  result(results, "PASS", "DID resolves", `${DID_URL} returned ${didResponse.status}`);
  const didHash = sha256(didResponse.bytes);
  const didDocument = JSON.parse(didResponse.text);

  if (didDocument.id === DID) {
    result(results, "PASS", "DID id matches", didDocument.id);
  } else {
    result(results, "FAIL", "DID id matches", `expected ${DID}, got ${didDocument.id}`);
  }

  const services = new Map((didDocument.service || []).map((service) => [service.id, service]));
  for (const [id, endpoint] of REQUIRED_SERVICES) {
    const service = services.get(id);
    if (!service) {
      result(results, "FAIL", `service ${id}`, "missing");
    } else if (service.serviceEndpoint !== endpoint) {
      result(results, "FAIL", `service ${id}`, `expected ${endpoint}, got ${service.serviceEndpoint}`);
    } else {
      result(results, "PASS", `service ${id}`, endpoint);
    }
  }

  const verificationMethod = (didDocument.verificationMethod || []).find(
    (method) => method.id === "did:web:arif-fazil.com#arif-fazil",
  );
  if (!verificationMethod?.publicKeyMultibase) {
    result(results, "FAIL", "verification method", "missing publicKeyMultibase");
  } else {
    result(results, "PASS", "verification method", verificationMethod.id);
  }

  let authorizedKey;
  let manifestHash = "not_present";
  try {
    authorizedKey = didMultikeyToAuthorizedKey(verificationMethod.publicKeyMultibase);
    result(results, "PASS", "DID key converts to SSH Ed25519", authorizedKey);
  } catch (error) {
    result(results, "FAIL", "DID key converts to SSH Ed25519", error.message);
  }

  if (authorizedKey) {
    for (const artifact of SIGNED_ARTIFACTS) {
      const checkedArtifact =
        artifact.label === "constitution manifest" ? { ...artifact, payloadUrl: manifestUrl } : artifact;
      const [payload, signature] = await Promise.all([
        fetchBytes(checkedArtifact.payloadUrl),
        fetchBytes(checkedArtifact.signatureUrl),
      ]);

      if (!payload.ok) {
        artifactResult(
          results,
          artifact,
          "FAIL",
          `${artifact.label} payload resolves`,
          `${checkedArtifact.payloadUrl} returned ${payload.status}`,
        );
        continue;
      }
      result(results, "PASS", `${artifact.label} payload resolves`, `${payload.status}`);
      if (artifact.label === "constitution manifest") {
        manifestHash = sha256(payload.bytes);
      }

      if (!signature.ok) {
        artifactResult(
          results,
          artifact,
          "FAIL",
          `${artifact.label} signature resolves`,
          `${artifact.signatureUrl} returned ${signature.status}`,
        );
        continue;
      }
      result(results, "PASS", `${artifact.label} signature resolves`, `${signature.status}`);

      let signerKey = "";
      try {
        signerKey = parseSshSignaturePublicKey(signature.bytes);
        if (signerKey === authorizedKey) {
          result(results, "PASS", `${artifact.label} signer key matches DID`, signerKey);
        } else {
          artifactResult(results, artifact, "FAIL", `${artifact.label} signer key matches DID`, `signature key is ${signerKey}`);
        }
      } catch (error) {
        artifactResult(results, artifact, "FAIL", `${artifact.label} signer key parses`, error.message);
      }

      const contentType = payload.contentType.split(";")[0].trim().toLowerCase();
      if (artifact.expectedContentTypes.includes(contentType)) {
        result(results, "PASS", `${artifact.label} content type`, contentType);
      } else {
        artifactResult(
          results,
          artifact,
          "FAIL",
          `${artifact.label} content type`,
          `expected ${artifact.expectedContentTypes.join(" or ")}, got ${payload.contentType || "none"}`,
        );
      }

      const verification = verifySshSignature({
        payload: payload.bytes,
        signature: signature.bytes,
        namespace: checkedArtifact.namespace,
        authorizedKey,
      });

      if (verification.ok) {
        result(results, "PASS", `${artifact.label} SSH signature`, verification.stderr || verification.stdout);
      } else {
        artifactResult(
          results,
          artifact,
          "FAIL",
          `${artifact.label} SSH signature`,
          verification.stderr || verification.stdout || "ssh-keygen rejected signature",
        );
      }
    }
  }

  const [runtimeStatusResponse, runtimeSnapshotResponse, sealResponse] = await Promise.all([
    fetchBytes(runtimeStatusUrl),
    fetchBytes(runtimeSnapshotUrl),
    fetchBytes(sealUrl),
  ]);

  let runtimeHash = "not_present";
  if (runtimeStatusResponse.ok) {
    result(results, "PASS", "runtime-status resolves", runtimeStatusUrl);
    const runtimeStatus = parseJsonOrNull(runtimeStatusResponse.text);
    if (!runtimeStatus) {
      result(results, "FAIL", "runtime-status JSON parses", runtimeStatusResponse.contentType || "unknown content type");
    }
    runtimeHash = runtimeStatus?.runtime_snapshot_hash_sha256 || "missing";
    if (!runtimeSnapshotResponse.ok) {
      result(results, "FAIL", "runtime-snapshot resolves", `${runtimeSnapshotUrl} returned ${runtimeSnapshotResponse.status}`);
    } else {
      const runtimeSnapshot = parseJsonOrNull(runtimeSnapshotResponse.text);
      if (!runtimeSnapshot) {
        result(results, "FAIL", "runtime-snapshot JSON parses", runtimeSnapshotResponse.contentType || "unknown content type");
      } else {
        const computedRuntimeHash = sha256(canonicalJson(runtimeSnapshot));
        if (computedRuntimeHash === runtimeHash) {
          result(results, "PASS", "runtime snapshot hash", runtimeHash);
        } else {
          result(
            results,
            "FAIL",
            "runtime snapshot hash",
            `expected ${runtimeHash}, computed ${computedRuntimeHash}`,
          );
        }
      }
    }
  } else {
    result(results, "FAIL", "runtime-status resolves", `${runtimeStatusUrl} returned ${runtimeStatusResponse.status}`);
  }

  let sealHash = "not_present";
  let sealSignatureValid = "not_present";
  let humanWitness = "absent";
  let sealStatus = "FAIL";
  if (sealResponse.ok) {
    result(results, "PASS", "VAULT999 seal resolves", sealUrl);
    const seal = parseJsonOrNull(sealResponse.text);
    if (!seal) {
      result(results, "FAIL", "VAULT999 seal JSON parses", sealResponse.contentType || "unknown content type");
    }
    if (!seal) {
      const failures = results.filter((entry) => entry.status === "FAIL").length;
      const warnings = results.filter((entry) => entry.status === "WARN").length;
      console.log(`\nverify-arifos summary: ${results.length - failures - warnings} passed, ${warnings} warnings, ${failures} failed`);
      process.exit(1);
    }
    const declaredSealHash = seal.seal_self_hash_sha256;
    const unsignedSeal = { ...seal };
    delete unsignedSeal.seal_self_hash_sha256;
    sealHash = sha256(canonicalJson(unsignedSeal));
    humanWitness = seal.human_witness?.status === "PENDING" ? "pending" : seal.human_witness ? "present" : "absent";
    sealStatus = seal.status || seal.verdict || "FAIL";

    if (declaredSealHash === sealHash) {
      result(results, "PASS", "VAULT999 seal self hash", sealHash);
    } else {
      result(results, "FAIL", "VAULT999 seal self hash", `expected ${declaredSealHash}, computed ${sealHash}`);
    }

    if (seal.did === DID && seal.did_document_sha256 === didHash) {
      result(results, "PASS", "seal DID binding", seal.did);
    } else {
      result(
        results,
        "FAIL",
        "seal DID binding",
        `did=${seal.did}, did_document_sha256=${seal.did_document_sha256}, live=${didHash}`,
      );
    }

    if (seal.runtime_snapshot_sha256 === runtimeHash) {
      result(results, "PASS", "seal runtime binding", runtimeHash);
    } else {
      result(results, "FAIL", "seal runtime binding", `seal=${seal.runtime_snapshot_sha256}, runtime=${runtimeHash}`);
    }

    const sealSignatureUrl = `${sealUrl}.sig`;
    const sealSignature = await fetchBytes(sealSignatureUrl);
    if (!sealSignature.ok) {
      result(results, "WARN", "seal signature", "not_present");
    } else {
      let signerKey = "";
      try {
        signerKey = parseSshSignaturePublicKey(sealSignature.bytes);
        if (signerKey === authorizedKey) {
          result(results, "PASS", "seal signer key matches DID", signerKey);
        } else {
          result(results, "FAIL", "seal signer key matches DID", `signature key is ${signerKey}`);
        }
      } catch (error) {
        result(results, "FAIL", "seal signer key parses", error.message);
      }

      const verification = verifySshSignature({
        payload: sealResponse.bytes,
        signature: sealSignature.bytes,
        namespace: "arifos-vault999",
        authorizedKey,
      });
      if (verification.ok) {
        sealSignatureValid = "yes";
        result(results, "PASS", "seal SSH signature", verification.stderr || verification.stdout);
      } else {
        sealSignatureValid = "no";
        result(results, "FAIL", "seal SSH signature", verification.stderr || verification.stdout || "ssh-keygen rejected signature");
      }
    }
  } else {
    result(results, "FAIL", "VAULT999 seal resolves", `${sealUrl} returned ${sealResponse.status}`);
  }

  const failures = results.filter((entry) => entry.status === "FAIL").length;
  const failureEntries = results.filter((entry) => entry.status === "FAIL");
  const warnings = results.filter((entry) => entry.status === "WARN").length;
  let finalVerdict = "PASS";
  const onlySignatureFailures =
    failureEntries.length > 0 &&
    failureEntries.every((entry) => /signature|signer key/i.test(entry.label));
  if (onlySignatureFailures && humanWitness === "pending") {
    finalVerdict = "HOLD";
  } else if (failures > 0) {
    finalVerdict = "FAIL";
  } else if (humanWitness === "pending" || sealStatus === "HOLD") {
    finalVerdict = "HOLD";
  } else if (warnings > 0 || sealStatus === "PARTIAL") {
    finalVerdict = "PARTIAL";
  }

  console.log(`\nverify-arifos summary: ${results.length - failures - warnings} passed, ${warnings} warnings, ${failures} failed`);
  console.log(
    JSON.stringify(
      {
        resolved_did: didResponse.ok ? "yes" : "no",
        did_hash: didHash,
        manifest_hash: manifestHash,
        manifest_signature_valid: failures ? "no_or_not_present" : "yes",
        runtime_hash: runtimeHash,
        seal_hash: sealHash,
        seal_signature_valid: sealSignatureValid,
        human_witness: humanWitness,
        zk_vc_status: "not_implemented",
        final_verdict: finalVerdict,
      },
      null,
      2,
    ),
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(`FAIL verifier crashed - ${error.stack || error.message}`);
  process.exit(1);
});
