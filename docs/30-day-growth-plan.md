# RecoverIQ — 30-Day Growth Plan

A realistic, one-milestone-per-day roadmap taking RecoverIQ from v1.0 (the 10-day capstone) toward the "Next 3 Months" goals in `future-scope.md`. Each day builds on the previous one — nothing here requires re-architecting what already exists.

Use `daily-build-prompt.md` each day, changing only the day number.

## Week 1 — Close the Known Gaps (Days 1–7)

| Day | Milestone |
|---|---|
| 1 | Migrate off Render's ephemeral disk: set up a free Supabase Postgres instance, update `AppDbContext` to use `Npgsql` instead of SQLite, re-run migrations against the new DB |
| 2 | Update Render environment variables for the new Postgres connection string; verify data now survives a server restart |
| 3 | Add ASP.NET Core rate limiting middleware to `/api/auth/login` (the gap flagged in `SECURITY.md`) — max 5 attempts per IP per 5 minutes |
| 4 | Add a `Contact` model (Name, Email, Phone, linked to `Runbook`) + migration |
| 5 | Backend: `ContactController` CRUD endpoints, following the exact pattern of `RunbookController` |
| 6 | Frontend: add a Contacts section to `RunbookForm.jsx` (list + add/remove, same pattern as recovery steps) |
| 7 | Update `SCHEMA.md`, `API.md`, and README to reflect the new Contact feature; commit and deploy |

## Week 2 — Drill Scheduling (Days 8–14)

| Day | Milestone |
|---|---|
| 8 | Design `ScheduledDrill` table (RunbookId, RecurrenceDays, NextRunDate, AssignedToUserId) + migration |
| 9 | Backend: `ScheduledDrillController` — create/list/delete a schedule |
| 10 | Frontend: add a "Schedule Recurring Drill" button on the Runbook List, simple form (every N days) |
| 11 | Backend: a hosted background service (`IHostedService`) that checks daily for due schedules and calls the existing `ScenarioGeneratorService` |
| 12 | Test the background job locally by setting a schedule 1 minute in the future and confirming a drill auto-generates |
| 13 | Add a "Scheduled" tab to the Drills page showing upcoming scheduled drills |
| 14 | Deploy, verify the background job runs correctly on Render, update documentation |

## Week 3 — Audit Reports (Days 15–21)

| Day | Milestone |
|---|---|
| 15 | Research and install a free PDF generation library for .NET (e.g. QuestPDF, free/open-source tier) |
| 16 | Build a `DrillReportService` that takes a completed `DrillDetailDto` and produces a PDF matching the Drill Review screen's content |
| 17 | Backend: `GET /api/drill/{id}/report` endpoint returning the generated PDF |
| 18 | Frontend: add a "Download Report" button on `DrillReview.jsx` |
| 19 | Polish the PDF layout: header with runbook name/RTO/RPO, each step with situation/question/response, footer with generation date |
| 20 | Test with a real completed drill, verify formatting reads well printed |
| 21 | Deploy, update README with a screenshot of the report, commit |

## Week 4 — System Dependencies + Polish (Days 22–30)

| Day | Milestone |
|---|---|
| 22 | Add `RunbookDependency` join table (RunbookId, DependsOnRunbookId) + migration |
| 23 | Backend: endpoints to add/remove/list dependencies for a runbook |
| 24 | Frontend: simple dependency picker in `RunbookForm.jsx` ("This system depends on...") |
| 25 | Frontend: a basic dependency list view on the Runbook detail (text list is fine — a full graph visualization is a stretch goal, not required this month) |
| 26 | Full regression pass: re-run the Day 8 QA checklist against all new features (validation, error handling, empty states) |
| 27 | Add rate-limiting and Postgres-migration notes, and the three new features, to `ARCHITECTURE.md` and `PROJECT-STRUCTURE.md` |
| 28 | Accessibility pass on all new screens (keyboard nav, `aria-live` regions for the new forms), matching Day 8's standard |
| 29 | Update `README.md`, `future-scope.md` (mark 3-month items complete), and take fresh portfolio screenshots reflecting the new features |
| 30 | Tag and release **v1.1.0** on GitHub with full release notes summarizing the month's additions |

## How to Use This Plan

- Each day should take roughly the same time budget you used during the original 10-day sprint (~1hr weekdays, more on weekends) — don't feel obligated to rush.
- If a day runs long, it's fine to split it across two sessions — the plan is a guide, not a hard deadline.
- Skip a day's milestone only if it's genuinely blocked (e.g., waiting on a Supabase account setup) — reorder rather than abandon.
- At the end of each week, do a quick regression check on the core Day 1–10 flow (login → runbook → generate → drill → review) to make sure nothing broke.
