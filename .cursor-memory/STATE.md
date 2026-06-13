# Project State

**Last updated:** 2026-06-13 (Session 3 — Milestone 3 Complete)

## Current Phase

Milestone 4 — Provider profile page, request flow, Firestore rules (next)

## Completed

- [x] M1–M2: Infrastructure + Auth gateway
- [x] **M3:** `src/lib/constants.ts` + `src/lib/whatsapp.ts`
- [x] **M3:** Plus Jakarta Sans premium typography
- [x] **M3:** Provider services, upload portfolio batch, analytics clicks
- [x] **M3:** Public marketplace home (`/`) — search, category/city filters, provider cards, WhatsApp CTA
- [x] **M3:** Featured verified providers horizontal slider
- [x] **M3:** Provider onboarding (`/onboarding`) — multi-image Cloudinary upload, `verified: false`, role → provider
- [x] **M3:** Login redirect query param support
- [x] **M3:** `npm run build` passes

## In Progress

- None

## Next Up (Milestone 4)

1. Provider profile page (`/providers/[id]`) with image carousel
2. Client request placement form
3. Firestore security rules deploy
4. Admin verification UI (optional)

## Known Gaps / Notes

- Marketplace shows all providers (verified + pending badge)
- Firestore rules not yet deployed — ensure dev rules allow reads/writes during testing
- `@hookform/resolvers` pinned to 4.1.3 (5.x install was corrupted on Windows)

## Blockers

None.
