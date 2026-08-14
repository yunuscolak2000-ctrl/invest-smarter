# Database Design

**Product:** Invest Smarter  
**Version:** 0.1 (Draft)  
**Last Updated:** August 2026

---

## 1. Overview

This document describes the logical data model for Invest Smarter. Physical implementation (PostgreSQL recommended) will follow during backend scaffolding.

**Design principles:**

- Multi-tenant by organization (`org_id` on tenant-scoped tables)
- Immutable audit trail for AI inputs/outputs
- Normalized reference data; denormalized report snapshots for export
- Soft deletes on user-facing entities

---

## 2. Entity Relationship (High Level)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    org      │────<│      user        │     │   opportunity   │
└─────────────┘     └──────────────────┘     └────────┬────────┘
       │                                              │
       │              ┌──────────────────┐            │
       └─────────────<│   workspace      │>───────────┘
                      └──────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ analysis_run    │  │ document        │  │ assumption      │
└────────┬────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ analysis_result │────>│ report_snapshot │
└─────────────────┘     └─────────────────┘

Reference (read-mostly):
  country, market, product, source, business_rule, prompt_template
```

---

## 3. Core Entities

### 3.1 Organization & Access

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `org` | Tenant | `id`, `name`, `slug`, `settings_json`, `created_at` |
| `user` | Platform user | `id`, `org_id`, `email`, `role`, `status` |
| `workspace` | Scoped container for evaluations | `id`, `org_id`, `name`, `default_template_id` |

### 3.2 Opportunity & Evaluation

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `opportunity` | Investment under evaluation | `id`, `workspace_id`, `title`, `stage`, `status`, `metadata_json` |
| `document` | Uploaded files | `id`, `opportunity_id`, `filename`, `storage_uri`, `mime_type`, `checksum` |
| `assumption` | Explicit user/system assumptions | `id`, `opportunity_id`, `key`, `value`, `source`, `confidence` |

### 3.3 Analysis & Reporting

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `analysis_run` | Single pipeline execution | `id`, `opportunity_id`, `module` (market/technical/financial), `status`, `prompt_version` |
| `analysis_result` | Structured module output | `id`, `analysis_run_id`, `findings_json`, `score`, `risks_json` |
| `report_snapshot` | Point-in-time consolidated report | `id`, `opportunity_id`, `content_json`, `feasibility_score`, `version` |
| `audit_event` | Immutable event log | `id`, `entity_type`, `entity_id`, `actor_id`, `action`, `payload_json`, `created_at` |

---

## 4. Reference Entities

| Table | Purpose | Source |
|-------|---------|--------|
| `country` | ISO country metadata | `data/countries/` |
| `market` | Market segments and taxonomy | `data/markets/` |
| `product` | Product/instrument types | `data/products/` |
| `source` | Trusted data sources registry | `data/sources/` |
| `business_rule` | Configurable evaluation rules | Synced from `docs/BUSINESS_RULES.md` or admin UI |
| `prompt_template` | Versioned LLM prompts | Synced from `prompts/` |

---

## 5. Indexing Strategy (Draft)

- `opportunity(workspace_id, status, updated_at DESC)` — list views
- `analysis_run(opportunity_id, module)` — module history
- `audit_event(entity_type, entity_id, created_at DESC)` — audit queries
- Full-text search on `opportunity.title` and `report_snapshot.content_json` (implementation TBD)

---

## 6. Data Retention

| Data Class | Default Retention | Notes |
|------------|-------------------|-------|
| Opportunities (active) | Indefinite | Until archived by user |
| Archived opportunities | 7 years | Configurable per org |
| Audit events | 7 years | Compliance |
| Raw LLM request/response | 90 days | Redact PII; retain hashes/metadata longer |
| Uploaded documents | Linked to opportunity lifecycle | Encrypted object storage |

---

## 7. Migration & Seeding

1. Reference tables seeded from `data/` JSON/CSV files
2. Business rules and prompts loaded via migration scripts or admin sync
3. `data/mock/` used for local and CI environments only—never production seed

---

## 8. Open Items

- [ ] Final DB engine confirmation (PostgreSQL vs. managed alternative)
- [ ] Vector store for document RAG (pgvector vs. dedicated service)
- [ ] Event sourcing vs. append-only audit for analysis runs

---

## Related Documents

- [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) — Field-level definitions
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) — Rule semantics
- [PRD.md](./PRD.md) — Functional requirements
