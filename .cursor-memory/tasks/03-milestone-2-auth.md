# Task: Milestone 2 — Authentication & Security Gateway

**Status:** Done (2026-06-13)

## Delivered

- `src/lib/firebase-admin.ts` — server-only Admin SDK singleton, `verifyIdToken`, `extractBearerToken`
- `src/services/users.service.ts` — `getUserProfile`, `createUserProfile`
- `src/services/auth.service.ts` — Google sign-in, profile bootstrap (`role: 'client'`)
- `src/hooks/useAuth.ts` — auth state, `getIdToken`, signIn/signOut
- `src/app/api/cloudinary-sign/route.ts` — Bearer ID token verification (401 if missing/invalid)
- `src/services/upload.service.ts` — requires `idToken` param for sign requests
- `src/app/login/page.tsx` — premium dark glassmorphic login UI
- shadcn `card`, `skeleton` installed; layout forced `dark` class

## Env vars required

- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (with `\\n` escaped newlines)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## Next (M3)

- Firestore security rules
- Home / marketplace screens
- Provider onboarding flow
