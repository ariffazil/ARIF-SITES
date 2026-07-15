#!/usr/bin/env node
import { createHash, sign } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

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

function base58btcEncode(buffer) {
  let carry;
  let digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    carry = buffer[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = Math.floor(carry / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) break;
    digits.push(0);
  }
  return "z" + digits.reverse().map((d) => BASE58_ALPHABET[d]).join("");
}

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function main() {
  const defaultKeyPath = join(homedir(), ".ssh", "id_ed25519");
  const keyPath = argValue("--key", defaultKeyPath);
  const configPath = argValue("--config", "./sites/arif-fazil.com/public/.well-known/did-configuration.json");

  console.log(`[+] Loading did-configuration from: ${configPath}`);
  let configData;
  try {
    configData = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`[-] Failed to read config: ${error.message}`);
    process.exit(1);
  }

  const credential = configData.linked_dids?.[0]?.credentials?.[0];
  if (!credential) {
    console.error("[-] No domain linkage credential structure found in config.");
    process.exit(1);
  }

  // 1. Prepare unsigned credential payload
  const unsignedCredential = { ...credential };
  delete unsignedCredential.proof;

  // Include top-level fields required for validation context
  unsignedCredential.issuanceDate = configData.linked_dids[0].issuance_date;
  unsignedCredential.issuer = configData.linked_dids[0].issuer;

  const canonicalPayload = canonicalJson(unsignedCredential);
  console.log(`[+] Canonical Payload length: ${canonicalPayload.length} bytes`);

  // 2. Load private key
  console.log(`[+] Loading private key from: ${keyPath}`);
  let privateKey;
  try {
    privateKey = readFileSync(keyPath, "utf8");
  } catch (error) {
    console.error(`[-] Failed to read private key: ${error.message}`);
    console.log("[!] Please specify your private key path with: --key <path_to_private_key>");
    process.exit(1);
  }

  // 3. Sign the payload
  console.log("[+] Signing payload using Ed25519...");
  let signatureBuffer;
  try {
    signatureBuffer = sign(null, Buffer.from(canonicalPayload), privateKey);
  } catch (error) {
    console.error(`[-] Signing failed: ${error.message}`);
    process.exit(1);
  }

  // 4. Encode and insert
  const signatureBase58 = base58btcEncode(signatureBuffer);
  console.log(`[+] Encoded signature: ${signatureBase58}`);

  credential.proof.proofValue = signatureBase58;
  // Make sure the verificationMethod is correct
  credential.proof.verificationMethod = "did:web:arif-fazil.com#arif-fazil";

  // 5. Save back
  writeFileSync(configPath, JSON.stringify(configData, null, 2) + "\n");
  console.log(`[+] SUCCESS — updated did-configuration.json with real signature.`);
}

main();
