# Product Roadmap

**Product:** Invest Smarter  
**Last Updated:** August 2026

---

## Vision

Become the default platform for AI-assisted investment feasibility—trusted for speed, consistency, and explainability across asset classes and geographies.

---

## Phase 0: Foundation (Current)

**Timeline:** Q3 2026  
**Status:** In Progress

| Deliverable | Description |
|-------------|-------------|
| Project structure | Monorepo layout: docs, frontend, backend, data, prompts |
| Documentation | PRD, roadmap, database design, data dictionary, business rules |
| Reference data layout | Folders for products, markets, countries, sources, mock |
| Prompt templates | Market, technical, financial analysis starter prompts |

**Exit criteria:** Team aligned on scope; repo ready for application scaffolding.

---

## Phase 1: MVP Core

**Timeline:** Q4 2026  
**Goal:** End-to-end feasibility workflow for a single analyst persona

| Epic | Features |
|------|----------|
| Platform shell | Auth, workspaces, basic navigation |
| Opportunity intake | CRUD, metadata, document upload |
| Analysis pipelines | Market + Financial modules (Technical in parallel if capacity allows) |
| Business rules v1 | Hard gates and warnings on intake and output |
| Report generation | Draft report, edit, export PDF |
| Admin basics | Prompt and rule configuration (file-based or simple UI) |

**Exit criteria:** One complete evaluation runnable in staging; internal dogfooding with 3+ real opportunities.

---

## Phase 2: Scale & Intelligence

**Timeline:** Q1–Q2 2027  
**Goal:** Production readiness and richer intelligence

| Epic | Features |
|------|----------|
| Data integrations | External market data APIs, news/sentiment feeds |
| Technical analysis module | Full parity with market and financial |
| Scoring engine v2 | Weighted composites, benchmarks, peer comparison |
| Collaboration | Comments, assignments, approval workflows |
| Multi-tenant SaaS | Org isolation, billing hooks, usage metering |
| Observability | AI cost dashboards, quality feedback loops |

**Exit criteria:** Paying design partners; SLA met for 30 consecutive days.

---

## Phase 3: Enterprise & Ecosystem

**Timeline:** H2 2027  
**Goal:** Enterprise adoption and platform extensibility

| Epic | Features |
|------|----------|
| SSO & RBAC | SAML/OIDC, granular permissions |
| Custom templates | Firm-specific evaluation frameworks |
| API & webhooks | Integrate with CRM, data rooms, BI tools |
| Model governance | Prompt A/B testing, evaluation datasets, human-in-the-loop QA |
| Localization | Multi-language reports and UI |
| Mobile | Responsive enhancements or dedicated app |

**Exit criteria:** 2+ enterprise contracts; documented public API.

---

## Milestone Summary

```
2026 Q3  ████░░░░░░  Phase 0 — Foundation
2026 Q4  ████████░░  Phase 1 — MVP Core
2027 H1  ████████░░  Phase 2 — Scale & Intelligence
2027 H2  ████████░░  Phase 3 — Enterprise & Ecosystem
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI hallucination in reports | Source grounding, rule validation, mandatory human review |
| Scope creep on MVP | Strict PRD v0.1; defer integrations to Phase 2 |
| Data quality | Data dictionary ownership; mock → curated promotion process |
| Cost overrun on LLM usage | Caching, summarization tiers, per-workspace budgets |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08 | Monorepo with separate frontend/backend | Clear boundaries; shared docs and data |
| 2026-08 | Prompts as versioned markdown | Reviewable, diff-friendly, non-dev editable |
