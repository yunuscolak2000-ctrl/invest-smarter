# Decision Engine Specification v1

**Product:** Invest Smarter  
**Document type:** Canonical decision-system specification  
**Version:** 1.0  
**Status:** Approved for MVP implementation planning  
**Last updated:** August 2026  
**Audience:** Engineering, Product, Design  
**Constraint:** Specification only. No implementation in this document.

This specification is the source of truth for how Invest Smarter turns a confirmed Interview Wizard payload into a defensible investment recommendation. Where this document conflicts with earlier drafts, **this document wins** until explicitly superseded.

Related documents: [PRD.md](./PRD.md) · [Interview Wizard UX](../agent-transcripts) (completed, not yet filed) · [DATA_MODEL.md](./DATA_MODEL.md) · [BUSINESS_RULES.md](./BUSINESS_RULES.md) · [ROADMAP.md](./ROADMAP.md)

---

## 0. Challenged assumptions (read this first)

A $100M SaaS company does not ship six peer “AI brains” that vote. It ships a **decision policy** with **narrow intelligence** around it. The following assumptions are rejected for v1.

| Assumption | Why it is wrong | Locked decision |
|---|---|---|
| **Six LLM engines in parallel** | Cost, latency, contradiction, and hallucination compound. The welcome screen promises a 2-minute report. Six research agents will miss that SLA and disagree with each other. | **Two LLM analysis calls** (Market, Financial) + **one synthesis call**. Strategic Fit, Risk, Technical-lite, Confidence, and Decision are **deterministic**. |
| **The model should assign 0–100 scores** | LLMs are uncalibrated graders. A “78” today and a “64” tomorrow on the same facts destroys institutional trust. Banks will never buy a black-box score. | **LLMs classify structured signals. Rules score.** Scores are reproducible from the same inputs. |
| **Technical Feasibility is a v1 engine** | PRD puts it in Phase 2. The Interview Wizard does not collect tech-stack, IP, capacity, or process data. Inventing a technical score from nothing is worse than omitting it. The homepage card is a promise, not a data contract. | **v1 runs a 4-factor execution-readiness rubric from intake only.** Full technical diligence is a future module with the same contract. Report labels it “Execution readiness (lite) — not technical DD.” |
| **Financial engine must produce NPV / IRR** | Interview collects a **capital range**, not a model. Fake IRR from guessed opex is consulting malpractice. PRD already excludes bank-grade modeling. | **No NPV, IRR, or payback in v1.** Financial v1 judges *revenue logic, capital plausibility, and funding realism*. Numeric returns are Phase 2 when drivers exist. |
| **Risk is a separate research module** | A third LLM re-reading the same facts to “find risks” duplicates Market and Financial and invents generic risk catalogs. | **Risk is an aggregator + veto layer.** It consumes module risks, intake constraints, and kill rules. No extra research call. |
| **Strategic Fit needs market-sized research** | Fit is “does this match the evaluator’s mandate?” — not a second TAM. We have no national priority databases in v1. | **Policy table + short narrative.** Score from context × opportunity shape. No external intelligence. |
| **The recommendation engine decides** | If the LLM can change `proceed` to `defer`, we do not have a product; we have a chat. Explainability, audit, and future bank sales all die. | **Rules emit the decision enum. The LLM explains it and cannot override it.** |
| **A single 0–100 “investment score” is the product** | Advisors and committees argue the number, then ignore the reasoning. Page count and score inflation are already anti-metrics in the PRD. | **Hero output is the posture + conditions + confidence.** Composite score is internal, shown as secondary context, never as a grade on a pitch. |
| **More modules = more rigor** | Rigor is **traceable assumptions, kill rules, and human review** — not more prose. | Prefer fewer, stricter rules. Add modules only when a new *input class* exists. |
| **Live market data / RAG / web browse in v1** | Out of PRD scope. Unreliable latency. Licensing. Hallucinated citations. | **Curated reference data if present; otherwise explicit estimates labeled as estimates.** Source registry required. No live feeds. |
| **Must wait for all engines before any output** | Technical will be skipped; Strategic Fit is instant. Blocking on optional work is ceremony. | **Hard dependency: Market then Financial.** Decision requires both. Everything else may be skipped or defaulted. |
| **Confidence = model’s self-reported certainty** | Models are overconfident. | **Confidence is a data-quality meta-score.** Never taken from the model’s “confidence” field. |
| **Weights: Market 35 / Technical 25 / Financial 40** (current business rules) | Technical is not a v1 module. Risk was missing. Strategic Fit was in the PRD and missing from scoring. | **v1 weights: Market 40 / Financial 40 / Strategic Fit 20.** Risk is a **cap and veto**, not a weight. Technical weight = 0 until the full module ships. |
| **Document upload and RAG for v1 analysis** | Wizard explicitly deferred documents. Parsing is a product, not a feature. | **Interview payload only.** Attachments enrich later runs, not the first decision. |
| **Reviewer/approver inside the engine** | PRD left this open. Two-person review is enterprise Phase 2. | **Evaluator confirms the recommendation.** Status path: `analyzing` → `in_review` → evaluator `accepted` or `rejected`. No second approver in v1. Export still requires disclaimer (`BR-APR-002`). |

**Simplest MVP, stated plainly:**

> Confirmed 12-question payload → gate check → Market LLM (signals) → Financial LLM (signals, sees Market) → deterministic Technical-lite, Strategic Fit, Risk, Confidence, Decision → one synthesis LLM that writes the memo around a locked decision → snapshot report.

That is the entire v1 engine. Everything else is an interface for later.

---

## 1. Overall architecture

### 1.1 What the Decision Engine is

A **synchronous orchestration service** that:

1. Accepts a **confirmed Interview Wizard payload** (the Review screen is the commit).
2. Maps it onto the Investment Project document ([DATA_MODEL.md](./DATA_MODEL.md)).
3. Runs analysis modules under a **module contract**.
4. Applies **business rules** (gates, caps, vetoes).
5. Emits a versioned **Decision Object**.
6. Renders a **Report Snapshot** from that object.

It is not a chatbot, not a document generator, and not a spreadsheet.

### 1.2 System context

```
┌─────────────────────────────────────────────────────────────────┐
│  Client (Welcome → Interview Wizard → Review)                   │
│  Commit action: “Run analysis”                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ confirmed payload
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Decision Engine (this spec)                                    │
│                                                                 │
│  Intake Adapter → Gates → Orchestrator                          │
│       │                                                         │
│       ├─ Market Intelligence     (LLM + reference data)         │
│       ├─ Financial Analysis      (LLM, after Market)            │
│       ├─ Technical-lite          (rules, intake only)           │
│       ├─ Strategic Fit           (policy table)                 │
│       ├─ Risk Aggregator         (rules)                        │
│       ├─ Confidence Calculator   (rules)                        │
│       └─ Decision Policy         (rules)                        │
│                │                                                │
│                ▼                                                │
│       Recommendation Synthesis   (LLM, locked decision)         │
│                │                                                │
│                ▼                                                │
│       Report Snapshot + audit events                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   Prompt templates     Business rules      Reference data
   (versioned files)    (versioned YAML)    (countries, markets,
                                             sources — if present)
```

### 1.3 Architectural principles

1. **Decision-first.** Every module exists to change or explain a go / no-go. If an output cannot affect the posture, conditions, or confidence, it is out of v1.
2. **Classify, then score.** Models emit enums, findings, risks, and assumptions. Numeric scores are functions of those enums plus intake facts.
3. **Determinism at the point of commitment.** Same payload + same prompt versions + same rule versions → same decision enum and same scores. Narrative text may vary; the Decision Object’s `decision`, `scores`, and `conditions[]` may not.
4. **Provenance or it did not happen.** Every finding, assumption, and market figure cites a `source_id`. User intake is a source. AI inference is a source with a lower reliability score.
5. **Fail closed on the critical path.** No Market or no Financial → no Decision Object. Degraded modes are explicit, not silent.
6. **Human is the last mile.** The engine recommends. The evaluator accepts, edits conditions, or rejects. The engine never auto-publishes.
7. **Cheap by default.** Three model calls. Mid-size context. JSON-only. Cache identical payload hashes for 24 hours inside an org (do not surprise-reuse across orgs).

### 1.4 Canonical artifacts

| Artifact | Owner | Mutability |
|---|---|---|
| **Interview Payload** | Wizard | Frozen at “Run analysis” |
| **Opportunity Record** | Intake Adapter | Created/updated once per run |
| **Module Result** | Each module | Immutable per `analysis_run` |
| **Decision Object** | Decision Policy + Synthesis | Immutable per run; new run = new version |
| **Report Snapshot** | Report pipeline | Versioned; advisor edits create a new snapshot, not a silent mutate |

All runs write `audit_event` rows: payload hash, prompt versions, rule versions, scores, decision, actor, timestamps.

### 1.5 What is *not* in the architecture (v1)

- Vector stores, web browsing, news sentiment, live prices
- Workflow engines / Airflow / Kubernetes jobs — a single request-scoped orchestrator is enough
- Per-tenant model routing
- A/B prompt experimentation platform
- Plugin marketplace
- Streaming token UI as a product requirement (progress by **module status** is enough, matching the Wizard handoff screen)

---

## 2. Analysis pipeline

### 2.1 Trigger

Pipeline starts **only** when Interview Wizard Review is confirmed and all hard validations pass (Wizard V-01–V-10, including restricted-geography acknowledgment).

Drafts do not analyze. Partial interviews do not analyze. Re-running always creates a new `analysis_run` set; prior snapshots remain.

### 2.2 Stages (strict order)

```
0. ACCEPT
   Validate payload schema. Persist frozen copy. Status → analyzing.

1. GATE
   Apply intake gates (see 2.4). On gate fail: status → draft with errors; no LLM spend.

2. NORMALIZE
   Map payload → Project + Product skeleton.
   Register sources: src-user-intake, src-constraints.
   Seed assumption list from Q7–Q11 (scale, buyer, demand, site).
   Derive auto-title if missing.

3. MARKET (LLM)                          ──┐
   Technical-lite (rules)                  ├── parallel with Market
   Strategic Fit (rules)                   ──┘

4. FINANCIAL (LLM)
   Blocked until Market succeeds.
   Receives Market signals + intake. Does not receive a Market *score*
   as an instruction to agree with it.

5. RISK AGGREGATION (rules)
   Union of module risks + constraint chips + derived kill flags.

6. SCORE
   Compute domain scores from signal rubrics.
   Compute composite (renormalized for skipped modules).
   Apply score caps.

7. CONFIDENCE (rules)

8. DECIDE (rules)
   Emit posture + condition IDs + veto IDs.

9. SYNTHESIZE (LLM)
   Write executive summary, rationale, condition prose, “what would change this.”
   Forbidden: changing scores, posture, or inventing new kill-rule facts.

10. SNAPSHOT
    Persist Decision Object + Report Snapshot.
    Status → in_review.
    Handoff UI marks modules done.
```

### 2.3 Concurrency and SLA

| Step | Type | Budget (p95) |
|---|---|---|
| Gates + normalize | CPU | 200 ms |
| Market LLM | Model | 35 s |
| Technical-lite + Strategic Fit | CPU | 50 ms (overlap Market) |
| Financial LLM | Model | 35 s |
| Risk / score / confidence / decide | CPU | 100 ms |
| Synthesis LLM | Model | 20 s |
| Persist + snapshot | I/O | 500 ms |
| **Total p95** | | **≤ 90 s** |
| **Hard timeout** | | **120 s** |

Welcome screen copy (“~2 minutes”) is the product SLA. If a model call exceeds 45 s, cancel and retry once with the same prompt. After two failures on Market or Financial: fail the run, keep the payload, show “Retry analysis.” Do not emit a half-decision.

### 2.4 Intake gates (pipeline start)

Aligned with [BUSINESS_RULES.md](./BUSINESS_RULES.md), adapted to the Wizard (ranges replace exact raise).

| Rule | Condition | Action |
|---|---|---|
| BR-INT-001 | `title` and `development_stage` present | Block |
| BR-INT-002 | Valid ISO country | Block Market (hence block all) |
| BR-INT-003 | `capex_range` present (including `not_sure`) | Allow; `not_sure` lowers confidence and financial score |
| BR-INT-004 | `risk_tier = restricted` | Require `restricted_geo_ack`; do not block analysis; **block export/publish** until admin override |
| DE-INT-005 | Payload matches Wizard contract | Block |
| DE-INT-006 | Org has not exceeded analysis budget (if configured) | Block with billing error |

### 2.5 Module contract (every engine implements this)

Every module, including future ones, returns the same shape. This is the extensibility spine (see §12).

**Input (provided by orchestrator):**

- Frozen interview payload
- Normalized Project / Product skeleton
- Upstream module **signals** (not scores), if declared as dependencies
- Reference slices (country, optional market row, source registry)
- Prompt version id (if LLM module)
- Rule version id

**Output (Module Result):**

| Field | Required | Notes |
|---|---|---|
| `module` | Yes | `market` \| `financial` \| `technical` \| `strategic_fit` \| `risk` |
| `status` | Yes | `completed` \| `skipped` \| `failed` |
| `skip_reason` | If skipped | e.g. `not_in_v1_full_module` |
| `signals` | If completed | Closed enums only (defined per module) |
| `findings[]` | If completed | `{ category, summary, impact, source_ids[] }` |
| `risks[]` | If completed | `{ risk_id, name, category, probability, impact, mitigation, status }` |
| `assumptions[]` | If completed | Data-model assumption objects |
| `sources[]` | If completed | New or cited |
| `score` | If completed and scored | Integer 0–100, **computed by rubric**, stored on the result |
| `score_breakdown` | If scored | Component points; must sum to the score |
| `executive_summary` | Optional | Short; Market/Financial may include; synthesis still rewrites the user-facing memo |
| `prompt_version` / `rule_version` | Yes | Traceability |
| `duration_ms` | Yes | Observability |

**Forbidden in Module Result:** free-form “score rationale” that is the only explanation of a number. The breakdown *is* the explanation.

### 2.6 Dependency graph

```
Interview payload
        │
        ▼
   Gates / Normalize
        │
        ├──────────────► Technical-lite ──────┐
        ├──────────────► Strategic Fit ───────┤
        ▼                                     │
     Market ──► Financial ──► Risk ◄──────────┘
                     │
                     ▼
              Score + Confidence
                     │
                     ▼
                 Decision
                     │
                     ▼
                Synthesis
                     │
                     ▼
                 Snapshot
```

No other edges. Financial must not call Market. Synthesis must not call anyone. Risk must not call LLMs in v1.

### 2.7 Idempotency and caching

- Cache key: `org_id + payload_hash + prompt_versions + rule_version`.
- Hit: reuse Module Results and Decision Object; still create a new snapshot if the user clicked Run again? **No.** If hash matches an in-review or accepted run younger than 24 hours, return that run and tell the UI “Unchanged inputs — showing last analysis.” Offer “Force re-run.”
- Miss or force: full pipeline.

---

## 3. Market Intelligence Engine

### 3.1 Purpose

Answer one question: **Is there a credible commercial environment for this output, in this place, given this demand path?**

Not: a 30-page industry study. Not: a precise TAM to three significant figures.

### 3.2 MVP scope

**Does:**

- Size the opportunity **qualitatively** (order of magnitude if reference data exists; otherwise directional)
- Characterize demand, competition, regulation, and trade/substitute pressure
- Emit structured **signals** for scoring
- Identify ≥2 competitors or substitutes, or explicitly state why not (satisfies spirit of BR-MKT-003)
- Attach sources; mark estimates vs. facts
- Produce market-level risks

**Does not:**

- Browse the web
- Require a populated `data/markets/` row (use if present; proceed if absent with lower confidence)
- Invent a TAM that is then treated as fact
- Score itself

### 3.3 Inputs

From payload: `sector_code/label`, `product_summary`, `country_code`, `location_*`, `opportunity_type`, `buyer_type`, `demand_certainty`, `evaluation_context`, `known_constraints[]`.

From reference: country record (currency, region, `risk_tier`); optional market row matching sector × country; source registry.

### 3.4 LLM job (the only Market model call)

The model fills **signals + findings + risks + assumptions**, not a score.

**Required signals (closed enums):**

| Signal | Values |
|---|---|
| `demand_outlook` | `expanding` \| `stable` \| `contracting` \| `unknown` |
| `competitive_intensity` | `low` \| `medium` \| `high` \| `unknown` |
| `regulatory_burden` | `low` \| `medium` \| `high` \| `blocking` \| `unknown` |
| `supply_demand_balance` | `deficit` \| `balanced` \| `surplus` \| `unknown` |
| `substitute_threat` | `low` \| `medium` \| `high` \| `unknown` |
| `data_sufficiency` | `high` \| `medium` \| `low` |

**Required findings categories:** `size`, `growth`, `competition`, `regulation`, `customer`, `trade_or_substitute`.

**Constraints (prompt-level, mapped to business rules):**

- Do not invent statistics. If a number is an estimate, `confidence` on the assumption is `low` or `unverified`, and the finding must say “estimate.”
- If `data/markets` TAM exists, stated TAM must be within 10× or the finding is flagged (BR-MKT-002 → warning, not block).
- At least two named competitors/substitutes **or** a finding that the market is too nascent / too fragmented to name two, with `impact: negative` or `neutral`.
- Regulatory finding always present.
- Neutral institutional tone.

Existing `prompts/market-analysis.md` is a draft. It currently asks the model for `score` and `confidence`. **v1 prompt must drop both.** Score comes from §3.5. Confidence comes from §9.

### 3.5 Market score rubric (deterministic)

Integer 0–100. Components:

| Component | Max | How computed |
|---|---|---|
| **A. Demand path (intake)** | 28 | See table below |
| **B. Demand outlook (signal)** | 16 | expanding 16, stable 11, contracting 4, unknown 6 |
| **C. Competitive intensity** | 14 | low 14, medium 9, high 4, unknown 7 |
| **D. Supply/demand balance** | 12 | deficit 12, balanced 8, surplus 3, unknown 6 |
| **E. Regulatory burden** | 12 | low 12, medium 8, high 4, blocking 0, unknown 6 |
| **F. Substitute threat** | 8 | low 8, medium 5, high 2, unknown 4 |
| **G. Location specificity** | 6 | city_known 6, region_known 4, country_only 2 |
| **H. Data sufficiency** | 4 | high 4, medium 2, low 0 |
| **Total** | **100** | |

**A. Demand path** (buyer_type × demand_certainty):

| | binding | loi | advanced | hypothesis | not_applicable |
|---|---|---|---|---|---|
| b2b_contract | 28 | 22 | 14 | 6 | 10 |
| b2b_spot | 16 | 14 | 12 | 8 | 14 |
| b2c | 14 | 12 | 12 | 8 | 14 |
| b2g | 26 | 18 | 12 | 5 | 10 |
| mixed | 22 | 16 | 12 | 7 | 12 |
| unknown | 10 | 8 | 6 | 4 | 6 |

**Caps:**

- `regulatory_burden = blocking` → market score **max 35**, and a critical risk is emitted if the module forgot.
- `data_sufficiency = low` → market score **max 70** (do not look precise).
- BR-MKT-001 (missing source on a critical finding) → warning; confidence penalty in §9, not a score rewrite.

### 3.6 Failure

Schema invalid after one retry → module `failed` → pipeline aborts. No Decision Object.

---

## 4. Technical Feasibility Engine

### 4.1 Honest split

There are two implementations behind one module id `technical`:

| Mode | When | What it is |
|---|---|---|
| **`lite` (v1)** | Always in MVP | Deterministic 4-factor **execution readiness** from intake. No LLM. |
| **`full` (future)** | When technical interview fields or documents exist | Process, utilities, equipment, TRL, IP — per DATA_MODEL Technical object. |

The report must never title the lite mode “Technical due diligence.”

### 4.2 v1 lite — purpose

Catch **execution holes that kill projects after the commercial story looks good**: no site, unproven tech, greenfield at concept with huge capex.

### 4.3 v1 lite — signals (derived, no model)

| Signal | Source |
|---|---|
| `site_readiness` | `site_control` |
| `development_maturity` | `development_stage` |
| `tech_flag` | `known_constraints` contains `unproven_technology` |
| `project_shape` | `opportunity_type` |

### 4.4 v1 lite — score rubric (0–100)

| Component | Max | Mapping |
|---|---|---|
| **Site** | 40 | secured 40, option 28, searching 10, not_needed 36 |
| **Stage** | 25 | operating 25, construction 22, ready_to_finance 20, feasibility 16, pre_feasibility 12, concept 6 |
| **Technology flag** | 20 | no unproven-tech chip 20; chip present 6 |
| **Shape** | 15 | expansion 15, brownfield 13, asset_light 13, zone 10, greenfield 8, other 10 |
| **Total** | **100** | |

**Caps:**

- `site_control = searching` AND `opportunity_type` in `{greenfield, zone}` → lite score **max 45**, emit high execution risk.
- `unproven_technology` + `development_stage = concept` → lite score **max 40**.

Lite findings are template sentences, not generated prose. Example: “Site is not controlled. For a greenfield project this is a common path to delay or capital stranding.”

Lite does **not** satisfy BR-TEC-001/002/003 (scalability, security, IP). Those rules apply only to `full` mode. v1 business-rules engine must not fire FinTech security gates on a solar plant interview.

### 4.5 Full module (specified now, not built)

**Trigger:** future technical fields present (capacity, technology name/TRL, site area, utilities) **or** an org setting `technical_module = required` for a sector.

**LLM job:** classify, don’t score.

**Signals (full):**

| Signal | Values |
|---|---|
| `trl_band` | `1_4` \| `5_6` \| `7_8` \| `9` \| `unknown` |
| `process_readiness` | `proven_at_scale` \| `proven_elsewhere` \| `pilot` \| `unproven` \| `unknown` |
| `input_supply_risk` | `low` \| `medium` \| `high` \| `unknown` |
| `infrastructure_fit` | `ready` \| `gaps` \| `blocking` \| `unknown` |
| `ip_clarity` | `owned` \| `licensed` \| `unclear` \| `unknown` |
| `scalability` | `clear_path` \| `constrained` \| `unknown` |

**Score (full):** replace lite entirely (do not average lite + full). Rubric to be issued in v1.1 with Technical Wizard questions. Until then, do not implement the LLM.

**Skip behavior if someone enables full without inputs:** `status: skipped`, `skip_reason: insufficient_technical_inputs`, weights renormalize, confidence penalty (§9).

---

## 5. Financial Analysis Engine

### 5.1 Purpose

Answer: **Does the commercial path and capital scale make an investable economic story at pre-feasibility quality — or is the money logically implausible?**

### 5.2 What v1 refuses to do

- NPV, IRR, DSCR, payback, cap tables, dilution
- Year-by-year P&L
- Treating `capex_range` as a point estimate in a model
- CAC/LTV for a factory (the current financial prompt is **startup-shaped** and must be rewritten for FDI / project finance / IPA reality)

The existing `prompts/financial-analysis.md` assumes SaaS unit economics. **That prompt is invalid for this product’s primary users.** v1 prompt is project-economics: offtake, scale, capex band, funding realism, margin logic.

### 5.3 Inputs

Intake: `capex_range`, `currency`, `development_stage`, `buyer_type`, `demand_certainty`, `opportunity_type`, `evaluation_context`, `decision_needed`, `known_constraints[]`.

Upstream Market **signals** (not the market score): demand_outlook, competitive_intensity, supply_demand_balance, regulatory_burden.

Optional: Market findings summaries (truncated) as context.

### 5.4 LLM job

**Required signals:**

| Signal | Values |
|---|---|
| `revenue_logic` | `contracted` \| `plausible` \| `speculative` \| `unknown` |
| `scale_plausibility` | `appropriate` \| `stretched` \| `implausible` \| `unknown` |
| `margin_logic` | `attractive` \| `acceptable` \| `thin_or_weak` \| `unknown` |
| `funding_realism` | `likely` \| `uncertain` \| `unlikely` \| `unknown` |
| `sensitivity_fragility` | `low` \| `medium` \| `high` \| `unknown` |
| `data_sufficiency` | `high` \| `medium` \| `low` |

**Required finding categories:** `revenue_model`, `capital_scale`, `cost_structure`, `funding`, `sensitivities`.

**Required behavior:**

- Unit economics **section** exists even if fields are null, with an explanation (BR-FIN-001 spirit). For plants: contribution logic (price vs. variable cost narrative), not CAC.
- Address whether capital in the selected range can reach a decision-useful milestone at this stage (BR-FIN-002 spirit: “runway” becomes “capital adequacy to next gate”).
- Do not project >5 years of narrative detail unless `development_stage` is `operating` (BR-FIN-003). v1 has no numeric projection table anyway.
- Separate user-stated facts from estimates.
- If Market `regulatory_burden = blocking`, funding_realism cannot be `likely`.

### 5.5 Financial score rubric (0–100)

| Component | Max | Mapping |
|---|---|---|
| **Revenue logic** | 30 | contracted 30, plausible 20, speculative 8, unknown 10 |
| **Scale plausibility** | 20 | appropriate 20, stretched 12, implausible 4, unknown 10 |
| **Margin logic** | 16 | attractive 16, acceptable 11, thin_or_weak 5, unknown 8 |
| **Funding realism** | 16 | likely 16, uncertain 10, unlikely 4, unknown 8 |
| **Fragility (inverted)** | 10 | low 10, medium 6, high 2, unknown 5 |
| **Known scale (intake)** | 8 | any numeric range 8; `not_sure` 2 |
| **Total** | **100** | |

**Deterministic overlays (applied after LLM signals, before the table if they conflict):**

These exist so the model cannot “talk up” a bad intake:

| Intake pattern | Force |
|---|---|
| `demand_certainty = hypothesis` AND `capex_range` in `{100_500m, gt_500m}` | `revenue_logic` max `speculative`; emit critical commercial risk |
| `demand_certainty = binding` | `revenue_logic` min `plausible` (model may still set `contracted`) |
| `capex_range = not_sure` | `data_sufficiency` max `medium`; `scale_plausibility` cannot be `appropriate` unless model set `unknown` |
| Constraint `no_offtake` | treat demand as not better than `hypothesis` for **scoring**, even if Q10 was optimistic — **do not silently overwrite Q10**; emit inconsistency warning |
| Constraint `fx_political_risk` | `sensitivity_fragility` min `medium` |

**Caps:**

- `revenue_logic = speculative` → financial score **max 55**
- `scale_plausibility = implausible` → financial score **max 40**
- `data_sufficiency = low` → financial score **max 70**
- BR-FIN-003 equivalent: if synthesis later includes long-horizon numeric claims, confidence cap — but v1 snapshot template has no 10-year model, so this is a prompt constraint only

### 5.6 Failure

Same as Market: invalid after retry → abort pipeline.

---

## 6. Risk Engine

### 6.1 Purpose

Make sure a pretty commercial narrative cannot hide a **fatal or compounding risk**. Risk does not “analyze the world.” It **enforces memory**: every risk already found, plus intake constraints, plus kill rules.

### 6.2 No LLM in v1

If Market or Financial omit an obvious risk that a kill rule covers, the Risk Engine **inserts** it. It does not brainstorm new industry risks.

### 6.3 Inputs

- `risks[]` from Market, Financial, Technical-lite
- `known_constraints[]` from Review
- Intake: demand, site, stage, scale, restricted geo
- Module scores (for BR-SCR-001 style caps, applied in §10)

### 6.4 Constraint → risk mapping

| Constraint chip | Risk emitted if not already present | Default p / i |
|---|---|---|
| Permitting / regulatory uncertainty | Regulatory delay or denial | medium / high |
| No offtake or named customer | Demand not contracted | high / critical if capex ≥ 100m, else high / high |
| Site not controlled | Site control failure | high / high for greenfield/zone; medium / medium otherwise |
| Unproven technology | Technology ramp / performance | medium / high |
| FX or political risk | Convertibility / policy shock | medium / high |
| Infrastructure gaps | Utilities or logistics shortfall | medium / high |
| None of these | No extra risks from chips | — |

### 6.5 Derived risks (always evaluate)

| ID | Condition | p / i |
|---|---|---|
| `RISK-DEMAND-SCALE` | hypothesis + capex ≥ 100m | high / critical |
| `RISK-SITE-GREENFIELD` | searching + greenfield/zone | high / high |
| `RISK-CONCEPT-MEGA` | concept + capex `gt_500m` | high / high |
| `RISK-GEO-RESTRICTED` | restricted country | medium / high (compliance) |
| `RISK-BLOCKING-REG` | Market signal `regulatory_burden = blocking` | high / critical |

Deduplicate by normalized `name` + `category`. Prefer the higher impact.

### 6.6 Risk score (higher is *better*, matching DATA_MODEL)

Start at 100. Subtract:

| Feature | Penalty |
|---|---|
| Each **critical** open risk | −18 |
| Each **high** open risk | −10 |
| Each **medium** open risk | −4 |
| Each **low** open risk | −1 |
| Any critical with empty mitigation | additional −8 |
| ≥3 high-or-critical | additional −10 |

Floor at 0. Ceiling at 100.

Mitigation status from modules: `open` \| `mitigating` \| `monitoring` \| `closed`. Only `closed` risks are excluded from penalties. Lite template mitigations count as `open` (suggested, not done).

### 6.7 Risk Engine output

Standard Module Result with `module: risk`, `signals` including `critical_count`, `high_count`, `unmitigated_critical` (boolean), `top_risks` (max 5, ordered impact then probability).

This module’s score is **not** in the composite weight. It only feeds caps, vetoes, and the report.

---

## 7. Strategic Fit Engine

### 7.1 Purpose

Answer: **Is this the kind of opportunity this evaluator should spend time on, given who they are and what decision they asked for?**

This is mandate fit, not market attractiveness. Market already scored attractiveness.

### 7.2 Why a policy table, not an LLM

We do not have IPA priority-sector lists, bank credit policies, or zone tenant strategies in v1. An LLM will fabricate “alignment with national industrial strategy.” That is a credibility bomb for IPA customers.

v1 fit is **internally consistent with the user’s own answers.** Optional one-paragraph synthesis later can mention fit; this engine does not research it.

### 7.3 Signals (derived)

| Signal | Meaning |
|---|---|
| `context` | `evaluation_context` |
| `decision` | `decision_needed` |
| `shape` | `opportunity_type` |
| `mandate_tension` | `none` \| `mild` \| `severe` (from table) |

### 7.4 Mandate tension table (v1)

Rows: evaluation context. Columns: patterns. First matching **severe** wins over mild.

| Context | Mild tension | Severe tension |
|---|---|---|
| `consultant_client` | `decision_needed = compare` with no portfolio peers in product yet | — |
| `ipa_inbound` | `asset_light` (harder to show FDI/jobs) | `opportunity_type = other` + sector Other |
| `sponsor_own` | — | — |
| `bank_screen` | `demand_certainty` in `{hypothesis, advanced}` | `demand_certainty = hypothesis` AND capex ≥ 100m |
| `zone_developer` | `asset_light` | `site_control = not_needed` (no land story) |
| `public_agency` | `asset_light` | — |

`decision_needed = financing_read` adds **mild** tension if `demand_certainty` ≠ `binding`/`loi` (do not pretend bankability).

### 7.5 Strategic fit score rubric (0–100)

Base **75** (neutral-positive: the user chose to evaluate it).

| Adjustment | Delta |
|---|---|
| Severe mandate tension | −35 |
| Mild mandate tension | −12 |
| `decision_needed` matches a clean path: `go_nogo` or `client_response` | +8 |
| `mandate_screen` (we *want* a high bar; slightly lower fit for “commit a team” if demand is hypothesis) | −8 if demand is hypothesis, else +0 |
| Country restricted | −10 (political/mandate friction) |
| IPA + sector in {energy, manufacturing, logistics, infrastructure} | +10 |
| Zone developer + `greenfield`/`zone`/`expansion` + site not `not_needed` | +10 |

Clamp 0–100.

### 7.6 Findings

Two or three **templated** findings. No LLM. Example: “Evaluation context is bank early screen, but demand is a hypothesis at 100m+ scale. Fit for a credit process is weak until offtake firms up.”

### 7.7 Future (not v1)

Org-level **mandate profile**: priority sectors, countries, ticket size, excluded activities. Then this engine becomes a real differentiator (IPA/bank). Interface: `org.settings.mandate`. Score against profile. Still no LLM required.

---

## 8. AI Recommendation Engine

### 8.1 Purpose

Turn a **locked Decision Object** into language a senior advisor can put in front of a client or committee — without letting the model renegotiate the decision.

This is a **writer**, not a judge.

### 8.2 Inputs (read-only)

- Posture enum and veto IDs from §10
- Condition IDs (structured) from §10
- Domain scores + breakdowns
- Confidence + drivers
- Top 5 risks
- Key assumptions (those with confidence ≤ medium)
- Market and Financial executive summaries (model-written, treated as drafts)
- `evaluation_context` + `decision_needed` (tone)
- `title`, sector, country, product_summary

### 8.3 Outputs

| Field | Rule |
|---|---|
| `executive_summary` | ≤ 400 words. First sentence states the posture in plain language. |
| `rationale[]` | 3–6 bullets. Each bullet must trace to a signal, score component, or risk_id. |
| `conditions_prose[]` | One sentence per structured condition. No extra conditions. |
| `what_would_change_this` | 2–4 bullets: the cheapest facts that could move the posture. |
| `next_work` | 2–4 bullets: what a human should do *before* a full feasibility study. |
| `tone_variant` | Echo of context (client memo vs. IPA response vs. internal screen) |

**Hard constraints (validator after the model, not honor-system):**

1. Output JSON must include `decision_echo` equal to the locked posture. If mismatch → discard and retry once with a stricter system reminder. If still mismatch → use a **template memo** (ugly but safe) and flag `synthesis_degraded`.
2. Must not contain numeric scores the Decision Object does not have (no invented IRR).
3. Must not add conditions that are not in `conditions[]`.
4. Must not upgrade or soften the posture (“cautious proceed” when enum is `do_not_pursue`).
5. Must include the standard AI-assisted disclaimer token for the snapshot (`BR-APR-002`).

### 8.4 Tone by `evaluation_context`

| Context | Voice |
|---|---|
| consultant_client | Client-presentable, no internal slang, conditions as “recommended before commitment” |
| ipa_inbound | Competitiveness + location; avoid overselling FDI |
| sponsor_own | Direct, internal, next actions |
| bank_screen | Credit posture; explicitly **not** a credit approval |
| zone_developer | Occupancy / land / infrastructure fit |
| public_agency | Mandate and public-policy caution |

`decision_needed = financing_read` always appends: “This is not a bankable financial model.”

### 8.5 What this engine is not

- Not a second scoring pass
- Not a debate with the rules
- Not a 20-page writer
- Not allowed to call tools or other modules

---

## 9. Confidence Scoring

### 9.1 Purpose

Tell the user **how much of this recommendation is knowledge vs. interpolation.** High score + low confidence means “interesting but not bankable as-is.” That pairing is a feature.

Confidence is **orthogonal** to attractiveness. It never averages into the composite. It **constrains** the posture (§10).

### 9.2 Forbidden sources of confidence

- The LLM’s own `confidence: high|medium|low` field (prompts must stop asking for it as an authority)
- Token logprobs
- “We used GPT-4 so confidence is high”

### 9.3 Formula (0–100)

| Factor | Weight | Measurement |
|---|---|---|
| **Intake completeness** | 40 | See 9.3.1 |
| **Source quality** | 30 | See 9.3.2 |
| **Assumption validation** | 20 | See 9.3.3 |
| **Coverage** | 10 | See 9.3.4 |

#### 9.3.1 Intake completeness (0–100, then × 0.40)

Start at 100. Subtract:

| Soft unknown | Penalty |
|---|---|
| `capex_range = not_sure` | −25 |
| `buyer_type = unknown` | −15 |
| `demand_certainty = hypothesis` | −15 |
| `demand_certainty` + `buyer_type` unknown together | extra −10 |
| `location_specificity = country_only` | −10 |
| `site_control = searching` | −10 |
| `site_control = not_needed` | 0 |
| Sector = Other (free text) | −8 |

Wizard Review’s `confidence_preview` is a **UX hint**, not this score. They should usually agree in band (high/medium/low). If they disagree, this formula wins; UI can show “Updated after analysis.”

Band mapping for UI: ≥70 high, 45–69 medium, <45 low.

#### 9.3.2 Source quality (0–100, then × 0.30)

From the Decision Object source registry:

```
quality = average(reliability_score of cited sources)
          − 15 if ai_inference share > 50% of citations
          − 10 if zero industry_research or regulation sources
```

v1 reality: most sources will be `user_input` (reliability ~80) and `ai_inference` (~55–65). **Typical first-run source quality will sit ~60–70.** That is correct. We do not pretend a 12-question interview is a data room.

If Market cited a curated `data/markets` or `data/sources` row, reliability of that row applies.

#### 9.3.3 Assumption validation (0–100, then × 0.20)

From assumptions on the project:

| Grade | Weight in average |
|---|---|
| verified | 100 |
| high | 85 |
| medium | 60 |
| low | 35 |
| unverified | 20 |

If fewer than 4 assumptions, score **max 50** (too thin to be confident).

#### 9.3.4 Coverage (0–100, then × 0.10)

| State | Value |
|---|---|
| Market + Financial completed; Technical lite completed; Strategic completed | 80 |
| Same, but Market `data_sufficiency = low` or Financial `data_sufficiency = low` | 50 |
| Any future skipped **required** module | 30 |
| Technical **full** skipped when org required it | 20 |

v1 typical: 80, then dragged down by data_sufficiency.

### 9.4 Caps (applied last)

| Trigger | Cap |
|---|---|
| Financial or Market `data_sufficiency = low` | 55 |
| `capex_range = not_sure` AND demand `hypothesis` | 40 |
| Synthesis degraded (template fallback) | 50 |
| Restricted geography (analysis allowed) | 70 |
| BR-FIN-003 analog (if we ever emit >5 year numeric tables at non-operating stage) | 60 (`medium` in old enum) |

### 9.5 Display

Always show: integer, band (low/medium/high), and **two driver sentences** (“Scale is unknown. Most market figures are estimates.”). Never show a lock icon that implies certified research.

---

## 10. Final Decision Logic

### 10.1 Postures (canonical)

| Enum | Meaning for the user | When we use it |
|---|---|---|
| `proceed` | Worth advancing; no blocking conditions | Rare in v1 by design |
| `proceed_with_conditions` | Advance only if listed conditions are accepted | Default “good” outcome |
| `defer` | Not decision-ready; missing facts or premature stage | Default “thin intake” outcome |
| `do_not_pursue` | Do not spend further resources on this as framed | Structural holes, not bad vibes |

No fifth status. No “watchlist.” `on_hold` is a **pipeline** status the user sets later, not an engine posture.

### 10.2 Composite feasibility score (secondary)

v1 weights (renormalize if a weighted module is skipped):

| Module | v1 weight | When Technical full ships |
|---|---|---|
| Market | 0.40 | 0.30 |
| Financial | 0.40 | 0.30 |
| Strategic Fit | 0.20 | 0.20 |
| Technical full | 0 | 0.20 |
| Technical lite | **not in composite** | — |
| Risk | **not in composite** | still not |

Technical lite is **excluded from the composite** so a “site searching” penalty is not double-counted with Risk vetoes. Lite still appears on the report as an execution bar and feeds Risk.

**Caps on composite (after weighted sum):**

| Rule | Cap |
|---|---|
| Any of Market / Financial / Strategic Fit score < 30 | composite max 50 (BR-SCR-001) |
| Risk score < 40 | composite max 55 |
| Unresolved `unmitigated_critical` | composite max 45 |
| Missing Technical full when org-required (future BR-SCR-003 analog) | composite max 65 |

Integer rounding: half away from zero, then clamp 0–100.

**The composite is not shown as a letter grade.** DATA_MODEL’s `grade: B+` is **retired for v1 UI.** Internal storage may keep a grade for later; the product surface is posture + bars.

### 10.3 Vetoes (evaluated in order, first decisive veto sets a *ceiling*)

Vetoes never *raise* a posture. They only impose a maximum.

| ID | Condition | Ceiling |
|---|---|---|
| VETO-CRITICAL | ≥1 critical open risk | `proceed_with_conditions` |
| VETO-UNMIT-CRIT | critical + empty mitigation | `defer` |
| VETO-BLOCK-REG | `regulatory_burden = blocking` | `do_not_pursue` |
| VETO-DEMAND-MEGA | hypothesis + capex ≥ 100m | `defer` |
| VETO-TRIPLE-HOLE | hypothesis + site searching + stage concept | `defer` |
| VETO-IMPLAUSIBLE | financial `scale_plausibility = implausible` | `do_not_pursue` |
| VETO-MODULE-FLOOR | Market or Financial score < 30 | `defer` |
| VETO-CONF-PROCEED | confidence < 50 | `proceed` forbidden (ceiling `proceed_with_conditions`) |
| VETO-CONF-THIN | confidence < 40 | `defer` |
| VETO-BANK-HYP | context `bank_screen` + demand hypothesis | `proceed` forbidden |
| VETO-FINANCE-READ | `decision_needed = financing_read` + demand not binding/loi | `proceed` forbidden |

Restricted geography does **not** change posture by itself. It blocks **export** until override (`BR-INT-004`, `BR-APR` family).

### 10.4 Base posture from composite (before veto ceiling)

| Composite | Base posture |
|---|---|
| ≥ 80 | `proceed` |
| 60–79 | `proceed_with_conditions` |
| 45–59 | `defer` |
| ≤ 44 | `do_not_pursue` |

Then `final = min(base, veto_ceiling)` using the order:

`proceed` > `proceed_with_conditions` > `defer` > `do_not_pursue`

### 10.5 Why `proceed` is rare

A 12-question interview with estimated market figures should almost never produce an unconditional go. If dogfooding yields >25% `proceed`, **tighten caps**, do not celebrate. Unconditional proceed requires:

- Composite ≥ 80 after caps
- Confidence ≥ 50
- No critical risks
- Demand `binding` or `loi`
- Site not `searching` (unless `not_needed`)
- No blocking regulation

If those hold and a veto still fires, veto wins.

### 10.6 Conditions (structured, then written by §8)

Conditions are **IDs**, not prose, until synthesis.

Emit a condition if the corresponding issue is open. Always attach to `proceed_with_conditions`. Also attach to `defer` as “what would allow a re-run.” Do not attach to `do_not_pursue` except `COND-REFRAME` (optional).

| ID | Trigger | Meaning |
|---|---|---|
| `COND-OFFTAKE` | demand not `binding` | Execute or evidence offtake / named demand |
| `COND-SITE` | site `searching` or `option` on greenfield/zone | Secure site control |
| `COND-SCALE` | capex `not_sure` | Bound capital requirement |
| `COND-PERMIT` | permitting constraint or regulatory_burden high | Clarify permit path |
| `COND-TECH` | unproven technology chip | Independent tech validation |
| `COND-GRANT-FUND` | funding_realism `uncertain`/`unlikely` | Confirm funding path |
| `COND-INFRA` | infrastructure constraint | Confirm utilities/logistics |
| `COND-GEO` | restricted geo | Admin / compliance review |
| `COND-REFRAME` | scale implausible or blocking reg | Only if posture is do_not_pursue: “only revisit if the project is redesigned” |

Maximum **5** conditions shown. Priority: offtake, site, blocking/permit, scale, funding, then others.

### 10.7 `decision_needed` framing (does not change the enum except via vetoes already listed)

| Need | Engine behavior |
|---|---|
| `go_nogo` | Standard |
| `client_response` | Same enum; synthesis more polished |
| `mandate_screen` | Same enum; `next_work` emphasizes whether to staff a full study |
| `compare` | Same enum; synthesis states **absolute** posture and that peer ranking is out of scope in v1 |
| `financing_read` | Veto on unconditional proceed without offtake paper; disclaimer |

### 10.8 Worked examples (normative)

**A. IPA inbound, 25–100m solar, LOI, site option, Türkiye**  
Market ~70s, Financial ~65–75, Fit high, Risk medium, Confidence medium.  
Base: `proceed_with_conditions`. Conditions: offtake binding, site secured. Typical healthy v1 result.

**B. Concept, >500m, hypothesis demand, site searching**  
VETO-TRIPLE-HOLE + VETO-DEMAND-MEGA. Confidence low.  
`defer`. Not `do_not_pursue` — the idea may be real; the **file** is not ready.

**C. Binding offtake, operating expansion, 5–25m, known site**  
Can reach `proceed` if Market/Financial signals are clean and confidence ≥ 50. This is the main path to unconditional proceed.

**D. Regulatory blocking**  
`do_not_pursue` regardless of IRR fantasies the model might want to write (it cannot write IRR anyway).

### 10.9 Human override

Evaluator may change posture on the report **only** with a written reason. Logged in `audit_event`. Override does not recompute scores. Label: “Evaluator decision (engine recommended X).” Admin-only for gate/error overrides remains as in BUSINESS_RULES §7.

Engine never auto-moves status to `approved`. Path: `in_review` → evaluator accept (`accepted_recommendation` or equivalent) → export allowed if disclaimer + complete runs (`BR-APR-001` adapted: for MVP, **evaluator acceptance stands in for a separate reviewer**. Do not require a second person.)

---

## 11. Report Generation Pipeline

### 11.1 Principle

The report is a **rendering of the Decision Object**, not a second analysis. If a sentence cannot be traced to the object, it does not belong.

Target length: **4–8 pages**. Anti-metric remains page count. Welcome screen “2 minutes” includes this pipeline.

### 11.2 Stages

```
Decision Object (locked)
        │
        ▼
Synthesis LLM  (§8)  →  narrative fields on the object
        │
        ▼
Template compose     →  report_snapshot.content_json
        │
        ▼
Advisor edit (optional, structured fields only)
        │
        ▼
Export PDF / share link
        │
        ▼
Compliance check (disclaimer, audit completeness, geo override)
```

### 11.3 Snapshot contents (fixed outline)

1. **Decision header** — Title, country, sector, posture, confidence band, date, rule/prompt versions  
2. **Executive summary** — Synthesis, ≤400 words  
3. **Why this posture** — Rationale bullets + veto IDs in plain language  
4. **Conditions** — Structured list (or “None — unconditional proceed”)  
5. **Scoreboard** — Market, Financial, Strategic Fit, Execution readiness (lite), Risk (inverted), Confidence. Composite in small type.  
6. **Commercial view** — Market findings (size, competition, regulation)  
7. **Economic view** — Financial findings without fake IRR  
8. **Execution view** — Lite technical + site/stage  
9. **Fit** — Mandate tension, if any  
10. **Risks** — Top 5, p/i, mitigation  
11. **Assumptions** — All, sorted unverified → verified  
12. **What would change this** + **Next work**  
13. **Sources**  
14. **Disclaimer** — AI-assisted pre-feasibility screen; not investment advice; not a bankable model; not legal/technical DD  

No appendix of raw JSON in the client PDF. Raw object available to admins for audit.

### 11.4 Editing rules (advisor)

**Editable:** executive summary wording, condition prose, next-work bullets, title, evaluator notes.  
**Not editable without override + reason:** posture enum, scores, veto IDs, confidence integer.  
Edits bump snapshot `version`. Export uses latest snapshot.

### 11.5 Export compliance

| Check | Fail action |
|---|---|
| Disclaimer present | Block export (BR-APR-002) |
| All required analysis_runs `completed` (Market, Financial, Risk, Strategic, Technical-lite) | Block (BR-APR-003) |
| Restricted geo without admin override | Block |
| Synthesis degraded flag | Allow export with banner “Narrative used fallback template” |

### 11.6 Handoff UX (already specified in Wizard)

Module rows: Market, Financial, Strategic fit. **Add** Execution readiness as a fourth row (instant). Do not show “Risk” as a spinning LLM. When complete, land on the report, not a chat.

---

## 12. Extensibility for future modules

### 12.1 How to add a module without redesign

A new module is allowed when it has a **new input class** the current engines cannot see (e.g. process design, living prices, ESG questionnaires). It is not allowed as “another essay.”

**Checklist:**

1. Implement the **Module Contract** (§2.5).
2. Declare dependencies (which upstream **signals** it reads).
3. Declare whether it is `required`, `optional`, or `sector_gated`.
4. Provide a **signal list** and a **rubric** (or `unscored: true` if it only emits risks).
5. Register default weight **or** `weight: 0` + veto/cap behavior (like Risk).
6. Add prompt file **only if** it is an LLM module. Version it.
7. Add findings categories to the report outline (one section).
8. Update confidence Coverage factor.
9. Ship skipped-with-reason behavior for v1-era opportunities that lack inputs.

No plugin runtime, no in-app script sandbox, no customer-written Python. **Configuration, not code injection.**

### 12.2 Planned modules (interfaces only)

| Module | Phase | Inputs it needs | Scoring role |
|---|---|---|---|
| Technical **full** | 2 | Capacity, TRL, utilities, process | Weighted 20% |
| Scenario / sensitivity | 2 | Driver ranges | Unscored; can add conditions |
| Sector templates | 2 | Taxonomy pack | Replaces prompt + rubric constants |
| Benchmarking | 3 | Peer set | Caps and findings, not a 6th weight |
| ESG / integrity | 3 | Questionnaire | Veto/cap |
| Legal / title | never as LLM-only | Counsel docs | Skip until documents exist |
| Monitoring / drift | 4 | Source refresh | Re-run trigger, not a score |
| Mandate profile | 2 | Org settings | Replaces Strategic Fit base |

### 12.3 Versioning

| Layer | Versioned as | Compatibility |
|---|---|---|
| Payload schema | `interview_payload.v1` | Additive fields OK; removals need a new major |
| Module Result | `module_result.v1` | Same |
| Decision Object | `decision_object.v1` | Posture enums frozen |
| Ruleset | `rules.v1.x` | Logged on every run |
| Prompts | files in `prompts/` + version header | Logged on every run |
| Report template | `report.v1` | |

Re-running an old opportunity with new rules produces a **new** Decision Object. Never silently restyle an accepted report.

### 12.4 Multi-tenant variation (keep tiny)

v1 org settings allowed:

- Default currency override
- Restricted-geo handling already global
- **Not in v1:** custom weights, custom vetoes, custom prompts per tenant

Custom weights without a governance UI is how you get incomparable scores across a firm. When we add them (Phase 3), require an admin role, a name, and a frozen copy on the run.

### 12.5 What we will not build “for flexibility”

- Graph of agents debating
- Fine-tuned scoring model on 50 labeled deals (no data yet)
- Real-time streaming of chain-of-thought
- Automatic web search “to be thorough”

When labeled deals exist, the first ML use is **calibrating rubric cut-points**, not replacing the policy.

---

## 13. Operating constraints

### 13.1 Cost

Budget per successful run: **3 model calls**. If a future module needs a fourth, it must earn it by replacing synthesis or by running async after the first decision (enrichment), not on the critical path.

### 13.2 Quality loop (minimum)

After dogfood of ≥10 real opportunities:

- Distribution of postures (if `proceed` > 25%, tighten)
- Rework rate vs. PRD <15%
- Spot-check: can an engineer recompute scores from stored signals with a spreadsheet? If no, the rubric leaked back into the model.

### 13.3 Security and compliance (engine-relevant)

- Freeze PII in audit payloads (emails in free text on Q3 should already be rejected)
- Store raw LLM I/O 90 days (DATABASE.md)
- Never put API keys in prompts or snapshots

---

## 14. Document alignment (what this spec supersedes)

| Prior statement | v1 Decision Engine |
|---|---|
| BUSINESS_RULES weights 35/25/40 Market/Tech/Financial | 40/40/20 Market/Financial/Strategic Fit; Risk veto; Tech lite unscored |
| DATA_MODEL overall weights including Risk 15% | Risk not weighted; used as cap/veto |
| DATA_MODEL letter grades | Not a v1 product surface |
| DATA_MODEL NPV/IRR as standard financial object | Not computed in v1; fields remain nullable for later |
| Roadmap “Technical in parallel if capacity” | Lite rubric only; full module Phase 2 |
| Financial prompt CAC/LTV | Replaced by project-economics prompt (implementation later) |
| Market/Financial prompts requesting model `score` | Removed; rubrics own scores |
| PRD four postures | Unchanged, now with veto tables |
| Wizard 2-minute report | Pipeline SLA 90s p95 / 120s timeout |

BUSINESS_RULES.md and prompt files should be updated in a **follow-on docs pass** to match this spec. This document is authoritative for engine behavior until then.

---

## 15. Open questions (do not block v1 build)

1. **Org mandate profiles** — highest-leverage Phase 2 for IPAs; not needed to ship the engine.  
2. **Whether `not_sure` scale should block Financial** — Wizard allows run; this spec agrees (low confidence, weaker financial score). Revisit if a bank design partner requires a number.  
3. **Force re-run vs. 24h cache** — product call; default as specified.  
4. **Evaluator-only vs. reviewer** — locked to evaluator-only for MVP; enterprise adds reviewer without changing rubrics.  
5. **Sector packs** — energy + manufacturing first when templates start; engine stays sector-agnostic.

---

## 16. Implementation sequencing (for planning, not this task)

Specified so engineering does not start in the wrong place:

1. Payload freeze + Decision Object schema + audit  
2. Gates + Technical-lite + Strategic Fit + Risk + Confidence + Decision **with stub Market/Financial signals** (golden-file tests on examples A–D)  
3. Market LLM + rubric  
4. Financial LLM + rubric  
5. Synthesis + report template  
6. Wire Wizard “Run analysis”  

The **policy core can be tested without a model.** That is the CTO requirement: if OpenAI is down, we can still prove vetoes on fixtures.

---

**Bottom line:** v1 is a **rules engine with two research calls and one writer.** Market and Financial classify the world; everything else enforces honesty. The product is a posture you can defend in a meeting, not a generated feasibility novel.
