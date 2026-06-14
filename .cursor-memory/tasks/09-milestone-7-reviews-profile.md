# Milestone 7 — Atelier Reviews & Profile Redesign

## Delivered
- `ProviderReview` type + `ratingAverage`/`ratingCount` on `ProviderProfile`
- `reviews.service.ts` — subcollection `providers/{id}/reviews/{clientId}`, transactional aggregates
- Review UI: StarRating, RatingSummary, ReviewCard, ReviewList, ReviewForm, ProviderReviewsSection
- Profile two-column layout: portfolio left (sticky), sidebar right, reviews below
- Marketplace cards + featured strip show compact ratings
- Provider list sorted: verified → rating → createdAt

## Rules
- Signed-in clients only (not atelier owner)
- One review per client per atelier (upsert by clientId)
- Rating 1–5 + comment 10–500 chars

## Out of scope
- Firestore rules deploy
- Admin moderation / delete reviews
