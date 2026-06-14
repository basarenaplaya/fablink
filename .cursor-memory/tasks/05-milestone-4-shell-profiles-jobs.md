# Milestone 4 — Global Shell, Profiles & Job Board

**Status:** Complete (2026-06-13)

## Delivered

### Global navigation
- `AppShell`, `AppHeader`, `UserMenu` wired in `layout.tsx`
- Session-aware avatar dropdown with role-based links
- Guest: Sign In + List your business
- Sticky glassmorphic header (`z-50`)

### Standalone provider profiles
- `/providers/[id]` — public profile page
- `PortfolioGallery` (horizontal snap) + `PortfolioLightbox` (Dialog)
- `StickyWhatsAppBar` on mobile
- `useProvider` hook

### Job board MVP loop
- Extended `ServiceRequest`: `title`, `clientName`, `clientWhatsapp`
- `buildProviderWhatsAppUrl` + `buildClientJobWhatsAppUrl`
- `requests.service.ts` — `createServiceRequest` (setDoc with client UUID), `listServiceRequests`
- `uploadRequestFile` — raw Cloudinary, `requests/{userId}/{requestId}`
- `/requests/new` — client-only form with optional CAD file
- `/requests` — provider job board with filters + WhatsApp CTA

### Marketplace updates
- `ProviderCard` — View Profile + WhatsApp
- `FeaturedProviders` — links to `/providers/[id]`
- `MarketplaceHeader` — search + title only (CTA moved to global header)
- Home filter bar `top-14` for header offset

### shadcn added
- dropdown-menu, avatar, dialog, carousel, sheet

## Auth routing

| Route | Access |
|-------|--------|
| `/` | Public |
| `/providers/[id]` | Public |
| `/requests/new` | Auth + client (providers → `/requests`) |
| `/requests` | Auth + provider (clients → `/requests/new`) |

## Out of scope (deferred)

- Firestore security rules deploy
- Admin verification UI
- Client request edit/delete

## Verification checklist

- [ ] Header: guest vs logged-in states
- [ ] Profile page gallery + lightbox + sticky WhatsApp
- [ ] Client posts job with WhatsApp + optional file
- [ ] Provider sees job board, downloads file, WhatsApp uses client number
- [x] `npm run build` passes
