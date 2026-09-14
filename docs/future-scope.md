# RecoverIQ — Future Scope

How this specific project could evolve beyond v1.0, grounded in the actual architecture and decisions made during the 10-day build.

## Next 3 Months — Strengthen the Core

**Goal:** Turn the v1.0 demo into something a real small team could actually rely on.

- **Persistent production database.** Move off Render's free-tier ephemeral disk onto a real persistent option (Render's paid disk tier, or migrate to a managed Postgres like Supabase's free tier, which was already on the "allowed tools" list from Day 6). This removes the single biggest asterisk on the current deployment.
- **Contacts & responsibility mapping** (deferred from the original PRD scope). Add a `Contact` entity linked to Runbooks — who owns each recovery step, with an email/phone field. Directly extends the existing `RunbookStep` model.
- **Drill scheduling.** A lightweight `ScheduledDrill` table + a daily check (even a simple cron-style background job) that auto-generates and assigns a drill on a recurring cadence — turning RecoverIQ from "generate on demand" into "ongoing compliance tool."
- **Rate limiting on login**, flagged as an intentional gap in `SECURITY.md` — a small, well-scoped addition (ASP.NET Core's built-in `RateLimiter` middleware) that closes the one honestly-documented security gap.
- **Exportable PDF audit reports** for completed drills — using the `pdf` skill/pattern already proven useful for this kind of document generation, pulling from the existing `DrillDetailDto`.

## Next 6 Months — Expand the Product Surface

**Goal:** Move from "one team, one tool" to something that could plausibly support multiple teams/departments.

- **System dependency mapping.** Add a `RunbookDependency` join table (`Runbook A depends on Runbook B`) and a visual dependency graph — directly extends the schema without breaking existing data.
- **Live/reactive AI drills** (the feature deliberately deferred on Day 1 for scope reasons). Now that the "generate once" pattern is proven and battle-tested, this becomes a natural v2 differentiator: AI evaluates a Team Member's response in real time and branches the next step accordingly, using the same `ScenarioGeneratorService` abstraction, extended with a second, narrower "evaluate and continue" prompt.
- **Multi-tenant support.** Add an `Organization` entity above `User`, so RecoverIQ could genuinely be offered to more than one company — the two-role auth model built in Day 5 extends cleanly to "Organization Admin" and "Organization Member."
- **Self-registration with email verification**, replacing the seeded-demo-account model — the natural next step once there's a real reason for more than 2 users.

## Next 12 Months — Compliance-Grade Product

**Goal:** Make the "audit-ready evidence" pitch from the original PRD actually true at an enterprise level.

- **SOC 2 / ISO 27001-aligned reporting**, generating the specific evidence artifacts auditors ask for (drill frequency, response times, completion rates) directly from the `Drill`/`DrillResponse` data already being captured since Day 6.
- **SSO integration** (SAML/OIDC) — replacing the JWT-only auth for enterprise customers who require it, while keeping the existing JWT flow for smaller teams.
- **Notification system** (email/Slack) when a drill is assigned, overdue, or completed — the natural complement to drill scheduling from the 3-month plan.
- **A public API tier**, formalizing the Swagger-documented API (already public today, per the Day 9 security review) into a genuine integration point for other tools.

## What Stays the Same

Regardless of how far this grows, three Day 1 decisions remain the right ones and shouldn't change:
- **AI generates once, upfront** — not live/reactive by default. Predictability and cost control matter more than "impressive" for a compliance tool.
- **Two clear roles, not a permissions matrix** — simplicity is a feature for a tool meant to be used *during* a real incident.
- **Free-tier-first architecture** — even as the product matures, keeping a genuinely free/cheap path to try it lowers the barrier for the exact audience (mid-size companies without dedicated DR budgets) the PRD identified on Day 1.
