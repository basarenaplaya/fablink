# Task: `src/lib/firebase.ts` — Firebase Client Configuration

**Status:** Done (2026-06-13)  
**Priority:** P0 — blocks all Auth + Firestore features

---

## Objective

Provide a single, type-safe Firebase client initialization used by `src/services/*` and `src/hooks/*`. Must work in the browser only (client components / hooks). No secrets beyond public `NEXT_PUBLIC_*` vars.

## Environment Variables (already in `.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID  (optional — Analytics, Phase 2+)
```

## Implementation Plan

### 1. File location & exports

```
src/lib/firebase.ts
```

Exports:
- `firebaseApp` — `FirebaseApp` instance
- `auth` — `Auth` from `firebase/auth`
- `db` — `Firestore` from `firebase/firestore`

Optional later (not MVP-critical):
- `analytics` — lazy-init only in browser if measurement ID present

### 2. Singleton pattern (SSR-safe)

Next.js App Router may import this module on server during bundling. Use the standard pattern:

```typescript
// Pseudocode — not final implementation
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

- Call `initializeApp` only when `getApps()` is empty
- Do **not** call browser-only APIs at module top level beyond Firebase SDK init (SDK handles SSR)
- If Analytics is added: `typeof window !== 'undefined'` guard + dynamic import

### 3. Config object

Build `FirebaseOptions` from env vars with a small validator:

- Throw descriptive `Error` at init time if any required `NEXT_PUBLIC_FIREBASE_*` is missing
- Keeps failures loud in dev, not silent `undefined` configs

### 4. Auth persistence (default)

- Use Firebase default persistence (`indexedDB` / `localStorage`) — appropriate for web MVP
- Google provider config lives in `src/services/auth.service.ts`, not in `firebase.ts`

### 5. What this file must NOT do

- No React imports
- No Firestore queries (belongs in `src/services/`)
- No Admin SDK (would need separate server-only module if ever required)
- No hardcoded credentials

### 6. Downstream consumers (after implementation)

| Consumer | Usage |
|----------|-------|
| `src/services/auth.service.ts` | `signInWithPopup`, `signOut`, `onAuthStateChanged` wrapper |
| `src/services/users.service.ts` | CRUD `users` collection |
| `src/services/providers.service.ts` | Query `providers` with filters |
| `src/services/requests.service.ts` | Create `requests` documents |
| `src/services/analytics.service.ts` | Write `analytics_clicks` |
| `src/hooks/useAuth.ts` | Subscribe to auth state via service |

### 7. Verification checklist

- [ ] Dev server starts without Firebase init errors
- [ ] `getApps()` returns single app on hot reload
- [ ] TypeScript strict — no `any`
- [ ] Firebase MCP: `firebase_get_sdk_config` matches env values

## Open Decisions

- **Emulators:** Skip for MVP unless user requests local emulator setup
- **App Check:** Phase 2 hardening — not blocking MVP
