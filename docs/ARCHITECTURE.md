# RecoverIQ — System Architecture

Status: Approved Day 2 | Source of truth for implementation (Days 3–10)

## 1. Tech Stack (Final)

| Layer | Choice |
|---|---|
| Frontend | React (Create React App) |
| Backend | .NET Core Web API (.NET 8) |
| Database | SQLite + Entity Framework Core |
| Auth | JWT + BCrypt password hashing, 2 seeded roles |
| AI | OpenAI API (`gpt-4o-mini`), single upfront call per drill |
| Backend Hosting | Render (free tier, Web Service, persistent disk) |
| Frontend Hosting | Netlify (free tier) |
| Dev Tools | Git/GitHub, Swagger/OpenAPI, DB Browser for SQLite |

## 2. Component Diagram

```mermaid
flowchart TB
    subgraph Client["Browser"]
        UI["React App<br/>(recoveriq-web)"]
    end

    subgraph Server["Render — Web Service"]
        API[".NET Core Web API<br/>(RecoverIQ.Api)"]
        DB[("SQLite DB<br/>(persistent disk)")]
        API <--> DB
    end

    subgraph External["External Service"]
        OPENAI["OpenAI API<br/>gpt-4o-mini"]
    end

    UI -- "HTTPS + JWT" --> API
    API -- "HTTPS (scenario gen only)" --> OPENAI
```

**Notes**
- The React app never talks to OpenAI directly — all AI calls are proxied through the backend so the API key is never exposed to the browser.
- SQLite lives on Render's persistent disk so data survives restarts/redeploys.

## 3. Data Flow — Core Use Case (Generate & Run a Drill)

```mermaid
sequenceDiagram
    participant Admin
    participant UI as React App
    participant API as .NET Web API
    participant DB as SQLite
    participant AI as OpenAI API
    participant TM as Team Member

    Admin->>UI: Click "Generate Drill" on a Runbook
    UI->>API: POST /api/drills/generate {runbookId}
    API->>DB: Fetch Runbook + Steps + RTO/RPO
    API->>AI: Prompt (system, steps, RTO/RPO)
    AI-->>API: Structured JSON scenario
    API->>DB: Save Drill + DrillSteps
    API-->>UI: 201 Created (drill summary)

    TM->>UI: Open assigned Drill
    UI->>API: GET /api/drills/{id}
    API->>DB: Fetch Drill + Steps
    API-->>UI: Drill detail (premise + steps)
    loop each step
        TM->>UI: Submit response
        UI->>API: POST /api/drills/{id}/steps/{stepId}/respond
        API->>DB: Save DrillResponse
    end
    API->>DB: Mark Drill Completed
```

## 4. Request Lifecycle (Any Authenticated API Call)

```mermaid
flowchart LR
    A["React app<br/>attaches JWT"] --> B["ASP.NET<br/>Auth middleware"]
    B --> C{"Token valid?"}
    C -- "No" --> D["401 Unauthorized"]
    C -- "Yes" --> E{"Role authorized<br/>for route?"}
    E -- "No" --> F["403 Forbidden"]
    E -- "Yes" --> G["Controller action<br/>executes"]
    G --> H["EF Core<br/>queries SQLite"]
    H --> I["Response<br/>JSON returned"]
```

## 5. AI Interaction Detail

- **Trigger:** Admin action only (`POST /api/drills/generate`). Never triggered automatically or by Team Members.
- **Frequency:** Exactly one OpenAI call per drill creation — no retries loop, no live calls during drill execution.
- **Service boundary:** `IScenarioGeneratorService` (backend) is the only component that talks to OpenAI. Swappable/mockable for testing without burning API credits.
- **Failure handling:** If OpenAI returns malformed JSON or errors, the API returns a clean 502-style error to the frontend with a "try again" message — no partial/corrupt drill is saved.
- **Cost control:** Prompt explicitly caps scenario length (4–6 steps); `gpt-4o-mini` used for low cost per generation.

## 6. External Services

| Service | Purpose | Failure Mode Handling |
|---|---|---|
| OpenAI API | Generates tabletop scenario JSON from runbook context | Try/catch in `ScenarioGeneratorService`; user sees a retry prompt, no crash |
| Render | Hosts backend API + SQLite file | Free tier may cold-start after inactivity — acceptable for demo |
| Netlify | Hosts built React frontend | Auto-deploys from GitHub `main` branch |

## 7. Security Notes (v1.0 scope)

- Passwords stored as BCrypt hashes, never plaintext.
- JWT signing key stored as an environment variable in production (never committed to Git).
- OpenAI API key stored as an environment variable in production (never committed to Git); local dev uses `appsettings.Development.json`, which is gitignored.
- CORS restricted to the deployed frontend origin + localhost dev origin only.
