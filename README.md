# Invest Smarter

**AI-powered investment feasibility platform**

Invest Smarter helps investors, analysts, and decision-makers evaluate investment opportunities with structured, data-driven insights. The platform combines market intelligence, financial modeling, and technical analysis—augmented by AI—to produce clear feasibility assessments before capital is committed.

---

## Purpose

Traditional investment research is fragmented across spreadsheets, PDFs, and ad hoc tools. Invest Smarter centralizes the workflow: ingest structured and unstructured data, apply consistent business rules, and generate actionable feasibility reports powered by purpose-built AI prompts.

**Core goals:**

- **Standardize** how opportunities are evaluated across markets and asset classes
- **Accelerate** due diligence with automated analysis pipelines
- **Reduce risk** by surfacing gaps, assumptions, and red flags early
- **Scale** research capacity without proportional headcount growth

---

## Repository Structure

```
InvestSmarter/
├── docs/                 # Product, technical, and data documentation
├── frontend/             # Web application (UI/UX)
├── backend/              # APIs, services, and business logic
├── data/                 # Reference datasets and mock data
│   ├── products/
│   ├── markets/
│   ├── countries/
│   ├── sources/
│   └── mock/
└── prompts/              # AI prompt templates for analysis modules
```

| Directory   | Description |
|------------|-------------|
| `docs/`    | Product requirements, roadmap, database schema, data dictionary, and business rules |
| `frontend/`| Client-facing application for browsing analyses and managing evaluations |
| `backend/` | REST/GraphQL APIs, authentication, orchestration, and integrations |
| `data/`    | Curated reference data (markets, countries, products) and development mocks |
| `prompts/` | Reusable LLM prompts for market, technical, and financial analysis |

---

## Documentation

| Document | Location |
|----------|----------|
| Product Requirements | [docs/PRD.md](docs/PRD.md) |
| Roadmap | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Database Design | [docs/DATABASE.md](docs/DATABASE.md) |
| Data Dictionary | [docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md) |
| Business Rules | [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md) |

---

## Analysis Modules

AI-assisted analysis is organized into three primary modules, each with a dedicated prompt template in `prompts/`:

1. **Market Analysis** — TAM/SAM/SOM, competitive landscape, regulatory context
2. **Technical Analysis** — Technology stack, scalability, IP, and implementation risk
3. **Financial Analysis** — Revenue models, unit economics, projections, and sensitivity

---

## Getting Started

### Deploy the frontend (no local terminal required)

See **[DEPLOY.md](DEPLOY.md)** for GitHub + Vercel deployment instructions.

### Documentation

1. Review [docs/PRD.md](docs/PRD.md) for product scope and success criteria
2. Consult [docs/ROADMAP.md](docs/ROADMAP.md) for phased delivery plan
3. Align data models with [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
4. Validate evaluation logic against [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md)

---

## Status

**Phase:** Sprint 1 — frontend shell (mock interview UI)  
**Deploy:** Ready for Vercel via [DEPLOY.md](DEPLOY.md)  
**Next:** API integration, Supabase, AI interview engine

---

## License

Proprietary — Invest Smarter. All rights reserved.
