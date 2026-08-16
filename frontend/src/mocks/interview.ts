import type {
  BuyerType,
  CapexRange,
  DecisionNeeded,
  DemandCertainty,
  DevelopmentStage,
  EvaluationContext,
  LocationSpecificity,
  OpportunityType,
  SectorOption,
  SelectOption,
  SiteControl,
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

export const CAPEX_RANGE_BASE: SelectOption<CapexRange>[] = [
  { value: "lt_5m", label: "Under 5 million" },
  { value: "5_25m", label: "5–25 million" },
  { value: "25_100m", label: "25–100 million" },
  { value: "100_500m", label: "100–500 million" },
  { value: "gt_500m", label: "Over 500 million" },
  { value: "not_sure", label: "Not sure yet" },
];

/** Always-visible currencies on Q7. Country ISO 4217 is added if different. */
export const PRIMARY_CURRENCIES = ["USD", "EUR"] as const;

/** Opened by Q7 “Other”. Filtered against the three visible codes, then capped at 10. */
export const OTHER_CURRENCY_POOL = [
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
  "AED",
  "SAR",
  "SGD",
  "INR",
  "PLN",
  "TRY",
  "MXN",
  "ZAR",
  "KRW",
] as const;

export function visibleCurrencies(countryCurrency: string | null): string[] {
  const codes = new Set<string>(PRIMARY_CURRENCIES);
  if (countryCurrency) codes.add(countryCurrency);
  return [...codes].slice(0, 3);
}

export function otherCurrencies(visible: string[]): string[] {
  return OTHER_CURRENCY_POOL.filter((code) => !visible.includes(code)).slice(
    0,
    10
  );
}

export function capexRangeOptions(
  currency: string
): SelectOption<CapexRange>[] {
  return CAPEX_RANGE_BASE.map((option) =>
    option.value === "not_sure"
      ? option
      : { ...option, label: `${option.label} ${currency}` }
  );
}

export const EVALUATION_CONTEXT_OPTIONS: SelectOption<EvaluationContext>[] = [
  {
    value: "consultant_client",
    label: "Consultant advising a client",
    helper: "Client-presentable pre-feasibility",
  },
  {
    value: "ipa_inbound",
    label: "IPA screening an investor",
    helper: "Inbound inquiry / promotion response",
  },
  {
    value: "sponsor_own",
    label: "Sponsor evaluating our own project",
    helper: "Internal go / no-go",
  },
  {
    value: "bank_screen",
    label: "Bank or lender — early screen",
    helper: "Credit / mandate filter, not full model",
  },
  {
    value: "zone_developer",
    label: "Zone or park developer",
    helper: "Tenant / land allocation fit",
  },
  {
    value: "public_agency",
    label: "Public agency / development institution",
    helper: "Mandate or program fit",
  },
];

export const BUYER_TYPE_OPTIONS: SelectOption<BuyerType>[] = [
  {
    value: "b2b_contract",
    label: "B2B — contracted (PPA, offtake, offtake LOI)",
  },
  { value: "b2b_spot", label: "B2B — open / spot market" },
  { value: "b2c", label: "B2C / retail demand" },
  { value: "b2g", label: "Government or public procurement" },
  { value: "mixed", label: "Mixed channels" },
  { value: "unknown", label: "Not defined yet" },
];

export const DEMAND_CERTAINTY_OPTIONS: SelectOption<DemandCertainty>[] = [
  {
    value: "binding",
    label: "Binding contract or PPA",
    helper: "Signed, enforceable",
  },
  {
    value: "loi",
    label: "LOI / term sheet / MOU",
    helper: "Non-binding but named counterparties",
  },
  {
    value: "advanced",
    label: "Advanced discussions",
    helper: "Named buyers, no paper",
  },
  {
    value: "hypothesis",
    label: "Demand hypothesis only",
    helper: "No named buyer",
  },
  {
    value: "not_applicable",
    label: "Not applicable",
    helper: "Merchant or retail with no offtake",
  },
];

export const SITE_CONTROL_OPTIONS: SelectOption<SiteControl>[] = [
  {
    value: "secured",
    label: "Site secured or owned",
    helper: "Control is in place",
  },
  {
    value: "option",
    label: "Option or exclusive right",
    helper: "Not fully secured",
  },
  {
    value: "searching",
    label: "Still searching / not selected",
    helper: "Location is open",
  },
  {
    value: "not_needed",
    label: "Site not required",
    helper: "Digital, mobile, or asset-light",
  },
];

export const DECISION_NEEDED_OPTIONS: SelectOption<DecisionNeeded>[] = [
  {
    value: "go_nogo",
    label: "Go / no-go",
    helper: "Whether to spend further time",
  },
  {
    value: "client_response",
    label: "Client or inbound response",
    helper: "What to tell them now",
  },
  {
    value: "mandate_screen",
    label: "Screen before committing a team",
    helper: "Whether to staff a study",
  },
  {
    value: "compare",
    label: "Compare options",
    helper: "Absolute posture; ranking is out of scope",
  },
  {
    value: "financing_read",
    label: "Financing readiness",
    helper: "Not a bankable model",
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
  q7: {
    title: "Investment scale",
    message:
      "What is the approximate total capital requirement? A range is enough; I will not treat it as a point estimate.",
    currencyLabel: "Currency",
    otherLabel: "Other",
    notSureConfirm:
      "Scale recorded as unknown. The financial module will run with lower confidence.",
  },
  q8: {
    title: "Who is evaluating this",
    message:
      "Who is this evaluation for? That sets the mandate test and the tone of the recommendation.",
  },
  q9: {
    title: "Who buys the output",
    message:
      "Who is expected to buy the output? Demand path drives both market scoring and revenue logic.",
    unknownConfirm:
      "Buyer type recorded as undefined. Demand path will be scored as incomplete.",
  },
  q10: {
    title: "Demand certainty",
    message:
      "How firm is demand today? This fact can change proceed versus defer.",
    hypothesisConfirm:
      "Demand recorded as a hypothesis. Unconditional proceed will not be available on this basis.",
    buyerUndefinedWarning:
      "Buyer type is still undefined. Continue, or go back.",
  },
  q11: {
    title: "Site / location control",
    message:
      "Do you control a site, or is location still open? Uncontrolled sites are a common cause of delay on greenfield files.",
    assetLightMessage:
      "Where will this operate from? Site not required is acceptable for a digital or mobile service.",
    searchingConfirm:
      "Site recorded as not selected. For a greenfield or zone file this will usually become a condition.",
  },
  q12: {
    title: "Decision needed",
    message:
      "What decision should this assessment support? I will frame the recommendation around that question, not a generic report.",
    stallHelper:
      "If you need a first yes or no, choose Go / no-go. If you are deciding whether to staff work, choose Screen before committing a team.",
  },
  review: {
    title: "Review your answers",
    message:
      "Confirm these facts before I recommend. You can open any row to change it. I will not invent missing answers.",
    incompleteError:
      "Some answers are incomplete. Open a row to fix them.",
    nextLabel: "See recommendation",
  },
  decision: {
    editLabel: "Edit answers",
    policyLabel: "Intake policy v0.1",
    status: "Intake screen · 12 of 12 questions · Recommendation, not accepted",
    statusAccepted:
      "Intake screen · 12 of 12 questions · Recommendation accepted",
    statusAmended:
      "Intake screen · 12 of 12 questions · Recommendation amended",
    statusRejected:
      "Intake screen · 12 of 12 questions · Recommendation rejected",
    publicationHeld: "Publication held for review",
    confidenceSuffix: "evidence quality",
    bankDisclaimer: "This is not a credit approval.",
    disclaimer:
      "This is an intake screen, not a feasibility study, not investment advice, not a bankable model, and not legal or technical due diligence. Rules produced this recommendation. A named person has not accepted it.",
    disclaimerRecorded:
      "This is an intake screen, not a feasibility study, not investment advice, not a bankable model, and not legal or technical due diligence. Rules produced this recommendation.",
    defect:
      "Recommendation could not be produced. Return to Review.",
    nextCommission:
      "Do not commission a feasibility study on this recommendation.",
    snapshotNote: "Recommendation snapshot created for this review.",
    evaluator: {
      sectionLabel: "Evaluator decision",
      helper:
        "Record how the evaluator treats this recommendation. This does not change the rules output.",
      accept: "Accept recommendation",
      amend: "Amend recommendation",
      reject: "Reject recommendation",
      accepted:
        "The evaluator accepted this recommendation as written.",
      amended:
        "The evaluator amended this recommendation. The rules output remains unchanged.",
      rejected:
        "The evaluator rejected this recommendation. The rules output remains unchanged.",
      nameLabel: "Evaluator name",
      nameHelper:
        "Use the person or desk responsible for this recommendation.",
      namePlaceholder: "e.g. Investment Desk",
      reasonLabel: "Reason",
      reasonHelper:
        "Record the evaluator’s reason if the recommendation is amended or rejected.",
      recordedByPrefix: "Recorded by",
      reasonPrefix: "Reason:",
      amendReasonError:
        "Add a reason before marking this recommendation as amended.",
      rejectReasonError:
        "Add a reason before marking this recommendation as rejected.",
    },
  },
} as const;

export const MINUTES_LEFT_BY_STEP = {
  q1: 8,
  q2: 7,
  q3: 6,
  q4: 5,
  q5: 4,
  q6: 3,
  q7: 3,
  q8: 2,
  q9: 2,
  q10: 2,
  q11: 1,
  q12: 1,
} as const;
