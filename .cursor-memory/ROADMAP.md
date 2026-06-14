# MVP Build Roadmap

Goal: User finds a vetted provider and opens WhatsApp in < 30 seconds.

## Phase 0 — Foundation (Complete)

- [x] `src/lib/firebase.ts` — client SDK singleton
- [x] `src/app/api/cloudinary-sign/route.ts` — signed uploads (auth gate in M2)
- [x] Fix `src/types/idex.ts` → `index.ts`
- [x] Add `zod` + `server-only` dependencies
- [x] `src/services/upload.service.ts` — signature + upload helpers

## Phase 1 — Auth & Onboarding (Complete)

- [x] Auth page — Google sign-in (Firebase Auth) at `/login`
- [x] `firebase-admin` + Bearer gate on `/api/cloudinary-sign`
- [x] `src/services/auth.service.ts` + `src/hooks/useAuth.ts`
- [x] `users` collection write on first login (`role: 'client'`)
- [x] Provider onboarding form (`/onboarding`)
- [ ] Firestore security rules

## Phase 2 — Marketplace Core (Complete)

- [x] Home — landing page + category showcase + annuaire directory
- [x] Provider directory — filters (category, city), card feed
- [x] WhatsApp deep link + `analytics_clicks` tracking
- [x] Provider profile page with carousel (`/providers/[id]`)
- [x] Global navigation shell (French)
- [x] Dual-path signup: `/signup/client` + `/become-provider`

## Phase 3 — Requests (Complete)

- [x] Provider onboarding form + portfolio upload
- [x] Client request placement flow (`/requests/new`)
- [x] Provider job board (`/requests`) — pending-only Firestore query
- [x] Client request lifecycle (`/my-requests`) — close + delete
- [x] Profile lifecycle (M6): WhatsApp gate, `/mon-compte`, workshop edit
- [x] Client reviews & ratings on atelier profiles (M7)
- [ ] Admin verification toggle

## Out of Scope (MVP)

Payments, in-app chat, AI matching, escrow.
