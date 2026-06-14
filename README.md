# FabLink

Place de marché tunisienne pour l'impression 3D, l'usinage CNC et la fabrication PCB.

**Production:** [https://fablink.vercel.app](https://fablink.vercel.app)

## Stack

- Next.js 16 (App Router)
- Firebase Auth + Firestore
- Cloudinary (signed uploads)
- Vercel (hosting)

## Local setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

Fill in values from your Firebase project (`fablink-tunisie`) and Cloudinary dashboard.

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Firebase — Google sign-in (required for production)

If Google login fails with `auth/unauthorized-domain`, add your site hostname to Firebase:

1. Open [Firebase Console](https://console.firebase.google.com/) → project **`fablink-tunisie`**
2. Go to **Authentication → Settings → Authorized domains**
3. Click **Add domain** and add:
   - `fablink.vercel.app` (production)
   - `localhost` (local dev — usually already present)
4. If you add a custom domain later (e.g. `fablink.app`), add it here too
5. Ensure **Authentication → Sign-in method → Google** is enabled

`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` must stay `fablink-tunisie.firebaseapp.com` — that is the Firebase auth host, not your website URL.

Preview deployments on Vercel use unique URLs (`fablink-git-….vercel.app`). Firebase does not support wildcards; test Google auth on production or localhost.

## Deploy to Vercel

Environment variables are synced from `.env.local`:

```bash
npm run deploy:vercel
```

Or push to `master` — the GitHub repo is linked to Vercel for automatic production deploys.

After each deploy, confirm authorized domains in Firebase if you use a new hostname.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run deploy:vercel` | Push env vars + deploy to Vercel production |

## Repository

[https://github.com/basarenaplaya/fablink](https://github.com/basarenaplaya/fablink)
