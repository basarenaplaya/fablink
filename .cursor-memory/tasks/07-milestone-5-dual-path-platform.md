# Milestone 5b — High-Conversion Dual-Path Platform

**Status:** Complete (2026-06-13)

## Delivered

### French-first copy system
- `src/lib/copy.ts` — centralized French UI strings
- Category labels in French via `constants.ts`

### Professional landing homepage
- `LandingHero`, `CategoryShowcase`, `HowItWorks`, `WorkshopCallout`, `SiteFooter`
- Directory section at `#annuaire` with existing provider feed
- Hero search wired to marketplace filters; category cards pre-filter + scroll

### Dual-path authentication
- `/signup/client` — client-focused Google sign-in
- `/login` → redirects to `/signup/client` (preserves query)
- `/become-provider` — B2B marketing funnel + benefits + onboarding form
- `/onboarding` → redirects to `/become-provider`

### Request lifecycle (prior M5 + FR polish)
- `/my-requests` with Marquer comme résolu / Supprimer
- Pending-only job board query
- French toasts and status badges

### Navigation
- Guest: Se connecter + Devenir fournisseur
- Client: Publier une demande, Mes demandes, Parcourir les ateliers

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing + annuaire |
| `/signup/client` | Client sign-in |
| `/become-provider` | Provider funnel |
| `/my-requests` | Client request workspace |
| `/login` | Redirect to client signup |

## Verification

- [x] `npm run build` passes
