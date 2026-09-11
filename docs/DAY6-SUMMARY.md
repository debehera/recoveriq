# RecoverIQ — Day 6 Summary (MVP Complete)

Status: ✅ Complete — Full MVP built, deployed, and verified live

## Live Demo

- **App:** https://recoveriq-app.netlify.app
- **API:** https://recoveriq-api.onrender.com (Swagger: `/swagger`)
- **Demo accounts:** `admin1`/`admin123` (Admin), `member1`/`member123` (Team Member)

**Note:** Backend runs on Render's free tier with no persistent disk — the database resets on server restart/redeploy (which happens automatically after ~15 min of inactivity). Demo accounts always reseed correctly; any runbooks/drills created will be lost if the server idles out. Recreate a demo runbook before a live walkthrough.

## What Was Built Today

**Runbook CRUD (Admin)**
- `Dtos/RunbookDtos.cs`, `Controllers/RunbookController.cs` — full create/list/edit/delete
- `RunbookList.jsx`, `RunbookForm.jsx` — real screens replacing Day 5's placeholder

**Drill Data Models + Users Endpoint**
- `Models/Drill.cs`, `DrillStep.cs`, `DrillResponse.cs` — migrated
- `Controllers/UsersController.cs` — lists Team Members for drill assignment

**AI Scenario Generation**
- Switched from OpenAI (paid) to **Google Gemini API** (free tier) per today's constraint
- `Services/IScenarioGeneratorService.cs`, `ScenarioGeneratorService.cs` — builds a prompt from runbook context, calls Gemini, parses structured JSON response
- `Controllers/DrillController.cs` — generate, list, detail, and step-response endpoints
- Debugged through 3 rounds of Gemini model deprecation live (`gemini-2.0-flash` → `gemini-flash-latest` → `gemini-2.5-flash` → `gemini-3.6-flash`, the last one confirmed working)

**Drill Execution & Review (Frontend)**
- `MyDrills.jsx`, `DrillRunner.jsx` — Team Member step-by-step guided drill experience with progress dots and completion state
- `DrillList.jsx`, `DrillReview.jsx` — Admin drill history and full scenario+response review

**Required Footer**
- `Footer.jsx` — "Built with Claude as part of the AB Talks 60-Day Claude AI Challenge." on every screen, confirmed visible on the live deployed site

**Deployment**
- Backend: Dockerized, deployed to **Render** (free Web Service tier)
- Frontend: Deployed to **Netlify** (free tier), public URL confirmed accessible
- Environment variables configured on both platforms (JWT keys, Gemini key, DB path, CORS origin)

## Bugs Found & Fixed Today

| Bug | Fix |
|---|---|
| Gemini model names changing/deprecating mid-session | Iterated to `gemini-3.6-flash`, the currently valid model per Google's own error messages |
| Render free tier has no persistent disk | Accepted as a known limitation; documented in this file and the live demo notes |
| Production 500 error on login | `AuthController.GenerateJwtToken()` read the JWT signing key only from `IConfiguration`, which has no value in production (no `appsettings.Development.json` there). Fixed to fall back to `Environment.GetEnvironmentVariable(...)`, matching the pattern already used in `Program.cs` |
| Database path (`/var/data/...`) didn't exist on Render's free tier | Changed to `/app/recoveriq.db` via `DB_PATH` environment variable |

## Full Verified User Flow (Live Site)

1. ✅ Admin logs in
2. ✅ Admin creates a runbook (name, system, RTO/RPO, steps)
3. ✅ Admin clicks "Generate Drill" → real Gemini API call → structured scenario saved
4. ✅ Team Member logs in, sees the assigned drill
5. ✅ Team Member works through all steps, submits responses
6. ✅ Drill status auto-updates to "Completed"
7. ✅ Admin reviews the completed drill (scenario + all responses)
8. ✅ Footer visible on every screen

## Carries to Next Session

Per the blueprint, remaining polish items (not blocking the MVP, but worth addressing before final submission):
- Visual/UI polish pass (current styling is functional but basic)
- Handle the free-tier database reset limitation more gracefully in the UI (e.g., a note on the login screen)
- Final documentation pass across all `docs/` files to ensure they match the deployed reality
- Consider a lightweight "wake up the server" loading state on first login, since Render free tier cold-starts can take 30-50 seconds after inactivity
