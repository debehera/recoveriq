# RecoverIQ — Daily Build Prompt (30-Day Growth Plan)

Copy this prompt exactly as-is each day, changing only the day number at the top. Paste it at the start of a new or continuing conversation.

---

```
Day [X] of the RecoverIQ 30-Day Growth Plan

Today is Day [X], continuing the RecoverIQ project past its original 10-day capstone
(v1.0, deployed at https://recoveriq-app.netlify.app, repo at
https://github.com/debehera/recoveriq).

Read 30-day-growth-plan.md and use it as the source of truth for what to build today.
Do not redesign the project or jump ahead to future days. Review everything built so
far (the original capstone plus any growth-plan days already completed) before writing
any code, and make sure today's work builds cleanly on top of it without breaking
anything that already works.

Standing rules:
- Use only free tools, APIs, SDKs, and hosting platforms unless explicitly told otherwise.
- Assume I have the experience level demonstrated during the original 10-day capstone —
  comfortable with guided step-by-step instructions, not an expert.
- Whenever I need to perform a manual step (installing something, configuring a service,
  running a terminal command, deploying), stop and give me exact step-by-step
  instructions using real button names, menu names, and commands. Wait for my
  confirmation before continuing.
- Prioritize implementation over explanation. Generate complete, final file contents —
  never snippets or "add this below" placeholders.
- Clearly state whether each file is new or replaces an existing one, and exactly
  where it belongs in the project structure.
- If today's changes touch many files, package them into a downloadable ZIP and
  explain exactly how to apply it.
- Pause for my confirmation after major milestones, before deployments, or whenever
  debugging requires my input. For smaller steps, continue unless I report an issue.
- If anything breaks, help me debug it completely before moving forward — never build
  on top of broken code.

When today's milestone is complete:
- Verify it works, and verify nothing from before today broke.
- Update any documentation affected by today's change (SCHEMA.md, API.md,
  ARCHITECTURE.md, README.md, etc. — only the ones actually affected).
- Help me commit and push today's work to GitHub with a meaningful commit message.
- If today's change should be deployed, walk me through it and verify the live
  version works before we finish.
- Finish with a concise summary of what was completed today and what tomorrow's
  milestone (Day [X+1]) will be, per 30-day-growth-plan.md.

Your goal is not just to write code — it's to make sure I successfully complete
today's specific milestone from the growth plan, working end-to-end, before we stop.
```

---

## Notes on Using This Prompt

- If you're starting a **fresh chat** each day (recommended, to keep context manageable), also attach or paste the current contents of `30-day-growth-plan.md` and mention which prior days are already complete.
- If a day's milestone depends on an earlier day that got delayed, just say so up front — e.g. "Day 8 hasn't been completed yet, we're still on Day 6's Postgres migration" — and the assistant should adjust rather than assume linear completion.
- Every 7 days (end of each week in the growth plan), consider adding this line to the prompt: *"Also do a full regression check on the original Day 1–10 core flow before we finish today."* — this matches the weekly checkpoint built into the growth plan itself.
