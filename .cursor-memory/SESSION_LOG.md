# Session Log

## 2026-06-13 — Session 3: Milestone 3 — Marketplace & Onboarding

### Actions
- Created constants, whatsapp utils, providers/analytics services
- Public marketplace home with filters, featured slider, provider cards
- Provider onboarding with Zod form + multi-image Cloudinary upload
- Switched font to Plus Jakarta Sans
- Login redirect param; onboarding auth guard

### Decisions
- Public browse without login; onboarding protected
- Client-side filtering for providers

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 2: Milestone 2 — Auth & Security Gateway

### Actions
- Installed `firebase-admin`
- Created `src/lib/firebase-admin.ts` with `server-only`, cert init, `verifyIdToken`, `extractBearerToken`
- Created `src/services/users.service.ts` and `src/services/auth.service.ts`
- Created `src/hooks/useAuth.ts` with `getIdToken` helper
- Secured `/api/cloudinary-sign` with Bearer token verification
- Updated `upload.service.ts` to require `idToken`
- Installed shadcn `card` + `skeleton`; built `/login` page
- Forced `dark` class on root layout

### Verification
- `npm run build` success
- POST without token → 401; invalid token → 401; GET → 405

---

## 2026-06-13 — Session 1: Milestone 1 — Secure Infrastructure

### Actions
- Installed `zod` and `server-only`
- Renamed `src/types/idex.ts` → `src/types/index.ts`; added `CloudinarySignRequest`, `CloudinarySignResponse`, `MAX_UPLOAD_BYTES`
- Implemented `src/lib/firebase.ts` — `getApps()` singleton, required env validation, exports `firebaseApp`, `auth`, `db`
- Implemented `src/lib/cloudinary-server.ts` — `import 'server-only'`, `signUploadParams()`, `getCloudinaryConfig()`
- Implemented `src/app/api/cloudinary-sign/route.ts` — POST + Zod, GET → 405, M2 auth TODO comment
- Implemented `src/services/upload.service.ts` — `requestCloudinarySignature`, `uploadFileToCloudinary`, `validateFileSize`

### Decisions
- Auth on sign route deferred to M2 (user choice: sign-only with Zod + folder regex for M1)
- `server-only` guard on cloudinary-server module to prevent client bundle leakage

### Verification
- `npm run build` — success
- POST valid folder → 200 with signature payload
- POST `../evil` → 400
- GET → 405

---

## 2026-06-13 — Session 0: Kickoff & Arena Initialization

### Actions
- Read `.cursorrules` — confirmed layer separation, dark mobile-first UI, signed Cloudinary, no `any`, Zod validation
- Read `.cursor/Project_spec.md` — MVP scope: Tunisia manufacturing marketplace, Firestore schema, WhatsApp CTA, 7 screens
- Initialized thinking arena at `.cursor-memory/` with STATE, ARCHITECTURE, MCP_TOOLSET, ROADMAP, task plans, session log
- Audited MCP tools — Firebase, Cloudinary, Context7, shadcn, filesystem, sequential-thinking marked active; mysql/Linear/Sentry/Vercel/etc. ignored

### Decisions
- Arena location: `.cursor-memory/` (separate from legacy `.cursor/memory.md`)
- Firebase client: singleton in `src/lib/firebase.ts`, services layer owns all Firestore/Auth operations
- Cloudinary: server route signs uploads; client uploads direct to Cloudinary API; secret never exposed
- Next immediate code (pending user go-ahead): `firebase.ts` then `cloudinary-sign/route.ts`

### Observations
- Spec file path mismatch: `.cursorrules` says `PROJECT_SPEC.md` at root; actual file is `.cursor/Project_spec.md`
- Types file typo: `src/types/idex.ts` should become `index.ts`
- `zod` not yet in package.json — needed before API route
- Next.js 16.2.9 + React 19.2.4 installed (exceeds 15+ requirement)
