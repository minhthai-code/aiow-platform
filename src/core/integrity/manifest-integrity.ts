/**
 * ManifestIntegrity — System E from architecture assessment
 *
 * Protects against CDN tampering and supply-chain attacks.
 *
 * How it works:
 *   1. CI signs manifest.json with a private key (HMAC-SHA256 or RSA)
 *   2. The public key / HMAC secret is baked into the runtime
 *   3. On boot, client fetches /manifest.json and verifies the signature
 *   4. If verification fails → halt boot and report to telemetry
 *
 * In this implementation:
 *   - We use the Web Crypto API (SubtleCrypto) — no external deps
 *   - The "signing key" is baked into the build via Vite's define
 *   - Chunk SRI hashes are stored in the manifest
 *   - Runtime verifies each dynamic chunk before execution
 *
 * For the dev build we skip verification (MANIFEST_VERIFY = false).
 */

export interface Manifest {
  version:   string;
  buildId:   string;
  timestamp: number;
  chunks: {
    [chunkId: string]: {
      url:  string;
      sri:  string;   // e.g. "sha384-<base64>"
      size: number;   // bytes gzipped
    };
  };
  /** HMAC-SHA256 over canonical JSON of { version, buildId, timestamp, chunks } */
  signature: string;
}

export interface ManifestVerifyResult {
  ok:      boolean;
  reason?: string;
  manifest?: Manifest;
}

// Injected at build time: either 'true' or 'false'
const SHOULD_VERIFY = import.meta.env.PROD;

// In production this would be a real HMAC key baked in at build
// For demo: a fixed key string — in real CI this is rotated per release
const DEMO_HMAC_KEY = 'ytube-manifest-key-v1';

async function _importKey(raw: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(raw);
  return crypto.subtle.importKey(
    'raw', enc,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

async function _verify(manifest: Manifest, key: CryptoKey): Promise<boolean> {
  // Canonical form: everything except .signature
  const { signature, ...payload } = manifest;
  const canonical = JSON.stringify(payload, Object.keys(payload).sort());
  const data = new TextEncoder().encode(canonical);
  const sig  = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  return crypto.subtle.verify('HMAC', key, sig, data);
}

export async function fetchAndVerifyManifest(url = '/manifest.json'): Promise<ManifestVerifyResult> {
  if (!SHOULD_VERIFY) {
    // Dev: return a minimal fake manifest
    return { ok: true, manifest: _devManifest() };
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };

    const manifest: Manifest = await res.json();
    const key = await _importKey(DEMO_HMAC_KEY);
    const valid = await _verify(manifest, key);

    if (!valid) return { ok: false, reason: 'Manifest signature invalid' };
    return { ok: true, manifest };
  } catch (err) {
    return { ok: false, reason: String(err) };
  }
}

/**
 * Verify a chunk URL against its expected SRI hash.
 * Called before injecting dynamic <script> tags.
 */
export async function verifyChunkIntegrity(url: string, expectedSri: string): Promise<boolean> {
  if (!SHOULD_VERIFY) return true;
  try {
    const res  = await fetch(url);
    const buf  = await res.arrayBuffer();
    const [algo, expected] = expectedSri.split('-');
    if (!algo || !expected) return false;
    const hashBuf = await crypto.subtle.digest(algo.toUpperCase().replace('SHA', 'SHA-'), buf);
    const actual  = btoa(String.fromCharCode(...new Uint8Array(hashBuf)));
    return actual === expected;
  } catch { return false; }
}

function _devManifest(): Manifest {
  return {
    version:   import.meta.env.VITE_APP_VERSION ?? 'dev',
    buildId:   'local',
    timestamp: Date.now(),
    chunks:    {},
    signature: 'dev-signature',
  };
}
