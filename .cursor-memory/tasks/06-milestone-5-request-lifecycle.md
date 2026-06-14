# Milestone 5 — Request Lifecycle & Client Workspace

**Status:** Complete (2026-06-13)

## Delivered

### Firestore query refinement
- `listPendingServiceRequests()` — `where('status', '==', 'pending')` at query level
- `listServiceRequests` kept as deprecated alias
- `useRequests` wired to pending-only query

### Client workspace
- `/my-requests` — auth + client/admin only
- `useMyRequests` hook with close/delete + refresh
- `MyRequestsView` + `MyRequestCard` with status badges, close, delete Dialog

### Lifecycle actions
- `closeServiceRequest(id, userId)` — sets `status: 'closed'` with ownership guard
- `deleteServiceRequest(id, userId)` — deletes doc with ownership guard
- Toast notifications on success/error

### Navigation
- "My Requests" in `UserMenu` and `AppHeader` for client/admin

## Auth routing

| Route | Access |
|-------|--------|
| `/requests` | Auth + provider (pending-only feed) |
| `/requests/new` | Auth + client |
| `/my-requests` | Auth + client/admin |

## Out of scope (deferred)

- Firestore security rules deploy
- Cloudinary asset cleanup on delete
- Real-time onSnapshot listeners

## Verification

- [x] `npm run build` passes
