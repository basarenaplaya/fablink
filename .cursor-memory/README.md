# Thinking Arena — Tunisia MFG Marketplace

Autonomous memory space for architectural continuity across chat sessions.

## File Index

| File | Purpose |
|------|---------|
| `STATE.md` | Live project status, blockers, last session |
| `ARCHITECTURE.md` | Layer rules, data flow, security boundaries |
| `MCP_TOOLSET.md` | Relevant vs ignored MCP tools for this stack |
| `ROADMAP.md` | Phased MVP build order |
| `tasks/01-firebase-client.md` | Plan for `src/lib/firebase.ts` |
| `tasks/02-cloudinary-sign-route.md` | Plan for `src/app/api/cloudinary-sign/route.ts` |
| `SESSION_LOG.md` | Chronological decision log |

## Engagement Rule

- **Start of every prompt**: Read `STATE.md` + relevant `tasks/*` for active work.
- **End of every task**: Update `STATE.md`, append `SESSION_LOG.md`, refine task files.

## Spec Reference

- Rules: `.cursorrules` (root)
- Product spec: `.cursor/Project_spec.md` (note: `.cursorrules` references `PROJECT_SPEC.md` at root — actual file lives under `.cursor/`)
