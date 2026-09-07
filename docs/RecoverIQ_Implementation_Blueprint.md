# RecoverIQ — Implementation Blueprint (Days 2–10)

**Single source of truth for the remainder of the capstone.**
Project: RecoverIQ — AI-assisted BCDR tabletop drill platform
Stack (to be finalized/confirmed Day 2): .NET Core Web API backend + React (or HTML/JS) frontend + lightweight DB + OpenAI API
Roles: Admin, Team Member (seeded demo accounts, no self-registration)
Schedule: Weekdays ≈ 1 hour (small isolated tasks). Weekends = heavier setup/integration/deployment days.

> **How to use this document:** Each day is self-contained. If you start a fresh AI conversation on any given day, paste that day's section (plus "Handoff Notes" from the previous day) and the assistant should be able to continue building without re-deciding architecture.

---

## Day 1 (Sat) — ✅ COMPLETE
Discovery, scope, PRD, this blueprint, pitch deck. No code written. Foundation locked.

---

## Day 2 (Sun) — ✅ COMPLETE — System Design Addendum

Day 2 produced a full technical blueprint before any code was written. These decisions are now final and override any "TBD" language elsewhere in this document:

- **GitHub repo created and cloned:** `debehera/recoveriq`, initial skeleton folders (`RecoverIQ.Api/`, `recoveriq-web/`, `docs/`, `scratch/`) committed.
- **Hosting locked (originally deferred to Day 8-9):** Backend → **Render** (free tier, Web Service, persistent disk — required for the SQLite file). Frontend → **Netlify** (free tier, auto-deploy from GitHub). This was moved earlier than planned because SQLite's persistence requirement needed to inform the hosting choice, not the other way around.
- **Full design docs produced** (all in `docs/`): `ARCHITECTURE.md` (component diagram, data flow, request lifecycle, AI interaction detail), `SCHEMA.md` (full ER diagram + table definitions, validated against every PRD user story), `API.md` (all 10 v1.0 endpoints fully specified — request/response/validation/errors), `UI-WIREFRAMES.md` (7 screens, user flow, low-fi wireframes), `PROJECT-STRUCTURE.md` (target folder layout for the whole project).
- **Simplification applied to Day 9:** seeding is now handled by the same startup guard logic (`if (!context.Users.Any())`) in both Development and Production — no separate manual production-seeding step required. (Reflected in Day 9 below.)

**Day 3 starts immediately with implementation — no further planning needed.** Use `docs/SCHEMA.md` as the exact reference for entity fields when building Day 3's `Models/`.

---

## Day 2 (Sun) — Tech Stack Finalization, Project Setup & Environment

### 🎯 Objective
Finalize the exact tech stack, scaffold the project (backend + frontend), set up the database, and get "Hello World" running end-to-end (frontend calls backend calls DB).

### 📖 What I'll learn
- How a .NET Core Web API project is structured
- How to connect a React or HTML/JS frontend to a local API
- Basic Entity Framework Core setup with a lightweight database

### 🛠 Features to build
- Empty but running backend API project
- Empty but running frontend project
- Database created with initial connection working
- One test endpoint (`GET /api/health`) returning `{status: "ok"}`, displayed on the frontend

### 📝 Step-by-step implementation plan
1. Install/confirm .NET SDK (latest LTS) and Node.js are installed.
2. Create solution: `dotnet new webapi -n RecoverIQ.Api` — this is the backend.
3. Add Entity Framework Core with SQLite (file-based, zero-config, free, perfect for a 10-day project — avoids needing a hosted DB server). Packages: `Microsoft.EntityFrameworkCore.Sqlite`, `Microsoft.EntityFrameworkCore.Design`.
4. Create `RecoverIQ.Api/Data/AppDbContext.cs` (empty `DbContext` for now, just to prove connection).
5. Add a `HealthController` with `GET /api/health` returning a static JSON status.
6. Run backend locally (`dotnet run`), confirm `https://localhost:xxxx/api/health` works in browser.
7. Create frontend: `npx create-react-app recoveriq-web` (or plain `index.html` + `app.js` if you prefer less tooling — pick ONE and stick with it for all 10 days).
8. In frontend, fetch `/api/health` on load and display the result on screen.
9. Configure CORS in the API (`AddCors`) to allow the frontend's local port.
10. Initialize Git repo at project root; create `.gitignore` (use the standard VisualStudio + Node template); make first commit.

### 📂 Files and folders to create or modify
```
/RecoverIQ
  /RecoverIQ.Api
    Program.cs
    /Controllers/HealthController.cs
    /Data/AppDbContext.cs
    appsettings.json
  /recoveriq-web
    /src/App.js
    /src/api.js  (fetch helper)
  .gitignore
  README.md
```

### 🔗 APIs, libraries, services, tools to integrate
- EF Core + SQLite (`Microsoft.EntityFrameworkCore.Sqlite`)
- React (via create-react-app) OR plain HTML/JS with `fetch()`
- Git for version control

### 🧪 Testing tasks
- Confirm `dotnet run` starts with no errors
- Confirm `/api/health` returns 200 OK with JSON body
- Confirm frontend displays "ok" status pulled live from the backend (proves the full chain works)

### 🐞 Common issues and debugging tips
- **CORS errors in browser console** → confirm `app.UseCors()` is called before `app.MapControllers()` in `Program.cs`, and the policy allows your frontend's exact origin/port.
- **SQLite file not created** → make sure a migration was run (`dotnet ef migrations add Init` then `dotnet ef database update`) even for an empty DbContext.
- **Port mismatch** → note down the exact port `dotnet run` prints and hardcode it in the frontend's fetch URL for now (env variables come later).

### ✅ End-of-day checklist
- [ ] Backend runs locally without errors
- [ ] `/api/health` endpoint returns JSON
- [ ] Frontend runs locally and displays the health check result
- [ ] SQLite database file exists in the project
- [ ] Git repo initialized with first commit pushed

### 📸 Expected project state and screenshots to capture
- Screenshot of terminal showing `dotnet run` success
- Screenshot of browser showing frontend displaying "ok" from the API
- Screenshot of project folder structure

### ➡️ Handoff notes for Day 3
Stack is locked: .NET Core Web API + SQLite/EF Core + [React or HTML/JS — confirm which you chose]. Health check flow proven end-to-end. Next: build the data models and database tables for Users and Runbooks.

---

## Day 3 (Mon, ~1hr) — Data Models: Users & Runbooks

### 🎯 Objective
Define the core database entities (User, Runbook, RunbookStep) and get them into the database via EF Core migrations.

### 📖 What I'll learn
- How to design entity classes and relationships in EF Core
- How migrations turn C# classes into real database tables

### 🛠 Features to build
- `User` entity (Id, Username, PasswordHash, Role)
- `Runbook` entity (Id, Name, SystemName, RTO, RPO, CreatedByUserId)
- `RunbookStep` entity (Id, RunbookId, StepOrder, Description)

### 📝 Step-by-step implementation plan
1. Create `Models/User.cs`, `Models/Runbook.cs`, `Models/RunbookStep.cs` with properties per PRD section 6.1–6.2.
2. Add `DbSet<User>`, `DbSet<Runbook>`, `DbSet<RunbookStep>` to `AppDbContext`.
3. Configure relationship: one Runbook has many RunbookSteps (`OnModelCreating` or data annotations).
4. Run `dotnet ef migrations add AddCoreEntities` then `dotnet ef database update`.
5. Manually seed 2 demo users directly via a small seed method in `Program.cs` (or a migration seed): one Admin, one Team Member — plain-text passwords are fine for now, hashing comes Day 4.

### 📂 Files and folders to create or modify
```
/RecoverIQ.Api/Models/User.cs
/RecoverIQ.Api/Models/Runbook.cs
/RecoverIQ.Api/Models/RunbookStep.cs
/RecoverIQ.Api/Data/AppDbContext.cs (updated)
/RecoverIQ.Api/Program.cs (seed logic)
```

### 🔗 Tools to integrate
EF Core Migrations (CLI: `dotnet ef`)

### 🧪 Testing tasks
- Confirm migration runs without errors
- Open the SQLite file with a DB browser (e.g., "DB Browser for SQLite") and confirm tables + seeded users exist

### 🐞 Common issues and debugging tips
- **"No DbContext found" on migration** → run the `dotnet ef` command from inside the `.Api` project folder, not the solution root.
- **Duplicate seed data on every restart** → guard seeding logic with an `if (!context.Users.Any())` check.

### ✅ End-of-day checklist
- [ ] 3 entities created and migrated
- [ ] 2 seed users visible in the database (1 Admin, 1 Team Member)

### 📸 Expected project state and screenshots
- Screenshot of DB Browser showing Users table with 2 rows

### ➡️ Handoff notes for Day 4
Data models exist and are seeded. Next: build login/authentication so the seeded users can actually sign in.

---

## Day 4 (Tue, ~1hr) — Authentication (Login Only)

### 🎯 Objective
Implement login for the two seeded accounts using JWT tokens, and a basic login screen on the frontend.

### 📖 What I'll learn
- JWT-based authentication in .NET Core
- Protecting API routes by role

### 🛠 Features to build
- `POST /api/auth/login` (username + password → JWT token containing role claim)
- Password hashing (BCrypt) applied to seeded users
- Frontend login form storing the token (localStorage) and attaching it to future requests

### 📝 Step-by-step implementation plan
1. Add `BCrypt.Net-Next` package; update seed logic to store hashed passwords.
2. Add JWT packages (`Microsoft.AspNetCore.Authentication.JwtBearer`); configure in `Program.cs` with a signing key in `appsettings.json`.
3. Create `AuthController` with `POST /api/auth/login`: verify password hash, issue JWT with `role` claim (Admin/TeamMember).
4. Add `[Authorize]` / `[Authorize(Roles = "Admin")]` attributes as placeholders on future controllers.
5. Frontend: build a simple login form (username/password), call `/api/auth/login`, store returned token, redirect based on role.
6. Create an `authFetch` helper that attaches `Authorization: Bearer <token>` to all future API calls.

### 📂 Files and folders to create or modify
```
/RecoverIQ.Api/Controllers/AuthController.cs
/RecoverIQ.Api/Program.cs (JWT config)
/recoveriq-web/src/Login.js
/recoveriq-web/src/authFetch.js
```

### 🔗 APIs, libraries, services, tools to integrate
`BCrypt.Net-Next`, `Microsoft.AspNetCore.Authentication.JwtBearer`

### 🧪 Testing tasks
- Log in as Admin → confirm token received and role claim correct (decode at jwt.io to verify)
- Log in as Team Member → same check
- Try wrong password → confirm 401 response

### 🐞 Common issues and debugging tips
- **401 on every request after login** → check the JWT signing key in `Program.cs` matches between token creation and validation config.
- **Role claim not recognized by `[Authorize(Roles=...)]`** → ensure the claim type used is `ClaimTypes.Role` specifically, not a custom string key.

### ✅ End-of-day checklist
- [ ] Both demo accounts can log in successfully
- [ ] Invalid login is rejected
- [ ] Token stored on frontend and attached to subsequent requests

### 📸 Expected project state and screenshots
- Screenshot of login screen
- Screenshot of browser dev tools Network tab showing Authorization header on a request

### ➡️ Handoff notes for Day 5
Auth works end-to-end. Next: build Runbook CRUD (Admin-only) on top of this auth.

---

## Day 5 (Wed, ~1hr) — Runbook CRUD (Admin)

### 🎯 Objective
Let Admin create, view, edit, and delete runbooks with recovery steps and RTO/RPO.

### 🛠 Features to build
- `RunbookController`: `GET /api/runbooks`, `GET /api/runbooks/{id}`, `POST /api/runbooks`, `PUT /api/runbooks/{id}`, `DELETE /api/runbooks/{id}` — all `[Authorize(Roles="Admin")]`
- Frontend: Runbook list page, Create/Edit runbook form (dynamic list of steps, RTO/RPO fields)

### 📝 Step-by-step implementation plan
1. Create DTOs: `RunbookCreateDto`, `RunbookResponseDto` (avoid exposing EF entities directly).
2. Implement the 5 CRUD endpoints in `RunbookController`, including nested `RunbookStep` create/update logic.
3. Frontend: `RunbookList.js` — table of runbooks (Name, System, RTO, RPO, Actions).
4. Frontend: `RunbookForm.js` — form with dynamic "add step" button (ordered text inputs) + RTO/RPO number inputs.
5. Wire up navigation: after login as Admin, land on Runbook List page.

### 📂 Files and folders to create or modify
```
/RecoverIQ.Api/Controllers/RunbookController.cs
/RecoverIQ.Api/Dtos/RunbookCreateDto.cs
/RecoverIQ.Api/Dtos/RunbookResponseDto.cs
/recoveriq-web/src/RunbookList.js
/recoveriq-web/src/RunbookForm.js
```

### 🧪 Testing tasks
- Create a runbook with 3 steps + RTO/RPO → confirm it saves and appears in the list
- Edit an existing runbook → confirm changes persist
- Delete a runbook → confirm it's removed
- Confirm a Team Member token gets 403 Forbidden on these endpoints

### 🐞 Common issues and debugging tips
- **Steps not saving in correct order** → make sure `StepOrder` is explicitly set from the array index on save, not assumed from insertion order.
- **403 for Admin too** → double check the JWT role claim string matches exactly what `[Authorize(Roles="Admin")]` expects (case-sensitive).

### ✅ End-of-day checklist
- [ ] Admin can create, edit, delete runbooks with steps + RTO/RPO
- [ ] Team Member correctly blocked from these endpoints

### 📸 Expected project state and screenshots
- Screenshot of runbook list with at least 2 sample runbooks
- Screenshot of the create/edit form

### ➡️ Handoff notes for Day 6
Runbook management is complete — this is the input data for AI scenario generation, which is Day 6's focus (the most important feature day).

---

## Day 6 (Thu, ~1hr) — OpenAI API Setup & Prompt Design (No Integration Yet)

> Kept deliberately light on weekday time: today is about getting the API key working and designing/testing the prompt manually, so Day 8 (weekend) can focus purely on wiring it into the app.

### 🎯 Objective
Get an OpenAI API key working, and design + manually test the exact prompt that turns a runbook into a structured tabletop scenario.

### 📖 What I'll learn
- How to call the OpenAI API from a simple script
- How to design a prompt that reliably returns structured JSON

### 🛠 Features to build
- A standalone console script (not part of the app yet) that sends a sample runbook to OpenAI and prints back a structured scenario

### 📝 Step-by-step implementation plan
1. Sign up for an OpenAI API account and generate an API key (manual step — I will guide you through this if needed).
2. Store the key somewhere safe locally (NOT committed to Git) — e.g., `RecoverIQ.Api/appsettings.Development.json` (add this file to `.gitignore`).
3. Write a small standalone Node or C# console script that calls the Chat Completions endpoint with a test prompt.
4. Design the prompt: instruct the model to return ONLY valid JSON with this shape:
   ```json
   {
     "title": "string",
     "premise": "string",
     "steps": [
       { "stepOrder": 1, "situation": "string", "question": "string" }
     ]
   }
   ```
   Include the runbook's system name, recovery steps, and RTO/RPO as context so the scenario is relevant to that specific runbook.
5. Test the script with 2-3 different sample runbooks; adjust prompt wording until output is consistently valid JSON with 4-6 steps.
6. Save your final prompt template in a text file for reuse on Day 8.

### 📂 Files and folders to create or modify
```
/scratch/test-openai.js  (throwaway test script, not part of main app)
/RecoverIQ.Api/appsettings.Development.json  (API key — gitignored)
/docs/scenario-prompt-template.txt
```

### 🔗 APIs, libraries, services, tools to integrate
OpenAI API (Chat Completions endpoint, a cost-efficient model such as gpt-4o-mini)

### 🧪 Testing tasks
- Run the test script 3 times with different runbook inputs → confirm valid JSON returned each time
- Confirm API key is NOT visible anywhere in Git history

### 🐞 Common issues and debugging tips
- **Model returns JSON wrapped in markdown code fences** → add explicit instruction "respond with raw JSON only, no markdown" and/or strip ```` ```json ```` fences in code before parsing.
- **Inconsistent step count** → explicitly instruct "generate between 4 and 6 steps" in the prompt.
- **API key accidentally committed** → add the settings file to `.gitignore` BEFORE first commit that touches it; if already committed, rotate the key.

### ✅ End-of-day checklist
- [ ] OpenAI API key working and tested
- [ ] Prompt template finalized and saved
- [ ] Script reliably returns valid, parseable JSON

### 📸 Expected project state and screenshots
- Screenshot of terminal showing successful API call + JSON output

### ➡️ Handoff notes for Day 7
Prompt is designed and tested standalone. Next: build the Drill and DrillResponse data models so there's somewhere to store generated scenarios and team responses, ready for Day 8's integration.

---

## Day 7 (Fri, ~1hr) — Drill Data Models

### 🎯 Objective
Create the database structures to store generated scenarios and team member responses.

### 🛠 Features to build
- `Drill` entity (Id, RunbookId, Title, Premise, Status [Generated/InProgress/Completed], CreatedAt, AssignedToUserId)
- `DrillStep` entity (Id, DrillId, StepOrder, Situation, Question)
- `DrillResponse` entity (Id, DrillStepId, ResponseText, SubmittedAt)

### 📝 Step-by-step implementation plan
1. Create the three entity classes per the fields above.
2. Add relationships: Drill → many DrillSteps; DrillStep → one DrillResponse (optional/nullable until answered).
3. Add `DbSet`s to `AppDbContext`; run migration `AddDrillEntities`.
4. Create basic (unauthenticated-for-now, secure later) `DrillController` stub with just `GET /api/drills` returning an empty list, to confirm the route compiles and the DB migration succeeded.

### 📂 Files and folders to create or modify
```
/RecoverIQ.Api/Models/Drill.cs
/RecoverIQ.Api/Models/DrillStep.cs
/RecoverIQ.Api/Models/DrillResponse.cs
/RecoverIQ.Api/Controllers/DrillController.cs (stub)
```

### 🧪 Testing tasks
- Confirm migration applies cleanly
- Confirm `GET /api/drills` returns `[]` with 200 OK

### 🐞 Common issues and debugging tips
- **Migration conflict with earlier ones** → always run `dotnet ef migrations add` (never edit old migration files by hand); if stuck, delete local dev DB file and re-run all migrations from scratch (fine pre-production).

### ✅ End-of-day checklist
- [ ] 3 new entities migrated successfully
- [ ] Stub endpoint returns empty list without error

### 📸 Expected project state and screenshots
- Screenshot of DB Browser showing new empty Drills/DrillSteps/DrillResponses tables

### ➡️ Handoff notes for Day 8
All data models are now in place. Day 8 (weekend, heavier session) is the big integration day: wire the OpenAI prompt from Day 6 into a real `POST /api/drills/generate` endpoint, and build the full drill-taking UI.

---

## Day 8 (Sat, weekend — heavier session) — AI Integration + Drill Execution Flow

### 🎯 Objective
Wire OpenAI generation into the app for real, and build the full "take a drill" experience for Team Members plus generation trigger for Admin.

### 🛠 Features to build
- `POST /api/drills/generate` (Admin): takes a `runbookId`, calls OpenAI with the Day 6 prompt template, parses JSON, saves as a new `Drill` + `DrillStep` records
- `GET /api/drills` (role-aware: Admin sees all, Team Member sees only assigned/available)
- `GET /api/drills/{id}` (full drill detail with steps)
- `POST /api/drills/{id}/steps/{stepId}/respond` (Team Member submits a response)
- Frontend: Admin "Generate Drill" button on a runbook; Team Member drill list + step-by-step guided response screen

### 📝 Step-by-step implementation plan
1. Add OpenAI API key to configuration properly (via `IConfiguration`, injected into a new `IScenarioGeneratorService`).
2. Implement `ScenarioGeneratorService.GenerateAsync(Runbook runbook)` — builds the prompt from Day 6's template using the runbook's real data, calls OpenAI, parses response JSON into a `Drill` + `DrillStep` list.
3. Implement `POST /api/drills/generate` in `DrillController`, calling the service and saving results, `[Authorize(Roles="Admin")]`.
4. Implement `GET /api/drills` and `GET /api/drills/{id}` with role-based filtering.
5. Implement `POST /api/drills/{id}/steps/{stepId}/respond`, `[Authorize(Roles="TeamMember")]`, saving a `DrillResponse` and updating `Drill.Status`.
6. Frontend (Admin): add a "Generate Drill" button on each runbook row → calls generate endpoint → shows confirmation.
7. Frontend (Team Member): `DrillList.js` (available/assigned drills) → `DrillRunner.js` (shows premise, then one step at a time with a text box to respond, "Next" button, progress indicator).
8. Handle loading/error states for the OpenAI call (it can take a few seconds — show a spinner).

### 📂 Files and folders to create or modify
```
/RecoverIQ.Api/Services/IScenarioGeneratorService.cs
/RecoverIQ.Api/Services/ScenarioGeneratorService.cs
/RecoverIQ.Api/Controllers/DrillController.cs (fully implemented)
/recoveriq-web/src/DrillList.js
/recoveriq-web/src/DrillRunner.js
/recoveriq-web/src/AdminRunbookRow.js (add generate button)
```

### 🔗 APIs, libraries, services, tools to integrate
OpenAI Chat Completions API (via `HttpClient` in the service), your Day 6 prompt template

### 🧪 Testing tasks
- Generate a drill from a real runbook → confirm it appears correctly structured in the DB
- As Team Member, open the drill and submit responses to all steps → confirm status changes to Completed
- Test what happens if OpenAI returns malformed JSON (add basic try/catch + user-friendly error message)

### 🐞 Common issues and debugging tips
- **Generation endpoint times out** → OpenAI calls can take several seconds; ensure frontend fetch has no aggressive timeout, and show a loading state.
- **JSON parse failure** → log the raw AI response for debugging; keep the try/catch so one bad generation doesn't crash the app — surface a "try again" message instead.
- **Team Member sees other users' drills** → double-check the `GET /api/drills` filter uses the JWT's user id, not returning everything.

### ✅ End-of-day checklist
- [ ] Admin can generate a real AI scenario from a runbook
- [ ] Team Member can run through the full drill and submit responses
- [ ] Drill status correctly updates to Completed

### 📸 Expected project state and screenshots
- Screenshot of a generated scenario's steps in the DB or an API response
- Screenshot of the Team Member drill-running screen mid-drill
- Screenshot of a completed drill

### ➡️ Handoff notes for Day 9
The core AI feature is fully working end-to-end. Day 9 (weekend) is for the Admin review screen, overall UI polish/testing, and beginning deployment.

---

## Day 9 (Sun, weekend — heavier session) — Drill Review, Polish, Testing & Deployment Prep

### 🎯 Objective
Build the Admin drill review screen, polish the overall UI/navigation, run through full manual testing, and get the app ready to deploy (deployment itself may spill into Day 10 if needed).

### 🛠 Features to build
- Admin "Drill Review" screen: view a completed drill's scenario + each step's response side by side
- Basic navigation shell (header with role-aware links, logout button)
- Deployment prep: environment variables for API key/connection strings, production build configs

### 📝 Step-by-step implementation plan
1. Backend: confirm `GET /api/drills/{id}` (already built Day 8) returns everything needed for review (steps + responses joined) — add a DTO if not already clean.
2. Frontend: `DrillReview.js` — for Admin, renders each step's situation/question next to the Team Member's submitted response.
3. Add a simple top navigation bar: logo/title, role-aware links (Admin: Runbooks / Drills; Team Member: My Drills), Logout button (clears token, redirects to login).
4. Full manual test pass through the entire flow end-to-end, both roles, noting any bugs.
5. Fix any bugs found (budget most of today's time here — this is normal and expected).
6. Prepare for deployment: move OpenAI key and DB connection string into environment variables (not hardcoded), create production build of frontend (`npm run build`), confirm backend runs in `Production` config locally.
7. Begin deployment using the platforms locked on Day 2: **Render** (backend API, Web Service with persistent disk) and **Netlify** (frontend). Step-by-step guidance provided when we get here. Deployment can complete on Day 10 if it runs long.

### 📂 Files and folders to create or modify
```
/recoveriq-web/src/DrillReview.js
/recoveriq-web/src/NavBar.js
/RecoverIQ.Api/appsettings.Production.json (structure only, no secrets committed)
/README.md (updated with setup + deployment notes)
```

### 🧪 Testing tasks
- Full end-to-end run: login as Admin → create runbook → generate drill → logout → login as Team Member → run drill → logout → login as Admin → review completed drill
- Test invalid/edge cases: empty runbook steps, very long text responses, refreshing mid-drill

### 🐞 Common issues and debugging tips
- **Frontend build works locally but breaks after `npm run build`** → check for hardcoded `localhost` URLs; move API base URL to an environment variable (`.env` file, `REACT_APP_API_URL`).
- **CORS breaks after deployment** → update the API's CORS policy to include the deployed frontend URL, not just localhost.

### ✅ End-of-day checklist
- [ ] Full end-to-end flow works with no crashes
- [ ] Navigation and logout work correctly
- [ ] Secrets moved to environment variables, not committed to Git
- [ ] Deployment started (even if not finished)

### 📸 Expected project state and screenshots
- Screenshot of the Admin drill review screen
- Screenshot of full navigation bar
- Screenshot of deployment platform dashboard (whatever progress made)

### ➡️ Handoff notes for Day 10
App is feature-complete and tested locally. Day 10 finishes deployment (if needed), does final QA on the live URL, and wraps up demo materials.

---

## Day 10 (Mon) — Final Deployment, QA & Wrap-Up

### 🎯 Objective
Get RecoverIQ live on a public URL, do final QA on the deployed version, and finalize demo materials.

### 🛠 Features to build
None new — this day is deployment, QA, and polish only. No new features (protect against last-day scope creep).

### 📝 Step-by-step implementation plan
1. Finish deployment started Day 9: deploy backend API to Render; deploy frontend to Netlify; connect them via environment variable for API base URL.
2. Confirm the seeded demo accounts exist in the production database (should already be present automatically — the same startup seed guard runs in Production per the Day 2 simplification; just verify by logging in).
3. Do a full manual QA pass on the LIVE deployed URL (not localhost) — same flow as Day 9's test.
4. Fix any deployment-specific issues (env vars, CORS, connection strings).
5. Update `README.md` with: live URL, demo login credentials, tech stack summary, how to run locally.
6. Take final screenshots of the live app for the pitch deck / portfolio use.
7. Do a final read-through of the PRD, blueprint, and pitch deck to make sure they match what was actually built (note any deviations honestly).

### 📂 Files and folders to create or modify
```
/README.md (final version)
```

### 🧪 Testing tasks
- Full end-to-end test on the live production URL, both roles
- Confirm no console errors in browser dev tools on the live site
- Confirm OpenAI generation works in production (not just locally)

### 🐞 Common issues and debugging tips
- **Works locally, 500 error in production** → check production logs on the hosting platform; usually a missing environment variable (API key, connection string).
- **Free-tier hosting "cold starts"** → first request after inactivity may be slow; this is normal for free tiers, mention it if demoing live.

### ✅ End-of-day checklist
- [ ] App is live at a public URL
- [ ] Both demo accounts work on the live app
- [ ] Full core flow verified on production
- [ ] README finalized with live URL and credentials
- [ ] Pitch deck and PRD reviewed for accuracy

### 📸 Expected project state and screenshots
- Screenshot of the live URL in a browser
- Screenshots of each core screen on the deployed app (for portfolio/demo use)

### ➡️ Project Complete
v1.0 of RecoverIQ is deployed and demoable. Roadmap items (documented in the PRD) are the natural next steps for anyone continuing this project beyond the capstone.

---

## Appendix: Definitions of Done Reference

| Term | Meaning in this project |
|---|---|
| **Runbook** | A documented recovery plan for one system: ordered steps + RTO/RPO |
| **Drill** | An AI-generated tabletop scenario created from a specific runbook |
| **DrillStep** | One situation + decision point within a Drill |
| **DrillResponse** | A Team Member's submitted answer to one DrillStep |
| **Admin** | Seeded role that creates runbooks, generates drills, reviews results |
| **Team Member** | Seeded role that runs assigned drills and submits responses |
