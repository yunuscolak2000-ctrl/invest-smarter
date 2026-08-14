# Business Rules

**Product:** Invest Smarter  
**Version:** 0.1 (Draft)  
**Last Updated:** August 2026

---

## Purpose

Business rules encode Invest Smarter's evaluation policy: what must be true before analysis runs, what blocks approval, and how scores are computed. Rules are applied deterministically; AI outputs are advisory until validated against these rules.

---

## 1. Rule Categories

| Category | When Applied | Outcome Type |
|----------|--------------|--------------|
| **Gate** | Before pipeline start | Block execution |
| **Validation** | After module completion | Warning or block |
| **Scoring** | Report consolidation | Adjust or cap scores |
| **Compliance** | Export and approval | Block publish |

---

## 2. Intake Gates

| Rule ID | Name | Condition | Action |
|---------|------|-----------|--------|
| BR-INT-001 | Minimum metadata | `title` and `stage` present | Block if missing |
| BR-INT-002 | Geography required | At least one country code for market analysis | Block market module |
| BR-INT-003 | Financial inputs | `target_raise_usd` or financial docs attached for financial module | Block financial module |
| BR-INT-004 | Restricted geography | Any country with `risk_tier = restricted` | Require admin override |

---

## 3. Analysis Validation Rules

### 3.1 Market Analysis

| Rule ID | Name | Condition | Action |
|---------|------|-----------|--------|
| BR-MKT-001 | Source attribution | Every critical finding has ≥1 `source_id` | Warning |
| BR-MKT-002 | TAM plausibility | Stated TAM within 10× of reference market data | Warning |
| BR-MKT-003 | Competitive mention | ≥2 competitors or substitutes identified | Warning |

### 3.2 Technical Analysis

| Rule ID | Name | Condition | Action |
|---------|------|-----------|--------|
| BR-TEC-001 | Scalability addressed | Findings include scalability category | Warning |
| BR-TEC-002 | Security mention | Findings include security/compliance category for regulated sectors | Gate for FinTech, HealthTech |
| BR-TEC-003 | IP clarity | IP ownership explicitly stated or marked unknown | Warning |

### 3.3 Financial Analysis

| Rule ID | Name | Condition | Action |
|---------|------|-----------|--------|
| BR-FIN-001 | Unit economics | Revenue model and unit economics section present | Block if missing |
| BR-FIN-002 | Runway | Cash runway or burn rate addressed | Warning |
| BR-FIN-003 | Projection horizon | Financial projections ≤5 years unless `stage = mature` | Cap confidence to `medium` |

---

## 4. Scoring Rules

### 4.1 Module Score Bounds

- Each module score: integer 0–100
- Scores below 40 trigger mandatory `negative` risk summary in report
- Scores above 85 require explicit justification in findings

### 4.2 Composite Feasibility Score

```
feasibility_score = (
  market_score   × w_market +
  technical_score × w_technical +
  financial_score × w_financial
)
```

**Default weights:** market 0.35, technical 0.25, financial 0.40

### 4.3 Score Caps

| Rule ID | Trigger | Cap |
|---------|---------|-----|
| BR-SCR-001 | Any module score < 30 | Composite max 50 |
| BR-SCR-002 | Unresolved critical validation (future: severity=critical) | Block approval |
| BR-SCR-003 | Missing technical module for software sector | Composite max 65 |

---

## 5. Approval & Compliance

| Rule ID | Name | Condition | Action |
|---------|------|-----------|--------|
| BR-APR-001 | Human review | Status cannot move to `approved` without `in_review` | Block |
| BR-APR-002 | AI disclaimer | Report includes standard AI-assisted disclaimer | Block export |
| BR-APR-003 | Audit completeness | All `analysis_run` records have `completed` status | Block export |

---

## 6. Rule Severity

| Severity | UI Treatment | Approval Impact |
|----------|--------------|-----------------|
| `info` | Note only | None |
| `warning` | Highlight; ack optional | None (MVP) |
| `error` | Must resolve or override | Blocks approval |
| `gate` | Blocks pipeline step | Cannot proceed |

---

## 7. Override Policy

- Only `Admin` role may override `gate` and `error` rules
- Overrides require `reason` text and are logged in `audit_event`
- Overrides expire after 90 days for re-evaluation trigger (Phase 2)

---

## 8. Implementation Notes

- Rules should be data-driven (JSON/YAML or DB table) keyed by `rule_id`
- Rule evaluation order: Gates → Analysis → Scoring → Compliance
- Prompt templates in `prompts/` should instruct the model to structure output for rule validation

---

## 9. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-08 | Initial rule set for MVP planning |

---

## Related Documents

- [PRD.md](./PRD.md) — Product scope
- [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) — Field definitions
- [DATABASE.md](./DATABASE.md) — `business_rule` entity
