# Sprint 2.3 notes — what should be implemented in Sprint 2.4

Source: transcript ee0878c3-b228-4419-b4e4-89f1fbbd79ab
Last assistant message (Sprint 2.3 wrap-up).

---

## Extracted Sprint 2.4 recommendation

Implement Q7 Investment scale, Q8 Who is evaluating this, and Q9 Who buys the output only.

Q7 is the one with new UI: currency from the Q4 country, then capex range cards including not_sure. Q8 and Q9 are the same select-card pattern as Q1/Q6. Still no Review, no backend, no AI, no report. Default Q7 currency from the country record already on the mock (TRY, EUR, USD, and other country currencies).

---

## Full last assistant message

Sprint 2.3 is in: the wizard now runs through Question 4 (Country), Question 5 (Location detail), and Question 6 (Development stage). Welcome, Q1-Q3 screens, backend, and analysis are unchanged. State stays in the client draft.

After Q4, the header title becomes {Sector} — {Country} (for example Energy — Solar — Türkiye). Restricted countries show the warning and require the acknowledgment checkbox before Next. Q5 asks for city/region text only when that option is selected. After Q6, Next stops and the sprint-end note appears.

### 1. Files changed

New
- frontend/src/mocks/countries.ts — mock ISO country register, pinned destinations, restricted risk_tier
- frontend/src/pages/interview/CountryStep.tsx — Q4
- frontend/src/pages/interview/LocationStep.tsx — Q5
- frontend/src/pages/interview/DevelopmentStageStep.tsx — Q6

Updated
- frontend/src/types/interview.ts — draft fields and step ids for Q4-Q6
- frontend/src/mocks/interview.ts — Q4-Q6 copy, location/stage options, time hints
- frontend/src/lib/interviewValidation.ts — V-01, V-03, V-04, V-05
- frontend/src/hooks/useInterviewWizard.ts — navigation, draft setters, auto-title
- frontend/src/pages/InterviewPage.tsx — render Q4-Q6
- frontend/src/components/wizard/WizardShell.tsx — working title from Q4
- frontend/src/components/wizard/SearchSelect.tsx — optional helper / empty copy / min query length (Q2 defaults unchanged)

Not changed: HomePage, Framing, OpportunityType, Sector, Product step files.

### 2. Why each change was necessary

- Country mock register: Q4 must be a valid ISO list, not free text. Restricted tier is how V-05 / BR-INT-004 works without a backend.
- Country / Location / Stage steps: One screen per decision, using existing Chip, SearchSelect, SelectCard, TextField, AssistantPrompt.
- Draft type + validation: The payload contract starts at intake. Next cannot advance on an invalid country, missing city/region text, or missing stage.
- Wizard hook: Q3 now continues to Q4. Previous/Next stay linear. Auto-title is {sector} — {country} once a country is chosen.
- InterviewPage: Orchestrator only; Q1-Q3 components stay as they are.
- WizardShell title: Spec shows a working title from Q4; before that it still reads New opportunity.
- SearchSelect extras: Country search needs a helper, no matching countries, and a 2-letter filter. Sector search keeps its old defaults.

### 3. Sprint 2.4

Implement Q7 Investment scale, Q8 Who is evaluating this, and Q9 Who buys the output only.

Q7 is the one with new UI: currency from the Q4 country, then capex range cards including not_sure. Q8 and Q9 are the same select-card pattern as Q1/Q6. Still no Review, no backend, no AI, no report. Default Q7 currency from the country record already on the mock (TRY, EUR, USD, and other country currencies).
