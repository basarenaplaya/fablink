# Architecture Reference

## Layer Separation (React Native Portability)

```
┌─────────────────────────────────────────┐
│  src/app/*  src/components/*            │  UI only — layout, Tailwind, shadcn
│  Consumes hooks                         │
├─────────────────────────────────────────┤
│  src/hooks/*                            │  State, loading/error, data binding
│  No JSX                                 │
├─────────────────────────────────────────┤
│  src/services/*                         │  Pure TS — Firebase, API calls
│  No React, no DOM                       │
├─────────────────────────────────────────┤
│  src/lib/*                              │  SDK singletons (firebase.ts)
│  src/types/*                            │  Shared interfaces
└─────────────────────────────────────────┘
```

## Firestore Collections (MVP)

| Collection | Purpose |
|------------|---------|
| `users` | Auth-linked profiles (`client` \| `provider` \| `admin`) |
| `providers` | Marketplace listings, portfolio images, WhatsApp |
| `requests` | Client manufacturing requests + optional file upload |
| `analytics_clicks` | WhatsApp CTA tracking (providerId, categories, clientId) |

## Security Boundaries

| Concern | Client-safe | Server-only |
|---------|-------------|-------------|
| Firebase config | `NEXT_PUBLIC_FIREBASE_*` | — |
| Cloudinary cloud name + API key | `NEXT_PUBLIC_CLOUDINARY_*` | — |
| Cloudinary API secret | **NEVER** | `CLOUDINARY_API_SECRET` |
| Upload signing | Fetch signature from API route | Sign with secret in route |

## Upload Flow (Signed)

```
Client (hook/service)
  → POST /api/cloudinary-sign { folder, resourceType?, ... }
  ← { signature, timestamp, apiKey, cloudName, folder }
Client uploads directly to Cloudinary with signed params
  → stores secure_url in Firestore via service
```

## UI Standards

- Dark-by-default: zinc-950 / slate-950 backgrounds, zinc-800 borders
- Mobile-first: 44px min tap targets, safe-area insets
- `active:scale-95` on buttons, skeleton loaders to prevent CLS
- Glassmorphism: `backdrop-blur-md` on cards/nav
