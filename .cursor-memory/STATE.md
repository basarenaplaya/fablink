# Project State

**Last updated:** 2026-06-13 (Session 10 — Nav, Phone Display & Tunisia Phone Input)

## Current Phase

Milestone 8 — Firestore rules, admin verification (next)

## Completed

- [x] M1–M6: full marketplace, requests, profile lifecycle, UX polish
- [x] **M7:** Client reviews (1–5 stars + comment) on ateliers
- [x] **M7:** Denormalized `ratingAverage` / `ratingCount` on provider docs
- [x] **M7:** Two-column atelier profile (portfolio left, details right, reviews below)
- [x] **M7:** Rating summary on ProviderCard + FeaturedProviders
- [x] **M7:** Provider directory sort by verified then rating
- [x] **Nav UX:** `useNavLinks` + `AppMobileNav` sheet; `lg` breakpoint; no duplicate Fournisseurs
- [x] **Phone UX:** `TunisiaPhoneInput` (+216 prefix), phone utils, Appeler `tel:` CTAs on job board + profiles

## In Progress

- None

## Next Up (Milestone 8)

1. Firestore security rules deploy (include reviews subcollection)
2. Admin verification UI + optional review moderation
3. Optional: i18n framework if bilingual needed later

## Known Gaps / Notes

- French-only hardcoded copy (no locale switcher)
- Firestore rules not deployed
- Review delete / admin moderation deferred
- Orphaned Cloudinary files on request delete / portfolio image removal

## Blockers

None.
