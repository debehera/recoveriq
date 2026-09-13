# Security Considerations

RecoverIQ is a portfolio/capstone project. This document is transparent about its security posture — what's implemented, and what's intentionally out of scope for a project at this stage.

## Implemented

- **Password hashing:** BCrypt, never stored or logged in plaintext.
- **Authentication:** JWT bearer tokens, 8-hour expiry, signed with a key stored as an environment variable (never committed to source control).
- **Authorization:** Role-based access control enforced server-side on every protected endpoint (`[Authorize(Roles = "Admin")]` etc.) — the frontend's route guards are a UX convenience, not the actual security boundary.
- **CORS:** Restricted to explicit known origins (local dev + the deployed frontend URL), not a wildcard.
- **SQL injection:** Not applicable — all data access goes through Entity Framework Core's parameterized queries; no raw SQL is used anywhere in the codebase.
- **Secrets management:** All API keys and signing keys are environment variables in production and gitignored locally; verified not present in Git history.
- **Transport security:** Both the frontend (Netlify) and backend (Render) are served over HTTPS by default.
- **Error handling:** A global exception handler ensures internal error details (stack traces, exception types) are never returned to the client — only safe, generic messages, with full detail logged server-side only.

## Intentionally Out of Scope (for this project's stage)

- **Rate limiting / brute-force protection on login** — not implemented. For a production system handling real user accounts, this would be a required addition (e.g., account lockout after N failed attempts, or a rate limiter middleware).
- **Swagger UI is publicly accessible in production** — left enabled intentionally so the API can be demonstrated directly. In a real production deployment handling sensitive data, this would typically be restricted to internal/authenticated access only.
- **No self-registration** — only two seeded demo accounts exist, by design (per the PRD's v1.0 scope), which sidesteps a class of account-creation abuse concerns entirely.
- **No refresh tokens** — sessions simply expire after 8 hours and require re-login; a production system might implement refresh tokens for a smoother long-session experience.

## Reporting

This is a non-commercial capstone project. If you spot a genuine security issue, feel free to open a GitHub issue.
