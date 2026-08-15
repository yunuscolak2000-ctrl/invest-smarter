# Interview Wizard UX Specification — Q7, Q8, Q9 (extracted)

Source: INTERVIEW_WIZARD_UX spec transcript 134f422c-a05f-4d1b-9e04-26c4bb3347e8

See parent request. Full Q7-Q9 UX extract follows.

# Q7 — Capital scale

Screen title: Investment scale

AI assistant message:
What is the approximate total capital requirement? A range is enough — I will not treat this as a model input to the dollar.

User input type:
1. Currency segmented control — default from Q4 country; options: USD, EUR, plus country ISO 4217 if different. Max 3 visible; Other opens a 10-currency list.
2. Single-select range cards in that currency:

- lt_5m — Under 5 million
- 5_25m — 5-25 million
- 25_100m — 25-100 million
- 100_500m — 100-500 million
- gt_500m — Over 500 million
- not_sure — Not sure yet

No exact amount field.

Validation: Currency required. Range required. not_sure allowed (soft). If not_sure, Review shows: Financial module will run with low confidence until a scale is set. Do not block (BR-INT-003 is satisfied by a range; not_sure is the only soft miss — still allow analysis, flag confidence).

Why collected: Financial module gate and peer-scale reasoning. Range avoids false precision and is faster on mobile than a numeric keypad.

Payload fields: currency (required), capex_range (required; may be not_sure).

Behavior: Selection first. Cards. No exact CAPEX field. Unknown is valid here (not_sure is the soft miss). Next disabled until currency plus range are set. On invalid Next press: focus first error (no toast). Previous never clears answers.

# Q8 — Evaluation context

Screen title: Who is evaluating this

AI assistant message:
Who is this evaluation for? That tells me whether the output should read like a client memo, an IPA response, or an internal screen.

User input type: Single-select cards.

- consultant_client — Consultant advising a client — Client-presentable pre-feasibility
- ipa_inbound — IPA screening an investor — Inbound inquiry / promotion response
- sponsor_own — Sponsor evaluating our own project — Internal go / no-go
- bank_screen — Bank or lender — early screen — Credit / mandate filter, not full model
- zone_developer — Zone or park developer — Tenant / land allocation fit
- public_agency — Public agency / development institution — Mandate or program fit

Validation: Required. Exactly one.

Why collected: Strategic-fit analysis and tone of the decision output. Also stands in for sponsor type without a second question. This is the organizational context the PRD actually needs.

Payload field: evaluation_context (required).

Behavior: Hard gate: no Not sure option. Next stays disabled until one card is selected. Empty Next press: do not advance; scroll to control; show Select an option to continue.

# Q9 — Buyer / customer type

Screen title: Who buys the output

AI assistant message:
Who is expected to buy what this project produces? Demand path drives both market and revenue logic.

User input type: Single-select cards.

- b2b_contract — B2B — contracted (PPA, offtake, offtake LOI)
- b2b_spot — B2B — open / spot market
- b2c — B2C / retail demand
- b2g — Government or public procurement
- mixed — Mixed channels
- unknown — Not defined yet

Validation: Required. unknown allowed (soft).

Why collected: Core commercial assumption for market plus financial modules. Replaces free-text who is the customer. Interviews that skip this invent an offtake story.

Payload field: buyer_type (required; may be unknown).

Related Q10 interaction: If Q9 is unknown and user picks Q10 binding or loi, show soft warning: You have not defined a buyer type. Continue, or go back. Do not block.

# Related payload, validation, progress, and field tables

## Payload schema fields

From section 13, payload the wizard must produce:

- currency — Q7 — Yes
- capex_range — Q7 — Yes (may be not_sure)
- evaluation_context — Q8 — Yes
- buyer_type — Q9 — Yes
- demand_certainty — Q10 — Yes

demand_certainty is Q10, not Q9. Q9 is buyer_type. Included because the extraction request named this payload field.

### Q10 Demand certainty enums (payload companion)

- binding — Binding contract or PPA — Signed, enforceable
- loi — LOI / term sheet / MOU — Non-binding but named counterparties
- advanced — Advanced discussions — Named buyers, no paper
- hypothesis — Demand hypothesis only — No named buyer
- not_applicable — Not applicable — e.g. merchant / retail with no offtake

Validation: Required. Soft warning if Q9 is unknown and user picks binding or loi.

Review grouping:
- Scale and stage: Development stage, Currency, Capital range
- Context: Evaluation context, Decision needed
- Commercial and site: Buyer type, Demand certainty, Site control

Confidence strip:
- High — no unknown / not_sure / country_only + hypothesis combo
- Medium — one or two soft unknowns
- Low — scale not_sure, or demand hypothesis and site searching

Copy example: Confidence will be medium. Two items are still open: capital scale, site control.

Open product call (Q7): Whether not_sure on scale should block the financial module — UX allows run with low confidence. If legal/compliance later requires a number, add a hard block on Review, not a new question.

## Validation rules V-* related to Q7-Q9

- V-01 — Q1, Q2, Q4, Q6, Q7 currency+range, Q8, Q9, Q10, Q11, Q12 required — Hard — Each screen + Review
- V-06 — Scale not_sure — Soft — Q7, Review confidence
- V-07 — Buyer unknown or demand hypothesis — Soft — Review confidence
- V-08 — Q9/Q10 inconsistency (unknown + binding) — Soft warning — Q10

Empty Next press: do not advance; scroll to control; show Select an option to continue (or field-specific message).
Save and exit: allowed on any screen, including invalid current screen; invalid fields stay empty in the draft.

Validation pattern:
- Hard: Next blocked, inline error, no toast.
- Soft: allowed, recorded as unknown / not_sure, lowers analysis confidence on Review.

Q7 not_sure is the only soft miss on capital scale — still allow analysis, flag confidence (BR-INT-003).

## Progress / minutes-left notes

Time target (whole wizard): 6-8 minutes on desktop, 8-10 on phone.
S0 framing copy: twelve questions, about eight minutes.

Progress chrome (every question screen):
- Bar: current / 12
- Label: Question n of 12 (example: Question 4 of 12)
- Time hint (static, not fake-live): About 5 minutes left (example given at Q4)
- Review is not a 13th question. Bar completes at Q12, then Review is a separate commit screen.

Mobile: Progress bar plus n / 12 only; hide minutes left below 360px width.

The spec does not define a distinct minutes-left string per Q7/Q8/Q9. Use the same static time-hint pattern as other screens, not a live countdown.

Progress labels:
- Q7: Question 7 of 12
- Q8: Question 8 of 12
- Q9: Question 9 of 12

## Copy / interaction (global, applies to Q7-Q9)

- After Q1, later AI lines may include one acknowledgment token, e.g. Q4: For this {opportunity type}…
- Tokens are templates, filled from stored enums. No model call per screen.
- Assistant copy stays at most 35 words for the question line; the setup sentence may add one more.
- Do not praise answers.
- Do not recap the entire interview until Review.
- Error copy is specific, not Invalid input.
- For Q7-Q9 empty state: Select an option to continue.
