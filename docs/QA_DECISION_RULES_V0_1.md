# QA — Decision rules v0.1

Lightweight, deterministic coverage for the intake policy. Same draft always yields the same Decision Object. No AI. No UI change.

The executable checks live in `frontend/src/lib/decisionRulesV01.qa.ts` and the drafts in `frontend/src/lib/decisionRulesV01.fixtures.ts`.

Internal UI: open `/qa/decision`. It runs the same fixtures through `evaluateDecisionV01` → `presentDecisionCard` → the real Decision Card. The fixture snapshot stays in page state and **does not** write to localStorage. The customer Welcome/wizard path is unchanged. There is no link to this route from Welcome.

## What is covered

| Case | Draft | Locked expectation |
|---|---|---|
| Strong | expansion, Energy — Solar, Türkiye, city, operating, EUR 5–25m, IPA, B2B contracted, binding, secured, mandate screen | `proceed_with_conditions`, confidence 100, no offtake, no site |
| Average | greenfield, solar, Türkiye, region, pre-feasibility, EUR 25–100m, IPA, mixed, advanced, searching, mandate screen | `proceed_with_conditions`, confidence 90, offtake + site, no incomplete-interview copy |
| Weak | greenfield, Other, Russia, country only, concept, scale not sure, bank screen, buyer unknown, hypothesis, searching, financing read | `defer`, confidence 17 (low), offtake + site + scale, credit-approval line |
| Hypothesis mega | strong file with capex `100_500m` and demand `hypothesis` | `defer`, confidence 45, offtake |
| Financing read without paper | strong file with `financing_read` and demand `advanced` | `defer` |
| Bank screen + hypothesis | strong file with `bank_screen` and demand `hypothesis` | `defer`, “This is not a credit approval.” |
| Restricted geography | strong file in Russia | `proceed_with_conditions`, confidence 70, `export_blocked`, geo condition — **not** defer from geography alone |

Across every case:

- posture is never `proceed` or `do_not_pursue`
- two evaluations of the same draft are identical
- the Decision Card presenter does not expose JSON, `VETO-*`, `COND-*`, `RISK-*`, penalty codes, or snake_case field/enum tokens

English words that match an answer (for example “hypothesis” in a sentence) are allowed. Machine tokens are not.

## What is intentionally not covered

- Welcome, wizard flow, Review layout, Decision Card layout
- Incomplete drafts (`evaluateDecisionV01` → `null`)
- Q13 / `known_constraints`
- `compare` copy, site `option` as a condition, `not_applicable` offtake
- Whether `25_100m` is treated as ≥ 100m (it must not be; Average already uses `25_100m` with a non-hypothesis demand)
- Market / Financial / Strategic engines, scores, or bars
- Backend, export, PDF, login, or cloud save
- Multiple drafts, draft history, or analytics
- A 13th scored question, a public-specific engine, or public-only interview questions

Evaluator name and reason are **client overlay** fields on the snapshot. They do not change posture, confidence, conditions, or the frozen draft. Accept, amend, and reject all require a non-blank evaluator name. Accept does not require a reason. Amend and reject require name and reason. Whitespace-only name is invalid. Changing any interview answer still clears the snapshot **and** the localStorage snapshot item. Validation errors are UI-only and do not persist.

The current snapshot is saved in this browser under `invest-smarter.recommendationSnapshot.v0.1`. Refresh on the Decision Card restores it. Invalid JSON or an incompatible schema is discarded silently.

The in-progress interview is saved under `invest-smarter.interviewDraft.v0.1` (answers + current step). Refresh mid-wizard or on Review restores that draft. A valid snapshot always outranks a draft. Invalid draft JSON is discarded silently and must not crash the app. Starting a new interview from Welcome clears **both** the draft and the snapshot and starts Framing. “See recommendation” makes the snapshot the source of truth and clears the in-progress draft. “Clear saved recommendation” clears the snapshot only; Review then becomes the in-progress draft again. There is one draft and one snapshot — no history.

`projectContext` is setup, not Q13. Progress remains Question *n* of 12. It is required before Q1, shown on Review, and stored on the in-progress draft and the snapshot `frozenDraft`. It does **not** change `rules.v0.1` posture, confidence, or conditions. It is not added to the Decision Object schema.

Q9 and Q10 keep the same stored enums. Labels and advisor copy follow `projectContext`. `not_sure` uses the private-investment wording. Public and development-finance Decision Cards replace commercial offtake language with a public-use sentence when an offtake condition is shown. A development-finance disclaimer (“not an eligibility opinion…”) appears only for `development_finance`. Decision Card conditions intro, first next bullet, empty-condition fallback, proceed posture sentence, and the proceed-with-conditions why line also follow `projectContext`. Rules output is unchanged.

## How to verify now

**A. Walk the wizard** with each draft above. Confirm posture, confidence, conditions, and that the card never shows IDs or “were not collected.”

**A2. Persistence walkthrough**

- Refresh on Q1–Q12 restores the same answers and step.
- Refresh on Review restores Review with the same answers.
- Refresh on the Decision Card restores the card (snapshot wins over any leftover draft).
- Welcome → Start assessment clears the draft and the snapshot and opens Framing.
- After a Decision Card refresh, **Clear saved recommendation** returns to Review with the same answers. It must not bounce to Welcome or restart Framing.
- Framing → Start interview opens Project Context (setup, not Question 1 of 13).
- Project Context is required; Q1 still shows Question 1 of 12.
- Refresh on Project Context restores the selected context.
- Corrupt the draft key in DevTools; reload `/interview` — the app must not crash; invalid draft is discarded.
- There is still only one draft key and one snapshot key. No history UI.
- Changing Project Context does not change rules.v0.1 posture.
- Q9/Q10 labels follow Project Context; stored values stay the same. `not_sure` matches private copy.
- A public or development-finance card with an offtake condition shows the public-use sentence, not PPA/offtake commercial copy.
- The grant/eligibility disclaimer appears only when Project Context is development finance.
- Card microcopy (conditions intro, first next bullet, empty-condition fallback, proceed why line, proceed posture sentence) follows Project Context. `not_sure` matches private. Rules output is unchanged.
- Public proceed posture sentence does not say “commission a full study.” Development-finance posture says this is not clearance to enter appraisal, approve support, or commit funding.
- Empty-condition fallback is context-aware and only appears when no offtake/site/scale/geo condition is listed.
- Review group title for Q9–Q11 follows Project Context (`Commercial and site` vs `Use, evidence, and site` vs `Use, evidence, and support readiness`). Layout is unchanged.
- Language defaults to English. Selecting Türkçe persists under `invest-smarter.language.v0.1` and does not clear the draft or snapshot, or change `rules.v0.1`.
- Project Context example prefix follows language (`Examples` / `Örnekler`). Stored enum values stay English.
- The same snapshot can be viewed in EN or TR. Stored enum values stay English (`public_project`, `b2b_contract`, …).
- Welcome no longer claims AI, Market, Financial, or report-generation capabilities. English and Turkish both use the honesty-pass copy. Language selector still persists. **Start assessment** still clears draft and snapshot and starts a new run.

**A3. Internal Decision QA harness** (`/qa/decision`)

- Open `/qa/decision` directly. It is not linked from Welcome.
- Seven fixtures: Strong, Average, Weak, Hypothesis mega, Financing read without paper, Bank screen with hypothesis, Restricted geography.
- Click a fixture. The real Decision Card must render. Expected vs actual posture/confidence show Pass or Check.
- Switching EN/TR changes Decision Card copy only. Expected vs actual posture labels stay in English (`Proceed with conditions` / `Defer`). Confidence numbers do not change. Harness chrome such as Passed / Başarılı may still switch language.
- Refreshing `/qa/decision` does **not** restore the fixture. The user’s Welcome/interview localStorage keys must be unchanged.
- “Decision rules QA: Passed / Failed” runs `verifyDecisionRulesV01()` in memory.

**B. Call the helper** from a future test file or a throwaway console:

```ts
import { verifyDecisionRulesV01 } from "./decisionRulesV01.qa";

const report = verifyDecisionRulesV01();
// report.failed === 0
```

The helper is also invoked on `/qa/decision`. It is not a npm script and is not part of the customer workflow.

## What should become automated tests later

When Vitest (or equivalent) is added for other reasons:

1. One test: `expect(verifyDecisionRulesV01().failed).toBe(0)`.
2. Do not re-encode the table in the spec file.
3. Still do not assert on Decision Card layout, copy tone beyond the leak rules, or engine IDs in the presenter.

v0.1 may only emit `proceed_with_conditions` or `defer`. If a fixture produces `proceed` or `do_not_pursue`, the engine is wrong — do not “fix” the fixture.
