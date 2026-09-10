# RecoverIQ — Day 5 Summary

Status: ✅ Complete — Authentication fully implemented and verified

## What Was Built

**Backend**
- `Dtos/LoginRequestDto.cs`, `Dtos/LoginResponseDto.cs` — request/response shapes for login
- `Controllers/AuthController.cs` — `POST /api/auth/login`, verifies BCrypt-hashed password, issues JWT (8-hour expiry, includes username + role claims)
- `Program.cs` updated: JWT Bearer authentication middleware registered, Swagger configured to accept a Bearer token for testing protected routes, seed logic switched from plaintext to `BCrypt.Net.BCrypt.HashPassword(...)`
- `appsettings.Development.json` — added JWT signing key, issuer, audience (gitignored, never committed)

**Frontend**
- `src/api.js` — base fetch client; automatically attaches `Authorization: Bearer <token>` when present
- `src/auth.js` — session helpers (`saveSession`, `getSession`, `clearSession`) using `localStorage`
- `src/Login.jsx` — login form, calls backend, redirects by role on success
- `src/NavBar.jsx` — role-aware navigation bar with logout
- `src/ProtectedRoute.jsx` — route guard; redirects to `/login` if not authenticated or role mismatch
- `src/App.jsx` — React Router wired: `/login`, `/runbooks` (Admin-only), `/my-drills` (TeamMember-only)
- `src/RunbookListPlaceholder.jsx`, `src/MyDrillsPlaceholder.jsx` — temporary placeholders, replaced by real screens in upcoming milestones

## Verified

- ✅ Correct login (`admin1`/`admin123`) → 200 + valid JWT (tested via Swagger and the real UI)
- ✅ Incorrect password → 401 with clear error message
- ✅ Admin login redirects to `/runbooks`; Team Member login redirects to `/my-drills`
- ✅ NavBar shows role-appropriate links and username
- ✅ Logout clears session and returns to login
- ✅ Direct URL access to a role-mismatched route (`TeamMember` visiting `/runbooks`) correctly redirects to login — `ProtectedRoute` confirmed working

## Issue Encountered & Resolved

`react-router-dom` was never actually installed (the Day 3 command was accidentally typed into the terminal as if it were code, not run as a command). Installed today (`npm install react-router-dom`) — resolved immediately, confirmed working.

## Demo Credentials (unchanged, now fully functional)

| Role | Username | Password |
|---|---|---|
| Admin | admin1 | admin123 |
| Team Member | member1 | member123 |

## Carries to Next Session

Per the realigned blueprint, next up is **Runbook CRUD (Admin)** — replacing `RunbookListPlaceholder.jsx` with the real Runbook List, Create, and Edit screens, backed by the `RunbookController` API endpoints designed in `API.md`.
