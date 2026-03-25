# YTube Platform v7

FAANG-level multi-product frontend platform built on **Web Components + Lit + TypeScript**, designed to scale to **billions of users** and support **hundreds of engineers** across independently shipped products and micro-frontends.

This repository currently contains a working **v6 runtime + YouTube product**; this README documents the **v7 target architecture** (documentation-only). Treat this document as the contract for the next generation platform.

---

## 1. Architecture overview

YTube Platform v7 splits the system into **primitives**, **shared infrastructure**, and **product composition**:

- **Core runtime (`src/core/`)**: lowest-level primitives (scheduler, router, DI, logging, types). No knowledge of products/features.
- **Platform runtime (`src/platform/`)**: cross-product infrastructure and bootstrap (auth, telemetry, experiments, tracing, app shell, product loader).
- **Rendering (`src/rendering/`)**: incremental rendering engine + hydration planner (slot-based rendering, phased interactivity).
- **Data graph (`src/data-graph/`)**: normalized entity graph + query system + global invalidation.
- **Federation (`src/federation/`)**: micro-frontend federation (remote manifests, contracts, remote module loader).
- **Edge (`src/edge/`)**: edge SSR orchestration + streaming HTML pipeline.
- **Realtime (`src/realtime/`)**: realtime synchronization engine (WebSocket/SSE, topics, entity updates).
- **Media (`src/media/`)**: adaptive streaming pipeline (ABR, buffering, QoE telemetry).
- **Scheduling (`src/scheduling/`)**: CPU + network scheduling and resource prioritization.
- **Sandbox (`src/sandbox/`)**: feature isolation (worker/iframe sandboxes, policy + message bridges).
- **Observability (`src/observability/`)**: telemetry, tracing, metrics, profiling, performance budgets, experiment analytics.
- **Deployment (`src/deployment/`)**: deployment units, rollout policy, version resolution (stable/canary/rollback).
- **Build graph (`src/build-graph/`)**: bundle graph + budget enforcement (tooling) and artifact metadata.
- **Products (`src/products/`)**: product composition (YouTube, Social, Chat, etc.).
- **Features (`src/features/`)**: feature modules composed into products (home/watch/search/channel/etc).
- **Shared libs (`src/libs/`)**: UI components, tokens, and utilities.

---

## 2. System diagrams

### 2.1 Platform layers (runtime ownership)

```text
Browser
  │
  ├── App Shell (<yt-app>)
  │     - Header / Rail / Sidebar / Main Outlet (#outlet)
  │
  ├── Platform Runtime
  │     - boot, services, auth, telemetry, experiments, tracing
  │
  ├── Product Loader
  │     - loads local product bootstraps or federated remotes
  │
  ├── Products Layer
  │     - product metadata + route definitions + registration
  │
  ├── Feature Modules
  │     - route-level modules, lazy loaded and mounted into outlet
  │
  ├── Shared Libraries
  │     - tokens + base/layout/media components (Web Components)
  │
  └── Core Runtime
        - scheduler + router + DI + logging + types
```

### 2.2 Boot sequence (current: YouTube product via v6 runtime)

The v7 architecture preserves this boot chain and extends it with deployment resolution, rendering phases, and data graph.

```text
index.html
  ↓
platform-runtime.ts
  (src/platform/runtime/platform-runtime.ts)
  - initTheme()
  - initTracing(), initTelemetry()
  - create ApiClient/AuthService
  - registerService('Router', router)
  - wait for <yt-app> and getOutlet()
  ↓
product-loader.ts
  (src/platform/runtime/product-loader.ts)
  - loadProduct('youtube')
  ↓
products/youtube/bootstrap.ts
  (src/products/youtube/bootstrap.ts)
  - registerProduct({ id: 'youtube', routes: youtubeRoutes })
  ↓
route-registry.ts
  (src/platform/runtime/route-registry.ts)
  - getRoutesForProduct('youtube')
  ↓
router.register(routes)
  (NavigationController from src/core/router/router.ts)
  ↓
router.boot(outlet)
  - dynamically imports @features/home|watch|search|channel
```

### 2.3 Target v7 runtime lifecycle (end-to-end)

```text
Browser
  ↓
Platform bootstrap (HTML + runtime entry)
  ↓
Platform runtime init
  - observability
  - data graph
  - network scheduler
  - deployment resolver
  ↓
Product loader (local or federated)
  ↓
Router boot
  ↓
Feature module load (lazy import)
  ↓
Rendering engine (slots + phases)
  ↓
Data graph queries (prioritized)
  ↓
Realtime updates → invalidation → incremental re-render
```

---

## 3. Folder structure (v7 target)

```text
src/
  core/                # Stateless primitives, no product knowledge
  platform/            # Cross-product infra and runtime entrypoints
  rendering/           # Incremental rendering & hydration
  data-graph/          # Entity graph, query system, invalidation
  federation/          # Micro-frontend federation
  realtime/            # Realtime connections and topic dispatch
  edge/                # Edge SSR orchestration
  media/               # Media streaming pipeline
  scheduling/          # CPU + network schedulers and prefetch prediction
  sandbox/             # Worker/iframe sandboxes
  observability/       # Telemetry, tracing, metrics, profiling, budgets
  deployment/          # Deployment manifests & version resolution
  build-graph/         # Build-time bundle graph + budget enforcement (tooling)
  products/            # Product composition (YouTube, Social, Chat, etc.)
  features/            # Feature modules used across products
  libs/                # UI component library + tokens + utilities
```

### 3.1 Responsibilities by top-level module

- **`src/core/`**: primitives only. Must never import from other top-level modules.
- **`src/platform/`**: shared infra, stable service interfaces, runtime entrypoints.
- **`src/rendering/`**: render plans, slot registry, incremental hydration.
- **`src/data-graph/`**: normalized cache, queries, invalidation, mutation lifecycle.
- **`src/federation/`**: remote module loading (MFEs) with stable contracts.
- **`src/realtime/`**: realtime connection management + topic routing.
- **`src/edge/`**: SSR orchestration, streaming HTML, server-side route matching.
- **`src/media/`**: streaming sessions, ABR, buffering, QoE metrics.
- **`src/scheduling/`**: CPU scheduling + network scheduling + resource prioritization.
- **`src/sandbox/`**: worker/iframe sandbox adapters, message bridging, policy enforcement.
- **`src/observability/`**: event schema, metrics, tracing, profiling, budget enforcement.
- **`src/deployment/`**: deployment units, rollout policy, runtime version selection.
- **`src/build-graph/`**: tooling for bundle graph and budgets; produces build artifacts/metadata.
- **`src/products/`**: product definitions (routes, bootstrap), ownership boundary for teams.
- **`src/features/`**: reusable feature modules implementing `mount()` contract.
- **`src/libs/`**: design tokens + Web Components UI library.

---

## 4. Architecture layers and dependency rules

### 4.1 Layer model

```text
core (no deps)
  ↑
platform, scheduling, observability, rendering, data-graph, federation, realtime, media, sandbox, edge, deployment
  ↑
libs
  ↑
features
  ↑
products
```

### 4.2 Hard rules (enforced by tooling)

- **`src/core/**`** must not import from any other top-level directory.
- **`src/platform/**`** must not import from `src/products/**` or `src/features/**`.
- **`src/features/**`** must not import from `src/products/**` (features are product-agnostic).
- **`src/products/**`** may compose features but must not import feature internals unless explicitly public API.
- **No cross-product imports**: `src/products/youtube/**` must not import `src/products/social/**`.
- Federation remotes must depend only on **stable contracts** (no deep imports into platform internals).

### 4.3 Architectural boundaries that prevent coupling

- **Stable service interfaces**: features access platform infra via DI (`registerService` / `getRegisteredService`), not via deep imports.
- **Public API surfaces**: each directory exposes an `index.ts` that defines what is importable.
- **Contracts for federation**: remotes import contract types from `src/federation/contracts`, not internal modules.
- **Ownership metadata** (deployment/build graph): bundles map back to teams; prevents “drive-by” coupling.

---

## 5. Platform subsystems (v7 target)

This section documents the v7 subsystems you add as the platform scales. Each subsystem is scoped, owns specific responsibilities, and integrates via explicit interfaces.

### 5.1 Incremental rendering engine (`src/rendering/`)

- **Purpose**: partial page rendering, phased interactivity, incremental hydration for large pages.
- **Responsibilities**:
  - Define route render plans: **shell → above-the-fold → interactive → below-the-fold**.
  - Render “slots” into the outlet using scheduler priorities.
  - Generate hydration plans (SSR → CSR mapping).
- **Runtime interactions**:
  - Router triggers plan selection per route.
  - Scheduler runs render tasks per phase.
  - Data graph provides critical dependencies per phase.
- **Key files**:
  - `rendering/engine/render-plan.ts`
  - `rendering/engine/render-manager.ts`
  - `rendering/hydration/hydration-plan.ts`
  - `rendering/slots/slot-registry.ts`

### 5.2 Data graph query system (`src/data-graph/`)

- **Purpose**: normalized entity graph, declarative queries, global invalidation.
- **Responsibilities**:
  - Normalize API responses into an entity store.
  - Provide query primitives and memoized selectors.
  - Handle invalidation tags and stale-while-revalidate.
- **Runtime interactions**:
  - Features query the graph, not raw services.
  - Realtime applies patches; invalidation triggers re-render.
  - Observability records cache hit rates and query timing.
- **Key files**:
  - `data-graph/store/entity-store.ts`
  - `data-graph/query/query-client.ts`
  - `data-graph/invalidation/invalidation-manager.ts`

### 5.3 Micro-frontend federation (`src/federation/`)

- **Purpose**: independent deployability for teams (remote products/features, shared widgets).
- **Responsibilities**:
  - Load remote manifests and remote entrypoints.
  - Enforce contract-only consumption.
  - Expose a typed remote loader.
- **Runtime interactions**:
  - Product loader optionally loads products via federation.
  - Deployment resolver chooses remote versions per user/cohort.
- **Key files**:
  - `federation/registry/remote-manifest.ts`
  - `federation/runtime/remote-loader.ts`
  - `federation/contracts/contracts.ts`

### 5.4 Edge SSR orchestration (`src/edge/`)

- **Purpose**: streaming SSR with route-aware templates and hydration metadata.
- **Responsibilities**:
  - Match requests to SSR routes.
  - Stream HTML (shell first, then content).
  - Embed data graph snapshots and hydration markers.
- **Runtime interactions**:
  - Uses rendering engine to stream slot output.
  - Uses data graph to prefetch critical data and serialize state.
- **Key files**:
  - `edge/router/edge-router.ts`
  - `edge/ssr/ssr-orchestrator.ts`
  - `edge/templates/html-template.ts`

### 5.5 Realtime synchronization engine (`src/realtime/`)

- **Purpose**: live updates for chat, notifications, presence, live feeds, collaboration.
- **Responsibilities**:
  - Connection lifecycle (connect, backoff, reconnect).
  - Topic-based subscription and dispatch.
  - Apply entity patches and invalidations.
- **Runtime interactions**:
  - Writes into data graph.
  - Emits events to features via runtime event systems.
- **Key files**:
  - `realtime/connection/realtime-connection.ts`
  - `realtime/topics/topic-registry.ts`
  - `realtime/handlers/entity-update-handler.ts`

### 5.6 Global cache invalidation (`src/data-graph/invalidation/`)

- **Purpose**: cross-tab + cross-device correctness.
- **Responsibilities**:
  - Tag-based invalidation and fan-out.
  - Cross-tab propagation via `BroadcastChannel`.
  - Server-driven invalidation via realtime.
- **Key files**:
  - `data-graph/invalidation/invalidation-manager.ts`
  - `data-graph/invalidation/invalidation-channel.ts`

### 5.7 Media streaming pipeline (`src/media/`)

- **Purpose**: scalable ABR streaming and QoE analytics.
- **Responsibilities**:
  - Segment orchestration and buffering policy.
  - ABR decisioning and adaptation tracking.
  - QoE metrics: time-to-first-frame, stalls, rebuffering, bitrate switching.
- **Runtime interactions**:
  - Uses network scheduler for prioritization.
  - Emits QoE telemetry and trace spans.
- **Key files**:
  - `media/pipeline/streaming-session.ts`
  - `media/abr/abr-controller.ts`
  - `media/qoe/qoe-metrics.ts`

### 5.8 Advanced network scheduler (`src/scheduling/network/`)

- **Purpose**: prioritize requests by route phase and resource type (data/media/assets).
- **Responsibilities**:
  - Central request queue with budgets.
  - Priority mapping: critical → high → normal → low → idle.
  - Concurrency control and cancellation on navigation.
- **Runtime interactions**:
  - API client and data graph schedule network work through this layer.
  - Rendering phases influence request priority.
- **Key files**:
  - `scheduling/network/network-scheduler.ts`
  - `scheduling/network/request-descriptor.ts`

### 5.9 Feature sandboxing / isolation (`src/sandbox/`)

- **Purpose**: isolate experimental/untrusted code and reduce blast radius.
- **Responsibilities**:
  - Worker/iframe sandboxes with policy-defined APIs.
  - Message bridging and structured cloning.
  - Crash containment and controlled restarts.
- **Runtime interactions**:
  - Federation can load remotes into sandboxes.
  - Experiments can route risky features through isolation.
- **Key files**:
  - `sandbox/runtime/sandbox-manager.ts`
  - `sandbox/adapters/worker-sandbox.ts`
  - `sandbox/adapters/iframe-sandbox.ts`

### 5.10 Deployment isolation (`src/deployment/`)

- **Purpose**: independent releases across teams, safe rollout, and instant rollback.
- **Responsibilities**:
  - Deployment units (product/features) with ownership metadata.
  - Runtime resolution of versions (stable/canary/experiment).
  - Rollback pointers and kill switches.
- **Key files**:
  - `deployment/manifest/deployment-manifest.ts`
  - `deployment/runtime/deployment-resolver.ts`

### 5.11 Build graph + bundle optimizer (`src/build-graph/`)

- **Purpose**: model bundles, enforce budgets, optimize chunking, and produce artifact metadata.
- **Responsibilities**:
  - Compute module→chunk ownership.
  - Enforce budgets per chunk and per route in CI.
  - Generate build manifests used by runtime prefetch and dependency graph.
- **Key files**:
  - `build-graph/model/build-graph.ts`
  - `build-graph/analysis/bundle-budgets.ts`

### 5.12 Observability platform (`src/observability/`)

- **Purpose**: unify telemetry/tracing/metrics/profiling/experiments across the platform.
- **Responsibilities**:
  - Standardized event schema (productId/featureId/deploymentUnit/traceId).
  - Tracing spans for navigation, render phases, queries, media.
  - Performance budgets enforced in CI and surfaced at runtime.
- **Key files**:
  - `observability/events/event-schema.ts`
  - `observability/tracing/trace-api.ts`
  - `observability/metrics/metrics-client.ts`
  - `observability/perf-budgets/budget-enforcer.ts`

---

## 6. Runtime lifecycle (v7)

### 6.1 Step-by-step

1. **Browser loads `index.html`**
   - Injects `<yt-app>` and loads runtime entry.
2. **Platform bootstrap**
   - Initializes tokens, logging, tracing, telemetry, experiments.
   - Registers platform services (router, auth, API client, data graph).
3. **Platform runtime initialization**
   - Resolves product + version using deployment resolver.
4. **Product loader**
   - Loads local product bootstrap or federated remote entry.
   - Products register routes with route registry.
5. **Router boot**
   - Platform registers routes and boots navigation into app shell outlet.
6. **Feature module load**
   - Lazy imports feature module (or federated feature).
7. **Rendering**
   - Rendering engine executes render plan phases (shell → above fold → interactive → below fold).
8. **Data fetching**
   - Data graph executes queries via prioritized network scheduler.
9. **Realtime updates**
   - Realtime engine applies entity updates; invalidation triggers incremental re-render.

---

## 7. Deployment architecture (v7)

### 7.1 Goals

- Support **hundreds of engineers** and **multiple teams** shipping independently.
- Enable **micro-frontend bundles** with independent release cycles.
- Provide **safe rollout** (stable/canary/experiment) and **instant rollback**.

### 7.2 Build pipeline (target)

```text
Commit / PR
  ↓
CI build graph + budgets
  - compute chunk ownership
  - enforce budgets per chunk and per route
  - run typecheck + build
  ↓
Build artifacts
  - platform bundles (core + platform + rendering + data graph + observability)
  - product bundles (youtube, social, chat)
  - federated remotes (remoteEntry + manifest)
  ↓
Publish to CDN
  ↓
Update deployment manifest
  - stable/canary mappings
  - rollback pointer
```

### 7.3 Artifact strategy (example)

```text
cdn.example.com/
  platform/v7.2.0/...
  products/youtube/2026-03-16.3/...
  federation/chat/1.4.0/remoteEntry.js + manifest.json
  assets/...
```

### 7.4 Ownership and isolation

- Every deployable unit has:
  - **Owners** (team aliases)
  - **SLOs** (latency/error budgets)
  - **Rollout policy**
- Runtime loads only the versions allowed for the user cohort (stable/canary/experiment).

---

## 8. Performance model (v7)

### 8.1 Rendering

- **Partial page rendering** via slot-based render plans:
  - render shell immediately
  - render above-the-fold next
  - hydrate critical interactions first
  - defer below-the-fold work

### 8.2 SSR

- **Streaming SSR**:
  - stream shell + critical content first
  - stream subsequent slot HTML as it becomes ready
  - embed hydration markers and serialized data snapshots

### 8.3 Hydration

- **Incremental hydration**:
  - hydrate only the components needed for early interactivity
  - defer expensive component hydration to idle or post-interaction

### 8.4 Scheduling

- CPU scheduling (core scheduler):
  - immediate / user-blocking / user-visible / normal / background lanes
- Network scheduling:
  - route-phase-driven prioritization
  - cancellation on navigation
  - concurrency control

---

## 9. Observability stack (v7)

### 9.1 Telemetry

- Structured events for:
  - navigation, feature mount, render phases, network requests, query timings, media QoE

### 9.2 Tracing

- Span-based tracing for:
  - navigation → feature load → render phases → data queries → media playback

### 9.3 Profiling

- Component-level render durations (Web Components)
- Route-level budgets with CI enforcement and runtime warnings

### 9.4 Experiment analytics

- Every key metric is tagged with:
  - productId, featureId, deploymentUnit, experimentVariant, traceId

---

## 10. Developer workflow

### 10.1 Install

```bash
npm install
```

### 10.2 Run locally

```bash
npm run dev
```

### 10.3 Typecheck

```bash
npm run typecheck
```

### 10.4 Production build

```bash
npm run build
npm run preview
```

### 10.5 Team-scale development patterns (recommended)

- Develop inside a **product context** (e.g., YouTube product) and iterate on a feature module.
- Keep features **product-agnostic** unless explicitly marked as product-owned.
- Route all cross-feature infra needs through platform services (DI), not deep imports.

---

## 11. Rules for adding new products and features

### 11.1 Adding a new product

Create `src/products/<productId>/`:

```text
src/products/<productId>/
  app.ts
  routes.ts
  bootstrap.ts
```

Rules:

- `bootstrap.ts` must call `registerProduct(...)` with:
  - stable `id`
  - `displayName`
  - `routes` (`RouteDefinition[]`)
- Product routes must lazy-load features (or federated remotes).
- Products may depend on platform and features, but should not import feature internals unless public.
- Products must not import other products.

### 11.2 Adding a new feature module

Create `src/features/<featureId>/`:

```text
src/features/<featureId>/
  index.ts
  components/
  services/
  state/
  selectors/
```

Rules:

- `index.ts` must export a `FeatureModule` with:
  - `displayName`
  - `mount(container, params)` that returns `Unmount`
- Features must:
  - use Web Components for UI
  - keep pages orchestration-only (compose components; avoid infra logic inside page components)
  - use platform services via DI (`getRegisteredService`)
  - use data graph query system for data access (v7 target)
- Features must never import from `src/products/**`.

### 11.3 Enforced architectural boundaries

- `src/core/**` imports nothing above it.
- `src/platform/**` imports no `products/` or `features/`.
- `src/features/**` imports no `products/`.
- Federation remotes only consume stable contract surfaces.

---

## 12. Status note (repo reality vs v7 target)

This README defines the **v7 target architecture**. The repository currently implements:

- A multi-product runtime with YouTube as the first product:
  - `platform-runtime.ts → product-loader.ts → products/youtube/bootstrap.ts → route-registry.ts → router.register() → router.boot()`
- A working router, scheduler, DI service registry, and feature modules.
- Scaffolds for rendering, sandbox, SSR, state sync, profiling, and dependency graph.

Implementation of v7 subsystems will follow in staged upgrades; this document is the blueprint.

