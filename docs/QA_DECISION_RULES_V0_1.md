# QA — Decision rules v0.1

Lightweight, deterministic coverage for the intake policy. Same draft always yields the same Decision Object. No AI. No UI change.

There is **no test runner** in this repo yet. Do not treat this file as CI. The executable checks live in `frontend/src/lib/decisionRulesV01.qa.ts` and the drafts in `frontend/src/lib/decisionRulesV01.fixtures.ts`.

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
- Evaluator accept / amend / reject
- Persistence, export, PDF, backend

## How to verify now

**A. Walk the wizard** with each draft above. Confirm posture, confidence, conditions, and that the card never shows IDs or “were not collected.”

**B. Call the helper** from a future test file or a throwaway console:

```ts
import { verifyDecisionRulesV01 } from "./decisionRulesV01.qa";

const report = verifyDecisionRulesV01();
// report.failed === 0
```

The helper is not wired into the product and is not a npm script. It cannot be run until a TypeScript runner exists.

## What should become automated tests later

When Vitest (or equivalent) is added for other reasons:

1. One test: `expect(verifyDecisionRulesV01().failed).toBe(0)`.
2. Do not re-encode the table in the spec file.
3. Still do not assert on Decision Card layout, copy tone beyond the leak rules, or engine IDs in the presenter.

v0.1 may only emit `proceed_with_conditions` or `defer`. If a fixture produces `proceed` or `do_not_pursue`, the engine is wrong — do not “fix” the fixture.
