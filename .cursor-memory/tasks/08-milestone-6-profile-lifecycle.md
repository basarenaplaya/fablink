# Milestone 6 — Profile Lifecycle

## Goal
Professional SaaS-grade profile lifecycle: unified WhatsApp on `users`, completion gate, workshop create/edit, account hub, premium job board, global Fournisseurs nav.

## Key decisions
- `users.whatsapp` = account contact for gating + request denormalization
- `providers.whatsapp` = business line on marketplace cards (may differ)
- Remove per-request WhatsApp form field; snapshot `clientWhatsapp` at post time
- `/become-provider` no longer redirects existing providers — edit mode via WorkshopForm

## Deliverables
- [x] UserProfile.whatsapp, ProviderProfile.updatedAt
- [x] updateUserProfile, updateProviderProfile, hasValidUserWhatsapp
- [x] ProfileGateProvider + WhatsappCompletionDialog in AppShell
- [x] WorkshopForm (create/edit) with portfolio image management
- [x] `/mon-compte` account hub (tabs: Profil, Activité)
- [x] RequestForm uses profile.whatsapp
- [x] JobBoardHero, JobBoardCard, RequestFileIcon, ClientAvatar
- [x] Fournisseurs nav + `/#annuaire` hash scroll + smooth scroll CSS
- [x] copy.ts: account, whatsappGate, workshop sections

## Routes
- `/mon-compte` — auth required account hub
- `/become-provider` — create or edit workshop (no redirect)

## Out of scope
- Firestore rules deploy
- Admin verification UI
- Cloudinary cleanup on portfolio image removal
