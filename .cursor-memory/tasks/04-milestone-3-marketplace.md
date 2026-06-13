# Task: Milestone 3 — Marketplace & Provider Onboarding

**Status:** Done (2026-06-13)

## Delivered

- `src/lib/constants.ts` — Tunisian cities, manufacturing categories, portfolio limits
- `src/lib/whatsapp.ts` — sanitize, validate, build wa.me URLs
- Plus Jakarta Sans typography (replaced Geist)
- `src/services/providers.service.ts`, extended `users.service.ts`, `upload.service.ts`, `analytics.service.ts`
- `src/hooks/useProviders.ts`, extended `useAuth` with `refreshProfile`
- Public marketplace home at `/` with filters, featured slider, provider cards
- Protected onboarding at `/onboarding` with multi-image Cloudinary upload
- Login `?redirect=` support

## Decisions

- Marketplace is public; onboarding requires auth
- Client-side provider filtering (no Firestore composite indexes for M3)
- All providers shown in feed; verified badge + featured slider for verified only
