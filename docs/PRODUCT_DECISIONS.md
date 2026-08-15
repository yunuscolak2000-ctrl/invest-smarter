# Product Decision Register

**Product:** Invest Smarter  
**Document type:** Permanent product and architecture decision log  
**Owner:** Product (CPO) with Technology (CTO)  
**Started:** August 2026  
**Status vocabulary:** `Accepted` · `Deprecated` · `Superseded`

This register records **permanent** decisions. It is not a roadmap, not meeting notes, and not a backlog.

A decision enters this file only when it constrains what we build, what we refuse to build, or how a later document must behave. New work must comply or formally supersede the relevant `PD-*`.

Where later documents conflict with an `Accepted` decision here, **this register wins** until that decision is marked `Deprecated` or `Superseded`. Where this register and [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) conflict, the manifesto wins until it is amended.

---

## How to read a record

Each record uses the same fields:

| Field | Meaning |
|---|---|
| **Decision** | The locked rule. Written so an engineer can implement it and a designer can refuse a screen. |
| **Reason** | Why this is true, including the assumption we rejected. |
| **Impact** | What must change in product, architecture, or existing docs. |
| **Status** | `Accepted`, `Deprecated`, or `Superseded` only. |
| **Related Documents** | Canonical specs this decision binds. |

Do not add options, owners, dates-for-revisit, or “next steps.” Those belong elsewhere.

---

## Simpler MVP implied by this register

These ten decisions already describe a small product. Do not expand v1 to match [DATA_MODEL.md](./DATA_MODEL.md) examples or [PRD.md](./PRD.md) portfolio/workspace language.

**v1 is:**

```
12-question wizard (one question per screen)
        → Review freeze (structured payload)
        → Gates + deterministic policy
        → Two LLM classifiers (Market, Financial) when earned
        → One LLM writer around a locked posture
        → Named evaluator accepts, amends with reason, or rejects
        → Report snapshot (a rendering, not a second analysis)
```

**v1 is not:** a feasibility study, a financial model, a chatbot that authors questions, a six-engine “AI committee,” live web research, document RAG, CRM, marketplace, pipeline analytics, or two-person approval.

The policy core must be testable **without a model**. If the model is down, fixtures still produce the same posture, conditions, and confidence.

---

PD-001

**Decision**  
One question per screen in the Interview Wizard. Framing, Review, and analysis handoff are not questions. The wizard is a scripted, linear interview of twelve decision-changing questions — not a chat, not a long form, and not a generative questionnaire.

**Reason**  
Advisors came to decide, not to fill a data room. One question per screen forces each field to earn its place: if it cannot change a score, veto, condition, or confidence penalty, it does not ship. A multi-field form hides holes; a model that invents the next question cannot offer stable Previous/Next, an honest progress bar, or a reviewable payload.

Assumption rejected: “conversational AI” means the model authors the interview. That fights enterprise trust and PD-002. Assumption rejected: 15–18 questions is more rigorous. Extra questions raise abandonment, not quality. Assumption rejected: one *topic* per screen. Currency plus capital range on the scale question is one decision (scale), two controls — do not split it for purity.

**Impact**  
Intake UX is [INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md): twelve questions + framing + review + handoff. No document upload, no competitor lists, no exact CAPEX, no technical/IP stack in this wizard. Progress is `n / 12`. Analysis does not start from a question screen. Do not add screens to collect [DATA_MODEL.md](./DATA_MODEL.md) objects (TAM, machines, IRR). Those are analysis outputs, not intake.

**Status**  
Accepted

**Related Documents**  
[INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §9 (intake is design; one question on the surface) · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §2.1 (pipeline starts only on Review confirm)

---

PD-002

**Decision**  
The interview always collects structured data and the evaluator confirms it before any AI analysis runs. Drafts do not analyze. Partial interviews do not analyze. The Review screen is the commit.

**Reason**  
Unstructured prose cannot feed deterministic gates, rubrics, or audit. If analysis starts while the user is still talking, the institution cannot say what was asked. Models that “just figure it out” from a paragraph invent offtake, site, and scale — which PD-005 forbids.

Assumption rejected: document upload and RAG are required for a first decision. Parsing is a product. Assumption rejected: the wizard should collect the full project document in [DATA_MODEL.md](./DATA_MODEL.md). That document is the *target record after analysis*, not the intake contract. Assumption rejected: streaming or per-screen model calls make intake feel intelligent. They spend money, destroy determinism of the question list, and delay the freeze.

**Impact**  
v1 input to the engine is the frozen Interview Wizard payload only (`interview_payload.v1`). User intake is registered as a source. Attachments may enrich later runs; they do not unlock the first decision. [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) Accept → Gate → Normalize cannot start without that freeze.

**Status**  
Accepted

**Related Documents**  
[INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) (Review is the commit) · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §1–2 · [DATA_MODEL.md](./DATA_MODEL.md) (normalized Project/Product skeleton is written *from* the payload, not collected as the payload) · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §10 (closed outputs; AI is a clerk)

---

PD-003

**Decision**  
The Decision Engine is deterministic at the point of commitment. LLMs classify structured signals and draft prose. They never assign scores, never choose posture, never set confidence, and never override a locked Decision Object. Rules emit the decision enum. The writer explains it.

**Reason**  
If a model can change `proceed` to `defer`, we do not have a product; we have a chat. Banks and agencies will not buy an uncalibrated grader. Same payload + same prompt versions + same rule versions must yield the same posture, scores, vetoes, and condition IDs. Narrative may vary. The decision may not.

Assumption rejected: six peer “AI engines” that vote. Cost, latency, and contradiction compound; contradiction is not rigor. Assumption rejected: the model should emit 0–100 scores. Assumption rejected: “deterministic” means bit-identical Market/Financial JSON on every call. Classification can jitter; caching identical payload hashes inside an org is allowed. What must not jitter is the function from *locked signals* to scores and posture. Assumption rejected: a composite 0–100 grade is the product. The hero output is posture + conditions + confidence.

**Impact**  
v1 engine: two LLM analysis calls (Market, Financial) + one synthesis call. Technical-lite, Strategic Fit, Risk, Confidence, and Decision are rules. Existing prompts that ask the model for `score` or authoritative `confidence` are invalid. [DATA_MODEL.md](./DATA_MODEL.md) letter grades and `scores.overall_investment_score.recommendation` are not the v1 product surface. [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) wins over earlier weight tables in business rules.

**Status**  
Accepted

**Related Documents**  
[DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §0, §8, §10 · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §8–10 · [DATA_MODEL.md](./DATA_MODEL.md) §10 (storage shape; not UI authority)

---

PD-004

**Decision**  
Evidence before opinion. A finding, figure, or condition that cannot cite a source did not happen. Analysis classifies signals from intake and curated reference data. It does not browse the open web to look thorough.

**Reason**  
Fluency is not a decision. Unsourced TAM, competitor sets, and “national strategy alignment” are defects, not intelligence. The scarce resource is judgment under incomplete information, applied the same way twice — not more prose.

Assumption rejected: live market data, news sentiment, or RAG in v1. Licensing, latency, and hallucinated citations. Assumption rejected: we must wait for a populated research library before shipping. v1 evidence is mostly `user_input` plus labeled estimates; that is honest. Assumption rejected: more modules equal more evidence. A module is allowed only for a new input class.

**Impact**  
Every finding, assumption, and market figure carries `source_id`. Curated reference rows are used if present; otherwise estimates are labeled and confidence falls. No web browse, no vector store, no “research theater.” Synthesis may not invent facts the Decision Object does not contain.

**Status**  
Accepted

**Related Documents**  
[PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §7–10 · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §1.3, §3, §11 · [DATA_MODEL.md](./DATA_MODEL.md) §7 and §9 (assumptions and sources are first-class)

---

PD-005

**Decision**  
Unknown is better than guessed. The product must show uncertainty as uncertainty. Soft unknowns (`not_sure`, `unknown`, `hypothesis`, country-only location) are valid professional answers. They lower confidence and can veto unconditional proceed. They must not be filled by invented precision.

**Reason**  
False precision poisons the file. A guessed IRR from a capital range is consulting malpractice. A guessed TAM treated as fact is a defect. Institutions can live with “we do not know”; they cannot live with a confident number that was never measured.

Assumption rejected: Financial v1 must produce NPV, IRR, or payback. [DATA_MODEL.md](./DATA_MODEL.md) financial examples are a later shape, not a v1 contract. Assumption rejected: the interface should interpolate missing facts so the report looks complete. Assumption rejected: `not_sure` on scale should block analysis. Allow the run; cap confidence and financial score. Blocking trains users to invent a number.

**Impact**  
No NPV/IRR/payback in v1. Estimates labeled. Confidence is a data-quality meta-score, never the model’s self-regard. High attractiveness + low confidence must be allowed to coexist. Unconditional `proceed` remains rare on thin intake. Wizard copy and Review confidence strip must not dress unknowns as facts.

**Status**  
Accepted

**Related Documents**  
[PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §8–9 · [INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) (unknown is valid except hard gates) · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §5.2, §9, §10.5 · [DATA_MODEL.md](./DATA_MODEL.md) (nullable financial fields; do not populate them from guesses)

---

PD-006

**Decision**  
Collect once. Reuse the structured opportunity record thereafter. Re-running analysis with the same frozen payload, prompt versions, and rule version reuses the Decision Object (org-scoped cache). Changing answers or rules creates a new run. An accepted report is never silently rewritten.

**Reason**  
Advisors will not re-type sector, country, and offtake status for every memo. Collecting the same fact twice invites contradiction. “Forever” does not mean a knowledge graph, CRM, or cross-org memory.

Assumption rejected: reuse across organizations. Cache key is `org_id + payload_hash + prompt_versions + rule_version`. Assumption rejected: new prose templates should restyle an accepted snapshot. History is not rewritten. Assumption rejected: portfolio matching, investor–project marketplace, or “institutional memory” products in v1. Those dilute the one decision we own. Assumption rejected: live monitoring that mutates a locked decision when a source moves. Monitoring, if ever built, opens a *new* run.

**Impact**  
One opportunity record; many analysis runs. Intake maps once onto Project/Product. Sources and assumptions persist on the record. Force re-run is explicit. Do not build a second intake for the report. Do not auto-publish or auto-update accepted decisions.

**Status**  
Accepted

**Related Documents**  
[DATA_MODEL.md](./DATA_MODEL.md) (single project document; provenance) · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §1.4, §2.7, §12.3 · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §7 (not a CRM, marketplace, or monitoring tool) · [INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) (payload is the reuse unit)

---

PD-007

**Decision**  
Reports do not make decisions. People do. The engine recommends. A named evaluator accepts, amends posture or scores only with a written reason, or rejects. There is no auto-publish. There is no decision without a person.

**Reason**  
Software does not commit capital and does not staff a team. A PDF that “concludes” without a signer recreates the informal yes we exist to replace. The memo is a rendering of a locked Decision Object. If a sentence cannot be traced to that object, it does not belong.

Assumption rejected: two-person reviewer/approver in MVP. [PRD.md](./PRD.md) left this open; it is enterprise later. Evaluator confirmation stands in. Assumption rejected: the synthesis model may add conditions or soften posture. Validator discards mismatch; template fallback if needed. Assumption rejected: team workspace, comments, and portfolio kanban are required to honor “people decide.” A named evaluator on one file is enough for v1.

**Impact**  
Status path: `analyzing` → `in_review` → evaluator `accepted` or `rejected`. Export requires disclaimer and completed required modules. Override is logged. Engine never moves a file to `approved` by itself. Report length is an anti-metric.

**Status**  
Accepted

**Related Documents**  
[PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §6–8, §11 · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §8, §10.9, §11 · [INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) (human confirm before spend)

---

PD-008

**Decision**  
Every recommendation must be explainable. Posture is explained by veto IDs, condition IDs, score breakdowns, and confidence drivers — inspectable by the evaluator. A black box will not survive the first committee.

**Reason**  
Institutions do not fund a score. They fund or refuse a course of action. If an engineer cannot recompute scores from stored signals with a spreadsheet, the rubric leaked back into the model.

Assumption rejected: an explainability platform, SHAP/LIME, chain-of-thought streaming, or a committee of models. The breakdown *is* the explanation. Assumption rejected: free-form “score rationale” as the only account of a number. Assumption rejected: showing a letter grade (A/B/C) as the recommendation. That invites argument about the glyph.

**Impact**  
Module results store `score_breakdown` that sums to the score. Report section “Why this posture” lists rationale bullets tied to signals, components, or `risk_id`, plus vetoes in plain language. Rubrics, vetoes, and sources are visible. Synthesis cannot be the sole explanation.

**Status**  
Accepted

**Related Documents**  
[DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §2.5, §3.5, §5.5, §10, §11.3 · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §9.7 · [DATA_MODEL.md](./DATA_MODEL.md) (scores are derived syntheses, not primary inputs)

---

PD-009

**Decision**  
Every conclusion must reference evidence. A conclusion is a finding, assumption, risk, condition, or posture driver. Each cites `source_id`s or a rule ID that fired on cited inputs. User intake is evidence. AI inference is evidence with lower reliability. An unsourced figure is not intelligence.

**Reason**  
Traceability is the rigor we sell. “The market is attractive” with no source is an opinion (PD-004). “Proceed because the model is confident” is forbidden (PD-003, PD-005).

Assumption rejected: every sentence in the memo needs a Bloomberg-grade citation. v1 typical sources are intake (~80 reliability) and AI inference (~55–65). That is correct; we do not pretend a twelve-question interview is a data room. Assumption rejected: BR-MKT-001 (missing source) should block the pipeline. Warning plus confidence penalty. Fail closed only when Market or Financial cannot complete. Assumption rejected: generic industry risk catalogs inserted without a trigger in intake or module signals.

**Impact**  
Source registry is mandatory on the Decision Object. Findings include `source_ids[]`. Assumptions include `source`. Risk engine may insert a risk only from module risks, constraint chips, or derived kill rules — not from brainstorming. Synthesis rationale bullets must trace to a signal, score component, or `risk_id`.

**Status**  
Accepted

**Related Documents**  
[DATA_MODEL.md](./DATA_MODEL.md) §7–9 · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §3.4, §6, §8.3, §9.3.2 · [PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §8, §10.5

---

PD-010

**Decision**  
Invest Smarter creates the first institutional investment decision before any feasibility study. That decision is a recorded posture: proceed, proceed with conditions, defer, or do not pursue — owned by a named person. We screen whether the idea deserves the cost of a real study. We do not replace the study. We do not commit capital.

**Reason**  
The first yes is usually informal: a conversation, a slide, a senior person’s intuition. Weak ideas then consume the same calendar as strong ones. Full feasibility as the first gate is too expensive, so teams skip it or fake it. This product exists so the first commitment of institutional attention is written, repeatable, and cheap enough to be honest.

Assumption rejected: the PRD line that we help organizations “commit capital with confidence.” We help them decide whether to *spend the next weeks* on a study. Capital commitment is a later gate. Assumption rejected: v1 is a pre-feasibility *study generator*. The Decision Object is the product; the report is a rendering. Assumption rejected: investor–project matching, trading, or post-investment monitoring. Other products. Assumption rejected: unconditional proceed as a common v1 outcome. Thin intake should mostly yield conditions or defer.

**Impact**  
Category is pre-study screen, not bankable DD, not legal opinion, not technical DD. Lite execution readiness must never be titled “technical due diligence.” Financing-read framing always states this is not a bankable model. Success is decisions completed and defensible, not pages or tokens. Later modules (full technical, scenarios, mandate profiles) wait on new input classes.

**Status**  
Accepted

**Related Documents**  
[PRODUCT_MANIFESTO.md](./PRODUCT_MANIFESTO.md) §1–7, §11–12 · [DECISION_ENGINE_SPEC.md](./DECISION_ENGINE_SPEC.md) §10–11 · [INTERVIEW_WIZARD_UX.md](./INTERVIEW_WIZARD_UX.md) (Q12: decision needed, not report length) · [DATA_MODEL.md](./DATA_MODEL.md) (project lifecycle after this gate is out of v1 engine scope)

---

## Amendment rule

To change a decision: add a new `PD-*` that supersedes it, set the old record’s **Status** to `Superseded`, and name the new ID under the old record’s **Related Documents**. Do not edit history in place except to fix typographical error.

Deprecated means the decision is withdrawn with no replacement (we no longer claim it). Superseded means a newer `PD-*` replaced it.
