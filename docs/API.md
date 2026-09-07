# RecoverIQ — API Design

Status: Approved Day 2 | No implementation yet — design only
Base URL (dev): `https://localhost:{port}/api` | Base URL (prod): `https://<render-app>.onrender.com/api`
All authenticated endpoints require header: `Authorization: Bearer <jwt>`

---

## Auth

### `POST /api/auth/login`
- **Purpose:** Authenticate a seeded user and issue a JWT.
- **Auth:** None (public)
- **Request:**
```json
{ "username": "admin1", "password": "string" }
```
- **Response 200:**
```json
{ "token": "eyJhbGciOi...", "role": "Admin", "username": "admin1" }
```
- **Validation:** username and password both required, non-empty.
- **Error cases:**
  - `400 Bad Request` — missing username/password
  - `401 Unauthorized` — invalid credentials

---

## Runbooks (Admin only)

### `GET /api/runbooks`
- **Purpose:** List all runbooks.
- **Auth:** `Admin`
- **Request:** none
- **Response 200:**
```json
[
  { "id": 1, "name": "Payment Gateway Recovery", "systemName": "Payment Gateway", "rtoMinutes": 60, "rpoMinutes": 15 }
]
```
- **Error cases:** `401` no token, `403` wrong role

### `GET /api/runbooks/{id}`
- **Purpose:** Get full runbook detail including steps.
- **Auth:** `Admin`
- **Response 200:**
```json
{
  "id": 1, "name": "Payment Gateway Recovery", "systemName": "Payment Gateway",
  "rtoMinutes": 60, "rpoMinutes": 15,
  "steps": [{ "stepOrder": 1, "description": "Failover to backup region" }]
}
```
- **Error cases:** `401`, `403`, `404 Not Found` — id doesn't exist

### `POST /api/runbooks`
- **Purpose:** Create a runbook with steps.
- **Auth:** `Admin`
- **Request:**
```json
{
  "name": "Payment Gateway Recovery", "systemName": "Payment Gateway",
  "rtoMinutes": 60, "rpoMinutes": 15,
  "steps": ["Failover to backup region", "Notify on-call engineer", "Verify transaction queue"]
}
```
- **Response 201:** created runbook object (same shape as GET by id) + `Location` header
- **Validation:** `name`, `systemName` required non-empty; `rtoMinutes`/`rpoMinutes` positive integers; `steps` array with at least 1 non-empty entry
- **Error cases:** `400` validation failure, `401`, `403`

### `PUT /api/runbooks/{id}`
- **Purpose:** Update a runbook's fields and steps (full replace of steps list).
- **Auth:** `Admin`
- **Request:** same shape as POST
- **Response 200:** updated runbook object
- **Error cases:** `400` validation, `401`, `403`, `404`

### `DELETE /api/runbooks/{id}`
- **Purpose:** Delete a runbook and its steps (cascade).
- **Auth:** `Admin`
- **Response 204:** No Content
- **Error cases:** `401`, `403`, `404`

---

## Drills

### `POST /api/drills/generate`
- **Purpose:** Trigger AI generation of a tabletop scenario from a runbook.
- **Auth:** `Admin`
- **Request:**
```json
{ "runbookId": 1, "assignToUserId": 2 }
```
- **Response 201:**
```json
{
  "id": 5, "runbookId": 1, "title": "Ransomware Lockout",
  "premise": "A ransomware attack has encrypted the payment gateway's primary database...",
  "status": "Generated",
  "steps": [{ "stepOrder": 1, "situation": "...", "question": "..." }]
}
```
- **Validation:** `runbookId` must reference an existing runbook; `assignToUserId` must reference an existing TeamMember user
- **Error cases:**
  - `400` — invalid runbookId/assignToUserId
  - `401`, `403`
  - `502 Bad Gateway` — OpenAI call failed or returned unparseable data (user sees "try again")

### `GET /api/drills`
- **Purpose:** List drills. Admin sees all; Team Member sees only drills assigned to them.
- **Auth:** `Admin` or `TeamMember` (role-aware filtering server-side)
- **Response 200:**
```json
[{ "id": 5, "title": "Ransomware Lockout", "status": "Generated", "runbookName": "Payment Gateway Recovery", "createdAt": "2026-09-14T10:00:00Z" }]
```
- **Error cases:** `401`

### `GET /api/drills/{id}`
- **Purpose:** Get full drill detail: premise, steps, and (if any) responses.
- **Auth:** `Admin` (any drill) or `TeamMember` (only if assigned to them)
- **Response 200:**
```json
{
  "id": 5, "title": "Ransomware Lockout", "premise": "...", "status": "InProgress",
  "steps": [
    { "id": 12, "stepOrder": 1, "situation": "...", "question": "...", "response": null },
    { "id": 13, "stepOrder": 2, "situation": "...", "question": "...", "response": { "text": "...", "submittedAt": "..." } }
  ]
}
```
- **Error cases:** `401`, `403` (Team Member requesting a drill not assigned to them), `404`

### `POST /api/drills/{id}/steps/{stepId}/respond`
- **Purpose:** Submit (or update) a response to a single drill step.
- **Auth:** `TeamMember` (must be the drill's assigned user)
- **Request:**
```json
{ "responseText": "I would immediately isolate the affected server from the network..." }
```
- **Response 200:** updated step object with response
- **Validation:** `responseText` required, non-empty, max 2000 chars
- **Error cases:**
  - `400` — empty/invalid response text
  - `401`, `403` — not the assigned user
  - `404` — drill or step not found
  - Side effect: when the last unanswered step is answered, `Drill.Status` auto-updates to `Completed`

---

## Summary Table

| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | /api/auth/login | Public | Authenticate, get JWT |
| GET | /api/runbooks | Admin | List runbooks |
| GET | /api/runbooks/{id} | Admin | Get runbook detail |
| POST | /api/runbooks | Admin | Create runbook |
| PUT | /api/runbooks/{id} | Admin | Update runbook |
| DELETE | /api/runbooks/{id} | Admin | Delete runbook |
| POST | /api/drills/generate | Admin | Generate AI scenario |
| GET | /api/drills | Admin/TeamMember | List drills (role-filtered) |
| GET | /api/drills/{id} | Admin/TeamMember | Get drill detail |
| POST | /api/drills/{id}/steps/{stepId}/respond | TeamMember | Submit step response |

**10 endpoints total — matches PRD v1.0 scope exactly. No extra endpoints, nothing missing.**
