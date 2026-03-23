/**
 * Platform Bootstrap v2 — uses ONLY real exported names.
 *
 * Boot order:
 *   1. initTheme()             — inject CSS tokens (sync, no flash)
 *   2. initTracing()           — System F: start trace collectors
 *   3. Long Task Observer      — System H: inline observer (perfBudget has no startObserver)
 *   4. initTelemetry()         — RUM: Web Vitals, errors
 *   5. fetchAndVerifyManifest()— System E: integrity check (non-blocking)
 *   6. auth.initialize()       — ANON in dev
 *   7. initExperiments(userId) — flag assignments
 *   8. canaryController.init() — System G: canary bucket
 *   9. await appEl.updateComplete — Lit first render
 *  10. router.boot(outlet)     — SPA routing
 *  11. hydrationManager.hydrateFromDOM() — System A: SSR markers (no-op in CSR)
 *  12. registerSW()            — prod only
 */

export * from '@platform/runtime/platform-runtime';
