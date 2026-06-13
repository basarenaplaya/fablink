# MCP Toolset — Tunisia MFG Marketplace

Audited 2026-06-13. Use only what serves Next.js + Firebase + Cloudinary.

## ✅ Active (Use When Relevant)

| Server | Use For |
|--------|---------|
| `user-filesystem` | Arena file management, bulk reads/writes |
| `user-sequential-thinking` | Complex architectural breakdowns |
| `plugin-context7-plugin-context7` | Live docs: Next.js, React 19, Firebase, Zod |
| `plugin-shadcn-shadcn` | Install/audit shadcn components |
| `plugin-firebase-firebase` | SDK config, security rules, deploy, project mgmt |
| `plugin-cloudinary-*` | Env verification, asset mgmt, transformations |
| `cursor-ide-browser` | Manual UI verification during dev (when needed) |

### Firebase MCP Highlights

- `firebase_get_sdk_config` — verify web app config matches `.env.local`
- `firebase_get_security_rules` / deploy — Firestore rules iteration
- `developerknowledge_*` — Firebase Auth/Firestore patterns

### Cloudinary MCP Highlights

- `cloudinary-env-config` — validate env setup
- `cloudinary-docs` skill (via llms.txt) — signed upload implementation details
- `cloudinary-transformations` skill — portfolio image delivery URLs

## ⛔ Ignored (Global Leftovers)

Unless explicitly requested later:

- `user-mysql` — Firestore only
- `plugin-linear-linear`
- `plugin-sentry-sentry`
- `plugin-vercel-vercel`
- `user-eamodio.gitlens-extension-GitKraken`
- `user-Playwright`
- `user-firecrawl-mcp`
- `user-fetch`

## Skills Priority

1. `firebase-firestore` + `firebase-auth-basics` — any Firestore/Auth work
2. `nextjs` — App Router, API routes, Server Actions
3. `shadcn` — UI components
4. `cloudinary-docs` — upload signing
