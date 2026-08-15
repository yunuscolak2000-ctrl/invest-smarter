# Advisor Copy Spec — Q7, Q8, Q9 (extracted)

Source: ADVISOR_COPY_SPEC transcript 1c6fe5cd-fa21-4472-bd8b-20941fcda047

Product: Invest Smarter. Surface: 12-question Interview Wizard.
Voice: Institutional advisor. First person, short, specific. Templates, not a model.
Zero LLM calls in the wizard. Static templates only.

Global unknown protocol:
1. Record the enum (not_sure, unknown, country_only, hypothesis, searching).
2. Show one confirmation line (specified per question below).
3. Do not ask a follow-up.
4. Review lists the unknown and the confidence band.
5. Never auto-fill a guessed value.

Hard questions (no Not sure): Q1, Q2, Q3, Q4, Q6, Q8, Q12.
Soft unknowns exist: Q5 (country_only), Q7 (not_sure), Q9 (unknown), Q10 (hypothesis), Q11 (searching).

If the user stalls on a hard question: helper text only — Select an option to continue. The advisor message does not change.

Tone rules:
- Professional, institutional, helpful.
- At most 2 sentences in the advisor message. At most 1 sentence in the unknown confirmation.
- No Great, Don't worry, Let's explore, Awesome.
- No emoji. No exclamation marks.
- Do not preview scores, grades, or you are doing well.
- Do not recap the whole interview until Review.

---

# Q7 — Capital scale

Field: currency, capex_range
Unknown analog: not_sure

## 1. AI Advisor Message

What is the approximate total capital requirement? A range is enough; I will not treat it as a point estimate.

## 2. Why this question matters

Scale is the financial gate and the kill-rule trigger. Hypothesis demand at 100m or above is a different file from the same hypothesis at 5-25m. Exact CAPEX would be guessed; ranges keep PD-005.

## 3. Which Decision Engine module depends on it

- Financial — primary (known scale, overlays, scale_plausibility caps).
- Risk — RISK-DEMAND-SCALE, RISK-CONCEPT-MEGA.
- Confidence — not_sure (-25); with hypothesis, confidence cap 40.
- Strategic Fit / Decision Policy — bank screen + hypothesis + 100m or above.
- Market — not a direct scorer; context only.

## 4. Strong answer

EUR + 25_100m.

## 5. Weak answer

Typing 87.4 million from a napkin (we do not offer that field — if they ask, stay on ranges). Also weak: gt_500m to sound institutional when the band is 25-100m.

## 6. If the user chooses Not sure

Allowed.
Confirmation: Scale recorded as unknown. The financial module will run with lower confidence.
Do not ask them to estimate. Do not block Run analysis. Review repeats the line.

## Option labels (from UX spec; copy spec does not restate the table)

Currency segmented control: USD, EUR, plus country ISO 4217. Max 3 visible; Other opens a 10-currency list.

capex_range:
- lt_5m — Under 5 million
- 5_25m — 5-25 million
- 25_100m — 25-100 million
- 100_500m — 100-500 million
- gt_500m — Over 500 million
- not_sure — Not sure yet

## Helper / error copy

- Empty Next: Select an option to continue.
- not_sure confirmation (under the selected card, not a new assistant turn): Scale recorded as unknown. The financial module will run with lower confidence.
- Review if not_sure: Financial module will run with low confidence until a scale is set. (UX spec wording)

---

# Q8 — Evaluation context

Field: evaluation_context
Unknown offered: No

## 1. AI Advisor Message

Who is this evaluation for? That sets the mandate test and the tone of the recommendation.

## 2. Why this question matters

Mandate fit is not market attractiveness (manifesto section 11). A bank screen and an IPA inbound can share a solar plant and still deserve different conditions. This question is the cheapest way to avoid one generic memo.

## 3. Which Decision Engine module depends on it

- Strategic Fit — primary (tension table).
- Decision Policy — VETO-BANK-HYP.
- Synthesis — tone variant (client memo vs IPA vs credit posture).
- Market / Financial — do not score this; they must not invent national priority alignment.

## 4. Strong answer

ipa_inbound when an IPA officer is screening an investor inquiry.

## 5. Weak answer

consultant_client because it sounds more professional, when the user is a credit analyst.

## 6. If the user chooses Not sure

Not offered. Helper: Choose the desk that will own this file. Tone and mandate tests follow from that. No generated reply.

## Option labels (from UX spec)

- consultant_client — Consultant advising a client — Client-presentable pre-feasibility
- ipa_inbound — IPA screening an investor — Inbound inquiry / promotion response
- sponsor_own — Sponsor evaluating our own project — Internal go / no-go
- bank_screen — Bank or lender — early screen — Credit / mandate filter, not full model
- zone_developer — Zone or park developer — Tenant / land allocation fit
- public_agency — Public agency / development institution — Mandate or program fit

## Helper / error copy

- Empty Next: Select an option to continue.
- Stall helper: Choose the desk that will own this file. Tone and mandate tests follow from that.
- No unknown confirmation for Q8.

---

# Q9 — Buyer / customer type

Field: buyer_type
Unknown analog: unknown

## 1. AI Advisor Message

Who is expected to buy the output? Demand path drives both market scoring and revenue logic.

## 2. Why this question matters

This is the commercial assumption interviews otherwise invent. A contracted B2B offtake and a B2C hypothesis are not the same market story. Skipping this is how reports grow an imaginary customer.

## 3. Which Decision Engine module depends on it

- Market — primary; demand-path table (up to 28 points) with Q10.
- Financial — revenue_logic overlays; no_offtake constraint interaction.
- Confidence — unknown (-15); extra -10 if Q10 is also thin.
- Risk — with constraints / Q10, demand-not-contracted.

## 4. Strong answer

b2b_contract for a plant with a PPA or industrial offtake path.

## 5. Weak answer

unknown when a named offtaker exists; or b2c for a utility-scale PPA plant.

## 6. If the user chooses Not sure

Map to Not defined yet (unknown).
Confirmation: Buyer type recorded as undefined. Demand path will be scored as incomplete.
Then Next. Do not ask them to name customers here (that is analysis work, and a 13th question).

## Option labels (from UX spec)

- b2b_contract — B2B — contracted (PPA, offtake, offtake LOI)
- b2b_spot — B2B — open / spot market
- b2c — B2C / retail demand
- b2g — Government or public procurement
- mixed — Mixed channels
- unknown — Not defined yet

## Helper / error copy

- Empty Next: Select an option to continue.
- unknown confirmation (under the selected card): Buyer type recorded as undefined. Demand path will be scored as incomplete.

---

# Unknown confirmation deck (Q7 and Q9)

Show under the selected card, not as a new assistant turn.

- Q7 / not_sure: Scale recorded as unknown. The financial module will run with lower confidence.
- Q9 / unknown: Buyer type recorded as undefined. Demand path will be scored as incomplete.

Q8 has no unknown confirmation.

Related Q10 (not in this sprint, but copy that references Q9):
- Q10 / hypothesis: Demand recorded as a hypothesis. Unconditional proceed will not be available on this basis.
- If Q9 is unknown and they pick binding or loi: soft warning only — Buyer type is still undefined. Continue, or go back. Do not block. Do not rewrite Q9.

---

# Error copy (global, applies to Q7-Q9)

- Empty Next on a required selection: Select an option to continue.
- Do not use Invalid input.
- Error copy is specific.
- Do not display live score deltas on each tap.
- Do not change personality by evaluation_context inside the wizard.

Bottom line from copy spec: Twelve template prompts, five unknown confirmations, no conversation. The advisor sounds like a colleague who will run a governed screen — not a chatbot filling silence.
