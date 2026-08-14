# Data Dictionary

**Product:** Invest Smarter  
**Version:** 0.1 (Draft)  
**Last Updated:** August 2026

---

## Purpose

This dictionary defines canonical fields, enums, and reference datasets used across Invest Smarter. It is the single source of truth for naming, types, and allowed values.

---

## 1. Opportunity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `title` | string (1–255) | Yes | Display name of the investment opportunity |
| `description` | text | No | Short summary |
| `stage` | enum | Yes | See [Opportunity Stage](#opportunity-stage) |
| `status` | enum | Yes | See [Evaluation Status](#evaluation-status) |
| `sector` | string | No | Industry vertical (e.g., FinTech, CleanTech) |
| `geography` | string[] | No | ISO 3166-1 alpha-2 country codes |
| `investment_type` | enum | No | equity, debt, hybrid, real_estate, other |
| `target_raise_usd` | decimal | No | Target capital raise in USD |
| `metadata_json` | JSON | No | Extensible key-value attributes |

### Opportunity Stage

| Value | Description |
|-------|-------------|
| `idea` | Concept only; no operational traction |
| `pre_seed` | Early validation |
| `seed` | Initial institutional or angel round |
| `series_a` | Growth-stage primary round |
| `growth` | Series B+ or equivalent |
| `mature` | Established business seeking expansion or PE |

### Evaluation Status

| Value | Description |
|-------|-------------|
| `draft` | Intake in progress |
| `analyzing` | Pipeline running |
| `in_review` | Awaiting human approval |
| `approved` | Feasibility accepted |
| `rejected` | Not feasible or declined |
| `archived` | Closed; read-only |

---

## 2. Analysis Module

| Field | Type | Description |
|-------|------|-------------|
| `module` | enum | `market`, `technical`, `financial` |
| `score` | decimal (0–100) | Module-level feasibility score |
| `confidence` | enum | `low`, `medium`, `high` |
| `findings_json` | JSON | Structured findings array |
| `risks_json` | JSON | Identified risks with severity |

### Finding Object (JSON Schema Concept)

| Field | Type | Description |
|-------|------|-------------|
| `category` | string | Grouping (e.g., competition, regulation) |
| `summary` | string | Human-readable finding |
| `impact` | enum | `positive`, `neutral`, `negative` |
| `source_ids` | UUID[] | References to `source` table |

---

## 3. Reference: Country

**Location:** `data/countries/`  
**Primary key:** `code` (ISO 3166-1 alpha-2)

| Field | Type | Description |
|-------|------|-------------|
| `code` | string(2) | ISO alpha-2 code |
| `name` | string | Official short name |
| `region` | string | UN macro-region |
| `currency_code` | string(3) | ISO 4217 |
| `risk_tier` | enum | `low`, `medium`, `high`, `restricted` |

---

## 4. Reference: Market

**Location:** `data/markets/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable slug (e.g., `us-fintech-payments`) |
| `name` | string | Display name |
| `parent_id` | string | Optional hierarchy parent |
| `tam_usd` | decimal | Total addressable market estimate |
| `growth_rate_pct` | decimal | Annual growth estimate |
| `notes` | text | Analyst notes |

---

## 5. Reference: Product

**Location:** `data/products/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Product/instrument identifier |
| `name` | string | Display name |
| `category` | enum | equity, debt, fund, derivative, real_asset, other |
| `liquidity_profile` | enum | `liquid`, `semi_liquid`, `illiquid` |
| `typical_holding_period_years` | decimal | Expected hold duration |

---

## 6. Reference: Source

**Location:** `data/sources/`

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | string | Source name (e.g., SEC EDGAR, World Bank) |
| `type` | enum | `government`, `commercial`, `internal`, `user_upload` |
| `url` | string | Canonical URL |
| `reliability_score` | decimal (0–1) | Curated trust score |
| `last_verified_at` | datetime | Last manual verification |

---

## 7. Feasibility Score (Composite)

| Component | Default Weight | Source Module |
|-----------|----------------|---------------|
| Market fit | 35% | Market analysis |
| Technical viability | 25% | Technical analysis |
| Financial sustainability | 40% | Financial analysis |

> Weights are configurable per organization. See [BUSINESS_RULES.md](./BUSINESS_RULES.md).

---

## 8. Naming Conventions

- Database: `snake_case` tables and columns
- API JSON: `camelCase` (transform at boundary)
- Enums: `snake_case` string values
- IDs: UUID v4 for tenant entities; stable slugs for reference taxonomy
- Timestamps: UTC, ISO 8601 (`timestamptz` in PostgreSQL)

---

## 9. Change Management

1. Propose field changes via PR updating this document
2. Update corresponding files in `data/` if reference data affected
3. Version database migrations with backward-compatible defaults where possible

---

## Related Documents

- [DATABASE.md](./DATABASE.md) — Entity relationships
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) — Validation and scoring rules
