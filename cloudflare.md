# Cloudflare Workers Migration

Migrating from Deno Deploy to Cloudflare Workers + Pages Assets, and from Deno tooling to Node/npm.

When finishing work update this document with progress and changes.

DO NOT READ the .env file, it contains secrets that should NEVER be in the claude context
THey are part of the ENV VARs, so you can use them (WITHOUT READING THEM INTO CONTEXT)

## What Needs to Change

### Tooling

| Current                                | New                                         | Scope            |
| -------------------------------------- | ------------------------------------------- | ---------------- |
| `deno.json` import map + tasks         | `package.json` deps + scripts               | project root     |
| `deno run -A npm:vite`                 | `vite` (npm script)                         | dev/build        |
| `deno run -A ... src/server/server.ts` | `wrangler dev`                              | dev              |
| `deployctl deploy`                     | `wrangler deploy`                           | deploy           |
| `jsr:` / `npm:` import prefixes        | bare npm specifiers                         | all server files |
| `tsconfig` with `deno.ns` lib          | `tsconfig.worker.json` with `webworker` lib | server TS config |

### Backend

| Deno Deploy API                           | Cloudflare Equivalent                                | Scope                            |
| ----------------------------------------- | ---------------------------------------------------- | -------------------------------- |
| `Deno.serve()`                            | Hono app + `export default { fetch(req, env, ctx) }` | `server.ts` → `worker.ts`        |
| `Deno.openKv()` / `Deno.Kv`               | Cloudflare KV namespace binding (`env.SMASHDOWN_KV`) | `util/kv.ts`, all stores         |
| `Deno.env.get()`                          | `env.VAR_NAME` (passed into handler)                 | `config.ts`                      |
| `@kitsonk/kv-toolbox`                     | Cloudflare KV `.list()` API                          | `util/kv.ts`                     |
| `@kyeotic/server` (serveStatic, withCors) | Cloudflare ASSETS binding + Hono CORS middleware     | `server.ts`, static file serving |
| `@kyeotic/server` (createJwtVerifier)     | `jose` npm package                                   | `auth/` or new `jwt.ts`          |
| `@kyeotic/server` (lazy)                  | direct instantiation from `env`                      | `context.ts`                     |
| `@std/encoding`                           | `atob` / `btoa` / `TextEncoder` (web standard)       | server utilities                 |
| `@std/assert`                             | inline `throw` or remove                             | server utilities                 |
| `@std/http`                               | Hono                                                 | `server.ts`                      |
| `@std/path`                               | `url-join` (already in deps) or string ops           | server utilities                 |
| `@std/ulid`                               | `@jsr/std__ulid` (already in `package.json`)         | server utilities                 |
| `.ts` import extensions                   | no extensions (bundler convention)                   | all files                        |
| Array KV keys                             | colon-delimited string keys                          | all stores                       |

### Frontend

| Current                                    | New                                          | Scope                         |
| ------------------------------------------ | -------------------------------------------- | ----------------------------- |
| Vite outDir `../../dist` (root-level)      | Vite outDir `../../dist/client`              | `vite.config.ts`              |
| Served by backend `serveStatic` middleware | Cloudflare ASSETS binding (`wrangler.jsonc`) | `wrangler.jsonc`, `worker.ts` |

### KV Key Structure Change

Current keys use the `makeSet(name)` helper which produces array-style Deno KV keys.
Cloudflare KV uses string keys:

| Store           | Deno KV key                             | Cloudflare KV key                         |
| --------------- | --------------------------------------- | ----------------------------------------- |
| UserStore       | `['USERS', userId]`                     | `"USERS:${userId}"`                       |
| UserStore       | `['EX_ID', source, externalId]`         | `"EX_ID:${source}:${externalId}"`         |
| PlayerStore     | `['PLAYERS', userId, playerId]`         | `"PLAYERS:${userId}:${playerId}"`         |
| TournamentStore | `['TOURNAMENTS', userId, tournamentId]` | `"TOURNAMENTS:${userId}:${tournamentId}"` |

List prefix `['USERS']` → `.list({ prefix: 'USERS:' })` etc.

---

## Phase 1: Cloudflare Project Setup

- [x] Create `wrangler.jsonc` with KV binding and ASSETS config
- [x] Create KV namespace (prod + preview)
- [x] Add env vars to `.env`: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

**`wrangler.jsonc`:**
```jsonc
{
  "name": "smashdown",
  "main": "src/server/worker.ts",
  "compatibility_date": "2025-11-17",
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application",
    "binding": "ASSETS",
    "run_worker_first": true
  },
  "kv_namespaces": [
    {
      "binding": "SMASHDOWN_KV",
      "id": "<prod-namespace-id>",
      "preview_id": "<preview-namespace-id>"
    }
  ],
  "observability": {
    "enabled": true
  }
}
```

Note: `nodejs_compat` is intentionally omitted — server code targets Web APIs only.

---

## Phase 2: Tooling Migration (Deno → Node/npm)

- [x] Add server deps to `package.json`: `hono`, `jose`, `@trpc/server`, `zod`, `date-fns`, `nanoid`, `superjson`, `url-join`
- [x] Add `wrangler` to `package.json` devDependencies
- [x] Update `package.json` scripts:

```json
"scripts": {
  "dev:frontend": "vite",
  "dev:backend": "wrangler dev --remote --var AUTH0_DOMAIN:$VITE_AUTH0_DOMAIN",
  "dev": "npm-run-all --parallel dev:frontend dev:backend",
  "build": "vite build",
  "deploy": "run-s build deploy:worker",
  "deploy:worker": "wrangler deploy",
  "push-secrets": "echo $VITE_AUTH0_DOMAIN | npx wrangler secret put AUTH0_DOMAIN"
}
```

- [x] Add `tsconfig.worker.json` for server code:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext", "WebWorker"],
    "strict": true,
    "noEmit": true,
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/server/**/*"]
}
```

- [x] Update root `tsconfig.json` to reference both client and worker configs (remove `deno.ns` / `deno.unstable` from `compilerOptions.lib`)
- [ ] Delete `deno.json` — deferred to after Phase 5 data export (needs Deno APIs to read Deno KV)

---

## Phase 3: Frontend Build Setup

- [x] Update `vite.config.ts`: change `build.outDir` from `../../dist` to `../../dist/client`
- [x] Add `/api` proxy to vite dev server config (routes frontend dev requests to `wrangler dev` on :8787)
- [x] Build once with `npm run build:client` and confirm `dist/client/index.html` exists
- [x] Confirm `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_DOMAIN` are set at build time (`VITE_API_URL` not used in this codebase)

**Updated `vite.config.ts`:**
```ts
export default defineConfig({
  root: './src/client',
  publicDir: '../public',
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  build: {
    outDir: '../../dist/client',   // was ../../dist
    target: 'esnext',
  },
})
```

The ASSETS binding in `wrangler.jsonc` points to `./dist/client`. With `run_worker_first: true`, the worker handles all requests first. API routes (`/api/*`) are handled by the worker; everything else falls through to ASSETS which serves the SPA with 404 → `index.html` fallback.

---

## Phase 4: Backend Code Migration ✓ Complete

### 4a. `WorkerEnv` interface

Create `src/server/types.ts` (or add to existing):
```ts
export interface WorkerEnv {
  SMASHDOWN_KV: KVNamespace
  ASSETS: Fetcher
  AUTH0_DOMAIN: string
}
```

### 4b. `src/server/util/kv.ts`

Replace `Deno.openKv()` and `@kitsonk/kv-toolbox` with `KVNamespace`:

- `makeSet(name)` → `makeKey(...parts)` joining with `:`
- `listAllValues(kv, prefix)` → `kv.list({ prefix })` then `Promise.all` of `kv.get`
- `create()` / `update()` / `put()` → `kv.get()` + `kv.put(key, JSON.stringify(value))`
- Atomic transactions → sequential operations (see Key Notes)

```ts
export function makeKey(...parts: string[]) {
  return parts.join(':')
}

export async function listAllValues<T>(kv: KVNamespace, prefix: string): Promise<T[]> {
  const list = await kv.list({ prefix })
  const values = await Promise.all(list.keys.map(k => kv.get<T>(k.name, 'json')))
  return values.filter((v): v is T => v !== null)
}

export async function kvCreate<T extends { id: string }>(
  kv: KVNamespace, key: string, value: T
): Promise<T> {
  const existing = await kv.get(key)
  if (existing) throw new Error(`Record already exists: ${key}`)
  await kv.put(key, JSON.stringify(value))
  return value
}

export async function kvPut<T>(kv: KVNamespace, key: string, value: T): Promise<T> {
  await kv.put(key, JSON.stringify(value))
  return value
}

export async function kvUpdate<T>(kv: KVNamespace, key: string, value: T): Promise<T> {
  const existing = await kv.get(key)
  if (!existing) throw new Error(`Record not found: ${key}`)
  await kv.put(key, JSON.stringify(value))
  return value
}
```

### 4c. All stores (`userStore.ts`, `playerStore.ts`, `tournamentStore.ts`)

Each store currently takes `Deno.Kv`; change to accept `KVNamespace`.

- Replace array key construction with `makeKey()`
- Replace `kv.atomic()` transactions with sequential get/put (UserStore external ID mapping)
- Remove `@kitsonk/kv-toolbox` imports
- Remove `jsr:` / `npm:` import prefixes throughout

Example pattern (TournamentStore):
```ts
// Before
const TOURNAMENTS = makeSet('TOURNAMENTS')
const key = TOURNAMENTS(userId, tournamentId)
await kv.set(key, tournament)

// After
const key = makeKey('TOURNAMENTS', userId, tournamentId)
await kv.put(key, JSON.stringify(tournament))
```

### 4d. `src/server/config.ts`

Replace `Deno.env.get()` with `env` parameter:
```ts
// Before
export function getConfig() {
  return {
    auth0Domain: Deno.env.get('AUTH0_DOMAIN')!,
    auth0Audience: Deno.env.get('AUTH0_AUDIENCE')!,
  }
}

// After
export function getConfig(env: WorkerEnv) {
  return {
    auth0Domain: env.AUTH0_DOMAIN,
    auth0Audience: 'kyeotek', // hardcoded; not an env var
  }
}
```

### 4e. `src/server/auth/` — JWT verification

Replace `@kyeotic/server`'s `createJwtVerifier` with `jose`, which uses Web Crypto and runs in Workers:
```ts
import { createRemoteJWKSet, jwtVerify } from 'jose'

export function createJwtVerifier(domain: string, audience: string) {
  const JWKS = createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
  return async (token: string) => {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://${domain}/`,
      audience,
    })
    return payload
  }
}
```

### 4f. `src/server/context.ts`

Replace `lazy()` and `Deno.openKv()` with direct instantiation from `env`:
```ts
// Before
const kv = lazy(() => Deno.openKv())
export function createAppContext() { ... }

// After
export function createAppContext(env: WorkerEnv) {
  return {
    userStore: createUserStore(env.SMASHDOWN_KV),
    playerStore: createPlayerStore(env.SMASHDOWN_KV),
    tournamentStore: createTournamentStore(env.SMASHDOWN_KV),
    verifyJwt: createJwtVerifier(env.AUTH0_DOMAIN, env.AUTH0_AUDIENCE),
    config: getConfig(env),
  }
}
```

### 4g. `src/server/server.ts` → `src/server/worker.ts`

Replace `Deno.serve()` + `serveStatic` with Hono + ASSETS fallthrough:

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './router'
import { createAppContext } from './context'
import type { WorkerEnv } from './types'

const app = new Hono<{ Bindings: WorkerEnv }>()

app.use('/api/*', cors())

app.all('/api/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/api',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createAppContext(c.env),
  })
})

// All other routes: fall through to ASSETS (serves SPA)
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
```

### 4h. Remove `.ts` import extensions

All internal imports like `import { foo } from './foo.ts'` → `import { foo } from './foo'`.

---

## Phase 5: Data Migration (Deno KV → Cloudflare KV)

- [x] Write `scripts/export-kv.ts` — dumps all entries from Deno KV to JSON with key transformation
- [x] Bulk import into Cloudflare KV via `wrangler kv bulk put`
- [ ] Verify data in CF KV

**Export script** reads all known prefixes (`USERS`, `EX_ID`, `PLAYERS`, `TOURNAMENTS`) and transforms keys:
```ts
// ['USERS', userId] → 'USERS:userId'
// ['EX_ID', source, externalId] → 'EX_ID:source:externalId'
const output = entries.map(([key, value]) => ({
  key: key.join(':'),
  value: JSON.stringify(value),
}))
```

**To run:**
```sh
# 1. Export from Deno KV (uses KV_TARGET_URL from .env for remote Deno Deploy KV)
deno run -A --unstable-kv scripts/export-kv.ts

# 2. Import into Cloudflare KV
npx wrangler kv bulk put kv-export.json --binding SMASHDOWN_KV --preview false

# 3. Verify a sample
npx wrangler kv key list --binding SMASHDOWN_KV --preview false
```

---

## Phase 6: Local Development ✓ Complete

- [x] `npm run dev:frontend` — Vite on port 3000 with `/api` proxy to :8787
- [x] `npm run dev` — wrangler dev on port 8787 (worker + ASSETS)

For full local dev with hot reload, run both in parallel:
```sh
npm run dev:frontend   # Vite on :3000
npm run dev            # wrangler dev on :8787
```

The Vite proxy forwards `/api` requests to the wrangler dev server, so the frontend dev server at :3000 is the single entry point during development.

---

## Phase 7: Infrastructure / DNS Migration ✓ Complete

Replaced the Deno Deploy DNS Terraform module (`tf-deno-domain-aws`) with Cloudflare Workers domain management.

### Changes made

- **`infra/main.tf`** — added `cloudflare/cloudflare ~> 4.0` provider, `cloudflare_accounts` data source, and `cloudflare_account_id` local
- **`infra/dns.tf`** — replaced `module "domain"` (Route53 A/AAAA/ACME records pointing to Deno) with `cloudflare_workers_domain` resource pointing `smash.kye.dev` → `smashdown` worker service
- **`infra/vars.tf`** — removed `deno_deploy_acme`, added `cloudflare_account_name` and `cloudflare_api_token` (sensitive)
- **`infra/deploy`** — replaced fragile `export $(... | xargs)` env loading with `set -a; source .env; set +a`; added explicit `TF_VAR_cloudflare_api_token=$CLOUDFLARE_API_TOKEN` mapping

### Manual steps required

1. **Export `CLOUDFLARE_API_TOKEN` in `~/.zshrc`** — the token must be `export`ed (not just assigned) so bash subprocesses (the deploy script) inherit it. `wrangler` picks it up from the interactive shell session but Terraform runs in a bash subprocess.

2. **Delete existing DNS records for `smash.kye.dev` in Cloudflare dashboard** before running `./infra/deploy` for the first time. The records existed from when `kye.dev` was migrated to Cloudflare DNS but were never in Terraform state. The `cloudflare_workers_domain` resource cannot overwrite them automatically (the `override_existing_dns_record` API option is not exposed in the Terraform provider v4). Delete them manually, then Terraform takes ownership going forward.

### SSL

No action required. Cloudflare automatically provisions Universal SSL for `cloudflare_workers_domain` resources. The old `_acme-challenge` CNAME (used by Deno Deploy's Let's Encrypt flow) is no longer needed and was removed.

---

## Phase 8: Deploy & Cutover ✓ Complete

- [x] `npm run deploy` — builds frontend to `dist/client`, then deploys worker + ASSETS via wrangler
- [x] Verify tRPC routes work end-to-end
- [x] Verify Auth0 login/token flow
- [x] Verify KV reads/writes for all stores
- [ ] Decommission Deno Deploy app

---

## Key Notes

- **Auth0** — no changes to Auth0 tenant config; JWKS endpoint and redirect URLs are unchanged. Only the JWT verification library changes on the server.
- **PKCE flow** — Auth0 login is entirely client-side (PKCE, no client secret). The server only verifies JWTs; no Auth0 client credentials needed on the backend.
- **`VITE_*` env vars** — compile-time only, baked into the JS bundle during `vite build`.
- **Auth0 runtime vars** — `AUTH0_DOMAIN` is read from `$VITE_AUTH0_DOMAIN` in `.env` and passed to wrangler at dev time via `--var`. In production it must be set as a Cloudflare Worker secret via `npm run push-secrets`. `AUTH0_AUDIENCE` is hardcoded in `config.ts` (not an env var).
- **Cloudflare KV consistency** — eventually consistent; fine for this app's access patterns (user-scoped data, low write frequency).
- **Atomic transactions** — Deno KV's `atomic()` is used in UserStore for external ID mappings. Cloudflare KV has no equivalent. Replace with sequential operations; race condition risk during user creation is low and tolerable.
- **`run_worker_first: true`** — ensures all requests hit the worker before ASSETS. The worker handles `/api/*` and calls `ASSETS.fetch()` for everything else, giving the SPA its 404 → `index.html` fallback.
- **No `nodejs_compat`** — server code uses only Web APIs (fetch, crypto.subtle, URL, Request/Response). Hono and jose are both Worker-native. Avoid importing Node built-ins (`path`, `fs`, etc.).
- **`@kyeotic/server`** — provided serveStatic, withCors, createJwtVerifier, and lazy. All four replaced: serveStatic → ASSETS binding, withCors → Hono CORS, createJwtVerifier → jose, lazy → direct instantiation.
- **`wrangler`** reads `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` from the environment (not `CF_*` variants).
- **Data export** must run before `deno.json` is deleted, since it uses Deno APIs to read from Deno KV.
