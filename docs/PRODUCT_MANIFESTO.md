# Product Manifesto

**Invest Smarter**  
Constitution of the company and the product  
August 2026

This document is the source of identity. Where later documents conflict with it, this document wins until it is formally amended.

---

## 1. Vision

Every investment idea that consumes professional time will first pass through a governed decision: proceed, proceed with conditions, defer, or stop.

Invest Smarter is that decision, recorded.

We do not aspire to be the place where capital is committed. We aspire to be the place where an institution first decides whether an idea deserves the cost of a real study.

---

## 2. Mission

Give investment professionals a defensible answer to one question, while facts are still incomplete:

**Should we spend the next weeks of time and capital on this opportunity — or not?**

The answer must be structured, repeatable, and owned by a named person. Speed follows from that discipline. Speed is not the mission.

---

## 3. What problem exists today

Before a feasibility study, a credit file, or a committee memo exists, someone must already have said yes to the work.

That first yes is usually informal. It lives in a conversation, a slide, a spreadsheet fragment, or a senior person’s intuition. It is rarely written as a decision. It is almost never replayable.

As a result:

- Weak ideas consume the same calendar as strong ones, because there is no cheap, honest gate.
- Two analysts, given the same sketch of a project, produce different conclusions and different next steps.
- Fatal problems — no offtake, no site, blocking regulation, capital that cannot reach the next gate — appear after the institution has already spent the study.
- Knowledge stays in individuals. When they leave, the standard leaves with them.
- The report becomes the proof of work. The decision remains unspoken.

The scarce resource is not information. It is judgment under incomplete information, applied the same way twice.

---

## 4. Why current tools fail

Spreadsheets compute what they are told. They do not ask whether the telling was enough.

Research terminals and country reports describe markets. They do not decide whether *this* project, at *this* scale, for *this* mandate, should proceed.

Document generators and general-purpose models produce fluent prose. Fluency is not a decision. A long memo can hide a hole that a four-line posture would have shown.

Full feasibility, financial models, and due diligence are the right tools for a later gate. Using them as the first gate makes the first gate too expensive, so teams skip it or fake it.

Scoring products that emit a single grade invite argument about the number and neglect of the conditions. Institutions do not fund a score. They fund, or refuse, a course of action.

None of these tools hold a written policy: what must be true, what kills the file, what may be estimated, and who is accountable for the call.

---

## 5. Why Invest Smarter exists

Invest Smarter exists to make the pre-study decision a first-class act.

Not because analysis should be faster. Because the first commitment of institutional attention should be as serious as the last.

We exist so that:

- An advisor can answer a client or an inbound investor without commissioning a week of work by default.
- An agency can apply one standard across a pipeline instead of one standard per officer.
- A bank can refuse to staff a file that is not yet a file.
- A later feasibility study, if it happens, starts from a recorded posture, a list of conditions, and a list of assumptions — not from a blank page.

We exist because the alternative is to keep pretending that the study *is* the decision, when the real decision happened earlier, in private, with no trail.

---

## 6. What we build

We build a **decision system** for early investment evaluation.

A professional describes an opportunity in a short, structured interview. The system produces a **Decision Object**: a posture, conditions, confidence, risks, assumptions, and sources. A report is a rendering of that object. The object is the product.

The first decision is always one of four:

| Posture | Meaning |
|---|---|
| Proceed | Advance. No blocking conditions. |
| Proceed with conditions | Advance only if the listed conditions are accepted. |
| Defer | Not decision-ready. Missing facts or premature stage. |
| Do not pursue | Do not spend further resources on the opportunity as framed. |

Unconditional proceed is rare on thin intake. That is correct.

Around that object we build only what changes or explains the posture:

- Intake that forces the facts that kill or condition a file (sector, place, scale, demand path, site, constraints, mandate).
- Narrow analysis of market and economic plausibility — classification of signals, not invented precision.
- Deterministic policy: scores from rubrics, risk as memory and veto, confidence as data quality, the decision from rules.
- A written memo that explains the locked decision and cannot renegotiate it.
- A human confirmation. The engine recommends. A named evaluator accepts, amends with reason, or rejects.
- An audit of what was asked, which rules ran, which sources were cited, and who signed.

Later we may deepen modules when a new class of input exists. We do not deepen the product by adding essays.

---

## 7. What we never build

We never build a substitute for a feasibility study, a bankable model, legal opinion, or technical due diligence.

We never compute returns from guessed costs and present them as analysis.

We never let a model assign the grade, the posture, or the confidence.

We never treat a composite score as the thing a client or a committee is asked to accept.

We never browse the open web in order to look thorough. An unsourced figure is not intelligence.

We never assemble a committee of models to vote. Contradiction is not rigor.

We never auto-publish. There is no decision without a person.

We never build investor–project matching, a marketplace, a CRM, portfolio monitoring, or a trading tool. Those are other products. They would dilute the one decision we are responsible for.

We never optimize for pages, tokens, or evaluations started. We optimize for decisions completed and defensible.

---

## 8. Decision Intelligence philosophy

Decision intelligence, here, is not a slogan. It is a division of labor.

**Policy decides.** What counts as proceed, what vetoes, what must be disclosed as estimate — these are written rules, versioned, and identical for the same inputs.

**Models classify and write.** They may say whether demand looks contracted or speculative, whether scale looks implausible, whether a market is crowded. They may turn a locked decision into language a senior person can stand in front of. They may not score. They may not override.

**Numbers that commit the institution are functions.** Same signals, same intake, same rule version: same posture and same scores. Narrative may vary. The decision may not.

**Confidence is not attractiveness.** A strong commercial story with poor evidence is interesting and not ready. High score and low confidence must be allowed to coexist. Confidence is measured from completeness, sources, and assumptions — never from a model’s self-regard.

**Risk is memory.** It does not invent a catalogue of industry fears. It refuses to forget what intake, market, and economics already showed, and it can stop a pretty narrative.

**The human is the last mile.** Software does not commit capital and does not staff a team. It prepares a call that a professional can own.

**Rigor is traceability.** An assumption without a source did not happen. A finding that cannot affect posture, conditions, or confidence does not belong in the first product.

---

## 9. Design principles

1. **One question on the surface.** The user came to decide. The first screen of the result is the posture, the conditions, and the confidence. Everything else is evidence.

2. **Intake is design.** Every question must earn its place by changing a score, a veto, a condition, or a confidence penalty. Decorative questions are forbidden.

3. **Show uncertainty as uncertainty.** Estimates are labeled. Unknowns lower confidence. The interface does not dress interpolation as fact.

4. **Conditions over adjectives.** “Proceed with caution” is not a decision. A condition is a fact that must change.

5. **Short output, complete object.** The memo is brief. The Decision Object is complete. Length is not quality.

6. **Institutional voice.** Neutral, specific, usable in a client meeting or a credit conversation. No urgency language. No sales language.

7. **The evaluator can see the mechanism.** Rubrics, vetoes, and sources are inspectable. A black box will not survive the first committee.

8. **Time is a constraint, not a spectacle.** A first decision should complete in minutes because the work is bounded — not because we animate thinking.

---

## 10. AI principles

1. **AI is a clerk, not an officer.** It fills structured fields and drafts prose. Officers are people.

2. **Three calls until a fourth is earned.** Market, financial, synthesis. More calls require a new input class or they replace an existing call. They do not stack.

3. **Closed outputs.** Enumerations, not essays, at the point of judgment. Prose is downstream of a locked object.

4. **No invented precision.** If a figure is not in intake or in a curated source, it is an estimate or it is omitted. Invented TAM, IRR, or comparable sets are defects.

5. **Ground or decline.** Cite a source. If none exists, say so and lower confidence. Do not perform research theater.

6. **The writer cannot judge.** Synthesis echoes the decision. If it disagrees, the prose is discarded.

7. **Prompts are policy artifacts.** They are versioned, reviewable, and logged on every run. They are not a personality.

8. **Failure is visible.** If analysis cannot complete, there is no half-decision. Retry or stop.

---

## 11. Product principles

1. **One product, many desks.** Consultants, promotion agencies, banks, sponsors, zone developers, and public agencies ask the same underlying question. Framing changes. The Decision Object does not fork into five products.

2. **Pre-feasibility is the category.** We screen. We do not replace the study that follows a proceed.

3. **Mandate fit is not market attractiveness.** Whether an opportunity is commercially interesting and whether *this institution* should spend time on it are different questions. Both are required.

4. **Same file, same rules, same decision.** Reproducibility is a feature we sell to institutions, including the ones that will not say they are buying software.

5. **Edit the words; log the call.** Advisors may improve language. Changing posture or scores requires a written reason. History is not rewritten.

6. **Ship the policy core first.** Gates, rubrics, vetoes, and confidence must be testable without a model. If the model is down, the institution can still see how a fixture would have been decided.

7. **Add a module only for a new input class.** More narrative is not more product. Technical depth waits on technical facts. Scenarios wait on drivers. Live data waits on licenses and a reason.

8. **The north star is time to a decision the user will stand behind** — not time to text. Abandoned runs and unread reports do not count.

---

## 12. Long-term vision (10 years)

In ten years, commissioning a feasibility study without a prior, written screen will look like approving a payment without a ledger: still possible, no longer professional.

Organizations will keep a record of every idea they considered: what was known, what was assumed, which rule version ran, what posture was taken, who accepted it, and what happened next. That record will be as ordinary as a credit file.

The policy will deepen without changing nature. Mandate profiles will belong to the institution, not to the analyst. Sector facts will sit in curated registers. A full technical module will run when a plant can be described. Scenarios will run when drivers exist. Monitoring will reopen a file when a cited fact moves. None of this turns us into a data terminal or a marketplace.

What must still be true in 2036:

- The product is a decision under uncertainty, not a document mill.
- Models still do not commit the institution.
- Proceed without conditions is still uncommon when evidence is thin.
- A junior evaluator, following the same rules, can produce work a senior will sign — and the senior remains the signer.

If we succeed, Invest Smarter will be unremarkable. The remarkable thing will be that the first yes was written down.
