# Task: `src/app/api/cloudinary-sign/route.ts` — Secure Upload Signing

**Status:** Done (2026-06-13) — auth gate deferred to M2  
**Priority:** P0 — blocks portfolio images + request file uploads

---

## Objective

Server-side API route that generates Cloudinary upload signatures. The `CLOUDINARY_API_SECRET` never leaves the server. Client receives only `{ signature, timestamp, apiKey, cloudName, folder, ... }` needed for direct browser → Cloudinary upload.

## Environment Variables

| Variable | Exposure |
|----------|----------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public (also returned to client) |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Public (returned to client for upload) |
| `CLOUDINARY_API_SECRET` | **Server only** — used to sign |

## Implementation Plan

### 1. Route location

```
src/app/api/cloudinary-sign/route.ts
```

- `POST` only (reject `GET` with 405)
- `runtime`: default Node.js (Cloudinary Node SDK already in `package.json`)

### 2. Request body schema (Zod)

```typescript
// Planned shape — validate before signing
{
  folder: string;           // e.g. "providers/{uid}" | "requests/{uid}"
  resourceType?: 'image' | 'raw' | 'auto';  // default 'image'
  // Optional upload presets constraints:
  maxFileSize?: number;     // bytes — enforce 20MB (20971520) for requests
}
```

Validation rules:
- `folder` — required, alphanumeric + `/` + `_` + `-` only (prevent path injection)
- `resourceType` — enum, default `'image'` for portfolios; `'raw'` for STL/CAD/Gerber zips
- Reject oversized `maxFileSize` requests above 20MB cap from spec

### 3. Auth gate (recommended for MVP)

Before signing:
1. Verify Firebase ID token from `Authorization: Bearer <token>` header
2. Use Firebase Admin SDK **or** client-verified UID passed + server re-validation

**MVP pragmatic approach:**
- Option A (preferred): Add `firebase-admin` for token verification in API route
- Option B (lighter, less secure): Require authenticated client + embed `uid` in folder path; full Admin verification in Phase 1.1

Document decision in `SESSION_LOG.md` when implementing.

### 4. Signature generation

Use `cloudinary` npm package (v2.10.0 installed):

```typescript
// Pseudocode
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const timestamp = Math.round(Date.now() / 1000);
const paramsToSign = { timestamp, folder, resource_type: resourceType };
const signature = cloudinary.utils.api_sign_request(
  paramsToSign,
  process.env.CLOUDINARY_API_SECRET!
);
```

Return JSON:
```typescript
{
  signature: string;
  timestamp: number;
  apiKey: string;      // from NEXT_PUBLIC_CLOUDINARY_API_KEY
  cloudName: string;
  folder: string;
  resourceType: string;
}
```

### 5. Client upload flow (for future `src/services/upload.service.ts`)

1. Service calls `POST /api/cloudinary-sign` with folder + resourceType
2. Receives signed params
3. `FormData` POST to `https://api.cloudinary.com/v1_1/{cloudName}/{resourceType}/upload`
4. Append: `file`, `api_key`, `timestamp`, `signature`, `folder`
5. Parse response `secure_url` → save to Firestore

### 6. Folder naming convention

| Use case | Folder pattern |
|----------|----------------|
| Provider portfolio | `providers/{providerId}/portfolio` |
| Request attachments | `requests/{userId}/{requestId}` |
| Temp pre-request | `requests/{userId}/drafts` |

### 7. Error handling

| Condition | Response |
|-----------|----------|
| Invalid body | 400 + Zod error details |
| Missing server secret | 500 (log server-side, generic message to client) |
| Unauthenticated | 401 |
| Wrong method | 405 |

### 8. Security checklist

- [ ] `CLOUDINARY_API_SECRET` never in client bundle (no `NEXT_PUBLIC_` prefix)
- [ ] Sign only whitelisted params (timestamp, folder, resource_type)
- [ ] Rate limiting — consider later via middleware
- [ ] 20MB enforced client-side + Cloudinary upload preset server-side when configured

### 9. Verification checklist

- [ ] `curl` POST returns valid signature
- [ ] Signed upload to Cloudinary succeeds from browser
- [ ] Invalid folder rejected
- [ ] Cloudinary MCP env-config validates credentials

## Dependencies to Add

- `zod` — request validation (per `.cursorrules`)
- Possibly `firebase-admin` — token verification on API route

## Open Decisions

- Upload preset vs unsigned folder-only uploads (signed params sufficient for MVP)
- Whether to add `firebase-admin` now or defer auth gate to hook-level + folder scoping
