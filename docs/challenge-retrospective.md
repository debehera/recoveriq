# RecoverIQ — Challenge Retrospective

*A day-by-day account of how RecoverIQ went from a blank page to a deployed, production-hardened v1.0 — written as your AI pair programmer looking back on the build with you.*

## The Timeline

**Day 1 — Discovery.** We started with nothing but your background (C#/.NET, some React, working on a real enterprise BCDR need) and interviewed our way to a project. The pivotal moment: when you said "all three" drill modes, I pushed back — not because ambition is bad, but because a 10-day solo sprint needed a scoped win, not three shallow features. You chose AI-generated tabletop drills, upfront-only generation, two clean roles. That single scoping decision on Day 1 is the reason every later day had room to breathe.

**Day 2 — System design.** Before a line of code existed, we had a full architecture, schema, API spec, and wireframes. One real decision got made early: locking Render + Netlify for hosting *today* instead of deferring to Day 8, because SQLite's persistence needs had to inform the hosting choice, not the other way around. That's the kind of sequencing mistake most solo builds make and don't catch until it's expensive to fix.

**Day 3 — Foundation, and the first real lesson.** `create-react-app` turned out to be deprecated mid-build — a genuine "the ground shifted under us" moment. We pivoted to Vite without hesitation, and it became a template for how the rest of the sprint would handle surprises: name the problem, propose the fix, get your approval, move on. No panic, no over-analysis.

**Day 4 — Data models.** The quietest day, and also the one with the most instructive bug: three C# files existed on disk but hadn't been *saved* in the editor, so the compiler couldn't see them. A reminder that the boring failure modes are often the real ones — not exotic bugs, just an unsaved file.

**Day 5 — Authentication, and a security habit forms.** JWT + BCrypt went in cleanly. But the more important moment was what happened *after* it worked: we found a secrets file had slipped past `.gitignore` and been committed with a real signing key inside it. We didn't just delete it — we rotated the key and fixed the ignore rules properly. That instinct — treat a caught mistake as a reason to fix the *system*, not just the symptom — showed up again and again for the rest of the build.

**Day 6 — The hardest day, and the best debugging story.** This was the MVP-completion sprint: Runbook CRUD, drill data models, and the AI integration — all in one session. Mid-build, Google deprecated the Gemini model name *live*, three times in a row. Each failure message told us exactly what to do next, and each time we adapted without losing momentum, landing on `gemini-3.6-flash`. Then, deploying to Render, a production-only bug surfaced: `AuthController` read the JWT key from local config only, with no environment-variable fallback — invisible locally, fatal in production. Diagnosed via Render's actual server logs, not guesswork. By the end of Day 6, RecoverIQ was live, AI-generating real scenarios, on the actual internet.

**Day 7 — Product refinement.** A full design system pass across every screen — and a genuinely instructive bug: a trailing space in the login form, invisible to the eye, caught only by reading the raw network payload instead of trusting the visual input. Fixed defensively (trim on every login attempt, forever), not just for that one instance.

**Day 8 — The release-readiness gate.** A structured QA pass, not ad hoc poking: 12 real issues found and fixed, from crash-preventing (global exception handling, error boundary) to accessibility (keyboard navigation on the nav bar) to plain UX (a character counter that matches what the backend actually enforces). This is the day the project crossed from "works when I use it carefully" to "handles being used carelessly."

**Day 9 — Launch readiness.** Less code, more judgment: SEO metadata, a real README, an honestly-written `SECURITY.md` that says what's *not* implemented as clearly as what is. The kind of documentation that signals maturity to anyone technical who reads it.

**Day 10 — Here.** Closing the loop: portfolio materials, a growth plan, and this retrospective.

## Major Technical Decisions & Pivots

| Decision | Why it mattered |
|---|---|
| AI generates once, upfront (not live/reactive) | Kept cost and behavior predictable — a defensible, explainable architecture choice |
| SQLite + free-tier hosting, accepted ephemeral disk | Enabled zero-cost deployment; documented honestly rather than hidden |
| create-react-app → Vite | Real-time adaptation to a deprecated tool, no lost time |
| OpenAI → Gemini | A user-driven constraint (no paid APIs) handled as a clean architecture swap, not a compromise |
| Hosting locked on Day 2, not Day 8 | Sequencing dependency correctly identified before it became expensive |

## Skills Demonstrated

Requirements discovery and scope negotiation · system architecture and schema design · full-stack implementation (.NET 8, EF Core, React) · third-party AI API integration with real-time troubleshooting · authentication and role-based authorization · systematic QA and security review · production deployment and environment configuration · technical writing and documentation · debugging using logs, network inspection, and error messages rather than guessing.

## Lessons Learned

1. **Scope decisions made on Day 1 pay compound interest for 10 days.** The choice to say no to "all three" drill modes is the single highest-leverage decision in this entire project.
2. **The boring bugs are usually the real ones.** Unsaved files, trailing whitespace, a missing environment-variable fallback — none of these are exotic. All of them were found through careful, methodical inspection (Network tab, server logs, diffs), not guessing.
3. **Fix the system, not just the symptom.** The Day 5 secrets leak and the Day 8 QA pass both reflect the same instinct: when something breaks, ask what *class* of problem it represents, not just how to patch this one instance.
4. **Documenting what you didn't build is as valuable as documenting what you did.** `SECURITY.md` and this retrospective both exist because being honest about tradeoffs is more credible than pretending there weren't any.

## Final Project Summary

RecoverIQ is a full-stack, AI-integrated, production-deployed disaster recovery platform, built solo in 10 days, following a real software development lifecycle from requirements through launch. It handles its actual failure modes gracefully, documents its own security posture honestly, and does one thing — AI-generated tabletop drills — well, rather than many things shallowly.

## A Note From Your Pair Programmer

You started this sprint by telling me you had "good" coding experience and a real problem worth solving. Ten days later, what stands out isn't any single line of code — it's the pattern: every time something broke, you sent the exact error, waited for the diagnosis, and fixed the real cause. That discipline is what actually separates a working demo from a project someone could hand you a real production codebase and trust you with. Well done — genuinely.
