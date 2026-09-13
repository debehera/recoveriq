# RecoverIQ

**AI-generated tabletop drills for Business Continuity & Disaster Recovery.**

RecoverIQ turns a documented recovery plan into a ready-to-run disaster recovery tabletop exercise in seconds — using AI to remove the effort barrier that normally keeps teams from testing their plans.

🔗 **Live app:** https://recoveriq-app.netlify.app
📡 **API:** https://recoveriq-api.onrender.com/swagger

> Built as part of the **AB Talks 60-Day Claude AI Challenge** — a 10-day solo capstone taking a product from idea to deployed v1.0.

---

## The Problem

Mid-size companies are often required (ISO 27001, SOC 2) to maintain documented recovery plans and test them regularly via tabletop exercises. In practice:
- Recovery plans live in scattered documents that go stale
- Designing a realistic disaster scenario takes real expertise, so drills get skipped
- There's no simple record of who was tested, when, and how the response measured up

**RecoverIQ solves this** by making recovery plans structured and centralized, and using AI to generate a realistic tabletop scenario from that plan — instantly.

## How It Works

1. **Document** — Admin creates a runbook: recovery steps + RTO/RPO targets for a critical system
2. **Generate** — One click sends the runbook to Google's Gemini API, which returns a structured, multi-step disaster scenario
3. **Run** — The assigned Team Member works through the scenario step-by-step, submitting real decisions
4. **Review** — Admin reviews the full scenario and every response — ready as evidence for an audit

## Demo Accounts

| Role | Username | Password |
|---|---|---|
| Admin | `admin1` | `admin123` |
| Team Member | `member1` | `member123` |

> **Note:** the backend runs on a free hosting tier with no persistent disk, so any runbooks/drills you create will reset if the server has been idle for a while. Demo accounts always reseed automatically. The first request after idle time may take 30–50 seconds while the server wakes up.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | .NET 8 Web API |
| Database | SQLite + Entity Framework Core |
| Auth | JWT + BCrypt password hashing |
| AI | Google Gemini API (free tier) |
| Hosting | Render (backend, Docker) + Netlify (frontend) |

## Features (v1.0)

- Role-based access control (Admin / Team Member)
- Runbook management (recovery steps, RTO/RPO targets)
- AI-generated tabletop disaster scenarios
- Guided, step-by-step drill execution with progress tracking
- Full drill history and response review for audit purposes
- Global error handling, graceful degradation, and accessible keyboard navigation

## Running Locally

**Prerequisites:** [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0), [Node.js](https://nodejs.org) (LTS), a free [Gemini API key](https://aistudio.google.com/apikey)

### Backend
```bash
cd RecoverIQ.Api
dotnet restore
dotnet ef database update
dotnet run
```
Create `RecoverIQ.Api/appsettings.Development.json` (gitignored) with:
```json
{
  "ConnectionStrings": { "DefaultConnection": "Data Source=recoveriq.db" },
  "Jwt": { "SigningKey": "your-local-dev-key", "Issuer": "RecoverIQ.Api", "Audience": "RecoverIQ.Web" },
  "Gemini": { "ApiKey": "your-gemini-api-key" }
}
```

### Frontend
```bash
cd recoveriq-web
npm install
npm run dev
```
Create `recoveriq-web/.env`:
```
VITE_API_URL=http://localhost:5031
```

The app will be running at `http://localhost:5173`.

## Project Documentation

Full planning and design documentation is in [`/docs`](./docs):

- [Product Requirements Document](./docs/RecoverIQ_PRD.docx)
- [Architecture](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/SCHEMA.md)
- [API Design](./docs/API.md)
- [UI Wireframes](./docs/UI-WIREFRAMES.md)
- [10-Day Implementation Blueprint](./docs/RecoverIQ_Implementation_Blueprint.md)
- Daily build summaries (Day 1 – Day 9)

## Roadmap (Post-v1.0)

- Contacts and system dependency mapping per runbook
- Live/reactive AI during drills (currently generated once, upfront)
- Drill scheduling and notifications
- Exportable audit reports (PDF)

## License

MIT — see [LICENSE](./LICENSE)

---

*Built with [Claude](https://claude.com) as part of the AB Talks 60-Day Claude AI Challenge.*
