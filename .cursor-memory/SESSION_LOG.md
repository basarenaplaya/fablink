# Session Log

## 2026-06-13 — Session 10: Nav, Phone Display & Tunisia Phone Input

### Actions
- `useNavLinks` + `AppMobileNav` sheet; desktop nav at `lg+`; removed duplicate Fournisseurs from UserMenu
- Phone utils in `whatsapp.ts`: `toLocalPhoneDigits`, `isValidLocalPhone`, `formatPhoneDisplay`, `buildTelUrl`
- `TunisiaPhoneInput` component; wired into gate, account, workshop forms
- Appeler + WhatsApp CTAs on JobBoardCard, ProviderProfileSidebar, StickyWhatsAppBar, ProviderCard
- French copy updates (`phone.*`, `callClient`, `callProvider`)

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 9: M7 Reviews & Profile Redesign

### Actions
- Added `ProviderReview` type, `reviews.service.ts` with Firestore transaction aggregates
- Built review components (StarRating, RatingSummary, ReviewForm, ReviewList, ProviderReviewsSection)
- Redesigned atelier profile: two-column layout, reviews section below
- Surfaced ratings on ProviderCard, FeaturedProviders; sort providers by rating
- French `copy.reviews.*` strings

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 8: UX Fixes (Mon atelier, Auth, Portfolio)

### Actions
- Refactored `useAuth` → `AuthProvider` shared context with `providerProfile` cache
- Unified provider nav to single **Mon atelier** link; edit via **Modifier mon atelier** on own profile page
- Fixed sign-out `finally` block; menu updates without page refresh
- Portfolio gallery: shadcn Carousel with visible prev/next + counter

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 7: M6 Profile Lifecycle

### Actions
- Extended UserProfile/ProviderProfile types; `updateUserProfile`, `updateProviderProfile`, `hasValidUserWhatsapp`
- Built ProfileGateProvider, WhatsappCompletionDialog, wired into AppShell
- Refactored OnboardingForm → WorkshopForm with create/edit + portfolio image management
- `/become-provider` loads existing provider for edit (Gérer mon atelier)
- Created `/mon-compte` account hub with tabs, profile form, role-based quick links
- RequestForm: removed WhatsApp field; denormalizes from `profile.whatsapp`
- Job board revamp: JobBoardHero, JobBoardCard, RequestFileIcon, ClientAvatar
- Nav: global Fournisseurs link, hash scroll on homepage, smooth scroll CSS
- Extended `copy.ts` with account, whatsappGate, workshop sections

### Decisions
- Client WhatsApp lives only on `users.whatsapp`; provider business line stays on `providers.whatsapp`
- WhatsApp gate non-dismissable until saved; blocks request/workshop submit
- Same UID links users + providers collections (decoupled identity vs listing)

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 6: M5 Dual-Path Platform

### Actions
- Created `src/lib/copy.ts` — French strings app-wide
- Built landing components and refactored homepage with `#annuaire` directory
- Added `/signup/client`, `/become-provider`, redirects from `/login` and `/onboarding`
- Provider funnel with benefit cards and auth gate
- French sweep on nav, marketplace, requests, profile, onboarding

### Decisions
- French-only for MVP (no i18n framework)
- Separate signup UX paths; same Firebase Google identity
- Hero owns search; MarketplaceHeader removed from homepage

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 5: Milestone 5 — Request Lifecycle & Client Workspace

### Actions
- Added `listPendingServiceRequests`, `listUserServiceRequests`, `closeServiceRequest`, `deleteServiceRequest`
- Wired provider job board to Firestore pending-only query
- Built `/my-requests` page with `useMyRequests`, `MyRequestsView`, `MyRequestCard`
- Added close/delete lifecycle with Dialog confirmation and toasts
- Added "My Requests" to UserMenu and AppHeader

### Decisions
- Service-layer ownership guards until Firestore rules deploy
- Cloudinary file cleanup on delete deferred
- Route `/my-requests` (separate from provider `/requests`)

### Verification
- `npm run build` success

---

## 2026-06-13 — Session 4: Milestone 4 — Global Shell, Profiles & Job Board

### Actions
- Extended `ServiceRequest` type + `buildClientJobWhatsAppUrl` / `buildProviderWhatsAppUrl`
- Installed shadcn: dropdown-menu, avatar, dialog, carousel, sheet
- Built `AppShell`, `AppHeader`, `UserMenu`; wired into root layout
- Created `/providers/[id]` with gallery, lightbox, sticky WhatsApp bar
- Created `requests.service.ts`, `uploadRequestFile`, `useRequests`, `useProvider`
- Built `/requests/new` (client form) and `/requests` (provider job board)
- Updated ProviderCard, FeaturedProviders, MarketplaceHeader

### Decisions
- Client WhatsApp collected per request (stored on `requests` doc)
- `createServiceRequest` uses `setDoc` with client-generated UUID (matches upload folder)
- Global header owns List business / Sign In CTAs

### Verification
- `npm run build` success

---

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
