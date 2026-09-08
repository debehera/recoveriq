# RecoverIQ — Environment & Configuration Reference

Status: Day 3 (Part 1)

## 1. Backend Configuration (`RecoverIQ.Api/appsettings.json`)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=recoveriq.db"
  }
}
```

| Key | Value | Purpose |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | `Data Source=recoveriq.db` | Tells EF Core where the SQLite file lives (project root of `RecoverIQ.Api`) |

## 2. Secrets Not Yet Added (Planned — Day 4 & Day 6)

These belong in `appsettings.Development.json` (already gitignored) for local dev, and as environment variables in Render's dashboard for production. **Not created yet** — placeholders for when we reach those days:

| Key | Used For | Added On |
|---|---|---|
| `Jwt:SigningKey` | Signs authentication tokens | Day 4 |
| `OpenAI:ApiKey` | Calls to OpenAI for scenario generation | Day 6 |

## 3. Frontend Configuration (Planned — Not Yet Created)

Vite uses `.env` files (already gitignored per our `.gitignore`). Not yet created — will be added when we build the API client:

| Key | Value (dev) | Value (prod, set in Netlify) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5031` | `https://<render-app>.onrender.com` |

Note: Vite environment variables must be prefixed with `VITE_` to be accessible in the app code (different convention from Create React App's `REACT_APP_` prefix — noted here since our original docs assumed CRA).

## 4. CORS Configuration (`Program.cs`)

Current state (**needs fixing next session** — see SETUP.md section 4):
```csharp
policy.WithOrigins("http://localhost:3000")   // ❌ wrong — CRA default, not what we're using
```
Should be:
```csharp
policy.WithOrigins("http://localhost:5173")   // ✅ Vite's actual default port
```

## 5. Ports Reference

| Service | Local Dev Port | Notes |
|---|---|---|
| Backend API | `5031` (HTTP only, no HTTPS locally) | Confirmed via `dotnet run` output |
| Frontend (Vite) | `5173` | Vite default; different from CRA's 3000 |

## 6. Local Tool Versions (for reference/reproducibility)

| Tool | Version |
|---|---|
| .NET SDK | 8.0.424 |
| Node.js | v24.20.0 |
| npm | 11.19.0 |
| dotnet-ef | 8.0.30 |
