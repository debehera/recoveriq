# RecoverIQ — Setup Guide

Status: Day 3 (Part 1) | Reflects actual progress as of this session — see DAY3-SUMMARY.md for what's carried to next session.

## 1. Prerequisites Installed

| Tool | Version Confirmed | Purpose | Install Source |
|---|---|---|---|
| .NET SDK | 8.0.424 | Builds/runs the backend Web API | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js | v24.20.0 | Runs frontend build tools (npm) | https://nodejs.org (LTS) |
| npm | 11.19.0 | Package manager, installed with Node.js | (bundled with Node.js) |
| VS Code | latest | Code editor for both backend and frontend | https://code.visualstudio.com |
| VS Code: C# Dev Kit | latest | C#/.NET IntelliSense, debugging | VS Code Extensions Marketplace |
| VS Code: ES7+ React/Redux snippets | latest | React code shortcuts | VS Code Extensions Marketplace (publisher: dsznajder) |
| dotnet-ef (global tool) | 8.0.30 | Runs EF Core database migrations | `dotnet tool install --global dotnet-ef --version 8.*` |

## 2. Backend Setup Steps Completed

1. Scaffolded with: `dotnet new webapi -n RecoverIQ.Api --use-controllers -o .`
2. Removed template demo files (`WeatherForecast.cs`, `WeatherForecastController.cs`)
3. Installed NuGet packages (version-pinned to match .NET 8, since `dotnet add package` defaults to the newest version which required .NET 10):
   ```
   dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.11
   dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.11
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.11
   dotnet add package BCrypt.Net-Next
   ```
   (Swashbuckle.AspNetCore was included automatically by the webapi template — powers Swagger.)
4. Created folders: `Models/`, `Dtos/`, `Data/`, `Services/`
5. Created `Data/AppDbContext.cs` (empty DbContext — entities added Day 4)
6. Set connection string in `appsettings.json`: `"DefaultConnection": "Data Source=recoveriq.db"`
7. Rewrote `Program.cs` to register the DbContext, CORS policy, and Swagger
8. Created `Controllers/HealthController.cs` → `GET /api/health` returns `{"status":"ok"}`
9. Ran migrations:
   ```
   dotnet ef migrations add InitialSetup
   dotnet ef database update
   ```
10. Verified: `dotnet run` → confirmed `http://localhost:5031/api/health` and `/swagger` both work

## 3. Frontend Setup Steps Completed

1. **Pivot from plan:** `create-react-app` is officially deprecated by the React team and failed to scaffold (conflicted with the `.gitkeep` placeholder). Switched to **Vite** instead — same React framework, modern actively-maintained scaffolding tool. No architecture change.
2. Removed `.gitkeep` placeholder, then ran:
   ```
   npm create vite@latest . -- --template react
   npm install
   ```
3. Verified: `npm run dev` → confirmed default Vite+React page loads at `http://localhost:5173`

## 4. Known Port Mismatch (Not Yet Fixed)

Our `Program.cs` CORS policy currently allows `http://localhost:3000` (the old create-react-app default). Vite's actual default port is **5173**. This line needs to be updated before the frontend can successfully call the backend:

```csharp
policy.WithOrigins("http://localhost:5173")   // was 3000
```

**This is the first task for the next session.**

## 5. How to Run the Project (Current State)

**Backend:**
```
cd C:\Project\recoveriq\RecoverIQ.Api
dotnet run
```
Visit `http://localhost:5031/api/health` or `http://localhost:5031/swagger`

**Frontend:**
```
cd C:\Project\recoveriq\recoveriq-web
npm run dev
```
Visit `http://localhost:5173`

Note: frontend cannot yet successfully call the backend due to the CORS port mismatch above — this is expected at this stage.
