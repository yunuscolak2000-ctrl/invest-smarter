# Investment Project Data Model

**Product:** Invest Smarter  
**Platform Type:** AI-Powered Investment Intelligence Platform  
**Document Type:** Canonical Business Data Model  
**Version:** 2.0  
**Last Updated:** August 2026  
**Author:** Chief Software Architect

---

## Purpose

This document defines the **business data model** for a single investment project in Invest Smarter.

Invest Smarter is not a feasibility report generator. It is an **Investment Intelligence Platform**—a system that structures, enriches, scores, and connects investment knowledge so advisors, agencies, and institutions can move from idea to decision with institutional rigor.

The model is:

- **Business-oriented** — speaks the language of investment professionals, not database administrators
- **Sector-independent** — supports manufacturing, energy, technology, real estate, agriculture, logistics, healthcare, and sectors not yet defined
- **Future-proof** — new sectors extend through taxonomy and attributes, not structural redesign
- **Provenance-aware** — assumptions and sources are first-class; intelligence is traceable

Design standard: the structural clarity of **Bloomberg**, the deal intelligence of **PitchBook**, and the decision framework discipline of **McKinsey Digital**.

---

## Investment Project Document

One investment opportunity is represented as a single JSON document containing ten connected business objects.

```json
{
  "schema_version": "2.0",
  "document_id": "inv-proj-2026-00487",
  "last_updated": "2026-08-12T16:45:00Z",

  "project": {},
  "product": {},
  "market": {},
  "customer": {},
  "technical": {},
  "financial": {},
  "assumptions": [],
  "risks": [],
  "sources": [],
  "scores": {}
}
```

---

## 1. PROJECT

The anchor object. Identifies the investment opportunity, its location, scale, and current position in the evaluation lifecycle.

### Business Definition

| Field | Description |
|-------|-------------|
| **Project ID** | Unique identifier for the investment project across the platform |
| **Project Name** | Official or working title used in pipeline, client, and committee contexts |
| **Sector** | Industry classification (supports any sector via open taxonomy) |
| **Product** | Reference to the product object — what the investment produces |
| **Country** | Primary country of investment (ISO 3166-1 alpha-2) |
| **Region** | State, province, or economic region within the country |
| **City** | City or nearest urban center |
| **Investment Amount** | Total capital requirement for the project |
| **Currency** | ISO 4217 currency code for investment amount |
| **Status** | Current stage in the investment intelligence and decision workflow |

### JSON Example

```json
{
  "project": {
    "project_id": "inv-proj-2026-00487",
    "project_name": "Baltic EV Battery Cell Manufacturing — Phase 1",
    "sector": {
      "code": "manufacturing.automotive.battery",
      "label": "Automotive — Battery Cell Manufacturing",
      "parent": "manufacturing.automotive"
    },
    "product_ref": "prod-00487",
    "country": {
      "code": "PL",
      "name": "Poland"
    },
    "region": "Lower Silesia",
    "city": "Wrocław",
    "investment_amount": 185000000,
    "currency": "EUR",
    "status": "pre_feasibility_analysis",
    "created_at": "2026-07-28T09:00:00Z",
    "updated_at": "2026-08-12T14:30:00Z"
  }
}
```

### Recommended Status Values

`idea` · `screening` · `pre_feasibility_analysis` · `deep_diligence` · `investment_committee` · `approved` · `declined` · `on_hold` · `archived`

---

## 2. PRODUCT

What the investment creates, manufactures, or delivers. Sector-agnostic: applies to physical goods, services, digital products, and infrastructure outputs.

### Business Definition

| Field | Description |
|-------|-------------|
| **Name** | Commercial name of the product or output |
| **Category** | Product classification within the sector taxonomy |
| **HS Code** | Harmonized System code for tradable goods (nullable for non-tradeable outputs) |
| **Unit** | Standard unit of measure (units, tons, MWh, rooms, etc.) |
| **Description** | Business description of the product and its intended use |

### JSON Example

```json
{
  "product": {
    "product_id": "prod-00487",
    "name": "Lithium-Ion Battery Cells (NMC 811, Pouch Format)",
    "category": {
      "code": "energy_storage.ev_battery.cell",
      "label": "EV Battery Cells"
    },
    "hs_code": "8507.60",
    "unit": "GWh per year",
    "description": "High-energy-density lithium-ion battery cells for European OEM electric vehicle platforms. Initial capacity of 2 GWh/year with modular expansion to 8 GWh. Cells supplied under long-term offtake agreements to Tier-1 automotive integrators.",
    "annual_output_capacity": 2,
    "output_unit": "GWh"
  }
}
```

---

## 3. MARKET

The external commercial environment: demand, supply, trade flows, pricing, growth, and competitive landscape.

### Business Definition

| Field | Description |
|-------|-------------|
| **Global Market** | Worldwide market size and context for the product |
| **Country Market** | Market size and conditions in the project country |
| **Regional Market** | Market size and conditions in the project's region or trade bloc |
| **Demand** | Current and projected demand for the product |
| **Supply** | Current and projected supply capacity |
| **Imports** | Import volumes and dependency in target markets |
| **Exports** | Export opportunity and competitive positioning |
| **Average Selling Price** | Prevailing market price for the product |
| **Growth Rate** | Expected market growth (annual %) |
| **Competitors** | Key competitors and market participants |

### JSON Example

```json
{
  "market": {
    "global_market": {
      "size": 94000000000,
      "currency": "USD",
      "unit": "annual market value",
      "period": "2026",
      "notes": "Global EV battery cell market; excludes pack assembly."
    },
    "country_market": {
      "size": 4200000000,
      "currency": "EUR",
      "unit": "annual market value",
      "period": "2026",
      "country_code": "PL",
      "notes": "Poland domestic demand plus export-oriented production consumed locally."
    },
    "regional_market": {
      "size": 28000000000,
      "currency": "EUR",
      "unit": "annual market value",
      "period": "2026",
      "region": "European Union",
      "notes": "EU battery cell demand driven by OEM electrification mandates and IRA-equivalent local content rules."
    },
    "demand": {
      "current": 1.8,
      "projected_2030": 5.2,
      "unit": "GWh",
      "region": "EU Central Europe",
      "growth_drivers": [
        "EU Fit for 55 transport decarbonization targets",
        "OEM local content requirements under EU Battery Regulation",
        "Declining ICE production in Central European auto hubs"
      ]
    },
    "supply": {
      "current": 1.2,
      "projected_2030": 4.8,
      "unit": "GWh",
      "region": "EU Central Europe",
      "supply_gap": "Structural deficit through 2030; 60% of EU demand met by Asian imports."
    },
    "imports": {
      "volume": 3.1,
      "unit": "GWh",
      "origin_countries": ["CN", "KR", "JP"],
      "dependency_level": "high",
      "notes": "EU import dependency declining as local capacity ramps; geopolitical reshoring incentive strong."
    },
    "exports": {
      "volume_potential": 0.8,
      "unit": "GWh",
      "target_countries": ["DE", "CZ", "SK", "HU"],
      "competitive_position": "Cost-competitive vs Western EU; logistics advantage to German OEM plants."
    },
    "average_selling_price": {
      "amount": 82,
      "currency": "EUR",
      "unit": "per kWh",
      "period": "2026",
      "trend": "declining_3pct_annually"
    },
    "growth_rate": {
      "value": 22.4,
      "unit": "percent",
      "period": "2026-2030 CAGR",
      "basis": "EU EV battery cell demand forecast"
    },
    "competitors": [
      {
        "name": "Northvolt Ett",
        "country": "SE",
        "capacity_gwh": 16,
        "market_position": "European incumbent — premium segment",
        "threat_level": "medium"
      },
      {
        "name": "LG Energy Solution Wrocław",
        "country": "PL",
        "capacity_gwh": 70,
        "market_position": "Dominant regional producer — mass market",
        "threat_level": "high"
      },
      {
        "name": "CATL Debrecen (announced)",
        "country": "HU",
        "capacity_gwh": 100,
        "market_position": "Low-cost Asian entrant — price pressure",
        "threat_level": "high"
      }
    ]
  }
}
```

---

## 4. CUSTOMER

Who buys the output, where they are, how they decide, and what volume and price the project can expect.

### Business Definition

| Field | Description |
|-------|-------------|
| **Customer Type** | Classification of buyer (B2B, B2G, B2C, OEM, distributor, etc.) |
| **Target Countries** | Countries where customers are located or sales are targeted |
| **Target Industries** | Industries of end customers |
| **Buying Criteria** | Factors that drive purchase decisions |
| **Estimated Annual Demand** | Projected volume the project can sell annually |
| **Expected Selling Price** | Anticipated price achievable in target markets |

### JSON Example

```json
{
  "customer": {
    "customer_type": "B2B — OEM & Tier-1 Automotive Integrator",
    "target_countries": [
      { "code": "DE", "name": "Germany", "priority": "primary" },
      { "code": "PL", "name": "Poland", "priority": "primary" },
      { "code": "CZ", "name": "Czechia", "priority": "secondary" },
      { "code": "SK", "name": "Slovakia", "priority": "secondary" }
    ],
    "target_industries": [
      "Automotive OEM — passenger EV",
      "Commercial vehicle electrification",
      "Energy storage system integrators"
    ],
    "buying_criteria": [
      {
        "criterion": "Total cost of ownership (€/kWh over lifecycle)",
        "weight": "critical",
        "notes": "OEM sourcing committees benchmark against Asian suppliers on TCO."
      },
      {
        "criterion": "Local content / EU Battery Regulation compliance",
        "weight": "critical",
        "notes": "Carbon footprint declaration and due diligence mandatory from 2025."
      },
      {
        "criterion": "Cell energy density (Wh/kg)",
        "weight": "high",
        "notes": "Minimum 260 Wh/kg required for premium EV platforms."
      },
      {
        "criterion": "Supply security and dual-sourcing policy",
        "weight": "high",
        "notes": "OEMs require geographic diversification away from single-source Asia dependency."
      },
      {
        "criterion": "Scale-up reliability and yield rate",
        "weight": "medium",
        "notes": "First-pass yield >92% expected at commercial ramp."
      }
    ],
    "estimated_annual_demand": {
      "volume": 2.0,
      "unit": "GWh",
      "period": "Year 3 steady state",
      "basis": "Anchor offtake LOI (1.2 GWh) + spot market allocation (0.8 GWh)"
    },
    "expected_selling_price": {
      "amount": 79,
      "currency": "EUR",
      "unit": "per kWh",
      "basis": "5% discount to EU average ASP to win anchor OEM contract",
      "contract_term_years": 7
    }
  }
}
```

---

## 5. TECHNICAL

How the investment is physically or operationally realized: capacity, technology, inputs, site, equipment, and process.

### Business Definition

| Field | Description |
|-------|-------------|
| **Capacity** | Production or service delivery capacity |
| **Technology** | Core technology, process, or platform used |
| **Raw Materials** | Key inputs and sourcing considerations |
| **Utilities** | Power, water, gas, and infrastructure requirements |
| **Land** | Land area, location characteristics, and site readiness |
| **Machines** | Major equipment and machinery |
| **Production Process** | End-to-end process description |

### JSON Example

```json
{
  "technical": {
    "capacity": {
      "initial": 2,
      "expansion_potential": 8,
      "unit": "GWh per year",
      "ramp_up_months": 18,
      "utilization_target_pct": 85
    },
    "technology": {
      "name": "NMC 811 High-Nickel Cathode — Dry Electrode Process",
      "maturity": "proven_at_scale",
      "licensor": "Technology partnership under negotiation (Korean cell design IP)",
      "differentiation": "Dry electrode coating reduces energy consumption 15% vs conventional wet process.",
      "technology_readiness_level": 8
    },
    "raw_materials": [
      {
        "material": "Lithium carbonate / hydroxide",
        "requirement": "1,400 tons/year at full capacity",
        "sourcing": "Chile / Australia contract; 6-month inventory buffer",
        "risk": "medium — price volatility"
      },
      {
        "material": "Nickel sulfate",
        "requirement": "2,800 tons/year",
        "sourcing": "Indonesia / Finland; long-term supply MOU in progress",
        "risk": "medium — ESG scrutiny on mining origin"
      },
      {
        "material": "Cobalt",
        "requirement": "180 tons/year",
        "sourcing": "DRC-free supply chain required by anchor OEM",
        "risk": "high — compliance and cost"
      },
      {
        "material": "Copper foil, aluminum foil, separator, electrolyte",
        "requirement": "Various",
        "sourcing": "European and Asian suppliers; dual sourcing policy",
        "risk": "low"
      }
    ],
    "utilities": {
      "electricity": {
        "requirement_mwh_year": 145000,
        "source": "Grid + on-site 12 MW solar PPA",
        "cost_eur_mwh": 68,
        "notes": "High energy intensity; renewable PPA critical for EU Battery Regulation carbon footprint threshold."
      },
      "water": {
        "requirement_m3_day": 420,
        "source": "Municipal + closed-loop recycling (85% recovery)",
        "notes": "Dry electrode process reduces water demand vs wet coating."
      },
      "gas": {
        "requirement": "Minimal — HVAC and process heat only",
        "source": "Natural gas grid"
      },
      "logistics": {
        "highway_access": "A4 motorway — 8 km",
        "rail_access": "Freight rail terminal — 15 km",
        "port_access": "Port of Szczecin — 350 km"
      }
    },
    "land": {
      "area_hectares": 18,
      "location": "Wrocław Industrial Park — Phase 3 expansion zone",
      "ownership_status": "Lease option signed — 99-year industrial lease",
      "zoning": "Approved for heavy manufacturing",
      "environmental_status": "EIA scoping in progress; no protected habitat conflicts identified."
    },
    "machines": [
      {
        "name": "Electrode coating lines (dry process)",
        "quantity": 4,
        "origin": "JP / DE",
        "lead_time_months": 14
      },
      {
        "name": "Cell assembly lines (pouch format)",
        "quantity": 2,
        "origin": "KR",
        "lead_time_months": 16
      },
      {
        "name": "Formation and aging chambers",
        "quantity": 6,
        "origin": "CN / DE",
        "lead_time_months": 12
      },
      {
        "name": "Automated quality inspection (AI vision)",
        "quantity": 8,
        "origin": "DE",
        "lead_time_months": 10
      }
    ],
    "production_process": "Raw material receiving and qualification → Cathode and anode electrode coating (dry process) → Cell stacking and pouch sealing → Electrolyte filling → Formation cycling and aging → End-of-line testing (capacity, impedance, safety) → Packaging and shipment to OEM integration plant. Target first-pass yield: 92% at commercial ramp; 96% at steady state."
  }
}
```

---

## 6. FINANCIAL

The economic case: capital required, operating costs, revenue potential, and return indicators.

### Business Definition

| Field | Description |
|-------|-------------|
| **CAPEX** | Total capital expenditure to establish the investment |
| **OPEX** | Annual operating expenditure at steady state |
| **Revenue** | Projected annual revenue |
| **Operating Cost** | Direct and indirect costs of production or operation |
| **NPV** | Net present value of the investment |
| **IRR** | Internal rate of return |
| **Payback Period** | Time to recover initial investment |

### JSON Example

```json
{
  "financial": {
    "capex": {
      "total": 185000000,
      "currency": "EUR",
      "breakdown": {
        "land_and_civil": 12000000,
        "buildings": 28000000,
        "machinery_and_equipment": 118000000,
        "technology_licensing": 8000000,
        "working_capital": 14000000,
        "contingency": 5000000
      },
      "funding_structure": {
        "equity_pct": 35,
        "debt_pct": 55,
        "grants_and_incentives_pct": 10
      }
    },
    "opex": {
      "total_annual": 142000000,
      "currency": "EUR",
      "period": "Year 3 steady state",
      "breakdown": {
        "raw_materials": 98000000,
        "labor": 18000000,
        "utilities": 9600000,
        "maintenance": 7200000,
        "overhead_and_admin": 3500000,
        "logistics": 5800000
      }
    },
    "revenue": {
      "total_annual": 158000000,
      "currency": "EUR",
      "period": "Year 3 steady state",
      "volume_gwh": 2.0,
      "average_price_eur_kwh": 79,
      "notes": "Revenue assumes 85% utilization on 2 GWh nameplate capacity."
    },
    "operating_cost": {
      "total_annual": 142000000,
      "currency": "EUR",
      "cost_per_kwh": 71,
      "gross_margin_pct": 10.1,
      "notes": "Thin margin at Year 3; margin expansion expected to 18% by Year 5 on scale and yield improvement."
    },
    "npv": {
      "value": 22400000,
      "currency": "EUR",
      "discount_rate_pct": 9,
      "horizon_years": 15,
      "notes": "Positive NPV driven by EU grants (€18.5M) and anchor offtake premium."
    },
    "irr": {
      "value": 13.6,
      "unit": "percent",
      "basis": "Project equity IRR after tax",
      "hurdle_rate_pct": 12,
      "vs_hurdle": "above"
    },
    "payback_period": {
      "value": 8.4,
      "unit": "years",
      "basis": "Simple payback on equity investment",
      "discounted_payback_years": 10.2
    }
  }
}
```

---

## 7. ASSUMPTIONS

Explicit statements that underpin market, customer, technical, and financial intelligence. Assumptions are first-class objects—not footnotes. Every assumption must be auditable.

### Required Fields

| Field | Description |
|-------|-------------|
| **value** | The assumed numeric or textual value |
| **unit** | Unit of measure (percent, EUR/kWh, GWh, months, etc.) |
| **source** | Reference to a source ID or origin of the assumption |
| **confidence** | Reliability grade: `unverified`, `low`, `medium`, `high`, `verified` |
| **last_updated** | ISO 8601 timestamp of last review or change |
| **notes** | Context, rationale, or sensitivity commentary |

### JSON Example

```json
{
  "assumptions": [
    {
      "assumption_id": "asm-001",
      "name": "Anchor OEM offtake agreement executed",
      "category": "commercial",
      "value": 1,
      "unit": "boolean (1 = yes)",
      "source": "src-loi-001",
      "confidence": "medium",
      "last_updated": "2026-08-12T11:00:00Z",
      "notes": "Letter of Intent signed with German OEM for 1.2 GWh/year. Binding contract targeted Q4 2026. Financial model treats LOI as conditional — revenue at 60% probability until contract execution."
    },
    {
      "assumption_id": "asm-002",
      "name": "Average selling price — Year 3",
      "category": "financial",
      "value": 79,
      "unit": "EUR per kWh",
      "source": "src-ai-pricing-001",
      "confidence": "medium",
      "last_updated": "2026-08-12T13:15:00Z",
      "notes": "5% below EU ASP benchmark to secure anchor contract. Sensitivity: every €3/kWh reduction erodes IRR by ~1.8 percentage points."
    },
    {
      "assumption_id": "asm-003",
      "name": "Plant utilization rate at steady state",
      "category": "technical",
      "value": 85,
      "unit": "percent",
      "source": "src-tech-ramp-001",
      "confidence": "low",
      "last_updated": "2026-08-12T10:45:00Z",
      "notes": "Industry benchmark for new European cell plants is 75–90% in Year 3. Ramp-up from 45% (Year 1) to 85% (Year 3) assumed over 24 months."
    },
    {
      "assumption_id": "asm-004",
      "name": "EU Battery Regulation local content compliance",
      "category": "regulatory",
      "value": 1,
      "unit": "boolean (1 = compliant)",
      "source": "src-reg-001",
      "confidence": "high",
      "last_updated": "2026-08-12T09:30:00Z",
      "notes": "Project site and supply chain designed for EU origin thresholds. Carbon footprint declaration target: <50 kg CO₂/kWh by 2027."
    },
    {
      "assumption_id": "asm-005",
      "name": "Government grant approval",
      "category": "financial",
      "value": 18500000,
      "unit": "EUR",
      "source": "src-grant-app-001",
      "confidence": "medium",
      "last_updated": "2026-08-12T12:00:00Z",
      "notes": "Application submitted under Polish FDI incentive program. Approval timeline 6–9 months. Model includes grant; downside scenario excludes it."
    },
    {
      "assumption_id": "asm-006",
      "name": "Market growth rate — EU battery cells",
      "category": "market",
      "value": 22.4,
      "unit": "percent CAGR",
      "source": "src-ref-bloomberg-001",
      "confidence": "medium",
      "last_updated": "2026-08-12T08:00:00Z",
      "notes": "2026–2030 CAGR per industry forecast. Downside scenario uses 14% CAGR (delayed OEM electrification timelines)."
    }
  ]
}
```

---

## 8. RISKS

Identified threats to project success, with probability, impact, and mitigation strategy.

### Business Definition

| Field | Description |
|-------|-------------|
| **Risk Name** | Short identifier for the risk |
| **Probability** | Likelihood of occurrence: `low`, `medium`, `high` |
| **Impact** | Severity if realized: `low`, `medium`, `high`, `critical` |
| **Mitigation** | Actions to reduce probability or impact |

### JSON Example

```json
{
  "risks": [
    {
      "risk_id": "risk-001",
      "risk_name": "Anchor offtake contract not finalized",
      "category": "commercial",
      "probability": "medium",
      "impact": "critical",
      "mitigation": "Condition precedent on binding PPA before equity drawdown. Parallel discussions with secondary OEM. Reduce Phase 1 capacity to 1 GWh if LOI expires.",
      "status": "open",
      "related_assumptions": ["asm-001"]
    },
    {
      "risk_id": "risk-002",
      "risk_name": "Asian price undercutting (CATL, BYD expansion in EU)",
      "category": "market",
      "probability": "high",
      "impact": "high",
      "mitigation": "Compete on local content compliance, carbon footprint, and logistics cost—not unit cost alone. Pursue EU trade defense instruments if dumping confirmed.",
      "status": "monitoring",
      "related_assumptions": ["asm-002", "asm-006"]
    },
    {
      "risk_id": "risk-003",
      "risk_name": "Critical raw material supply disruption (lithium, cobalt)",
      "category": "supply_chain",
      "probability": "medium",
      "impact": "high",
      "mitigation": "Dual sourcing contracts with 6-month buffer inventory. Cobalt reduction roadmap to <5% cathode content by Year 4.",
      "status": "mitigating",
      "related_assumptions": []
    },
    {
      "risk_id": "risk-004",
      "risk_name": "Technology ramp yield below 90%",
      "category": "technical",
      "probability": "medium",
      "impact": "medium",
      "mitigation": "Experienced Korean technology partner for line commissioning. Parallel pilot line (100 MWh) before commercial ramp.",
      "status": "mitigating",
      "related_assumptions": ["asm-003"]
    },
    {
      "risk_id": "risk-005",
      "risk_name": "Government grant rejection or delay",
      "category": "financial",
      "probability": "low",
      "impact": "medium",
      "mitigation": "Financial model viable without grant (IRR 11.2%). Alternative: EIB project finance facility.",
      "status": "open",
      "related_assumptions": ["asm-005"]
    }
  ]
}
```

---

## 9. SOURCES

Registry of all intelligence origins referenced across the project. Every assumption, market figure, and score traces back to a source.

### Business Definition

| Field | Description |
|-------|-------------|
| **Source Name** | Descriptive name of the source |
| **Organization** | Publishing or providing organization |
| **URL** | Link to document, database, or reference (nullable for internal sources) |
| **Reliability Score** | Curated trust score (0–100) |
| **Update Frequency** | How often the source is refreshed or re-verified |

### JSON Example

```json
{
  "sources": [
    {
      "source_id": "src-loi-001",
      "source_name": "Anchor OEM Letter of Intent — Offtake 1.2 GWh",
      "organization": "Confidential — German Automotive OEM",
      "url": null,
      "reliability_score": 75,
      "update_frequency": "event_driven",
      "source_type": "commercial_document",
      "last_verified": "2026-08-01"
    },
    {
      "source_id": "src-ref-bloomberg-001",
      "source_name": "BloombergNEF — Global Battery Demand Outlook 2026",
      "organization": "BloombergNEF",
      "url": "https://about.bnef.com/battery-market-outlook/",
      "reliability_score": 92,
      "update_frequency": "annual",
      "source_type": "industry_research",
      "last_verified": "2026-08-12"
    },
    {
      "source_id": "src-reg-001",
      "source_name": "EU Battery Regulation (EU 2023/1542) — Compliance Framework",
      "organization": "European Commission",
      "url": "https://eur-lex.europa.eu/eli/reg/2023/1542",
      "reliability_score": 98,
      "update_frequency": "regulatory_amendment",
      "source_type": "regulation",
      "last_verified": "2026-07-15"
    },
    {
      "source_id": "src-grant-app-001",
      "source_name": "Polish FDI Incentive Application — Submission Package",
      "organization": "Polish Investment and Trade Agency (PAIH)",
      "url": null,
      "reliability_score": 70,
      "update_frequency": "event_driven",
      "source_type": "government_application",
      "last_verified": "2026-07-20"
    },
    {
      "source_id": "src-ai-pricing-001",
      "source_name": "Invest Smarter AI — Pricing & Margin Analysis",
      "organization": "Invest Smarter Platform",
      "url": null,
      "reliability_score": 65,
      "update_frequency": "per_analysis_run",
      "source_type": "ai_inference",
      "last_verified": "2026-08-12"
    },
    {
      "source_id": "src-user-intake-001",
      "source_name": "Project Sponsor Intake Form — Initial Submission",
      "organization": "Baltic Power Cells Sp. z o.o.",
      "url": null,
      "reliability_score": 80,
      "update_frequency": "event_driven",
      "source_type": "user_input",
      "last_verified": "2026-07-28"
    }
  ]
}
```

---

## 10. SCORES

Quantified intelligence signals that synthesize domain analysis into decision-ready metrics.

### Business Definition

| Field | Description |
|-------|-------------|
| **Market Score** | Attractiveness of market opportunity (0–100) |
| **Technical Score** | Feasibility and readiness of technical execution (0–100) |
| **Financial Score** | Strength of economic case and returns (0–100) |
| **Risk Score** | Aggregate risk posture—inverted so higher is better (0–100) |
| **Overall Investment Score** | Weighted composite across all dimensions (0–100) |
| **Confidence Score** | Meta-score reflecting data quality and assumption validation (0–100) |

### JSON Example

```json
{
  "scores": {
    "market_score": {
      "value": 78,
      "grade": "B+",
      "rationale": "Strong EU demand growth and supply deficit. High competitive intensity from Asian incumbents caps score.",
      "key_drivers": ["22.4% CAGR", "EU reshoring incentives", "Import dependency reduction"]
    },
    "technical_score": {
      "value": 71,
      "grade": "B",
      "rationale": "Proven technology at scale; dry electrode differentiation. Yield ramp and cobalt supply chain are execution risks.",
      "key_drivers": ["TRL 8", "Site secured", "Technology partner pipeline"]
    },
    "financial_score": {
      "value": 64,
      "grade": "C+",
      "rationale": "IRR above hurdle (13.6% vs 12%) but thin Year 3 margins. Grant dependency in base case.",
      "key_drivers": ["Positive NPV", "8.4-year payback", "Grant contribution 10%"]
    },
    "risk_score": {
      "value": 58,
      "grade": "C",
      "rationale": "Two high-impact open risks (offtake, price competition). Mitigations defined but not yet validated.",
      "key_drivers": ["1 critical open risk", "3 mitigating", "Supply chain exposure"]
    },
    "overall_investment_score": {
      "value": 69,
      "grade": "C+",
      "methodology": "Weighted composite: Market 30%, Financial 30%, Technical 25%, Risk 15%",
      "recommendation": "proceed_with_conditions",
      "conditions": [
        "Execute binding offtake agreement before financial close",
        "Confirm government grant approval or substitute EIB facility",
        "Complete EIA and secure environmental permit"
      ]
    },
    "confidence_score": {
      "value": 62,
      "grade": "C+",
      "rationale": "3 of 6 assumptions at medium confidence or below. Anchor offtake and grant remain unverified.",
      "assumption_validation": {
        "total": 6,
        "verified": 1,
        "high": 1,
        "medium": 3,
        "low": 1,
        "unverified": 0
      },
      "source_quality": {
        "average_reliability": 80,
        "ai_derived_pct": 17,
        "primary_document_pct": 50
      }
    },
    "scored_at": "2026-08-12T16:45:00Z",
    "scored_by": "invest-smarter-intelligence-engine-v1"
  }
}
```

---

## How the Objects Connect

The ten business objects form a **directed intelligence graph**. Data flows from identity and inputs through analysis to scores and decisions. Nothing exists in isolation—every score is explainable, every assumption is traceable, every risk is linked.

### Connection Map

```
                         ┌─────────────┐
                         │   SOURCES   │◄──────────────────────────────┐
                         └──────┬──────┘                               │
                                │ referenced by                         │
              ┌─────────────────┼─────────────────┐                    │
              ▼                 ▼                 ▼                    │
       ┌────────────┐    ┌────────────┐    ┌────────────┐              │
       │ ASSUMPTIONS│    │   MARKET   │    │  CUSTOMER  │              │
       └─────┬──────┘    └─────┬──────┘    └─────┬──────┘              │
             │                 │                 │                    │
             │    ┌────────────┴────────┬────────┘                    │
             │    ▼                     ▼                             │
             │ ┌──────────┐      ┌──────────┐                        │
             └►│ FINANCIAL│◄─────│ TECHNICAL│                        │
               └────┬─────┘      └────┬─────┘                        │
                    │                 │                              │
                    └────────┬────────┘                              │
                             ▼                                       │
                      ┌────────────┐                                 │
                      │   RISKS    │─────────────────────────────────┘
                      └─────┬──────┘
                            │
                            ▼
                      ┌────────────┐
                      │   SCORES   │──────► Investment Decision
                      └────────────┘

        ┌──────────┐         ┌──────────┐
        │ PROJECT  │────────►│ PRODUCT  │
        └──────────┘ anchors └──────────┘
              │
              └──► All objects inherit project context (ID, sector, geography)
```

### Relationship Rules

**PROJECT → PRODUCT**  
The project references exactly one primary product (`product_ref`). The product defines *what* is being invested in; the project defines *where, how much, and at what stage*.

**PROJECT → All Objects**  
Every object inherits project context: `project_id`, sector, country, region, city. This enables cross-project comparison, portfolio analytics, and regional intelligence dashboards.

**SOURCES → ASSUMPTIONS, MARKET, FINANCIAL, CUSTOMER, SCORES**  
Sources are the provenance layer. Every assumption cites a source. Market figures, financial inputs, and AI-generated intelligence all trace to registered sources. The **Confidence Score** is directly computed from assumption validation status and source reliability.

**ASSUMPTIONS → FINANCIAL, MARKET, TECHNICAL, SCORES**  
Assumptions are the explicit bridge between belief and calculation. Financial projections depend on pricing and utilization assumptions. Market sizing depends on growth assumptions. When an assumption is invalidated, downstream scores must be recalculated.

**ASSUMPTIONS ↔ RISKS**  
Risks link to assumptions via `related_assumptions`. If assumption `asm-001` (anchor offtake) fails, risk `risk-001` materializes—triggering score revision and potential decision change.

**MARKET + CUSTOMER → FINANCIAL**  
Market intelligence (demand, ASP, growth) and customer intelligence (volume, price, contract terms) feed directly into revenue and margin calculations in the financial object.

**TECHNICAL → FINANCIAL**  
Capacity, raw material costs, utilities, and machine lead times drive CAPEX breakdown and OPEX structure. Technical feasibility constrains what financial projections are credible.

**MARKET + TECHNICAL + FINANCIAL + RISKS → SCORES**  
Scores are derived syntheses—not primary inputs:

| Score | Primary Inputs |
|-------|----------------|
| Market Score | Market object (size, growth, competition, trade flows) |
| Technical Score | Technical object (capacity, technology maturity, process readiness) |
| Financial Score | Financial object (IRR, NPV, payback, margins) |
| Risk Score | Risks object (probability × impact, mitigation status) |
| Overall Investment Score | Weighted composite of the four domain scores |
| Confidence Score | Assumptions validation + source reliability + data completeness |

**SCORES → Investment Decision**  
The Overall Investment Score and Confidence Score together produce a recommendation (`proceed`, `proceed_with_conditions`, `defer`, `do_not_pursue`). Low confidence with high score triggers caution; high confidence with low score triggers decline.

### Intelligence Lifecycle

```
1. INTAKE       Project + Product defined; sources registered
2. ENRICH       Market, Customer, Technical populated (AI + human + external data)
3. MODEL        Financial projections built on assumptions
4. CHALLENGE    Risks identified; assumptions validated or flagged
5. SCORE        Intelligence engine computes domain and composite scores
6. DECIDE       Recommendation issued with conditions and confidence grade
7. MONITOR      Assumption drift, source updates, and market changes trigger re-scoring
```

This lifecycle mirrors how Bloomberg surfaces market data, PitchBook structures deal intelligence, and McKinsey Digital frames decision recommendations—unified in a single, sector-independent project model.

---

## Sector Independence

The model supports every investment sector without structural change:

| Mechanism | How It Works |
|-----------|--------------|
| **Open sector taxonomy** | `project.sector.code` uses dot-notation (`manufacturing.automotive.battery`, `real_estate.hospitality`, `agriculture.processing`) |
| **Flexible units** | Product unit, capacity unit, and demand unit adapt to any sector (GWh, rooms, hectares, licenses) |
| **Nullable trade fields** | HS Code, imports, exports nullable for non-tradable investments (real estate, services, digital) |
| **Entity-free structure** | Competitors, raw materials, machines, and buying criteria are arrays—content varies, structure does not |
| **Assumption registry** | Sector-specific variables captured as named assumptions with units—not hardcoded fields |

Adding a new sector requires new **data**, not new **schema**.

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Aug 2026 | Initial TrackedField architecture |
| 2.0 | Aug 2026 | Rewritten as business-oriented Investment Intelligence model |

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [PRD.md](./PRD.md) | Product vision and customer segments |
| [BUSINESS_RULES.md](./BUSINESS_RULES.md) | Scoring weights and decision gates |
| [DATA_DICTIONARY.md](./DATA_DICTIONARY.md) | Field-level reference (legacy) |
