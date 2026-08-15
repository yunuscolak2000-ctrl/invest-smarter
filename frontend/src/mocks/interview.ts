import type {
  DevelopmentStage,
  LocationSpecificity,
  OpportunityType,
  SectorOption,
  SelectOption,
} from "../types/interview";

export const OPPORTUNITY_TYPE_OPTIONS: SelectOption<OpportunityType>[] = [
  {
    value: "greenfield",
    label: "New greenfield project",
    helper: "Build or establish from scratch",
  },
  {
    value: "expansion",
    label: "Expansion of an existing operation",
    helper: "Add capacity, product line, or site",
  },
  {
    value: "brownfield",
    label: "Acquisition or brownfield",
    helper: "Buy or convert an existing asset",
  },
  {
    value: "zone",
    label: "Zone, park, or land platform",
    helper: "Industrial zone, campus, or land development",
  },
  {
    value: "asset_light",
    label: "Service, digital, or asset-light",
    helper: "Limited physical plant",
  },
  {
    value: "other",
    label: "Other",
    helper: "We’ll treat this as a standard project screen",
  },
];

export const PINNED_SECTORS: SectorOption[] = [
  { code: "energy", label: "Energy" },
  { code: "manufacturing", label: "Manufacturing" },
  { code: "logistics", label: "Logistics" },
  { code: "agriculture", label: "Agriculture & food" },
  { code: "tourism", label: "Tourism & hospitality" },
  { code: "real_estate", label: "Real estate" },
  { code: "healthcare", label: "Healthcare" },
  { code: "technology", label: "Technology" },
  { code: "infrastructure", label: "Infrastructure" },
  { code: "other", label: "Other" },
];

/** Open taxonomy — user picks a label; system stores code + label. */
export const SECTOR_TAXONOMY: SectorOption[] = [
  { code: "energy", label: "Energy" },
  { code: "energy.renewable", label: "Energy — Renewable", parent: "energy" },
  {
    code: "energy.renewable.solar",
    label: "Energy — Solar",
    parent: "energy.renewable",
  },
  {
    code: "energy.renewable.wind",
    label: "Energy — Wind",
    parent: "energy.renewable",
  },
  { code: "energy.storage", label: "Energy — Storage", parent: "energy" },
  { code: "energy.oil_gas", label: "Energy — Oil & gas", parent: "energy" },
  { code: "manufacturing", label: "Manufacturing" },
  {
    code: "manufacturing.automotive",
    label: "Manufacturing — Automotive",
    parent: "manufacturing",
  },
  {
    code: "manufacturing.automotive.battery",
    label: "Manufacturing — Battery cells",
    parent: "manufacturing.automotive",
  },
  {
    code: "manufacturing.food",
    label: "Manufacturing — Food processing",
    parent: "manufacturing",
  },
  {
    code: "manufacturing.textiles",
    label: "Manufacturing — Textiles",
    parent: "manufacturing",
  },
  {
    code: "manufacturing.chemicals",
    label: "Manufacturing — Chemicals",
    parent: "manufacturing",
  },
  { code: "logistics", label: "Logistics" },
  {
    code: "logistics.warehousing",
    label: "Logistics — Warehouse / 3PL",
    parent: "logistics",
  },
  {
    code: "logistics.cold_storage",
    label: "Logistics — Cold storage",
    parent: "logistics",
  },
  {
    code: "logistics.port",
    label: "Logistics — Port / terminal",
    parent: "logistics",
  },
  { code: "agriculture", label: "Agriculture & food" },
  {
    code: "agriculture.processing",
    label: "Agriculture — Processing",
    parent: "agriculture",
  },
  { code: "tourism", label: "Tourism & hospitality" },
  { code: "tourism.hotel", label: "Tourism — Hotel", parent: "tourism" },
  { code: "tourism.resort", label: "Tourism — Resort", parent: "tourism" },
  { code: "real_estate", label: "Real estate" },
  {
    code: "real_estate.industrial",
    label: "Real estate — Industrial",
    parent: "real_estate",
  },
  {
    code: "real_estate.hospitality",
    label: "Real estate — Hospitality",
    parent: "real_estate",
  },
  { code: "healthcare", label: "Healthcare" },
  {
    code: "healthcare.hospital",
    label: "Healthcare — Hospital",
    parent: "healthcare",
  },
  {
    code: "healthcare.pharma",
    label: "Healthcare — Pharma",
    parent: "healthcare",
  },
  { code: "technology", label: "Technology" },
  {
    code: "technology.software",
    label: "Technology — Software / digital",
    parent: "technology",
  },
  {
    code: "technology.data_center",
    label: "Technology — Data center",
    parent: "technology",
  },
  { code: "infrastructure", label: "Infrastructure" },
  {
    code: "infrastructure.transport",
    label: "Infrastructure — Transport",
    parent: "infrastructure",
  },
  {
    code: "infrastructure.water",
    label: "Infrastructure — Water",
    parent: "infrastructure",
  },
  { code: "other", label: "Other" },
];

export const PRODUCT_CHIPS_BY_ROOT: Record<string, string[]> = {
  energy: ["Solar PV", "Wind", "Battery storage", "C&I power"],
  manufacturing: [
    "Automotive components",
    "Food processing",
    "Textiles",
    "Chemicals",
  ],
  logistics: ["Cold storage", "Warehouse / 3PL", "Port / terminal"],
  tourism: ["Hotel", "Resort", "Mixed-use hospitality"],
};

export const LOCATION_SPECIFICITY_OPTIONS: SelectOption<LocationSpecificity>[] =
  [
    { value: "city_known", label: "City or site area is known" },
    { value: "region_known", label: "Region / province only" },
    {
      value: "country_only",
      label: "Country only — location not decided",
    },
  ];

export const DEVELOPMENT_STAGE_OPTIONS: SelectOption<DevelopmentStage>[] = [
  {
    value: "concept",
    label: "Concept / idea",
    helper: "No formal studies yet",
  },
  {
    value: "pre_feasibility",
    label: "Pre-feasibility",
    helper: "Screening; limited studies",
  },
  {
    value: "feasibility",
    label: "Feasibility / permitting",
    helper: "Studies or permits in progress",
  },
  {
    value: "ready_to_finance",
    label: "Ready for financing",
    helper: "Seeking capital or credit",
  },
  {
    value: "construction",
    label: "Construction or commissioning",
    helper: "Capex being spent",
  },
  {
    value: "operating",
    label: "Operating — expansion or review",
    helper: "Asset exists",
  },
];

export const OPPORTUNITY_TYPE_ACK: Record<OpportunityType, string> = {
  greenfield: "greenfield project",
  expansion: "expansion of an existing operation",
  brownfield: "acquisition or brownfield",
  zone: "zone, park, or land platform",
  asset_light: "service or asset-light opportunity",
  other: "opportunity",
};

export const WIZARD_COPY = {
  framing: {
    title: "Before we start",
    message:
      "I’ll walk you through a short structured interview — twelve questions, about eight minutes. You’ll review everything before any analysis runs. Answer with what you know; ‘not sure yet’ is acceptable on most questions.",
  },
  q1: {
    title: "Type of opportunity",
    message:
      "First, I need the shape of this opportunity. That tells me which commercial and site questions matter.",
  },
  q2: {
    title: "Sector",
    message:
      "Which sector should I evaluate this in? I’ll use this to load the right market and regulatory context.",
  },
  q3: {
    title: "What it produces",
    message:
      "In one line, what will this investment produce or deliver? I’ll use this as the product definition — not a business plan.",
  },
  q4: {
    title: "Country",
    message:
      "Where is the investment located? Country is required for market and regulatory analysis.",
    helper:
      "If this is a multi-country platform, pick the primary country. You can note others on Review.",
    restrictedWarning:
      "This geography requires admin review before a report can be published.",
    restrictedAck: "I understand analysis may be held for review.",
  },
  q5: {
    title: "Location detail",
    cityLabel: "City or site area",
    regionLabel: "Region or province",
    cityPlaceholder: "e.g. Gaziantep",
    regionPlaceholder: "e.g. Lower Silesia",
  },
  q6: {
    title: "Development stage",
    message:
      "Where is this in the development cycle? Stage changes how hard I should treat missing offtake, permits, and site control.",
  },
} as const;

export const MINUTES_LEFT_BY_STEP = {
  q1: 8,
  q2: 7,
  q3: 6,
  q4: 5,
  q5: 4,
  q6: 3,
} as const;
