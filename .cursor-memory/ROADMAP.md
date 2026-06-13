# MVP Build Roadmap

Goal: User finds a vetted provider and opens WhatsApp in < 30 seconds.

## Phase 0 — Foundation (Complete)

- [x] `src/lib/firebase.ts` — client SDK singleton
- [x] `src/app/api/cloudinary-sign/route.ts` — signed uploads (auth gate in M2)
- [x] Fix `src/types/idex.ts` → `index.ts`
- [x] Add `zod` + `server-only` dependencies
- [x] `src/services/upload.service.ts` — signature + upload helpers
- [ ] `src/services/*` scaffolding (auth, providers, requests, analytics) — M2+

## Phase 1 — Auth & Onboarding

- [x] Auth page — Google sign-in (Firebase Auth) at `/login`
- [x] `firebase-admin` + Bearer gate on `/api/cloudinary-sign`
- [x] `src/services/auth.service.ts` + `src/hooks/useAuth.ts`
- [x] `users` collection write on first login (`role: 'client'`)
- [ ] Post-login role selection / provider onboarding form
- [ ] Firestore security rules

## Phase 2 — Marketplace Core

- [x] Home — category cards, search, verified slider
- [x] Provider directory — filters (category, city), card feed
- [x] WhatsApp deep link + `analytics_clicks` tracking
- [ ] Provider profile page with carousel (M4)

## Phase 3 — Requests & Provider Onboarding

- [x] Provider onboarding form + portfolio upload
- [ ] Client request placement flow
- [ ] Admin verification toggle

## Out of Scope (MVP)

Payments, in-app chat, reviews, AI matching, escrow.
